"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InviteAcceptForm({ token }: { token: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(j.error ?? "Could not complete signup");
      router.push("/login?invited=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-line/60 bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-bold text-ink">Join your crew</h1>
      <p className="text-sm text-muted">Set your display name and password to activate this invite.</p>
      {error ? (
        <div
          role="alert"
          className="mb-1 rounded-2xl border-2 px-4 py-3 text-sm"
          style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}
        >
          <strong className="font-semibold">Couldn&apos;t finish signup.</strong> {error}
        </div>
      ) : null}
      <label className="block text-sm font-medium text-ink">
        Display name
        <input
          className="mt-1 w-full rounded-xl border border-line/70 px-4 py-2.5 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        Password (min 8 characters)
        <input
          type="password"
          className="mt-1 w-full rounded-xl border border-line/70 px-4 py-2.5 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="button" className="btn-primary w-full py-3" disabled={busy} onClick={() => void submit()}>
        {busy ? "Saving…" : "Create account"}
      </button>
    </div>
  );
}
