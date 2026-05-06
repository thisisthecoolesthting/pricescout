# PriceScout — visual-first thrift store pricing scanner

**Live:** https://pricescout.pro  
**Repo (this repo):** github.com/thisisthecoolesthting/pricescout (after rename from thrift-store-scanner; see dispatch 001 proof)  
**Monorepo origin:** Migrated out of rickys-control-center on 2026-04-29 — see the bootstrap commit in this repo for the migration proof.

## Stack

Next.js 15 + React 18 + Tailwind 3 + TypeScript strict.  
Prisma + Postgres 17 + bcryptjs + jose (session JWT).  
Stripe SDK + five Price IDs (Week Pass / Pro Monthly / Pro Annual / Founders Lifetime / Device Add-on).  
Mobile: Expo 52 + React Native 0.76 + expo-router + expo-camera at `mobile/`.

## Doctrine

Read `docs/SOLUTIONSTORE_SAAS_SPINE.md` before any non-trivial change. PriceScout follows the spine six-section recipe, visual tokens (§7), and mobile drawer rules (§8). [shiftdeck.tech](https://shiftdeck.tech) is the live reference for rhythm and layout.

Read `docs/PRICESCOUT_SPINE_GAPS.md` for documented brand deviations vs the spine (mint not teal — intentional).

## Repo layout

- `src/app/` — Next 15 routes (marketing, `/scan`, admin, API `route.ts`)
- `src/components/` — Header, Scanner (`getUserMedia` + barcode), PriceVerdict, PricingTiers, FAQ, etc.
- `prisma/` — schema + migrations + `seed.ts` (Tenant / User / Session / Device / Scan)
- `mobile/` — Expo app (Android live, iOS in review)
- `cursor-dispatch/{outbox,inbox,done}/` — agent dispatch protocol
- `docs/` — spine doc, spine gap audit, deploy notes
- `saas_spec.json` — niche SaaS spec (carried from monorepo)

## Deploy

VPS auto-pull cron at `/etc/cron.d/pricescout-deploy` runs every two minutes:

`git fetch && git reset --hard origin/main && pm2 stop pricescout; npm ci && prisma generate && npm run build && pm2 start pricescout --update-env`

PM2 process: `pricescout`, port 3300, served behind Caddy at pricescout.pro (Caddyfile on the VPS at `/etc/caddy/Caddyfile`).

## Pricing tiers

- Week Pass: $29 (seven-day pass — one-weekend estate sales / yard sales)
- Pro Monthly: $49/mo
- Pro Annual: $490/yr
- Founders Lifetime: $699 cap-100 (sold out at 100)
- Device Add-on: $15/mo per scanner install over the four-included pool

Each paid tier includes four scanner installs (phones + browsers both count).

## Audience

Thrift store operators, estate sale crews, yard sale runners, flea-market resellers. Not solo flippers — marketing uses crew/operator language.

## Two camera surfaces

1. **Phone (primary)** — Expo app; Android live, iOS in review  
2. **Web webcam (secondary)** — `getUserMedia` in `src/components/Scanner.tsx`; laptops, POS, kiosks  

Same `/api/identify` API, same flip log, same four-included device pool.

## Migration note

Standalone repo replaces the monorepo mirror workflow (former dispatch 104). Source of truth is this repository; do not rely on subtree mirror pushes from rickys-control-center for PriceScout.
