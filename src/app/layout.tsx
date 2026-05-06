import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { SiteChrome } from "@/components/SiteChrome";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — Pricing scanner for thrift stores, estate sales & yard sales`,
  description:
    "Stop guessing what donations are worth. Snap any item, get a tag price your customers will pay — backed by real eBay sold-comps. Up to 4 scanner installs per Pro plan.",
  applicationName: brand.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://pricescout.pro"),
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — Stop guessing what donations are worth`,
    description:
      "Pricing scanner for thrift stores, estate sales, and yard sales. Real eBay sold-comps. Up to 4 phones per Pro plan.",
    url: "/",
    images: [{ url: "/images/hero-phone-mockup.jpg", alt: `${brand.name} app showing tag-price valuation` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Pricing scanner for thrift stores`,
    description:
      "Snap any donation, get a tag price in seconds. Up to 4 scanners per Pro plan. Real eBay sold-comps.",
    images: ["/images/hero-phone-mockup.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#11CB9D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteChrome>
          <main className="flex-1">{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
