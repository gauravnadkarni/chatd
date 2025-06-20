### Complete Database Design Overview

**Core Principle:** All custom tables in the `public` schema will link to `auth.users` (Supabase's built-in user table) via `UUID` foreign keys, which is Supabase's managed authentication system.

---

**1. `auth.users` (Managed by Supabase)**

- **Purpose:** Stores core user authentication data (email, password hash, OAuth IDs, etc.). This table is automatically managed by Supabase Auth and serves as the foundational user identity source.
- **Key Fields:**
  - `id` (UUID, Primary Key)
  - `email` (Text)
  - `created_at` (Timestamp)
  - _(other fields automatically managed by Supabase Auth, e.g., `last_sign_in_at`, `role`)_
- **Relationships:** This table is the central point to which all other user-related tables link.

---

**2. `public.profiles` Table**

- **Purpose:** Stores public user profile information, application-specific user metadata, and identifies admin users.
- **Key Fields:**
  - `id` (UUID, Primary Key, Foreign Key to `auth.users.id`)
  - `name` (Text): User's display name.
  - `avatar_file_name` (Text): URL to user's profile picture in Supabase Storage.
  - `online_at` (Timestamp): Timestamp for last known online activity, used for presence.
  - **`is_admin` (Boolean, Default `FALSE`): Indicates if this user is an administrator.**
  - `created_at` (Timestamp)
- **Relationships:**
  - **One-to-One:** Each `auth.users` record has exactly one corresponding `public.profiles` record.

---

**3. `public.user_device_tokens` Table**

- **Purpose:** Stores all active Firebase Cloud Messaging (FCM) tokens for a user across their various devices, enabling targeted push notifications to all active instances of the app.
- **Key Fields:**
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key to `auth.users.id`): The user who owns this device token.
  - `fcm_token` (Text, Unique): The unique Firebase Cloud Messaging token for a specific device/app instance.
  - `platform` (Text): e.g., 'web', 'android', 'ios', 'desktop' to identify the device type.
  - `last_seen_at` (Timestamp): Timestamp of the last time this token was used/updated.
  - `created_at` (Timestamp)
- **Relationships:**
  - **Many-to-One:** Many device tokens can belong to one user (`auth.users`).

---

**4. `public.contacts` Table**

- **Purpose:** Manages the established, mutual contact relationships between users. This table represents users who have explicitly accepted each other as contacts.
- **Key Fields:**
  - `user_id` (UUID, Primary Key part, Foreign Key to `auth.users.id`): The user who _owns_ this contact entry.
  - `contact_id` (UUID, Primary Key part, Foreign Key to `auth.users.id`): The user who _is_ their contact.
  - `created_at` (Timestamp)
- **Relationships:**
  - **Many-to-Many:** Models a many-to-many relationship between `auth.users` (a user can have many contacts, and a user can be a contact for many others). Requires two entries for a mutual connection (A adds B, B adds A).

---

**5. `public.contact_requests` Table (NEW!)**

- **Purpose:** To store the state of pending, accepted, or declined contact requests between users. This enables a robust friend request system.
- **Key Fields:**
  - `id` (UUID, Primary Key)
  - `sender_id` (UUID, Foreign Key to `auth.users.id`): The user who initiated the contact request.
  - `recipient_id` (UUID, Foreign Key to `auth.users.id`): The user who is intended to receive and respond to the request.
  - `status` (Enum: 'pending', 'accepted', 'declined', 'blocked'): The current state of the request.
  - `created_at` (Timestamp): When the request was initially sent.
  - `updated_at` (Timestamp): When the request's status was last modified.
- **Relationships:**
  - **Many-to-One:** Both `sender_id` and `recipient_id` link to `auth.users`.
- **Constraints:**
  - Unique constraint on `(sender_id, recipient_id, status)` where status is 'pending' to prevent duplicate pending requests.
  - A check constraint to prevent a user from sending a request to themselves.

---

**6. `public.groups` Table**

- **Purpose:** Stores metadata for all chat groups created within the application (e.g., group name, creator).
- **Key Fields:**
  - `id` (UUID, Primary Key)
  - `name` (Text): The name of the group.
  - `creator_id` (UUID, Foreign Key to `auth.users.id`): The user who initially created the group.
  - `avatar_url` (Text): Optional URL to the group's avatar/picture.
  - `created_at` (Timestamp)
- **Relationships:**
  - **One-to-Many:** One user (`auth.users`) can create many groups.

---

**7. `public.group_members` Table**

- **Purpose:** A junction table that links users to the specific groups they belong to, defining group membership and member roles.
- **Key Fields:**
  - `group_id` (UUID, Primary Key part, Foreign Key to `public.groups.id`)
  - `member_id` (UUID, Primary Key part, Foreign Key to `auth.users.id`)
  - `role` (Text): e.g., 'admin', 'member' to define permissions within the group context.
  - `joined_at` (Timestamp)
- **Relationships:**
  - **Many-to-Many:** Models a many-to-many relationship between `public.groups` and `auth.users` (many users can be in many groups, and a group can have many members).

---

**8. `public.messages` Table**

- **Purpose:** Stores all individual chat messages, including text and multimedia content, designed to handle both one-on-one and group conversations.
- **Key Fields:**
  - `id` (UUID, Primary Key)
  - `sender_id` (UUID, Foreign Key to `auth.users.id`): The user who sent the message.
  - `group_id` (UUID, Foreign Key to `public.groups.id`, _Nullable_): The group ID if it's a group message.
  - `recipient_id` (UUID, Foreign Key to `auth.users.id`, _Nullable_): The recipient's user ID if it's a 1:1 message.
  - `content` (Text): The actual text content of the message.
  - `media_url` (Text): URL to media (image, file) stored in Supabase Storage.
  - `media_type` (Enum: 'text', 'image', 'file'): Indicates the type of content in the message.
  - `sent_at` (Timestamp): When the message was sent.
  - `read_at` (Timestamp): When the message was read by the recipient (primarily for 1:1 chats).
  - `deleted_by_sender` (Boolean): A flag for soft deletion of messages by the sender.
- **Relationships:**
  - **Many-to-One:** Many messages can originate from one sender (`auth.users`).
  - **Many-to-One:** Many messages can belong to one group (`public.groups`).
  - **Many-to-One:** Many messages can be sent to one recipient (`auth.users`).
  - **Conditional:** A message must be designated for either a `group_id` OR a `recipient_id`, but not both or neither.

---

**9. `public.user_conversation_status` Table**

- **Purpose:** Optimizes the calculation and display of unread message counts and tracks the last message seen by a user within each specific conversation (both 1:1 and group chats).
- **Key Fields:**
  - `user_id` (UUID, Primary Key part, Foreign Key to `auth.users.id`): The user whose conversation status is being tracked.
  - `group_id` (UUID, Foreign Key to `public.groups.id`, _Nullable_): The ID of the group if the conversation is a group chat.
  - `other_participant_id` (UUID, Foreign Key to `auth.users.id`, _Nullable_): The ID of the other user if the conversation is a 1:1 chat.
  - `last_seen_message_id` (UUID, Foreign Key to `public.messages.id`, _Nullable_): The ID of the last message the `user_id` has viewed in this conversation.
  - `unread_count` (Integer): The number of unread messages for `user_id` in this specific conversation.
  - `updated_at` (Timestamp): When this status record was last modified.
- **Relationships:**
  - **Composite Primary Key:** (`user_id`, `group_id`, `other_participant_id`) ensures a unique status record for each user within a specific conversation.
  - **Foreign Keys:** Links to `auth.users` (for `user_id` and `other_participant_id`), `public.groups` (for `group_id`), and `public.messages` (for `last_seen_message_id`).
  - **Conditional:** A record must specify either a `group_id` OR an `other_participant_id`, but not both or neither.
