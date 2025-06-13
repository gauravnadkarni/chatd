/*
  Warnings:

  - You are about to drop the column `username` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "profiles_username_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "username",
ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
