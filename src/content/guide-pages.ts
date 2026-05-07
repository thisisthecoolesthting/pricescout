export interface GuideDoc {
  slug: string;
  title: string;
  description: string;
  paragraphs: string[];
}

export const GUIDE_SLUGS = [
  "how-to-price-thrift-store-clothes",
  "how-to-price-estate-sale-furniture",
  "secondhand-pricing-101",
] as const;

const guides: Record<(typeof GUIDE_SLUGS)[number], GuideDoc> = {
  "how-to-price-thrift-store-clothes": {
    slug: "how-to-price-thrift-store-clothes",
    title: "How to price thrift-store clothing fast",
    description:
      "Fabric tags, silhouettes, and sold comps — a practical lane-by-lane checklist donation crews can reuse weekly.",
    paragraphs: [
      "Start with fiber content when tags survive — wool, cashmere, and technical outerwear behave differently than cotton basics.",
      "Shoot the care label plus the front graphic in one scan pass so identification can read both brand marks and distress.",
      "Ignore active listing fantasies — anchor on ninety-day sold medians that match the condition actually on your rack.",
      "When comps are thin, downgrade the verbal price and mark the tag list Maybe so the next shift knows the story.",
      "Batch similar sizes on the same half of a rack — shoppers compare hangers side by side faster when pricing feels consistent block to block.",
    ],
  },
  "how-to-price-estate-sale-furniture": {
    slug: "how-to-price-estate-sale-furniture",
    title: "How to price estate-sale furniture without stalling rooms",
    description:
      "Big pieces need confidence before buyers wander — comps, condition, and markdown plans in one calm pass.",
    paragraphs: [
      "Photograph maker marks and joinery close-ups before movers stack pieces — blurred photos waste comp quality later.",
      "Price for the first serious Saturday crowd, then schedule markdown cadence before Sunday lunch so heirs see intent, not desperation.",
      "Compare local pickup reality — oversized shipping skews comps — use medians from sold listings within a few hours drive whenever possible.",
      "Log verdicts on shared tag lists so heirs and planners read the same numbers when sibling opinions diverge politely.",
      "When data is fuzzy, stage a quiet maybe corner with signage that sets expectations honestly — credibility beats fake precision.",
    ],
  },
  "secondhand-pricing-101": {
    slug: "secondhand-pricing-101",
    title: "Secondhand pricing 101 — sold comps beat wishful tabs",
    description:
      "A ground-up explainer for crews new to resale: what a median sold listing is, why fees matter, and how to communicate numbers to shoppers.",
    paragraphs: [
      "Sold listings show what humans actually paid — active listings show what sellers hope for on a sunny day.",
      "Marketplace fees and reasonable shipping subtract from the top line — your tag should leave margin for both if you mirror online exit channels.",
      "Sample size matters — two sales are a hint, fifteen sales are a pattern. Say so on the floor when shoppers ask.",
      "Vision plus barcode covers the majority of thrift inventory — still keep a reference book for hyper-niche niche collectibles.",
      "Exports and shared logs keep finance conversations short — treasurer questions deserve CSV, not screenshots.",
    ],
  },
};

export function getGuide(slug: string): GuideDoc | undefined {
  return guides[slug as keyof typeof guides];
}

export function listGuideSlugs(): (typeof GUIDE_SLUGS)[number][] {
  return [...GUIDE_SLUGS];
}

