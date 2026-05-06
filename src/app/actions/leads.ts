"use server";

import { redirect } from "next/navigation";

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!validEmail(email) || message.length < 10) {
    redirect("/contact?error=invalid");
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_INBOUND_EMAIL ?? "hello@pricescout.pro";

  if (!key) {
    redirect("/contact?error=server");
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PriceScout <hello@pricescout.pro>",
        to: [to],
        subject: `Contact form: ${name || "website"}`,
        text: `${name}\n${email}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      redirect("/contact?error=server");
    }
  } catch {
    redirect("/contact?error=server");
  }

  redirect("/contact?ok=1");
}

export async function submitTrial(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const org = String(formData.get("organization") ?? "").trim();

  if (!validEmail(email) || name.length < 2) {
    redirect("/trial?error=invalid");
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_INBOUND_EMAIL ?? "hello@pricescout.pro";

  if (!key) {
    redirect("/trial?error=server");
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PriceScout <hello@pricescout.pro>",
        to: [to],
        subject: `Trial signup request: ${name}`,
        text: `${name}\n${email}\n${org}\n\n(Account provisioning ties to upcoming auth rollout — team follows up manually until Stripe checkout flows.)`,
      }),
    });
    if (!res.ok) {
      redirect("/trial?error=server");
    }
  } catch {
    redirect("/trial?error=server");
  }

  redirect("/trial?ok=1");
}
