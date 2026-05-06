import type { SpineSixModel } from "@/components/marketing/SpineSixSections";

const commonTrust = ["Up to 4 scanner installs · Android live · iOS soon"];

export const FEATURE_SLUGS = [
  "visual-identification",
  "barcode-fast-path",
  "shared-flip-log",
  "device-management",
  "tag-price-suggestions",
  "flip-log-export",
] as const;

export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

const pages: Record<FeatureSlug, SpineSixModel> = {
  "visual-identification": {
    eyebrow: "FEATURE DEEP DIVE",
    title: "Visual identification that understands thrift inventory",
    subtitle:
      "Point your camera at Pyrex, denim, cookware, cameras, or electronics — PriceScout turns pixels into brand, era, and condition clues before comps ever load.",
    trustStrip: commonTrust,
    problem: {
      title: "Problem it solves",
      body: "Pricing volunteers guess off memory or random Google searches. That slows the line and chips away donor trust when tags feel arbitrary.",
    },
    audience: {
      title: "Who it is for",
      body: "Thrift teams pricing donations daily, estate-sale crews tagging dining rooms fast, and yard-sale hosts who want calm answers instead of frantic lookups.",
    },
    capabilities: [
      "Reads logos, shapes, patterns, and wear signals from a photo",
      "Pairs identification with sold comps automatically",
      "Surfaces uncertainty honestly — low-confidence scans stay labeled Maybe",
      "Runs in mobile browsers — no installs required on web",
    ],
    steps: [
      "Photograph the item in decent light.",
      "Confirm what the model thinks it sees.",
      "Review comps and the suggested tag price.",
      "Apply the sticker and move on.",
    ],
    faq: [
      {
        q: "Does it replace barcode scanning?",
        a: "No — barcode stays the fastest path when present. Vision fills the gaps where stickers peeled off decades ago.",
      },
      {
        q: "What about staged props?",
        a: "Works best with honest thrift-store clutter — lay items flat or shoot shelves straight-on so textures stay readable.",
      },
    ],
    relatedFeatures: [
      { label: "Barcode fast path", href: "/features/barcode-fast-path" },
      { label: "Tag price suggestions", href: "/features/tag-price-suggestions" },
    ],
    relatedIndustries: [
      { label: "Thrift stores", href: "/industries/thrift-stores" },
      { label: "Estate sales", href: "/industries/estate-sales" },
    ],
    finalCta: {
      title: "Put visual identification on every lane",
      subtitle: "Train staff once — every scanner inherits the same identification playbook.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "barcode-fast-path": {
    eyebrow: "FEATURE DEEP DIVE",
    title: "Barcode scanning when stickers still stick",
    subtitle:
      "ISBN and UPC lookups skip vision entirely — instant comps when donors leave factory packaging intact.",
    trustStrip: commonTrust,
    problem: {
      title: "Problem it solves",
      body: "Typing ASINs into random websites wastes minutes per item when a barcode already tells the catalog exactly what stock you hold.",
    },
    audience: {
      title: "Who it is for",
      body: "Media-heavy thrift aisles, textbook surplus corners, and boutique resale racks where shrink-wrapped inventory still arrives weekly.",
    },
    capabilities: [
      "Reads linear barcodes inside the browser scanner",
      "Selects top catalog hits automatically",
      "Hands results straight into the flip workflow",
      "Falls back to vision automatically when scans fail",
    ],
    steps: [
      "Tap Scan.",
      "Align the barcode inside the camera guide.",
      "Confirm catalog match.",
      "Review comps + verdict instantly.",
    ],
    faq: [
      {
        q: "Do damaged barcodes still work?",
        a: "Often yes — partial reads retry automatically before suggesting manual vision capture.",
      },
    ],
    relatedFeatures: [
      { label: "Visual identification", href: "/features/visual-identification" },
      { label: "Flip log export", href: "/features/flip-log-export" },
    ],
    relatedIndustries: [
      { label: "Consignment shops", href: "/industries/consignment-shops" },
      { label: "Church rummage sales", href: "/industries/church-rummage-sales" },
    ],
    finalCta: {
      title: "Ship barcode-first workflows tomorrow",
      subtitle: "Give volunteers the fastest happy path — barcode when possible, vision when life happened.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "shared-flip-log": {
    eyebrow: "FEATURE DEEP DIVE",
    title: "Shared flip logs your crew trusts",
    subtitle:
      "Everyone sees the same decisions across installs — owners approve buys remotely while floor staff scans donations.",
    trustStrip: commonTrust,
    problem: {
      title: "Problem it solves",
      body: "Personal notebooks and spreadsheets diverge until nobody trusts yesterday pricing.",
    },
    audience: {
      title: "Who it is for",
      body: "Multi-person thrift sorting rooms and estate-sale teams coordinating dozens of SKUs per hour.",
    },
    capabilities: [
      "Shows verdict history chronologically across devices",
      "Keeps donor-facing commentary consistent",
      "Lets managers audit skips versus buys instantly",
      "Exports cleanly when accountants ask questions later",
    ],
    steps: [
      "Staff scans items throughout the shift.",
      "Managers refresh the shared log anytime.",
      "Spot disagreements early — coach before donors notice.",
      "Export snapshots whenever finance asks.",
    ],
    faq: [
      {
        q: "Do installs sync offline?",
        a: "Mobile caching lands progressively — reconnect uploads queued verdicts automatically.",
      },
    ],
    relatedFeatures: [
      { label: "Device management", href: "/features/device-management" },
      { label: "Flip log export", href: "/features/flip-log-export" },
    ],
    relatedIndustries: [
      { label: "Yard sales", href: "/industries/yard-sales" },
      { label: "Flea markets", href: "/industries/flea-markets" },
    ],
    finalCta: {
      title: "Give every teammate one shared ledger",
      subtitle: "Less yelling across pallets — more clarity per aisle.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "device-management": {
    eyebrow: "FEATURE DEEP DIVE",
    title: "Four installs included — expand without chaos",
    subtitle:
      "Provision scanners intentionally — revoke retired phones and welcome replacements without disturbing subscriptions.",
    trustStrip: commonTrust,
    problem: {
      title: "Problem it solves",
      body: "Shared passwords and mystery phones leave billing ambiguous — finance hates guessing how many scanners actually deployed.",
    },
    audience: {
      title: "Who it is for",
      body: "Owners juggling seasonal volunteers plus permanent managers who rotate hardware yearly.",
    },
    capabilities: [
      "Shows active installs with human-readable nicknames",
      "Revokes devices instantly when phones disappear",
      "Mirrors pricing promises — four installs baseline, paid add-ons tracked plainly",
      "Alerts when installs drift beyond subscription allowance",
    ],
    steps: [
      "Open Devices inside admin.",
      "Tap Activate on each approved handset.",
      "Retire legacy phones when upgrades arrive.",
      "Finance stays aligned automatically.",
    ],
    faq: [
      {
        q: "What happens after four installs?",
        a: "Additional scanners bill monthly — aligns with pricing cards until RevenueCat parity lands.",
      },
    ],
    relatedFeatures: [
      { label: "Shared flip log", href: "/features/shared-flip-log" },
      { label: "Tag price suggestions", href: "/features/tag-price-suggestions" },
    ],
    relatedIndustries: [
      { label: "Thrift stores", href: "/industries/thrift-stores" },
      { label: "Consignment shops", href: "/industries/consignment-shops" },
    ],
    finalCta: {
      title: "Provision scanners like fleet hardware",
      subtitle: "Know exactly who scans — revoke instantly when crews churn.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "tag-price-suggestions": {
    eyebrow: "FEATURE DEEP DIVE",
    title: "Tag suggestions grounded in sold comps",
    subtitle:
      "Median sold listings minus marketplace friction — buyers see trustworthy sticker math.",
    trustStrip: commonTrust,
    problem: {
      title: "Problem it solves",
      body: "Active listings tempt crews into fantasy pricing — donors smell inflated optimism instantly.",
    },
    audience: {
      title: "Who it is for",
      body: "Managers defending margins plus volunteers translating comps into Sharpie-ready prices.",
    },
    capabilities: [
      "Computes median sold listings across ninety-day windows",
      "Subtracts marketplace fees + realistic shipping friction",
      "Outputs net expectations operators still respect",
      "Pairs verdict labels Buy / Maybe / Skip with numeric clarity",
    ],
    steps: [
      "Identify item.",
      "Pull comps.",
      "Review median minus friction.",
      "Sticker matches donor psychology.",
    ],
    faq: [
      {
        q: "Can we adjust assumptions?",
        a: "Tenant defaults tune shipping percentages — roadmap pushes richer sensitivity toggles.",
      },
    ],
    relatedFeatures: [
      { label: "Flip log export", href: "/features/flip-log-export" },
      { label: "Visual identification", href: "/features/visual-identification" },
    ],
    relatedIndustries: [
      { label: "Estate sales", href: "/industries/estate-sales" },
      { label: "Yard sales", href: "/industries/yard-sales" },
    ],
    finalCta: {
      title: "Ground sticker math in reality",
      subtitle: "Fewer stale racks — quicker turns.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
  "flip-log-export": {
    eyebrow: "FEATURE DEEP DIVE",
    title: "Exports accountants actually open",
    subtitle:
      "CSV snapshots summarize buys, skips, categories, and timestamps — bookkeeping stops begging screenshots.",
    trustStrip: commonTrust,
    problem: {
      title: "Problem it solves",
      body: "Audit prep turns into archaeology week whenever spreadsheets disagree with memories.",
    },
    audience: {
      title: "Who it is for",
      body: "Finance teammates reconciling POS totals plus nonprofit thrift boards proving stewardship.",
    },
    capabilities: [
      "Exports CSV filtered by date range",
      "Preserves verdict columns",
      "Includes scanner attribution optional",
      "Keeps filenames donor-neutral",
    ],
    steps: [
      "Pick reporting window.",
      "Choose CSV.",
      "Drop file into Sheets or Excel.",
      "Ship reports confidently.",
    ],
    faq: [
      {
        q: "Excel friendly?",
        a: "UTF-8 CSV opens cleanly — heavier ERP integrations ride future dispatch backlog intentionally.",
      },
    ],
    relatedFeatures: [
      { label: "Shared flip log", href: "/features/shared-flip-log" },
      { label: "Device management", href: "/features/device-management" },
    ],
    relatedIndustries: [
      { label: "Church rummage sales", href: "/industries/church-rummage-sales" },
      { label: "Flea markets", href: "/industries/flea-markets" },
    ],
    finalCta: {
      title: "Give finance immutable receipts",
      subtitle: "Fewer reconciliation scrambles — happier audits.",
      pricingLine: "$29 Week Pass · $49/mo Pro · $699 Founders Lifetime (cap 100)",
    },
  },
};

export function getFeaturePage(slug: string): SpineSixModel | undefined {
  return pages[slug as FeatureSlug];
}

export function listFeatureSlugs(): FeatureSlug[] {
  return [...FEATURE_SLUGS];
}
