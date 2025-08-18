/*
  Warnings:

  - The primary key for the `ZipCode` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ZipCode" DROP CONSTRAINT "ZipCode_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ZipCode_pkey" PRIMARY KEY ("id");
