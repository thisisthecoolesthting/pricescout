import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpineSixSections } from "@/components/marketing/SpineSixSections";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { brand } from "@/lib/brand";
import { getFeaturePage, listFeatureSlugs } from "@/content/feature-pages";

export function generateStaticParams() {
  return listFeatureSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getFeaturePage(slug);
  if (!page) return { title: brand.name };
  return {
    title: `${page.title} — ${brand.name}`,
    description: page.subtitle,
  };
}

export default async function FeatureSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getFeaturePage(slug);
  if (!model) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
          { name: model.title, path: `/features/${slug}` },
        ]}
      />
      <SpineSixSections model={model} />
    </>
  );
}
