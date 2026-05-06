import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage() {
  const session = await getSession();
  if (!session) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
  });

  const foundersCapNote =
    tenant?.foundersTier === true
      ? "Founders tier active — Stripe subscription metadata backs lifetime entitlement."
      : "Upgrade tiers from pricing — Stripe Checkout wires straight through once STRIPE_* env vars land.";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Billing</h1>
        <p className="mt-2 text-muted">{foundersCapNote}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">Stripe customer</p>
          <p className="mt-2 font-mono text-sm text-ink">{tenant?.stripeCustomerId ?? "— not linked yet —"}</p>
          <p className="mt-4 text-sm text-muted">
            Subscription status: <span className="font-semibold capitalize">{tenant?.subscriptionStatus ?? "unknown"}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">Need invoices?</p>
          <p className="mt-2 text-sm text-muted">
            Stripe Customer Portal opens once <code className="rounded bg-cream px-1">stripeCustomerId</code> exists post-checkout.
          </p>
          <p className="mt-4 text-sm text-muted">
            Public tiers live on{" "}
            <Link href="/pricing" className="font-semibold text-mint-700 underline">
              Pricing
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
