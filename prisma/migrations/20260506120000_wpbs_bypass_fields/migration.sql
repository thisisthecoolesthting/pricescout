-- WPBS partner bypass + grant audit (dispatch 008)

ALTER TABLE "Tenant" ADD COLUMN "wpbsGrantedAt" TIMESTAMP(3),
ADD COLUMN "wpbsExpiresAt" TIMESTAMP(3),
ADD COLUMN "wpbsSourceIp" TEXT;

CREATE TABLE "WpbsGrant" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WpbsGrant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WpbsGrant_ip_createdAt_idx" ON "WpbsGrant"("ip", "createdAt");

ALTER TABLE "WpbsGrant" ADD CONSTRAINT "WpbsGrant_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
