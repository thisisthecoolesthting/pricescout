"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function LoginForm({
  initialError,
  nextPath,
}: {
  initialError?: string;
  nextPath: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const banner = useMemo(() => {
    if (initialError === "config") return "Auth is not configured (missing PS_SESSION_SECRET).";
    return null;
  }, [initialError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setErr("Invalid email or password.");
      return;
    }
    router.push(nextPath || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line/60 bg-white p-8 shadow-md">
      {(banner || err) && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {banner ?? err}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-line/70 px-4 py-3 text-ink outline-none ring-mint-500/30 focus:ring-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-line/70 px-4 py-3 text-ink outline-none ring-mint-500/30 focus:ring-2"
        />
      </div>
      <button type="submit" className="btn-primary btn-full btn-large">
        Sign in
      </button>
    </form>
  );
}
