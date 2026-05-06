import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import { getSupportArticle, listSupportSlugs } from "@/content/support-pages";

export function generateStaticParams() {
  return listSupportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getSupportArticle(slug);
  if (!a) return { title: brand.name };
  return {
    title: `${a.title} — ${brand.name}`,
    description: a.summary,
  };
}

export default async function SupportArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getSupportArticle(slug);
  if (!article) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Support", path: "/support/getting-started" },
          { name: article.title, path: `/support/${slug}` },
        ]}
      />
      <article className="hero-bg hero-grain pt-24 pb-20">
        <Section className="!py-0">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-mint-600">Support</p>
            <h1 className="gradient-text mb-4 mt-2 text-4xl font-bold tracking-tight">{article.title}</h1>
            <p className="mb-8 text-lg text-muted">{article.summary}</p>
            <div className="space-y-5 text-base leading-relaxed text-muted">
              {article.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-10 text-sm text-muted">
              Still stuck? Email{" "}
              <a href={`mailto:${brand.emailFrom}`} className="font-semibold text-mint-600 hover:underline">
                {brand.emailFrom}
              </a>
              .
            </p>
          </div>
        </Section>
      </article>
    </>
  );
}
