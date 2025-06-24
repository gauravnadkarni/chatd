"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/lib/types/Users";

interface UserSearchProps {
  onAddContact: (user: User) => void;
  existingContacts: string[];
  sentRequests: string[];
  blockedUsers: string[];
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "",
    isOnline: true,
    bio: "Software Engineer at TechCorp",
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "",
    isOnline: false,
    lastSeen: "2 hours ago",
    bio: "Product Manager",
  },
  {
    id: "u3",
    name: "Carol Davis",
    email: "carol@example.com",
    avatar: "",
    isOnline: true,
    bio: "UX Designer",
  },
  {
    id: "u4",
    name: "David Wilson",
    email: "david@example.com",
    avatar: "",
    isOnline: false,
    lastSeen: "1 day ago",
    bio: "Marketing Specialist",
  },
  {
    id: "u5",
    name: "Eva Martinez",
    email: "eva@example.com",
    avatar: "",
    isOnline: true,
    bio: "Data Scientist",
  },
];

export function UserSearch({
  onAddContact,
  existingContacts,
  sentRequests,
  blockedUsers,
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const results = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const getContactStatus = (userId: string) => {
    if (blockedUsers.includes(userId)) return "blocked";
    if (existingContacts.includes(userId)) return "contact";
    if (sentRequests.includes(userId)) return "pending";
    return "none";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "contact":
        return (
          <Badge variant="secondary" className="text-xs">
            Contact
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            Request Sent
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="destructive" className="text-xs">
            Blocked
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-white/10 border-white/20 focus:bg-white/20"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
          </div>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {searchResults.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No users found matching "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1">
                {searchResults.map((user) => {
                  const status = getContactStatus(user.id);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-primary">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.bio && (
                          <p className="text-xs text-gray-400 truncate">
                            {user.bio}
                          </p>
                        )}
                        {!user.isOnline && user.lastSeen && (
                          <p className="text-xs text-gray-400">
                            Last seen {user.lastSeen}
                          </p>
                        )}
                      </div>

                      {status === "none" && (
                        <Button
                          size="sm"
                          onClick={() => onAddContact(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
