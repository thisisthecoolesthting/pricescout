import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE = "ps_session";

export type SessionClaims = {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
};

function getSecret(): Uint8Array {
  const s = process.env.PS_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("PS_SESSION_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(s);
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const p = payload as JWTPayload & Record<string, unknown>;
    const userId = typeof p.sub === "string" ? p.sub : null;
    const tenantId = typeof p.tenantId === "string" ? p.tenantId : null;
    const role = typeof p.role === "string" ? p.role : null;
    const email = typeof p.email === "string" ? p.email : null;
    if (!userId || !tenantId || !role || !email) return null;
    return { userId, tenantId, role, email };
  } catch {
    return null;
  }
}

/** Edge-safe verify (middleware) — same as verifySessionToken */
export async function verifySessionTokenEdge(
  token: string,
  secret: string,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    const p = payload as JWTPayload & Record<string, unknown>;
    const userId = typeof p.sub === "string" ? p.sub : null;
    const tenantId = typeof p.tenantId === "string" ? p.tenantId : null;
    const role = typeof p.role === "string" ? p.role : null;
    const email = typeof p.email === "string" ? p.email : null;
    if (!userId || !tenantId || !role || !email) return null;
    return { userId, tenantId, role, email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionClaims | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  return verifySessionToken(raw);
}

export { COOKIE as SESSION_COOKIE_NAME };

/** Create HS256 JWT for ps_session cookie (Node runtime — login route). */
export async function signSessionToken(p: {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
}): Promise<string> {
  const s = process.env.PS_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("PS_SESSION_SECRET must be set (min 16 chars)");
  }
  return new SignJWT({
    tenantId: p.tenantId,
    role: p.role,
    email: p.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(p.userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(s));
}
