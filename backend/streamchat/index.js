/**
 * StreamChat Module Entry Point
 * Exports initStreamChat function for integration with main backend
 */

import { serverClient, apikey, apiSecret } from './serverClient.js';
import { createAgent } from './agents/CreateAgent.js';
import { AgentPlatform } from './agents/types.js';

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
  app.locals.streamChatClient = serverClient;
  app.locals.createAgent = createAgent;
  app.locals.AgentPlatform = AgentPlatform;

  // Stream Chat webhook route (for handling webhooks from Stream)
  app.post('/api/v1/chat/webhooks/stream', (req, res) => {
    // TODO: Implement webhook verification and handling logic
    // For now, just acknowledge receipt
    console.log('Stream Chat webhook received:', req.body.type);
    res.json({ success: true });
  });

  // Chat service status endpoint
  app.get('/api/v1/chat/status', (req, res) => {
    res.json({
      success: true,
      message: 'Chat service is initialized',
      hasStreamKey: !!apikey,
      hasStreamSecret: !!apiSecret,
    });
  });

  // Log successful initialization
  console.log('✅ StreamChat module initialized');

  // Return service interface for use by backend
  return {
    serverClient,
    createAgent,
    AgentPlatform,
  };
}

// Named exports for direct access if needed
export { serverClient, createAgent, AgentPlatform };
