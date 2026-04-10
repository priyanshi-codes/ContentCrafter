import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LogOut,
  MessageCircle,
  MessageSquare,
  Moon,
  PlusCircle,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChannelList, useChatContext } from "stream-chat-react";
import { useTheme } from "../hooks/use-theme";

const ChannelListEmptyStateIndicator = () => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-teal-600/10 rounded-2xl flex items-center justify-center shadow-sm border border-blue-600/20">
        <MessageCircle className="h-8 w-8 text-teal-400" />
      </div>
    </div>
    <div className="space-y-2 max-w-xs">
      <h3 className="text-sm font-medium text-gray-100">
        No writing sessions yet
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed">
        Start a new writing session to begin creating content with your AI
        assistant.
      </p>
    </div>
    <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
      <span>Click "New Writing Session" to get started</span>
    </div>
  </div>
);

export const ChatSidebar = ({
  isOpen,
  onClose,
  onLogout,
  onChannelSelect,
  onChannelDelete,
  width = 320,
}) => {
  const { client, setActiveChannel } = useChatContext();
  const { user } = client;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  const filters = {
    type: "messaging",
    members: { $in: [user.id] },
  };
  const sort = { last_message_at: -1 };
  const options = { state: true, presence: true, limit: 10 };

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
    if (onChannelSelect) {
      onChannelSelect(channel);
    }
    onClose();
  };

  const handleChannelDelete = async (channel) => {
    try {
      await channel.delete();
      if (onChannelDelete) {
        onChannelDelete(channel.id);
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* The Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-gray-800 border-r border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ width: `${width}px` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-100">Writing Sessions</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Channel List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-0">
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              EmptyStateIndicator={ChannelListEmptyStateIndicator}
              Preview={(previewProps) => (
                <div
                  className={cn(
                    "flex items-center p-2 rounded-lg cursor-pointer transition-colors relative group mb-1",
                    previewProps.active
                      ? "bg-blue-600/30 text-teal-300 border border-blue-500/50"
                      : "hover:bg-gray-700/50 text-gray-300"
                  )}
                  onClick={() => handleChannelClick(previewProps.channel)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span className="flex-1 truncate text-sm font-medium">
                    {typeof previewProps.channel.data?.name === "string"
                      ? previewProps.channel.data?.name
                      : "New Writing Session"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChannelDelete(previewProps.channel);
                    }}
                    title="Delete writing session"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground/70 hover:text-destructive" />
                  </Button>
                </div>
              )}
            />
          </div>
        </ScrollArea>

        {/* New Chat Button */}
        <div className="p-2 border-t border-gray-700">
          <Button 
            onClick={() => {
              console.log("[ChatSidebar] New session button clicked");
              window.dispatchEvent(new CustomEvent('newChatSession'));
              console.log("[ChatSidebar] Event dispatched");
              onClose();
            }} 
            className="w-full justify-start bg-gradient-to-r from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600 text-white font-medium"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Writing Session
          </Button>
        </div>

        {/* User Profile / Logout */}
        <div className="p-2 border-t border-gray-700 bg-gray-800/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start items-center p-2 h-auto hover:bg-gray-700/50"
              >
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src={user?.image} alt={user?.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm truncate text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end">
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>
                  Switch to {theme === "dark" ? "Light" : "Dark"} Theme
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};
