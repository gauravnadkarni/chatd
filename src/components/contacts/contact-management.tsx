"use client";

import { useState } from "react";
import {
  MoreVertical,
  MessageCircle,
  UserX,
  UserCheck,
  Shield,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Contact } from "@/lib/types/Users";

interface ContactManagementProps {
  contacts: Contact[];
  blockedUsers: Contact[];
  onStartChat: (contactId: string) => void;
  onBlockUser: (contactId: string) => void;
  onUnblockUser: (contactId: string) => void;
  onRemoveContact: (contactId: string) => void;
  onViewProfile: (contactId: string) => void;
}

export function ContactManagement({
  contacts,
  blockedUsers,
  onStartChat,
  onBlockUser,
  onUnblockUser,
  onRemoveContact,
  onViewProfile,
}: ContactManagementProps) {
  const [activeTab, setActiveTab] = useState<"contacts" | "blocked">(
    "contacts"
  );
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "block" | "unblock" | "remove";
    contact: Contact | null;
  }>({
    isOpen: false,
    type: "remove",
    contact: null,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.contact) return;

    switch (confirmDialog.type) {
      case "block":
        onBlockUser(confirmDialog.contact.id);
        break;
      case "unblock":
        onUnblockUser(confirmDialog.contact.id);
        break;
      case "remove":
        onRemoveContact(confirmDialog.contact.id);
        break;
    }

    setConfirmDialog({ isOpen: false, type: "remove", contact: null });
  };

  const openConfirmDialog = (
    type: "block" | "unblock" | "remove",
    contact: Contact
  ) => {
    setConfirmDialog({ isOpen: true, type, contact });
  };

  const getConfirmDialogContent = () => {
    if (!confirmDialog.contact)
      return { title: "", description: "", action: "" };

    const userName = confirmDialog.contact.user.name;

    switch (confirmDialog.type) {
      case "block":
        return {
          title: `Block ${userName}?`,
          description: `${userName} will no longer be able to send you messages or see when you're online. You can unblock them later if you change your mind.`,
          action: "Block Contact",
        };
      case "unblock":
        return {
          title: `Unblock ${userName}?`,
          description: `${userName} will be able to send you messages and see when you're online again.`,
          action: "Unblock Contact",
        };
      case "remove":
        return {
          title: `Remove ${userName}?`,
          description: `${userName} will be removed from your contacts. You'll need to send a new contact request to chat with them again.`,
          action: "Remove Contact",
        };
    }
  };

  const dialogContent = getConfirmDialogContent();

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "contacts"
              ? "bg-secondary/20 text-primary shadow-sm"
              : "bg-secondary/10 text-primary/40 hover:text-primary/90"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab("blocked")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "blocked"
              ? "bg-secondary/20 text-primary shadow-sm"
              : "bg-secondary/10 text-primary/40 hover:text-primary/90"
          }`}
        >
          <Shield className="h-4 w-4" />
          Blocked ({blockedUsers.length})
        </button>
      </div>

      {/* Contacts Tab */}
      {activeTab === "contacts" && (
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <UserCheck className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/80">No contacts yet</p>
                <p className="text-sm text-white/60 mt-1">
                  Search for users and send contact requests to start chatting
                </p>
              </CardContent>
            </Card>
          ) : (
            contacts.map((contact) => (
              <Card
                key={contact.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-primary">
                        <AvatarImage
                          src={contact.user.avatar}
                          alt={contact.user.name}
                        />
                        <AvatarFallback className="">
                          {contact.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {contact.user.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {contact.user.name}
                        </h3>
                        {contact.user.isOnline ? (
                          <Badge
                            variant="outline"
                            className="text-xs border-green-400/50 text-green-800"
                          >
                            Online
                          </Badge>
                        ) : (
                          contact.user.lastSeen && (
                            <Badge variant="outline" className="text-xs">
                              {contact.user.lastSeen}
                            </Badge>
                          )
                        )}
                      </div>
                      <p className="text-sm truncate">{contact.user.email}</p>
                      <p className="text-xs">
                        Added {formatDate(contact.addedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onStartChat(contact.id)}
                        className="bg-primary/80 hover:bg-primary text-secondary"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/80 hover:text-white hover:bg-white/10"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => onViewProfile(contact.user.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openConfirmDialog("block", contact)}
                            className="text-orange-600 focus:text-orange-600"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Block Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openConfirmDialog("remove", contact)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Contact
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Blocked Users Tab */}
      {activeTab === "blocked" && (
        <div className="space-y-3">
          {blockedUsers.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/80">No blocked users</p>
                <p className="text-sm text-white/60 mt-1">
                  Users you block will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            blockedUsers.map((contact) => (
              <Card
                key={contact.id}
                className="backdrop-blur-sm border-primary"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 opacity-60 border border-primary">
                        <AvatarImage
                          src={contact.user.avatar}
                          alt={contact.user.name}
                        />
                        <AvatarFallback className="">
                          {contact.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {contact.user.name}
                        </h3>
                        <Badge variant="destructive" className="text-xs">
                          Blocked
                        </Badge>
                      </div>
                      <p className="text-sm truncate">{contact.user.email}</p>
                      {contact.blockedAt && (
                        <p className="text-xs text-white/50">
                          Blocked {formatDate(contact.blockedAt)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openConfirmDialog("unblock", contact)}
                        className="border-primary/30 text-primary/80 hover:bg-primary/10"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmDialog.type === "remove"
                  ? "bg-red-600 hover:bg-red-700"
                  : confirmDialog.type === "block"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {dialogContent.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
