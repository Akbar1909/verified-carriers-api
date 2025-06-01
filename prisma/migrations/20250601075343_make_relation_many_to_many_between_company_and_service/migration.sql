/*
  Warnings:

  - You are about to drop the column `companyId` on the `services` table. All the data in the column will be lost.
  - Changed the type of `serviceName` on the `services` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_companyId_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "companyId",
DROP COLUMN "serviceName",
ADD COLUMN     "serviceName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "company_services" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "company_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_services_companyId_serviceId_key" ON "company_services"("companyId", "serviceId");

-- AddForeignKey
ALTER TABLE "company_services" ADD CONSTRAINT "company_services_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_services" ADD CONSTRAINT "company_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
