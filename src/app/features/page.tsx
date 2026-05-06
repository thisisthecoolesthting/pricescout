import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Card } from "@/components/marketing/Card";
import { Section } from "@/components/marketing/Section";
import { listFeatureSlugs, getFeaturePage } from "@/content/feature-pages";

export const metadata: Metadata = {
  title: `Features — ${brand.name}`,
  description: `Deep dives into ${brand.name} capabilities — vision scanning, barcodes, shared flip logs, devices, comps, and exports.`,
};

export default function FeaturesHubPage() {
  const slugs = listFeatureSlugs();
  return (
    <Section className="hero-bg hero-grain pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="pill bg-mint-500/10 text-mint-600">FEATURES</span>
        <h1 className="gradient-text mb-6 mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Built for crews pricing tables fast
        </h1>
        <p className="text-lg text-muted">
          Pick a capability — each page follows the six-section playbook so scanning crews onboard consistently.
        </p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {slugs.map((slug) => {
          const page = getFeaturePage(slug);
          if (!page) return null;
          return (
            <Card key={slug}>
              <h2 className="mb-2 text-xl font-semibold text-ink">
                <Link href={`/features/${slug}`} className="hover:text-mint-600">
                  {page.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed text-muted">{page.subtitle}</p>
              <Link
                href={`/features/${slug}`}
                className="mt-4 inline-block text-sm font-semibold text-mint-600 hover:underline"
              >
                Read more →
              </Link>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
