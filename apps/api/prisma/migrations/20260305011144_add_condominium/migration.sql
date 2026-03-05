-- CreateTable
CREATE TABLE "Condominium" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Condominium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Condominium_name_idx" ON "Condominium"("name");

-- CreateIndex
CREATE INDEX "PackageDelivery_condominiumId_status_idx" ON "PackageDelivery"("condominiumId", "status");

-- AddForeignKey
ALTER TABLE "PackageDelivery" ADD CONSTRAINT "PackageDelivery_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "Condominium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
