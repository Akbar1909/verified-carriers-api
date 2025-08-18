/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId,date]` on the table `company_views` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `company_views` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company_views" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "company_views_userId_companyId_date_key" ON "company_views"("userId", "companyId", "date");
