import React, { useState, useEffect } from "react";
import { ImprovedChatInterface } from "./components/improved-chat-interface";
import { ImprovedSidebar } from "./components/improved-sidebar";
import { ThemeProvider } from "./providers/theme-provider";
import { v4 as uuidv4 } from "uuid";

const ImprovedChatBasedModule = ({ user, onClose, onBack }) => {
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!user) {
    return null;
  }

  // Load first conversation on mount
  useEffect(() => {
    if (!activeChannelId) {
      const stored = localStorage.getItem("chatbased_conversations");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) {
            setActiveChannelId(parsed[0].id);
          }
        } catch (error) {
          console.error("[ImprovedChatBasedModule] Load error:", error);
        }
      }
    }
  }, []);

  const handleNewChat = () => {
    const newChannelId = `ch_${uuidv4()}`;
    setActiveChannelId(newChannelId);
    
    // Save to conversations list
    const conversations = JSON.parse(localStorage.getItem("chatbased_conversations") || "[]");
    const newConversation = {
      id: newChannelId,
      title: "New Conversation",
      lastUpdated: new Date().toISOString(),
    };
    conversations.unshift(newConversation);
    localStorage.setItem("chatbased_conversations", JSON.stringify(conversations));
  };

  const handleChannelCreated = (channelId) => {
    setActiveChannelId(channelId);
    
    // Save to conversations list
    const conversations = JSON.parse(localStorage.getItem("chatbased_conversations") || "[]");
    const newConversation = {
      id: channelId,
      title: "New Conversation",
      lastUpdated: new Date().toISOString(),
    };
    conversations.unshift(newConversation);
    localStorage.setItem("chatbased_conversations", JSON.stringify(conversations));
  };

  const handleChannelSelect = (channelId) => {
    setActiveChannelId(channelId);
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="fixed inset-0 bg-gray-900 z-50 flex overflow-hidden">
        <ImprovedSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectChannel={handleChannelSelect}
          currentUser={user}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <ImprovedChatInterface
            channelId={activeChannelId}
            onNewChat={handleNewChat}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            backendUrl={backendUrl}
            currentUser={user}
            onChannelCreated={handleChannelCreated}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ImprovedChatBasedModule;
