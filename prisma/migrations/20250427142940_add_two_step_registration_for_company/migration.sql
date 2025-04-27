-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('INITIAL', 'COMPLETE', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('FULL_TRUCKLOAD', 'LESS_THAN_TRUCKLOAD', 'INTERMODAL', 'REFRIGERATED', 'FLATBED', 'HEAVY_HAUL', 'EXPEDITED', 'HAZARDOUS_MATERIALS', 'WHITE_GLOVE', 'LAST_MILE', 'WAREHOUSING', 'CROSS_BORDER', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "visibleName" TEXT,
    "phoneNumber" TEXT,
    "contactEmail" TEXT,
    "country" TEXT,
    "state" TEXT,
    "bio" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "salesEmail" TEXT,
    "contactPhone" TEXT,
    "mcNumber" TEXT,
    "usdotNumber" TEXT,
    "foundingYear" INTEGER,
    "totalEmployees" INTEGER,
    "aboutCompany" TEXT,
    "workEmail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'INITIAL',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "userId" TEXT,
    "companyLogoId" TEXT,
    "reviewPhotoId" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_logos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "company_logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceName" "ServiceType" NOT NULL,
    "description" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_information" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "email" TEXT,
    "officeAddress" TEXT,
    "contactType" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "contact_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "pickupState" TEXT,
    "deliveryState" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "transportationPrice" DECIMAL(10,2),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "shipmentType" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "moderatedAt" TIMESTAMP(3),
    "moderatedBy" TEXT,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_photos" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "review_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_mcNumber_key" ON "companies"("mcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "companies_usdotNumber_key" ON "companies"("usdotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "companies_workEmail_key" ON "companies"("workEmail");

-- CreateIndex
CREATE UNIQUE INDEX "files_userId_key" ON "files"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "files_companyLogoId_key" ON "files"("companyLogoId");

-- CreateIndex
CREATE UNIQUE INDEX "files_reviewPhotoId_key" ON "files"("reviewPhotoId");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_companyLogoId_fkey" FOREIGN KEY ("companyLogoId") REFERENCES "company_logos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_reviewPhotoId_fkey" FOREIGN KEY ("reviewPhotoId") REFERENCES "review_photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_logos" ADD CONSTRAINT "company_logos_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_information" ADD CONSTRAINT "contact_information_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_photos" ADD CONSTRAINT "review_photos_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
