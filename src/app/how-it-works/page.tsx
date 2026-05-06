import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: `How it works — ${brand.name}`,
  description: `From sorting room piles to sticker-ready tags — how ${brand.name} flows end to end.`,
};

export default function HowItWorksPage() {
  return (
    <article className="hero-bg hero-grain pt-24 pb-20">
      <Section className="!py-0">
        <div className="mx-auto max-w-3xl">
          <span className="pill bg-mint-500/10 text-mint-600">HOW IT WORKS</span>
          <h1 className="gradient-text mb-8 mt-4 text-4xl font-bold tracking-tight">
            Five beats every pricing crew recognizes
          </h1>
          <ol className="space-y-10 text-base leading-relaxed text-muted">
            <li>
              <strong className="text-ink">1. Intake hits the sorting room.</strong> Donations pile up — textiles,
              kitchenware, media, mystery electronics — volunteers grab phones instead of clipboards.
            </li>
            <li>
              <strong className="text-ink">2. Scan passes vision first.</strong> Camera reads packaging cues,
              silhouettes, logos. Barcodes jump the queue when shrink-wrap survives.
            </li>
            <li>
              <strong className="text-ink">3. Sold comps anchor math.</strong> Medians ignore wishful active listings —
              marketplace friction subtracts before anyone Sharpies a tag.
            </li>
            <li>
              <strong className="text-ink">4. Shared flip logs settle debates.</strong> Morning shift inherits afternoon
              honesty — nobody re-litigates tribal lore from sticky notes.
            </li>
            <li>
              <strong className="text-ink">5. Tags hit the floor confidently.</strong> Maybe stays Maybe — credibility beats fake precision every weekend.
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
