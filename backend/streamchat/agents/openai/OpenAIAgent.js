import OpenAI from "openai";
import pkg from "stream-chat";
const { Channel, DefaultGenerics, Event, StreamChat } = pkg;
import { AIAgent} from "../types.js";

export class OpenAIAgent {
  constructor(chatClient, channel) {
    this.chatClient = chatClient;
    this.channel = channel;

    this.openai = undefined;
    this.assistant = undefined;
    this.openAiThread = undefined;
    this.lastInteractionTs = Date.now();

    this.handlers = [];
    this.processingMessageIds = new Set(); // Track messages being processed
  }

  dispose = async () => {
    this.chatClient.off("message.new", this.handleMessage);
    await this.chatClient.disconnectUser();

    this.handlers.forEach((handler) => handler.dispose());
    this.handlers = [];
    this.processingMessageIds.clear();
  };

  get user() {
    return this.chatClient.user;
  }

  getLastInteraction = () => {
    return this.lastInteractionTs;
  };

  init = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }

    // Initialize Gemini via OpenAI-compatible SDK
    this.openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });

    // Gemini doesn't support Assistants API, so we create a mock assistant object
    this.assistant = {
      id: "gemini-2.0-flash-lite",
      name: "AI Writing Assistant"
    };

    // Gemini doesn't use threads, but we track message history
    this.openAiThread = {
      id: "direct-chat",
      messages: []
    };

    this.chatClient.on("message.new", this.handleMessage);
  };

  getWritingAssistantPrompt = (context) => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `You are an expert AI Writing Assistant. Your primary purpose is to be a collaborative writing partner.

**Your Core Capabilities:**
- Content Creation, Improvement, Style Adaptation, Brainstorming, and Writing Coaching.
- **Current Date**: Today's date is ${currentDate}. Please use this for any time-sensitive queries.

**Crucial Instructions:**
1. Provide accurate, helpful, and well-structured writing assistance.
2. Synthesize information to provide comprehensive and accurate answers.
3. Be direct and production-ready.
4. Use clear formatting.
5. Never begin responses with phrases like "Here's the edit:", "Here are the changes:", or similar introductory statements.
6. Provide responses directly and professionally without unnecessary preambles.

**Writing Context**: ${context || "General writing assistance."}

Your goal is to provide accurate, current, and helpful written content.`;
  };

  handleMessage = async (e) => {
    console.log("[OpenAIAgent] Message event received:", e.message?.text);

    if (!this.openai || !this.assistant) {
      console.log("[OpenAIAgent] Gemini not initialized");
      return;
    }

    if (!e.message || e.message.ai_generated) {
      console.log("[OpenAIAgent] Skipping AI-generated or empty message");
      return;
    }

    // Skip if already processing this message
    if (this.processingMessageIds.has(e.message.id)) {
      console.log("[OpenAIAgent] Message already being processed, skipping:", e.message.id);
      return;
    }

    const message = e.message.text;
    if (!message) {
      console.log("[OpenAIAgent] No message text");
      return;
    }

    // Mark message as being processed
    this.processingMessageIds.add(e.message.id);

    console.log("[OpenAIAgent] Processing message:", message);
    this.lastInteractionTs = Date.now();

    const writingTask = e.message.custom?.writingTask;
    const context = writingTask ? `Writing Task: ${writingTask}` : undefined;
    const systemPrompt = this.getWritingAssistantPrompt(context);

    // Add user message to history
    this.openAiThread.messages.push({
      role: "user",
      content: message
    });

    try {
      // Send initial "thinking" message to Stream Chat
      console.log("[OpenAIAgent] Sending initial thinking message to channel");
      const { message: channelMessage } = await this.channel.sendMessage({
        text: "🤔 Thinking...",
        ai_generated: true,
      });
      console.log("[OpenAIAgent] Initial message sent, ID:", channelMessage.id);

      // Call Gemini API with streaming
      console.log("[OpenAIAgent] Calling Gemini API with streaming...");
      const response = await this.openai.chat.completions.create({
        model: "gemini-2.5-flash",
        reasoning_effort: "low",
        messages: [
          { role: "system", content: systemPrompt },
          ...this.openAiThread.messages
        ],
        stream: true,
      });

      // Collect response and update message in real-time
      let fullResponse = "";
      let lastUpdateTime = Date.now();
      const updateInterval = 500; // Update every 500ms

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;

          // Update message every 500ms to show streaming effect
          const now = Date.now();
          if (now - lastUpdateTime > updateInterval) {
            console.log("[OpenAIAgent] Updating message with partial content, length:", fullResponse.length);
            try {
              await this.chatClient.partialUpdateMessage(channelMessage.id, {
                set: { text: fullResponse },
              });
            } catch (updateError) {
              console.error("[OpenAIAgent] Error updating message:", updateError);
            }
            lastUpdateTime = now;
          }
        }
      }

      console.log("[OpenAIAgent] Streaming complete, total length:", fullResponse.length);

      // Final update with complete response
      if (fullResponse.trim()) {
        console.log("[OpenAIAgent] Sending final complete message");
        await this.chatClient.partialUpdateMessage(channelMessage.id, {
          set: { text: fullResponse },
        });

        // Add assistant response to history
        this.openAiThread.messages.push({
          role: "assistant",
          content: fullResponse
        });

        // Keep only last 10 messages to manage token count
        if (this.openAiThread.messages.length > 10) {
          this.openAiThread.messages = this.openAiThread.messages.slice(-10);
        }

        console.log("[OpenAIAgent] Message processing complete");
      } else {
        console.warn("[OpenAIAgent] Empty response from Gemini");
        await this.chatClient.partialUpdateMessage(channelMessage.id, {
          set: { text: "⚠️ Could not generate a response. Please try again." },
        });
      }

    } catch (error) {
      console.error("[OpenAIAgent] Error processing message:", error);

      try {
        const { message: channelMessage } = await this.channel.sendMessage({
          text: `⚠️ Error: ${error.message}`,
          ai_generated: true,
        });
        console.log("[OpenAIAgent] Error message sent");
      } catch (sendError) {
        console.error("[OpenAIAgent] Failed to send error message:", sendError);
      }
    }
  };

  removeHandler = (handlerToRemove) => {
    this.handlers = this.handlers.filter(
      (handler) => handler !== handlerToRemove
    );
  };
}
