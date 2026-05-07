"use client";

import { useState } from "react";

export function BillingPortalButtons({ portalDisabled, disabledTitle }: { portalDisabled: boolean; disabledTitle: string }) {
  const [busy, setBusy] = useState(false);

  const openPortal = async () => {
    if (portalDisabled) return;
    setBusy(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const j = (await res.json()) as { url?: string; error?: string; message?: string };
      if (!res.ok || !j.url) {
        throw new Error(j.message ?? j.error ?? "Portal unavailable");
      }
      window.location.assign(j.url);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
      <button type="button" className="btn-secondary" disabled={portalDisabled || busy} title={portalDisabled ? disabledTitle : "Opens Stripe Customer Portal"} onClick={() => void openPortal()}>{busy ? "Opening…" : "Manage in Stripe Customer Portal"}</button>
      <button type="button" className="btn-ghost" disabled={portalDisabled || busy} title={portalDisabled ? disabledTitle : "Subscription changes open inside the Stripe portal"} onClick={() => void openPortal()}>Cancel subscription</button>
    </div>
  );
}
