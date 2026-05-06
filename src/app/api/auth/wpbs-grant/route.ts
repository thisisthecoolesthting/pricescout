import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createMagicLink } from "@/lib/auth/magic-link";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Default tenant display name for Winter Park Benefit Shop partner grants (operator-facing / email only — not public site copy).
const WPBS_DEFAULT_TENANT_NAME = "Winter Park Benefit Shop";

const bodySchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(120).optional(),
});

function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    return xf.split(",")[0]?.trim() || "0.0.0.0";
  }
  const real = req.headers.get("x-real-ip");
  return real?.trim() || "0.0.0.0";
}

export async function POST(req: Request) {
  try {
    const raw: unknown = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or name." }, { status: 400 });
    }
    const { email, name } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const ip = clientIp(req);

    const recent = await prisma.wpbsGrant.count({
      where: { ip, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    if (recent >= 5) {
      return NextResponse.json(
        { error: "Too many grants from this network. Try again tomorrow." },
        { status: 429 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const tenantName = name && name.length > 0 ? name : WPBS_DEFAULT_TENANT_NAME;
    const userDisplayName =
      name && name.length > 0 ? name : normalizedEmail.split("@")[0] ?? "Partner user";
    const unusablePassword = bcrypt.hashSync(`wpbs:${crypto.randomUUID()}`, 10);
    const slugSuffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);

    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        slug: `wpbs-${slugSuffix}`,
        subscriptionStatus: "WPBS",
        foundersTier: false,
        deviceLimit: 4,
        wpbsGrantedAt: new Date(),
        wpbsExpiresAt: expiresAt,
        wpbsSourceIp: ip,
        users: {
          create: {
            email: normalizedEmail,
            name: userDisplayName,
            passwordHash: unusablePassword,
            role: "OWNER",
          },
        },
      },
      include: { users: true },
    });

    const user = tenant.users[0];
    if (!user) {
      return NextResponse.json({ error: "server_error" }, { status: 500 });
    }

    await prisma.wpbsGrant.create({
      data: { email: normalizedEmail, ip, tenantId: tenant.id },
    });

    const magicLinkUrl = await createMagicLink(user.id);

    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmail({
          to: normalizedEmail,
          subject: "Your Winter Park Benefit Shop / PriceScout access",
          body: `Click to access your account (link valid 24 hours): ${magicLinkUrl}\n\nYour 30-day Pro access expires ${expiresAt.toDateString()}.\n\n— PriceScout, on behalf of WPBS`,
        });
        return NextResponse.json({ ok: true, sent: true });
      } catch (e) {
        console.error("WPBS email send failed", e);
        return NextResponse.json({ ok: true, sent: false, magicLinkUrl, tenantId: tenant.id });
      }
    }

    return NextResponse.json({ ok: true, sent: false, magicLinkUrl, tenantId: tenant.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
