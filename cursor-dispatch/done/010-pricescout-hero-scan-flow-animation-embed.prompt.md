---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout
fleet: pricescout-marketing
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/hero-scan-flow-animation
dispatch_id: PRICESCOUT-HERO-SCAN-FLOW-ANIM-010
depends_on: [PRICESCOUT-DUAL-SURFACE-COPY-002]
blockedBy: []
parallel_safe: true
order: 10
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-010-pricescout-hero-scan-flow.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

Read **`docs/SOLUTIONSTORE_SAAS_SPINE.md`** §6 (page recipe) and §7 (visual tokens) before acting.

# 010 — Embed the hero scan-flow animation across the marketing surface

## Context

Operator ran out of Leonardo Motion 2.0 credits before the homepage hero / how-it-works video assets could be generated. To unblock the dual-surface + FB-Marketplace story tomorrow, Claude authored a **single self-contained animated SVG** at:

```
public/animations/hero-scan-flow.svg
```

It loops on a 12-second cycle through 4 phases:

1. **Phase 1 (0–3s):** Camera viewfinder framing a vintage cardigan, "Tap to scan" mint pill pulsing.
2. **Phase 2 (3–6s):** Suggested tag-price card — `$18 — $24` with `Demand: HIGH` pill, item title, comp-source line, mint "Save to Tag List" CTA.
3. **Phase 3 (6–9s):** Facebook Marketplace draft preview — thumbnail, title, `$22`, description preview, `Apparel` category pill, pulsing "Copy listing & open Marketplace" mint CTA.
4. **Phase 4 (9–11.5s):** Big mint check + "Posted to Marketplace · Listed in 12 seconds" celebration. Loops back to Phase 1.

Floating UI bubbles around the phone surface key proof-points sequenced with the phase: eBay sold-comps (Phase 1-2), `$21` mid-point pill (Phase 2), `Listing ready · 1 tap` (Phase 3-4).

The SVG embeds:
- Bottom caption: `"Built for thrift stores, estate sales & yard sales · Phones + browsers both count"`
- Left-side headline: **Snap. Price. Post.** with subhead `"One tap to a defensible tag price. One more to your Marketplace listing."`
- Spine §7 palette: mint-500 `#11CB9D`, ink `#04342C`, cream `#FAF6E8`, accent `#0C5A8A`.
- All animations are SMIL (broad browser support — Chrome, Safari, Firefox, Edge, mobile Webkit).
- File size ~16 KB.

This animation is intentionally **shop-friendly, NOT flipper-coded** — uses "Tag List" and "Demand: HIGH" rather than "flip log" / "BUY/SKIP verdict." Pre-aligns with dispatch 006 language strip.

## Tasks

### A — Mount on homepage hero (`src/app/page.tsx`)

Replace the **right-side image** of the dual-surface hero (currently `public/images/hero-laptop-webcam.jpg` from 002 Task B) with the animated SVG. Or — preferred — **add it as a full-width hero band BELOW the existing dual-surface 2-up images**, so the still-photography hero stays on top and this animation sits right under it as the "watch how it works in 12 seconds" beat.

Prefer the second approach. Insert as its own `<section>` between the dual-surface hero block and the existing "What is PriceScout?" section.

```tsx
<section className="bg-cream/40 py-12">
  <div className="container-pricescout">
    <div className="mx-auto max-w-5xl">
      <Image
        src="/animations/hero-scan-flow.svg"
        alt="PriceScout: snap an item, get a suggested tag price, post to Marketplace in seconds"
        width={1280}
        height={720}
        className="w-full h-auto rounded-2xl shadow-[0_30px_60px_-20px_rgba(17,203,157,0.25)]"
        priority={false}
        unoptimized
      />
    </div>
  </div>
</section>
```

**Important Next.js gotcha:** Next 15&apos;s `<Image>` may rasterize SVGs by default and break the embedded SMIL animations. Use `unoptimized` so it serves the raw SVG. Alternatively, use a plain `<img>` tag — that&apos;s the safer bet:

```tsx
<img
  src="/animations/hero-scan-flow.svg"
  alt="PriceScout: snap an item, get a suggested tag price, post to Marketplace in seconds"
  className="w-full h-auto rounded-2xl shadow-[0_30px_60px_-20px_rgba(17,203,157,0.25)]"
  loading="lazy"
  decoding="async"
/>
```

Use `<img>`. Document the choice in the reply.

### B — Mount on `/how-it-works`

The `/how-it-works` page (added by 002) lays out three steps. Add the animated SVG as a section banner ABOVE the three-step grid, with copy:

> "Watch the loop — snap, price, post. The whole flow in 12 seconds."

### C — Mount on `/features/browser-scanner`

That page (added by 002 Task G) is the destination for the dual-surface story. Embed the animation in the page body — it visualizes exactly what the browser scanner does end-to-end. Caption: `"The same flow on a phone or in your browser."`

### D — Optional: `/`-page hero swap (if operator approves visually)

If operator decides the animation should REPLACE the static dual-surface 2-up images instead of supplementing them, that swap is one line — replace both `<img>` tags in the dual-surface grid with the animated SVG, full-width. Document this option in the reply but **don&apos;t ship it without operator review screenshot**.

### E — Performance + a11y

- The SVG has `role="img"` and an `aria-label` describing the loop content — screen readers won&apos;t see the animation as confusing.
- File is 16 KB — won&apos;t affect Lighthouse performance.
- SMIL animations don&apos;t fire `requestAnimationFrame`, so they pause when the tab is backgrounded automatically (battery-friendly on mobile).
- Test in Chrome, Safari, Firefox. SMIL is supported in all but historical IE/Edge (irrelevant here).

### F — Add a noscript / reduced-motion fallback

In the embedding component, wrap the `<img>` with a `prefers-reduced-motion` check. If the user prefers reduced motion, render a still poster instead of the animated SVG.

```tsx
<picture>
  <source media="(prefers-reduced-motion: reduce)" srcSet="/images/hero-scan-flow-poster.png"/>
  <img src="/animations/hero-scan-flow.svg" alt="..." />
</picture>
```

Generate the poster: render the SVG to a 1280x720 PNG at the Phase-2 (price card visible) frame using `npx sharp` or a headless Chromium screenshot (Playwright if available). Save as `public/images/hero-scan-flow-poster.png`.

If Playwright is set up from earlier dispatches, the snippet:

```ts
await page.goto("file:///full/path/to/public/animations/hero-scan-flow.svg");
await page.waitForTimeout(4500); // jump into Phase 2
await page.screenshot({ path: "public/images/hero-scan-flow-poster.png", fullPage: false, clip: { x: 0, y: 0, width: 1280, height: 720 } });
```

If Playwright isn&apos;t set up, skip the poster and use a `prefers-reduced-motion` media query in CSS to swap to a static recolor.

## Done-when

- [ ] `public/animations/hero-scan-flow.svg` rendered correctly in Chrome (animation visible, all 4 phases cycle, no broken layout)
- [ ] Mounted on `/`, `/how-it-works`, `/features/browser-scanner` per Tasks A, B, C
- [ ] Reduced-motion fallback or poster fallback per Task F (or documented as "ship without; no clients reported")
- [ ] `npm run typecheck && npm run test && npm run build` green
- [ ] Visual diff screenshots in reply: `/`, `/how-it-works`, `/features/browser-scanner` with the animation visible and looping
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-HERO-SCAN-FLOW-ANIM-010.json`

## Out of scope

- Replacing all hero/how-it-works imagery (002 photography stays — animation supplements)
- Generating a video version (operator can re-roll later when Leonardo credits return — see catalog at `cursor-dispatch/done/SUPERSEDED-126-pricescout-dual-surface-copy.note.md` references for the full prompt list)
- Translating the embedded SVG text (i18n is a future Codex dispatch)
- Audio
- Adding the animation to the mobile Expo app (RN doesn&apos;t render SVG SMIL natively — would need react-native-svg with a different animation approach; defer to a separate dispatch if desired)
