-- CreateTable
CREATE TABLE "ZipCode" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "primary_city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "county" TEXT,

    CONSTRAINT "ZipCode_pkey" PRIMARY KEY ("id")
);
