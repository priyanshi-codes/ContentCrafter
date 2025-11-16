import pkg from "stream-chat";
const { StreamChat } = pkg;
import { getApikey, getServerClient } from "../serverClient.js";
import { OpenAIAgent } from "./openai/OpenAIAgent.js";
import { AgentPlatform } from "./types.js";

export const createAgent = async (userId, platform, channelType, channelId) => {
  console.log(`[CreateAgent] Creating agent for user: ${userId}, platform: ${platform}, channel: ${channelId}`);
  
  const serverClient = getServerClient();
  const apikey = getApikey();
  const token = serverClient.createToken(userId);

  // Create Stream Chat client for the AI bot
  const chatClient = new StreamChat(apikey, undefined, {
    allowServerSideConnect: true,
  });

  // Connect the bot user
  console.log(`[CreateAgent] Connecting bot user to Stream Chat`);
  await chatClient.connectUser({ id: userId }, token);

  // Get or create channel
  console.log(`[CreateAgent] Watching channel: ${channelId}`);
  const channel = chatClient.channel(channelType, channelId);
  await channel.watch();

  // Create appropriate agent based on platform
  console.log(`[CreateAgent] Creating ${platform} agent`);
  switch (platform) {
    case AgentPlatform.WRITING_ASSISTANT:
    case AgentPlatform.GEMINI:
    case AgentPlatform.OPENAI:
      // All use OpenAIAgent class, which now supports Gemini via OpenAI SDK
      const agent = new OpenAIAgent(chatClient, channel);
      console.log(`[CreateAgent] Agent created, initializing...`);
      await agent.init();
      console.log(`[CreateAgent] Agent initialized successfully`);
      return agent;

    default:
      throw new Error(`Unsupported agent platform: ${platform}`);
  }
};
