import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InviteAcceptForm } from "./InviteAcceptForm";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({ where: { token } });
  if (!invite || invite.redeemedAt || invite.expiresAt < new Date()) notFound();

  return (
    <main className="hero-bg hero-grain flex min-h-screen items-center justify-center px-4 py-20">
      <InviteAcceptForm token={token} />
    </main>
  );
}
