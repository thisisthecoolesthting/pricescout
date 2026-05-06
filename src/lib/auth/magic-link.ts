/**
 * Short-lived magic login JWT for WPBS partner grants (dispatch 008).
 * Distinct from the 30-day ps_session cookie — this token is single-purpose and expires in 24h.
 */
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const KIND = "wpbs_magic";

function getSecret(): Uint8Array {
  const s = process.env.PS_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("PS_SESSION_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(s);
}

export async function signMagicLoginToken(userId: string): Promise<string> {
  return new SignJWT({ kind: KIND })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyMagicLoginToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const p = payload as JWTPayload & Record<string, unknown>;
    if (p.kind !== KIND) return null;
    return typeof p.sub === "string" ? p.sub : null;
  } catch {
    return null;
  }
}

/** Full URL consumed by GET /api/auth/magic-login — sets ps_session and redirects to /admin. */
export async function createMagicLink(userId: string): Promise<string> {
  const t = await signMagicLoginToken(userId);
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3300";
  return `${base.replace(/\/$/, "")}/api/auth/magic-login?token=${encodeURIComponent(t)}`;
}
