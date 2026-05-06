/**
 * Thin wrapper over the PriceScout backend at EXPO_PUBLIC_API_URL.
 * Mirrors the response shape returned by /api/identify and /api/lookup/[upc] on the web.
 */

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://pricescout.pro";

export interface Verdict {
  verdict: "buy" | "maybe" | "skip" | "unknown";
  netUsd: number | null;
  netMargin: number | null;
  score: number | null;
  explanation: string;
}

export interface IdentifyResponse {
  identify: {
    title: string;
    query: string;
    category: string;
    confidence: number;
    source: string;
  };
  comp: {
    median: number | null;
    sampleSize: number;
    source: string;
    fetchedAt: string;
  };
  score: Verdict;
  costBasis: number;
}

export async function identifyFromImage(
  imageBase64: string,
  costBasis: number,
): Promise<IdentifyResponse> {
  const res = await fetch(`${BASE}/api/identify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageBase64, costBasis }),
  });
  if (!res.ok) throw new Error(`Identify failed: HTTP ${res.status}`);
  return (await res.json()) as IdentifyResponse;
}

export async function lookupByUpc(
  upc: string,
  costBasis: number,
): Promise<IdentifyResponse> {
  const params = new URLSearchParams({ costBasis: String(costBasis) });
  const res = await fetch(`${BASE}/api/lookup/${encodeURIComponent(upc)}?${params}`);
  if (!res.ok) throw new Error(`Lookup failed: HTTP ${res.status}`);
  return (await res.json()) as IdentifyResponse;
}
