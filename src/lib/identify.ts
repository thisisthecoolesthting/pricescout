/**
 * Visual identify — given a base64 image, return a structured product description.
 *
 * Strategy:
 *   - If ANTHROPIC_API_KEY is present, call Claude Haiku with a vision prompt.
 *   - Else if OPENROUTER_API_KEY is present, route through OpenRouter (Gemini Flash
 *     is the typical default).
 *   - Otherwise, return a deterministic mock so the full UI flow is testable.
 *
 * Output is normalized to { title, query, category, confidence, raw }.
 */

export interface IdentifyResult {
  title: string;
  query: string;            // best search query string for comp lookup
  category: string;         // freeform; e.g. "kitchenware", "vintage clothing"
  confidence: number;       // 0..1
  raw?: unknown;            // upstream response, for debugging
  source: "anthropic" | "openrouter" | "mock";
}

export async function identifyImage(imageBase64: string): Promise<IdentifyResult> {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await identifyAnthropic(imageBase64);
    } catch (err) {
      console.warn("anthropic identify failed, falling back:", err);
    }
  }
  if (process.env.OPENROUTER_API_KEY) {
    try {
      return await identifyOpenRouter(imageBase64);
    } catch (err) {
      console.warn("openrouter identify failed, falling back:", err);
    }
  }
  return mockIdentify(imageBase64);
}

const SYSTEM_PROMPT =
  "You are a thrift-store reseller's appraisal assistant. The user shows you a photo of an item " +
  "they're considering buying. Identify the item with the level of specificity a reseller would " +
  "search for on eBay (brand + model + era when known). Be honest about confidence. Return ONLY " +
  "JSON with this exact shape: " +
  '{"title": string, "query": string, "category": string, "confidence": number}. ' +
  "Confidence is 0 to 1. `query` is the search string that will most accurately surface sold " +
  "comps on eBay. Do not include backticks, prose, or markdown.";

async function identifyAnthropic(imageBase64: string): Promise<IdentifyResult> {
  const model = process.env.ANTHROPIC_MODEL_IDENTIFY ?? "claude-haiku-4-5-20251001";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: detectMediaType(imageBase64), data: stripDataPrefix(imageBase64) },
            },
            { type: "text", text: "Identify this item." },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const json = await res.json();
  const text =
    Array.isArray(json?.content) && json.content[0]?.type === "text" ? json.content[0].text : "";
  const parsed = parseJsonish(text);
  return {
    title: String(parsed.title ?? "Unknown item"),
    query: String(parsed.query ?? parsed.title ?? "thrift item"),
    category: String(parsed.category ?? "uncategorized"),
    confidence: clamp01(Number(parsed.confidence ?? 0.5)),
    raw: json,
    source: "anthropic",
  };
}

async function identifyOpenRouter(imageBase64: string): Promise<IdentifyResult> {
  const model = process.env.OPENROUTER_MODEL_IDENTIFY ?? "google/gemini-2.0-flash-exp";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this item." },
            { type: "image_url", image_url: { url: ensureDataUrl(imageBase64) } },
          ],
        },
      ],
      max_tokens: 400,
    }),
  });
  if (!res.ok) throw new Error(`openrouter ${res.status}`);
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content ?? "";
  const parsed = parseJsonish(typeof text === "string" ? text : "");
  return {
    title: String(parsed.title ?? "Unknown item"),
    query: String(parsed.query ?? parsed.title ?? "thrift item"),
    category: String(parsed.category ?? "uncategorized"),
    confidence: clamp01(Number(parsed.confidence ?? 0.5)),
    raw: json,
    source: "openrouter",
  };
}

function mockIdentify(imageBase64: string): IdentifyResult {
  // Deterministic mock based on image-byte hash so dev work is reproducible.
  const h = hash(imageBase64).toString(36);
  const samples = [
    { title: "Pyrex Spring Blossom 1.5qt casserole", query: "pyrex spring blossom 1.5 qt casserole", category: "vintage kitchenware" },
    { title: "Vintage Carhartt detroit jacket — brown duck", query: "carhartt detroit jacket brown duck vintage", category: "vintage workwear" },
    { title: "Polaroid SX-70 Land Camera", query: "polaroid sx-70 land camera", category: "vintage cameras" },
    { title: "Le Creuset enameled cast iron Dutch oven, 5.5qt cherry red", query: "le creuset 5.5 qt dutch oven cherry red", category: "kitchenware" },
    { title: "Levi's 501 STF jeans, 33x32", query: "levis 501 stf 33x32", category: "denim" },
  ];
  const pick = samples[parseInt(h.slice(0, 4), 36) % samples.length];
  return {
    ...pick,
    confidence: 0.55 + (parseInt(h.slice(4, 6), 36) % 35) / 100,
    source: "mock",
  };
}

// ---- helpers ----------------------------------------------------------------

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function stripDataPrefix(s: string): string {
  const i = s.indexOf("base64,");
  return i >= 0 ? s.slice(i + "base64,".length) : s;
}

function ensureDataUrl(s: string): string {
  if (s.startsWith("data:")) return s;
  return `data:${detectMediaType(s)};base64,${stripDataPrefix(s)}`;
}

function detectMediaType(s: string): "image/jpeg" | "image/png" | "image/webp" {
  if (s.startsWith("data:image/png") || s.startsWith("iVBOR")) return "image/png";
  if (s.startsWith("data:image/webp") || s.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
}

function parseJsonish(text: string): Record<string, unknown> {
  // Tolerate ```json fences, leading prose, etc.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = (fenced?.[1] ?? text).trim();
  // Extract first {...} block.
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  const slice = start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate;
  try {
    return JSON.parse(slice) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < Math.min(s.length, 4096); i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
}
