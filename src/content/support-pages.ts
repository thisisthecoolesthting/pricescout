export interface SupportArticle {
  slug: string;
  title: string;
  summary: string;
  body: string[];
}

export const SUPPORT_SLUGS = ["getting-started", "camera-permissions", "billing-overview"] as const;

const articles: Record<(typeof SUPPORT_SLUGS)[number], SupportArticle> = {
  "getting-started": {
    slug: "getting-started",
    title: "Getting started on web and Android",
    summary: "Install flow, scanner entry points, and how first scans should feel.",
    body: [
      "Open pricescout.pro on a phone browser or install the Android app from Google Play.",
      "Allow camera access when prompted — without it identification cannot run.",
      "Start on the Scanner page, frame the item clearly, and wait for the verdict card before applying a tag.",
      "Invite additional devices from the Devices experience once accounts and billing ship in a later release — pricing copy reflects the roadmap honestly.",
    ],
  },
  "camera-permissions": {
    slug: "camera-permissions",
    title: "Camera permissions on iOS Safari and Android Chrome",
    summary: "What to tap when browsers block the lens, plus lighting tips.",
    body: [
      "If Safari refuses the camera, tap the aA menu, choose Website Settings, and set Camera to Allow for this site.",
      "On Android Chrome, tap the lock icon beside the URL, open Site settings, set Camera to Allow, then reload.",
      "Shoot in even light — overhead fluorescents beat harsh window backlight for glassware and ceramics.",
      "Barcode mode still needs focus — steady the phone until the guide turns green.",
    ],
  },
  "billing-overview": {
    slug: "billing-overview",
    title: "Plans, Week Pass, and device add-ons",
    summary: "How published tiers map to Stripe Price IDs once live billing completes dispatch 082.",
    body: [
      "Week Pass unlocks seven days of scanning for pop-up estate and yard events without auto-renew.",
      "Pro Monthly and Pro Annual include up to four installs; add-ons bill per extra device when metering ships end-to-end.",
      "Founders Lifetime is capped at one hundred subscriptions — checkout enforces sellout once live keys land.",
      "Need a receipt for a board? Email hello@pricescout.pro and include the Stripe customer email you used at checkout.",
    ],
  },
};

export function getSupportArticle(slug: string): SupportArticle | undefined {
  return articles[slug as keyof typeof articles];
}

export function listSupportSlugs(): (typeof SUPPORT_SLUGS)[number][] {
  return [...SUPPORT_SLUGS];
}
