"use client";

import { useState } from "react";
import { Check, X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactRequest } from "@/lib/types/Users";

interface ContactRequestsProps {
  receivedRequests: ContactRequest[];
  sentRequests: ContactRequest[];
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onCancelRequest: (requestId: string) => void;
}

export function ContactRequests({
  receivedRequests,
  sentRequests,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
}: ContactRequestsProps) {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "received"
              ? "bg-secondary/20 text-primary shadow-sm"
              : "bg-secondary/10 text-primary/40 hover:text-primary/90"
          }`}
        >
          <User className="h-4 w-4" />
          Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "sent"
              ? "bg-secondary/20 text-primary shadow-sm"
              : "bg-secondary/10 text-primary/40 hover:text-primary/90"
          }`}
        >
          <Clock className="h-4 w-4" />
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Received Requests */}
      {activeTab === "received" && (
        <div className="space-y-3">
          {receivedRequests.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/80">No contact requests received</p>
                <p className="text-sm text-white/60 mt-1">
                  When someone sends you a contact request, it will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedRequests.map((request) => (
              <Card
                key={request.id}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-primary">
                        <AvatarImage
                          src={request.fromUser.avatar}
                          alt={request.fromUser.name}
                        />
                        <AvatarFallback className="">
                          {request.fromUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {request.fromUser.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {request.fromUser.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-white/30 text-white/80"
                        >
                          {formatDate(request.createdAt)}
                        </Badge>
                      </div>
                      <p className="text-sm mb-1">{request.fromUser.email}</p>
                      {request.message && (
                        <p className="text-sm italic">"{request.message}"</p>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => onAcceptRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRejectRequest(request.id)}
                          className="border-primary/30 text-primary/80 hover:bg-primary/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Sent Requests */}
      {activeTab === "sent" && (
        <div className="space-y-3">
          {sentRequests.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/80">No pending requests</p>
                <p className="text-sm text-white/60 mt-1">
                  Contact requests you send will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            sentRequests.map((request) => (
              <Card
                key={request.id}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-primary">
                        <AvatarImage
                          src={request.toUser.avatar}
                          alt={request.toUser.name}
                        />
                        <AvatarFallback className="">
                          {request.toUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {request.toUser.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {request.toUser.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs border-orange-400/50 text-orange-400"
                        >
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm mb-1">{request.toUser.email}</p>
                      <p className="text-xs">
                        Sent {formatDate(request.createdAt)}
                      </p>
                      {request.message && (
                        <p className="text-sm italic mt-1">
                          "{request.message}"
                        </p>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelRequest(request.id)}
                          className="border-primary/30 hover:bg-primary/70"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
