-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('RECEIVED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "PackagePhotoType" AS ENUM ('ARRIVAL', 'PICKUP_PROOF');

-- CreateEnum
CREATE TYPE "PackageEventType" AS ENUM ('RECEIVED', 'NOTIFIED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateTable
CREATE TABLE "PackageDelivery" (
    "id" TEXT NOT NULL,
    "condominiumId" TEXT NOT NULL,
    "unitId" TEXT,
    "recipientPersonId" TEXT,
    "carrier" TEXT,
    "trackingCode" TEXT,
    "description" TEXT,
    "status" "PackageStatus" NOT NULL DEFAULT 'RECEIVED',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedByPersonId" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "deliveredByPersonId" TEXT,
    "deliveredToName" TEXT,
    "deliveredToDocument" TEXT,
    "deliveredToPersonId" TEXT,
    "notes" TEXT,
    "createdVia" TEXT NOT NULL DEFAULT 'PORTARIA',
    "externalThreadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePhoto" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoType" "PackagePhotoType" NOT NULL DEFAULT 'ARRIVAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackagePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageEvent" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PackageEventType" NOT NULL,
    "performedByPersonId" TEXT,
    "payload" JSONB,

    CONSTRAINT "PackageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PackageDelivery_unitId_status_idx" ON "PackageDelivery"("unitId", "status");

-- CreateIndex
CREATE INDEX "PackageDelivery_trackingCode_idx" ON "PackageDelivery"("trackingCode");

-- CreateIndex
CREATE INDEX "PackagePhoto_packageId_idx" ON "PackagePhoto"("packageId");

-- CreateIndex
CREATE INDEX "PackageEvent_packageId_occurredAt_idx" ON "PackageEvent"("packageId", "occurredAt");

-- AddForeignKey
ALTER TABLE "PackagePhoto" ADD CONSTRAINT "PackagePhoto_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PackageDelivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageEvent" ADD CONSTRAINT "PackageEvent_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PackageDelivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
