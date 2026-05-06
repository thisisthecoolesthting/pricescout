# Reply — PRICESCOUT-BOOTSTRAP-STANDALONE-001

## Completed in-repo

- Standalone tree at `E:\Projects\pricescout` with app, `mobile/`, Prisma, docs spine + gaps, `saas_spec.json`, `CLAUDE.md`, superseded 104 note, carried `126-*` in outbox (execute **002** for dual-surface work).
- Initial commit on `main`: `4bc5734` (includes `git mv` of `001` prompt to `cursor-dispatch/done/`).
- Proof: `build/proof/PRICESCOUT-BOOTSTRAP-STANDALONE-001.json`.
- Local proof: `npm run test` (2/2), `npm run typecheck` (pass), `npm run build` (pass).

## Operator-only — GitHub rename + push

`GITHUB_TOKEN` in `.env` is read-only and will **403** on `gh repo rename`. Use an interactive `gh auth login` session as **thisisthecoolesthting**, then:

```bash
gh repo rename pricescout --repo thisisthecoolesthting/thrift-store-scanner
cd /path/to/E:/Projects/pricescout   # or your clone
git remote add origin https://github.com/thisisthecoolesthting/pricescout.git
git fetch origin
git push -u origin main
```

If the repo was already renamed or empty, adjust remote URL accordingly. Open the bootstrap PR separately from dispatch 002.

**Cursor note:** `gh pr create` was attempted before `origin` existed and failed with **`no git remotes found`** (expected). After `git remote add` + `git push`, run `gh pr create` from the same clone (or open the PR in the GitHub UI).

## Operator-only — VPS + smoke

After `main` is pushed:

```bash
ssh <your-vps-host>
cd /var/www/pricescout
git remote set-url origin https://github.com/thisisthecoolesthting/pricescout.git
git fetch origin
git reset --hard origin/main
npm ci --silent
npx prisma generate
npm run build
pm2 stop pricescout 2>/dev/null || true
pm2 start npm --name pricescout --update-env -- start
pm2 save
curl -sI https://pricescout.pro | head -1
```

Expect `HTTP/2 200` (or equivalent) on the first line.

## Next for Cursor

- Dispatch **002** on branch `feat/dual-surface-copy` (read `docs/SOLUTIONSTORE_SAAS_SPINE.md` first).
