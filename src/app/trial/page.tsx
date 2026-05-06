import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { submitTrial } from "@/app/actions/leads";

export const metadata: Metadata = {
  title: `Create account — ${brand.name}`,
  description: `Start with ${brand.name} — submit your team and we provision access as auth billing layers land.`,
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please include your full name plus a valid email.",
  server: "Email relay is still provisioning — email hello@pricescout.pro directly for now.",
};

export default async function TrialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERROR_MESSAGES[sp.error] ?? ERROR_MESSAGES.server : null;

  return (
    <article className="hero-bg hero-grain pt-24 pb-20">
      <div className="container-pricescout mx-auto max-w-xl">
        <h1 className="gradient-text mb-4 text-4xl font-bold tracking-tight">Create your {brand.name} account</h1>
        <p className="mb-2 text-muted">
          Paid plans include checkout via Stripe once live Price IDs finish dispatch 082 — this form queues your team so we can invite you manually in the interim.
        </p>
        <p className="mb-8 text-sm text-soft">
          Week Pass ($29), Pro monthly/annual, and Founders Lifetime ($699) mirror the public pricing cards.
        </p>

        {errorMsg ? (
          <div
            role="alert"
            className="mb-4 rounded-2xl border-2 px-4 py-3 text-sm"
            style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
          >
            <strong className="font-semibold">Could not submit yet.</strong> {errorMsg}
          </div>
        ) : null}

        {sp.ok ? (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            Request logged — operators follow up shortly.
          </div>
        ) : null}

        <form action={submitTrial} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              className="w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="organization" className="mb-1 block text-sm font-medium text-ink">
              Store or nonprofit name (optional)
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              className="w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
              autoComplete="organization"
            />
          </div>
          <button type="submit" className="btn-primary btn-full btn-large">
            Submit signup request
          </button>
        </form>

        <p className="mt-8 text-sm text-muted">
          Prefer instant checkout later?{" "}
          <Link href="/pricing" className="font-semibold text-mint-600 hover:underline">
            Browse pricing
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
