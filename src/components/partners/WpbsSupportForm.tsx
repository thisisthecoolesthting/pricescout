"use client";

import { useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-line/70 bg-white px-4 py-3 text-base text-ink shadow-sm focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/30";

const ROLES = [
  { value: "volunteer", label: "Volunteer" },
  { value: "staff", label: "Staff" },
  { value: "coordinator", label: "Coordinator" },
  { value: "director", label: "Director" },
] as const;

export function WpbsSupportForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>(ROLES[0].value);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    setBusy(true);
    try {
      const res = await fetch("/api/partners/wpbs/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: unknown };
      if (!res.ok) {
        const e = data.error;
        setErr(
          typeof e === "string"
            ? e
            : e && typeof e === "object"
              ? "Please check the form fields."
              : "Something went wrong.",
        );
        return;
      }
      if (data.ok) {
        setOk(true);
        setMessage("");
      }
    } catch {
      setErr("Network error — try again or email partners@pricescout.pro");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="card-base space-y-4 text-left">
      {ok ? (
        <p className="text-sm font-medium text-mint-600" role="status">
          Thanks — we received your message and will get back to you.
        </p>
      ) : null}
      {err ? (
        <p className="text-sm text-red-600" role="alert">
          {err}
        </p>
      ) : null}

      <div>
        <label className="mb-1 block text-xs font-medium text-soft" htmlFor="wps-name">
          Name
        </label>
        <input
          id="wps-name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={200}
          autoComplete="name"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-soft" htmlFor="wps-role">
          Role at WPBS
        </label>
        <select
          id="wps-role"
          className={fieldClass}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-soft" htmlFor="wps-email">
          Email
        </label>
        <input
          id="wps-email"
          type="email"
          className={fieldClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={320}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-soft" htmlFor="wps-msg">
          How can we help?
        </label>
        <textarea
          id="wps-msg"
          className={`${fieldClass} min-h-[120px] resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={8000}
        />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={busy}>
        {busy ? "Sending…" : "Send to partner support"}
      </button>
    </form>
  );
}
