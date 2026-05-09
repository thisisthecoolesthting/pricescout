import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().max(80).optional().nullable(),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(8000),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, role, email, message } = parsed.data;

  try {
    await prisma.partnerSupportTicket.create({
      data: {
        partner: "wpbs",
        name,
        role: role && role.length > 0 ? role : null,
        email,
        message,
      },
    });
  } catch (e) {
    console.error("[partners/wpbs/support]", e);
    return NextResponse.json({ error: "Could not save request" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
