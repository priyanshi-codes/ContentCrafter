import React, { useEffect, useState, useRef } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { X, Send, Menu, Sparkles, Bot } from "lucide-react";
import api from "../services/api";
import { StreamChat } from "stream-chat";

/**
 * ChatBased Module - Main Entry Point with Full UI
 * Handles authentication, Stream Chat integration, and beautiful chat interface
 */
const ChatBasedModule = ({ onClose, onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [chatStatus, setChatStatus] = useState("initializing");
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user is authenticated
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("[ChatBasedModule] Authenticated user:", currentUser.uid);
      } else {
        setError("Please login to use Chat-Based Prompting");
        console.log("[ChatBasedModule] User not authenticated");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Initialize Stream Chat
  useEffect(() => {
    if (!user || error) return;

    let newChannel = null;
    let client = null;

    const initializeChat = async () => {
      try {
        setChatStatus("connecting");

        // Step 1: Get chat status
        const statusResponse = await api.get("/chat/status");
        console.log("[ChatBasedModule] Chat status response:", statusResponse.data);

        if (statusResponse.data?.message !== "Chat service is initialized") {
          setChatStatus("error");
          setError("Chat service not available");
          return;
        }

        // Step 2: Get token from backend
        const tokenResponse = await api.post("/chat/token", {
          userId: user.uid,
          userName: user.displayName || user.email,
        });
        const token = tokenResponse.data.token;
        console.log("[ChatBasedModule] Token received for user:", user.uid);

        // Step 3: Initialize Stream Chat client
        client = new StreamChat(import.meta.env.VITE_STREAM_API_KEY);
        await client.connectUser(
          {
            id: user.uid,
            name: user.displayName || user.email,
          },
          token
        );
        setChatClient(client);
        console.log("[ChatBasedModule] Stream Chat client connected");

        // Step 4: Create or get channel
        const channelId = `writing-assistance-${user.uid}`;
        newChannel = client.channel("messaging", channelId, {
          name: "AI Writing Assistant Chat",
        });
        await newChannel.create();
        await newChannel.watch();
        console.log("[ChatBasedModule] Channel created and watched:", channelId);
        setChannel(newChannel);

        // Step 5: Start AI agent on backend
        const agentResponse = await api.post("/chat/start-agent", {
          channel_id: channelId,
          channel_type: "messaging",
        });
        console.log("[ChatBasedModule] Agent started:", agentResponse.data);

        // Step 6: Load existing messages
        const state = await newChannel.query({ messages: { limit: 50 } });
        const existingMessages = state.messages.map((msg) => ({
          id: msg.id,
          type: msg.user?.id?.startsWith("ai-bot-") ? "ai" : "user",
          text: msg.text,
          timestamp: new Date(msg.created_at),
          userName: msg.user?.name || "User",
        }));
        console.log("[ChatBasedModule] Loaded existing messages:", existingMessages.length);

        // Step 7: Listen for messages
        const handleNewMessage = (event) => {
          const msg = event.message;
          console.log("[ChatBasedModule] Message event:", msg?.user?.id, msg?.text?.substring(0, 50));

          setMessages((prev) => {
            const existingIndex = prev.findIndex((m) => m.id === msg.id);

            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                id: msg.id,
                type: msg.user?.id?.startsWith("ai-bot-") ? "ai" : "user",
                text: msg.text,
                timestamp: new Date(msg.created_at),
                userName: msg.user?.name || "User",
              };
              return updated;
            } else {
              return [...prev, {
                id: msg.id,
                type: msg.user?.id?.startsWith("ai-bot-") ? "ai" : "user",
                text: msg.text,
                timestamp: new Date(msg.created_at),
                userName: msg.user?.name || "User",
              }];
            }
          });
        };

        newChannel.on("message.new", handleNewMessage);
        newChannel.on("message.updated", handleNewMessage);

        setChatStatus("ready");
        setMessages(existingMessages);

        return () => {
          if (newChannel) {
            newChannel.off("message.new", handleNewMessage);
            newChannel.off("message.updated", handleNewMessage);
          }
        };
      } catch (err) {
        console.error("[ChatBasedModule] Failed to initialize chat:", err);
        setChatStatus("error");
        setError("Failed to connect to chat service: " + err.message);
      }
    };

    initializeChat();

    return () => {
      if (client) {
        client.disconnectUser().catch(err => console.error("Error disconnecting:", err));
      }
    };
  }, [user, error]);

  // Optimization prompts for content refinement
  const optimizationPrompts = [
    {
      icon: "✨",
      label: "Make Professional",
      prompt: "Rewrite this to be more professional and formal",
    },
    {
      icon: "📝",
      label: "Expand More",
      prompt: "Add more details and expand this content",
    },
    {
      icon: "⚡",
      label: "Make Concise",
      prompt: "Make this shorter and more concise while keeping the key points",
    },
    {
      icon: "🎯",
      label: "Make Punchy",
      prompt: "Rewrite this to be more engaging and catchy",
    },
    {
      icon: "🔄",
      label: "Different Angle",
      prompt: "Rewrite this from a different perspective or angle",
    },
    {
      icon: "📱",
      label: "Social Media",
      prompt: "Optimize this for social media with appropriate tone and length",
    },
  ];

  // Handle optimization option click
  const handleOptimization = (optimizationPrompt, originalText) => {
    const fullPrompt = `${optimizationPrompt}\n\nOriginal text:\n${originalText}`;
    setInputText(fullPrompt);
    // Auto-focus and scroll to input
    setTimeout(() => {
      document.querySelector("textarea")?.focus();
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  // Handle sending message
  const handleSendMessage = async () => {

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputText,
      timestamp: new Date(),
      userName: user?.displayName || user?.email || "You",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoadingMessage(true);

    try {
      await channel.sendMessage({
        text: inputText.trim(),
      });
    } catch (err) {
      console.error("[ChatBasedModule] Error sending message:", err);
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: "error",
        text: `Error: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  // Handle keyboard
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-gray-800">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-300">Initializing Chat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800">
          <h2 className="text-red-500 font-bold mb-2 text-lg">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl h-[600px] border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-blue-500" />
              <Sparkles className="h-3 w-3 text-blue-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Writing Assistant</h2>
              <p className="text-xs text-gray-400">{chatStatus === "ready" ? "Ready to chat" : "Connecting..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl animate-pulse"></div>
                <Bot className="h-8 w-8 text-blue-500 relative z-10" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Welcome to AI Writing Assistant</h3>
              <p className="text-gray-400 max-w-xs mb-6">
                Start typing your writing prompt or ask for help. I'm here to assist with content creation!
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                {[
                  "Write a LinkedIn post",
                  "Improve this text",
                  "Brainstorm ideas",
                  "Draft an email",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(prompt)}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors border border-gray-700 hover:border-blue-500"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id}>
                <div
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.type === "ai"
                        ? "bg-gray-800 border border-gray-700 text-gray-100"
                        : msg.type === "error"
                        ? "bg-red-900/30 border border-red-800/50 text-red-400"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Optimization buttons for AI messages */}
                {msg.type === "ai" && msg.text && !msg.text.includes("Error") && (
                  <div className="mt-3 ml-4 flex flex-wrap gap-2">
                    {optimizationPrompts.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleOptimization(opt.prompt, msg.text)}
                        className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500 text-gray-300 rounded-md transition-all duration-200 flex items-center gap-1"
                        title={opt.prompt}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoadingMessage && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to write something, or paste text to improve..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none max-h-24"
              rows="2"
              disabled={isLoadingMessage || chatStatus !== "ready"}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoadingMessage || chatStatus !== "ready"}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Shift+Enter for new line, Enter to send</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBasedModule;

