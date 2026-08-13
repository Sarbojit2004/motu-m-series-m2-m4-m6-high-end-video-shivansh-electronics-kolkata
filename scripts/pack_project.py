#!/usr/bin/env python3
"""Packs a self-contained, reproducible project archive.

The archive is the safety-net deliverable: unzip, `npm install`, `npm run
render:lf`, and the same 298-second file comes out — no regeneration step and
no network fetch required. So it ships the derived `public/` tree (images,
synthesised audio, vendored fonts, plate-stripped logos) rather than only the
recipes for them.

Excluded: node_modules (restored by npm install), out/ and frames/ (render
output), .git, and the 34 raw source media files — public/img already holds
the deduplicated, downscaled copies the scenes actually reference, so shipping
the originals as well would roughly double the archive for nothing. The
scripts that rebuild everything from those originals are still included, and
the README explains how to point them at the source media if wanted.

    python3 scripts/pack_project.py
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAME = "motu-mseries-video-project.zip"
OUT = os.path.join(ROOT, "dist-zip", NAME)

INCLUDE_DIRS = ["src", "scripts", "public"]
INCLUDE_FILES = [
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "remotion.config.ts",
    "README.md",
    "VO_SCRIPT_LONGFORM.md",
    "VO_SCRIPT_REEL_PART1_ENGINE.md",
    "VO_SCRIPT_REEL_PART2_SCALEUP.md",
    "MOTU_M_SERIES_CREATIVE_BRIEF.md",
]
SKIP_PARTS = {"node_modules", ".git", "__pycache__", ".DS_Store"}


def keep(path: str) -> bool:
    parts = set(path.split(os.sep))
    return not (parts & SKIP_PARTS)


def main() -> int:
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    n = 0
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for d in INCLUDE_DIRS:
            base = os.path.join(ROOT, d)
            if not os.path.isdir(base):
                continue
            for dirpath, dirnames, filenames in os.walk(base):
                dirnames[:] = [x for x in dirnames if x not in SKIP_PARTS]
                for fn in filenames:
                    p = os.path.join(dirpath, fn)
                    rel = os.path.relpath(p, ROOT)
                    if not keep(rel):
                        continue
                    z.write(p, rel)
                    n += 1
        for f in INCLUDE_FILES:
            p = os.path.join(ROOT, f)
            if os.path.exists(p):
                z.write(p, f)
                n += 1

    mb = os.path.getsize(OUT) / 1e6
    print(f"  files : {n}")
    print(f"  size  : {mb:.1f} MB")
    print(f"  wrote : {os.path.relpath(OUT, ROOT)}")
    if mb > 95:
        print("\n  ! over GitHub's 100 MB per-file limit — trim before committing")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
