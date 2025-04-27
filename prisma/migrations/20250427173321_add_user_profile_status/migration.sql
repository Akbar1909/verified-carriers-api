-- CreateEnum
CREATE TYPE "UserProfileStatus" AS ENUM ('INITIAL', 'COMPLETE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profileStatus" "UserProfileStatus" NOT NULL DEFAULT 'INITIAL';
