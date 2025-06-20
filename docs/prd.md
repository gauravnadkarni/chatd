## Product Requirements Document (PRD) - Chat Application

**Document Version:** 1.0 **Date:** June 7, 2025 **Author:** Gemini AI **Product:** Real-time Chat Application

---

### 1. Introduction

#### 1.1 Purpose

This document outlines the requirements for a real-time chat application. It specifies the core features, user experience, technical stack, and non-functional requirements necessary for its development.

#### 1.2 Goals

- To create a functional and intuitive real-time chat application for one-on-one and group communication.
- To provide a seamless user experience across different devices (web and mobile PWA).
- To establish a scalable and secure foundation using modern technologies.

#### 1.3 Vision

To enable instant and reliable communication between users through a user-friendly and feature-rich chat platform, allowing personal and group interactions with media sharing capabilities.

#### 1.4 Target Audience

Individuals seeking a simple, efficient, and reliable platform for digital communication with their friends and contacts.

---

### 2. Core Technologies & Stack

This project will leverage a modern, performant, and scalable technology stack.

#### 2.1 Frontend

- **Framework:** Next.js (App Router)
- **Component Library:** Shadcn/UI (built on Tailwind CSS and Radix UI)
- **Form Management:** `react-hook-form` with `zod` for validation
- **Charting (Admin):** Recharts or Nivo

#### 2.2 Backend & Database

- **Backend as a Service (BaaS):** Supabase (PostgreSQL Database, Authentication, Realtime, Storage, Edge Functions)

#### 2.3 Real-time & Notifications

- **Real-time Communication:** Supabase Realtime (for in-app live updates)
- **Push Notifications:** Firebase Cloud Messaging (FCM) (for out-of-app alerts)

---

### 3. Database Design (High-Level Overview)

The application's data will be stored in a PostgreSQL database managed by Supabase. RLS (Row Level Security) will be rigorously applied to all `public` tables.

- **`auth.users`:** (Supabase Managed) - Core user authentication data.
- **`public.profiles`:** Stores public user profiles (`name`, `avatar_file_name`, `online_at`) and includes an `is_admin` flag for admin user identification. Links to `auth.users` (1:1).
- **`public.user_device_tokens`:** Stores Firebase Cloud Messaging (FCM) tokens for each user's devices (`fcm_token`, `platform`, `last_seen_at`) to enable multi-device push notifications. Links to `auth.users` (Many:1).
- **`public.contacts`:** Manages established, mutual contact relationships between users (`user_id`, `contact_id`). Models a Many-to-Many relationship between users.
- **`public.contact_requests`:** Manages the state of pending, accepted, or declined contact requests (`sender_id`, `recipient_id`, `status`). Links to `auth.users` (Many:1 for both sender and recipient).
- **`public.groups`:** Stores metadata for chat groups (`name`, `creator_id`, `avatar_url`). Links to `auth.users` (Many:1 creator).
- **`public.group_members`:** A junction table linking users to groups they belong to (`group_id`, `member_id`, `role`). Models a Many-to-Many relationship between groups and users.
- **`public.messages`:** Stores all chat messages (`sender_id`, `group_id`, `recipient_id`, `content`, `media_url`, `media_type`, `sent_at`, `read_at`, `deleted_by_sender`). Links to `auth.users` and `public.groups`.
- **`public.user_conversation_status`:** Optimizes unread message counts and tracks the last message seen by a user in each conversation (`user_id`, `group_id` OR `other_participant_id`, `last_seen_message_id`, `unread_count`). Links to `auth.users`, `public.groups`, and `public.messages`.

---

### 4. Feature Breakdown & Requirements

#### 4.1 User Authentication & Management

- **User Stories:**
  - As a new user, I want to sign up with my email and password so I can create an account.
  - As an existing user, I want to log in with my email and password or social accounts (Google, Facebook) so I can access my chats.
  - As a user, I want to be able to update my profile information (name, avatar) after logging in.
  - As a user, I want my profile to be automatically created when I sign up.
- **Requirements:**
  - Email/Password authentication.
  - Google and Facebook OAuth authentication.
  - User profile creation (`public.profiles`) upon `auth.users` insertion via database trigger.
  - Ability to update user `name` and `avatar_file_name` in `public.profiles`.
  - Secure password handling and session management via Supabase Auth.

#### 4.2 Contact List Management

- **User Stories:**
  - As a user, I want to search for other users by name or email to add them as contacts.
  - As a user, I want to send a contact request to another user.
  - As a user, I want to see a list of contact requests I have sent.
  - As a user, I want to see a list of pending contact requests I have received.
  - As a user, I want to accept or decline incoming contact requests.
  - As a user, I want to see my list of established contacts.
  - As a user, I want to be able to remove an existing contact.
- **Requirements:**
  - User search functionality against `public.profiles`.
  - `public.contact_requests` table to manage request states ('pending', 'accepted', 'declined', 'blocked').
  - Server Action for sending a contact request (insert into `contact_requests`).
  - Server Action for accepting a request (update `contact_requests` status to 'accepted', insert mutual entries into `public.contacts`).
  - Server Action for declining a request (update `contact_requests` status to 'declined').
  - Display of sent, received, and established contact lists in the UI.

#### 4.3 One-on-One Messaging

- **User Stories:**
  - As a user, I want to send text messages to a specific contact.
  - As a user, I want to receive text messages in real-time from my contacts.
  - As a user, I want to view the history of my conversations with a contact.
  - As a user, I want to know when my message has been read by the recipient (read receipts).
- **Requirements:**
  - Real-time message sending and receiving using Supabase Realtime for in-app delivery.
  - Messages stored in `public.messages` with `recipient_id`.
  - Display of chat history for each 1:1 conversation.
  - Ability to update `read_at` timestamp in `public.messages` and `last_seen_message_id`, `unread_count` in `public.user_conversation_status` upon message viewing.

#### 4.4 Group Chat Management

- **User Stories:**
  - As a user, I want to create a new chat group with a chosen name.
  - As a group creator, I want to invite/add other users to my group.
  - As a group member, I want to send text messages within the group.
  - As a group member, I want to receive text messages from other group members in real-time.
  - As a group member, I want to view the history of my group conversations.
- **Requirements:**
  - Group creation and management of `public.groups` table.
  - Member management in `public.group_members` table (adding/removing members).
  - Real-time group message sending and receiving using Supabase Realtime.
  - Messages stored in `public.messages` with `group_id`.
  - Display of chat history for each group conversation.

#### 4.5 Media Sharing

- **User Stories:**
  - As a user, I want to send images within a message.
  - As a user, I want to send common file types (e.g., PDFs, documents) within a message.
  - As a user, I want to view/download received media files.
- **Requirements:**
  - Integration with Supabase Storage for file uploads.
  - `media_url` and `media_type` fields in `public.messages` to store media references.
  - UI to select and preview files before sending.
  - UI to display images inline and provide download links for other file types.

#### 4.6 Real-time Presence

- **User Stories:**
  - As a user, I want to see if my contacts are currently online or offline.
  - As a user, I want to see if a contact is typing a message in a one-on-one conversation.
- **Requirements:**
  - Update `online_at` in `public.profiles` regularly for presence indication (e.g., every 15-30 seconds).
  - Supabase Realtime channels for presence broadcasting and subscription.
  - Mechanism for sending and receiving typing indicators within active conversations.

#### 4.7 Push Notifications

- **User Stories:**
  - As a user, I want to receive notifications for new messages when my app is closed or in the background.
  - As a user, I want to receive notifications for new contact requests when my app is closed or in the background.
- **Requirements:**
  - Firebase Cloud Messaging (FCM) integration.
  - Client-side generation and management of `fcm_token`s, storing them in `public.user_device_tokens`.
  - Supabase Database Triggers on `public.messages` and `public.contact_requests` to invoke Supabase Edge Functions.
  - Supabase Edge Functions to send push notification payloads to FCM using `fcm_token`s.
  - Robust handling of invalid/stale `fcm_token`s on the backend.

#### 4.8 Progressive Web App (PWA) Enhancements

- **User Stories:**
  - As a user, I want to be able to install the chat application to my device's home screen.
  - As a user, I want the application to function with basic capabilities even when offline (e.g., show cached UI, previously loaded messages).
- **Requirements:**
  - Web App Manifest file (`manifest.json`) configuration.
  - Service Worker implementation for caching static assets and basic offline capabilities.
  - Service Worker to intercept and handle FCM messages when the app is in the background.

#### 4.9 Admin Module

- **User Stories:**
  - As an admin user, I want to access a dedicated dashboard to view application statistics.
  - As an admin user, I want to see the total number of registered users.
  - As an admin user, I want to see the total number of devices registered for notifications.
  - As an admin user, I want to see the current number of active users.
  - As an admin user, I want to see the volume of messages sent per day, week, and month.
  - As an admin user, I want to view details of all registered users.
- **Requirements:**
  - Dedicated `is_admin` boolean flag in `public.profiles` for admin user identification.
  - Protected Next.js route (`/admin`) accessible only by the admin user.
  - Server Actions to fetch aggregated data (counts, message volume) directly from `public.profiles`, `public.user_device_tokens`, and `public.messages` tables.
  - UI to display stats using cards and charts.
  - UI to list and view details of all users (e.g., in a table).

---

### 5. Non-Functional Requirements

#### 5.1 Performance

- **Response Time:** API responses and page loads should be fast (e.g., under 500ms for common operations).
- **Real-time Latency:** Messages should appear instantly (sub-100ms) for active users.
- **Loading:** Initial page load times should be optimized via Server Components and efficient bundling.

#### 5.2 Security

- **Authentication:** Robust user authentication (email/password, OAuth) with secure session management.
- **Authorization:** Strict Row Level Security (RLS) on all Supabase tables to ensure users can only access/modify their own data or data they are explicitly authorized for.
- **Data Protection:** Use secure practices for data storage and transmission (HTTPS, encrypted data at rest via Supabase).
- **Vulnerability Protection:** Guard against common web vulnerabilities (XSS, SQL Injection, CSRF).

#### 5.3 Scalability

- **Database:** Supabase's managed PostgreSQL scales well for initial growth.
- **Real-time:** Supabase Realtime is designed for high concurrency.
- **Notifications:** FCM is a highly scalable notification service.
- **Frontend:** Next.js allows for efficient scaling of frontend services.

#### 5.4 Usability

- **Intuitive UI:** Clean, consistent, and easy-to-navigate user interface based on Shadcn/UI.
- **Responsiveness:** Application UI should be responsive and work seamlessly across various screen sizes (mobile, tablet, desktop).
- **Error Handling:** Clear and helpful error messages for users.

#### 5.5 Reliability

- **Uptime:** High availability for all core services (Supabase, FCM).
- **Data Integrity:** Ensure data consistency and integrity through proper database design and transactions.
- **Error Logging:** Implement robust logging for debugging and monitoring.

---

### 6. Future Considerations (Out of Scope for Initial Release)

- Voice and Video Calls
- Message editing and deletion (for all parties)
- Message reactions (emojis)
- Customizable user statuses
- Enhanced group roles and permissions
- File preview/thumbnails for more file types
- User blocking
- Read receipts in group chats
