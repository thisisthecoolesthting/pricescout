import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/lib/jsonld";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import { getBlogPost, listBlogSlugs } from "@/content/blog-posts";

export function generateStaticParams() {
  return listBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: brand.name };
  return {
    title: `${post.title} — ${brand.name}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />
      <article className="hero-bg hero-grain pt-24 pb-20">
        <Section className="!py-0">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold text-mint-600">{post.date}</p>
            <h1 className="gradient-text mb-4 mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
            <p className="mb-10 text-lg text-muted">{post.excerpt}</p>
            <div className="space-y-6 text-base leading-relaxed text-muted">
              {post.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href="/pricing" className="mt-12 inline-block font-semibold text-mint-600 hover:underline">
              Compare plans →
            </Link>
          </div>
        </Section>
      </article>
    </>
  );
}
