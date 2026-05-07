---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout
fleet: pricescout-product
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/admin-stub-pages-fill
dispatch_id: PRICESCOUT-ADMIN-STUBS-FILL-015
depends_on: [PRICESCOUT-DUAL-SURFACE-COPY-002, PRICESCOUT-WPBS-AND-APP-DOWNLOAD-008]
blockedBy: []
parallel_safe: true
order: 15
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-015-pricescout-admin-stubs-fill.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §6 (page recipe) before acting.

# 015 — Fill the three admin stub pages so the demo doesn&apos;t expose unfinished work

## Why

Per Opus audit, three `/admin/*` pages currently render as stubs that *say "we haven't built this yet"* in their visible copy:

- `src/app/admin/team/page.tsx:36` — "Invite tooling ships after transactional email is wired — email hello@pricescout.pro for bulk onboarding meanwhile."
- `src/app/admin/billing/page.tsx` — Two cards both basically say "wires up after Stripe."
- `src/app/admin/settings/page.tsx` — Single Store name field. Page header copy: "deeper fee defaults ship once billing dashboards graduate."

Operator wants to demo PriceScout tomorrow. If a thrift-store buyer clicks left-rail nav and sees those admissions, the product reads as half-built. This dispatch makes them look complete-enough-to-ship even though backend wiring is still pending in dispatches 003 (Stripe) and a future email service.

## Tasks

### A — `/admin/team` overhaul

Remove the "Invite tooling ships..." copy. Replace with a **functional invite form** that:

1. Renders a small form: `email` + `role` (owner/admin/scanner) + "Send invite" button
2. POSTs to `/api/team/invite` (new route) which:
   - Validates auth (only role=owner can invite)
   - Generates a single-use invite token (mirror `createMagicLink` but tagged purpose=`invite`)
   - If `RESEND_API_KEY` is set: sends an invite email
   - If not: returns the invite URL inline so operator can copy/paste-share
3. After submit, shows a success banner: `Invite sent to <email>. They&apos;ll receive a link to set their password.`
4. Renders a "Pending invites" list below the active users table (read from a new `Invite` Prisma model — id, email, role, expiresAt, createdAt, sentBy, redeemedAt)

Schema add to `prisma/schema.prisma`:

```prisma
model Invite {
  id          String    @id @default(cuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  email       String
  role        String
  token       String    @unique
  expiresAt   DateTime
  sentByUserId String
  redeemedAt  DateTime?
  createdAt   DateTime  @default(now())
  @@index([tenantId, email])
}
```

Migration: `npx prisma migrate dev --name team_invite`.

Plus a `/invite/[token]` route that lets the invitee set a password and join the tenant. Mirror the magic-link flow.

### B — `/admin/billing` overhaul

Replace the "wires up after Stripe" placeholder with a **mock-but-believable plan card** that surfaces:

- **Current plan name** (from `Tenant.subscriptionStatus` — "Pro Monthly", "Pro Annual", "Founders Lifetime", "Week Pass", or "WPBS partner — 30-day access")
- **Current period end** (from `Tenant.wpbsExpiresAt` for WPBS tenants, otherwise from a new `Tenant.currentPeriodEnd` column synced via Stripe webhook from dispatch 003 — null until webhook fires)
- **Device pool** (count of active devices vs limit)
- **Add-ons** (count of `Tenant.deviceLimit - 4` and what each costs at $15/mo)
- **CTA: "Manage in Stripe Customer Portal"** — disabled with tooltip "Available after dispatch 003 ships Stripe live wiring" if `stripeCustomerId` is null. Otherwise opens portal via `/api/billing/portal`.
- **CTA: "Cancel subscription"** — disabled with same tooltip if `stripeCustomerId` null.
- **Invoice history** (empty state OK, but don&apos;t advertise that it&apos;s empty — render "No invoices yet — your first will appear here after your initial billing cycle.")

For WPBS tenants, render a separate sticky banner at top: "Winter Park Benefit Shop partner — your 30-day access expires {wpbsExpiresAt.toDateString()}. Contact ops@pricescout.pro to extend."

### C — `/admin/settings` overhaul

Add 4 more fields beyond Store name:

1. **Store address** (text, used as default pickup address for FB Marketplace listings — feeds into dispatch 007&apos;s listing template)
2. **Default currency** (select: USD/CAD/GBP/EUR — only USD enabled for now, others greyed with "Coming soon" tooltip)
3. **Tag price rounding** (radio: nearest $1 / nearest $5 / no rounding — affects how suggested-tag-price is displayed throughout the app)
4. **Default scanner role for new devices** (select: scanner / scanner-and-marketplace-poster — the latter unlocks FB listing helper from dispatch 007)

All save to a new `Tenant.settings` JSONB column or denormalize into individual columns. Either is fine. Save action wired via `submitSettings` server action.

Schema add:

```prisma
model Tenant {
  // ... existing
  storeAddress         String?
  defaultCurrency      String  @default("USD")
  tagPriceRounding     String  @default("nearest_1")  // nearest_1 | nearest_5 | none
  defaultScannerRole   String  @default("scanner")    // scanner | scanner_and_marketplace
}
```

Migration: `npx prisma migrate dev --name tenant_settings_fields`.

### D — Cosmetic polish across all three

- Section headers that use the spine&apos;s `font-display` token consistently
- Card spacing matches `/admin/devices` (which is the most polished admin page) — copy the section-header / card-padding rhythm
- Replace any "Coming soon" admissions that REMAIN with disabled buttons + tooltips. Operator can demo around them.
- Loading + error states on all forms — no naked `await`s without UI feedback

### E — Dispatch 008 follow-up: WPBS extend/revoke (operator-blocked workflow)

In `/admin/team`, if the current user has `role=owner` AND tenant `subscriptionStatus="WPBS"`, surface a small "Partner access expires {date}" banner with two buttons:

- **Extend 30 days** → POSTs to `/api/admin/wpbs-extend` (new route, owner-only). Adds 30 days to `wpbsExpiresAt`. Audit log entry.
- **Convert to paid plan** → routes to `/pricing` with a query param `?upgrade-from=wpbs` so the pricing CTAs know to upgrade-in-place rather than create a new tenant.

These exist for the operator&apos;s post-demo conversion conversations.

## Done-when

- [ ] Prisma schema migrations land (`team_invite` + `tenant_settings_fields`)
- [ ] `/admin/team` has working invite form + pending-invites list + WPBS extend banner
- [ ] `/admin/billing` shows the mock-but-believable plan card with all 5 elements (current plan, period end, device pool, add-ons, CTAs)
- [ ] `/admin/settings` has 5 fields total + save works
- [ ] Zero "Coming soon" / "wires up after X" copy renders on any of these pages
- [ ] `/invite/[token]` route lets an invitee join via the link
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] Visual diff screenshots in reply for each of the three pages, before/after
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-ADMIN-STUBS-FILL-015.json`

## Out of scope

- Real email send (depends on RESEND_API_KEY, which operator drops in VPS env when ready — graceful fallback to inline-link is fine)
- Real Stripe portal integration (dispatch 003)
- Multi-org admin / superuser (separate dispatch if/when needed)
- Audit log UI for the WPBS extend (database-only for now; render in a future "Compliance" page)
