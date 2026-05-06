import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Card } from "@/components/marketing/Card";
import { Section } from "@/components/marketing/Section";
import { CHANGELOG } from "@/content/product-updates";
import { listGuideSlugs, getGuide } from "@/content/guide-pages";

export const metadata: Metadata = {
  title: `Resources — ${brand.name}`,
  description: `Guides, changelog, and deep reads from ${brand.name}.`,
};

export default function ResourcesHubPage() {
  const guideSlugs = listGuideSlugs();
  return (
    <Section className="hero-bg hero-grain pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="pill bg-mint-500/10 text-mint-600">RESOURCES</span>
        <h1 className="gradient-text mb-6 mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Guides and updates
        </h1>
        <p className="text-lg text-muted">
          Long-form pricing discipline plus product changelog snapshots.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-ink">Guides</h2>
          <ul className="space-y-3 text-sm text-muted">
            {guideSlugs.map((slug) => {
              const g = getGuide(slug);
              if (!g) return null;
              return (
                <li key={slug}>
                  <Link href={`/resources/guides/${slug}`} className="font-medium text-mint-600 hover:underline">
                    {g.title}
                  </Link>
                  <p className="mt-1 text-muted">{g.description}</p>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-ink">Product updates</h2>
          <p className="mb-4 text-sm text-muted">
            Full log lives on{" "}
            <Link href="/resources/product-updates" className="font-semibold text-mint-600 hover:underline">
              /resources/product-updates
            </Link>
            .
          </p>
          <ul className="space-y-2 text-sm text-muted">
            {CHANGELOG.slice(0, 2).map((c) => (
              <li key={c.date}>
                <span className="font-semibold text-ink">{c.date}</span> — {c.title}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}
