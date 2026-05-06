import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import { Card } from "@/components/marketing/Card";
import { listBlogSlugs, getBlogPost } from "@/content/blog-posts";

export const metadata: Metadata = {
  title: `Blog — ${brand.name}`,
  description: `Stories about pricing discipline, crews, and weekend ops — ${brand.name}.`,
};

export default function BlogHubPage() {
  const slugs = listBlogSlugs();
  return (
    <Section className="hero-bg hero-grain pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="pill bg-mint-500/10 text-mint-600">BLOG</span>
        <h1 className="gradient-text mb-6 mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Field notes from donation lanes
        </h1>
        <p className="text-lg text-muted">Short essays — no fluff, no roadmap theater.</p>
      </div>
      <div className="mx-auto mt-14 grid max-w-3xl gap-6">
        {slugs.map((slug) => {
          const post = getBlogPost(slug);
          if (!post) return null;
          return (
            <Card key={slug}>
              <p className="text-xs font-semibold uppercase tracking-wide text-mint-600">{post.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">
                <Link href={`/blog/${slug}`} className="hover:text-mint-600">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <Link href={`/blog/${slug}`} className="mt-4 inline-block text-sm font-semibold text-mint-600 hover:underline">
                Read →
              </Link>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
