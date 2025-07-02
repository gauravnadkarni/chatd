import { ProfileModel } from "./profile";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
}

export interface ContactRequest {
  id: string;
  fromUser: User;
  toUser: ProfileModel;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  message?: string;
}

export interface Contact {
  id: string;
  user: User;
  addedAt: string;
  isBlocked: boolean;
  blockedAt?: string;
  blockedBy?: string;
}

export interface ContactState {
  contacts: Contact[];
  blockedUsers: Contact[];
  sentRequests: ContactRequest[];
  receivedRequests: ContactRequest[];
}
