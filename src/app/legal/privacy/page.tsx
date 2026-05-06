import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy Policy — ${brand.name}`,
  description: `${brand.name} privacy policy — disclosures aligned with GDPR + CCPA.`,
};

export default function PrivacyPage() {
  return (
    <article className="hero-bg hero-grain pt-24 pb-24">
      <div className="container-pricescout mx-auto max-w-3xl">
        <h1 className="gradient-text mb-8 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-soft">Effective date: April 29, 2026 · Last updated: April 29, 2026</p>

        <p className="mt-8 text-muted">
          This policy describes how {brand.name} (&quot;we&quot;, &quot;us&quot;) collects, uses, and shares information when you use our websites,
          scanner apps, and related services. Plain English first — statutory headings follow where helpful.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">What we collect</h2>
        <ol className="list-decimal space-y-2 pl-6 text-muted">
          <li>
            <strong className="text-ink">Account credentials.</strong> Email address and a password hash (bcrypt, cost factor 10). We do not store
            passwords in plain text.
          </li>
          <li>
            <strong className="text-ink">Tenant metadata.</strong> Store or organization display name, brand color choices, subscription status,
            and identifiers we need to tie your workspace to billing.
          </li>
          <li>
            <strong className="text-ink">Scan records.</strong> Structured results from a scan — for example identified title or category hints, comp
            (comparable resale) price signals, verdict, scan time, device identifier, and related operational fields.{" "}
            <strong className="text-ink">Raw camera images are not kept as a long-term archive by default</strong> — see the next section.
          </li>
          <li>
            <strong className="text-ink">Device install records.</strong> A device or install fingerprint and last-seen timestamps so we can enforce
            fair per-tenant device limits and troubleshoot reliability.
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold text-ink">What we do not collect</h2>
        <ul className="list-disc space-y-2 pl-6 text-muted">
          <li>
            We do <strong className="text-ink">not</strong> retain raw scan photos indefinitely as a catalog of donor imagery. Photos may be sent to a
            vision model provider solely to produce identification outputs; retention beyond short-lived processing queues requires an explicit future
            product control if we ever ship one.
          </li>
          <li>
            We do <strong className="text-ink">not</strong> collect GPS location — camera permission may be requested for scanning; there is no
            continuous location tracking product surface today.
          </li>
          <li>
            We do <strong className="text-ink">not</strong> pull contacts, SMS, call logs, or browsing history from phones or desktops running our apps.
          </li>
          <li>
            We do <strong className="text-ink">not</strong> sell personal information &quot;for money&quot; in the common California sense — see{" "}
            <em>Your rights</em> below for opt-out language anyway.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Third parties &amp; data flows</h2>
        <p className="text-muted">
          Depending on features you enable and keys configured by your tenant administrator, information may flow to subprocessors including:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
          <li>
            <strong className="text-ink">Vision model providers</strong> (for example Anthropic or OpenRouter-backed models) receive ephemeral image +
            compact text prompts needed for identification — only what is required for that single inference.
          </li>
          <li>
            <strong className="text-ink">Stripe</strong> handles payment instruments — when Checkout is enabled we typically store Stripe customer Id +
            subscription status from Stripe webhooks, not full card numbers.
          </li>
          <li>
            <strong className="text-ink">Comparable-sales APIs</strong> such as Keepa or eBay Browse receive query strings derived from identification —
            no intentional inclusion of donor names or unrelated personal identifiers.
          </li>
          <li>
            <strong className="text-ink">Transactional email</strong> vendors when outbound mail is activated — operational notices only unless you opt
            into marketing toggles later.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Cookies &amp; similar technologies</h2>
        <p className="text-muted">
          We use strictly necessary cookies where applicable — for example signed session cookies for authenticated browser sessions (
          <code className="rounded bg-black/5 px-1">ps_session</code>
          style naming may evolve). Stripe Checkout may place its own fraud-prevention cookies during checkout — governed by Stripe&apos;s policies when
          those flows are enabled.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Your rights (GDPR &amp; CCPA-style)</h2>
        <p className="text-muted">
          Depending on jurisdiction you may request access, correction, deletion, portability, or restriction — including opting out of sale/share where
          applicable. Authenticated self-service portals ship over time; until then email{" "}
          <a href={`mailto:${brand.emailFrom}`} className="text-mint-600 underline">
            {brand.emailFrom}
          </a>{" "}
          with the subject line <em>Privacy request</em> and enough context to locate your tenant. We respond within statutory timelines that apply.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Retention</h2>
        <p className="text-muted">
          Structured scan metadata defaults to roughly <strong className="text-ink">twelve months</strong> rolling retention for operational analytics
          unless a longer retention product control exists for your workspace. Backups follow a standard rolling window — ask for deletion timelines if
          you require a tighter window for compliance.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Security</h2>
        <p className="text-muted">
          TLS in transit for web properties, bcrypt for password hashes, principle of least privilege for operational access, and vendor reviews
          aligned to common SaaS practices. No security program is perfect — if we learn of a breach that likely affects personal data we will notify
          affected tenants as required by law.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Children</h2>
        <p className="text-muted">
          {brand.name} is not directed at children under 13 — nonprofit resale crews should administer accounts for adults responsible for pricing floor
          decisions. If you believe we processed a child&apos;s personal information inadvertently, email{" "}
          <a href={`mailto:${brand.emailFrom}`} className="text-mint-600 underline">
            {brand.emailFrom}
          </a>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">International transfers</h2>
        <p className="text-muted">
          Infrastructure may span regions — where GDPR applies we rely on appropriate safeguards for transfers outside the EEA/UK such as Standard
          Contractual Clauses combined with vendor diligence.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Changes</h2>
        <p className="text-muted">
          We update this policy when practices materially change — revised versions ship here with the effective date above; continued use after updates
          constitutes acceptance unless prohibited by law.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Contact</h2>
        <p className="text-muted">
          Privacy questions or regulator-grade correspondence:{" "}
          <a href={`mailto:${brand.emailFrom}`} className="text-mint-600 underline">
            {brand.emailFrom}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
