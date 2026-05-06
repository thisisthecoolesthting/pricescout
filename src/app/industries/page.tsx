import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Card } from "@/components/marketing/Card";
import { Section } from "@/components/marketing/Section";
import { getIndustryPage, listIndustrySlugs } from "@/content/industry-pages";

export const metadata: Metadata = {
  title: `Industries — ${brand.name}`,
  description: `How ${brand.name} fits thrift stores, estate sales, yard sales, consignment, flea markets, and church rummage sales.`,
};

export default function IndustriesHubPage() {
  const slugs = listIndustrySlugs();
  return (
    <Section className="hero-bg hero-grain pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="pill bg-mint-500/10 text-mint-600">INDUSTRIES</span>
        <h1 className="gradient-text mb-6 mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing floors across secondhand contexts
        </h1>
        <p className="text-lg text-muted">
          Same comps backbone — tuned messaging per aisle personality.
        </p>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {slugs.map((slug) => {
          const page = getIndustryPage(slug);
          if (!page) return null;
          return (
            <Card key={slug}>
              <h2 className="mb-2 text-xl font-semibold text-ink">
                <Link href={`/industries/${slug}`} className="hover:text-mint-600">
                  {page.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed text-muted">{page.subtitle}</p>
              <Link
                href={`/industries/${slug}`}
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
