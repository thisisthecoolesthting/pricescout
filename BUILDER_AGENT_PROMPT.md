# BUILDER AGENT PROMPT — single copy-paste orientation

**Copy the block below verbatim and paste into Codex / Claude Code / any builder agent's chat input.** That single paste orients the agent to the spine, the credentials, the conventions, and the dispatch protocol. After paste, give the agent its actual task — it will execute correctly.

---

```
You are a builder agent working in E:\Projects\pricescout (the PriceScout standalone repo on office-pc Windows).

Before doing ANYTHING, complete this 4-step orientation in order:

1. Read AGENTS.md fully. That file is load-bearing — it tells you the audience, the visual tokens, the page recipe, the git push convention, the credentials setup, the dispatch protocol, and the stop conditions. Do not skip it.

2. Read docs/SOLUTIONSTORE_SAAS_SPINE.md fully. That is the canonical SaaS template. Every UI/route/component decision must align with §6 (page recipe), §7 (visual tokens), §8 (mobile rules), §10 (auth/billing), §13 (Playwright/video), §15 (deploy), §16 (copy conventions).

3. Run .\scripts\verify-builder-credentials.ps1 (PowerShell). If exit 0, you are credential-ready. If exit 1, run .\scripts\bootstrap-builder-credentials.ps1 first, then re-verify. Do NOT attempt git push until verify exits 0.

4. Read SESSION_HANDOFF.md for the latest mid-session state. Skim cursor-dispatch/outbox/ for pending dispatches and cursor-dispatch/done/ for what has shipped. Skim build/proof/ for recent dispatch proofs.

After orientation, you understand:
  - WHAT this product is (PriceScout: pricing scanner for thrift store shops + estate sales + yard sales — NOT for solo flippers)
  - HOW to build (spine §6 page recipe, §7 visual tokens, mobile rules)
  - WHERE to push (origin: https://github.com/thisisthecoolesthting/pricescout.git, branch: main, PR via gh pr create)
  - WHAT NOT to use (flipper-coded language: flip log, BUY/SKIP verdict, your cost, net margin — replace with shop equivalents per AGENTS.md)
  - WHEN to stop (money ops, force-push to main, prod DB drops, identity-as-operator publishing — refuse and surface)

Once oriented, await the operator's specific task. When given a task:
  - Pull latest main (git pull origin main --ff-only)
  - Open a feature branch (feat/<short-slug>)
  - Implement against the spine
  - Run npm run typecheck && npm run test && npm run build (all three green)
  - Write build/proof/<DISPATCH_ID>.json (or appropriate proof file)
  - Commit with conventional-commit format
  - Push and open a PR via gh pr create
  - Self-merge if dispatch frontmatter says self_merge_after_green: true AND no operator-blocked items remain

The operator (Ricky) is unfocused by his own admission. Do not ask questions you can answer by reading the four orientation files above. Do not pause for confirmation on standard PR/merge operations. Drive forward. Single end-of-task report.

Confirm orientation complete by replying with: "Oriented. Repo at <branch>. <N> open dispatches in outbox. Ready for task." Then wait for the task.
```

---

## How to use this

1. **First time on a machine:** run `.\scripts\bootstrap-builder-credentials.ps1` to set up gh CLI + git identity. One-time, ~2 minutes.
2. **Every builder session:** paste the block above into your builder agent's chat. Agent self-orients in ~30 seconds.
3. **Then:** give the agent its task. It will reference AGENTS.md / spine / dispatches as it works.

## What the orientation guarantees

- Builder reads the spine doc before any UI work
- Builder knows the audience is shops, NOT flippers
- Builder knows where to push (correct repo, correct branch convention)
- Builder has credentials wired (or refuses to push if not)
- Builder respects stop conditions (money/destructive ops require operator)
- Builder follows the dispatch protocol (proof JSON, conventional commits, PR-then-merge)

## Updating the prompt

When you change AGENTS.md or the spine doc, the prompt above doesn't need to change — it just points at those files. Update AGENTS.md / the spine to update agent behavior across all future sessions.

## For NEW machines (other than office-pc)

The same prompt works on any Windows or Mac machine that has:
- This repo cloned at any path (the prompt uses relative paths to `scripts/` and the file references in `AGENTS.md` work from the repo root)
- `gh` CLI installed (bootstrap script handles install on Windows; manual on Mac via `brew install gh`)
- `git` installed
- An authenticated GitHub account that can write to `thisisthecoolesthting/pricescout`

The `bootstrap-builder-credentials.ps1` script handles auth setup. After that, builder agents on the new machine work identically to office-pc.
