import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Handshake, Mail } from "lucide-react";
import { brand } from "@/lib/brand";
import { Section } from "@/components/marketing/Section";
import { HeroScanFlowEmbed } from "@/components/marketing/HeroScanFlowEmbed";
import { WpbsSupportForm } from "@/components/partners/WpbsSupportForm";

const PARTNER_EMAIL = "partners@pricescout.pro";

export const metadata: Metadata = {
  title: `Winter Park Benefit Shop — Partner toolkit | ${brand.name}`,
  description:
    "Onboarding for WPBS staff and volunteers: partnership overview, how to claim Pro access, tour video, FAQ, and partner support.",
  robots: { index: false, follow: false },
};

const FAQ = [
  {
    q: "Who's eligible?",
    a: "Anyone on the WPBS staff or volunteer roster. Use a `@wpbs.org` email or any email — you will be granted access regardless. Up to 4 device installs are included on every WPBS account.",
  },
  {
    q: "What does it cost after 30 days?",
    a: "We'll reach out before your trial ends to discuss the partner rate. WPBS staff get a meaningfully lower rate than our public Pro tier.",
  },
  {
    q: "Do my scans and listings stay private?",
    a: "Yes. Your tenant is isolated. We don't share scan data, Facebook Marketplace drafts, or anything else outside WPBS.",
  },
  {
    q: "Can the whole team share a single account?",
    a: "Each device counts as one of your 4 included installs. We recommend each crew member has their own login on each device — that way the tag list shows who priced what.",
  },
  {
    q: "What happens if a volunteer leaves?",
    a: "An owner can revoke their device and login from `/admin/team`. Their previously priced items stay attributed to history.",
  },
  {
    q: "How do we get support?",
    a: `Email ${PARTNER_EMAIL}. We typically respond the same business day.`,
  },
] as const;

export default function WpbsPartnerPage() {
  return (
    <article className="bg-white">
      {/* Brand strip */}
      <div className="border-b border-line/40 bg-cream/50">
        <div className="container-pricescout flex flex-wrap items-center justify-center gap-2 py-3 text-center sm:justify-between sm:text-left">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted sm:justify-start">
            <Handshake className="h-4 w-4 text-mint-600" aria-hidden />
            <span>Winter Park Benefit Shop</span>
            <span className="text-soft">&times;</span>
            <span className="text-ink">{brand.name}</span>
          </p>
          <span className="rounded-full bg-mint-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint-600">
            Partner program
          </span>
        </div>
      </div>

      {/* 1 Hero */}
      <section className="hero-bg hero-grain relative overflow-hidden pt-16 pb-14 sm:pt-20">
        <div className="container-pricescout">
          <span className="pill bg-mint-500/10 text-mint-600">Partner program · Full Pro features</span>
          <h1 className="gradient-text mb-4 mt-4 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
            Welcome, Winter Park Benefit Shop
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            {brand.name} is excited to partner with WPBS. Your team gets full Pro-tier access — no credit card needed
            for the first 30 days. Below is everything you need to onboard your sorting room and your back-room laptop.
          </p>
        </div>
      </section>

      {/* 2 What you get */}
      <Section className="bg-white !py-16" id="what-you-get">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">What you get</h2>
          <p className="section-subtitle">
            The same scanner trusted by thrift crews — phone camera, webcam, shared tag list, and Marketplace-ready flow.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <HeroScanFlowEmbed />
        </div>
        <ul className="mx-auto mt-10 max-w-xl list-inside list-disc space-y-2 text-left text-muted">
          <li>Identify items from a photo — barcode or visual</li>
          <li>Sold comps and a suggested tag price in seconds</li>
          <li>Shared crew tag list so everyone sees the same numbers</li>
          <li>Dual-surface: Android app (live) + web scanner on any laptop</li>
          <li>Up to 4 installs per WPBS account — phones and browsers both count</li>
        </ul>
      </Section>

      {/* 3 How to claim */}
      <section className="section-cream border-y border-line/30 !py-16" id="claim">
        <div className="container-pricescout">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title">How to claim access</h2>
            <p className="section-subtitle">Three quick steps — most staff finish in under two minutes.</p>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <figure className="text-center">
              <div className="relative mx-auto mb-3 aspect-[4/3] max-w-[280px] overflow-hidden rounded-xl border border-line bg-white shadow-md">
                <Image
                  src="/images/hero-phone-mockup.jpg"
                  alt="PriceScout homepage on a phone"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <figcaption className="font-display text-sm font-semibold text-ink">1. Visit pricescout.pro</figcaption>
              <p className="mt-2 text-sm text-muted">Open the site on your phone or the back-room computer.</p>
            </figure>
            <figure className="text-center">
              <div className="relative mx-auto mb-3 aspect-[4/3] max-w-[280px] overflow-hidden rounded-xl border border-line bg-white shadow-md">
                <Image
                  src="/images/hero-laptop-webcam.jpg"
                  alt="Laptop showing the PriceScout site with webcam flow"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <figcaption className="font-display text-sm font-semibold text-ink">2. Tap the WPBS button</figcaption>
              <p className="mt-2 text-sm text-muted">
                Scroll to the partner strip near the bottom of the homepage and choose <strong>WPBS</strong>.
              </p>
            </figure>
            <figure className="text-center">
              <div className="relative mx-auto mb-3 aspect-[4/3] max-w-[280px] overflow-hidden rounded-xl border border-line bg-white shadow-md">
                <Image
                  src="/images/app-interface.jpg"
                  alt="PriceScout scanner interface after sign-in"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <figcaption className="font-display text-sm font-semibold text-ink">3. Email in — magic link</figcaption>
              <p className="mt-2 text-sm text-muted">
                Submit your <code className="rounded bg-cream px-1 text-xs">@wpbs.org</code> or preferred email. Check
                your inbox for an instant sign-in link.
              </p>
            </figure>
          </div>
          <p className="mt-10 text-center text-sm text-muted">
            Need the homepage?{" "}
            <Link href="/" className="font-medium text-mint-600 hover:underline">
              Open pricescout.pro →
            </Link>
          </p>
        </div>
      </section>

      {/* 4 Demo video */}
      <Section className="!py-16" id="tour">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">90-second tour</h2>
          <p className="section-subtitle">Same walkthrough we show the public — your crew sees exactly this flow.</p>
        </div>
        <div className="container-pricescout mt-10">
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl border border-line bg-ink shadow-[0_30px_60px_-20px_rgba(17,203,157,0.25)]">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              muted
              poster="/images/app-interface.jpg"
              preload="metadata"
            >
              <source src="/videos/walkthrough.webm" type="video/webm" />
            </video>
          </div>
          <p className="mt-4 text-center text-sm text-soft">
            No video file in your environment?{" "}
            <Link href="/watch" className="text-mint-600 hover:underline">
              Open the public watch page
            </Link>{" "}
            or use the animated flow above.
          </p>
        </div>
      </Section>

      {/* 5 FAQ */}
      <section className="border-t border-line/30 bg-cream/40 py-16" id="faq">
        <div className="container-pricescout">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title">FAQ</h2>
            <p className="section-subtitle">Questions we hear from partner organizations.</p>
          </div>
          <dl className="mx-auto mt-12 max-w-2xl space-y-8">
            {FAQ.map((item) => (
              <div key={item.q}>
                <dt className="font-display text-lg font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6 Support */}
      <Section className="!pb-20" id="support">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title">Direct support</h2>
          <p className="section-subtitle">
            Partner issues skip the general queue — reach the operator team directly.
          </p>
        </div>
        <div className="container-pricescout mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="card-base text-left">
            <div className="mb-3 flex items-center gap-2 text-ink">
              <Mail className="h-5 w-5 text-mint-600" aria-hidden />
              <h3 className="font-display text-lg font-semibold">Email</h3>
            </div>
            <p className="text-sm text-muted">
              For fastest routing, use{" "}
              <a className="font-semibold text-mint-600 hover:underline" href={`mailto:${PARTNER_EMAIL}`}>
                {PARTNER_EMAIL}
              </a>
              . We typically reply the same business day.
            </p>
          </div>
          <WpbsSupportForm />
        </div>
      </Section>
    </article>
  );
}
