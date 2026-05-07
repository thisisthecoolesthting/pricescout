/**
 * Brand strings — change here to rename the product. Reflected across
 * marketing pages, scanner UI, pricing, and emails.
 */
export const brand = {
  name: "PriceScout",
  tagline: "Stop guessing what donations are worth. Scan, see the resale price, price the tag.",
  domain: process.env.APP_DOMAIN ?? "pricescout.pro",
  emailFrom: `hello@${process.env.APP_DOMAIN ?? "pricescout.pro"}`,
  // Short hero headline, ~60ch.
  hero: "Run a thrift store? Price every item in seconds.",
  heroSub:
    "Snap any donation, garage-sale find, or estate-sale lot — get a defensible tag price in seconds, then post the listing to Facebook Marketplace. Up to 4 scanner installs (phones + browsers) on every paid tier.",
  // Used in nav & footer.
  shortPitch: "Pricing scanner for thrift stores, estate sales, and yard sales.",
};

export type BrandStrings = typeof brand;
