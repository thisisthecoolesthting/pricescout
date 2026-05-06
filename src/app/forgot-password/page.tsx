"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { message?: string };
    setMsg(data.message ?? "Request received.");
  }

  return (
    <div className="hero-bg hero-grain min-h-[70vh] pt-24 pb-16">
      <div className="container-pricescout mx-auto max-w-md">
        <h1 className="gradient-text mb-6 text-3xl font-bold">Forgot password</h1>
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line/60 bg-white p-8 shadow-md">
          {msg && (
            <div role="status" className="rounded-lg bg-mint-500/10 px-4 py-3 text-sm text-ink">
              {msg}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line/70 px-4 py-3 text-ink outline-none ring-mint-500/30 focus:ring-2"
            />
          </div>
          <button type="submit" className="btn-primary btn-full btn-large">
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}
