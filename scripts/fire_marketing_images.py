#!/usr/bin/env python3
"""
Fire 3 Leonardo Flux Schnell images for the PriceScout marketing site.

Reads LEONARDO_API_KEY + LEONARDO_MODEL_ID from the repo-root .env (loaded
explicitly BEFORE importing the leonardo_client module so its module-level
DEFAULT_MODEL_ID picks up the value).

Saves to apps/thrift-store-scanner/public/images/.

Usage (from repo root):
    python apps/thrift-store-scanner/scripts/fire_marketing_images.py
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

# Force stdout/stderr to UTF-8 so error messages with arrows etc. don't crash on Windows cp1252.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

APP_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = Path(__file__).resolve().parents[3]


def safe_print(s: str) -> None:
    try:
        print(s)
    except UnicodeEncodeError:
        print(s.encode("ascii", "replace").decode("ascii"))


def _load_env(path: Path) -> None:
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    if text.startswith("﻿"):
        text = text[1:]
    for line in text.splitlines():
        t = line.strip()
        if not t or t.startswith("#") or "=" not in t:
            continue
        k, _, v = t.partition("=")
        k = k.strip()
        v = v.strip()
        if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
            v = v[1:-1]
        if k and k not in os.environ:
            os.environ[k] = v


# 1) Load .env BEFORE importing leonardo_client (its module-level DEFAULT_MODEL_ID
#    captures os.environ once at import).
_load_env(REPO_ROOT / ".env")

# 2) Now import + use.
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from control.leonardo_client import LeonardoError, generate_one  # noqa: E402

API_KEY = os.environ.get("LEONARDO_API_KEY", "").strip()
MODEL_ID = os.environ.get("LEONARDO_MODEL_ID", "").strip()
if not API_KEY:
    safe_print("ERROR: LEONARDO_API_KEY not in env after loading .env")
    sys.exit(2)
if not MODEL_ID:
    safe_print("ERROR: LEONARDO_MODEL_ID not in env after loading .env")
    sys.exit(2)

OUT_DIR = APP_ROOT / "public" / "images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

NEG = (
    "text, words, letters, logos, watermarks, people faces, hands holding text, "
    "low quality, blurry, cartoon, illustration, distorted phone shape"
)

JOBS = [
    {
        "name": "hero-phone-mockup",
        "prompt": (
            "modern minimalist smartphone mockup floating in soft mint-green and white "
            "gradient background, photorealistic, clean 3D perspective, the phone screen "
            "displays a polished mobile app interface with a green BUY verdict badge in "
            "the top right, rounded card showing an identified vintage glass casserole "
            "dish with comp price 28 dollars and net profit 19 dollars, subtle drop shadow under the "
            "phone, no text overlay outside the phone, premium product photography, "
            "soft studio lighting, mint green accent color"
        ),
        "width": 768,
        "height": 1024,
    },
    {
        "name": "scan-flow",
        "prompt": (
            "photorealistic close-up of a hand holding a modern smartphone over a vintage "
            "glass casserole dish resting on a worn wooden thrift store shelf, soft warm "
            "natural window light from the side, the phone screen partially visible "
            "showing a clean app camera viewfinder with mint-green UI accents, lifestyle "
            "product photography, shallow depth of field, blurred background of more "
            "thrift items behind, no faces, no text, premium magazine style"
        ),
        "width": 768,
        "height": 1024,
    },
    {
        "name": "app-interface",
        "prompt": (
            "close-up photorealistic smartphone screen mockup against a dark slate "
            "navy background, the screen shows a polished thrift-flip app interface "
            "with mint-green accent buttons, an identified vintage Levi's denim jacket "
            "card at the top, a row of resale comp prices below, a green BUY pill "
            "badge, and a save-to-flip-log button at the bottom, premium UI design, "
            "subtle drop shadow, clean rounded corners, no text outside the screen"
        ),
        "width": 768,
        "height": 1024,
    },
]


def main() -> int:
    safe_print(f"out_dir: {OUT_DIR}")
    safe_print(f"model_id: {MODEL_ID[:8]}...{MODEL_ID[-4:] if len(MODEL_ID) > 12 else ''}")
    failed = 0
    for j in JOBS:
        out = OUT_DIR / f"{j['name']}.jpg"
        if out.exists():
            safe_print(f"  SKIP exists: {out.name}")
            continue
        safe_print(f"  firing: {j['name']} -> {out.name}")
        try:
            generate_one(
                j["prompt"],
                out,
                model_id=MODEL_ID,
                width=j["width"],
                height=j["height"],
                negative_prompt=NEG,
            )
            safe_print(f"    OK saved {out}")
        except LeonardoError as e:
            safe_print(f"    FAIL: {str(e)[:300]}")
            failed += 1
        except Exception as e:
            safe_print(f"    EXC: {type(e).__name__}: {str(e)[:300]}")
            failed += 1
    safe_print(f"done. failures: {failed}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
