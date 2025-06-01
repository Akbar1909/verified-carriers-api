-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
