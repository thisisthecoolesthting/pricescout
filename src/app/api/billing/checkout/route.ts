import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutTierSchema } from "@/lib/api-schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/** Tier checkout modes — Stripe Price objects must match mode at Stripe dashboard. */
function tierCheckoutMode(tier: string): "subscription" | "payment" {
  if (tier === "week_pass" || tier === "founders_lifetime") return "payment";
  return "subscription";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tierRaw = url.searchParams.get("tier");
  const tierParsed = tierRaw ? checkoutTierSchema.safeParse(tierRaw) : { success: false as const };
  if (!tierParsed.success) {
    return NextResponse.json(
      {
        error: "Unknown tier",
        message: "That tier isn't recognized. Pick a tier from the pricing page.",
      },
      { status: 400 },
    );
  }

  const tier = tierParsed.data;

  const tierMap: Record<string, string | undefined> = {
    week_pass: process.env.STRIPE_PRICE_WEEK_PASS,
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
    founders_lifetime: process.env.STRIPE_PRICE_FOUNDERS_LIFETIME,
  };

  const priceId = tierMap[tier];
  const client = stripe();

  if (!priceId || !client) {
    return NextResponse.json(
      {
        error: "billing_not_ready",
        message:
          "Billing is being set up right now. Email hello@pricescout.pro and we'll lock in your tier and reach out the moment the gateway is live.",
        tier,
      },
      { status: 503 },
    );
  }

  if (tier === "founders_lifetime") {
    // Founders-lifetime cap check belongs here — requires Stripe Search/List or DB mirror of payments.
    // Until persisted counters exist, operators enforce manually — metadata hooks prepared below.
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ?? `${url.protocol}//${url.host}`;

  try {
    const session = await client.checkout.sessions.create({
      mode: tierCheckoutMode(tier),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?checkout=success&tier=${encodeURIComponent(tier)}`,
      cancel_url: `${origin}/pricing?checkout=cancel`,
      metadata: {
        tier,
        tenant_slug: process.env.DEFAULT_TENANT_SLUG ?? "demo-thrift",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "stripe_no_url" }, { status: 500 });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "stripe_session_failed",
        message: "Checkout could not start — verify Stripe Price IDs match checkout mode.",
      },
      { status: 502 },
    );
  }
}
