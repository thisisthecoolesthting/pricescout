import Link from "next/link";
import { Check, Sparkles, Smartphone } from "lucide-react";

interface Tier {
  id: string;
  name: string;
  currency: string;
  amount: string;
  period: string;
  annualNote?: string;
  badge?: string;
  featured?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const TIERS: Tier[] = [
  {
    id: "week_pass",
    name: "Week Pass",
    currency: "$",
    amount: "29",
    period: "/ week",
    badge: "Weekend sale",
    features: [
      "7 days of unlimited scanning",
      "Up to 4 scanner installs",
      "Perfect for one-weekend estate or yard sales",
      "No auto-renew",
    ],
    ctaLabel: "Buy a Week Pass",
    ctaHref: "/api/billing/checkout?tier=week_pass",
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    currency: "$",
    amount: "49",
    period: "/ month",
    features: [
      "Unlimited scans across the crew",
      "Up to 4 scanner installs",
      "eBay sold-comp lookup",
      "Buy / skip verdicts + net-margin math",
      "Shared flip log",
      "Email support",
    ],
    ctaLabel: "Start Pro Monthly",
    ctaHref: "/api/billing/checkout?tier=pro_monthly",
  },
  {
    id: "pro_annual",
    name: "Pro Annual",
    currency: "$",
    amount: "490",
    period: "/ year",
    annualNote: "or $40.83/month",
    badge: "Most Popular",
    featured: true,
    features: [
      "Everything in Pro Monthly",
      "Up to 4 scanner installs",
      "Save ~17% vs monthly",
      "10 months for the price of 12",
      "Best for stores running year-round",
    ],
    ctaLabel: "Upgrade to Annual",
    ctaHref: "/api/billing/checkout?tier=pro_annual",
  },
  {
    id: "founders_lifetime",
    name: "Founders Lifetime",
    currency: "$",
    amount: "699",
    period: "once",
    badge: "First 100 only",
    features: [
      "Everything in Pro, forever",
      "Up to 4 scanner installs, forever",
      "First 100 customers only",
      "No subscription, no renewals",
      "Founders badge in app",
    ],
    ctaLabel: "Claim a Founders seat",
    ctaHref: "/api/billing/checkout?tier=founders_lifetime",
  },
];

export function PricingTiers() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <article
            key={t.id}
            className={`card-base relative flex h-full flex-col text-center ${
              t.featured ? "lg:scale-105 border-mint-500" : ""
            }`}
          >
            {t.badge ? (
              <span
                className={`pill absolute -top-3 left-1/2 -translate-x-1/2 ${
                  t.featured
                    ? "bg-gradient-to-br from-mint-500 to-mint-600 text-white shadow-soft"
                    : "border border-mint-500 bg-white text-mint-600"
                }`}
              >
                {t.id === "founders_lifetime" ? (
                  <Sparkles aria-hidden className="mr-1 h-3 w-3" />
                ) : null}
                {t.badge}
              </span>
            ) : null}

            <header className="mb-6 mt-2">
              <h3 className="mb-3 text-lg font-bold text-ink">{t.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl text-soft">{t.currency}</span>
                <span className="text-4xl font-bold tabular-nums text-ink">{t.amount}</span>
                <span className="text-soft">{t.period}</span>
              </div>
              {t.annualNote ? (
                <div className="mt-2 text-xs font-medium text-mint-600">{t.annualNote}</div>
              ) : null}
            </header>

            <ul className="mb-6 flex-1 space-y-2 text-left text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 border-b border-line/60 pb-2 text-body">
                  <Check aria-hidden className="mt-0.5 h-4 w-4 flex-none text-mint-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <Link
                href={t.ctaHref}
                className={t.featured ? "btn-primary btn-full" : "btn-secondary btn-full"}
              >
                {t.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Multi-device add-on callout */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-mint-500/30 bg-mint-50/60 p-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 text-mint-600">
          <Smartphone aria-hidden className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wide">Bigger crew?</span>
        </div>
        <p className="text-base font-semibold text-ink">
          Every paid tier includes 4 scanner installs.
        </p>
        <p className="mt-1 text-sm text-muted">
          Add additional scanners for{" "}
          <span className="font-semibold text-ink">$15/month each</span> beyond 4. Manage devices in
          the app&rsquo;s <span className="font-medium">Devices</span> tab — rotate phones in and
          out anytime.
        </p>
      </div>
    </div>
  );
}
