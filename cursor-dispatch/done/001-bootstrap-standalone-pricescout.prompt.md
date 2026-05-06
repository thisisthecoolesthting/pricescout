---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
project: pricescout
fleet: pricescout-infra
machine: office-pc
working_dir: E:\Projects\pricescout
branch: main
dispatch_id: PRICESCOUT-BOOTSTRAP-STANDALONE-001
depends_on: []
blockedBy: []
parallel_safe: false
order: 1
agent: cursor
operator_blocked_on: []
reply: cursor-dispatch/inbox/2026-04-29-001-pricescout-bootstrap-standalone.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

# 001 — Bootstrap PriceScout as a standalone repo at E:\Projects\pricescout

## Why

PriceScout is moving out of the `rickys-control-center` monorepo (`C:\Users\reasn\Documents\Claude\Projects\DEv1\apps\thrift-store-scanner\`) and into its own dedicated repo at **`E:\Projects\pricescout\`**.

**This kills the entire mirror-gap problem:**
- Single repo. Single deploy target. Single PR pipeline.
- VPS pulls directly from this repo. No subtree split, no GitHub Action mirror, no force-push history rewrites.
- ShiftDeck pattern: each SaaS is its own repo (per `build/SOLUTIONSTORE_SAAS_SPINE.md` §1) — PriceScout was the outlier, now corrected.

The existing app at `C:\Users\reasn\Documents\Claude\Projects\DEv1\apps\thrift-store-scanner\` already has 32 routes, 7 API routes, full Prisma schema with 5 models, web `Scanner.tsx` (`getUserMedia`), Expo mobile scanner, admin shell, auth, Stripe stubs. **All of that work is preserved by this migration** — we're moving files, not rewriting.

## Tasks

### A — Create the destination + copy contents

Source: `C:\Users\reasn\Documents\Claude\Projects\DEv1\apps\thrift-store-scanner\`
Destination: `E:\Projects\pricescout\`

```powershell
# In office-pc PowerShell:
New-Item -ItemType Directory -Force -Path "E:\Projects\pricescout"
robocopy "C:\Users\reasn\Documents\Claude\Projects\DEv1\apps\thrift-store-scanner" "E:\Projects\pricescout" /E /XD node_modules .next .turbo dist build /XF .env .env.local
```

This excludes `node_modules`, `.next`, build artifacts, and any `.env*` files (those are environment-specific and shouldn't migrate).

After copy, verify file count:
```powershell
(Get-ChildItem "E:\Projects\pricescout" -Recurse -File | Measure-Object).Count
```

Expected: similar count to the source minus the excluded folders.

### B — Carry over the relevant build/ docs

Copy these specific files from the monorepo to E:\Projects\pricescout\ root so future Cursor sessions have the doctrine:

```powershell
# Spine doc — canonical SaaS template
Copy-Item "C:\Users\reasn\Documents\Claude\Projects\DEv1\build\SOLUTIONSTORE_SAAS_SPINE.md" "E:\Projects\pricescout\docs\SOLUTIONSTORE_SAAS_SPINE.md"
# Spine gap audit
Copy-Item "C:\Users\reasn\Documents\Claude\Projects\DEv1\build\PRICESCOUT_SPINE_GAPS.md" "E:\Projects\pricescout\docs\PRICESCOUT_SPINE_GAPS.md"
# Niche spec
Copy-Item "C:\Users\reasn\Documents\Claude\Projects\DEv1\saas_specs\thrift-store-scanner.json" "E:\Projects\pricescout\saas_spec.json"
```

### C — Carry over relevant dispatches + write CLAUDE.md

Copy `cursor-dispatch/outbox/104-*` and `cursor-dispatch/outbox/126-*` from monorepo to `E:\Projects\pricescout\cursor-dispatch\outbox\` — but **rewrite the working_dir frontmatter** in each from `C:\Users\reasn\Documents\Claude\Projects\DEv1` to `E:\Projects\pricescout`. Note: the **104 mirror dispatch becomes obsolete** in the new architecture — move it to `cursor-dispatch/done/SUPERSEDED-104-mirror-no-longer-needed.prompt.md` with a note explaining standalone repo eliminates the gap.

Write a fresh `E:\Projects\pricescout\CLAUDE.md` (do NOT copy the monorepo's — it's about DEv1 the orchestrator, not PriceScout). Use this skeleton:

```markdown
# PriceScout — visual-first thrift store pricing scanner

**Live:** https://pricescout.pro
**Repo (this repo):** github.com/thisisthecoolesthting/pricescout (after Task D below; previously named thrift-store-scanner)
**Monorepo origin:** Migrated out of rickys-control-center on 2026-04-29 — see commit 001 in this repo for the bootstrap proof.

## Stack
Next.js 15 + React 18 + Tailwind 3 + TypeScript strict.
Prisma + Postgres 17 + bcryptjs + jsonwebtoken.
Stripe SDK + 5 Price IDs (Week Pass / Pro Monthly / Pro Annual / Founders Lifetime / Device Add-on).
Mobile: Expo 52 + React Native 0.76 + expo-router + expo-camera at `mobile/`.

## Doctrine
Read `docs/SOLUTIONSTORE_SAAS_SPINE.md` BEFORE any non-trivial change. PriceScout follows the spine's six-section recipe, visual tokens, and mobile rules verbatim. ShiftDeck (shiftdeck.tech) is the live reference site.

Read `docs/PRICESCOUT_SPINE_GAPS.md` for documented brand deviations vs the spine (mint not teal — intentional).

## Repo layout
- `src/app/` — Next 15 routes (32 page.tsx + 7 route.ts)
- `src/components/` — Header, Scanner (getUserMedia + barcode), PriceVerdict, PricingTiers, FAQ, etc.
- `prisma/` — schema + migrations + seed.ts (Tenant/User/Session/Device/Scan)
- `mobile/` — Expo app (Android live, iOS in review)
- `cursor-dispatch/{outbox,inbox,done}/` — agent dispatch protocol
- `docs/` — spine doc, spine gap audit, deploy notes

## Deploy
VPS auto-pull cron at `/etc/cron.d/pricescout-deploy` runs every 2 minutes:
`git fetch && git reset --hard origin/main && pm2 stop pricescout; npm ci && prisma generate && next build && pm2 start pricescout --update-env`

PM2 process: `pricescout`, port 3300, served behind Caddy at pricescout.pro (Caddyfile entry on the VPS at `/etc/caddy/Caddyfile`).

## Pricing tiers
- Week Pass: $29 (7-day pass — for one-weekend estate sales / yard sales)
- Pro Monthly: $49/mo
- Pro Annual: $490/yr
- Founders Lifetime: $699 cap-100 (sold out at 100)
- Device Add-on: $15/mo per scanner install over the 4-included pool
Each paid tier includes 4 scanner installs (phones + browsers both count).

## Audience
Thrift store operators, estate sale crews, yard sale runners, flea-market resellers. NOT solo flippers — the marketing has been repositioned to crew/operator language.

## Two camera surfaces
1. **Phone (primary)** — Expo app, Android live, iOS in review
2. **Web webcam (secondary)** — `getUserMedia` in `src/components/Scanner.tsx`, runs on any laptop / POS / kiosk
Same `/api/identify` API. Same flip log. Same 4-included device pool.
```

### D — Initialize git + push to GitHub

```bash
cd E:\Projects\pricescout
git init -b main
git add -A
git commit -m "feat: bootstrap PriceScout standalone repo from monorepo migration

- Source: rickys-control-center/apps/thrift-store-scanner @ <SHA>
- Destination: E:\Projects\pricescout
- Excludes: node_modules, .next, .env*
- Doctrine: docs/SOLUTIONSTORE_SAAS_SPINE.md carried over
- Mobile workspace: mobile/ preserved
- Prisma schema + migrations preserved
- 32 page routes + 7 API routes preserved

Closes the monorepo→standalone mirror gap (former dispatch 104 superseded)."

# Create the GitHub repo. Two options:
# OPTION 1 — rename the existing thrift-store-scanner repo to pricescout (preferred):
gh repo rename pricescout --repo thisisthecoolesthting/thrift-store-scanner
git remote add origin https://github.com/thisisthecoolesthting/pricescout.git
git fetch origin
git push --force origin main  # one-time history overwrite — old repo had a different layout
# OPTION 2 — create new pricescout repo, leave thrift-store-scanner abandoned:
gh repo create thisisthecoolesthting/pricescout --public --source . --remote origin --push
```

Recommend **Option 1** — preserves the GitHub URL conventions (single canonical repo).

### E — Update VPS deploy

After the rename:

```bash
ssh dev1-vps
cd /var/www/pricescout
# repoint origin from old to new
git remote set-url origin https://github.com/thisisthecoolesthting/pricescout.git
git fetch origin
git reset --hard origin/main
npm ci --silent
npx prisma generate
npm run build
pm2 stop pricescout 2>/dev/null
pm2 start npm --name pricescout --update-env -- start
pm2 save
curl -sI https://pricescout.pro | head -1  # smoke: should be HTTP/2 200
```

If the rename triggered a redirect on GitHub, `git fetch` should still work (GitHub redirects old URLs for a grace period). But explicitly `git remote set-url` removes ambiguity going forward.

### F — Write proof + clean up

In `E:\Projects\pricescout\build\proof\PRICESCOUT-BOOTSTRAP-STANDALONE-001.json`:

```json
{
  "dispatch_id": "PRICESCOUT-BOOTSTRAP-STANDALONE-001",
  "branch": "main",
  "completed_at": "<UTC ISO timestamp>",
  "source_path": "C:\\Users\\reasn\\Documents\\Claude\\Projects\\DEv1\\apps\\thrift-store-scanner",
  "destination_path": "E:\\Projects\\pricescout",
  "source_sha": "<monorepo HEAD SHA at time of copy>",
  "destination_first_sha": "<new repo's first commit SHA>",
  "files_copied": <count>,
  "files_excluded": ["node_modules", ".next", ".env", ".env.local", "dist", "build", ".turbo"],
  "github_repo": "https://github.com/thisisthecoolesthting/pricescout",
  "vps_smoke_status": "HTTP/2 200",
  "supersedes": ["PRICESCOUT-MIRROR-STANDALONE-104"],
  "operator_followups": [
    "Optionally archive C:\\Users\\reasn\\Documents\\Claude\\Projects\\DEv1\\apps\\thrift-store-scanner — it's now superseded; keep for one week as backup",
    "Update saas_specs/thrift-store-scanner.json reference in monorepo CLAUDE.md to note the migration"
  ]
}
```

Then move this dispatch file from `cursor-dispatch/outbox/` to `cursor-dispatch/done/`.

## Critical gotchas

- **Don't `git mv` the monorepo's `apps/thrift-store-scanner/` away yet.** Leave it intact for one week as a backup. Operator can `rm -rf` it later once the standalone repo proves stable.
- **`.env` files do NOT migrate.** Those are operator-managed in VPS at `/var/www/pricescout/.env`. The new repo should have a fresh `.env.example` derived from current keys (DATABASE_URL, STRIPE_*, KEEPA_API_KEY, RESEND_API_KEY, SENTRY_DSN, NEXT_PUBLIC_APP_URL, PS_SESSION_SECRET, etc.).
- **`mobile/` is part of the same repo.** Do NOT split it out. Per spine §1, web + mobile share the repo so types and API contracts stay in lockstep.
- **Prisma migration history is preserved.** Don't `prisma migrate reset` after the move — the existing `20260429213000_init/migration.sql` is the canonical history.

## Done-when

- [ ] `E:\Projects\pricescout\` exists, populated, robocopy verified
- [ ] `docs/SOLUTIONSTORE_SAAS_SPINE.md` + `docs/PRICESCOUT_SPINE_GAPS.md` + `saas_spec.json` carried over
- [ ] Fresh `E:\Projects\pricescout\CLAUDE.md` written (skeleton above)
- [ ] `cursor-dispatch/outbox/126-*` carried over with rewritten `working_dir`
- [ ] `cursor-dispatch/done/SUPERSEDED-104-*` exists with note
- [ ] `git init` → first commit → push to renamed `pricescout` GitHub repo
- [ ] VPS `git remote set-url` → `git reset --hard origin/main` → `pm2 restart` → HTTP/2 200 smoke pass
- [ ] `build/proof/PRICESCOUT-BOOTSTRAP-STANDALONE-001.json` written
- [ ] Dispatch moved to `cursor-dispatch/done/`

## Out of scope

- The dual-surface copy work (that's dispatch 002 in the new repo, formerly 126)
- Stripe Price ID wiring (that's dispatch 003, formerly 082/129)
- Walkthrough video (that's dispatch 004, formerly 087/127)
- Removing the monorepo's `apps/thrift-store-scanner/` directory (defer one week)
