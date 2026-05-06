import { PricingTiers } from "@/components/PricingTiers";
import { brand } from "@/lib/brand";

export const metadata = {
  title: `Pricing — ${brand.name}`,
  description: `Pricing for ${brand.name}: Week Pass $29, Pro Monthly $49, Pro Annual $490, Founders Lifetime $699 (cap 100). Up to 4 scanners on every tier; add devices for $15/mo each.`,
};

export default function PricingPage() {
  return (
    <section className="section-cream py-20">
      <div className="container-pricescout">
        <div className="section-header-center">
          <h1 className="section-title">Pricing that fits the size of your operation</h1>
          <p className="section-subtitle">
            Running a one-weekend yard sale? Grab a Week Pass. Running a thrift store year-round? Pro Annual saves you ~17%. Up to 4 scanners on every tier; add more for $15/mo each.
          </p>
        </div>
        <div className="mt-16">
          <PricingTiers />
        </div>
        <div className="mx-auto mt-12 max-w-2xl text-center text-sm text-soft">
          <p>
            Stripe handles billing. Cancel anytime. Founders Lifetime is a one-time purchase &mdash; no
            subscription, no renewals.
          </p>
          <p className="mt-2">
            Each subscription runs across up to 4 scanner installs (Android live; iOS in review). Add additional scanners for $15/month each &mdash; manage devices in the app&rsquo;s Devices tab.
          </p>
        </div>
      </div>
    </section>
  );
}
