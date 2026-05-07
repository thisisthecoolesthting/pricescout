# AGENTS.md — instructions for any AI agent working in this repo

**This file is read automatically by Codex, Claude Code, Cursor (legacy), and any other compatible agent at session start.** Treat its contents as load-bearing configuration. Do not skip.

## TL;DR

1. Before generating ANY UI, route, copy, or component, read `docs/SOLUTIONSTORE_SAAS_SPINE.md` fully.
2. Push to `origin` which is `https://github.com/thisisthecoolesthting/pricescout.git` on `main` (or feature branches off main).
3. Audience is **thrift store shops, NOT flippers**. Strip flipper-coded language on sight.
4. Two value props: **(1) quick price**, **(2) Facebook Marketplace listing helper**. Both must be visible above the fold.
5. Use spine §7 visual tokens only. Never introduce new colors without explicit operator approval.

## Required reading before any non-trivial change

| File | Why |
|---|---|
| `docs/SOLUTIONSTORE_SAAS_SPINE.md` | Canonical SaaS template. Page recipe, visual tokens, component patterns, mobile rules, deploy patterns, copy conventions. Source of truth for every UI decision. |
| `docs/PRICESCOUT_SPINE_GAPS.md` | Documented intentional brand deviations vs the spine (mint not teal, etc.). Read so you don't "fix" deliberate choices. |
| `runbooks/DEMO_SCRIPT.md` | The canonical demo flow. If your change affects what a demo touches, update the runbook. |
| `prisma/schema.prisma` | DB shape. Read before any model change. |
| `saas_spec.json` | Niche-specific config (audience, tiers, pricing, brand). Read for context on this product. |

## Spine sections to follow verbatim

- **§6** — Six-section page recipe: Teal Hero → Problem+Who → Capabilities+How → FAQ → Related → Dark Final CTA. Every marketing route follows this rhythm.
- **§7** — Visual tokens: mint `#11CB9D`, ink `#04342C`, accent `#0C5A8A`, cream `#FAF6E8`, line `#E2DCC9`. Section padding 80px desktop / 56px mobile. No ad-hoc Tailwind class soup.
- **§8** — Mobile drawer: sibling-mounted, no z-trap. The sticky-header backdrop-blur creates a stacking context that swallows nested z-indexes — drawer MUST be a sibling of `<header>`, not a child.
- **§10** — Auth + Stripe billing: magic-link first; password-set on invite; Stripe customer portal for self-serve cancellation; never store card details in DB.
- **§13** — Playwright + walkthrough video pipeline. See `tests/demo-walkthrough.spec.ts` for the regression suite.
- **§15** — Deploy pattern: `pm2 stop && pm2 start --update-env`, never `pm2 reload`. VPS auto-pulls every 2 min via `/etc/cron.d/pricescout-deploy`.
- **§16** — Copy conventions: `&apos;` not `'` in JSX text. No "Book a demo." Standard CTAs: "Start 14-day free trial", "Open scanner", "See pricing".

## Audience

PriceScout is **for thrift store shops, estate sale crews, yard sale runners, consignment shops, and 501c3 nonprofit thrift centers**. NOT for solo flippers, resellers, or arbitrage hustlers.

This means: any time you see "flip log", "BUY/SKIP verdict", "your cost", "net margin", "deal score", "flipper", "reseller" in user-facing copy → **replace with shop-friendly equivalents**:

| Remove | Use |
|---|---|
| flip log | tag list / inventory / today's pricings |
| Save to flip log | Save to tag list |
| BUY / SKIP / MAYBE verdict | Suggested tag price |
| net margin | expected price range |
| your cost / cost basis | DROP entirely (shops don't track per-item cost on donations) |
| deal score | pricing confidence |
| flipper / reseller | shop / operator / crew |

Internal field names, type definitions, and DB columns may retain old terminology temporarily — that's a separate dispatch (006). UI strings get fixed on contact.

## Two value props (visible above the fold)

1. **Quick price** — snap an item, get a defensible tag price in seconds backed by real eBay sold-comps.
2. **Facebook Marketplace listing helper** — auto-generate a Marketplace listing draft (title, category, price, description) from the scan, copy + open Marketplace with one tap.

If either is missing from a page where it should be (homepage, /pricing, /features), add it.

## Git push convention

- **Remote:** `origin` is `https://github.com/thisisthecoolesthting/pricescout.git`
- **Default branch:** `main`
- **Branch naming:** `feat/<short-slug>` for features, `fix/<short-slug>` for bug fixes, `chore/<short-slug>` for housekeeping
- **PR target:** always `main`
- **Merge style:** squash (`gh pr merge <number> --squash --delete-branch=false`)
- **Force push:** never on `main`. On feature branches only with operator confirmation.
- **Author identity:** `Ricky Reasner <reasner196@gmail.com>` (operator's git config)

When in doubt about which repo to push to:

```powershell
cd E:\Projects\pricescout && git remote -v
# Should show:
# origin  https://github.com/thisisthecoolesthting/pricescout.git (fetch)
# origin  https://github.com/thisisthecoolesthting/pricescout.git (push)
```

For NEW sites being spawned by the spine builder (per dispatch 029):
- Repo path on disk: `E:\Projects\<slug>\`
- GitHub URL: `https://github.com/thisisthecoolesthting/<slug>.git`
- Author: same as above
- VPS deploy path: `/var/www/<slug>/` (operator wires Caddy vhost separately for now)

## Git push credentials — REQUIRED setup (run once per machine)

The builder agent CANNOT push without these. Verify each before any push attempt:

### 1. gh CLI authenticated as `thisisthecoolesthting`

```powershell
gh auth status
# Expected output includes:
# github.com
#   Logged in to github.com account thisisthecoolesthting
#   Active account: true
#   Git operations protocol: https
#   Token: gho_***************
#   Token scopes: 'gist', 'read:org', 'repo', 'workflow'
```

If NOT logged in OR wrong account:

```powershell
gh auth login --web --git-protocol https --hostname github.com
# Pick "Login with a web browser" -> authenticate as thisisthecoolesthting
# Verify with: gh auth status
```

### 2. gh as git credential helper

`gh auth login` should configure this automatically. Verify:

```powershell
git config --global credential.helper
# Expected: manager (Windows) OR cache (macOS) OR equivalent — NOT empty.

git config --global --get-all credential.https://github.com.helper
# Expected: includes "!gh auth git-credential" or "manager"
```

If git push prompts for credentials at all, run:

```powershell
gh auth setup-git
# This wires gh as the credential helper for github.com
```

### 3. Git identity

```powershell
git config --global user.name
# Expected: "Ricky Reasner" (or similar — operator's name)

git config --global user.email
# Expected: reasner196@gmail.com (or operator's email)
```

If empty:

```powershell
git config --global user.name "Ricky Reasner"
git config --global user.email "reasner196@gmail.com"
```

### 4. Smoke test (BEFORE any real push)

```powershell
cd E:\Projects\pricescout
git fetch origin
# Should succeed without prompting for password.

# Optional: dry-run a push to a throwaway branch
git checkout -b chore/credential-smoke-test
echo "credential smoke test" > _smoke.txt
git add _smoke.txt
git commit -m "chore: credential smoke test"
git push -u origin chore/credential-smoke-test
# Should succeed without prompting.

# Clean up
git push origin --delete chore/credential-smoke-test
git checkout main
git branch -D chore/credential-smoke-test
git rm _smoke.txt 2>$null
```

### 5. What to do if a push errors

- **403 Forbidden / x-access-token:** the operator's `.env` may have a stale `GITHUB_TOKEN` that git is using instead of gh CLI cached creds. Per memory `feedback_github_push_account.md`: never use `.env GITHUB_TOKEN` — it's read-only. Solution: `unset GITHUB_TOKEN; unset GH_TOKEN` in the shell env, or remove from `.env`, then retry.
- **GUI Credential Manager popup:** Windows OpenSSH integration with Git can trigger Windows Credential Manager. Solution: `gh auth setup-git` to use gh as helper instead.
- **403 on a specific repo:** the gh CLI account may not have write access. Verify via `gh repo view thisisthecoolesthting/<slug> --json viewerPermission` — needs WRITE or higher.
- **branch protection requires PR:** can't push directly to `main`. Open a PR via `gh pr create` and merge from there.

### 6. For NEW repos being spawned by the spine builder

Spawning a new repo on GitHub requires the gh CLI account to have permission to create repos under `thisisthecoolesthting`:

```powershell
gh repo create thisisthecoolesthting/<slug> --public --source . --remote origin --push
# This is the spawn idiom. Creates repo + sets remote + pushes initial commit.
```

If this errors with "permission denied":
- Verify gh auth account is `thisisthecoolesthting` (the personal/org owner)
- Verify token scopes include `repo` (full) — `gh auth refresh -s repo` if missing

## How to commit

- Conventional commit format: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`
- Subject in imperative mood, lowercase, no trailing period
- Body explains WHY (not WHAT — the diff shows that)
- For dispatch-driven work: include the dispatch ID in the subject and reference the proof JSON path in the body

Example:

```
feat(marketing): dual-surface hero + footer rewrite (dispatch 028)

Implements dispatch 028 demo-killer punch list. Footer line, PricingTiers
verdict bullet, brand.ts heroSub, plus sweep of /scan, /watch, /login,
/admin and faq-data.

Proof: build/proof/PRICESCOUT-FOOTER-PRICING-STRIP-028.json
```

## Stop conditions (refuse and surface to operator)

- Money operations: Stripe live mode without explicit operator-confirmed Price IDs; refunds; fund transfers.
- Destructive irreversible: `rm -rf /`, force-push to `main`, prod DB drop, schema column delete with data, `git filter-branch`.
- Identity / publishing: posting to social media as the operator, sending emails to a non-test address list, creating new GitHub repos owned by personal accounts other than `thisisthecoolesthting`.
- Ambiguous breaking renames: route slugs (`/features/shared-flip-log`) require operator confirmation before rename — they're public URLs.

## Workflow per dispatch

1. Read the dispatch frontmatter — note `branch`, `dispatch_id`, `depends_on`, `parallel_safe`, `agent`.
2. Verify deps are landed: `git log --oneline origin/main` should show prior dispatches' SHAs.
3. `git pull origin main --ff-only` then `git checkout -b <branch>`.
4. Read the dispatch tasks A through Z in order. Implement each.
5. Run `npm run typecheck && npm run test && npm run build`. All three green is the bar.
6. Write `build/proof/<DISPATCH_ID>.json` with the standard fields (branch, commits, test results, smoke output, any operator-blocked follow-ups).
7. `git mv cursor-dispatch/outbox/<NNN>-*.prompt.md cursor-dispatch/done/`.
8. `git add -A && git commit -m "<conventional-commit-subject>"`.
9. `git push -u origin <branch>`.
10. `gh pr create --base main --head <branch> --title "..." --body "..."` — body includes the dispatch ID + proof path + any operator-blocked items as a checklist.
11. If the dispatch is marked `self_merge_after_green: true` AND CI is green AND no operator-blocked items remain: `gh pr merge <number> --squash --delete-branch=false`.

## Known fragility

- **PowerShell em-dash bug:** Windows PowerShell defaults to non-UTF-8 encoding when reading scripts. Em-dashes (`—`) in `.ps1` files render as `â€"` and break parsing. Use ASCII hyphens in any PowerShell script you author.
- **Glob on E:\:** ripgrep occasionally times out scanning `E:\Projects\` from Cowork-mounted views. Prefer `Get-ChildItem` from PowerShell directly when listing files.
- **Windows OpenSSH ssh.exe:** broken on this machine. Always SSH via Git-Bash: `& "C:\Program Files\Git\bin\bash.exe" -lc "ssh root@..."`. Memory ref: `reference_dev1_server.md`.
- **`cursor-dispatch/` folder name:** historical. Codex reads from the same path even though the operator has moved off Cursor. Don't rename the folder until a dedicated migration dispatch.

## Memory references (Cowork's persistent memory)

Memory files at `C:\Users\reasn\AppData\Roaming\Claude\local-agent-mode-sessions\.../memory/`:

- `feedback_keep_the_ball_moving.md` — operator-self-described unfocused; agents own momentum
- `feedback_brain_only_role.md` — Claude generates dispatches; Codex executes (Cursor was deprecated 2026-04-29)
- `project_pricescout_audience_and_features.md` — shop NOT flipper + Marketplace helper
- `project_pricescout_camera_strategy.md` — phone primary, web webcam secondary
- `reference_pricescout_repo_location.md` — `E:\Projects\pricescout\`, GitHub `pricescout` (renamed from thrift-store-scanner)
- `feedback_keep_the_ball_moving.md` — bias to action over confirmation
