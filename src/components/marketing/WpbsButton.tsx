"use client";

import { useState } from "react";

/**
 * Winter Park Benefit Shop partner entry — public label is exactly "WPBS" (dispatch 008).
 * Full org name never appears in this component.
 */
export function WpbsButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string; link?: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/wpbs-grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name.trim() ? name.trim() : undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      const err = typeof data.error === "string" ? data.error : null;
      if (res.status === 429) {
        setMsg({ type: "err", text: err || "Too many grants from this network. Try again tomorrow." });
      } else if (res.status === 409 || res.status === 400) {
        setMsg({ type: "err", text: err || "Could not complete request." });
      } else if (!res.ok) {
        setMsg({ type: "err", text: "Something went wrong. Try again later." });
      } else if (data.sent === true) {
        setMsg({ type: "ok", text: "Check your email for the access link." });
      } else if (typeof data.magicLinkUrl === "string") {
        setMsg({
          type: "ok",
          text: "Email is not configured — use this link once to enter your account:",
          link: data.magicLinkUrl,
        });
      } else {
        setMsg({ type: "ok", text: "Request received." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        title="Partner access"
        className="pill border border-line/60 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-cream"
        onClick={() => {
          setOpen(true);
          setMsg(null);
        }}
      >
        WPBS
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[120] bg-ink/40"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed inset-y-0 right-0 z-[130] flex w-full max-w-md flex-col border-l border-line/60 bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wpbs-dialog-title"
          >
            <div className="border-b border-line/60 px-6 py-4">
              <h2 id="wpbs-dialog-title" className="font-display text-lg font-semibold text-ink">
                Partner access
              </h2>
              <p className="mt-1 text-sm text-muted">Enter the email we recognize for your crew.</p>
            </div>
            <form onSubmit={onSubmit} className="flex flex-1 flex-col px-6 py-6">
              <label className="text-xs font-medium text-soft" htmlFor="wpbs-email">
                Email
              </label>
              <input
                id="wpbs-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-xl border border-line/70 px-4 py-2 text-sm text-ink outline-none ring-mint-500/30 focus:ring-2"
                autoComplete="email"
              />
              <label className="mt-4 text-xs font-medium text-soft" htmlFor="wpbs-name">
                Name (optional)
              </label>
              <input
                id="wpbs-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 rounded-xl border border-line/70 px-4 py-2 text-sm text-ink outline-none ring-mint-500/30 focus:ring-2"
              />
              {msg ? (
                <div
                  className={`mt-4 text-sm leading-relaxed ${msg.type === "err" ? "text-red-600" : "text-mint-700"}`}
                >
                  <p>{msg.text}</p>
                  {msg.link ? (
                    <a href={msg.link} className="mt-2 block font-medium underline break-all">
                      Open access link
                    </a>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-auto flex gap-3 pt-8">
                <button type="button" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? "Sending…" : "Get my access link"}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
}
