import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

export const ImprovedSidebar = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectChannel,
  currentUser,
}) => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadConversations = () => {
      const stored = localStorage.getItem("chatbased_conversations");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setConversations(parsed.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)));
        } catch (error) {
          console.error("[ImprovedSidebar] Load error:", error);
        }
      }
    };

    loadConversations();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "chatbased_conversations") {
        loadConversations();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events to handle same-window updates
    const handleCustomUpdate = () => {
      loadConversations();
    };
    
    window.addEventListener("conversationsUpdated", handleCustomUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("conversationsUpdated", handleCustomUpdate);
    };
  }, []);

  const handleNewChat = () => {
    onNewChat();
    setSelectedId(null);
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedId(conversationId);
    onSelectChannel(conversationId);
  };

  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== conversationId);
    setConversations(updated);
    localStorage.setItem("chatbased_conversations", JSON.stringify(updated));
    localStorage.removeItem(`chatbased_conversation_${conversationId}`);
    
    if (selectedId === conversationId) {
      if (updated.length > 0) {
        // Select the first remaining conversation
        const nextId = updated[0].id;
        setSelectedId(nextId);
        onSelectChannel(nextId);
      } else {
        // No conversations left, create a new one
        setSelectedId(null);
        onNewChat();
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-blue-500/10 z-40 transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-teal-500/5">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">Conversations</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="lg:hidden hover:bg-blue-500/10 text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={handleNewChat}
          className="m-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>

        <ScrollArea className="flex-1">
          <div className="space-y-2 px-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-blue-500/30 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="relative group rounded-lg overflow-hidden"
                >
                  {/* Scrollable container */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max">
                      {/* Main content */}
                      <button
                        onClick={() => handleSelectConversation(conversation.id)}
                        className={cn(
                          "flex-1 text-left px-3 py-3 transition-all duration-200 group/inner min-w-[230px]",
                          selectedId === conversation.id
                            ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 border-l border-l-blue-400/50 text-white"
                            : "text-gray-300 hover:bg-blue-500/10 border-l border-l-transparent hover:border-l-blue-500/20"
                        )}
                        title={conversation.title}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">
                              {conversation.title || "New Conversation"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {conversation.messageCount ? `${conversation.messageCount} messages` : "No messages"}
                              {" • "}
                              {formatDate(conversation.lastUpdated)}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Delete button (revealed on scroll) */}
                      <div className="flex items-center px-2 py-3 flex-shrink-0 bg-gradient-to-l from-red-600 to-red-600/0 hover:from-red-500 hover:to-red-500/0 transition-colors">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all flex-shrink-0"
                          onClick={(e) =>
                            handleDeleteConversation(e, conversation.id)
                          }
                          title="Delete conversation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-teal-500/5 p-4 space-y-2">
          <div className="text-xs text-gray-500">Signed in as</div>
          <div className="text-sm font-medium text-blue-300">
            {currentUser?.email || currentUser?.name || "User"}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}
    </>
  );
};

export default ImprovedSidebar;
