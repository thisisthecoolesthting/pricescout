import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const acceptSchema = z.object({
  name: z.string().min(1).max(120),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = acceptSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { name, password } = parsed.data;

  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.redeemedAt) {
    return NextResponse.json({ error: "Invalid or used invite" }, { status: 400 });
  }
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite expired" }, { status: 400 });
  }

  const email = invite.email.toLowerCase();
  const clash = await prisma.user.findUnique({ where: { email } });
  if (clash) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  await prisma.$transaction([
    prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: invite.role,
        tenantId: invite.tenantId,
      },
    }),
    prisma.invite.update({
      where: { id: invite.id },
      data: { redeemedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
