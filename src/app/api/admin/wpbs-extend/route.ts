import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isTenantOwnerRole } from "@/lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Owner-only: extend WPBS partner window by 30 days. */
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isTenantOwnerRole(session.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } });
  if (!tenant || tenant.subscriptionStatus !== "WPBS") {
    return NextResponse.json({ error: "Not a WPBS tenant" }, { status: 400 });
  }

  const base = tenant.wpbsExpiresAt ?? new Date();
  const next = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { wpbsExpiresAt: next },
  });

  return NextResponse.json({ ok: true, wpbsExpiresAt: next.toISOString() });
}
