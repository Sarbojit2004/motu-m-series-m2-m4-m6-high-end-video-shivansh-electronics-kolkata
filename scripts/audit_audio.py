#!/usr/bin/env python3
"""Validates every generated audio asset actually decodes and carries signal.

Per file: ffprobe reports a real duration / stereo / 48 kHz, the decoded PCM is
non-silent, peak is below clipping, and the RMS envelope actually varies (i.e.
it is not a DC blob or one held tone). The 88 s beds are additionally checked
against the frame contract and printed as a coarse RMS contour, so an energy
shape that dies halfway is visible without listening.

Also cross-checks that every cue name referenced from src/lib/sfx.ts has a
matching file on disk — the check that stops a render from silently dropping a
transition — and flags any file no scene references.

    python3 scripts/audit_audio.py
"""
import json
import os
import re
import shutil
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
VO_DIR = os.path.join(ROOT, "public", "vo")
TOL = 0.12
REEL_SECONDS = 88.0


def target_seconds(fname: str):
    """The beds and the VO slots carry the frame contract; short SFX are free."""
    stem = fname[:-4]
    if stem.startswith("music-bed-part") or stem.startswith("voiceover-reel") or stem == "ambient-reel":
        return REEL_SECONDS
    return None


def bin_for(name):
    env = os.environ.get(name.upper() + "_BIN")
    if env and os.path.exists(env):
        return env
    w = shutil.which(name)
    if w:
        return w
    pkg = "@ffmpeg-installer" if name == "ffmpeg" else "@ffprobe-installer"
    p = os.path.join(ROOT, "node_modules", pkg, "linux-x64", name)
    if os.path.exists(p):
        return p
    raise SystemExit(f"{name} not found")


FFMPEG = bin_for("ffmpeg")
FFPROBE = bin_for("ffprobe")


def probe(path):
    out = subprocess.run(
        [FFPROBE, "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path],
        capture_output=True, text=True, check=True,
    ).stdout
    j = json.loads(out)
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    return {
        "dur": float(j["format"]["duration"]),
        "rate": int(a["sample_rate"]) if a else 0,
        "ch": int(a["channels"]) if a else 0,
        "codec": a["codec_name"] if a else "-",
    }


def decode(path):
    raw = subprocess.run(
        [FFMPEG, "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", "48000", "-"],
        capture_output=True, check=True,
    ).stdout
    x = np.frombuffer(raw, dtype="<f4")
    return x.reshape(-1, 2) if len(x) % 2 == 0 else x[:-1].reshape(-1, 2)


def contour(x, buckets=26):
    mono = x.mean(1)
    n = len(mono) // buckets
    if n == 0:
        return ""
    vals = [float(np.sqrt(np.mean(mono[i * n:(i + 1) * n] ** 2))) for i in range(buckets)]
    hi = max(vals) or 1.0
    blocks = " ▁▂▃▄▅▆▇█"
    return "".join(blocks[min(8, int(v / hi * 8.4))] for v in vals)


def main():
    fails, warns, checked = [], [], 0

    for label, d, allow_silent in (
        ("SFX + BEDS", SFX_DIR, False),
        ("VO PLACEHOLDERS", VO_DIR, True),
    ):
        files = sorted(f for f in os.listdir(d) if f.endswith(".mp3"))
        print(f"\n=== {label}  ({len(files)} files in {os.path.relpath(d, ROOT)}) ===")
        for f in files:
            p = os.path.join(d, f)
            checked += 1
            try:
                m = probe(p)
                x = decode(p)
            except Exception as e:
                fails.append(f"{f}: decode failed: {e}")
                print(f"  ✗ {f:<28s} DECODE FAILED")
                continue

            peak = float(np.abs(x).max()) if len(x) else 0.0
            rms = float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.0
            silent = peak < 1e-4
            want = target_seconds(f)
            long_bed = f.startswith("music-bed") or f == "ambient-reel.mp3"

            status = "✓"
            if m["ch"] != 2 or m["rate"] != 48000:
                fails.append(f"{f}: expected stereo/48k, got {m['ch']}ch/{m['rate']}Hz")
                status = "✗"
            if silent and not allow_silent:
                fails.append(f"{f}: silent")
                status = "✗"
            if peak > 0.999:
                warns.append(f"{f}: peak {peak:.3f} may clip")
                status = "!"
            if want is not None and abs(m["dur"] - want) > TOL:
                fails.append(f"{f}: {m['dur']:.3f}s != {want}s target")
                status = "✗"
            if allow_silent and not silent:
                warns.append(f"{f}: VO placeholder is NOT silent")
                status = "!"

            # a bed that is a DC blob or one held tone would pass "non-silent"
            if long_bed:
                mono = x.mean(1)
                nb = len(mono) // 26
                vals = np.array([np.sqrt(np.mean(mono[i * nb:(i + 1) * nb] ** 2)) for i in range(26)])
                if vals.max() > 0 and vals.min() < vals.max() * 0.02:
                    fails.append(f"{f}: has a near-silent stretch")
                    status = "✗"
                if vals.std() < 1e-5:
                    fails.append(f"{f}: RMS envelope does not vary")
                    status = "✗"

            print(f"  {status} {f:<28s} {m['dur']:>7.3f}s  {m['ch']}ch/{m['rate']}  "
                  f"peak={peak:.3f} rms={rms:.4f}")
            if long_bed or (not silent and m["dur"] > 1.5):
                print(f"      {contour(x)}")

    # ---- cross-reference cue names used in code -----------------------------
    sfx_ts = os.path.join(ROOT, "src", "lib", "sfx.ts")
    print("\n=== CUE CROSS-REFERENCE (src/lib/sfx.ts) ===")
    if os.path.exists(sfx_ts):
        src = open(sfx_ts).read()
        declared = set(re.findall(r"audio/sfx/([a-z0-9\-]+)\.mp3", src))
        # bed() builds its path from a template literal, so expand that form too
        for stem in re.findall(r"audio/sfx/([a-z0-9\-]+)\$\{part\}\.mp3", src):
            declared |= {f"{stem}1", f"{stem}2"}
        on_disk = {f[:-4] for f in os.listdir(SFX_DIR) if f.endswith(".mp3")}
        missing = declared - on_disk
        unused = on_disk - declared
        print(f"  declared in code : {len(declared)}")
        print(f"  present on disk  : {len(on_disk)}")
        if missing:
            fails.append(f"cues referenced but missing on disk: {sorted(missing)}")
            print(f"  ✗ MISSING FILES : {sorted(missing)}")
        if unused:
            print(f"  · not referenced : {sorted(unused)}")
        if not missing:
            print("  ✓ every referenced cue resolves to a real file")
    else:
        print("  (src/lib/sfx.ts not written yet — skipped)")

    print(f"\n{'=' * 66}")
    print(f"checked {checked} files | {len(fails)} failures | {len(warns)} warnings")
    for w in warns:
        print(f"  ! {w}")
    for e in fails:
        print(f"  ✗ {e}")
    if not fails:
        print("\nALL AUDIO CHECKS PASSED")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
