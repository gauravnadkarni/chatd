/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "avatar_url",
ADD COLUMN     "avatar_file_name" TEXT;
