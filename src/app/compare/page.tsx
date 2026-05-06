import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Card } from "@/components/marketing/Card";
import { Section } from "@/components/marketing/Section";
import { getComparePage, listCompareSlugs } from "@/content/compare-pages";

export const metadata: Metadata = {
  title: `Compare — ${brand.name}`,
  description: `See how ${brand.name} stacks against generic Googling, charting habits, and solo reseller apps.`,
};

export default function CompareHubPage() {
  const slugs = listCompareSlugs();
  return (
    <Section className="hero-bg hero-grain pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="pill bg-mint-500/10 text-mint-600">COMPARE</span>
        <h1 className="gradient-text mb-6 mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Honest differentiation — no dunk threads
        </h1>
        <p className="text-lg text-muted">
          Understand trade-offs before your crew rewires habits mid-season.
        </p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {slugs.map((slug) => {
          const page = getComparePage(slug);
          if (!page) return null;
          return (
            <Card key={slug}>
              <h2 className="mb-2 text-xl font-semibold text-ink">
                <Link href={`/compare/${slug}`} className="hover:text-mint-600">
                  {page.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed text-muted">{page.subtitle}</p>
              <Link
                href={`/compare/${slug}`}
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
