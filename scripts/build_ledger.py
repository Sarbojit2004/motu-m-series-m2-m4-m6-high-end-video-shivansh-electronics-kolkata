#!/usr/bin/env python3
"""Builds src/lib/ledger.json — the auditable record behind compulsory coverage.

The repository holds 34 media files: 2 logo files plus 32 product/context
images. Two pairs inside those 32 are BYTE-IDENTICAL duplicates:

    MOTU M4 (3).jpg   is md5-identical to  MOTU M2 (10).jpg   (podcast room)
    MOTU M6 (11).jpg  is md5-identical to  MOTU M4 (8).jpg    (software bundle)

so there are 32 coverage-relevant FILENAMES but only 30 DISTINCT images. Each
duplicate pair is merged into one ledger entry carrying both filenames, and
covering that entry covers both names — the images are the same pixels, so
there is nothing additional to show.

The two logo files get `part: 0` and no slug. They are never copied into
public/img, so they physically cannot appear in a reel as an overlay (prompt
Section 4a), and they are exempt from the coverage requirement. This says
nothing about logos already printed on hardware inside a photograph — those are
part of the photograph and are left exactly as supplied.

Every entry also records the source's true pixel WIDTH and HEIGHT. Layout code
uses those to size each box to the image's exact aspect ratio, so `contain`
fitting shows the whole photograph with no letterbox and no crop.

    python3 scripts/build_ledger.py
"""
import hashlib
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.environ.get("MOTU_MEDIA_DIR", ROOT)
OUT = os.path.join(ROOT, "src", "lib", "ledger.json")

# ---------------------------------------------------------------------------
# THE CLASSIFICATION TABLE
#
# id, filename(s), product, role, part, slug
#   part 1 -> counted toward Part 1 "The Engine"   (shared engine + M2)
#   part 2 -> counted toward Part 2 "The Scale-Up" (M4 + M6)
#   part 0 -> excluded logo
#
# `role` drives how a scene presents the asset:
#   panel     transparent ultra-wide cutout — full-width band, contain, no crop
#   product   studio product shot on white — plate, contain
#   macro     tight control-surface detail — hero plate
#   context   lifestyle / in-use photograph — hero plate, contain
#   software  the bundled-software screenshot collage
#
# An asset counted in one part may still make a brief cameo in the other (the
# Part 1 hook shows all three front panels to establish the family). Coverage
# is credited once, in the part named here.
# ---------------------------------------------------------------------------
TABLE = [
    # -- excluded logos ----------------------------------------------------
    (0, ["MOTU LOGO.png"], "brand", "logo", 0, None),
    (0, ["SHIVANSH ELECTRONICS LOGO FOR VIDEO.png"], "brand", "logo", 0, None),

    # -- PART 1 — shared engine + M2 (9 distinct) --------------------------
    (1,  ["MOTU M2 (2).png"],  "M2", "panel",   1, "m2-front-panel.png"),
    (2,  ["MOTU M2 (9).png"],  "M2", "panel",   1, "m2-rear-panel.png"),
    (3,  ["MOTU M2 (8).jpg"],  "M2", "product", 1, "m2-front-studio.jpg"),
    (4,  ["MOTU M2 (1).jpg"],  "M2", "context", 1, "m2-desk-hero.jpg"),
    (5,  ["MOTU M2 (3).jpg"],  "M2", "context", 1, "m2-guitar-tracking.jpg"),
    (6,  ["MOTU M2 (4).jpg"],  "M2", "context", 1, "m2-portable-couch.jpg"),
    (7,  ["MOTU M2 (5).jpg"],  "M2", "context", 1, "m2-producer-desk.jpg"),
    (8,  ["MOTU M2 (6).jpg"],  "M2", "context", 1, "m2-overhead-keys.jpg"),
    (9,  ["MOTU M2 (10).jpg", "MOTU M4 (3).jpg"],
                               "shared", "context", 1, "podcast-room.jpg"),

    # -- PART 2 — M4 (8 distinct) ------------------------------------------
    (10, ["MOTU M4 (1).png"],  "M4", "panel",   2, "m4-front-panel.png"),
    (11, ["MOTU M4 (2).png"],  "M4", "panel",   2, "m4-rear-panel.png"),
    (12, ["MOTU M4 (4).jpg"],  "M4", "product", 2, "m4-front-studio.jpg"),
    (13, ["MOTU M4 (1).jpg"],  "M4", "context", 2, "m4-synth-desk.jpg"),
    (14, ["MOTU M4 (2).jpg"],  "M4", "context", 2, "m4-outdoor-mic.jpg"),
    (15, ["MOTU M4 (5).jpg"],  "M4", "context", 2, "m4-drum-tracking.jpg"),
    (16, ["MOTU M4 (6).jpg"],  "M4", "context", 2, "m4-keys-player.jpg"),
    (17, ["MOTU M4 (7).jpg"],  "M4", "context", 2, "m4-monitor-desk.jpg"),

    # -- PART 2 — M6 (12 distinct) -----------------------------------------
    (18, ["MOTU M6 (1).png"],  "M6", "panel",   2, "m6-front-panel.png"),
    (19, ["MOTU M6 (2).png"],  "M6", "panel",   2, "m6-rear-panel.png"),
    (20, ["MOTU M6 (1).jpg"],  "M6", "macro",   2, "m6-control-macro.jpg"),
    (21, ["MOTU M6 (10).jpg"], "M6", "context", 2, "m6-headphone-desk.jpg"),
    (22, ["MOTU M6 (2).jpg"],  "M6", "context", 2, "m6-laptop-desk.jpg"),
    (23, ["MOTU M6 (3).jpg"],  "M6", "context", 2, "m6-synth-desk.jpg"),
    (24, ["MOTU M6 (4).jpg"],  "M6", "context", 2, "m6-drum-kit.jpg"),
    (25, ["MOTU M6 (5).jpg"],  "M6", "context", 2, "m6-podcast-panel.jpg"),
    (26, ["MOTU M6 (6).jpg"],  "M6", "context", 2, "m6-monitor-wide.jpg"),
    (27, ["MOTU M6 (7).jpg"],  "M6", "context", 2, "m6-duo-live.jpg"),
    (28, ["MOTU M6 (8).jpg"],  "M6", "context", 2, "m6-home-studio.jpg"),
    (29, ["MOTU M6 (9).jpg"],  "M6", "context", 2, "m6-guitar-couch.jpg"),

    # -- PART 2 — shared (1 distinct) --------------------------------------
    (30, ["MOTU M4 (8).jpg", "MOTU M6 (11).jpg"],
                               "shared", "software", 2, "included-software.jpg"),
]


def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()


def main() -> int:
    on_disk = sorted(
        f for f in os.listdir(MEDIA) if f.lower().endswith((".jpg", ".jpeg", ".png"))
    )
    declared = [f for row in TABLE for f in row[1]]

    print(f"media dir      : {MEDIA}")
    print(f"files on disk  : {len(on_disk)}")
    print(f"files declared : {len(declared)}")

    problems = []
    missing = [f for f in declared if f not in on_disk]
    extra = [f for f in on_disk if f not in declared]
    if missing:
        problems.append(f"declared but not on disk: {missing}")
    if extra:
        problems.append(f"on disk but not declared: {extra}")
    if len(declared) != len(set(declared)):
        problems.append("a filename is declared twice")

    # verify each merged group really is byte-identical
    for _id, files, *_ in TABLE:
        if len(files) > 1:
            digests = {md5(os.path.join(MEDIA, f)) for f in files if f in on_disk}
            if len(digests) != 1:
                problems.append(f"merge group {files} is NOT byte-identical")

    # verify no two separate ledger entries are byte-identical (a missed merge)
    reps = {}
    for _id, files, *_ in TABLE:
        f = files[0]
        if f not in on_disk:
            continue
        d = md5(os.path.join(MEDIA, f))
        if d in reps:
            problems.append(f"unmerged duplicate: {f} == {reps[d]}")
        reps[d] = f

    if problems:
        print("\n✗ LEDGER PROBLEMS")
        for p in problems:
            print(f"   {p}")
        return 1

    entries = []
    for _id, files, product, role, part, slug in TABLE:
        src = files[0]
        with Image.open(os.path.join(MEDIA, src)) as im:
            w, h = im.size
            mode = im.mode
        entries.append({
            "id": _id,
            "slug": slug,
            "part": part,
            "product": product,
            "role": role,
            "source": src,
            "merged": files[1:],
            "nRaw": len(files),
            "kind": "logo" if role == "logo" else "image",
            "w": w,
            "h": h,
            "alpha": mode in ("RGBA", "LA", "P"),
        })

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump(entries, fh, indent=1)
        fh.write("\n")

    usable = [e for e in entries if e["part"] != 0]
    p1 = [e for e in usable if e["part"] == 1]
    p2 = [e for e in usable if e["part"] == 2]
    names = sum(e["nRaw"] for e in usable)

    print("\n--- LEDGER ---------------------------------------------------")
    print(f"  raw media files          : {len(on_disk)}")
    print(f"  excluded logo files      : {len([e for e in entries if e['part'] == 0])}")
    print(f"  coverage-relevant names  : {names}")
    print(f"  distinct assets          : {len(usable)}")
    print(f"    Part 1 (engine + M2)   : {len(p1)}")
    print(f"    Part 2 (M4 + M6)       : {len(p2)}")
    for label, grp in (("M2", "M2"), ("M4", "M4"), ("M6", "M6"), ("shared", "shared")):
        n = len([e for e in usable if e["product"] == grp])
        nm = sum(e["nRaw"] for e in usable if e["product"] == grp)
        print(f"    {label:<7s}: {n:2d} distinct / {nm:2d} filenames")
    print(f"\n  wrote {os.path.relpath(OUT, ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
