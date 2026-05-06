---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P0-CRITICAL
status: SUPERSEDED
project: pricescout
fleet: pricescout-infra
machine: office-pc
working_dir: E:\Projects\pricescout
superseded_at: 2026-05-04
supersedes_dispatch: PRICESCOUT-MIRROR-STANDALONE-104
reason: Standalone repo at E:\Projects\pricescout eliminates monorepo→standalone mirror gap; no subtree split or MIRROR_PAT required for PriceScout.
---

# 104 — ARCHIVED (superseded by PRICESCOUT-BOOTSTRAP-STANDALONE-001)

This dispatch described forcing `apps/thrift-store-scanner/` into `github.com/thisisthecoolesthting/thrift-store-scanner` via `git subtree split` and a monorepo GitHub Action.

**PriceScout now lives only in the standalone repo** (`E:\Projects\pricescout`, GitHub target `thisisthecoolesthting/pricescout` after operator rename). Do not implement subtree mirror or “never edit standalone” rules from 104 — they no longer apply.

Original monorepo copy is preserved below for audit.

---

<!-- Original body (monorepo paths) -->

Read **`build/SOLUTIONSTORE_SAAS_SPINE.md`** §15 (deploy pattern) and **`CLAUDE.md`** ("Migration plan" + "Repo layout") before acting.

# 104 — Close the mirror gap: monorepo `apps/thrift-store-scanner/` → standalone `thrift-store-scanner.git`

## Why this is P0

The VPS at pricescout.pro pulls from `github.com/thisisthecoolesthting/thrift-store-scanner` (the standalone repo). All Cursor work since dispatch 080 has been committing to `github.com/thisisthecoolesthting/rickys-control-center` (the monorepo) under `apps/thrift-store-scanner/`. **Result: nothing recent (admin shell, auth, Prisma, Stripe wiring, Playwright) has reached the live site.** Every dispatch downstream of this is blocked from being visible to the operator until 104 lands.

ShiftDeck's deploy pattern in spine §15 assumes the source repo and the deploy target are the same repo. PriceScout broke that invariant when it moved to the monorepo. We restore it by treating the standalone repo as a **mirror** of `apps/thrift-store-scanner/` — fed automatically.

(Full task list omitted here — see monorepo `cursor-dispatch` history if needed.)
