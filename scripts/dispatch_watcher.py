"""
Poll cursor-dispatch outbox + niche_specs/incoming; route builder work to local Mikaela.

Env (optional file: scripts/dispatch_watcher.env as KEY=VAL lines):
  PRICESCOUT_ROOT, MIKAELA_TASK_URL, DISPATCH_WATCHER_INTERVAL, DISPATCH_MAX_USD (doc only)

Usage:
  python scripts/dispatch_watcher.py              # loop
  python scripts/dispatch_watcher.py --once         # single poll cycle
  python scripts/dispatch_watcher.py --once --dry-run
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_dotenv_file(p: Path) -> None:
    if not p.is_file():
        return
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        k, v = k.strip(), v.strip().strip('"').strip("'")
        os.environ.setdefault(k, v)


def parse_simple_frontmatter(md: str) -> dict[str, str]:
    if not md.startswith("---"):
        return {}
    end = md.find("\n---", 3)
    if end == -1:
        return {}
    block = md[3:end]
    out: dict[str, str] = {}
    for line in block.splitlines():
        if ":" not in line:
            continue
        key, _, rest = line.partition(":")
        key = key.strip()
        rest = rest.strip()
        rest = re.sub(r"^\[(.*)\]$", r"\1", rest)
        out[key] = rest.strip('"').strip("'")
    return out


def agent_routes_to_mikaela(fm: dict[str, str]) -> bool:
    a = fm.get("agent", "cursor").lower()
    return a in ("mikaela", "builder")


def post_task(url: str, payload: dict, timeout: float = 120.0) -> tuple[int, str]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status, body
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        return e.code, err
    except urllib.error.URLError as e:
        return -1, str(e.reason)


def write_inbox_reply(root: Path, name: str, body: str) -> Path:
    inbox = root / "cursor-dispatch" / "inbox"
    inbox.mkdir(parents=True, exist_ok=True)
    path = inbox / name
    path.write_text(body, encoding="utf-8")
    return path


def process_prompt_files(root: Path, mikaela_url: str, dry_run: bool) -> int:
    outbox = root / "cursor-dispatch" / "outbox"
    prog = root / "cursor-dispatch" / "in-progress"
    done = root / "cursor-dispatch" / "done"
    failed = root / "cursor-dispatch" / "failed"
    for d in (prog, done, failed):
        d.mkdir(parents=True, exist_ok=True)

    count = 0
    for path in sorted(outbox.glob("*.prompt.md")):
        text = path.read_text(encoding="utf-8")
        fm = parse_simple_frontmatter(text)
        if not agent_routes_to_mikaela(fm):
            continue
        count += 1
        payload = {
            "kind": "dispatch_prompt",
            "source_path": str(path),
            "frontmatter": fm,
            "body": text,
        }
        if dry_run:
            print(f"[dry-run] would POST dispatch_prompt {path.name}")
            continue
        dest_ip = prog / path.name
        shutil.move(str(path), dest_ip)
        payload["source_path"] = str(dest_ip)
        code, resp = post_task(mikaela_url, payload)
        if code == 200 or code == 204:
            shutil.move(str(dest_ip), done / dest_ip.name)
            write_inbox_reply(
                root,
                f"{datetime.now(timezone.utc).strftime('%Y-%m-%d')}-029-watcher-{path.stem}.reply.md",
                f"# Watcher OK\n\n- File: `{path.name}`\n- Mikaela HTTP: `{code}`\n\n```\n{resp[:4000]}\n```\n",
            )
        else:
            shutil.move(str(dest_ip), failed / dest_ip.name)
            write_inbox_reply(
                root,
                f"{datetime.now(timezone.utc).strftime('%Y-%m-%d')}-029-watcher-FAIL-{path.stem}.reply.md",
                f"# Watcher FAIL\n\n- File: `{path.name}`\n- HTTP: `{code}`\n\n```\n{resp[:8000]}\n```\n",
            )
    return count


def process_niche_specs(root: Path, mikaela_url: str, dry_run: bool) -> int:
    incoming = root / "niche_specs" / "incoming"
    ndone = root / "niche_specs" / "done"
    nfailed = root / "niche_specs" / "failed"
    inbox = root / "niche_specs" / "_inbox_replies"
    for d in (incoming, ndone, nfailed, inbox):
        d.mkdir(parents=True, exist_ok=True)

    count = 0
    for path in sorted(incoming.glob("*.json")):
        count += 1
        raw = path.read_text(encoding="utf-8")
        try:
            spec = json.loads(raw)
        except json.JSONDecodeError as e:
            dest = nfailed / path.name
            shutil.move(str(path), dest)
            (inbox / f"{path.name}.error.txt").write_text(f"Invalid JSON: {e}", encoding="utf-8")
            continue
        payload = {
            "kind": "niche_spec",
            "source_path": str(path),
            "spec": spec,
        }
        if dry_run:
            print(f"[dry-run] would POST niche_spec {path.name}")
            continue
        code, resp = post_task(mikaela_url, payload, timeout=300.0)
        if code == 200 or code == 204:
            dest = ndone / path.name
            shutil.move(str(path), dest)
            proof_hint = {
                "niche_spec": path.name,
                "mikaela_http_status": code,
                "note": "Mikaela should write build/proof/SPINE-BUILD-<slug>.json in spawned repo",
            }
            (inbox / f"{path.name}.ok.json").write_text(
                json.dumps(proof_hint, indent=2),
                encoding="utf-8",
            )
        else:
            dest = nfailed / path.name
            shutil.move(str(path), dest)
            (inbox / f"{path.name}.fail.txt").write_text(f"HTTP {code}\n{resp}", encoding="utf-8")
    return count


def cycle(root: Path, mikaela_url: str, dry_run: bool) -> None:
    process_prompt_files(root, mikaela_url, dry_run)
    process_niche_specs(root, mikaela_url, dry_run)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--once", action="store_true", help="Single poll cycle then exit")
    ap.add_argument("--dry-run", action="store_true", help="Do not POST or move niche_specs")
    args = ap.parse_args()

    root = repo_root()
    env_path = root / "scripts" / "dispatch_watcher.env"
    load_dotenv_file(env_path)

    root = Path(os.environ.get("PRICESCOUT_ROOT", str(root))).resolve()
    mikaela_url = os.environ.get("MIKAELA_TASK_URL", "http://127.0.0.1:7778/task").rstrip("/")
    if not mikaela_url.endswith("task"):
        mikaela_url = f"{mikaela_url}/task"

    interval = int(os.environ.get("DISPATCH_WATCHER_INTERVAL", "30"))

    print(f"[dispatch_watcher] PRICESCOUT_ROOT={root}")
    print(f"[dispatch_watcher] MIKAELA_TASK_URL={mikaela_url} dry_run={args.dry_run}")

    while True:
        cycle(root, mikaela_url, args.dry_run)
        if args.once:
            break
        time.sleep(interval)
    return 0


if __name__ == "__main__":
    sys.exit(main())
