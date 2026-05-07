"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type InviteRow = { id: string; email: string; role: string; expiresAt: string; createdAt: string };

export function TeamInviteShell({
  isOwner,
  initialInvites,
  tenantIsWpbs,
}: {
  isOwner: boolean;
  initialInvites: InviteRow[];
  tenantIsWpbs: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "admin" | "scanner">("scanner");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [wpbsBusy, setWpbsBusy] = useState(false);

  const send = async () => {
    if (!isOwner) return;
    setBusy(true);
    setBanner(null);
    setInviteUrl(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const j = (await res.json()) as { ok?: boolean; inviteUrl?: string; error?: string };
      if (!res.ok) throw new Error(j.error ?? "Invite failed");
      setBanner(
        `Invite created for ${email.trim()}. Share the link below — they will set a password when they open it.`,
      );
      setInviteUrl(j.inviteUrl ?? null);
      setEmail("");
      router.refresh();
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  };

  const extendWpbs = async () => {
    setWpbsBusy(true);
    try {
      const res = await fetch("/api/admin/wpbs-extend", { method: "POST" });
      if (!res.ok) throw new Error("Extend failed");
      router.refresh();
    } finally {
      setWpbsBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      {tenantIsWpbs && isOwner ? (
        <section className="rounded-2xl border border-mint-500/30 bg-mint-50/50 p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Partner access</h2>
          <p className="mt-2 text-sm text-muted">
            Extend the Winter Park Benefit Shop window by 30 days after ops approval conversations.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn-primary" disabled={wpbsBusy} onClick={() => void extendWpbs()}>
              {wpbsBusy ? "Updating…" : "Extend 30 days"}
            </button>
            <Link href="/pricing?upgrade-from=wpbs" className="btn-secondary">
              Convert to paid plan
            </Link>
          </div>
        </section>
      ) : null}

      {isOwner ? (
        <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Invite a teammate</h2>
          <p className="mt-2 text-sm text-muted">
            Copy the invite link after you send — your teammate sets a password on the next screen.
          </p>
          {banner ? <p className="mt-3 rounded-lg bg-cream px-3 py-2 text-sm text-ink">{banner}</p> : null}
          {inviteUrl ? <p className="mt-2 break-all font-mono text-xs text-mint-800">{inviteUrl}</p> : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-medium text-ink">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line/70 px-4 py-2.5 text-sm"
                placeholder="volunteer@yourstore.org"
              />
            </label>
            <label className="w-full text-sm font-medium text-ink sm:w-40">
              Role
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
                className="mt-1 w-full rounded-xl border border-line/70 px-4 py-2.5 text-sm"
              >
                <option value="scanner">Scanner</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </label>
            <button type="button" className="btn-primary h-[42px] px-6" disabled={busy} onClick={() => void send()}>
              {busy ? "Sending…" : "Send invite"}
            </button>
          </div>
        </section>
      ) : null}

      {isOwner && initialInvites.length > 0 ? (
        <section className="rounded-2xl border border-line/60 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Pending invites</h2>
          <ul className="mt-4 divide-y divide-line/40 text-sm">
            {initialInvites.map((i) => (
              <li key={i.id} className="flex flex-wrap justify-between gap-2 py-3">
                <span className="font-medium text-ink">{i.email}</span>
                <span className="text-muted">{i.role}</span>
                <span className="text-xs text-soft">expires {new Date(i.expiresAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
