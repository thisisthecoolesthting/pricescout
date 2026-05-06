import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpineSixSections } from "@/components/marketing/SpineSixSections";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { brand } from "@/lib/brand";
import { getComparePage, listCompareSlugs } from "@/content/compare-pages";

export function generateStaticParams() {
  return listCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return { title: brand.name };
  return {
    title: `${page.title} — ${brand.name}`,
    description: page.subtitle,
  };
}

export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getComparePage(slug);
  if (!model) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: model.title, path: `/compare/${slug}` },
        ]}
      />
      <SpineSixSections model={model} />
    </>
  );
}
