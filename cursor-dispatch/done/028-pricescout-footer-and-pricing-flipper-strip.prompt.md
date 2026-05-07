---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-marketing
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/footer-pricing-flipper-strip
dispatch_id: PRICESCOUT-FOOTER-PRICING-STRIP-028
depends_on: []
blockedBy: []
parallel_safe: true
order: 28
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-028-pricescout-footer-pricing-strip.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

# 028 — Surgical Footer + PricingTiers + brand.ts flipper-language strip (recovery)

## Why P0-CRITICAL

Dispatch 027 (demo-killer punch list) was specced but never started — Cursor's parallel wave finished 5 lanes, not 6. The two highest-visibility flipper-language hits on the live site remain:

1. **Footer:** "Visual flip scanner for resellers - point, snap, sell." (every page)
2. **PricingTiers Pro Monthly bullet:** "Buy / skip verdicts + net-margin math" + "Shared flip log"
3. **Likely also:** `brand.ts` `heroSub` and a few other pockets

This is a **3-file surgical text replacement** — should take Cursor 10 min including PR. Bypasses the broader 006 strip (which has its own complexity) by ONLY fixing the demo-visible strings.

## Tasks

### A — `src/components/Footer.tsx`

Find the line containing "flip scanner for resellers" (or "Visual flip scanner"). Replace with:

```
"Pricing scanner for thrift stores, estate sales, and yard sales. Snap, price, post — defensible tag prices in seconds."
```

If the operator-friendly tagline already exists elsewhere in Footer (after 006 partial strip), check for any remaining "flip" / "reseller" / "BUY/SKIP" mentions and replace.

### B — `src/components/PricingTiers.tsx`

Find the Pro Monthly tier feature list. Replace these two bullets:

- "Buy / skip verdicts + net-margin math" → "Suggested tag prices with demand signal"
- "Shared flip log" → "Shared crew tag list"

Sweep the whole file for `flip`, `verdict`, `Buy/Skip`, `net margin`, `your cost` and replace with shop language per the table:

| FLIPPER-CODED (remove) | SHOP-FRIENDLY (use) |
|---|---|
| flip log | tag list |
| Buy / Skip / verdict | Suggested tag price |
| net margin | expected price range |
| your cost | (drop entirely) |

Add a Marketplace bullet to every paid tier (Week Pass / Pro Monthly / Pro Annual / Founders Lifetime):

> "Facebook Marketplace listing helper — copy & post in one tap"

### C — `src/lib/brand.ts`

Find `heroSub`. If it still references "buy/skip verdict" or "net margin", replace with:

```ts
heroSub: "Snap any donation, garage-sale find, or estate-sale lot — get a defensible tag price in seconds, then post the listing to Facebook Marketplace. Up to 4 scanner installs (phones + browsers) on every paid tier.",
```

### D — Quick sweep of remaining demo-visible files

`grep -i "flip log\|buy.*skip\|your cost\|net margin\|deal score"` across:
- `src/app/page.tsx`
- `src/app/scan/page.tsx`
- `src/app/watch/page.tsx`
- `src/app/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/scans/page.tsx`
- `src/app/how-it-works/page.tsx`
- `src/content/faq-data.ts`

For each hit, replace using the table above. Don&apos;t touch URL slugs (`/features/shared-flip-log` etc — that&apos;s breaking, separate dispatch).

### E — Don&apos;t touch

- DB schema (Scan.verdict column stays — DB rename is a 006 concern, not 028)
- Type definitions in `lib/score.ts` (PriceVerdict / VerdictPayload — 006 territory)
- `/features/[slug]` content where slugs are `shared-flip-log` / `flip-log-export` (breaking change)
- Mobile (`mobile/app/(tabs)/index.tsx`) — Cursor's other lanes touched this
- `prisma/schema.prisma` — leave alone

## Done-when

- [ ] Footer no longer says "flip scanner for resellers" / "Visual flip scanner"
- [ ] PricingTiers no longer says "Buy / skip" / "net-margin" / "Shared flip log"; every paid tier has a Marketplace bullet
- [ ] `brand.ts heroSub` is shop-language clean
- [ ] Tasks A-D files have no remaining `flip log` / `buy/skip` / `your cost` / `net margin` (case-insensitive grep returns 0 hits across these files)
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] Visual diff: Footer rendered + Pro Monthly card with new copy
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-FOOTER-PRICING-STRIP-028.json`
- [ ] PR opened and merged (autonomy mode — Cursor can self-merge after green build, time-pressed demo prep)

## Out of scope

- Full 006 strip beyond the listed files
- Type/schema renames
- URL slug renames
- Mobile native UI strings
- /admin shell text (covered by 015 already)
- /features deep-page content (covered by 016/006 partial strip)
