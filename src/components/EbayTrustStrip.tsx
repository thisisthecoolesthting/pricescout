// src/components/EbayTrustStrip.tsx
//
// Distinguishable trust strip for PriceScout marketing pages.
// Uses eBay's brand color pips (red/blue/yellow/green) plus a sold-comps
// trust line. Does NOT include the eBay wordmark/logo (no license).
//
// If/when we get clearance, swap <EbayPips /> for <img src="/brand/ebay.svg" alt="eBay" />.

import type { CSSProperties } from "react";

const PIP: CSSProperties = {
  display: "inline-block",
  width: "0.65rem",
  height: "0.65rem",
  borderRadius: "9999px",
  marginRight: "0.15rem",
  verticalAlign: "middle",
};

function EbayPips() {
  return (
    <span
      aria-label="eBay color pips"
      style={{ display: "inline-flex", alignItems: "center", marginRight: "0.5rem" }}
    >
      <span style={{ ...PIP, background: "#E53238" }} />
      <span style={{ ...PIP, background: "#0064D2" }} />
      <span style={{ ...PIP, background: "#F5AF02" }} />
      <span style={{ ...PIP, background: "#86B817" }} />
    </span>
  );
}

interface Props {
  text?: string;
  variant?: "compact" | "card";
  className?: string;
}

export default function EbayTrustStrip({
  text = "Powered by real eBay sold-comps — not list prices, not estimates.",
  variant = "card",
  className = "",
}: Props) {
  if (variant === "compact") {
    return (
      <p className={`mt-3 inline-flex items-center text-sm text-slate-700 ${className}`}>
        <EbayPips />
        <span>{text}</span>
      </p>
    );
  }

  return (
    <div
      className={`mt-8 flex items-center gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 ${className}`}
      role="note"
    >
      <EbayPips />
      <p className="m-0 text-sm text-slate-700">
        <strong className="font-semibold text-slate-900">Real eBay sold-comps.</strong>{" "}
        {text.replace("Powered by real eBay sold-comps — ", "")}
      </p>
    </div>
  );
}
