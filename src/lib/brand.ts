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
    "PriceScout puts a camera in your crew's pocket. Snap any donation, garage-sale find, or estate-sale lot and get the resale price, the buy/skip verdict, the net margin in seconds. Up to 4 phones per subscription so the whole back room scans at once.",
  // Used in nav & footer.
  shortPitch: "Pricing scanner for thrift stores, estate sales, and yard sales.",
};

export type BrandStrings = typeof brand;
