import type { SpineSixModel } from "@/components/marketing/SpineSixSections";

const commonTrust = ["Up to 4 scanner installs · Android live · iOS soon"];

export const COMPARE_SLUGS = ["vs-googling-it", "vs-pricecharting", "vs-ebay-research-app"] as const;
export type CompareSlug = (typeof COMPARE_SLUGS)[number];

const pages: Record<CompareSlug, SpineSixModel> = {
  "vs-googling-it": {
    eyebrow: "COMPARE",
    title: "PriceScout versus open-ended Googling",
    subtitle:
      "Search tabs jump between active listings and forums — PriceScout anchors on sold comps and a structured verdict in one flow.",
    trustStrip: commonTrust,
    problem: {
      title: "Why Googling breaks down",
      body: "Queries return SEO articles, active eBay greed, and scattered forum threads — not a median your floor can sticker in under a minute.",
    },
    audience: {
      title: "Where PriceScout fits",
      body: "Sorting rooms that need repeatable numbers per item, not rabbit holes per donation.",
    },
    capabilities: [
      "Sold-history mindset baked into every verdict",
      "Vision identifies mystery SKUs without typing guesses",
      "Shared tag list replaces screenshots in chat threads",
      "Barcode fast path when shrink-wrap survives",
    ],
    steps: [
      "Snap instead of tab-hopping.",
      "Confirm identification.",
      "Review comps plus verdict.",
      "Sticker confidently.",
    ],
    faq: [
      {
        q: "Can I still Google manually?",
        a: "Yes — PriceScout is the fast path when timers matter.",
      },
    ],
    relatedFeatures: [
      { label: "Visual identification", href: "/features/visual-identification" },
      { label: "Tag price suggestions", href: "/features/tag-price-suggestions" },
    ],
    relatedIndustries: [
      { label: "Thrift stores", href: "/industries/thrift-stores" },
      { label: "Estate sales", href: "/industries/estate-sales" },
    ],
    finalCta: {
      title: "Leave endless tabs behind",
      subtitle: "Pricing throughput beats SEO roulette.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "vs-pricecharting": {
    eyebrow: "COMPARE",
    title: "PriceScout versus PriceCharting habits",
    subtitle:
      "Charting excels at graded collectibles — thrift floors juggle Pyrex, denim, bric-a-brac that never had a clean chart entry.",
    trustStrip: commonTrust,
    problem: {
      title: "Where charts miss the floor",
      body: "Many donations never had a SKU that charting sites index — your crew still needs a confident price before the rack cools.",
    },
    audience: {
      title: "Where PriceScout fits",
      body: "Mixed-lot thrift, estate bundles, and garage detritus where photos beat catalog lookups.",
    },
    capabilities: [
      "Vision IDs unboxed items without UPC certainty",
      "Sold comps sourced for general merchandise pricing",
      "Verdict labels keep staff aligned per item",
      "CSV export for bookkeeping not card-grading workflows",
    ],
    steps: [
      "Shoot the odd lot.",
      "Let vision + comps collaborate.",
      "Skip when data is thin — honestly.",
      "Move to the next tote.",
    ],
    faq: [
      {
        q: "Still use charting for sealed games?",
        a: "Barcode path can still leverage catalog confidence when UPC reads clean.",
      },
    ],
    relatedFeatures: [
      { label: "Barcode fast path", href: "/features/barcode-fast-path" },
      { label: "Shared tag list", href: "/features/shared-flip-log" },
    ],
    relatedIndustries: [
      { label: "Flea markets", href: "/industries/flea-markets" },
      { label: "Yard sales", href: "/industries/yard-sales" },
    ],
    finalCta: {
      title: "Price the uncharted majority",
      subtitle: "Tables full of chaos still deserve comps.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "vs-ebay-research-app": {
    eyebrow: "COMPARE",
    title: "PriceScout versus generic eBay research apps",
    subtitle:
      "Research apps optimize for lone resellers flipping one-off listings — PriceScout designs for crews pricing hundreds of donations per week with shared logs and four-install plans.",
    trustStrip: commonTrust,
    problem: {
      title: "Why consumer research apps stall teams",
      body: "Personal watchlists do not reconcile who decided what across three shifts and four phones.",
    },
    audience: {
      title: "Where PriceScout fits",
      body: "Leaders who need governance, audit exports, and pricing memory that survives volunteer rotation.",
    },
    capabilities: [
      "Four-install coverage on Pro",
      "Shared tag list replaces side-text threads",
      "Device management for real hardware swaps",
      "CSV export that treasurers recognize",
    ],
    steps: [
      "Provision scanners intentionally.",
      "Log decisions once — visible everywhere.",
      "Export for finance politely.",
      "Onboard volunteers without repeating tribal lore.",
    ],
    faq: [
      {
        q: "Solo reseller friendly?",
        a: "Week Pass and Pro both work solo — multi-install value shows up when crews grow.",
      },
    ],
    relatedFeatures: [
      { label: "Device management", href: "/features/device-management" },
      { label: "Flip log export", href: "/features/flip-log-export" },
    ],
    relatedIndustries: [
      { label: "Consignment shops", href: "/industries/consignment-shops" },
      { label: "Thrift stores", href: "/industries/thrift-stores" },
    ],
    finalCta: {
      title: "Team pricing without team chaos",
      subtitle: "Flip faster with one shared ledger.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
};

export function getComparePage(slug: string): SpineSixModel | undefined {
  return pages[slug as CompareSlug];
}

export function listCompareSlugs(): CompareSlug[] {
  return [...COMPARE_SLUGS];
}

