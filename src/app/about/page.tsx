import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";

export const metadata: Metadata = {
  title: `About — ${brand.name}`,
  description: `Why ${brand.name} exists — pricing dignity for thrift crews and weekend resale heroes.`,
};

export default function AboutPage() {
  return (
    <article className="hero-bg hero-grain pt-24 pb-20">
      <Section className="!py-0">
        <div className="mx-auto max-w-3xl">
          <span className="pill bg-mint-500/10 text-mint-600">MISSION</span>
          <h1 className="gradient-text mb-8 mt-4 text-4xl font-bold tracking-tight">
            Pricing dignity beats guessing aloud on donation Fridays
          </h1>
          <div className="space-y-6 text-base leading-relaxed text-muted">
            <p>
              {brand.name} exists because crews deserve comps-backed answers without babysitting resale spreadsheets between volunteer shifts.
            </p>
            <p>
              The roadmap stays focused: better shared logs, smoother device management, parity between web and native clients, exports treasurers recognize. No speculative NFT integrations — promise.
            </p>
            <p>
              Feedback reaches humans — reach{" "}
              <a href={`mailto:${brand.emailFrom}`} className="font-semibold text-mint-600 hover:underline">
                {brand.emailFrom}
              </a>{" "}
              anytime stories do not match reality on your floor.
            </p>
          </div>
          <Link href="/trial" className="mt-10 inline-block btn-primary">
            Join the rollout
          </Link>
        </div>
      </Section>
    </article>
  );
}
