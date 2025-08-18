/*
  Warnings:

  - You are about to drop the column `type` on the `review_reactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "review_reactions" DROP COLUMN "type";

-- DropEnum
DROP TYPE "ReviewReactionType";
