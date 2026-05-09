"use client";

import { useEffect, useState } from "react";
import { BarChart3, Camera, ListChecks } from "lucide-react";

const PHASES = [
  {
    key: "scan",
    label: "Snap",
    sub: "Photo or webcam — same flow.",
    icon: Camera,
    accent: "text-blue-700",
    ring: "ring-blue-700/30",
  },
  {
    key: "price",
    label: "Price",
    sub: "Sold comps back the tag suggestion.",
    icon: BarChart3,
    accent: "text-mint-600",
    ring: "ring-mint-500/40",
  },
  {
    key: "post",
    label: "Post",
    sub: "Save to the crew tag list & list faster.",
    icon: ListChecks,
    accent: "text-mint-600",
    ring: "ring-mint-500/40",
  },
] as const;

/**
 * Compact animated “Snap → Price → Post” strip for partner onboarding.
 * Spine §7 tokens only (mint / ink / blue accent matches home hero rhythm).
 */
export function HeroScanFlowEmbed() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-2xl border border-line bg-ink p-6 shadow-[0_30px_60px_-20px_rgba(17,203,157,0.2)]"
      aria-label="Animated scan workflow preview"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-sm font-semibold text-white">What your crew sees</p>
        <span className="rounded-full bg-mint-500/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-mint-500">
          Live flow
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {PHASES.map((step, i) => {
          const Icon = step.icon;
          const active = i === phase;
          return (
            <div
              key={step.key}
              className={`rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-500 ${
                active ? `ring-2 ${step.ring} scale-[1.02]` : "opacity-60"
              }`}
            >
              <Icon className={`mb-2 h-8 w-8 ${step.accent}`} aria-hidden />
              <p className={`font-display text-lg font-bold ${active ? "text-white" : "text-white/70"}`}>
                {step.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.sub}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[11px] text-slate-500">
        Cycles automatically · same dual-surface scanner as the public site
      </p>
    </div>
  );
}
