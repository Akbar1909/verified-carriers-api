/*
  Warnings:

  - You are about to drop the column `verifiedBy` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `moderatedBy` on the `reviews` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ModeratorRole" AS ENUM ('ADMIN', 'SENIOR_MOD', 'CONTENT_MOD', 'COMPANY_MOD', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ModeratorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "verifiedBy",
ADD COLUMN     "verifiedById" TEXT;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "moderatedBy",
ADD COLUMN     "moderatedById" TEXT,
ADD COLUMN     "moderationReason" TEXT;

-- CreateTable
CREATE TABLE "moderators" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ModeratorRole" NOT NULL DEFAULT 'CONTENT_MOD',
    "status" "ModeratorStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "moderators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "moderators_email_key" ON "moderators"("email");

-- CreateIndex
CREATE INDEX "moderators_email_idx" ON "moderators"("email");

-- CreateIndex
CREATE INDEX "moderators_role_status_idx" ON "moderators"("role", "status");

-- CreateIndex
CREATE INDEX "moderators_status_idx" ON "moderators"("status");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "moderators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "moderators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
