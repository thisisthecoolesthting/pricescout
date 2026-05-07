# Niche specs (dispatch 029)

Drop a `*.json` file into **`incoming/`** to spawn a spine-anchored site build via local Mikaela. The `scripts/dispatch_watcher.py` process moves:

- success → `done/`
- failure → `failed/` (see `_inbox_replies/` for HTTP errors)

**Do not commit** files under `incoming/`, `done/`, or `failed/` — they are gitignored operator artifacts.

See **`niche_specs/examples/spine-smoke-test.json`** for a minimal schema. Full schema is defined in dispatch **029** under `cursor-dispatch/done/` (file `029-pricescout-local-builder-claude-spine-driven.prompt.md`).
