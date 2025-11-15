import { StreamChat } from 'stream-chat';
import { apikey, serverClient } from '../serverClient.js';
import { OpenAIAgent } from './gemini/GeminiAgents.js';
import { AgentPlatform } from './types.js';

/**
 * Create an AI agent for a specific platform
 * @param {string} userId - The user ID
 * @param {string} platform - The agent platform (from AgentPlatform)
 * @param {string} channelType - The Stream Chat channel type
 * @param {string} channelId - The Stream Chat channel ID
 * @returns {Promise<Object>} The initialized agent (OpenAIAgent instance)
 */
export const createAgent = async (
  userId,
  platform,
  channelType,
  channelId
) => {
  const token = serverClient.createToken(userId);

  // This is the client for the AI bot user
  const chatClient = new StreamChat(apikey, undefined, {
    allowServerSideConnect: true,
  });

  await chatClient.connectUser({ id: userId }, token);
  const channel = chatClient.channel(channelType, channelId);
  await channel.watch();

  switch (platform) {
    case AgentPlatform.WRITING_ASSISTANT:
    case AgentPlatform.OPENAI:
      return new OpenAIAgent(chatClient, channel);
    default:
      throw new Error(`Unsupported agent platform: ${platform}`);
  }
};
