import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api";

/**
 * Integrated Stream Chat Component
 * Connects to backend StreamChat service for real-time AI writing assistance
 */
const StreamChatInterface = ({ onClose, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatStatus, setChatStatus] = useState("initializing");

  // Initialize chat connection on mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setChatStatus("connecting");
        
        // Check if backend chat service is ready
        const statusResponse = await api.get("/chat/status");
        console.log("Chat status:", statusResponse.data);
        
        if (statusResponse.data.success) {
          setChatStatus("ready");
          // Add initial system message
          setMessages([
            {
              id: "system-1",
              type: "system",
              text: "✅ AI Writing Assistant Ready! Start typing your writing prompt or ask for help.",
              timestamp: new Date(),
            },
          ]);
        } else {
          setChatStatus("error");
          setError("Chat service not available");
        }
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setChatStatus("error");
        setError("Failed to connect to chat service: " + err.message);
        
        // Show fallback message
        setMessages([
          {
            id: "system-error",
            type: "error",
            text: "⚠️ Chat service is currently offline. Please try again later or use the regular prompting mode.",
            timestamp: new Date(),
          },
        ]);
      }
    };

    initializeChat();
  }, []);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

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
      // Send message to AI backend
      const response = await api.post("/ai/generate/chat", {
        prompt: inputText,
        type: "writing_assistant",
      });

      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        text: response.data.data?.content || response.data.data || "No response from AI",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: "error",
        text: `❌ Error: ${err.response?.data?.message || err.message}`,
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
