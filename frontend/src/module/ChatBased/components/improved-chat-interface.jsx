import React, { useState, useRef, useEffect } from "react";
import { useConversationHistory } from "../hooks/use-conversation-history";
import { useConversationSync } from "../hooks/use-conversation-sync";
import { ImprovedChatMessage } from "./improved-message";
import { Button } from "@/components/ui/button";
import { Plus, SidebarOpen, Trash2, SendHorizontal, AlertCircle } from "lucide-react";

export const ImprovedChatInterface = ({
  channelId,
  onNewChat,
  onToggleSidebar,
  backendUrl,
  currentUser,
  onChannelCreated,
}) => {
  const { messages, addMessage, updateMessage, clearHistory, getConversationContext } =
    useConversationHistory(channelId);
  const { updateConversationPreview } = useConversationSync();

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update conversation preview when messages change
  useEffect(() => {
    if (channelId && messages.length > 0) {
      updateConversationPreview(channelId, messages);
    }
  }, [channelId, messages, updateConversationPreview]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [inputText]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // Auto-create channel if needed
    let effectiveChannelId = channelId;
    if (!effectiveChannelId) {
      effectiveChannelId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Notify parent of new channel creation
      if (onChannelCreated) {
        onChannelCreated(effectiveChannelId);
      }
    }

    const userMessage = inputText.trim();
    setInputText("");
    setError(null);

    try {
      setIsLoading(true);

      const userMsg = addMessage(userMessage, "user", {}, effectiveChannelId);
      const assistantMsg = addMessage("", "assistant", { isStreaming: true }, effectiveChannelId);

      if (!userMsg?.id || !assistantMsg?.id) {
        throw new Error("Failed to create messages");
      }

      console.log("[ImprovedChat] Sending message to backend");

      const response = await fetch(`${backendUrl}/api/v1/chat/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: effectiveChannelId,
          message: userMessage,
          conversation_history: getConversationContext(),
          user_id: currentUser?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        updateMessage(assistantMsg.id, {
          text: fullResponse,
          isStreaming: false,
        });
      }

      console.log("[ImprovedChat] ✅ Response completed");
    } catch (err) {
      console.error("[ImprovedChat] Error:", err);
      setError(err.message || "Failed to send message");
      addMessage(err.message || "Error getting response", "assistant", {
        isError: true,
      }, effectiveChannelId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-teal-500/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleSidebar}
            className="hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <SidebarOpen className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">AI Content Assistant</h1>
            <p className="text-xs text-gray-500">Powered by GPT-3.5</p>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={onNewChat}
          className="hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-4 mt-3 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
              ✨
            </div>
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text mb-2">
                How can I help?
              </h2>
              <p className="text-gray-400 text-sm max-w-sm">
                Ask me anything. I'm here to help with writing, editing, brainstorming, and content creation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md mt-6">
              {[
                "Write a professional email",
                "Generate creative ideas",
                "Explain a concept",
                "Draft content",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputText(suggestion)}
                  className="text-left p-3 bg-gradient-to-r from-blue-500/5 to-teal-500/5 hover:from-blue-500/15 hover:to-teal-500/15 rounded-lg border border-blue-500/20 hover:border-blue-400/40 text-sm text-gray-300 hover:text-blue-300 transition-all duration-200"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 py-4 px-2">
            {messages.map((msg) => (
              <ImprovedChatMessage
                key={msg.id}
                message={msg}
                isStreaming={msg.metadata?.isStreaming}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 py-4 px-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded flex items-center justify-center flex-shrink-0 text-white">
                  🤖
                </div>
                <div className="flex-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex-shrink-0 px-4 py-3 border-t border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-teal-500/5 backdrop-blur-sm"
      >
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant... (Shift + Enter for new line)"
            disabled={isLoading}
            className="min-h-[44px] max-h-[120px] w-full resize-none rounded-lg bg-[#1a1a1a] border border-blue-500/20 focus:border-blue-400/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none disabled:opacity-50 p-3 transition-all"
            style={{ fontFamily: "inherit" }}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white rounded-lg px-4 py-2 font-medium shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center px-1 mt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
          <p className="text-xs text-gray-500">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </form>
    </div>
  );
};

export default ImprovedChatInterface;
