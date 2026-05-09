# Reply — PRICESCOUT-WPBS-PARTNER-PAGE-019

## Shipped

- **`/partners/wpbs`** — Partner strip (Winter Park Benefit Shop × PriceScout), hero copy per dispatch, **What you get** with new **`HeroScanFlowEmbed`** (client, cycles Snap → Price → Post using spine mint/ink/blue rhythm), **How to claim** (3 illustrated steps with existing `/public/images/*`), **90-second tour** (same `<video>` pattern as `/watch`), **FAQ** (6 items verbatim intent), **Direct support** (`partners@pricescout.pro` + **`WpbsSupportForm`**).
- **`POST /api/partners/wpbs/support`** — Validates JSON with zod, persists **`PartnerSupportTicket`** (`partner: "wpbs"`).
- **Prisma** — `PartnerSupportTicket` model + migration `20260509153000_partner_support_tickets`.
- **`/about`** — “Partner organizations” section with link to `/partners/wpbs`.
- **SEO** — `metadata.robots = { index: false, follow: false }` on the partner page.
- **Standing rule** — `.cursor/rules/dispatch-outbox-protocol.mdc` (`alwaysApply: true`) so when you say “dispatch”, the agent pulls from `cursor-dispatch/outbox/` and closes the loop (proof + inbox + done + spine tokens).

## Proof

- `build/proof/PRICESCOUT-WPBS-PARTNER-PAGE-019.json`
- `npm run typecheck` / `npm run test` / `npm run build` — all **exit 0**.

## Operator

1. **Apply migration** on the VPS DB: `npx prisma migrate deploy` (or your usual deploy step) so `PartnerSupportTicket` exists in production.
2. **Screenshots** — Capture `/partners/wpbs` + `/about` (desktop + mobile) for your records; not attached here.
3. **Resend** — v1 stores tickets only in Postgres; email to `partners@pricescout.pro` is manual from DB or a future `/admin/partners` dispatch.

Prompt moved: `cursor-dispatch/done/019-pricescout-wpbs-partner-toolkit-page.prompt.md`.
