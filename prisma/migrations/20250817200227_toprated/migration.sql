-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "averageRating" DECIMAL(3,2),
ADD COLUMN     "isTopRated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;
