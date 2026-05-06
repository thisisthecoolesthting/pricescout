# PriceScout vs SolutionStore SaaS spine — gap audit

**Date:** 2026-04-29
**Spine reference:** `build/SOLUTIONSTORE_SAAS_SPINE.md` (operator-distilled from ShiftDeck)
**App:** `apps/thrift-store-scanner/` (live at https://pricescout.pro)

This is the gap list as of today — the visual-coherence pass got us part of the way; deeper structural work still pending. Each row notes scope + suggested follow-up dispatch.

---

## ✅ Closed in this pass

- **Mobile drawer hoisted out of `<header>`** (commit forthcoming). Was a child of `<header className="sticky ... backdrop-blur">`, which the spine flagged as the explicit "stacking-context trap" — the drawer's z-index was bounded by the header's stacking context. Now it's a sibling at z-[70], slides from the left (per spine convention), with a sibling z-[60] overlay scrim. Body-scroll lock + Escape-to-close preserved.

## ⚠️ Intentional deviations (operator-confirmed: visual brand differentiation across SolutionStore portfolio)

These are not gaps; they're per-tenant brand choices and the spine's "swap brand tokens" recipe explicitly invites them.

- **Palette: mint `#11CB9D / #0FA085` instead of teal/blue/orange.** PriceScout brand. Spine says "rename them in src/app/globals.css and pick a new primary + accent — that's the fastest way to make a site feel different." Operator confirmed 2026-04-29.
- **Button radius 12px (`rounded-xl`) instead of spine's 6px.** Brand softness fits the consumer-friendly tone better than ShiftDeck's tighter business-tool feel.
- **Font: Poppins (Google Font) instead of system stack.** Inherited from the Revalue template that PriceScout's marketing site mirrors. Costs ~80ms FOUT vs system stack but the visual identity matters here.
- **Hero gradient is gray cream (`#F7FAFC → #EDF2F7`) instead of spine teal-blue.** Mint phone mockup contrasts better against neutral than against brand-color hero.
- **Section padding 80px (`py-20`) instead of spine's 72px.** Trivial 8px difference, not worth churning.

## ❌ Real gaps still pending — ordered by priority

### Priority 1 — affect conversion / trust

1. **No real product screenshots — Leonardo placeholders only.**
   The hero, scan-flow, and final-CTA images are all Leonardo Flux Schnell generations. The spine says: "Marketing screenshots and the walkthrough video both look uninhabited if the admin shell is empty. Every new SaaS spawn must, BEFORE any Playwright screenshot run: seed an admin user, seed 5+ realistic non-admin entities..." We don't have an admin shell yet, so we can't even run the script. The Leonardo image swap pattern is documented in spine §14 — placeholders stay live in `_leonardo_backup/` so the swap is one-line per image.
   *Scope:* 1-2 days after the admin shell exists. Dispatch: `079-pricescout-admin-shell-and-screenshots`.

2. **No 1-minute walkthrough video at `/watch`.**
   The `/watch` route exists (Cursor added it in `253040e`) but I haven't read its body. Spine §13 has the full Playwright recording recipe with caption overlay snippet. Same prerequisite as above (need admin shell with seed data first).
   *Scope:* 4-6 hours once admin exists. Same dispatch as #1.

### Priority 2 — affect conversion (multi-page SEO)

3. **Marketing routes missing.** Spine envisions: `/features` + 15-20 `/features/[slug]`, `/industries` + 6-8 `/industries/[slug]`, `/how-it-works`, `/compare/[slug]`, `/resources/guides/[slug]`, `/resources/product-updates`, `/support/[slug]`, `/security`, `/about`, `/contact`, `/trial`, `/blog/[slug]`, `/legal/{privacy,terms}`. Current PriceScout: just `/`, `/pricing`, `/scan`, `/watch`, `/faq#anchor`.
   *Scope:* 3-5 days for the static + dynamic-by-slug routes with content backed by `src/content/feature-pages.ts` and `src/content/industry-pages.ts` files (per spine pattern). Dispatch: `080-pricescout-content-routes`.

4. **No `BreadcrumbList` or `FAQPage` JSON-LD.** Spine §17 says every dynamic page emits BreadcrumbList; FAQ emits FAQPage. PriceScout has neither. Easy to add to the FAQ component but missing without #3.
   *Scope:* 1 hour after #3.

### Priority 3 — affect product (no actual SaaS yet)

5. **No DB. No `Tenant` / `User` / `Session` Prisma schema.** PriceScout currently has zero persistence — the mobile flip log is AsyncStorage only, and the web has no concept of accounts.
   *Scope:* 2 days. Postgres on the VPS, Prisma schema per spine §11, migration scripts. Dispatch: `081-pricescout-db-and-auth`.

6. **No auth.** No `/login`, no `/forgot-password`, no `bcryptjs hashSync` flow, no `sd_session` cookie. Spine §10.
   *Scope:* 1 day after DB exists, included in #5.

7. **No `/admin/*` shell.** Spine envisions `/admin`, `/admin/live`, `/admin/schedule`, etc. — for PriceScout that translates to `/admin`, `/admin/scans` (shared flip log across the 4 scanner installs), `/admin/devices` (the install-management tab the pricing card promises), `/admin/billing`, `/admin/settings`. Without this, the multi-device promise on the pricing page isn't real — there's no UI for an operator to add/remove a scanner install.
   *Scope:* 3-5 days. Dispatch: `082-pricescout-admin-shell`. **This unblocks #1 and #2** because Playwright screenshots need real admin views.

### Priority 4 — affect billing (currently env-stubbed)

8. **Stripe Price IDs not minted.** `STRIPE_PRICE_WEEK_PASS`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`, `STRIPE_PRICE_FOUNDERS_LIFETIME`, `STRIPE_PRICE_DEVICE_ADDON_MONTHLY` — all referenced in code, none created in Stripe live mode yet. `/api/billing/checkout` returns 503 until they land.
   *Scope:* 30 min in Stripe Dashboard + env update. Plus the founders-lifetime cap-100 enforcement (spine §10 has the count-by-metadata pattern) which is another 1 hour of code.
   Dispatch: `083-pricescout-stripe-live`.

9. **Multi-device add-on metering** ($15/mo per scanner beyond 4). Pricing page promises this; backend has no concept yet. Needs either: per-device-line-item Stripe subscription updates, or RevenueCat (mobile platform fees become an issue when iOS lands). Defer until 10+ paying stores ask for it (per memory rule "If you can do it, do it / gate on $$").
   *Scope:* 1-2 days when the time comes.

### Priority 5 — minor quality

10. **Apostrophe convention.** Spine §16 says `&apos;` for JSX strings. PriceScout uses `&rsquo;` and `&mdash;`. Both are valid HTML and Next 15's no-unescaped-entities rule doesn't reject either. Skip unless lint flags appear.

11. **Header logo is a mint gradient square placeholder, not a real brand mark.** Should become a proper SVG mark eventually.
    *Scope:* 1-2 hours of design + Leonardo or hand-drawn SVG. Bundle into the screenshot dispatch.

---

## Recommended dispatch sequence

1. **`079-pricescout-admin-shell-and-screenshots`** — adds DB + auth + minimal admin shell (just enough for Playwright to take screenshots) + Playwright runner + walkthrough video. Combines the "structural product" gap with the "real images" gap. **HIGH IMPACT**: every other gap downstream gets cleaner.

2. **`080-pricescout-content-routes`** — fills in /features, /industries, /how-it-works, /compare, /security, /about, /contact, /trial, /blog, /legal/* per spine. Heavy SEO + page-count play.

3. **`081-pricescout-stripe-live`** — mint Price IDs, wire `/api/billing/checkout` for real, founders-lifetime cap-100 enforcement.

Total to "fully on spine": ~10-15 working days. Today's pass closes the drawer-trap and documents the rest. Site shipped, brand intact, technical debt visible.

---

_Maintained by: Cowork-Claude. Adjacent doc: `build/SOLUTIONSTORE_SAAS_SPINE.md` (the canonical source of truth)._
