import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";
import { StreamChat } from "stream-chat";

/**
 * Integrated Stream Chat Component
 * Connects to backend StreamChat service for real-time AI writing assistance
 * Uses authenticated Firebase user ID for persistent sessions
 */
const StreamChatInterface = ({ userId, userName, onClose, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatStatus, setChatStatus] = useState("initializing");
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  // Initialize chat connection on mount
  useEffect(() => {
    let newChannel = null;
    let client = null;
    let cleanupDone = false;

    const initializeChat = async () => {
      try {
        setChatStatus("connecting");
        
        // Step 1: Get chat status
        const statusResponse = await api.get("/chat/status");
        console.log("Chat status response:", statusResponse.data);
        
        if (statusResponse.data?.message !== 'Chat service is initialized') {
          setChatStatus("error");
          setError("Chat service not available");
          return;
        }

        const userId_actual = userId; // Use authenticated Firebase user ID
        console.log("[Frontend] Using authenticated user ID:", userId_actual);

        // Step 2: Get token from backend
        const tokenResponse = await api.post("/chat/token", {
          userId: userId_actual,
          userName: userName || "User"
        });
        const token = tokenResponse.data.token;
        console.log("Token received for user:", userId_actual);

        // Step 3: Initialize Stream Chat client
        client = new StreamChat(import.meta.env.VITE_STREAM_API_KEY);
        await client.connectUser(
          {
            id: userId_actual,
            name: userName || "User",
          },
          token
        );
        setChatClient(client);
        console.log("Stream Chat client connected for user:", userId_actual);

        // Step 4: Create channel
        const channelId = `writing-assistance-${Date.now()}`;
        newChannel = client.channel("messaging", channelId, {
          name: "AI Writing Assistant Chat",
        });
        await newChannel.create();
        await newChannel.watch();
        console.log("Channel created and watched:", channelId);
        setChannel(newChannel);

        // Step 5: Start AI agent on backend (only once per channel)
        const agentResponse = await api.post("/chat/start-agent", {
          channel_id: channelId,
          channel_type: "messaging",
        });
        console.log("Agent started:", agentResponse.data);

        // Step 6: Load existing messages
        const state = await newChannel.query({ messages: { limit: 50 } });
        const existingMessages = state.messages
          .filter(msg => msg.user?.id?.startsWith("ai-bot-"))
          .map(msg => ({
            id: msg.id,
            type: "ai",
            text: msg.text,
            timestamp: new Date(msg.created_at),
          }));
        console.log("Loaded existing messages:", existingMessages.length);

        // Step 7: Listen for NEW and UPDATED messages
        const handleNewMessage = (event) => {
          const msg = event.message;
          console.log("[Frontend] Message event - User ID:", msg?.user?.id, "Text:", msg?.text?.substring(0, 50));
          
          // Show messages from AI bot (not user messages)
          if (msg && msg.user?.id?.startsWith("ai-bot-")) {
            console.log("[Frontend] Adding/Updating AI message to state");
            setMessages((prev) => {
              // Check if message already exists
              const existingIndex = prev.findIndex(m => m.id === msg.id);
              
              if (existingIndex !== -1) {
                // Update existing message (for streaming updates)
                const updated = [...prev];
                updated[existingIndex] = {
                  id: msg.id,
                  type: "ai",
                  text: msg.text,
                  timestamp: new Date(msg.created_at),
                };
                return updated;
              } else {
                // Add new message
                return [...prev, {
                  id: msg.id,
                  type: "ai",
                  text: msg.text,
                  timestamp: new Date(msg.created_at),
                }];
              }
            });
          }
        };

        // Listen for both new AND updated messages
        newChannel.on("message.new", handleNewMessage);
        newChannel.on("message.updated", handleNewMessage);
        console.log("Message listener attached for new and updated messages");

        setChatStatus("ready");
        setMessages([
          {
            id: "system-1",
            type: "system",
            text: "✅ AI Writing Assistant Ready! Start typing your writing prompt or ask for help.",
            timestamp: new Date(),
          },
          ...existingMessages,
        ]);

      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setChatStatus("error");
        setError("Failed to connect to chat service: " + err.message);
        setMessages([
          {
            id: "system-error",
            type: "error",
            text: "⚠️ Chat service is currently offline.",
            timestamp: new Date(),
          },
        ]);
      }
    };

    initializeChat();

    // Return cleanup function
    return () => {
      console.log("Cleaning up chat connection");
      if (!cleanupDone) {
        cleanupDone = true;
        if (newChannel) {
          console.log("Removing message listeners");
          newChannel.off("message.new");
          newChannel.off("message.updated");
        }
        if (client) {
          console.log("Disconnecting user");
          client.disconnectUser().catch(err => console.error("Error disconnecting:", err));
        }
      }
    };
  }, []);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !channel) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Send message via Stream Chat
      await channel.sendMessage({
        text: inputText,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: "error",
        text: `❌ Error: ${err.message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl h-[600px] flex flex-col border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">AI Writing Assistant</h2>
            <p className="text-sm text-gray-400">
              {chatStatus === "ready" && "✅ Connected"}
              {chatStatus === "connecting" && "⏳ Connecting..."}
              {chatStatus === "error" && "❌ Connection Error"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
          {messages.length === 0 && chatStatus === "connecting" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Connecting to chat service...</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : message.type === "error"
                    ? "bg-red-900 text-red-100 rounded-bl-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm break-words">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          {error && (
            <div className="mb-2 p-2 bg-red-900/20 border border-red-700 rounded text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || chatStatus !== "ready"}
              placeholder={
                chatStatus === "ready"
                  ? "Type your writing prompt here... (Shift+Enter for new line, Enter to send)"
                  : "Chat service unavailable"
              }
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              rows={3}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim() || chatStatus !== "ready"}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed h-fit"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamChatInterface;
