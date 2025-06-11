-- CreateEnum
CREATE TYPE "ContactRequestStatus" AS ENUM ('pending', 'accepted', 'declined', 'blocked');

-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('member', 'admin');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "username" TEXT,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "website" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "online_at" TIMESTAMPTZ(6),

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_device_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "fcm_token" TEXT NOT NULL,
    "platform" TEXT,
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "contact_id" UUID NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" SERIAL NOT NULL,
    "sender_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "status" "ContactRequestStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "creator_id" UUID NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" SERIAL NOT NULL,
    "group_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "role" "GroupMemberRole" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "group_id" UUID,
    "recipient_id" UUID,
    "content" TEXT,
    "media_url" TEXT,
    "media_type" TEXT,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMPTZ(6),
    "deleted_by_sender" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_conversation_status" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "group_id" UUID,
    "other_participant_id" UUID,
    "last_seen_message_id" UUID,
    "unread_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_conversation_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_tokens_fcm_token_key" ON "user_device_tokens"("fcm_token");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_user_id_contact_id_key" ON "contacts"("user_id", "contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_requests_sender_id_recipient_id_key" ON "contact_requests"("sender_id", "recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_group_id_member_id_key" ON "group_members"("group_id", "member_id");

-- CreateIndex
CREATE INDEX "messages_group_id_idx" ON "messages"("group_id");

-- CreateIndex
CREATE INDEX "messages_recipient_id_idx" ON "messages"("recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_conversation_status_user_id_group_id_key" ON "user_conversation_status"("user_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_conversation_status_user_id_other_participant_id_key" ON "user_conversation_status"("user_id", "other_participant_id");

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_conversation_status" ADD CONSTRAINT "user_conversation_status_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_conversation_status" ADD CONSTRAINT "user_conversation_status_last_seen_message_id_fkey" FOREIGN KEY ("last_seen_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
