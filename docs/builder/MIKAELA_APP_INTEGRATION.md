# Mikaela `app.py` integration (dispatch 029)

The canonical spine system prompt lives in this repo:

`docs/builder/spine-anchored-build.md`

After editing, sync to the local agent (PowerShell):

```powershell
.\scripts\sync-mikaela-spine-prompt.ps1 -MikaelaRoot "C:\factory-agent-local"
```

## Inject into every build task

In `C:\factory-agent-local\app.py` (or `agent.py`), load the prompt file at startup and prepend or merge with your existing `system_prompt`:

```python
from pathlib import Path

def load_spine_system_prompt(pricescout_root: Path) -> str:
    p = pricescout_root / "docs" / "builder" / "spine-anchored-build.md"
    raw = p.read_text(encoding="utf-8")
    root_s = str(pricescout_root).replace("\\", "/")
    return raw.replace("{PRICESCOUT_ROOT}", root_s)

# Example: PRICESCOUT_ROOT = Path(os.environ.get("PRICESCOUT_ROOT", r"E:\Projects\pricescout"))
# system_prompt = load_spine_system_prompt(PRICESCOUT_ROOT) + "\n\n" + existing_task_prompt
```

Ensure the HTTP task handler (e.g. `POST /task` on port **7778**) passes this combined system prompt into the Anthropic Messages API for `kind` in (`niche_spec`, `dispatch_prompt`, `spawn_site`).

## Budget caps (fix stall)

Append to **`C:\factory-agent-local\.env`** (or the path your service uses):

```env
DISPATCH_MAX_USD=5.0
DISPATCH_DAILY_MAX_USD=50.0
```

Then: `Restart-Service factory-agent-local`

## GitHub push from the Windows service

`gh auth login` stores credentials for the **interactive user**. If NSSM runs the service as `Local System`, `gh` will not see that cache.

**Preferred:** NSSM → *Log on* → run as the operator Windows account that completed `gh auth login`.

**Fallback:** fine-grained PAT with `repo` scope → set `GH_TOKEN` in NSSM *Environment* or `AppEnvironmentExtra`.
