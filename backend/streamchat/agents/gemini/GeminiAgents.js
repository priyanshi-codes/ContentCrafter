import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini Agent - implements AIAgent interface
 * Manages Gemini chat lifecycle and handles incoming messages
 */
export class OpenAIAgent {
  constructor(chatClient, channel) {
    this.chatClient = chatClient;
    this.channel = channel;
    this.genAI = null;
    this.model = null;
    this.chatSession = null;
    this.lastInteractionTs = Date.now();
    this.handlers = [];
    this.messageHistory = [];

    // Bind handlers to preserve context
    this.handleMessage = this.handleMessage.bind(this);
  }

  /**
   * Get the current user from chat client
   */
  get user() {
    return this.chatClient.user;
  }

  /**
   * Get timestamp of last interaction
   * @returns {number} Timestamp in milliseconds
   */
  getLastInteraction() {
    return this.lastInteractionTs;
  }

  /**
   * Generate the system prompt for the AI writing assistant
   * @param {string} [context] - Optional context for the writing task
   * @returns {string} System prompt
   */
  getWritingAssistantPrompt(context) {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `You are an expert AI Writing Assistant. Your primary purpose is to be a collaborative writing partner.

**Your Core Capabilities:**
- Content Creation, Improvement, Style Adaptation, Brainstorming, and Writing Coaching.
- **Current Date**: Today's date is ${currentDate}. Please use this for any time-sensitive queries.

**Crucial Instructions:**
1. Provide accurate, helpful, and well-structured writing assistance.
2. When users ask for current information or news, acknowledge the date limitation but provide the best assistance you can.
3. Synthesize information to provide comprehensive and accurate answers.

**Response Format:**
- Be direct and production-ready.
- Use clear formatting.
- Never begin responses with phrases like "Here's the edit:", "Here are the changes:", or similar introductory statements.
- Provide responses directly and professionally without unnecessary preambles.

**Writing Context**: ${context || 'General writing assistance.'}

Your goal is to provide accurate, helpful, and well-written content.`;
  }

  /**
   * Initialize the agent - create Gemini chat session
   */
  async init() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-2.0-flash-exp for better performance
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      systemInstruction: this.getWritingAssistantPrompt()
    });

    // Initialize chat history
    this.messageHistory = [];
    this.chatSession = this.model.startChat({
      history: this.messageHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Listen for incoming messages
    this.chatClient.on('message.new', this.handleMessage);
    
    console.log('Gemini chat agent initialized');
  }

  /**
   * Dispose of agent resources
   */
  async dispose() {
    this.chatClient.off('message.new', this.handleMessage);
    await this.chatClient.disconnectUser();

    // Clear chat history and session
    this.messageHistory = [];
    this.chatSession = null;
    
    console.log('Gemini chat agent disposed');
  }

  /**
   * Handle incoming chat messages
   * @private
   */
  async handleMessage(e) {
    if (!this.chatSession) {
      console.log('Gemini chat session not initialized');
      return;
    }

    if (!e.message || e.message.ai_generated) {
      return;
    }

    const userMessage = e.message.text;
    if (!userMessage) return;

    this.lastInteractionTs = Date.now();

    try {
      // Send empty message to stream chat (to be updated with response)
      const { message: channelMessage } = await this.channel.sendMessage({
        text: '',
        ai_generated: true,
      });

      // Update UI to show thinking state
      await this.channel.sendEvent({
        type: 'ai_indicator.update',
        ai_state: 'AI_STATE_THINKING',
        cid: channelMessage.cid,
        message_id: channelMessage.id,
      });

      // Send message to Gemini and get response
      const result = await this.chatSession.sendMessage(userMessage);
      const aiResponse = result.response.text();

      // Add to message history
      this.messageHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
      this.messageHistory.push({
        role: 'model',
        parts: [{ text: aiResponse }]
      });

      // Update the channel message with AI response
      await this.channel.updateMessage(channelMessage.id, {
        text: aiResponse,
        ai_generated: true,
      });

      // Send ready state update
      await this.channel.sendEvent({
        type: 'ai_indicator.update',
        ai_state: 'AI_STATE_READY',
        cid: channelMessage.cid,
        message_id: channelMessage.id,
      });

      console.log('Gemini response sent successfully');

    } catch (error) {
      console.error('Error handling message with Gemini:', error);

      // Send error message to channel
      await this.channel.sendMessage({
        text: `❌ Error processing your message: ${error.message}`,
        ai_generated: true,
      });

      // Send error state update
      await this.channel.sendEvent({
        type: 'ai_indicator.update',
        ai_state: 'AI_STATE_ERROR',
      });
    }
  }
}
