"use client";

import { CircleDollarSign, ThumbsDown, ThumbsUp, HelpCircle, AlertTriangle } from "lucide-react";

export interface VerdictPayload {
  identify: { title: string; query: string; category: string; confidence: number; source: string };
  comp: { median: number | null; sampleSize: number; source: string; fetchedAt: string };
  score: {
    verdict: "buy" | "maybe" | "skip" | "unknown";
    netUsd: number | null;
    netMargin: number | null;
    score: number | null;
    explanation: string;
  };
  costBasis: number;
}

const VERDICT_META: Record<
  VerdictPayload["score"]["verdict"],
  { label: string; bg: string; fg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  buy: { label: "Buy", bg: "bg-brand-accent2", fg: "text-white", icon: ThumbsUp },
  maybe: { label: "Maybe", bg: "bg-amber-500", fg: "text-white", icon: AlertTriangle },
  skip: { label: "Skip", bg: "bg-rose-500", fg: "text-white", icon: ThumbsDown },
  unknown: { label: "Unknown", bg: "bg-zinc-500", fg: "text-white", icon: HelpCircle },
};

export function PriceVerdict({ payload }: { payload: VerdictPayload | null }) {
  if (!payload) return null;
  const meta = VERDICT_META[payload.score.verdict];
  const Icon = meta.icon;
  const fmt = (n: number | null, prefix = "") =>
    n == null ? "—" : `${prefix}${n.toFixed(2)}`;
  const fmtPct = (n: number | null) => (n == null ? "—" : `${Math.round(n * 100)}%`);

  return (
    <article className="card overflow-hidden p-0">
      <header
        className={`flex items-center justify-between gap-3 px-5 py-3 ${meta.bg} ${meta.fg}`}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="font-display text-lg font-semibold">{meta.label}</span>
        </div>
        {payload.score.score != null ? (
          <span className="text-sm font-semibold tabular-nums">{payload.score.score}/100</span>
        ) : null}
      </header>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-brand-ink">
          {payload.identify.title}
        </h3>
        <p className="text-xs text-brand-mute">
          {payload.identify.category} &middot; ID source: {payload.identify.source} &middot;{" "}
          confidence {fmtPct(payload.identify.confidence)}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat label="Comp median" value={fmt(payload.comp.median, "$")} />
          <Stat label="Sample" value={`${payload.comp.sampleSize}`} />
          <Stat
            label="Item cost"
            value={`$${payload.costBasis.toFixed(2)}`}
          />
          <Stat
            label="Net (est.)"
            value={fmt(payload.score.netUsd, "$")}
            tone={payload.score.verdict === "buy" ? "good" : payload.score.verdict === "skip" ? "bad" : undefined}
          />
        </dl>

        <p className="mt-4 text-sm text-brand-ink/80">
          <CircleDollarSign aria-hidden className="mr-1 inline h-4 w-4 text-brand-accent" />
          <span dangerouslySetInnerHTML={{ __html: payload.score.explanation }} />
        </p>

        <p className="mt-3 text-[11px] uppercase tracking-wide text-brand-mute">
          Comp source: {payload.comp.source} &middot; fetched {timeAgo(payload.comp.fetchedAt)}
        </p>
      </div>
    </article>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const toneClass =
    tone === "good" ? "text-brand-accent2" : tone === "bad" ? "text-rose-600" : "text-brand-ink";
  return (
    <div className="rounded-md bg-brand-paper px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-brand-mute">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const d = Date.parse(iso);
  if (!Number.isFinite(d)) return "—";
  const sec = Math.max(0, Math.round((Date.now() - d) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  return `${hr}h ago`;
}

