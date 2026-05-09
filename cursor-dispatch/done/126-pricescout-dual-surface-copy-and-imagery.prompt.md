---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout
fleet: pricescout-marketing
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/pricescout-dual-surface-copy
dispatch_id: PRICESCOUT-DUAL-SURFACE-COPY-126
depends_on: [PRICESCOUT-BOOTSTRAP-STANDALONE-001]
blockedBy: []
parallel_safe: true
order: 126
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-126-pricescout-dual-surface-copy.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

**Note (standalone repo):** Execute **`cursor-dispatch/outbox/002-pricescout-dual-surface-copy.prompt.md`** on branch `feat/dual-surface-copy` for the canonical P1 dual-surface work in this repo. This file is the monorepo dispatch **126** carried over with paths and `working_dir` rewritten for audit and done-when compliance.

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §6 (page recipe) and §7 (visual tokens) before acting. Reference **shiftdeck.tech** live to see how the spine six-section recipe lands in production — PriceScout should match that rhythm.

# 126 — Surface the dual-camera story across the marketing site

## Context

PriceScout `/scan` route already supports **TWO** camera surfaces in code:

1. **Phone (primary)** — Expo / `expo-camera` in `mobile/app/(tabs)/index.tsx`. Android live, iOS in review.
2. **Web with local camera (secondary)** — `getUserMedia` + `<video>` + barcode reader in `src/components/Scanner.tsx`. Works on any laptop or POS terminal with a webcam, USB overhead cam, or built-in camera.

But **the marketing copy says "phone only."** Hero says "puts a camera in your crew's pocket." Trust strip lists "Android live / iOS in review" — no web-camera badge. Hero image is a phone-only mockup.

The audience this product targets — thrift stores, estate sale crews, yard sale runners — is a phone-first crowd, but a meaningful slice has a **back-room laptop with a webcam pointed at the triage table**. That use case sells itself when surfaced. Right now it is invisible.

ShiftDeck marketing mentions BOTH "manage from your phone" and "any browser, any device" — same idea. We mirror that pattern.

## Tasks

### A — Hero copy reposition (`src/app/page.tsx`)

Current hero:

- Pill: "For thrift stores, estate sales & yard sales" — keep
- H1: "Stop guessing what donations are worth." — keep
- Subhead: rewrite from "puts a camera in your crew's pocket" to dual-surface:

> {brand.name} runs on the phones already in your crew's pockets — or on the back-room laptop with a webcam pointed at the triage table. Either camera, same answer in seconds: what is it, what does it sell for, what should the tag say? Up to 4 scanner installs on every paid tier — phones and browsers both count.

- Trust strip: change to **3 items, dual-surface aware**:

```tsx
<TrustStrip items={[
  "Phones + browsers both count",
  "Android live · iOS in review",
  "Webcam works on any laptop",
]} />
```

- Below the buttons, change "Web in any phone browser · Android live · iOS in review" to "Phone in your pocket · Webcam on the back-room laptop · Tablet at the checkout counter — pick your camera."

### B — Hero imagery: side-by-side surfaces

Replace the single phone-mockup hero with a **two-up grid** showing both surfaces:

- Left: phone in hand scanning a sweater (existing `public/images/hero-phone-mockup.jpg` or refresh)
- Right: laptop with a USB cam over an item, browser tab open to `/scan` showing the same verdict UI

Generate the laptop+webcam asset via `python scripts/fire_leonardo_heroes.py --site thrift-store-scanner --variant laptop-webcam --prompt "back room of a thrift store, laptop on a table with overhead USB webcam pointed at a vintage sweater on the counter, soft warm lighting, cream and mint accents, photorealistic, 16:9"`. Save to `public/images/hero-laptop-webcam.jpg`. Width 880, height 587 to match the phone aspect.

In `page.tsx` swap the single `<Image>` for a `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">` with both images. On mobile (1 col) the phone shows first, on desktop they sit side by side.

### C — `/scan` page header: name both surfaces

In `src/app/scan/page.tsx`, change the description paragraph from "Point your phone at any thrift-store item" to:

> Point your phone — or your laptop's webcam — at any donation, garage-sale find, or estate-sale lot. Hit **Snap & identify** and {brand.name} returns what it is, what it sells for online, and a buy / skip verdict. Barcodes read automatically while the camera is open.

Add a small chip-strip above the Scanner component:

```tsx
<div className="mb-6 flex flex-wrap gap-2">
  <span className="pill bg-mint-500/10 text-mint-600">Browser webcam</span>
  <span className="pill bg-mint-500/10 text-mint-600">Phone (Android live)</span>
  <span className="pill bg-line/40 text-soft">iOS in review</span>
</div>
```

The `<Scanner>` component already enumerates cameras correctly via `getUserMedia` — no JS changes needed here.

### D — Pricing page: device math made explicit

In `src/app/pricing/page.tsx` (or `PricingTiers.tsx`), under each tier card, surface the device math line:

> **4 scanner installs included.** Mix and match — a phone counts as one install, a registered browser counts as one install. Add more for $15/mo per device.

Add a small FAQ accordion expansion at the bottom of the pricing section:

- "Does the back-room laptop count toward the 4 scanner installs?" → "Yes. Each registered browser counts as one install, same as a phone. The 4-included pool covers any mix."
- "What if my laptop loses its registration?" → "Browsers re-register on first scan after a session expires. We don't double-charge a device that legitimately re-paired itself within 30 days."

### E — `/industries/[slug]` pages: surface fit-by-workflow

Each industries deep page should call out which surface fits the workflow:

- `/industries/thrift-stores`: "Most thrift store crews use the phone for the floor and a back-room laptop with an overhead USB cam for the triage table. PriceScout works on both, and a single subscription covers both."
- `/industries/estate-sales`: "Estate sale crews walk a house — phones win. Buy a Week Pass for the weekend, scan everything, done."
- `/industries/yard-sales`: "Yard sales are phones-in-driveway. Get a Week Pass Friday night, tag the lawn Saturday morning."
- `/industries/flea-markets`: "Flea market resellers work fast — phone-first. Some run a counter-top kiosk on a tablet for walk-up customer questions about pricing — that's the kiosk mode at `/scan?mode=kiosk` (coming soon)."

Each page already exists; just edit the lead paragraph and add a `<TrustStrip>` showing which surfaces fit.

### F — `/how-it-works` page: split steps by surface

Change the "1 - Snap, 2 - Verdict, 3 - Save" rhythm to optionally show **two columns** at step 1:

- Left: "On the phone — open the app, point, snap."
- Right: "In the browser — open `/scan`, allow camera, point, snap."

Steps 2 and 3 (verdict, save to flip log) are identical regardless of surface — those stay one-column.

### G — `/features/[slug]` carve-out: a "Browser scanner" feature page

Either edit an existing `/features/<slug>` page or add `/features/browser-scanner` (depending on the existing route shape — check `src/app/features/[slug]/page.tsx` for routing pattern). Content:

- H1: "Scan from any laptop with a webcam"
- Body: explain `getUserMedia`, USB cam support, kiosk-mode preview, browser device-pairing, the "still counts as one of your 4 installs" math
- Screenshot: laptop frame showing `/scan` with verdict result
- CTA: "Try it now — no install" → `/scan`

### H — Footer + nav: no changes needed

Header NAV in `src/components/Header.tsx` is already balanced. Don't touch.

## Reference patterns from ShiftDeck

- ShiftDeck uses the spine §6 recipe (Teal Hero → Problem+Who → Capabilities+How → FAQ → Related → Dark Final CTA). PriceScout home already follows this — just keep the rhythm when editing.
- Section padding is **80px desktop / 56px mobile** per spine §7. Don't introduce ad-hoc spacing.
- Trust strips are **3 items, single line, mint pills**. Don't go to 4+ items even when tempted.
- `&apos;` not `'` in JSX text per spine §16. Lint will catch but be deliberate.

## Done-when

- [ ] Hero copy + trust strip updated; subhead names both surfaces
- [ ] Side-by-side hero imagery (phone + laptop+webcam) responsive: 1-col mobile, 2-col desktop
- [ ] `hero-laptop-webcam.jpg` generated by Leonardo, saved to public/images/
- [ ] `/scan` chip-strip + revised description live
- [ ] Pricing page device-math line under each tier + 2 FAQ entries added
- [ ] All 4 `/industries/[slug]` pages have surface-fit copy
- [ ] `/how-it-works` step 1 split into phone-vs-browser columns
- [ ] `/features/browser-scanner` (or equivalent) page exists and is linked from `/features` index + nav not changed
- [ ] No Tailwind class-soup ad-hoc spacing — spine §7 padding tokens only
- [ ] Visual diff screenshots before/after in the reply
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-DUAL-SURFACE-COPY-126.json`

## Out of scope

- New `/scan?mode=kiosk` route or device-pairing UI (those are dispatch 122 and 120 — separate work)
- A11y rewrite of the whole site (that's dispatch 111 Codex)
- Stripe device-addon Price ID wiring (that's dispatch 082)
- iOS app store copy (Apple Dev approval pending)
- Translating any of this to es / pt-BR (that's dispatch 112 Codex)
