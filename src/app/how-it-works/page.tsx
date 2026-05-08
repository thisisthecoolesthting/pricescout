import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import EbayTrustStrip from "@/components/EbayTrustStrip";

export const metadata: Metadata = {
  title: `How it works — ${brand.name}`,
  description: `From sorting room piles to sticker-ready tags — how ${brand.name} flows end to end.`,
};

export default function HowItWorksPage() {
  return (
    <article className="hero-bg hero-grain pt-24 pb-20">
      <Section className="!py-0">
      <EbayTrustStrip />

        <div className="mx-auto max-w-3xl">
          <span className="pill bg-mint-500/10 text-mint-600">HOW IT WORKS</span>
          <h1 className="gradient-text mb-8 mt-4 text-4xl font-bold tracking-tight">
            Snap, price, save — on phone or laptop
          </h1>
          <ol className="space-y-12 text-base leading-relaxed text-muted">
            <li>
              <strong className="mb-4 block text-lg text-ink">1. Snap</strong>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white/80 p-5">
                  <p className="font-semibold text-ink">On the phone</p>
                  <p className="mt-2">
                    Open the {brand.name} app (Android live; iOS in review), allow camera access, point at the item, and
                    snap.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-white/80 p-5">
                  <p className="font-semibold text-ink">In the browser</p>
                  <p className="mt-2">
                    Open <code className="rounded bg-cream px-1.5 py-0.5 text-sm text-ink">/scan</code>, allow camera,
                    point your laptop&apos;s webcam or USB cam at the item, and snap.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <strong className="mb-2 block text-lg text-ink">2. Tag price</strong>
              <p>
                {brand.name} returns what it is, what it sells for online, and a suggested tag price with demand signal — same pipeline for
                Expo and for the browser scanner. Barcodes jump the queue when shrink-wrap still cooperates.
              </p>
            </li>
            <li>
              <strong className="mb-2 block text-lg text-ink">3. Save</strong>
              <p>
                Paid tiers write scans into the shared tag list so the whole crew sees the same history — whether those
                scans came from phones on the floor or a back-room laptop.
              </p>
            </li>
          </ol>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/scan" className="btn-primary btn-large">
              Open scanner
            </Link>
            <Link href="/watch" className="btn-secondary btn-large">
              Watch demo
            </Link>
          </div>
        </div>
      </Section>
    </article>
  );
}
