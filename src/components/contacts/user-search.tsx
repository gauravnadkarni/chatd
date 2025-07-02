"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/lib/types/Users";
import { useSearchProfiles } from "@/hooks/useProfile";
import Spinner from "../Spinner";
import { ProfileModel } from "@/lib/types/profile";

interface UserSearchProps {
  onAddContact: (user: ProfileModel) => void;
  existingContacts: string[];
  sentRequests: string[];
  blockedUsers: string[];
}

export function UserSearch({
  onAddContact,
  existingContacts,
  sentRequests,
  blockedUsers,
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: searchResults,
    isLoading: isSearchResultsLoading,
    refetch: refetchSearchResults,
  } = useSearchProfiles({
    query: searchQuery,
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        return;
      }
      refetchSearchResults();
      setShowResults(true);
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
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
    <div className="relative w-full md:w-1/2 xl:w-1/4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => {
            if (e.target.value.length === 0) handleClearSearch();
            else setSearchQuery(e.target.value);
          }}
          className="pl-10 pr-10 bg-secondary/10 border-primary/20 focus:bg-primary/40"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-sm border-white/20 shadow-xl max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {isSearchResultsLoading && <Spinner centerAligned />}
            {!isSearchResultsLoading &&
              searchResults &&
              searchResults.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No users found matching "{searchQuery}"
                </div>
              )}
            {searchResults && searchResults.length > 0 && (
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
                          <AvatarImage
                            src={user.avatar_file_name || ""}
                            alt={user.full_name || ""}
                          />
                          <AvatarFallback className="">
                            {user
                              .full_name!.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/*user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )*/}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {user.full_name}
                          </p>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                        {/*{user.bio && (
                          <p className="text-xs text-gray-400 truncate">
                            {user.bio}
                          </p>
                        )}*/}
                        {/* {!user.isOnline && user.lastSeen && (
                          <p className="text-xs text-gray-400">
                            Last seen {user.lastSeen}
                          </p>
                        )}*/}
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
