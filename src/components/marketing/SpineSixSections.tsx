import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { Card } from "@/components/marketing/Card";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { RelatedBlock } from "@/components/marketing/RelatedBlock";
import { Section } from "@/components/marketing/Section";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { brand } from "@/lib/brand";

export interface SpineSixModel {
  eyebrow: string;
  title: string;
  subtitle: string;
  trustStrip: string[];
  heroImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  problem: { title: string; body: string };
  audience: { title: string; body: string };
  capabilities: string[];
  steps: string[];
  faq: { q: string; a: string }[];
  relatedFeatures: { label: string; href: string }[];
  relatedIndustries: { label: string; href: string }[];
  finalCta: {
    title: string;
    subtitle: string;
    pricingLine: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
}

export function SpineSixSections({ model }: { model: SpineSixModel }) {
  return (
    <>
      {/* 1 hero */}
      <section className="hero-bg hero-grain relative overflow-hidden pt-24 pb-16">
        <div className="container-pricescout relative">
          <span className="pill bg-mint-500/10 text-mint-600">{model.eyebrow}</span>
          <h1 className="gradient-text mb-4 mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {model.title}
          </h1>
          <p className="mb-6 max-w-2xl text-lg text-muted">{model.subtitle}</p>
          <TrustStrip items={model.trustStrip} />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/trial" className="btn-primary btn-large">
              Create account
            </Link>
            <Link href="/watch" className="btn-secondary btn-large">
              Watch demo
            </Link>
          </div>
          {model.heroImage ? (
            <div className="mt-12 max-w-3xl">
              <Image
                src={model.heroImage.src}
                alt={model.heroImage.alt}
                width={model.heroImage.width}
                height={model.heroImage.height}
                className="w-full rounded-2xl border border-line shadow-lg"
                priority
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* 2 problem + who */}
      <Section className="bg-white">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 text-xl font-semibold text-ink">{model.problem.title}</h2>
            <p className="leading-relaxed text-muted">{model.problem.body}</p>
          </Card>
          <Card>
            <h2 className="mb-4 text-xl font-semibold text-ink">{model.audience.title}</h2>
            <p className="leading-relaxed text-muted">{model.audience.body}</p>
          </Card>
        </div>
      </Section>

      {/* 3 capabilities + steps */}
      <Section className="section-cream">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-ink">Capabilities</h2>
            <ul className="space-y-3 text-muted">
              {model.capabilities.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-1 text-mint-600">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-ink">How it works</h2>
            <ol className="space-y-4 text-muted">
              {model.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="step-number inline-flex shrink-0 items-center justify-center">{i + 1}</span>
                  <span className="pt-2">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* 4 FAQ */}
      <Section className="bg-white">
        <h2 className="mb-8 text-center text-3xl font-bold text-ink">FAQ</h2>
        <FAQ items={model.faq} />
      </Section>

      {/* 5 related */}
      <Section className="section-cream">
        <div className="grid gap-12 md:grid-cols-2">
          <RelatedBlock title="Related features" links={model.relatedFeatures} />
          <RelatedBlock title="Related industries" links={model.relatedIndustries} />
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/pricing" className="font-medium text-mint-600 underline underline-offset-4">
            Pricing
          </Link>
          <Link href="/faq" className="font-medium text-mint-600 underline underline-offset-4">
            FAQ hub
          </Link>
          <Link href="/watch" className="font-medium text-mint-600 underline underline-offset-4">
            Watch demo
          </Link>
          <Link href="/support/getting-started" className="font-medium text-mint-600 underline underline-offset-4">
            Getting started
          </Link>
        </div>
      </Section>

      {/* 6 final CTA */}
      <section className="section-dark py-20 text-white">
        <div className="container-pricescout mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">{model.finalCta.title}</h2>
          <p className="mb-8 text-lg text-slate-300">{model.finalCta.subtitle}</p>
          <CtaBanner
            primaryHref={model.finalCta.primaryHref ?? "/trial"}
            primaryLabel={model.finalCta.primaryLabel ?? "Create account"}
            secondaryHref={model.finalCta.secondaryHref ?? "/watch"}
            secondaryLabel={model.finalCta.secondaryLabel ?? "Watch demo"}
          />
          <p className="mt-8 text-xs font-medium uppercase tracking-wide text-mint-300">
            {model.finalCta.pricingLine}
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Questions? Email{" "}
            <a href={`mailto:${brand.emailFrom}`} className="text-mint-300 underline">
              {brand.emailFrom}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
