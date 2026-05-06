import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { listFeatureSlugs } from "@/content/feature-pages";
import { listIndustrySlugs } from "@/content/industry-pages";
import { listCompareSlugs } from "@/content/compare-pages";
import { listGuideSlugs } from "@/content/guide-pages";
import { listBlogSlugs } from "@/content/blog-posts";
import { listSupportSlugs } from "@/content/support-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  const staticPaths = [
    "/",
    "/pricing",
    "/scan",
    "/watch",
    "/faq",
    "/features",
    "/industries",
    "/compare",
    "/resources",
    "/resources/product-updates",
    "/blog",
    "/how-it-works",
    "/security",
    "/about",
    "/contact",
    "/trial",
    "/legal/privacy",
    "/legal/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const pushDyn = (paths: string[]) => {
    for (const path of paths) {
      entries.push({
        url: `${base}${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  };

  pushDyn(listFeatureSlugs().map((s) => `/features/${s}`));
  pushDyn(listIndustrySlugs().map((s) => `/industries/${s}`));
  pushDyn(listCompareSlugs().map((s) => `/compare/${s}`));
  pushDyn(listGuideSlugs().map((s) => `/resources/guides/${s}`));
  pushDyn(listBlogSlugs().map((s) => `/blog/${s}`));
  pushDyn(listSupportSlugs().map((s) => `/support/${s}`));

  return entries;
}
