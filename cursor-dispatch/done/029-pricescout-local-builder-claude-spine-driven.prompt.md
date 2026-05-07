---
to: cursor
from: claude (DEv1 cowork)
date: 2026-04-29
priority: P1-HIGH
project: pricescout-meta
fleet: factory-infrastructure
machine: office-pc
working_dir: E:\Projects\pricescout
branch: feat/local-builder-claude-spine-driven
dispatch_id: PRICESCOUT-LOCAL-BUILDER-029
depends_on: []
blockedBy: []
parallel_safe: true
order: 29
agent: cursor
operator_blocked_on:
  - "ANTHROPIC_API_KEY in /opt/factory/.env (VPS Mikaela) AND in C:\\Users\\reasn\\.factory-agent-local\\.env (local Mikaela). Operator likely has these already from prior dispatches."
  - "GitHub PAT for git-push from Mikaela's process — `gh auth token` from operator's gh CLI cached creds will work; alternative is fine-grained PAT scoped to thisisthecoolesthting/* with Contents:write"
reply: cursor-dispatch/inbox/2026-04-29-029-pricescout-local-builder.reply.md
tools: ["read_file", "write_file", "edit_block", "bash_command", "git_operation"]
dangerously_allow_bash: true
---

# 029 — Wire Local Builder Claude with spine-anchored output + autonomous git push

## Why P1

Operator wants a Claude that lives on the builder machine, reads the SOLUTIONSTORE_SAAS_SPINE, builds new sites against it, and pushes — without operator-as-router. Most pieces already exist on office-pc; this dispatch wires them together.

After 029 ships:
- Operator drops a niche_spec.json into a watched directory
- Local Mikaela picks it up, reads the spine doc + niche spec
- Generates a complete Next 15 SaaS site (or Astro affiliate site)
- Commits + pushes to GitHub
- VPS auto-pulls + builds + serves at the configured domain
- Total operator effort: 1 file drop. Total time-to-live: ~10 min.

## Tasks

### A — Verify Local Mikaela is running

```powershell
Get-Service factory-agent-local
# Expected: Status=Running. If Stopped, start with: Start-Service factory-agent-local
# If service doesn't exist, AFFILIATE-091 didn't ship — see Task A.1 below.
```

#### A.1 (only if service is missing) — install local Mikaela

```powershell
# Mikaela source on VPS at /opt/factory/agent/. Mirror to local:
$src = "scp -r root@187.124.246.154:/opt/factory/agent C:\factory-agent-local"
& "C:\Program Files\Git\bin\bash.exe" -lc $src

# Install Python deps + write env
cd C:\factory-agent-local
python -m venv .venv
.\.venv\Scripts\activate.ps1
pip install -r requirements.txt
@"
ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY_FROM_OPERATOR_HERE
FACTORY_AGENT_TOKEN_LOCAL=$([guid]::NewGuid().ToString())
DISPATCH_MAX_USD=5.0
DISPATCH_DAILY_MAX_USD=50.0
"@ | Set-Content .env -Encoding ASCII

# Install as Windows service via NSSM
nssm install factory-agent-local "C:\factory-agent-local\.venv\Scripts\python.exe" "C:\factory-agent-local\app.py"
nssm set factory-agent-local AppDirectory "C:\factory-agent-local"
nssm set factory-agent-local AppEnvironmentExtra "PATH=C:\factory-agent-local\.venv\Scripts;%PATH%"
Start-Service factory-agent-local
```

### B — Add spine-anchoring system prompt to Mikaela

Mikaela needs to ALWAYS read the spine doc before generating a site. Edit her config:

```powershell
$mikaelaDir = "C:\factory-agent-local"  # or wherever local Mikaela lives
$systemPromptPath = "$mikaelaDir\prompts\spine-anchored-build.md"
New-Item -ItemType Directory -Force -Path "$mikaelaDir\prompts" | Out-Null

@"
# Mikaela — spine-anchored build system prompt

You are Mikaela, the local factory builder agent on office-pc.

When asked to build a new SaaS site or affiliate site, you ALWAYS read the spine architecture doc FIRST:

  E:\Projects\pricescout\docs\SOLUTIONSTORE_SAAS_SPINE.md

That doc is the canonical template. Every site you build must follow:
- §6 — six-section page recipe (Teal Hero → Problem+Who → Capabilities+How → FAQ → Related → Dark Final CTA)
- §7 — visual tokens (mint #11CB9D, ink #04342C, accent #0C5A8A, cream #FAF6E8, line #E2DCC9). NEVER introduce new colors without explicit niche_spec override.
- §8 — mobile drawer rules (sibling-mounted, no z-trap)
- §10 — auth + billing logic (Resend wrapper, magic-link auth, Stripe checkout pattern)
- §13 — Playwright + walkthrough video pipeline
- §15 — deploy pattern (pm2 stop + start --update-env, never reload)
- §16 — copy conventions (&apos; not ', no "Book a demo", consistent CTAs)

Workflow for "spawn site from niche_spec":

1. Read niche_spec.json — extract slug, domain, brand identity, audience, pricing tiers
2. Read SOLUTIONSTORE_SAAS_SPINE.md fully
3. Copy E:\Projects\pricescout\templates\ssc-site\ (or templates\saas-site\ if it exists for SaaS) to E:\Projects\<slug>\
4. Edit the template per niche_spec:
   - src/lib/brand.ts — name, palette, copy
   - src/app/page.tsx — hero text, audience cards, value props
   - prisma/schema.prisma — tenant slug, default fields
   - .env.example — DATABASE_URL placeholder, expected env vars
   - public/images/brand/<slug>-mark.svg — generate a simple brand mark
5. Run npm install + npx prisma generate + npm run build to verify
6. git init, git add -A, git commit -m "feat: bootstrap <slug> from spine"
7. gh repo create thisisthecoolesthting/<slug> --public --source . --remote origin --push
8. SSH to VPS: clone the new repo to /var/www/<slug>, set up Caddy vhost, install pm2 process, configure /etc/cron.d/<slug>-deploy, start pm2 process
9. Report back to operator with: live URL + GitHub URL + admin login (if WPBS-pattern access is enabled)

Constraints:
- ALWAYS pull latest E:\Projects\pricescout\docs\SOLUTIONSTORE_SAAS_SPINE.md before each build (the spine evolves; don't cache stale)
- NEVER deviate from the §7 visual tokens unless niche_spec.brand.palette is explicitly set
- NEVER introduce flipper-coded language ("flip log", "BUY/SKIP verdict", "your cost", "net margin") — see PriceScout's project_pricescout_audience_and_features memory file
- ALWAYS run typecheck + test + build before committing — refuse to push if any fail
- ALWAYS write a proof JSON to build/proof/SPINE-BUILD-<slug>.json with: niche_spec_path, source_sha (of spine doc at build time), build_duration_seconds, files_generated, github_url, vps_url
- ALWAYS write a runbook stub at runbooks/<slug>-DEMO_SCRIPT.md (template: copy PriceScout's runbooks/DEMO_SCRIPT.md and parameterize)

Money operations + destructive ops (force-push, rm -rf, prod DB drop, refunds, fund transfers): refuse and surface to operator. Everything else: execute.
"@ | Set-Content $systemPromptPath -Encoding UTF8
```

Update Mikaela's main loop (likely `app.py` or `agent.py`) to read this system prompt and inject it into every build task. Look for the existing `system_prompt = """..."""` block and either replace or supplement.

### C — Wire dispatch_watcher.py to feed Mikaela

The watcher already exists at `scripts/dispatch_watcher.py`. Currently has known budget-cap stall (memory `reference_dispatch_watcher_failmode.md`). Fix:

```powershell
# Bump the caps in .env
@"
DISPATCH_MAX_USD=5.0
DISPATCH_DAILY_MAX_USD=50.0
"@ | Add-Content C:\factory-agent-local\.env

# Restart the service
Restart-Service factory-agent-local
```

The watcher should:
- Poll `E:\Projects\pricescout\cursor-dispatch\outbox\*.prompt.md` every 30s
- For each file, parse YAML frontmatter
- If `agent: mikaela` (new convention) OR `agent: builder`, send to local Mikaela via POST `http://localhost:7778/task` with the file body as the message
- If `agent: cursor` or `agent: codex`, leave for Cursor/Codex to pick up (existing behavior)
- Move to `cursor-dispatch/in-progress/` on dispatch
- Move to `cursor-dispatch/done/` on success, `cursor-dispatch/failed/` on error
- Write a reply to `cursor-dispatch/inbox/` with proof JSON path

### D — Add a `spawn-site` skill / dispatch type

For one-shot site spawning, support a niche_spec watch directory:

```powershell
$watchDir = "E:\Projects\pricescout\niche_specs\incoming\"
New-Item -ItemType Directory -Force -Path $watchDir | Out-Null
```

Watcher polls this dir; any new `*.json` triggers a build dispatch with that niche_spec. The build follows the spine-anchored prompt from Task B.

niche_spec.json schema (minimum):

```json
{
  "slug": "example-shop",
  "name": "Example Shop",
  "domain": "exampleshop.com",
  "audience": "thrift store operators",
  "value_props": ["quick price", "FB Marketplace listing"],
  "brand": {
    "primary_color": "#11CB9D",
    "accent_color": "#0C5A8A"
  },
  "tiers": [
    { "slug": "week_pass", "name": "Week Pass", "price_cents": 2900, "interval": "one_time" },
    { "slug": "pro_monthly", "name": "Pro Monthly", "price_cents": 4900, "interval": "monthly" }
  ],
  "features": ["scanner", "tag_list", "fb_marketplace"],
  "github_owner": "thisisthecoolesthting",
  "vps_subdomain": "exampleshop"
}
```

### E — Git-push credentials for Mikaela

Mikaela's process needs git push capability. Two options:

**Option 1 (preferred): use gh CLI cached creds**
```powershell
# Mikaela invokes git via gh wrapper:
# gh repo clone thisisthecoolesthting/<slug>
# gh repo create thisisthecoolesthting/<slug> --push
# Operator already has gh authenticated (from earlier dispatches).
```

**Option 2: fine-grained PAT in env**
```powershell
# Operator creates a PAT scoped to thisisthecoolesthting/* with Contents:write + Workflows:write
# Add to Mikaela's .env: GITHUB_PAT=ghp_xxx
# Mikaela exports as GH_TOKEN before invoking gh.
```

Document Option 1 as default; Option 2 as fallback if operator doesn't want gh CLI auth on the Mikaela process.

### F — End-to-end smoke test

After 029 ships, validate with a tiny niche_spec:

```powershell
@"
{
  "slug": "spine-smoke-test",
  "name": "Spine Smoke Test",
  "domain": null,
  "audience": "test users",
  "value_props": ["it builds"],
  "brand": { "primary_color": "#11CB9D" },
  "tiers": [{ "slug": "free", "name": "Free", "price_cents": 0 }],
  "features": ["hero"],
  "github_owner": "thisisthecoolesthting",
  "vps_subdomain": null
}
"@ | Set-Content "E:\Projects\pricescout\niche_specs\incoming\spine-smoke-test.json"
```

Watcher should:
1. Pick up the file within 30s
2. Spawn the site
3. Move file to `niche_specs/done/spine-smoke-test.json`
4. Write a proof JSON
5. Report success in `cursor-dispatch/inbox/`

If the smoke test passes, the system is wired. If it fails, paste the failure log and we&apos;ll iterate.

### G — Documentation

Write `docs/LOCAL_BUILDER_CLAUDE_RUNBOOK.md` with:
- How to drop a niche_spec
- How to monitor builds (`Get-Content ... -Wait` on the agent log)
- How to retry a failed build
- How to update the spine-anchored system prompt
- Failure modes + recovery (budget cap, NSSM service stuck, gh CLI re-auth)

## Done-when

- [ ] Local Mikaela service running
- [ ] Spine-anchored system prompt installed
- [ ] dispatch_watcher.py budget caps lifted to 5/50
- [ ] niche_specs/incoming/ watch directory active
- [ ] gh CLI auth confirmed working from Mikaela&apos;s context
- [ ] Smoke test (Task F) succeeds end-to-end
- [ ] `docs/LOCAL_BUILDER_CLAUDE_RUNBOOK.md` exists
- [ ] proof JSON in `build/proof/PRICESCOUT-LOCAL-BUILDER-029.json`
- [ ] PR opened + merged

## Out of scope

- VPS Caddy vhost auto-configuration (next dispatch — currently Mikaela can spawn the repo but operator runs the Caddy block manually)
- Multi-tenant sandbox isolation (each spawned site gets its own repo + DB; no shared infrastructure beyond the build runner)
- Voice/CLI interface to Mikaela (just file-based niche_specs for now)
- Auto-domain registration via Porkbun API (operator drops domain pre-purchased; Mikaela uses it)
- Marketing copy generation beyond the niche_spec inputs (defer to a follow-up where Claude writes hero copy etc — this dispatch ships the SCAFFOLD, copy is added separately)
