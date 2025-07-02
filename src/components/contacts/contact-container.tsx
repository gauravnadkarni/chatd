"use client";

import { useState } from "react";
import { ArrowLeft, Users, UserPlus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSearch } from "@/components/contacts/user-search";
import { ContactRequests } from "@/components/contacts/contact-requests";
import { ContactManagement } from "@/components/contacts/contact-management";
import { UserProfileModal } from "@/components/contacts/user-profile-modal";
import { useRouter } from "next/navigation";
import { User, ContactRequest, Contact } from "@/lib/types/Users";
import { ProfileModel } from "@/lib/types/profile";
import { cn } from "@/lib/utils";

// Mock data
const mockContacts: Contact[] = [
  {
    id: "c1",
    user: {
      id: "u1",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "",
      isOnline: true,
      bio: "Software Engineer at TechCorp",
    },
    addedAt: "2024-01-15T10:30:00Z",
    isBlocked: false,
  },
  {
    id: "c2",
    user: {
      id: "u2",
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "",
      isOnline: false,
      lastSeen: "2 hours ago",
      bio: "Product Manager",
    },
    addedAt: "2024-01-10T14:20:00Z",
    isBlocked: false,
  },
];

const mockBlockedUsers: Contact[] = [
  {
    id: "c3",
    user: {
      id: "u3",
      name: "Carol Davis",
      email: "carol@example.com",
      avatar: "",
      isOnline: false,
      bio: "UX Designer",
    },
    addedAt: "2024-01-05T09:15:00Z",
    isBlocked: true,
    blockedAt: "2024-01-20T16:45:00Z",
    blockedBy: "current-user",
  },
];

const mockReceivedRequests: ContactRequest[] = [
  {
    id: "r1",
    fromUser: {
      id: "u4",
      name: "David Wilson",
      email: "david@example.com",
      avatar: "",
      isOnline: true,
      bio: "Marketing Specialist",
    },
    toUser: {
      id: "current-user",
      name: "Current User",
      email: "current@example.com",
      avatar: "",
      isOnline: true,
    },
    status: "pending",
    createdAt: "2024-01-25T11:30:00Z",
    message: "Hi! I'd like to connect with you.",
  },
];

const mockSentRequests: ContactRequest[] = [
  {
    id: "s1",
    fromUser: {
      id: "current-user",
      name: "Current User",
      email: "current@example.com",
      avatar: "",
      isOnline: true,
    },
    toUser: {
      id: "u5",
      name: "Eva Martinez",
      email: "eva@example.com",
      avatar: "",
      isOnline: false,
      lastSeen: "1 day ago",
      bio: "Data Scientist",
    },
    status: "pending",
    createdAt: "2024-01-24T15:20:00Z",
  },
];

export function ContactsContainer() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("requests");

  // State management
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [blockedUsers, setBlockedUsers] = useState<Contact[]>(mockBlockedUsers);
  const [receivedRequests, setReceivedRequests] =
    useState<ContactRequest[]>(mockReceivedRequests);
  const [sentRequests, setSentRequests] =
    useState<ContactRequest[]>(mockSentRequests);

  // Profile modal state
  const [profileModal, setProfileModal] = useState<{
    isOpen: boolean;
    user: User | null;
    contactStatus: "none" | "contact" | "pending" | "blocked";
  }>({
    isOpen: false,
    user: null,
    contactStatus: "none",
  });

  const handleBack = () => {
    router.push("/dashboard");
  };

  // Helper functions
  const getExistingContactIds = () => contacts.map((c) => c.user.id);
  const getSentRequestIds = () => sentRequests.map((r) => r.toUser.id);
  const getBlockedUserIds = () => blockedUsers.map((b) => b.user.id);

  // Contact request handlers
  const handleAddContact = (user: ProfileModel) => {};

  const handleAcceptRequest = (requestId: string) => {
    const request = receivedRequests.find((r) => r.id === requestId);
    if (!request) return;

    const newContact: Contact = {
      id: `c${Date.now()}`,
      user: request.fromUser,
      addedAt: new Date().toISOString(),
      isBlocked: false,
    };

    setContacts((prev) => [...prev, newContact]);
    setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleCancelRequest = (requestId: string) => {
    setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Contact management handlers
  const handleStartChat = (contactId: string) => {
    // Navigate to chat with this contact
    router.push(`/dashboard?chat=${contactId}`);
  };

  const handleBlockUser = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    const blockedContact: Contact = {
      ...contact,
      isBlocked: true,
      blockedAt: new Date().toISOString(),
      blockedBy: "current-user",
    };

    setBlockedUsers((prev) => [...prev, blockedContact]);
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const handleUnblockUser = (contactId: string) => {
    const blockedUser = blockedUsers.find((b) => b.id === contactId);
    if (!blockedUser) return;

    const unblockedContact: Contact = {
      ...blockedUser,
      isBlocked: false,
      blockedAt: undefined,
      blockedBy: undefined,
    };

    setContacts((prev) => [...prev, unblockedContact]);
    setBlockedUsers((prev) => prev.filter((b) => b.id !== contactId));
  };

  const handleRemoveContact = (contactId: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const handleViewProfile = (userId: string) => {
    // Find user in contacts or blocked users
    const contact = contacts.find((c) => c.user.id === userId);
    const blockedUser = blockedUsers.find((b) => b.user.id === userId);

    if (contact) {
      setProfileModal({
        isOpen: true,
        user: contact.user,
        contactStatus: "contact",
      });
    } else if (blockedUser) {
      setProfileModal({
        isOpen: true,
        user: blockedUser.user,
        contactStatus: "blocked",
      });
    }
  };

  const totalPendingRequests = receivedRequests.length;

  // Sidebar navigation items
  const navigationItems = [
    {
      key: "requests",
      label: "Requests & Add",
      shortLabel: "Requests",
      icon: Bell,
      badge: totalPendingRequests > 0 ? totalPendingRequests : null,
    },
    {
      key: "manage",
      label: "My Contacts",
      shortLabel: "Contacts",
      icon: Users,
      badge: null,
    },
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "requests":
        return (
          <div className="space-y-6 md:space-y-8">
            {/* Add Contacts Section */}
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <CardTitle className="text-lg md:text-xl text-gray-800">
                  Add New Contacts
                </CardTitle>
                <p className="text-sm md:text-base text-gray-600">
                  Search and connect with new contacts
                </p>
              </div>
              <UserSearch
                onAddContact={handleAddContact}
                existingContacts={getExistingContactIds()}
                sentRequests={getSentRequestIds()}
                blockedUsers={getBlockedUserIds()}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Contact Requests Section */}
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-1 md:space-y-2">
                <CardTitle className="text-lg md:text-xl text-gray-800">
                  Contact Requests
                </CardTitle>
                <p className="text-sm md:text-base text-gray-600">
                  Manage incoming and outgoing contact requests
                </p>
              </div>
              <ContactRequests
                receivedRequests={receivedRequests}
                sentRequests={sentRequests}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                onCancelRequest={handleCancelRequest}
              />
            </div>
          </div>
        );

      case "manage":
        return (
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <CardTitle className="text-lg md:text-xl text-gray-800">
                Manage Contacts
              </CardTitle>
              <p className="text-sm md:text-base text-gray-600">
                View, chat with, or manage your contacts and blocked users
              </p>
            </div>
            <ContactManagement
              contacts={contacts}
              blockedUsers={blockedUsers}
              onStartChat={handleStartChat}
              onBlockUser={handleBlockUser}
              onUnblockUser={handleUnblockUser}
              onRemoveContact={handleRemoveContact}
              onViewProfile={handleViewProfile}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 max-w-full">
        {/* Main Layout with Sidebar */}
        <div className="flex gap-1 md:gap-2 h-[calc(100vh-200px)]">
          {/* Left Sidebar */}
          <div className="w-8 md:w-64 flex-shrink-0">
            <Card className="h-full">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.key;

                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={cn(
                          "flex items-center gap-3 px-1 md:px-4 py-3 text-left transition-colors hover:bg-gray-50 border-r-2 border-transparent relative",
                          isActive &&
                            "bg-blue-50 border-r-blue-500 text-blue-700"
                        )}
                        title={item.label} // Tooltip for mobile
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium hidden md:block">
                          {item.label}
                        </span>
                        {item.badge && (
                          <>
                            {/* Desktop badge */}
                            <Badge
                              variant="destructive"
                              className="ml-auto h-5 w-5 p-0 text-xs items-center justify-center hidden md:flex"
                            >
                              {item.badge}
                            </Badge>
                            {/* Mobile badge - positioned absolutely */}
                            <Badge
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center md:hidden"
                            >
                              {item.badge > 9 ? "9+" : item.badge}
                            </Badge>
                          </>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            <Card className="h-full backdrop-blur-sm shadow-xl">
              <CardContent className="p-3 md:p-6 h-full overflow-auto">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={profileModal.user}
        isOpen={profileModal.isOpen}
        onClose={() =>
          setProfileModal({ isOpen: false, user: null, contactStatus: "none" })
        }
        contactStatus={profileModal.contactStatus}
        onStartChat={() => {
          if (profileModal.user) {
            const contact = contacts.find(
              (c) => c.user.id === profileModal.user!.id
            );
            if (contact) {
              handleStartChat(contact.id);
              setProfileModal({
                isOpen: false,
                user: null,
                contactStatus: "none",
              });
            }
          }
        }}
        onAddContact={() => {
          if (profileModal.user) {
            //handleAddContact(profileModal.user);
            setProfileModal({
              isOpen: false,
              user: null,
              contactStatus: "none",
            });
          }
        }}
        onBlockUser={() => {
          if (profileModal.user) {
            const contact = contacts.find(
              (c) => c.user.id === profileModal.user!.id
            );
            if (contact) {
              handleBlockUser(contact.id);
              setProfileModal({
                isOpen: false,
                user: null,
                contactStatus: "none",
              });
            }
          }
        }}
        onUnblockUser={() => {
          if (profileModal.user) {
            const blockedUser = blockedUsers.find(
              (b) => b.user.id === profileModal.user!.id
            );
            if (blockedUser) {
              handleUnblockUser(blockedUser.id);
              setProfileModal({
                isOpen: false,
                user: null,
                contactStatus: "none",
              });
            }
          }
        }}
      />
    </>
  );
}
