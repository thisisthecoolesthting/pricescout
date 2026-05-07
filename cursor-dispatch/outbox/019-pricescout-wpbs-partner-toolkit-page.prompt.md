---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout
fleet: pricescout-marketing
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/wpbs-partner-toolkit-page
dispatch_id: PRICESCOUT-WPBS-PARTNER-PAGE-019
depends_on: [PRICESCOUT-WPBS-AND-APP-DOWNLOAD-008, PRICESCOUT-HERO-SCAN-FLOW-ANIM-010]
blockedBy: []
parallel_safe: true
order: 19
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-019-pricescout-wpbs-partner-page.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §6 + §7 before acting.

# 019 — `/partners/wpbs` toolkit page for Winter Park Benefit Shop staff

## Why

The WPBS button on `/` (dispatch 008) is a generic entry point. Operator needs a dedicated landing page they can share with Winter Park Benefit Shop staff that:
- Explains the partnership in plain language (without revealing it&apos;s a "bypass" — frame it as a partnership)
- Walks through the access-claim flow with screenshots
- Embeds the hero-scan-flow animation as the "what you&apos;ll get" demo
- Provides direct support contact for WPBS-specific issues
- Is shareable via a clean URL: `https://pricescout.pro/partners/wpbs`

This page does NOT need to be public-facing in the standard nav — it&apos;s a shareable destination for the partner only. Don&apos;t add it to the main `/` nav. DO add it to `/about` as a small "Trusted by partner organizations" link.

## Tasks

### A — Page structure (`src/app/partners/wpbs/page.tsx`)

Six-section recipe per spine §6, but tuned for partner-onboarding:

1. **Hero** — "Welcome, Winter Park Benefit Shop staff" + dual-surface imagery + brief partnership intro
2. **What you get** — embed `<HeroScanFlowEmbed />` (the animated SVG from 010), bullet list of features unlocked
3. **How to claim access** — 3-step flow with screenshots:
   1. Visit pricescout.pro
   2. Click "WPBS" button (low on the homepage)
   3. Submit your @wpbs.org email — get an instant magic link
4. **Demo video** — embed `/watch` walkthrough video OR the SVG fallback if video missing
5. **FAQ** — partner-specific questions (5-6 items, see Task C)
6. **Direct support** — operator&apos;s email + a partner-only support form

### B — Hero copy

```
Headline: "Welcome, Winter Park Benefit Shop"
Subhead: "PriceScout is excited to partner with WPBS. Your team gets full Pro-tier access — no credit card needed for the first 30 days. Below is everything you need to onboard your sorting room and your back-room laptop."
Pill above headline: "Partner program · Full Pro features"
```

### C — FAQ items (write these from scratch)

1. **Who&apos;s eligible?** — "Anyone on the WPBS staff or volunteer roster. Just use a `@wpbs.org` email or any email — you&apos;ll be granted access regardless. Up to 4 device installs are included on every WPBS account."
2. **What does it cost after 30 days?** — "We&apos;ll reach out before your trial ends to discuss the partner rate. WPBS staff get a meaningfully lower rate than our public Pro tier."
3. **Do my scans/listings stay private?** — "Yes. Your tenant is isolated. We don&apos;t share scan data, FB Marketplace drafts, or anything else outside WPBS."
4. **Can the whole team share a single account?** — "Each device counts as one of your 4 included installs. We recommend each crew member has their own login on each device — that way the &apos;tag list&apos; shows who priced what."
5. **What happens if a volunteer leaves?** — "Owner role can revoke their device + login from `/admin/team`. Their previously-priced items stay attributed to history."
6. **How do we get support?** — "Email `partners@pricescout.pro`. We typically respond same business day."

### D — Direct support form

Form: name + WPBS role (volunteer / staff / coordinator / director) + email + message. Submits to `/api/partners/wpbs/support` (new route). Server side: emails the operator at `partners@pricescout.pro` via Resend (if RESEND_API_KEY set) or stores to DB and shows operator on `/admin/partners` (a future page).

For now: just store to DB and respond `{ok:true}` — no operator-side dashboard yet.

Schema add:

```prisma
model PartnerSupportTicket {
  id        String   @id @default(cuid())
  partner   String   // "wpbs" for now; future-proof for other partners
  name      String
  role      String?
  email     String
  message   String
  createdAt DateTime @default(now())
  resolvedAt DateTime?
  resolvedBy String?
}
```

Migration: `npx prisma migrate dev --name partner_support_tickets`.

### E — Visual identity

Use the spine §7 palette but with WPBS-coded accent: a small brand strip at the top says "Winter Park Benefit Shop × PriceScout" with a subtle handshake or partnership-mark glyph. Keep it tasteful and on-brand for both organizations.

If WPBS has a logo or brand mark, it can be added later — for now just use the words.

### F — `/about` link

In `src/app/about/page.tsx`, add a small section near the bottom:

```tsx
<section className="mt-12 pt-8 border-t border-line/30">
  <h3 className="font-display text-lg font-semibold">Partner organizations</h3>
  <p className="mt-2 text-sm text-muted">
    PriceScout partners with thrift-store nonprofits to give their teams free Pro-tier access.
  </p>
  <p className="mt-2 text-sm">
    <Link href="/partners/wpbs" className="text-mint-600 hover:underline">Winter Park Benefit Shop →</Link>
  </p>
</section>
```

### G — `noindex` for SEO hygiene

Add `<meta name="robots" content="noindex" />` to the page metadata. This is a partner page, not a public marketing page — we don&apos;t want it competing for search visibility.

## Done-when

- [ ] `/partners/wpbs` route renders the 6-section page
- [ ] FAQ items written and rendered
- [ ] Support form posts to `/api/partners/wpbs/support` and persists tickets
- [ ] Prisma schema migration `partner_support_tickets` applied
- [ ] `/about` has the partner-organizations section linking to /partners/wpbs
- [ ] Page is `noindex` for SEO
- [ ] Visual diff screenshots in reply: `/partners/wpbs` desktop + mobile, `/about` with new partner section
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-WPBS-PARTNER-PAGE-019.json`

## Out of scope

- Multi-partner page generator (just /partners/wpbs for now; if more partners onboard, factor into a generic `/partners/[slug]` later)
- WPBS branded color theme override (stay in the standard mint palette)
- Real WPBS logo (operator drops if available; leave wordmark otherwise)
- Operator-side `/admin/partners` ticket view (defer to a future dispatch — we just persist tickets to DB so they&apos;re queryable later)
- Email-template polish for the support form (text-only is fine for v1)
