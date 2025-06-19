"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface ChatViewProps {
  chat: Chat | null;
  messages: Message[];
  onBack: () => void;
  showBackButton: boolean;
}

export function ChatView({
  chat,
  messages,
  onBack,
  showBackButton,
}: ChatViewProps) {
  const [messageInput, setMessageInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  // Ref for the messages container to control scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to specific message (for search results)
  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement && messagesContainerRef.current) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Auto-scroll when messages change (new message added)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to highlighted search result
  useEffect(() => {
    if (currentSearchIndex >= 0 && searchResults[currentSearchIndex]) {
      scrollToMessage(searchResults[currentSearchIndex].id);
    }
  }, [currentSearchIndex, searchResults]);

  // Filter messages based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    const results = messages.filter((message) =>
      message.content.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setCurrentSearchIndex(results.length > 0 ? 0 : -1);
  };

  const navigateSearchResults = (direction: "next" | "prev") => {
    if (searchResults.length === 0) return;

    if (direction === "next") {
      setCurrentSearchIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentSearchIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Here you would typically send the message to your backend
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchQuery("");
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center backdrop-blur-sm">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p className="text-sm">
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col backdrop-blur-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-accent bg-secondary/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold border border-solid border-primary-accent">
              {chat.avatar}
            </div>
            {chat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-accent"></div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold">{chat.name}</h2>
              {chat.isGroup && (
                <Badge variant="secondary" className="text-xs">
                  Group
                </Badge>
              )}
            </div>
            <p className="text-xs">
              {chat.isOnline ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSearch}
            className={cn("hover: p-2", isSearching && "bg-white/20")}
          >
            {isSearching ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearching && (
        <div className="p-3 border-b border-primary-accent flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search in conversation..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 placeholder:text-white/60"
                autoFocus
              />
            </div>

            {searchResults.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs">
                  {currentSearchIndex + 1} of {searchResults.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateSearchResults("prev")}
                  className="p-1 h-8 w-8"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateSearchResults("next")}
                  className="p-1 h-8 w-8"
                >
                  ↓
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Area - Enhanced with better scrolling */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--primary) var(--background)",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                💬
              </div>
              <p className="text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isHighlighted =
                searchResults.length > 0 &&
                currentSearchIndex >= 0 &&
                searchResults[currentSearchIndex]?.id === message.id;

              return (
                <div
                  key={message.id}
                  id={`message-${message.id}`}
                  className={cn(
                    "flex",
                    message.isOwn ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl transition-all duration-200 word-wrap break-words",
                      message.isOwn
                        ? "rounded-br-md bg-secondary"
                        : "rounded-bl-md bg-primary/30",
                      isHighlighted && "ring-2 ring-yellow-400 bg-yellow-100/20"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs mt-1">{message.timestamp}</p>
                  </div>
                </div>
              );
            })}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-primary-accent backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 flex-shrink-0">
            <Smile className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="sm" className="p-2 flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-primary-accent placeholder:text-white/60 focus:border-primary-accent"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
