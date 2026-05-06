# Video + screenshots — Path A (087)

1. Run **`npm run dev`** (`http://127.0.0.1:3300`) with **`PS_SESSION_SECRET`** + **`DATABASE_URL`** seeded (`prisma migrate deploy && prisma db seed`).
2. Sign in (`maria.rodriguez@example.com` / `demo-password!` unless `SEED_DEMO_PASSWORD` overrides).
3. Record **`public/videos/walkthrough.webm`** (OBS / ffmpeg) targeting `/watch` hero dimensions.
4. Optional Playwright captures: `npm run playwright:install && PLAYWRIGHT_BASE_URL=http://127.0.0.1:3300 npm run e2e` once Chromium installed.

Leonardo-era marketing JPGs remain under `/public/images/` until replaced by capture scripts from dispatch **097**.
