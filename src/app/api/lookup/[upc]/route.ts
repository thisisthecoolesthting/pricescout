import { NextResponse } from "next/server";
import { lookupCompByUpc } from "@/lib/lookup";
import { scoreFlip } from "@/lib/score";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ upc: string }> },
) {
  const { upc } = await params;
  if (!upc || !/^\d{8,14}$/.test(upc)) {
    return NextResponse.json({ error: "upc must be 8-14 digits" }, { status: 400 });
  }
  const url = new URL(req.url);
  const costBasis = Number(url.searchParams.get("costBasis") ?? "0") || 0;

  const result = await lookupCompByUpc(upc);
  const score = scoreFlip({
    compMedian: result.median,
    compSampleSize: result.sampleSize,
    costBasis,
    confidence: 0.95, // barcode IDs are essentially certain
  });

  return NextResponse.json({
    identify: { title: result.title, query: result.query, category: "barcode", confidence: 0.95, source: "barcode" },
    comp: { median: result.median, sampleSize: result.sampleSize, source: result.source, fetchedAt: result.fetchedAt },
    score,
    costBasis,
  });
}
