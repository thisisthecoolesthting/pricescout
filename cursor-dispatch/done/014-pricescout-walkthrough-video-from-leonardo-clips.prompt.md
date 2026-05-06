---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-marketing
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/walkthrough-video-asset
dispatch_id: PRICESCOUT-WALKTHROUGH-VIDEO-014
depends_on: []
blockedBy: []
parallel_safe: true
order: 14
agent: cursor
operator_blocked_on:
  - "Operator confirms which Leonardo clips actually downloaded successfully (they should be in office-pc Downloads folder OR E:\\Projects\\pricescout\\public\\videos\\<bucket>\\). If none made it to disk, the Path A web-record approach below applies instead."
reply: cursor-dispatch/inbox/2026-04-29-014-pricescout-walkthrough-video.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

# 014 — Ship `public/videos/walkthrough.webm` so /watch stops 404'ing

## Why this is P0

`/watch/page.tsx:41` references `/videos/walkthrough.webm` but the file does not exist (only `public/videos/README.md` and `README.txt`). The video element renders the poster (`/images/app-interface.jpg`) and a broken-play-button overlay. For a tomorrow demo, this is the highest-visibility broken asset on the site — anyone clicking "Watch tour" sees a dead video.

Operator has Leonardo Motion 2.0 clips that downloaded earlier this session. Some/most/all should be on disk somewhere on office-pc.

## Tasks

### A — Locate the existing Leonardo clips

Check these locations in order:

```bash
# 1. Already-organized
dir E:\Projects\pricescout\public\videos\hero
dir E:\Projects\pricescout\public\videos\industries
dir E:\Projects\pricescout\public\videos\final-cta
dir E:\Projects\pricescout\public\videos\mobile

# 2. Default office-pc Downloads
dir C:\Users\reasn\Downloads\*pricescout*.mp4
dir C:\Users\reasn\Downloads\motion_2.0*.mp4
```

The mid-session download script `scripts/download-leonardo-videos.ps1` may have populated `public/videos/<bucket>/` directly. If so, work with what's there.

### B — Pick the best 3 clips for a 60-second tour

Suggested ordering and trim:
1. **A1 phone-sweater** (or `D1-buy-pill horizontal` if it&apos;s already on disk and looks better) — first 12 seconds
2. **C1 thrift-backroom** OR **C2 estate-dining** — middle 18 seconds (whichever has the best lighting / least warping)
3. **E1b hand-camera** — final 15 seconds

Open each candidate with the default Windows player or `ffplay` and pick whichever has the cleanest motion.

### C — Stitch with ffmpeg

Install ffmpeg if not present (`winget install ffmpeg` or `choco install ffmpeg`), then:

```bash
cd E:\Projects\pricescout
$ffmpeg = "ffmpeg"

# Build a concat list (use forward slashes inside the file even on Windows)
@"
file 'public/videos/hero/pricescout-A1-phone-sweater.mp4'
file 'public/videos/industries/pricescout-C1-thriftstore-backroom.mp4'
file 'public/videos/final-cta/pricescout-E1b-hand-camera.mp4'
"@ | Set-Content -Path public\videos\concat.txt -Encoding ascii

# Concat + transcode to webm (vp9 + opus, web-friendly)
& $ffmpeg -y -f concat -safe 0 -i public\videos\concat.txt -c:v libvpx-vp9 -b:v 1.2M -crf 32 -c:a libopus -b:a 96k public\videos\walkthrough.webm

# Also produce an mp4 fallback (Safari iOS sometimes hates webm)
& $ffmpeg -y -f concat -safe 0 -i public\videos\concat.txt -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k -movflags +faststart public\videos\walkthrough.mp4

# Generate a poster from the 3-second mark of the first clip
& $ffmpeg -y -ss 3 -i public\videos\hero\pricescout-A1-phone-sweater.mp4 -frames:v 1 public\images\walkthrough-poster.jpg

# Clean up the concat file
Remove-Item public\videos\concat.txt
```

Target file sizes: `walkthrough.webm` <8MB, `walkthrough.mp4` <12MB, `walkthrough-poster.jpg` <200KB.

### D — Update `/watch/page.tsx` to source both formats + the new poster

Patch `src/app/watch/page.tsx` around the `<video>` element:

```tsx
<video
  className="h-full w-full object-cover"
  controls
  playsInline
  muted
  poster="/images/walkthrough-poster.jpg"
  preload="metadata"
>
  <source src="/videos/walkthrough.webm" type="video/webm" />
  <source src="/videos/walkthrough.mp4" type="video/mp4" />
</video>
```

The `<source>` tag order matters — webm first (smaller, faster), mp4 fallback for Safari iOS.

### E — Update OG/Twitter meta to point at a video preview

Optional polish: add `og:video` + `og:video:type` tags so social-card unfurls show a video preview instead of just the poster. Use `metadataBase` URL prefix.

```tsx
openGraph: {
  // ... existing
  videos: [{ url: "/videos/walkthrough.mp4", type: "video/mp4", width: 1280, height: 720 }],
},
```

### F — Update README

Edit `public/videos/README.md` to remove the "drop walkthrough.webm here" instruction and replace with: "walkthrough.webm + walkthrough.mp4 are the live demo videos as of dispatch 014. Re-run `scripts/regenerate-walkthrough.ps1` to swap source clips."

Then write that regeneration script — basically Task C wrapped in PowerShell with parameter inputs for the three source clip paths.

## Path A fallback — if no Leonardo clips on disk

If Task A finds nothing locally, ship a simpler asset:

1. Use the **animated SVG** at `public/animations/hero-scan-flow.svg` (created by dispatch 010) directly as the watch-page hero. Not a video, but a clean self-contained loop that explains the product flow.
2. Patch `/watch/page.tsx` to render the SVG inline (or as `<img>`) instead of `<video>`. Add a small caption: "60-second product walkthrough. Coming soon: live recording from a partner shop."
3. Document this fallback in the reply so the operator knows to re-run dispatch 014 once Leonardo clips return.

## Done-when

- [ ] `public/videos/walkthrough.webm` exists, <8MB, plays in Chrome/Firefox
- [ ] `public/videos/walkthrough.mp4` exists, <12MB, plays in Safari (test iOS or Safari macOS)
- [ ] `public/images/walkthrough-poster.jpg` exists, <200KB
- [ ] `/watch/page.tsx` uses both sources + new poster
- [ ] OG/Twitter meta optionally wired
- [ ] `scripts/regenerate-walkthrough.ps1` exists for future re-runs
- [ ] `npm run build` green
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-WALKTHROUGH-VIDEO-014.json`

## Out of scope

- Captions / subtitles on the video (a future a11y dispatch)
- Multiple language versions
- Vimeo/YouTube hosting (we&apos;re self-hosting via VPS — no third-party tracking)
- Full Leonardo re-roll batches (operator out of credits this session)
