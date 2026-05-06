import { NextResponse } from "next/server";
import { identifyBodySchema } from "@/lib/api-schemas";
import { identifyImage } from "@/lib/identify";
import { lookupCompByQuery } from "@/lib/lookup";
import { scoreFlip } from "@/lib/score";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = identifyBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const image = parsed.data.imageBase64;
  const costBasis = parsed.data.costBasis ?? 0;

  const id = await identifyImage(image);
  const comp = await lookupCompByQuery(id.query);
  const score = scoreFlip({
    compMedian: comp.median,
    compSampleSize: comp.sampleSize,
    costBasis,
    confidence: id.confidence,
  });

  return NextResponse.json({
    identify: { title: id.title, query: id.query, category: id.category, confidence: id.confidence, source: id.source },
    comp: { median: comp.median, sampleSize: comp.sampleSize, source: comp.source, fetchedAt: comp.fetchedAt },
    score,
    costBasis,
  });
}
