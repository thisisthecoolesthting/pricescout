import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: `Security — ${brand.name}`,
  description: `How ${brand.name} thinks about images, credentials, billing tokens, and tenant isolation.`,
};

export default function SecurityPage() {
  return (
    <article className="hero-bg hero-grain pt-24 pb-20">
      <Section className="!py-0">
        <div className="mx-auto max-w-3xl">
          <span className="pill bg-mint-500/10 text-mint-600">TRUST</span>
          <h1 className="gradient-text mb-8 mt-4 text-4xl font-bold tracking-tight">
            Security posture — pragmatic, transparent
          </h1>
          <div className="space-y-6 text-base leading-relaxed text-muted">
            <p>
              {brand.name} processes donation-floor photos through encrypted HTTPS connections. Scan imagery used for identification is handled ephemerally — we do not build unrelated advertising profiles off thrift volunteers doing their jobs.
            </p>
            <p>
              Accounts (once authenticated flows ship in upcoming releases) isolate tenant data logically — mixer carts stay separated per operator configuration with salted passwords via modern hashing defaults outlined in deployment docs.
            </p>
            <p>
              Stripe handles PCI-sensitive payment rails — card numbers never touch PriceScout servers. Webhooks verify Stripe signatures before subscription status updates persist anywhere internal.
            </p>
            <p>
              Operators needing SOC-style questionnaires should email{" "}
              <a href={`mailto:${brand.emailFrom}`} className="font-semibold text-mint-600 hover:underline">
                {brand.emailFrom}
              </a>{" "}
              — responses arrive within a few business days with architecture specifics tied to your rollout phase.
            </p>
          </div>
          <Link href="/contact" className="mt-10 inline-block font-semibold text-mint-600 hover:underline">
            Contact security →
          </Link>
        </div>
      </Section>
    </article>
  );
}
