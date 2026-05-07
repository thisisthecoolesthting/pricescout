---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-product
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/shop-language-strip
dispatch_id: PRICESCOUT-SHOP-LANGUAGE-006
depends_on: [PRICESCOUT-DUAL-SURFACE-COPY-002]
blockedBy: []
parallel_safe: true
order: 6
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-006-pricescout-shop-language.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §16 (copy conventions) before acting. Reference **shiftdeck.tech** for the shop-operator vibe (NOT flipper / hustler vibe).

# 006 — Strip flipper-coded language from PriceScout, reframe around shops

## Why this is P0-CRITICAL

**PriceScout is for thrift store shops, estate sale crews, yard sale runners, consignment shops, and donation-driven nonprofits — NOT for solo flippers, resellers, or arbitrage hustlers.**

Operator clarification 2026-04-29: this product helps a SHOP price an item quickly and (in 007) cross-post to FB Marketplace. It does NOT help a flipper decide whether to buy something. The "BUY / SKIP verdict" pattern, "flip log," "net profit," and "your cost" concepts are **fundamentally flipper-coded** and are wrong for this audience. A thrift store doesn&apos;t pay for donations — there&apos;s no cost basis. They&apos;re given the items and just need a defensible tag price.

This dispatch sweeps the codebase to remove flipper-language and reframe around shops. After this lands, dispatch 005 (scan polish) and 007 (FB Marketplace) build on the corrected foundation.

## Audit + replace table

| FLIPPER-CODED (remove) | SHOP-FRIENDLY (use) |
|---|---|
| "flip log" | "tag list" or "inventory" or "today&apos;s pricings" |
| "Save to flip log" | "Save to inventory" or "Add to tag list" |
| "BUY / SKIP / MAYBE verdict" | "Suggested tag price" + optional "demand: high/low" indicator |
| "buy/skip verdict" (any casing) | "tag-price recommendation" |
| "net profit" / "net (est.)" | "expected price range" |
| "your cost" / "cost basis" | DROP entirely (shops don&apos;t track per-item cost — donations are free) |
| "would you flip this" | "what should this be priced" |
| "deal score" | "pricing confidence" |
| "comps say you can flip for $X" | "similar items recently sold for $X" |
| "flipper" / "flippers" / "flipping" (anywhere) | "shop" / "operator" / "crew" / "pricing" |
| "score: BUY" pill / "verdict pill" | "Suggested $X-$Y" pill |

## Tasks

### A — Codebase audit

```bash
cd E:\Projects\pricescout
# Find every flipper-coded reference:
git grep -in "flip\\|verdict\\|buy.*skip\\|cost.basis\\|net.usd\\|net.profit\\|your.cost\\|deal.score" \
  -- "*.tsx" "*.ts" "*.md" "*.json" "*.prisma" \
  ":(exclude)node_modules" ":(exclude).next" ":(exclude)build/proof"
```

Document the full list of file:line hits in the reply file BEFORE making changes. Operator approves the sweep mentally by reading the diff.

### B — UI surface sweep (web)

Files known to contain flipper-language (verify with grep, don&apos;t trust this list):

- `src/app/page.tsx` — hero subhead, "What is PriceScout?" section, "Built for the people pricing the table" — reread for any drift
- `src/app/scan/page.tsx` — "buy/skip verdict" mention, "save to crew flip log" → "save to crew tag list"
- `src/app/watch/page.tsx` — narration of the walkthrough — replace any "verdict" / "flip log" with shop terms
- `src/app/pricing/page.tsx` + `src/components/PricingTiers.tsx` — tier descriptions, FAQ entries
- `src/app/admin/scans/page.tsx` — column headers, empty state copy
- `src/app/admin/page.tsx` — dashboard tiles + KPI labels
- `src/app/admin/billing/page.tsx` + `/admin/team/page.tsx` + `/admin/devices/page.tsx`
- `src/app/industries/[slug]/page.tsx` — per-industry framing
- `src/app/how-it-works/page.tsx` — three-step description
- `src/app/features/[slug]/page.tsx` + `feature-pages.ts` — feature descriptions
- `src/app/faq/page.tsx` + `src/content/faq-data.ts` — Q&A
- `src/app/blog/[slug]/page.tsx` (if any drafts exist)
- `src/components/PriceVerdict.tsx` — RENAME to `src/components/TagPriceCard.tsx`. Update imports across the app. Internal types: `VerdictPayload` → `TagPriceRecommendation`. Internal field `verdict: "buy" | "skip" | "maybe"` → `demand: "high" | "low" | "unknown"` (optional).
- `src/components/marketing/TrustStrip.tsx` — verify trust strip text is shop-friendly
- `src/components/Scanner.tsx` — internal status type `result` payload — strip flipper-isms
- `src/components/FAQ.tsx` — copy

### C — Mobile (Expo) sweep

- `mobile/app/(tabs)/index.tsx` — "Save to flip log" button → "Save to tag list", "BUY/SKIP" verdict pill colors → "demand high/low" or just suggested-price display
- `mobile/app/(tabs)/log.tsx` — RENAME tab from "Log" or "Flip log" to "Tag list" (visible label) and the file can stay `log.tsx` for now (route group concern)
- `mobile/app/(tabs)/pricing.tsx` — sweep
- `mobile/lib/api.ts` + `mobile/lib/storage.ts` — TYPE-LEVEL renames for `IdentifyResponse.score.verdict` → drop or convert to `demand`. Keep server-side names for now if the API contract uses them — note the divergence in 007 which renames the API contract too.

### D — Database / Prisma schema

`prisma/schema.prisma`:

- `Scan.verdict` field — RENAME to `Scan.demand` (string nullable; "high" | "low" | "unknown" | null)
- `Scan.compMedian`, `Scan.compSampleSize`, `Scan.compSource` — KEEP (these are factual comp data, not flipper-coded)
- `Scan.costBasis` — KEEP IF the field is used for any future feature (e.g. consignment commission tracking), otherwise REMOVE in a migration
- `Scan.netUsd` — REMOVE (flipper-only concept)
- `Scan.scoreNumeric` — RENAME to `Scan.priceConfidence` (decimal 0-1 or 0-100)

Generate a Prisma migration: `npx prisma migrate dev --name shop_language_reframe`. Migration is **destructive on netUsd** but that&apos;s OK — the column is empty in seed data. If there&apos;s a non-empty production DB on VPS, document the data-migration step in the reply (operator can run `update Scan set ...` manually before applying migration). For dev/seed Postgres, just regenerate.

### E — API contract

`/api/identify` and `/api/lookup/[upc]` response types:

- Old: `{ score: { verdict, netUsd, scoreNumeric }, ... }`
- New: `{ recommendation: { suggestedLow, suggestedMid, suggestedHigh, demand?, priceConfidence }, ... }`

Coordinate with mobile + web client expectations — both consume this. Update `lib/api.ts` (mobile) and any web client fetcher.

The **server-side comp computation** doesn&apos;t change — Keepa + eBay still return median + sample size. We just stop translating it to a flipper-style verdict and instead present a **price range with confidence**.

### F — Marketing copy precision pass

Hero subhead — re-read 002&apos;s shipped version. If it says anything like "what each item could net" or implies a flipper net-profit framing, rewrite as:

> "{brand.name} runs on the phones already in your crew&apos;s pockets — or on the back-room laptop with a webcam pointed at the triage table. Either camera, same answer in seconds: what is it, what does it sell for in your area, what should the tag say? Up to 4 scanner installs on every paid tier — phones and browsers both count."

Pricing page — replace "perfect for flipping" / "flip more, faster" / similar with "perfect for the busy weekend" / "price more donations in less time."

Industries pages — verify each lead paragraph names the SHOP / CREW / OPERATOR, not the individual reseller.

### G — `/admin/scans` rename + UI

Currently the admin scans table likely shows columns like "Verdict | Median Comp | Cost | Net | Date". Replace with: "Item | Suggested Tag | Comp Median | Demand | Date".

Page title: "Scan history" or "Today&apos;s pricings" (the operator-side framing). NOT "Flip log."

### H — Test sweep

Run `npm run test` and `npm run typecheck`. Some tests likely reference old types/strings. Update test expectations to match new shape. Don&apos;t weaken assertions — make them stronger if you can (assert price recommendation has all four fields: low/mid/high + confidence).

## Spine references

- §16 — copy conventions: `&apos;` not `'`, no "Book a demo," consistent "Start 14-day free trial" CTA. Apply throughout.
- ShiftDeck&apos;s tone is "operator-friendly, professional, confident" — match it. Avoid "hustle," "side gig," "flip," "score" verbs.

## Done-when

- [ ] `git grep` audit recorded in reply (file:line hits before-and-after)
- [ ] Web surface fully swept (every page.tsx + every component + every content file)
- [ ] Mobile surface fully swept (Expo screens + lib + storage)
- [ ] Prisma schema migrated (`shop_language_reframe`)
- [ ] API contract updated (`/api/identify` + `/api/lookup/[upc]`) with both web and mobile consumers in lockstep
- [ ] `PriceVerdict` component renamed to `TagPriceCard`, all imports updated
- [ ] `npm run typecheck && npm run test && npm run build` all green
- [ ] Visual diff screenshots in reply: `/`, `/scan`, `/admin/scans`, `/pricing`, mobile scan screen — before/after copy
- [ ] Reply documents API contract change for clients consuming `/api/identify`
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-SHOP-LANGUAGE-006.json`

## Out of scope

- Adding the FB Marketplace integration (that&apos;s 007)
- Adding consignment-commission tracking (a future feature, separate dispatch)
- Renaming the GitHub repo or Stripe products (already done in 001)
- Translating any of this — i18n is a future Codex dispatch
