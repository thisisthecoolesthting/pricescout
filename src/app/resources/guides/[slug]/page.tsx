import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import { getGuide, listGuideSlugs } from "@/content/guide-pages";

export function generateStaticParams() {
  return listGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return { title: brand.name };
  return {
    title: `${g.title} — ${brand.name}`,
    description: g.description,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: guide.title, path: `/resources/guides/${slug}` },
        ]}
      />
      <article className="hero-bg hero-grain pt-24 pb-20">
        <Section className="!py-0">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint-600">Guide</p>
            <h1 className="gradient-text mb-6 mt-2 text-4xl font-bold tracking-tight">{guide.title}</h1>
            <p className="mb-10 text-lg text-muted">{guide.description}</p>
            <div className="space-y-6 text-base leading-relaxed text-muted">
              {guide.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/pricing" className="btn-primary">
                See pricing
              </Link>
              <Link href="/faq" className="btn-secondary">
                FAQ hub
              </Link>
            </div>
          </div>
        </Section>
      </article>
    </>
  );
}
