import { getServerClient } from './serverClient.js';
import { createAgent } from './agents/CreateAgent.js';
import { AgentPlatform } from './agents/types.js';

// Map to store AI Agent instances: [userId] -> AIAgent
const aiAgentCache = new Map();
const pendingAiAgents = new Set();

// Inactivity threshold: 8 hours (in milliseconds)
const inactivityThreshold = 480 * 60 * 1000;

// Periodically check for inactive agents and dispose of them (every 5 seconds)
setInterval(async () => {
  const now = Date.now();
  for (const [userId, aiAgent] of aiAgentCache) {
    if (now - aiAgent.getLastInteraction() > inactivityThreshold) {
      console.log(`[StreamChat] Disposing AI Agent due to inactivity: ${userId}`);
      await disposeAiAgent(aiAgent);
      aiAgentCache.delete(userId);
    }
  }
}, 5000);

/**
 * Dispose of an AI agent and clean up resources
 * @param {Object} aiAgent - The AI agent to dispose
 */
async function disposeAiAgent(aiAgent) {
  try {
    await aiAgent.dispose();
    if (aiAgent.user) {
      const client = getServerClient();
      await client.deleteUser(aiAgent.user.id, {
        hard_delete: true,
      });
    }
  } catch (error) {
    console.error(`[StreamChat] Error disposing agent:`, error);
  }
}

/**
 * Initialize the StreamChat service
 * Attaches Stream Chat client to Express app and sets up routes
 *
 * @param {Object} config - Configuration object
 * @param {Object} config.app - Express application instance
 * @param {Object} config.server - HTTP server instance (for future Socket.io integration)
 * @param {Object} [config.options] - Additional initialization options
 * @returns {Object} Chat service interface
 */
export function initStreamChat({ app, server, options = {} }) {
  // Attach Stream Chat server client to app locals for use in controllers/routes
  app.locals.streamChatClient = getServerClient();
  app.locals.createAgent = createAgent;
  app.locals.AgentPlatform = AgentPlatform;

  // Get the platform from options or use GEMINI by default
  const defaultPlatform = options.platform || AgentPlatform.GEMINI;

  // ============================================================
  // Stream Chat Health Check
  // ============================================================
  app.get('/api/v1/chat/status', (req, res) => {
    res.json({
      success: true,
      message: 'Chat service is initialized',
      hasStreamKey: !!process.env.STREAM_API_KEY,
      hasStreamSecret: !!process.env.STREAM_API_SECRET,
      activeAgents: aiAgentCache.size,
      pendingAgents: pendingAiAgents.size,
      platform: defaultPlatform,
    });
  });

  // ============================================================
  // Start AI Agent Endpoint
  // ============================================================
  app.post('/api/v1/chat/start-agent', async (req, res) => {
    try {
      const { channel_id, channel_type = 'messaging' } = req.body;
      
      console.log(`[StreamChat] /start-agent called for channel: ${channel_id}`);

      if (!channel_id) {
        return res.status(400).json({ error: 'Missing channel_id' });
      }

      const userId = `ai-bot-${channel_id.replace(/[!]/g, '')}`;

      // Prevent multiple agents from being created simultaneously
      if (!aiAgentCache.has(userId) && !pendingAiAgents.has(userId)) {
        console.log(`[StreamChat] Creating new agent for ${userId}`);
        pendingAiAgents.add(userId);

        try {
          // Create user on Stream Chat
          const client = getServerClient();
          await client.upsertUser({
            id: userId,
            name: 'AI Writing Assistant',
          });

          // Add user to channel
          const channel = client.channel(channel_type, channel_id);
          await channel.addMembers([userId]);

          // Create and initialize the agent
          const agent = await createAgent(
            userId,
            defaultPlatform,
            channel_type,
            channel_id
          );

          await agent.init();

          // Final check to prevent race conditions
          if (!aiAgentCache.has(userId)) {
            aiAgentCache.set(userId, agent);
            console.log(`[StreamChat] Agent ${userId} started successfully`);
          } else {
            await agent.dispose();
            console.log(`[StreamChat] Agent ${userId} already existed, disposing duplicate`);
          }

          res.json({ 
            message: 'AI Agent started',
            userId,
            platform: defaultPlatform
          });
        } catch (initError) {
          console.error(`[StreamChat] Error initializing agent:`, initError);
          throw initError;
        }
      } else {
        console.log(`[StreamChat] AI Agent ${userId} already started or is pending.`);
        res.json({ 
          message: 'AI Agent already started or pending',
          userId
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[StreamChat] Failed to start AI Agent', errorMessage);
      res.status(500).json({ 
        error: 'Failed to start AI Agent', 
        reason: errorMessage 
      });
    } finally {
      const userId = `ai-bot-${(req.body.channel_id || '').replace(/[!]/g, '')}`;
      pendingAiAgents.delete(userId);
    }
  });

  // ============================================================
  // Stop AI Agent Endpoint
  // ============================================================
  app.post('/api/v1/chat/stop-agent', async (req, res) => {
    try {
      const { channel_id } = req.body;
      
      console.log(`[StreamChat] /stop-agent called for channel: ${channel_id}`);

      if (!channel_id) {
        return res.status(400).json({ error: 'Missing channel_id' });
      }

      const userId = `ai-bot-${channel_id.replace(/[!]/g, '')}`;
      const aiAgent = aiAgentCache.get(userId);

      if (aiAgent) {
        console.log(`[StreamChat] Disposing agent for ${userId}`);
        await disposeAiAgent(aiAgent);
        aiAgentCache.delete(userId);
        res.json({ 
          message: 'AI Agent stopped',
          userId
        });
      } else {
        console.log(`[StreamChat] Agent for ${userId} not found in cache.`);
        res.json({ 
          message: 'AI Agent not found',
          userId
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[StreamChat] Failed to stop AI Agent', errorMessage);
      res.status(500).json({ 
        error: 'Failed to stop AI Agent', 
        reason: errorMessage 
      });
    }
  });

  // ============================================================
  // Agent Status Endpoint
  // ============================================================
  app.get('/api/v1/chat/agent-status', (req, res) => {
    try {
      const { channel_id } = req.query;

      if (!channel_id || typeof channel_id !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid channel_id' });
      }

      const userId = `ai-bot-${channel_id.replace(/[!]/g, '')}`;

      console.log(
        `[StreamChat] /agent-status called for channel: ${channel_id} (user: ${userId})`
      );

      let status = 'disconnected';
      if (aiAgentCache.has(userId)) {
        status = 'connected';
        console.log(`[StreamChat] Status for ${userId}: connected`);
      } else if (pendingAiAgents.has(userId)) {
        status = 'connecting';
        console.log(`[StreamChat] Status for ${userId}: connecting`);
      } else {
        console.log(`[StreamChat] Status for ${userId}: disconnected`);
      }

      res.json({ 
        status,
        userId,
        platform: defaultPlatform
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[StreamChat] Error checking agent status', errorMessage);
      res.status(500).json({ 
        error: 'Failed to check agent status',
        reason: errorMessage 
      });
    }
  });

  // ============================================================
  // Stream Chat Webhook Handler
  // ============================================================
  app.post('/api/v1/chat/webhooks/stream', (req, res) => {
    console.log('[StreamChat] Webhook received:', req.body.type);
    // TODO: Implement webhook verification and handling logic
    res.json({ success: true });
  });

  // ============================================================
  // Token Provider Endpoint
  // ============================================================
  app.post('/api/v1/chat/token', async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          error: 'userId is required',
        });
      }

      const client = getServerClient();

      // First, upsert the user so token matches
      await client.upsertUser({
        id: userId,
        name: `User ${userId.slice(-8)}`,
      });

      // Create token with 1 hour expiration
      const issuedAt = Math.floor(Date.now() / 1000);
      const expiration = issuedAt + 60 * 60;

      const token = client.createToken(userId, expiration, issuedAt);
      console.log(`[StreamChat] Token created for user: ${userId}`);

      res.json({ token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[StreamChat] Error generating token:', errorMessage);
      res.status(500).json({
        error: 'Failed to generate token',
        reason: errorMessage,
      });
    }
  });

  console.log('✅ StreamChat module initialized with endpoints');

  // Return service interface
  return {
    serverClient: getServerClient(),
    createAgent,
    AgentPlatform,
    aiAgentCache,
  };
}

// Named exports for direct access if needed
export { getServerClient, createAgent, AgentPlatform, aiAgentCache };
