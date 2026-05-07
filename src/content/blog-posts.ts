export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  paragraphs: string[];
}

export const BLOG_SLUGS = [
  "why-sold-comps-beat-active-listings",
  "shared-flip-logs-for-volunteer-crews",
  "week-pass-playbook-estate-weekends",
] as const;

const posts: Record<(typeof BLOG_SLUGS)[number], BlogPost> = {
  "why-sold-comps-beat-active-listings": {
    slug: "why-sold-comps-beat-active-listings",
    title: "Why sold comps beat active listings for donation floors",
    date: "2026-04-15",
    excerpt:
      "Active listings chase upside — donation crews need medians grounded in fees and friction donors recognize.",
    paragraphs: [
      "Buyers negotiating at thrift counters anchor emotionally on what sold recently nearby — not what optimistic sellers listed Tuesday.",
      "Median sold listings blunt outliers automatically — extreme auctions matter less when sample sizes climb.",
      "Vision-first workflows pair nicely because crews capture messy SKUs — comps simply justify what eyes already suspected.",
      "Teach volunteers that Maybe verdicts protect credibility — optimism belongs in storytelling, not Sharpie ink.",
    ],
  },
  "shared-flip-logs-for-volunteer-crews": {
    slug: "shared-flip-logs-for-volunteer-crews",
    title: "Shared tag lists keep volunteer crews aligned",
    date: "2026-04-20",
    excerpt:
      "Rotating shifts stop rewriting tribal lore when verdict history lives in one ledger.",
    paragraphs: [
      "Morning crews should inherit afternoon reasoning without Slack archaeology.",
      "Exports mean treasurers reconcile faster — CSV beats screenshots every audit season.",
      "Managers coach using real examples instead of hypotheticals pulled from memory.",
      "Honest Maybe rows signal mentorship moments instead of blame when training new faces.",
    ],
  },
  "week-pass-playbook-estate-weekends": {
    slug: "week-pass-playbook-estate-weekends",
    title: "Week Pass playbook — price a whole house in one weekend",
    date: "2026-04-27",
    excerpt:
      "When the sale is seventy-two hours loud, timers matter more than subscription theory.",
    paragraphs: [
      "Buy the Week Pass before doors open Friday so Thursday night staging includes comp checks without monthly math.",
      "Stage photos of top rooms first — heirs stress most about furniture and artwork — calm numbers build trust immediately.",
      "Use markdown Sunday at lunch — log it in the tag list so heirs read intent, not panic.",
      "After the estate, let the pass expire intentionally — no surprise renewals chasing anyone Monday morning.",
    ],
  },
};

export function getBlogPost(slug: string): BlogPost | undefined {
  return posts[slug as keyof typeof posts];
}

export function listBlogSlugs(): (typeof BLOG_SLUGS)[number][] {
  return [...BLOG_SLUGS];
}

