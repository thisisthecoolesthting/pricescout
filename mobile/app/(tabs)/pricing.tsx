import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Check, Sparkles, Smartphone } from "lucide-react-native";
import { brand, colors, radii, space } from "@/lib/brand";

interface Tier {
  id: string;
  name: string;
  price: string;
  cadence: string;
  badge?: string;
  features: string[];
  ctaLabel: string;
  url: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    id: "week_pass",
    name: "Week Pass",
    price: "$29",
    cadence: "/week",
    badge: "Weekend sale",
    features: ["7 days unlimited scanning", "Up to 4 scanner installs", "No auto-renew", "Perfect for one-weekend sales"],
    ctaLabel: "Buy a Week Pass",
    url: `https://${brand.domain}/api/billing/checkout?tier=week_pass`,
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    price: "$49",
    cadence: "/month",
    features: ["Unlimited crew scanning", "Up to 4 scanner installs", "eBay sold-comp lookup", "Buy/skip verdicts", "Shared flip log"],
    ctaLabel: "Start Pro Monthly",
    url: `https://${brand.domain}/api/billing/checkout?tier=pro_monthly`,
  },
  {
    id: "pro_annual",
    name: "Pro Annual",
    price: "$490",
    cadence: "/year",
    badge: "Most Popular",
    featured: true,
    features: ["Everything in Pro Monthly", "Up to 4 scanner installs", "Save ~17%", "Best for year-round stores"],
    ctaLabel: "Upgrade to Annual",
    url: `https://${brand.domain}/api/billing/checkout?tier=pro_annual`,
  },
  {
    id: "founders_lifetime",
    name: "Founders Lifetime",
    price: "$699",
    cadence: "once",
    badge: "First 100 only",
    features: ["Everything in Pro, forever", "4 scanner installs forever", "First 100 customers", "Founders badge"],
    ctaLabel: "Claim a Founders seat",
    url: `https://${brand.domain}/api/billing/checkout?tier=founders_lifetime`,
  },
];

export default function PricingScreen() {
  return (
    <ScrollView style={s.root} contentContainerStyle={{ padding: space[4], paddingBottom: 32 }}>
      <Text style={s.h1}>Pricing that fits your operation</Text>
      <Text style={s.sub}>
        Up to 4 scanner installs on every tier. Add more for $15/mo each.
      </Text>
      {TIERS.map((t) => (
        <TierCard key={t.id} tier={t} />
      ))}
      <View style={s.addonCard}>
        <View style={s.addonRow}>
          <Smartphone size={16} color={colors.mint600} />
          <Text style={s.addonLabel}>Bigger crew?</Text>
        </View>
        <Text style={s.addonBody}>
          Every paid tier includes 4 scanner installs. Add additional scanners for $15/month each.
          Manage them in the Devices tab — rotate phones in and out anytime.
        </Text>
      </View>
      <Text style={s.fine}>
        Stripe handles billing on the web. Cancel anytime. Founders Lifetime is one-time, no subscription.
      </Text>
    </ScrollView>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  return (
    <View style={[s.card, tier.featured ? s.cardFeatured : null]}>
      {tier.badge ? (
        <View style={[s.badge, tier.featured ? s.badgePrimary : s.badgeOutline]}>
          {tier.id === "founders_lifetime" ? (
            <Sparkles size={12} color={tier.featured ? colors.white : colors.mint600} />
          ) : null}
          <Text style={[s.badgeText, { color: tier.featured ? colors.white : colors.mint600 }]}>{tier.badge}</Text>
        </View>
      ) : null}
      <Text style={s.tierName}>{tier.name}</Text>
      <View style={s.priceRow}>
        <Text style={s.priceAmount}>{tier.price}</Text>
        <Text style={s.priceCadence}>{tier.cadence}</Text>
      </View>
      <View style={{ marginTop: space[3] }}>
        {tier.features.map((f) => (
          <View key={f} style={s.featureRow}>
            <Check color={colors.mint500} size={16} />
            <Text style={s.featureText}>{f}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => Linking.openURL(tier.url)}
        style={[s.cta, tier.featured ? s.ctaPrimary : s.ctaOutline]}
      >
        <Text style={[s.ctaText, tier.featured ? s.ctaTextPrimary : s.ctaTextOutline]}>{tier.ctaLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  h1: { fontSize: 24, fontWeight: "700", color: colors.ink, marginBottom: 8, textAlign: "center" },
  sub: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: space[4] },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space[5],
    marginBottom: space[3],
    position: "relative",
  },
  cardFeatured: { borderColor: colors.mint500, borderWidth: 2 },
  badge: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  badgePrimary: { backgroundColor: colors.mint500 },
  badgeOutline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.mint500 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4 },
  tierName: { fontSize: 18, fontWeight: "700", color: colors.ink, marginTop: space[1], textAlign: "center" },
  priceRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginTop: 4 },
  priceAmount: { fontSize: 36, fontWeight: "800", color: colors.ink },
  priceCadence: { fontSize: 14, color: colors.muted, marginLeft: 4 },
  featureRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: 8 },
  featureText: { color: colors.body, fontSize: 14 },
  cta: {
    marginTop: space[4],
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: radii.lg,
  },
  ctaPrimary: { backgroundColor: colors.mint500 },
  ctaOutline: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.mint500 },
  ctaText: { fontSize: 14, fontWeight: "700" },
  ctaTextPrimary: { color: colors.white },
  ctaTextOutline: { color: colors.mint600 },
  fine: { fontSize: 11, color: colors.muted, textAlign: "center", marginTop: space[3] },
  addonCard: {
    backgroundColor: colors.mint50,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.mint500,
    padding: space[4],
    marginVertical: space[3],
  },
  addonRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  addonLabel: { color: colors.mint600, fontWeight: "700", fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase" },
  addonBody: { color: colors.body, fontSize: 13, lineHeight: 19 },
});
