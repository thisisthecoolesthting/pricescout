import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import { CHANGELOG } from "@/content/product-updates";

export const metadata: Metadata = {
  title: `Product updates — ${brand.name}`,
  description: `Release notes and changelog for ${brand.name}.`,
};

export default function ProductUpdatesPage() {
  return (
    <Section className="hero-bg hero-grain pt-24">
      <div className="mx-auto max-w-3xl">
        <span className="pill bg-mint-500/10 text-mint-600">CHANGELOG</span>
        <h1 className="gradient-text mb-8 mt-4 text-4xl font-bold tracking-tight">Product updates</h1>
        <div className="space-y-12">
          {CHANGELOG.map((entry) => (
            <article key={entry.date + entry.title} className="border-b border-line/60 pb-10 last:border-0">
              <p className="text-sm font-semibold text-mint-600">{entry.date}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{entry.title}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
                {entry.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Link href="/resources" className="mt-10 inline-block font-semibold text-mint-600 hover:underline">
          ← Resources hub
        </Link>
      </div>
    </Section>
  );
}
