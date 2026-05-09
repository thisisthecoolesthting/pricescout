-- CreateTable
CREATE TABLE "PartnerSupportTicket" (
    "id" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "PartnerSupportTicket_pkey" PRIMARY KEY ("id")
);
