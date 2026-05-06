import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMagicLoginToken } from "@/lib/auth/magic-link";
import { SESSION_COOKIE_NAME, signSessionToken } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Consumes WPBS magic-link token; issues ps_session and sends the user to /admin. */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/login?error=missing_token", url.origin));
    }
    const userId = await verifyMagicLoginToken(token);
    if (!userId) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", url.origin));
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.redirect(new URL("/login?error=unknown_user", url.origin));
    }

    const sessionJwt = await signSessionToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
    });

    const res = NextResponse.redirect(new URL("/admin", url.origin));
    res.cookies.set(SESSION_COOKIE_NAME, sessionJwt, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    console.error(e);
    const url = new URL(req.url);
    return NextResponse.redirect(new URL("/login?error=server", url.origin));
  }
}
