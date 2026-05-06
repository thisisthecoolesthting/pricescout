import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { FaqPageJsonLd } from "@/lib/jsonld";
import { HOME_FAQ_ITEMS } from "@/content/faq-data";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `FAQ — ${brand.name}`,
  description: `Answers about scanners, tiers, installs, and honesty controls — ${brand.name}.`,
};

const ITEMS = [...HOME_FAQ_ITEMS];

export default function FaqHubPage() {
  return (
    <>
      <FaqPageJsonLd items={ITEMS.map((i) => ({ q: i.q, a: i.a }))} />
      <article className="hero-bg hero-grain pt-24 pb-24">
        <div className="container-pricescout mx-auto max-w-3xl">
          <h1 className="gradient-text mb-4 text-center text-4xl font-bold tracking-tight">
            Frequently asked questions
          </h1>
          <p className="mb-12 text-center text-lg text-muted">
            Straight answers — no roadmap hype. Still curious? Email{" "}
            <a href={`mailto:${brand.emailFrom}`} className="font-semibold text-mint-600 hover:underline">
              {brand.emailFrom}
            </a>
            .
          </p>
          <FAQ items={ITEMS} />
          <div className="mt-14 text-center">
            <Link href="/pricing" className="btn-primary btn-large">
              View pricing
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
