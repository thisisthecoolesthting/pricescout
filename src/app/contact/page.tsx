import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { submitContact } from "@/app/actions/leads";

export const metadata: Metadata = {
  title: `Contact — ${brand.name}`,
  description: `Reach ${brand.name} — deployment questions, partnerships, press.`,
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please enter a valid email plus at least ten characters of detail so humans can reply.",
  server: "Email relay is still provisioning — try hello@pricescout.pro directly while automation catches up.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const sp = await searchParams;
  const errorMsg = sp.error ? ERROR_MESSAGES[sp.error] ?? ERROR_MESSAGES.server : null;

  return (
    <article className="hero-bg hero-grain pt-24 pb-20">
      <div className="container-pricescout mx-auto max-w-xl">
        <h1 className="gradient-text mb-4 text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mb-8 text-muted">
          Operators respond personally — usually within one business day. For urgent outages email{" "}
          <a href={`mailto:${brand.emailFrom}`} className="font-semibold text-mint-600 hover:underline">
            {brand.emailFrom}
          </a>
          .
        </p>

        {errorMsg ? (
          <div
            role="alert"
            className="mb-4 rounded-2xl border-2 px-4 py-3 text-sm"
            style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
          >
            <strong className="font-semibold">Could not send yet.</strong> {errorMsg}
          </div>
        ) : null}

        {sp.ok ? (
          <div
            role="status"
            className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            Message received — thanks for reaching out.
          </div>
        ) : null}

        <form action={submitContact} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              minLength={10}
              className="w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30"
            />
          </div>
          <button type="submit" className="btn-primary btn-full btn-large">
            Send message
          </button>
        </form>

        <p className="mt-8 text-sm text-muted">
          <Link href="/legal/privacy" className="text-mint-600 hover:underline">
            Privacy policy
          </Link>
        </p>
      </div>
    </article>
  );
}
