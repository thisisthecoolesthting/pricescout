import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Store,
  Home as HomeIcon,
  Tent,
  Briefcase,
  Zap,
  CheckCircle2,
  Users,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { PricingTiers } from "@/components/PricingTiers";
import { FAQ } from "@/components/FAQ";
import { Reveal } from "@/components/Reveal";
import { HOME_FAQ_ITEMS } from "@/content/faq-data";
import { TrustStrip } from "@/components/marketing/TrustStrip";

const FAQS = [...HOME_FAQ_ITEMS];

export default function HomePage() {
  return (
    <>
      {/* HERO ------------------------------------------------------------ */}
      <section
        className="hero-bg hero-grain relative overflow-hidden pt-28 pb-24 sm:pt-32 lg:pt-36"
        id="hero"
      >
        <div className="container-pricescout relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="pill bg-mint-500/10 text-mint-600">For thrift stores, estate sales &amp; yard sales</span>
              <h1 className="gradient-text mb-6 mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Stop guessing what donations are worth.
              </h1>
              <p className="mb-8 max-w-xl text-lg text-muted sm:text-xl">
                {brand.name} runs on the phones already in your crew&apos;s pockets — or on the back-room laptop with a webcam pointed at the triage table. Either camera, same answer in seconds: what is it, what does it sell for, what should the tag say? Up to 4 scanner installs on every paid tier — phones and browsers both count.
              </p>
              <div className="mb-6">
                <TrustStrip
                  items={[
                    "Phones + browsers both count",
                    "Android live · iOS in review",
                    "Webcam works on any laptop",
                  ]}
                />
              </div>
              <div className="mb-4 flex flex-wrap gap-4">
                <Link href="/scan" className="btn-primary btn-large">
                  <Camera aria-hidden className="mr-2 h-5 w-5" />
                  Try the scanner
                </Link>
                <Link href="/pricing" className="btn-secondary btn-large">
                  See pricing
                </Link>
              </div>
              <Link href="/watch" className="mb-6 inline-block text-sm font-medium text-mint-600 hover:underline">
                Or watch the 90-second tour &rarr;
              </Link>
              <p className="text-sm text-soft">
                Phone in your pocket &middot; Webcam on the back-room laptop &middot; Tablet at the checkout counter — pick your camera.
              </p>
            </div>
            <div className="relative flex justify-center lg:justify-start">
              <div className="grid w-full max-w-[920px] grid-cols-1 gap-6 sm:grid-cols-2">
                <Image
                  src="/images/hero-phone-mockup.jpg"
                  alt={`${brand.name} on a phone scanning a thrift-store item`}
                  width={440}
                  height={587}
                  className="animate-float w-full max-w-[440px] justify-self-center rounded-3xl shadow-[0_30px_60px_-20px_rgba(17,203,157,0.25)] sm:justify-self-end"
                  priority
                />
                <Image
                  src="/images/hero-laptop-webcam.jpg"
                  alt={`${brand.name} in a laptop browser at the triage table with a USB webcam`}
                  width={440}
                  height={587}
                  className="h-[587px] w-full max-w-[440px] justify-self-center rounded-3xl object-cover shadow-[0_30px_60px_-20px_rgba(17,203,157,0.2)] sm:justify-self-start"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS PRICESCOUT? --------------------------------------------- */}
      <section id="what-is" className="section bg-white">
        <div className="container-pricescout">
          <div className="section-header-center">
            <h2 className="section-title">Built for the people pricing the table</h2>
            <p className="section-subtitle">
              Anywhere a crew is staring at a pile of stuff wondering what to charge, {brand.name} answers in seconds.
            </p>
          </div>

          <div className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted sm:text-lg">
            <p>
              The sorting room of a thrift store. The dining room of an estate sale. The driveway on Saturday morning. The flea-market booth at 6am setup. {brand.name} identifies what each item is from a photo, pulls real eBay sold-listing data, and tells you what to put on the tag — across up to 4 scanner installs at once (phones and browsers both count).
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0}>
              <AudienceCard
                icon={<Store className="h-8 w-8" />}
                title="Thrift store owners"
                body="Sort and price donations in batches. Whole back room scans together — 4 staff, 4 phones, one shared flip log."
              />
            </Reveal>
            <Reveal delay={80}>
              <AudienceCard
                icon={<HomeIcon className="h-8 w-8" />}
                title="Estate sale operators"
                body="Walk a house in an afternoon. Tag every room with confidence — and a Week Pass covers the whole sale."
              />
            </Reveal>
            <Reveal delay={160}>
              <AudienceCard
                icon={<Tent className="h-8 w-8" />}
                title="Yard sale weekenders"
                body="Don&rsquo;t leave $40 on the lawn for a $5 sticker. Snap before you tag. One Week Pass, done."
              />
            </Reveal>
            <Reveal delay={240}>
              <AudienceCard
                icon={<Briefcase className="h-8 w-8" />}
                title="Flea market &amp; resellers"
                body="Source faster, list smarter. Real sold-comps mean the tag price you set is the price your stuff actually moves at."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS ---------------------------------------------------- */}
      <section id="how-it-works" className="section section-cream">
        <div className="container-pricescout">
          <div className="section-header">
            <h2 className="section-title">How does {brand.name} work?</h2>
            <p className="section-subtitle">
              Three steps. About ten seconds per item, no matter who&rsquo;s holding the phone.
            </p>
          </div>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[auto_1fr]">
            <div className="flex justify-center">
              <Image
                src="/images/scan-flow.jpg"
                alt={`${brand.name} mobile scan flow`}
                width={400}
                height={533}
                className="w-full max-w-[400px] rounded-3xl"
              />
            </div>
            <div className="space-y-12">
              <Reveal delay={0}>
                <Step
                  n={1}
                  title="Open the scanner"
                  body={`Open ${brand.name} on any phone in your crew, or open /scan in a laptop browser. Android lives on Google Play. Allow camera access and you&apos;re in.`}
                />
              </Reveal>
              <Reveal delay={120}>
                <Step
                  n={2}
                  title="Snap the item"
                  body="Point at any donation, sale-table find, or estate lot. The vision model picks out brand, model, era, material — even when there&rsquo;s no barcode. Multiple staff can scan at once; everyone&rsquo;s scans land in the same shared flip log."
                />
              </Reveal>
              <Reveal delay={240}>
                <Step
                  n={3}
                  title="Price the tag"
                  body="The app shows you the eBay sold-listing median, your estimated net after fees and shipping, and a suggested tag price. Crew agrees, sticker goes on, item hits the floor."
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* WHY USE PRICESCOUT? --------------------------------------------- */}
      <section id="why-use" className="section bg-white">
        <div className="container-pricescout">
          <div className="section-header-center">
            <h2 className="section-title">Why thrift store crews switch to {brand.name}</h2>
            <p className="section-subtitle">
              Forget Googling at the back-room table. Forget the senior staff being the only person who knows what things sell for.
            </p>
          </div>

          <div className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted sm:text-lg">
            <p>
              Built for crews of 2–5 sorting through donations, estate-lot tables, and yard-sale piles. Every scan gives the whole team:
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <Reveal delay={0}>
              <AudienceCard
                icon={<Zap className="h-8 w-8" />}
                title="Sub-second verdicts"
                body="Cached comps and on-device barcode reads mean most scans return faster than you can hand the item to the next sorter."
              />
            </Reveal>
            <Reveal delay={100}>
              <AudienceCard
                icon={<Users className="h-8 w-8" />}
                title="Whole crew, one view"
                body="4 phones share one flip log. New volunteer? They scan the same items the senior pricer would, and the verdict is the verdict."
              />
            </Reveal>
            <Reveal delay={200}>
              <AudienceCard
                icon={<CheckCircle2 className="h-8 w-8" />}
                title="Real sold-listing data"
                body="Backed by thousands of completed eBay sales, not wishful active prices. The tag price you set is what the item actually moves at."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING --------------------------------------------------------- */}
      <section id="pricing" className="section section-cream">
        <div className="container-pricescout">
          <div className="section-header-center">
            <h2 className="section-title">Pricing that fits the size of your operation</h2>
            <p className="section-subtitle">
              Running a one-weekend yard sale? Grab a Week Pass. Running a thrift store year-round? Pro Annual saves you ~17%. Up to 4 scanners on every tier; add more for $15/mo each.
            </p>
          </div>
          <div className="mt-16">
            <PricingTiers />
          </div>
        </div>
      </section>

      {/* FAQ ------------------------------------------------------------- */}
      <section id="faq" className="section bg-white">
        <div className="container-pricescout">
          <div className="section-header-center">
            <h2 className="section-title">FAQ</h2>
            <p className="section-subtitle">
              Everything store owners and sale runners ask before they sign up.
            </p>
          </div>
          <div className="mt-12">
            <FAQ items={FAQS} />
          </div>
        </div>
      </section>

      {/* DOWNLOAD / FINAL CTA -------------------------------------------- */}
      <section id="cta" className="section-dark py-20 text-white">
        <div className="container-pricescout">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                Stop leaving margin on the donation table.
              </h2>
              <p className="mb-8 text-lg text-slate-300">
                Open {brand.name} on your crew&rsquo;s phones today. Price every item in seconds — together.
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <Link href="/scan" className="btn-primary btn-large">
                  <Camera aria-hidden className="mr-2 h-5 w-5" />
                  Try the scanner
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-white/90 hover:text-mint-500">
                  See pricing &rarr;
                </Link>
              </div>
              <p className="text-sm text-slate-400">
                Phone in your pocket &middot; Webcam on the back-room laptop &middot; Tablet at checkout — same scanner, same verdicts
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/images/app-interface.jpg"
                alt={`${brand.name} app interface`}
                width={300}
                height={400}
                className="w-full max-w-[300px] rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AudienceCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card-base text-center">
      <div className="audience-icon-wrap">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex items-start gap-6">
      <div className="step-number">{n}</div>
      <div>
        <h3 className="mb-2 text-xl font-bold text-ink">
          Step {n}: {title}
        </h3>
        <p className="text-base leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}
