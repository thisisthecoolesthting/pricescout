# Local Builder Claude (Mikaela) — runbook

Dispatch **029** wires PriceScout’s **SolutionStore spine** (`docs/SOLUTIONSTORE_SAAS_SPINE.md`) into the local factory agent on **office-pc**, with file-based triggers and autonomous `git push` (via `gh`).

## Architecture

| Piece | Role |
|--------|------|
| `docs/builder/spine-anchored-build.md` | Canonical system prompt (synced into Mikaela `prompts/`) |
| `scripts/dispatch_watcher.py` | Polls `cursor-dispatch/outbox/` + `niche_specs/incoming/`, POSTs to Mikaela |
| Local Mikaela | HTTP `POST /task` (default `http://127.0.0.1:7778/task`), runs Claude against repo + spine |
| `gh` CLI | Repo create / push (must be available to the **same Windows user** as the service, or use `GH_TOKEN`) |

## One-time setup

### 1. Local Mikaela service (`factory-agent-local`)

```powershell
Get-Service factory-agent-local
```

- **Running** — good.
- **Missing** — mirror agent from VPS and install per dispatch **029** Task A.1 (`scp` to `C:\factory-agent-local`, venv, `pip install`, NSSM).
- **Stopped** — check NSSM executable path; confirm `C:\factory-agent-local\app.py` exists. `Start-Service factory-agent-local`.

**ANTHROPIC_API_KEY** must be set for the agent process, e.g. in:

`C:\factory-agent-local\.env`

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
DISPATCH_MAX_USD=5.0
DISPATCH_DAILY_MAX_USD=50.0
```

If this file is missing or the key is empty, builds are **operator-blocked** until you add it.

### 2. Spine prompt sync

From PriceScout:

```powershell
cd E:\Projects\pricescout
.\scripts\sync-mikaela-spine-prompt.ps1 -MikaelaRoot "C:\factory-agent-local"
```

Wire `app.py` to load that file — see **`docs/builder/MIKAELA_APP_INTEGRATION.md`**.

### 3. GitHub push credentials

**Preferred:** Log in once as the operator:

```powershell
gh auth login
```

In **NSSM** → *Log on* → use that **same user account** for `factory-agent-local` so the service inherits the credential store / keyring.

**Fallback:** Fine-grained PAT (`repo` scope) → NSSM *Environment* → `GH_TOKEN=ghp_...`

Verify:

```powershell
gh auth status
```

### 4. Watcher environment (optional)

Copy `scripts/dispatch_watcher.env.example` → `scripts/dispatch_watcher.env` and adjust paths.

## Day-to-day operation

### Drop a niche spec

1. Copy `niche_specs/examples/spine-smoke-test.json` to `niche_specs/incoming/<slug>.json`.
2. Ensure `python scripts/dispatch_watcher.py` is running (or run as a scheduled task / NSSM second service).
3. Within ~30s the watcher POSTs `kind: "niche_spec"` to Mikaela.
4. On success the file moves to `niche_specs/done/`; on failure to `niche_specs/failed/` and a note appears under `niche_specs/_inbox_replies/`.

### Dispatch prompts for Mikaela

In a prompt’s YAML frontmatter set:

```yaml
agent: mikaela
```

or

```yaml
agent: builder
```

Place the file in `cursor-dispatch/outbox/`. Cursor/Codex prompts keep `agent: cursor` (default) and are ignored by the watcher.

### Monitor builds

- Mikaela / agent log (location depends on install; often next to `app.py` or NSSM stdout redirect).
- Watcher: run in a console or redirect stdout to a file.
- `niche_specs/_inbox_replies/` for quick HTTP / JSON errors.

### NPM command

```bash
npm run dispatch-watcher
```

Single poll (smoke):

```bash
python scripts/dispatch_watcher.py --once
```

Dry-run (no POST, no moves for prompts; niche_specs still skipped for moves on dry-run — use to list routing):

```bash
python scripts/dispatch_watcher.py --once --dry-run
```

## Retry a failed build

1. Read `niche_specs/failed/<file>.json` and `niche_specs/_inbox_replies/<file>.fail.txt`.
2. Fix Mikaela / network / `gh` auth.
3. Copy the JSON back to `niche_specs/incoming/`.

## Update the spine-anchored prompt

Edit **`docs/builder/spine-anchored-build.md`** in git, merge to `main`, then re-run `sync-mikaela-spine-prompt.ps1` and restart the service:

```powershell
Restart-Service factory-agent-local
```

## Failure modes

| Symptom | Recovery |
|---------|-----------|
| Budget cap stall | Raise `DISPATCH_MAX_USD` / `DISPATCH_DAILY_MAX_USD` in `C:\factory-agent-local\.env`; restart service |
| NSSM service stuck Stopped | Fix binary path in `nssm edit factory-agent-local`; check Windows Event Viewer |
| `gh` push fails from service | Run service as operator user **or** set `GH_TOKEN` in NSSM environment |
| Connection refused `127.0.0.1:7778` | Start Mikaela HTTP server; confirm port in `MIKAELA_TASK_URL` |
| Watcher moves prompts to `failed/` | Read `cursor-dispatch/inbox/*-029-watcher-FAIL*.reply.md` |

## Out of scope (029)

VPS Caddy + pm2 for spawned sites may still be manual until a follow-up dispatch automates it.
