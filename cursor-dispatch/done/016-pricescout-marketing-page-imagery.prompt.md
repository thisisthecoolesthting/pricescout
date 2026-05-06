---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout
fleet: pricescout-marketing
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/marketing-page-imagery
dispatch_id: PRICESCOUT-MARKETING-IMAGERY-016
depends_on: [PRICESCOUT-DUAL-SURFACE-COPY-002, PRICESCOUT-HERO-SCAN-FLOW-ANIM-010]
blockedBy: []
parallel_safe: true
order: 16
agent: cursor
operator_blocked_on:
  - "Operator confirms which Leonardo clips actually downloaded successfully — same dependency as dispatch 014. If clips aren't on disk, ffmpeg-extract-first-frame fallback below is N/A and we use only the existing static images + the SVG."
reply: cursor-dispatch/inbox/2026-04-29-016-pricescout-marketing-imagery.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §6 + §7 before acting.

# 016 — Add hero imagery to bare marketing pages so the site doesn&apos;t feel half-built

## Why

Opus audit flagged that 6+ marketing pages are entirely text — no hero imagery, no inline visuals, no diagrams. Compared to the lush homepage hero (which has dual-surface 2-up imagery + the hero-scan-flow.svg from dispatch 010), these pages feel dramatically thinner:

- `/about` — 2 paragraphs of text, no visuals
- `/security` — paragraphs of generic SaaS security copy, no visuals
- `/how-it-works` — entirely text + code blocks despite the name suggesting flow imagery
- `/blog/[slug]` — no inline images on any post
- `/resources/guides/[slug]` — same
- `/industries/[slug]` (×6) — `SpineSixSections` provides only `hero-bg hero-grain` gradient, no actual hero image
- `/features/[slug]` (×7) — same

This dispatch closes the visual gap using the asset library we already have on disk, no new generation required.

## Tasks

### A — Add a hero-image slot to `SpineSixSections`

In `src/components/SpineSixSections.tsx` (the layout used by industry + feature pages), add an optional `heroImage` prop:

```tsx
type SpineSixSectionsProps = {
  // ... existing
  heroImage?: { src: string; alt: string };
};
```

Render it in the hero section as a side-by-side or below-headline image, scaled to ~480x360 max with `object-cover` and a soft mint shadow consistent with the homepage hero.

For each industry page, set the heroImage based on the slug → asset map (Task C).

### B — Use existing static images first

Before generating anything new, audit `public/images/` for what&apos;s already shipped:

```bash
dir E:\Projects\pricescout\public\images
```

Likely hits: `hero-phone-mockup.jpg`, `hero-laptop-webcam.jpg`, `app-interface.jpg`, possibly more from earlier dispatches. Catalog them.

### C — Use Leonardo Motion 2.0 first-frames as still imagery

If any of the 10 Leonardo clips are on disk (from earlier session — same path as dispatch 014 Task A), extract first-frame stills with ffmpeg:

```powershell
$ffmpeg = "ffmpeg"
$out = "E:\Projects\pricescout\public\images\industries"
mkdir $out -Force | Out-Null

$clips = @{
    "thrift-stores"   = "E:\Projects\pricescout\public\videos\industries\pricescout-C1-thriftstore-backroom.mp4"
    "estate-sales"    = "E:\Projects\pricescout\public\videos\industries\pricescout-C2-estate-dining.mp4"
    "yard-sales"      = "E:\Projects\pricescout\public\videos\industries\pricescout-C3-yardsale-driveway.mp4"
    "flea-markets"    = "E:\Projects\pricescout\public\videos\industries\pricescout-C4-fleamarket-dawn.mp4"
}

foreach ($slug in $clips.Keys) {
    $src = $clips[$slug]
    if (Test-Path $src) {
        & $ffmpeg -y -ss 1 -i $src -frames:v 1 -q:v 4 "$out\$slug.jpg"
        Write-Host "Extracted: $out\$slug.jpg"
    } else {
        Write-Host "MISSING: $src — falling back to gradient hero for $slug"
    }
}
```

For consignment-shops + 501c3-nonprofits (which we don&apos;t have clips for), use a curated still from `hero-laptop-webcam.jpg` or generate via a single Leonardo image (operator can do later — leave gradient for now).

### D — Wire industry pages

Edit `src/content/industry-pages.ts` to add a `heroImage` field per industry, or pass per-slug to `SpineSixSections` from `src/app/industries/[slug]/page.tsx`. Each industry page now has a real photo.

### E — Wire feature pages

Same pattern for `src/content/feature-pages.ts`. Suggested mappings:

- `/features/visual-identification` → `hero-phone-mockup.jpg` first-frame OR a phone-cardigan still
- `/features/browser-scanner` → `hero-laptop-webcam.jpg`
- `/features/barcode-fast-path` → close-up of a barcode being scanned (use existing or skip)
- `/features/shared-tag-list` (renamed from shared-flip-log per dispatch 006) → triage-table still
- `/features/device-management` → admin shell screenshot
- `/features/tag-price-suggestions` → use the SVG (`/animations/hero-scan-flow.svg`) embedded inline
- `/features/marketplace-helper` (new from dispatch 007) → FB Marketplace draft mockup OR a phone-screen still showing the listing

If there&apos;s no clear asset for one, leave gradient and document in reply.

### F — Add hero to `/about`, `/security`, `/how-it-works`

Each of these gets a single hero image at top:

- `/about` — pick a "real-people" still: `hero-laptop-webcam.jpg` cropped tight on the laptop OR `pricescout-A5-two-operators-tag.mp4` first frame if it&apos;s on disk
- `/security` — Add a simple shield SVG + "Your shop&apos;s data lives in your tenant. Always." hero card. Don&apos;t use a stock photo of locks — too generic.
- `/how-it-works` — embed the hero-scan-flow.svg (dispatch 010) at top, full-width

### G — Blog posts + guides — first inline image per post

For each `/blog/[slug]` and `/resources/guides/[slug]`:

- Add an `heroImage` field to the content data file
- If the slug doesn&apos;t map cleanly to an existing asset, pick one of: `hero-phone-mockup.jpg`, `hero-laptop-webcam.jpg`, or a thrift-store first-frame still
- Render at top of article body, max-width 720, rounded-2xl, with a soft shadow

### H — Footer logo + site brand mark

Currently the logo in `Header.tsx:62-63` and `Footer.tsx:11` is a CSS gradient `<span>`. Spine §7 says brand-mark SVGs are spec'd at `niche_specs/assets/brand/` — which doesn&apos;t exist for PriceScout in the standalone repo.

Drop a simple brand mark SVG at `public/images/brand/pricescout-mark.svg`:

```svg
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#16D9A8"/>
      <stop offset="100%" stop-color="#0FB888"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <path d="M22,22 L22,42 L26,42 L26,34 L42,34 L42,30 L26,30 L26,26 L42,26 L42,22 Z" fill="white" opacity="0.95"/>
  <circle cx="44" cy="44" r="10" fill="none" stroke="white" stroke-width="3"/>
  <line x1="50" y1="50" x2="56" y2="56" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
```

That's a minimal "P" + magnifying glass mark. Use it in Header + Footer in place of the gradient `<span>`.

## Done-when

- [ ] `SpineSixSections` accepts `heroImage` prop
- [ ] Every `/industries/[slug]` and `/features/[slug]` either has a real photo OR documented as deliberately gradient
- [ ] `/about`, `/security`, `/how-it-works` have hero imagery (or SVG embed for /how-it-works)
- [ ] Every blog post + guide has at least one inline image at top
- [ ] Brand mark SVG exists and is used in Header + Footer
- [ ] No layout shifts — all images have explicit `width` + `height` attributes
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] Visual diff screenshots in reply: `/about`, `/security`, `/how-it-works`, one industry, one feature, one blog post
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-MARKETING-IMAGERY-016.json`

## Out of scope

- Generating new Leonardo imagery (operator out of credits this session — re-roll later)
- Designing a full brand identity system (the simple mark is enough — can refresh later)
- Animated illustrations beyond the hero-scan-flow.svg
- i18n / alt text translation
- Carousel galleries on individual industry/feature pages
