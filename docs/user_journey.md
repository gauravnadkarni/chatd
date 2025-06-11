## User Journey Document - Chat Application

**Document Version:** 1.0 **Date:** June 7, 2025 **Author:** Gemini AI **Product:** Real-time Chat Application

---

### 1. Introduction

#### 1.1 Purpose

This document outlines the typical paths and interactions users will have with the chat application. It maps out the steps users take to achieve their goals, providing a user-centric view of the application's functionality.

#### 1.2 Key User Personas

- **New User:** An individual who has not yet created an account.
- **Existing User:** A registered user who regularly uses the application for communication.
- **Admin User:** A specific, designated user with privileged access to application statistics.

---

### 2. Core User Journeys

#### 2.1 Journey 1: New User Onboarding & First Connection

- **Goal:** Successfully register, create a profile, and connect with a first contact.
- **User:** New User
- **Flow:**
  1. **Arrives at Landing Page/Login:** Sees options to Login or Sign Up.
  2. **Action:** Clicks "Sign Up".
  3. **System:** Displays Registration Form (Email, Password, Name).
  4. **Action:** Fills out details and clicks "Register" (or clicks "Sign Up with Google/Facebook").
  5. **System (Email/Password):** Validates input, creates `auth.users` entry, triggers `public.profiles` creation, logs in the user, redirects to the main app dashboard.
  6. **System (Social Auth):** Redirects to OAuth provider, user approves, redirects back to `/auth/callback`, Supabase exchanges code for session, logs in user, triggers `public.profiles` creation, redirects to dashboard.
  7. **User:** Lands on Dashboard/Home. Sees an empty contact list.
  8. **Action:** Navigates to "Add Contact" or "Find Friends" section.
  9. **System:** Displays a search bar.
  10. **Action:** Types a contact's name/email in the search bar.
  11. **System:** Displays relevant user profiles, each with an "Add Contact" button.
  12. **Action:** Clicks "Add Contact" for a desired user.
  13. **System:** Sends a contact request (inserts into `public.contact_requests` as 'pending'). The button changes to "Request Sent".
  14. **User:** Sees confirmation that request is sent.
  15. _(Assuming Recipient's Journey)_: Recipient receives an in-app notification (Realtime) or a push notification (FCM) for the new request.
  16. **Recipient Action:** Navigates to "Requests" section, sees the pending request.
  17. **Recipient Action:** Clicks "Accept".
  18. **System:** Updates `contact_requests` to 'accepted', inserts mutual entries into `public.contacts`.
  19. **User (Original Sender):** Receives a notification that their request was accepted. The new contact now appears in their "My Contacts" list.
  20. **User:** Successfully connected with their first contact.

#### 2.2 Journey 2: Daily Chatting & Communication

- **Goal:** Engage in real-time conversations with contacts.
- **User:** Existing User
- **Flow:**
  1. **Action:** Opens the app.
  2. **System:** Logs in automatically (if session active) or prompts for login. Fetches initial data (contact list, recent conversations, unread counts).
  3. **User:** Sees a list of conversations (1:1 and groups) and potentially unread counts on icons.
  4. **Action:** Clicks on a contact/group to open a chat.
  5. **System:** Displays the conversation history. Updates `public.user_conversation_status` for read receipts/unread count.
  6. **User:** Types a message in the input field.
  7. **System:** (Optional) Displays a "typing..." indicator to the recipient(s) via Realtime.
  8. **Action:** Clicks "Send".
  9. **System:** Inserts message into `public.messages`.
  10. **System (Real-time):** Broadcasts the new message via Supabase Realtime to all active participants in the conversation.
  11. **System (Notifications):** Triggers FCM push notification for recipients who are offline/backgrounded via Edge Function.
  12. **User (Sender):** Message appears in their own chat window instantly.
  13. **User (Recipient - In-app):** Message appears instantly in their chat window.
  14. **User (Recipient - Out-of-app):** Receives a system push notification. Clicks it to open the app and view the message.
  15. **User:** Continues the conversation, potentially sending multiple messages.

#### 2.3 Journey 3: Managing Existing Contacts

- **Goal:** Manage relationships with existing contacts.
- **User:** Existing User
- **Flow:**
  1. **Action:** Navigates to "My Contacts" list.
  2. **System:** Displays all mutual contacts.
  3. **Action:** Clicks an options icon next to a contact.
  4. **System:** Displays a "Remove Contact" option.
  5. **Action:** Clicks "Remove Contact".
  6. **System:** Prompts for confirmation.
  7. **Action:** Confirms removal.
  8. **System:** Deletes mutual entries from `public.contacts` table.
  9. **User:** Contact is removed from their list.

#### 2.4 Journey 4: Group Chat Creation & Participation

- **Goal:** Create a new group and communicate within it.
- **User:** Existing User
- **Flow:**
  1. **Action:** Navigates to "Groups" section.
  2. **Action:** Clicks "Create New Group".
  3. **System:** Prompts for Group Name.
  4. **Action:** Enters group name, clicks "Create".
  5. **System:** Creates new entry in `public.groups` and adds creator to `public.group_members`. Displays "Add Members" screen.
  6. **Action:** Selects contacts to invite/add to the group.
  7. **System:** Adds selected contacts to `public.group_members`.
  8. **User:** Enters the newly created group chat and starts sending messages (similar to 1:1 messaging flow).

#### 2.5 Journey 5: Sharing Media in Chat

- **Goal:** Send an image or file to a contact/group.
- **User:** Existing User
- **Flow:**
  1. **Action:** Opens a 1:1 or group chat.
  2. **Action:** Clicks the "Attach" or "Media" icon.
  3. **System:** Displays file selection options (e.g., photo library, browse files).
  4. **Action:** Selects an image/file from their device.
  5. **System:** Displays a preview of the selected media.
  6. **Action:** Clicks "Send" (with an optional caption).
  7. **System:** Uploads the file to Supabase Storage, then inserts a message into `public.messages` with `media_url` and `media_type`.
  8. **System (Real-time/Notifications):** Notifies recipients as with text messages.
  9. **User (Recipient):** Receives the message, sees the image inline or a download link for other file types.

#### 2.6 Journey 6: Admin Dashboard Access

- **Goal:** View application statistics.
- **User:** Admin User
- **Flow:**
  1. **Action:** Logs in to the application.
  2. **Action:** Navigates to the `/admin` route (either directly or via a hidden link/button).
  3. **System:** Verifies `is_admin` status. If confirmed, displays the Admin Dashboard. If not, redirects to a forbidden page or login.
  4. **User (Admin):** Views summary statistics: Total Users, Total Devices, Active Users, Message Volume (by day/week/month).
  5. **User (Admin):** Can browse a list of all registered users and their basic details.
