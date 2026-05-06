/**
 * Score a potential flip. Inputs are best-effort (some can be unknown).
 *
 * Default fee model is a simplified eBay assumption — operator can swap.
 */

export type Verdict = "buy" | "maybe" | "skip" | "unknown";

export interface ScoreInput {
  /** Median sold-comp in USD. */
  compMedian: number | null;
  /** Sample size of comps used. */
  compSampleSize: number;
  /** What the operator would pay at the thrift store, in USD. */
  costBasis: number;
  /** Marketplace fee fraction (eBay ~13.25% default). */
  feeFraction?: number;
  /** Estimated outbound shipping cost in USD. */
  shippingCost?: number;
  /** Vision/comp confidence 0..1. */
  confidence?: number;
}

export interface ScoreResult {
  verdict: Verdict;
  /** Net dollars after fees and shipping vs cost basis. Null if comp unknown. */
  netUsd: number | null;
  /** Net margin as fraction of comp. */
  netMargin: number | null;
  /** 0..100 buy score. Null if comp unknown. */
  score: number | null;
  /** Plain-English explanation. */
  explanation: string;
}

const DEFAULT_FEE = 0.1325; // 13.25% eBay final-value fee
const DEFAULT_SHIPPING = 6;  // typical small-parcel
const MIN_CONF_FOR_VERDICT = 0.45;

export function scoreFlip(input: ScoreInput): ScoreResult {
  const fee = input.feeFraction ?? DEFAULT_FEE;
  const ship = input.shippingCost ?? DEFAULT_SHIPPING;
  const conf = input.confidence ?? 0.7;

  if (input.compMedian == null || input.compSampleSize === 0) {
    return {
      verdict: "unknown",
      netUsd: null,
      netMargin: null,
      score: null,
      explanation: "No comparable sold listings found. Try a clearer photo, different angle, or manual search.",
    };
  }

  const grossAfterFees = input.compMedian * (1 - fee);
  const netUsd = grossAfterFees - ship - input.costBasis;
  const netMargin = netUsd / input.compMedian;

  // Score: combine net margin with absolute dollars and sample-size confidence.
  const marginScore = clamp(netMargin / 0.6, 0, 1) * 60;          // 60% weight to margin
  const dollarsScore = clamp(netUsd / 30, 0, 1) * 25;             // 25% weight to absolute $
  const evidenceScore = clamp(input.compSampleSize / 25, 0, 1) * 15; // 15% to evidence
  const rawScore = marginScore + dollarsScore + evidenceScore;
  const score = Math.round(rawScore * conf + (1 - conf) * 35); // shrink toward neutral when low conf

  let verdict: Verdict;
  if (conf < MIN_CONF_FOR_VERDICT) verdict = "maybe";
  else if (netUsd >= 12 && netMargin >= 0.4) verdict = "buy";
  else if (netUsd >= 5 && netMargin >= 0.25) verdict = "maybe";
  else verdict = "skip";

  const explanation = explain({ netUsd, netMargin, sample: input.compSampleSize, conf, verdict });
  return { verdict, netUsd, netMargin, score, explanation };
}

function explain(p: { netUsd: number; netMargin: number; sample: number; conf: number; verdict: Verdict }): string {
  const margin = `${Math.round(p.netMargin * 100)}% net margin`;
  const evidence = `${p.sample} sold comp${p.sample === 1 ? "" : "s"}`;
  const conf = `${Math.round(p.conf * 100)}% ID confidence`;
  const dollars = `$${p.netUsd.toFixed(2)} net`;
  switch (p.verdict) {
    case "buy":
      return `Buy. ${dollars} after fees + shipping &middot; ${margin} &middot; ${evidence} &middot; ${conf}.`;
    case "maybe":
      return `Maybe. ${dollars} after fees + shipping &middot; ${margin} &middot; ${evidence} &middot; ${conf}. Marginal &mdash; check condition + lower your offer.`;
    case "skip":
      return `Skip. ${dollars} after fees + shipping &middot; ${margin} &middot; ${evidence} &middot; ${conf}.`;
    default:
      return "Not enough data.";
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
