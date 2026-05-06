/**
 * Canonical site URL for metadata, JSON-LD, and sitemap entries.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? "https://pricescout.pro";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
