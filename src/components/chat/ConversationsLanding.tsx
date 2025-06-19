"use client";
import { createClientForBrowser } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/navigation";
import { useState } from "react";
import { ChatView } from "./ChatView";
import { ChatList } from "./ChatList";

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
  members?: string[];
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  sender: string;
}

export default function ConversationsLanding({
  mockChats,
  mockMessages,
}: {
  mockChats: Chat[];
  mockMessages: Record<string, Message[]>;
}) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isMobileViewingChat, setIsMobileViewingChat] = useState(false);

  let selectedChat = selectedChatId
    ? mockChats.find((chat) => chat.id === selectedChatId)
    : null;
  const messages = selectedChatId ? mockMessages[selectedChatId] || [] : [];
  if (!selectedChat) {
    selectedChat = null;
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsMobileViewingChat(true);
  };

  const handleBackToList = () => {
    setIsMobileViewingChat(false);
    setSelectedChatId(null);
  };

  const supabase = createClientForBrowser();
  const router = useRouter();
  const inSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.refresh();
    }
  };
  return (
    <>
      <main className="flex-1 flex overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full">
          {/* Chat List Pane */}
          <div className="w-1/3 border-r backdrop-blur-sm">
            <ChatList
              chats={mockChats}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
            />
          </div>

          {/* Chat View Pane */}
          <div className="flex-1">
            <ChatView
              chat={selectedChat}
              messages={messages}
              onBack={handleBackToList}
              showBackButton={false}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full">
          {!isMobileViewingChat ? (
            <ChatList
              chats={mockChats}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
            />
          ) : (
            <ChatView
              chat={selectedChat}
              messages={messages}
              onBack={handleBackToList}
              showBackButton={true}
            />
          )}
        </div>
      </main>
    </>
  );
}
