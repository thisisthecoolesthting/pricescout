# PriceScout video assets

Bucket layout:

```
public/videos/
├── hero/                    # homepage hero (16:9)
│   ├── pricescout-A1-phone-sweater.mp4
│   ├── pricescout-A2-laptop-webcam.mp4         (pre-existing, already done in Leonardo)
│   ├── pricescout-A3-crew-orbit.mp4
│   └── pricescout-D1-buy-pill-horizontal.mp4   (alternate hero — pre-existing horizontal version of D1)
├── industries/              # b-roll for /industries/[slug] (16:9, loopable)
│   ├── pricescout-C1-thriftstore-backroom.mp4
│   ├── pricescout-C2-estate-dining.mp4
│   ├── pricescout-C3-yardsale-driveway.mp4
│   └── pricescout-C4-fleamarket-dawn.mp4
├── mobile/                  # vertical assets for Play Store / mobile hero (9:16)
│   └── pricescout-D1-phone-vertical.mp4
└── final-cta/               # final CTA banner two-shot crossfade (16:9)
    ├── pricescout-E1a-bin-ambient.mp4
    └── pricescout-E1b-hand-camera.mp4
```

## Filling this folder

1. Generate videos in Leonardo Motion 2.0 (claude-driven via Chrome MCP)
2. Run `scripts\download-leonardo-videos.ps1` to bulk-fetch
3. Or download individually from Leonardo's UI and drop in the right bucket

## Wiring into pages

Dispatch 008 (pending) swaps static `<Image>` tags for `<video autoPlay muted playsInline loop>` with poster fallbacks on:
- Homepage hero (uses `hero/A1` + `hero/A2` side-by-side, mobile shows `hero/A1` only)
- `/industries/[slug]` pages (each uses its matching `industries/Cn` clip as a section background)
- Final CTA banner (crossfades `final-cta/E1a` → `final-cta/E1b`)
- Play Store listing (uses `mobile/D1` for the app preview video)
