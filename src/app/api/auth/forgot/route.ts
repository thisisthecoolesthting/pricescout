import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stub — wires transactional email in a later dispatch. */
export async function POST(req: Request) {
  await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    message: "If an account exists for that email, reset instructions follow shortly.",
  });
}
