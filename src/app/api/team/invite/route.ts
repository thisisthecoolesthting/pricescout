import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { inviteUiRoleToUserRole, isTenantOwnerRole } from "@/lib/roles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inviteBodySchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "scanner"]),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isTenantOwnerRole(session.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const invites = await prisma.invite.findMany({
    where: { tenantId: session.tenantId, redeemedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ invites });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isTenantOwnerRole(session.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = inviteBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { email, role } = parsed.data;
  const normalized = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await prisma.invite.create({
    data: {
      tenantId: session.tenantId,
      email: normalized,
      role: inviteUiRoleToUserRole(role),
      token,
      expiresAt,
      sentByUserId: session.userId,
    },
  });

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://pricescout.pro";
  const inviteUrl = `${origin}/invite/${token}`;

  return NextResponse.json({ ok: true, inviteUrl });
}
