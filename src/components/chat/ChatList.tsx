"use client";

import { useState } from "react";
import { Search, MessageCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = chat.name.toLowerCase().includes(query);
    const messageMatch = chat.lastMessage.toLowerCase().includes(query);

    // If it's a group, also search in members
    const memberMatch =
      chat.isGroup && chat.members
        ? chat.members.some((member) => member.toLowerCase().includes(query))
        : false;

    return nameMatch || messageMatch || memberMatch;
  });

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Search Header */}
      <div className="p-4 border-b ">
        <div className="flex gap-2 mb-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={(e) => e.preventDefault()}
            size="sm"
            className="bg-primary/50 hover:bg-primary/80 border-primary-accent px-3"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <MessageCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/10",
                  selectedChatId === chat.id && "border"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center font-semibold border border-primary-accent">
                    {chat.avatar}
                  </div>
                  {chat.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      {chat.isGroup && (
                        <Badge variant="secondary" className="text-xs">
                          Group
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate">{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-blue-500  text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
