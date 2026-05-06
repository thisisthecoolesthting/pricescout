import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Terms of Service — ${brand.name}`,
  description: `Terms governing ${brand.name} software and subscription.`,
};

export default function TermsPage() {
  return (
    <article className="hero-bg hero-grain pt-24 pb-24">
      <div className="container-pricescout mx-auto max-w-3xl">
        <h1 className="gradient-text mb-8 text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-soft">Effective date: April 29, 2026 · Last updated: April 29, 2026</p>

        <p className="mt-8 text-muted">
          These Terms govern access to {brand.name} websites, scanner apps, APIs we expressly document, and related services (
          &quot;Services&quot;). By using the Services you agree to these Terms and our Privacy Policy at{" "}
          <a href="/legal/privacy" className="text-mint-600 underline">
            /legal/privacy
          </a>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Accounts</h2>
        <ul className="list-disc space-y-2 pl-6 text-muted">
          <li>
            Provide accurate registration details — one accountable operator should administer each tenant workspace unless enterprise paperwork states
            otherwise.
          </li>
          <li>
            Credentials are individual — don&apos;t share logins across unrelated volunteers where avoidable; rotating seasonal helpers through seats is
            fine within fair-use norms described at signup.
          </li>
          <li>
            Don&apos;t resell remote API-style access beyond what enterprise contracts expressly permit — charitable resale crews pricing donations remain
            the core audience.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Subscriptions &amp; billing</h2>
        <p className="text-muted">
          Paid tiers may include offerings such as Week Pass, Pro Monthly, Pro Annual, Founders Lifetime with scanner capacity add-ons — exact SKUs +
          localized pricing appear at checkout when Stripe configurations are live. Taxes follow Stripe receipts where applicable.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Refunds</h2>
        <p className="text-muted">
          Chargebacks or refunds generally follow Stripe defaults unless superseded by signed enterprise paperwork — Week Pass style bursts may become
          non-refundable once activated because marginal compute spend occurs immediately; annual subscriptions may qualify for pro-rated refunds where
          Stripe settings + regional consumer laws align.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Acceptable use</h2>
        <ul className="list-disc space-y-2 pl-6 text-muted">
          <li>No automated scraping of undocumented internals — partner integrations happen via surfaces we explicitly ship.</li>
          <li>
            Don&apos;t attempt to misuse vision prompts to bypass safety policies or harvest unrelated surveillance imagery — charity pricing workflows
            only.
          </li>
          <li>No interference with metering, billing fraud, or competitor benchmarking designed to degrade service quality for others.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Disclaimers</h2>
        <p className="text-muted">
          Comparable-sale estimates cite probabilistic markets — thrift crews remain responsible for final sticker pricing and donor-facing signage.
          Third-party feeds (marketplaces, APIs) vary in freshness — verdict outputs{" "}
          <strong className="text-ink">are not individualized investment advice</strong>. Always obey local appraisal licensing regimes where they apply.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Limitation of liability</h2>
        <p className="text-muted">
          To the maximum extent permitted by law, {brand.name} and suppliers won&apos;t be liable for indirect, incidental, special, consequential,
          punitive damages, or lost profits arising from use or inability to use the Services — aggregate liability for direct damages tied to a twelve-month
          window typically caps at amounts you paid us for the Services during that window unless prohibited.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Indemnification</h2>
        <p className="text-muted">
          You indemnify and hold harmless {brand.name} against claims arising from misuse of the Services, violations of law, or infringement originating
          from content or workflows you introduce beyond supplied defaults — subject to carve-outs where prohibited by statute.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Termination</h2>
        <p className="text-muted">
          Either party may suspend or terminate access for material breach — unpaid invoices past cure windows, abusive automation, or repeated legal
          violations. Certain clauses survive termination (payment owed, disclaimers, liability caps where enforceable).
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Governing law</h2>
        <p className="text-muted">
          These Terms are governed by the laws of the <strong className="text-ink">State of Delaware</strong>, excluding conflict-of-law rules. Courts in
          Delaware (or binding arbitration clauses when separately executed enterprise schedules say so) handle disputes unless mandatory consumer forums in
          your country override — EU consumers retain statutory protections where applicable.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-ink">Contact</h2>
        <p className="text-muted">
          Legal notices and operational escalations:{" "}
          <a href={`mailto:${brand.emailFrom}`} className="text-mint-600 underline">
            {brand.emailFrom}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
