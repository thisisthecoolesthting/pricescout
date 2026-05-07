# PRICESCOUT-CODEX-DEMO-QA-018 Reply

Status: baseline committed with known RED beats.

Implemented:
- Added `tests/demo-walkthrough.spec.ts` with 12 Chromium-only demo beats.
- Added desktop and Pixel-sized mobile screenshots per beat under `tests/__screenshots__/demo-walkthrough/` during the local run.
- Added `npm run demo-qa`.
- Updated Playwright config for Chromium, `PLAYWRIGHT_BASE_URL` override, and local `npm run dev` web server.
- Wrote proof artifacts:
  - `build/proof/PRICESCOUT-CODEX-DEMO-QA-018-report.md`
  - `build/proof/PRICESCOUT-CODEX-DEMO-QA-018.json`

Run:
- `npm run demo-qa`
- Result: infrastructure failure locally, then regression failures recorded.

Local infrastructure blockers:
- `DATABASE_URL` is not set for local Prisma-backed login/admin/WPBS demo beats.
- `PS_SESSION_SECRET` is not set for local auth/session demo beats.

Observed baseline:
- 4 of 12 beats passed.
- 8 of 24 viewport runs passed.
- 0 forbidden-language hits.
- Demo readiness: RED.

Top findings:
1. Home hero does not expose canonical `Snap. Price. Post.` copy.
2. `/pricing` does not include the required `Marketplace listing helper` bullet.
3. `/features/marketplace-helper` returns a 404.

Expected follow-ups:
- Dispatch 007 should satisfy the FB Marketplace gated beats.
- Dispatch 017 should satisfy seeded admin data/login beats.
- Dispatch 026 should add live/VPS-oriented demo QA config.
