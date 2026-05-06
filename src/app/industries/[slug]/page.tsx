import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpineSixSections } from "@/components/marketing/SpineSixSections";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { brand } from "@/lib/brand";
import { getIndustryPage, listIndustrySlugs } from "@/content/industry-pages";

export function generateStaticParams() {
  return listIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) return { title: brand.name };
  return {
    title: `${page.title} — ${brand.name}`,
    description: page.subtitle,
  };
}

export default async function IndustrySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getIndustryPage(slug);
  if (!model) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: model.title, path: `/industries/${slug}` },
        ]}
      />
      <SpineSixSections model={model} />
    </>
  );
}
