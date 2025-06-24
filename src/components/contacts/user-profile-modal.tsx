"use client";

import {
  X,
  MessageCircle,
  UserPlus,
  UserX,
  UserCheck,
  Calendar,
  Mail,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/types/Users";

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat?: () => void;
  onAddContact?: () => void;
  onBlockUser?: () => void;
  onUnblockUser?: () => void;
  contactStatus: "none" | "contact" | "pending" | "blocked";
}

export function UserProfileModal({
  user,
  isOpen,
  onClose,
  onStartChat,
  onAddContact,
  onBlockUser,
  onUnblockUser,
  contactStatus,
}: UserProfileModalProps) {
  if (!user) return null;

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getActionButtons = () => {
    switch (contactStatus) {
      case "contact":
        return (
          <div className="flex gap-2">
            <Button
              onClick={onStartChat}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
            <Button
              variant="outline"
              onClick={onBlockUser}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        );
      case "pending":
        return (
          <div className="flex gap-2">
            <Button disabled className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Request Sent
            </Button>
            <Button
              variant="outline"
              onClick={onBlockUser}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        );
      case "blocked":
        return (
          <Button
            onClick={onUnblockUser}
            variant="outline"
            className="w-full border-green-200 text-green-600 hover:bg-green-50"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Unblock User
          </Button>
        );
      default:
        return (
          <div className="flex gap-2">
            <Button
              onClick={onAddContact}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
            <Button
              variant="outline"
              onClick={onBlockUser}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <UserX className="h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  const getStatusBadge = () => {
    switch (contactStatus) {
      case "contact":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Contact
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 text-yellow-700"
          >
            Request Sent
          </Badge>
        );
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h2>
                {getStatusBadge()}
              </div>

              <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                {user.isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online now</span>
                  </>
                ) : (
                  user.lastSeen && (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Last seen {user.lastSeen}</span>
                    </>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>

              {user.bio && (
                <div className="flex items-start gap-3 text-sm">
                  <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{user.bio}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  Joined {formatJoinDate("2024-01-15")} {/* Mock join date */}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">{getActionButtons()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
