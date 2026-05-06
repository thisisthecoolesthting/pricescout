import { brand } from "@/lib/brand";

export const HOME_FAQ_ITEMS = [
  {
    q: "Who is PriceScout for?",
    a: `${brand.name} is built for the people pricing the table: thrift store owners and their staff, estate sale runners, yard sale weekend warriors, and small flea market dealers. If you have ever stared at a stack of donations wondering what to charge, this is for you. Individual eBay or Mercari resellers also use it — they just do not always need four device installs.`,
  },
  {
    q: "How many phones can scan at once?",
    a: `Every paid tier includes ${brand.name} on up to four devices — enough for an owner plus three staff scanning donations in the back room. Need more? Add scanners for fifteen dollars per month each. Manage device installs from the app Devices tab; rotate phones in and out anytime.`,
  },
  {
    q: "We are only running an estate sale this weekend. Do we have to pay monthly?",
    a: "No. The Week Pass is twenty-nine dollars for seven days of unlimited scanning across up to four devices. No auto-renew. Buy it Friday, scan all weekend, walk away Sunday — that is it.",
  },
  {
    q: "How does it know what an item is worth?",
    a: "Snap a photo. The vision model identifies brand, model, era, and material. The price engine pulls real eBay sold listings (not active wishful prices) and computes the median, then subtracts marketplace fees and shipping to give you a buy or skip verdict and a suggested resale price for your tag.",
  },
  {
    q: "Do I need to install anything?",
    a: `Web app: open ${brand.name} in any phone browser, allow camera access, and you are scanning. Android app: live on Google Play with links to your subscription. iOS app: under review at the App Store — email ${brand.emailFrom} if you want a heads-up when it lands.`,
  },
  {
    q: "What happens if PriceScout cannot ID an item?",
    a: "Low-confidence scans show their work — you see uncertainty and comp sample size. When confidence is too low for a verdict, you get Maybe with guidance to try a new angle, scan a barcode if visible, or fall back to manual search. No fake precision.",
  },
] as const;
