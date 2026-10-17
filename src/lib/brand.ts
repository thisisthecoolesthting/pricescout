export const brand = {
  name: "PriceScout",
  tagline: "Clear comparisons for hourly teams",
  description: "Evidence-based reviews and comparisons of employee time-clock software.",
  domain: process.env.APP_DOMAIN ?? "pricescout.pro",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "pricescout.pro"}`,
  hero: "Choose the right employee time clock.",
  heroSub: "Compare verified pricing, features, and tradeoffs.",
  shortPitch: "Evidence-first employee time-clock software reviews.",
} as const;
export type BrandStrings = typeof brand;
