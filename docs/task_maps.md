## 1.0 Phase 1: Foundation & Core Setup

These are the foundational tasks that must be completed before significant feature development can begin.

### 1.1 Supabase Project Initialization

- [x] 1.1.1 Create Supabase Project
- [x] 1.1.2 Configure Supabase API Keys (Public/Anon, Service Role)

### 1.2 Database Schema Implementation

_Dependencies:_ 1.1.1

- 1.2.1 Implement `public.profiles` table (including `is_admin` column)
- 1.2.2 Implement `public.user_device_tokens` table
- 1.2.3 Implement `public.contacts` table
- 1.2.4 Implement `public.contact_requests` table
- 1.2.5 Implement `public.groups` table
- 1.2.6 Implement `public.group_members` table
- 1.2.7 Implement `public.messages` table
- 1.2.8 Implement `public.user_conversation_status` table

### 1.3 Initial Row Level Security (RLS) Policies

_Dependencies:_ All of 1.2.x (relevant tables must exist)

- 1.3.1 Configure RLS for `public.profiles`
- 1.3.2 Configure RLS for `public.user_device_tokens`
- 1.3.3 Configure RLS for `public.contacts`
- 1.3.4 Configure RLS for `public.contact_requests`
- 1.3.5 Configure RLS for `public.groups`
- 1.3.6 Configure RLS for `public.group_members`
- 1.3.7 Configure RLS for `public.messages`
- 1.3.8 Configure RLS for `public.user_conversation_status`

### 1.4 Next.js Project Setup & Core Utilities

_Dependencies:_ 1.1.1

- 1.4.1 Initialize Next.js Project (App Router)
- 1.4.2 Configure Tailwind CSS
- 1.4.3 Integrate Shadcn/UI Component Library
- 1.4.4 Install Core Development Dependencies (`@supabase/ssr`, `react-hook-form`, `zod`, etc.)
- 1.4.5 Create Supabase Client Utilities (Server Component Client, Client Component Client)

---

## 2.0 Phase 2: User Onboarding

This phase focuses on enabling users to sign up, log in, and manage their basic identity within the app.

### 2.1 User Authentication

_Dependencies:_ All of 1.0 (Phase 1)

- 2.1.1 Enable Auth Providers (Email/Password, Google, Facebook) in Supabase Dashboard.
- 2.1.2 Implement Supabase Database Trigger (`handle_new_user`) for automatic `public.profiles` creation on new user signup.
- 2.1.3 Develop Login and Signup UI (Client Components using `react-hook-form`, `zod`).
- 2.1.4 Implement Authentication Server Actions (`signInWithPassword`, `signUp`).
- 2.1.5 Implement OAuth Callback Route (`/auth/callback/route.ts`) for social logins.
- 2.1.6 Implement Protected Routes and Client-side Authentication Context for global auth state.

### 2.2 User Profile Management

_Dependencies:_ 2.1.6 (authenticated user context)

- 2.2.1 Implement User Profile Update UI.
- 2.2.2 Implement Profile Update Server Action (for `name`, `avatar_url`).

---

## 3.0 Phase 3: Core Communication - Contacts & One-on-One Messaging

This phase establishes the fundamental ability for users to connect and chat privately.

### 3.1 Contact List Management

_Dependencies:_ All of 1.0 (Phase 1), 2.1.6 (authenticated user context)

- 3.1.1 Implement User Search UI & Server Action (searching `public.profiles`, filtering self/existing relationships).
- 3.1.2 Implement Send Contact Request UI & Server Action (inserts into `public.contact_requests`).
- 3.1.3 Implement UI to Display Sent and Received Pending Contact Requests.
- 3.1.4 Implement Accept/Decline Contact Request UI & Server Actions (updates `public.contact_requests`, inserts mutual entries into `public.contacts`).
- 3.1.5 Implement UI to Display "My Contacts" List (queries `public.contacts` joined with `public.profiles`).
- 3.1.6 Implement Remove Contact UI & Server Action (deletes mutual entries from `public.contacts`).

### 3.2 One-on-One Messaging

_Dependencies:_ All of 1.0 (Phase 1), 2.1.6, 3.1.5 (requires established contacts)

- 3.2.1 Implement 1:1 Chat UI (message display, input field).
- 3.2.2 Implement Send Message Server Action.
- 3.2.3 Implement Supabase Realtime Subscription for receiving 1:1 messages in real-time.
- 3.2.4 Implement Read Receipts Logic (update `read_at` in `public.messages`, update `last_seen_message_id` in `public.user_conversation_status`).

### 3.3 Unread Message Tracking

_Dependencies:_ 3.2.4 (message reading logic)

- 3.3.1 Implement Logic for `unread_count` updates in `public.user_conversation_status`.
- 3.3.2 Implement UI to display unread counts on conversation list items.

---

## 4.0 Phase 4: Advanced Communication & Enhancements

This phase adds group chat functionality and extends the core messaging with media, presence, and notifications.

### 4.1 Group Chat Management

_Dependencies:_ All of 1.0 (Phase 1), 2.1.6, 3.1.5 (optional, but good to have contacts to invite)

- 4.1.1 Implement Create Group UI & Server Action (inserts into `public.groups`).
- 4.1.2 Implement Add/Invite Members UI & Server Action (inserts into `public.group_members`).
- 4.1.3 Implement Group Chat UI & Messaging (similar to 1:1, but uses `group_id` in `public.messages`).

### 4.2 Media Sharing

_Dependencies:_ All of 1.0 (Phase 1), 3.2 (core messaging), 4.1.3 (for group media)

- 4.2.1 Configure Supabase Storage Buckets for media.
- 4.2.2 Implement File Upload UI (Image/File picker).
- 4.2.3 Implement Media Upload Server Action (uploads to Supabase Storage, returns URL).
- 4.2.4 Modify Send Message Server Action to include `media_url` and `media_type`.
- 4.2.5 Implement Media Display in Chat UI (inline images, downloadable files).

### 4.3 Real-time Presence

_Dependencies:_ All of 1.0 (Phase 1), 2.1.6

- 4.3.1 Implement `online_at` updates in `public.profiles` on user activity.
- 4.3.2 Implement Supabase Realtime presence channel subscription/broadcast.
- 4.3.3 Implement UI to display online/offline status for contacts.
- 4.3.4 Implement Typing Indicator logic and UI.

### 4.4 Push Notifications (FCM)

_Dependencies:_ 1.1.1, 1.2.2, 3.2.2, 4.1.3, 4.3.1 (any features that trigger notifications)

- 4.4.1 Configure Firebase Project and FCM.
- 4.4.2 Implement `fcm_token` generation and registration (storage in `public.user_device_tokens`).
- 4.4.3 Implement Supabase Database Triggers (on `public.messages` insert, `public.contact_requests` status update).
- 4.4.4 Implement Supabase Edge Functions to receive trigger events and send FCM payloads.

### 4.5 Progressive Web App (PWA) Enhancements

_Dependencies:_ 4.4.4 (for FCM integration)

- 4.5.1 Implement Web App Manifest (`manifest.json`).
- 4.5.2 Implement Service Worker for caching and basic offline capabilities.
- 4.5.3 Integrate Service Worker for handling background FCM messages.

---

## 5.0 Phase 5: Admin Module & Finalization

This phase adds the administrative interface and prepares the application for deployment.

### 5.1 Admin Module

_Dependencies:_ All of 1.0 (Phase 1), 2.1.6 (authenticated user context), and data from other features (for stats).

- 5.1.1 Manual Admin Role Assignment (`is_admin = TRUE` in `public.profiles` for designated user).
- 5.1.2 Implement Admin Protected Route (`/admin`) with `is_admin` check.
- 5.1.3 Implement Server Actions for fetching various stats (users, devices, active users, message volume).
- 5.1.4 Develop Admin Dashboard UI (using Shadcn/UI for cards, charts).
- 5.1.5 Implement User Details Listing UI for admin.

### 5.2 Testing & Bug Fixing

_Dependencies:_ All development features completed.

- 5.2.1 Perform Unit Testing.
- 5.2.2 Conduct Integration Testing.
- 5.2.3 Execute User Acceptance Testing (UAT).

### 5.3 Deployment Preparation

_Dependencies:_ All testing completed.

- 5.3.1 Configure Environment Variables for Production.
- 5.3.2 Optimize Build Process for Production.
