export interface ChangelogEntry {
  date: string;
  title: string;
  bullets: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-04-29",
    title: "Marketing route expansion",
    bullets: [
      "Shipped hubs for features, industries, compare, resources, support, and blog routes.",
      "Added guides covering thrift clothing, estate furniture, and secondhand fundamentals.",
      "Published robots.txt plus sitemap generation via Next metadata routes.",
    ],
  },
  {
    date: "2026-04-26",
    title: "Scanner polish",
    bullets: [
      "Improved verdict presentation on mobile browsers.",
      "Tuned mint gradient spacing on pricing tiers.",
    ],
  },
];
