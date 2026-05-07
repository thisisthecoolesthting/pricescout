-- PRICESCOUT-ADMIN-STUBS-FILL-015: Invite + tenant operator settings (additive only).

CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentByUserId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");
CREATE INDEX "Invite_tenantId_email_idx" ON "Invite"("tenantId", "email");

ALTER TABLE "Invite" ADD CONSTRAINT "Invite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Tenant" ADD COLUMN "storeAddress" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "defaultCurrency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "Tenant" ADD COLUMN "tagPriceRounding" TEXT NOT NULL DEFAULT 'nearest_1';
ALTER TABLE "Tenant" ADD COLUMN "defaultScannerRole" TEXT NOT NULL DEFAULT 'scanner';
ALTER TABLE "Tenant" ADD COLUMN "currentPeriodEnd" TIMESTAMP(3);
