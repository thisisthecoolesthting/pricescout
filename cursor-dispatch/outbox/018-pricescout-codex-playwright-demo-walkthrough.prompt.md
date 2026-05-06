---
to: codex
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-qa
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/codex-demo-walkthrough-qa
dispatch_id: PRICESCOUT-CODEX-DEMO-QA-018
depends_on: [PRICESCOUT-DEMO-SEED-017]
blockedBy: []
parallel_safe: true
order: 18
agent: codex
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-018-pricescout-codex-demo-qa.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

# 018 — Codex: Playwright demo-walkthrough regression suite

## Why this is for Codex

Mechanical, parallel-safe, repeatable, zero design judgment. Codex&apos;s lane.

The operator is demoing PriceScout tomorrow. Before the live demo, a Playwright suite walks through the EXACT demo flow, screenshots every step, asserts that key UI elements + content are present, and produces a markdown regression report that flags any drift between expected and actual. Re-runnable any time.

## Tasks

### A — Add `tests/demo-walkthrough.spec.ts`

Use existing Playwright config from earlier dispatches (`playwright.config.ts` should already exist; if not, `npm i -D @playwright/test && npx playwright install chromium` first).

The spec walks through 11 demo beats. Each beat:
1. Navigates / clicks / types
2. Asserts presence of expected text (the post-006 shop-language version)
3. Asserts ABSENCE of flipper-coded language (regression guard)
4. Screenshots the viewport (1440x900 desktop, 412x892 mobile)
5. Logs timing

Beats:

| # | Page | Click | Asserts |
|---|---|---|---|
| 1 | `/` | none | Hero "Snap. Price. Post.", trust strip, dual-surface 2-up images, no "flip log" / "BUY/SKIP" anywhere |
| 2 | `/scan` | (no camera available — that&apos;s OK in CI) | Scanner component renders, manual-text input present, "tag price" / "suggested" wording |
| 3 | `/pricing` | hover over Founders Lifetime tier | "Founders Lifetime $699" pricing visible; Marketplace listing helper bullet in feature list |
| 4 | `/features/marketplace-helper` | none | Page exists (post-007), shows the FB listing flow |
| 5 | `/features/browser-scanner` | none | Page exists (post-002), names dual-surface |
| 6 | `/industries/thrift-stores` | none | "back-room laptop with USB cam" copy present |
| 7 | `/watch` | none | Either the video plays OR the SVG fallback (`HeroScanFlowEmbed`) renders — no broken `<video>` |
| 8 | `/login` (as `maria@greenfield.shop` / `demo-password!`) | submit | Lands on `/admin` |
| 9 | `/admin` | none | Today&apos;s pricings count > 0, recent scans table populated |
| 10 | `/admin/scans` | none | At least 50 rows visible across pagination, Marketplace status column shows mix of "Posted/Sold/Draft" |
| 11 | `/admin/devices` | none | 4 devices listed, MobileAppCard with QR code visible |

Plus an extra WPBS smoke beat:
| 12 | `/` | scroll to bottom, click "WPBS" button | Modal opens, type `audit@example.com`, submit, expect either success message OR magic-link rendered inline |

### B — Flipper-language regression guard

Run a global search across all visited pages for these strings. Any hit fails the test:

```ts
const FLIPPER_LANGUAGE_FORBIDDEN = [
  /flip log/i,
  /\bbuy\s*\/\s*skip\b/i,
  /\bbuy\s*\/\s*maybe\s*\/\s*skip\b/i,
  /your cost/i,
  /net (margin|profit)/i,
  /deal score/i,
  /shared flip/i,
  /flippers? (welcome|use|love)/i,
];
```

Allow exceptions for legal/privacy/terms pages where these terms might appear in a generic-recital context (none expected, but flag if found and let the operator review).

### C — Screenshot output

Save under `tests/__screenshots__/demo-walkthrough/` with names like `01-home-desktop.png`, `01-home-mobile.png`, `02-scan-desktop.png`, etc. Two viewports per beat: 1440x900 (desktop) and 412x892 (mobile, Pixel-sized).

### D — Markdown report

After all beats, write `build/proof/PRICESCOUT-CODEX-DEMO-QA-018-report.md` with:
- Top: PASS/FAIL summary (X of 12 beats passed)
- Per beat: status, screenshot link, any forbidden-language hits, timing
- Bottom: list of all flipper-language hits across the site
- A short "Demo readiness assessment" — green / yellow / red

### E — `package.json` script

```json
"scripts": {
  // ... existing
  "demo-qa": "playwright test tests/demo-walkthrough.spec.ts --reporter=list"
}
```

Operator runs `npm run demo-qa` before each demo. Re-runnable, idempotent.

### F — CI hook (optional)

If `.github/workflows/` exists, add a `demo-qa.yml` that runs this on every push to `main`. Off by default — operator opts in by uncommenting.

## Done-when

- [ ] `tests/demo-walkthrough.spec.ts` exists, has all 12 beats
- [ ] `npm run demo-qa` runs end-to-end without infrastructure errors (test failures are OK — this is a regression detector, not a guarantee everything passes)
- [ ] 24 screenshots produced (12 beats × 2 viewports)
- [ ] `build/proof/PRICESCOUT-CODEX-DEMO-QA-018-report.md` written
- [ ] Reply documents: how many beats passed, top 3 issues found, suggested fixes
- [ ] git mv outbox→done + proof JSON `build/proof/PRICESCOUT-CODEX-DEMO-QA-018.json`

## Out of scope

- Fixing any issues found (that&apos;s the operator&apos;s call — Codex reports, doesn&apos;t patch product code)
- Visual diff against a baseline (no prior baseline exists; this run establishes one)
- Cross-browser (Chromium only — Safari + Firefox in a future dispatch)
- Mobile native app testing (that&apos;s a separate Detox / EAS workflow)
- Load testing (separate dispatch — k6 was 128b)
