import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { BillingPortalButtons } from "@/components/admin/BillingPortalButtons";

export const dynamic = "force-dynamic";

function planLabel(tenant: { subscriptionStatus: string | null; foundersTier: boolean }): string {
  if (tenant.foundersTier) return "Founders Lifetime";
  const s = tenant.subscriptionStatus ?? "";
  if (s === "WPBS") return "WPBS partner — 30-day access";
  if (s === "week_pass" || s === "Week Pass") return "Week Pass";
  if (s === "pro_monthly" || s === "Pro Monthly") return "Pro Monthly";
  if (s === "pro_annual" || s === "Pro Annual") return "Pro Annual";
  return s ? s.replace(/_/g, " ") : "Free / trial";
}

export default async function AdminBillingPage() {
  const session = await getSession();
  if (!session) return null;

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.tenantId },
  });
  if (!tenant) return null;

  const stripeReady = !!process.env.STRIPE_SECRET_KEY;
  const [activeDevices, addOnSlots] = await Promise.all([
    prisma.device.count({ where: { tenantId: tenant.id } }),
    Promise.resolve(Math.max(0, tenant.deviceLimit - 4)),
  ]);

  const periodEnd =
    tenant.subscriptionStatus === "WPBS" ? tenant.wpbsExpiresAt : (tenant.currentPeriodEnd ?? tenant.wpbsExpiresAt);

  const portalDisabled = !stripeReady || !tenant.stripeCustomerId;
  const disabledTitle = !stripeReady
    ? "Stripe billing is not configured on this deployment (missing STRIPE_SECRET_KEY)."
    : "Checkout has not synced a Stripe customer for this tenant yet.";

  return (
    <div className="space-y-8">
      {tenant.subscriptionStatus === "WPBS" ? (
        <section className="sticky top-4 z-10 rounded-2xl border border-mint-500/40 bg-mint-50/90 p-5 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-ink">Winter Park Benefit Shop partner</p>
          <p className="mt-1 text-sm text-muted">
            Your 30-day access window ends{" "}
            <span className="font-medium text-ink">
              {tenant.wpbsExpiresAt ? tenant.wpbsExpiresAt.toDateString() : "—"}
            </span>
            . Contact{" "}
            <a className="text-mint-700 underline" href="mailto:ops@pricescout.pro">
              ops@pricescout.pro
            </a>{" "}
            to extend.
          </p>
        </section>
      ) : null}

      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Billing</h1>
        <p className="mt-2 text-muted">Plan, devices, and Stripe tools — everything finance asks about in one glance.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">Current plan</p>
          <p className="mt-2 text-2xl font-bold text-ink">{planLabel(tenant)}</p>
          <p className="mt-3 text-sm text-muted">
            Current period ends:{" "}
            <span className="font-medium text-ink">{periodEnd ? periodEnd.toLocaleString() : "—"}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">Device pool</p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {activeDevices} / {tenant.deviceLimit} active
          </p>
          <p className="mt-3 text-sm text-muted">
            Phones and browsers both count toward the four included installs on paid tiers.
          </p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">Add-on scanners</p>
          <p className="mt-2 text-2xl font-bold text-ink">{addOnSlots}</p>
          <p className="mt-3 text-sm text-muted">Each install beyond four bills at $15/mo until revoked.</p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">Stripe customer</p>
          <p className="mt-2 font-mono text-sm text-ink">{tenant.stripeCustomerId ?? "—"}</p>
          <BillingPortalButtons portalDisabled={portalDisabled} disabledTitle={disabledTitle} />
        </div>
      </div>

      <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-ink">Invoice history</h2>
        <p className="mt-3 text-sm text-muted">
          Your invoices appear inside the Stripe Customer Portal once billing is linked.
        </p>
      </section>

      <p className="text-sm text-muted">
        Public tiers and checkout live on{" "}
        <Link href="/pricing" className="font-semibold text-mint-700 underline">
          Pricing
        </Link>
        .
      </p>
    </div>
  );
}
