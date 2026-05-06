import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const client = stripe();

  if (!webhookSecret || !sig || !client) {
    return NextResponse.json(
      { error: "Webhook not configured", message: "STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY unset." },
      { status: 503 },
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const slug = session.metadata?.tenant_slug;
      const cust = session.customer;
      const customerId = typeof cust === "string" ? cust : cust?.id;
      if (slug && customerId) {
        await prisma.tenant.updateMany({
          where: { slug },
          data: {
            stripeCustomerId: customerId,
            subscriptionStatus: "active",
          },
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const cust = sub.customer;
      const customerId = typeof cust === "string" ? cust : cust?.id;
      if (customerId) {
        await prisma.tenant.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: sub.status ?? "active",
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const cust = sub.customer;
      const customerId = typeof cust === "string" ? cust : cust?.id;
      if (customerId) {
        await prisma.tenant.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: "canceled" },
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
