import Link from "next/link";
import { Scanner } from "@/components/Scanner";
import { brand } from "@/lib/brand";
import EbayTrustStrip from "@/components/EbayTrustStrip";

export const metadata = {
  title: `Scan — ${brand.name}`,
  description:
    "Point your phone or your laptop webcam at any donation, garage-sale find, or estate-sale lot. Get the resale context, a suggested tag price with demand signal, and sticker-ready numbers in seconds.",
};

export default function ScanPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <EbayTrustStrip variant="compact" />

      <header className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
          Scanner
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-ink/75">
          Point your phone — or your laptop&apos;s webcam — at any donation, garage-sale find, or estate-sale lot. Hit{" "}
          <strong>Snap &amp; identify</strong> and {brand.name} returns what it is, what it sells for online, and a suggested tag price with demand signal. Barcodes read automatically while the camera is open.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <span className="pill bg-mint-500/10 text-mint-600">Browser webcam</span>
        <span className="pill bg-mint-500/10 text-mint-600">Phone (Android live)</span>
        <span className="pill bg-line/40 text-soft">iOS in review</span>
      </div>

      <Scanner />

      <div className="mt-8 rounded-2xl border border-mint-500/30 bg-mint-50/60 px-5 py-4 text-sm text-ink">
        <p className="font-semibold">Sample scan, no signup required.</p>
        <p className="mt-1 text-muted">
          This is a public sandbox &mdash; identify any item and see suggested pricing. To save scans to a shared crew tag list, link multiple devices, or unlock real-time eBay sold-comp data,{" "}
          <Link href="/pricing" className="font-medium text-mint-600 hover:underline">
            grab a Week Pass or subscription
          </Link>{" "}
          (4 scanner installs included on every paid tier).
        </p>
      </div>
    </section>
  );
}
