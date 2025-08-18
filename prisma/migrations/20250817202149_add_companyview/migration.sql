-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "company_views" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "company_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_views_userId_idx" ON "company_views"("userId");

-- CreateIndex
CREATE INDEX "company_views_companyId_idx" ON "company_views"("companyId");

-- AddForeignKey
ALTER TABLE "company_views" ADD CONSTRAINT "company_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_views" ADD CONSTRAINT "company_views_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
