#!/usr/bin/env python3
"""
Stage the Flick brand-assets payload.

Copies the repository's own raw MOTU images and both logos into
flick-output/brand-assets/ under semantic names, and regenerates
image-manifest.json. The copies are gitignored — they are byte-identical to the
originals already tracked at the repository root, so committing them would
duplicate 21 MB for nothing. This script is what makes them reproducible.

THE ASSET SET IS NOT CURATED. It is every genuinely unique image found in the
repository at build time: 32 raw files, of which two byte-identical pairs
collapse to one image each --

    MOTU M2 (10).jpg == MOTU M4 (3).jpg   -> shared-podcast-room
    MOTU M4 (8).jpg  == MOTU M6 (11).jpg  -> shared-software-bundle

-- leaving 30. Verified by md5, then by a full pairwise pixel comparison of all
435 remaining pairs (closest non-duplicate scored 25.52 against an 18.0
near-duplicate threshold), then by visual inspection of the closest pair.

    usage:  python3 scripts/stage-brand-assets.py [--repo <path>]
"""
import argparse, json, shutil
from pathlib import Path
from PIL import Image

# (original filename, semantic name, product, what it shows)
IMAGES = [
    ('MOTU M2 (2).png', 'm2-front-panel', 'M2',
     'front panel, straight on, transparent ground: 2 combo inputs, gain knobs, 48V, MON, full-colour LCD, monitor knob, headphone out'),
    ('MOTU M2 (9).png', 'm2-rear-panel', 'M2',
     'rear panel, straight on, transparent ground: power, MIDI in/out, USB-C, RCA monitor outs, TRS outs'),
    ('MOTU M2 (8).jpg', 'm2-hero-white', 'M2',
     'front three-quarter hero on white with reflection — the cleanest M2 product shot'),
    ('MOTU M2 (1).jpg', 'm2-desk-macbook', 'M2',
     'on a wooden desk beside a MacBook, cable plugged, warm brick background'),
    ('MOTU M2 (4).jpg', 'm2-couch-guitar', 'M2',
     'on an amp beside a laptop and hollow-body guitar, couch setting'),
    ('MOTU M2 (3).jpg', 'm2-glass-table', 'M2',
     'on a glass table, cables in, guitarist seated behind'),
    ('MOTU M2 (5).jpg', 'm2-producer-desk', 'M2',
     'producer at a brick-wall desk in headphones, monitors and keyboard around'),
    ('MOTU M2 (6).jpg', 'm2-overhead-dark', 'M2',
     'overhead of a dark desk setup, MIDI keyboard and monitors, moody blue light'),
    ('MOTU M2 (10).jpg', 'shared-podcast-room', 'SHARED',
     'wide podcast room: two mic booms, laptop, interface on the table (shared — appears under two filenames)'),
    ('MOTU M4 (1).png', 'm4-front-panel', 'M4',
     'front panel, straight on: 2 combo inputs PLUS the Input Monitor Mix knob and 3-4 button, 4-channel LCD'),
    ('MOTU M4 (2).png', 'm4-rear-panel', 'M4',
     'rear panel, straight on: MIDI, USB-C bus powered, LINE OUT 3/4, MONITOR 1/2, LINE IN 3/4'),
    ('MOTU M4 (4).jpg', 'm4-hero-white', 'M4',
     'front three-quarter hero on white with reflection — the cleanest M4 product shot'),
    ('MOTU M4 (6).jpg', 'm4-synth-top', 'M4',
     'sitting on top of a hardware synth, hands playing the keys, red shirt'),
    ('MOTU M4 (7).jpg', 'm4-desk-daw', 'M4',
     'on a desk beside a laptop running a DAW, monitor speaker, brick wall, LCD lit'),
    ('MOTU M4 (5).jpg', 'm4-drum-overhead', 'M4',
     'overhead: drummer with snare, M4 on a wooden box, iPad showing meters'),
    ('MOTU M4 (2).jpg', 'm4-outdoor-cable', 'M4',
     'close three-quarter on weathered wood with greenery, mic cable plugged in'),
    ('MOTU M4 (1).jpg', 'm4-studio-desk', 'M4',
     'studio desk with synths, monitors and rack gear, brick wall, chair'),
    ('MOTU M4 (8).jpg', 'shared-software-bundle', 'SHARED',
     'software bundle montage: Performer Lite / Ableton Live Lite / MOTU instruments (shared — appears under two filenames)'),
    ('MOTU M6 (1).png', 'm6-front-panel', 'M6',
     'front three-quarter hero: 4 gain knobs, 4x48V, 4xMON, Mix knob, A/B, MON 5-6, 6-channel LCD, TWO headphone outs'),
    ('MOTU M6 (2).png', 'm6-rear-panel', 'M6',
     'rear panel, straight on: MIDI, 15V DC, USB-C, LINE OUT 3/4 (B), MONITOR 1/2 (A), LINE IN 5/6, FOUR mic/line/guitar combo jacks'),
    ('MOTU M6 (1).jpg', 'm6-lcd-macro', 'M6',
     'macro of the LCD cluster: Input/Playback knob, A/B button, MON 5-6, meters 1-2 3-4 5-6 IN and B OUT'),
    ('MOTU M6 (10).jpg', 'm6-dark-desk', 'M6',
     'on a dark desk with laptop and headphones on a stand, moody studio, blue LED accents'),
    ('MOTU M6 (5).jpg', 'm6-podcast-panel', 'M6',
     'podcast panel: brick wall, three mic booms with headphones, laptop, M6 with cables'),
    ('MOTU M6 (4).jpg', 'm6-drum-kit-room', 'M6',
     'drum kit in a white brick room, two overhead mics, laptop on a stool'),
    ('MOTU M6 (3).jpg', 'm6-low-angle', 'M6',
     'low-angle on a dark desk beside a synth keyboard and mic, monitors behind'),
    ('MOTU M6 (9).jpg', 'm6-couch-songwriting', 'M6',
     'couch songwriting: acoustic guitar, headphones, M6 on the couch arm, mic and iPad'),
    ('MOTU M6 (8).jpg', 'm6-bright-studio', 'M6',
     'bright home studio: wooden desk, monitors, display with DAW, keyboard, guitar, amp, plants'),
    ('MOTU M6 (2).jpg', 'm6-full-setup', 'M6',
     'full home studio: laptop, boom mic, monitors, synth, MIDI pad, M6 with cables'),
    ('MOTU M6 (6).jpg', 'm6-desktop-studio', 'M6',
     'desktop studio: large display with DAW, two monitor speakers, MIDI keyboard, M6 centre'),
    ('MOTU M6 (7).jpg', 'shared-live-duo', 'SHARED',
     'live acoustic duo performing, warm bokeh lights — emotional/context frame, no product in focus'),
]

LOGOS = [
    ("MOTU LOGO.png", "motu-logo.png"),
    ("SHIVANSH ELECTRONICS LOGO FOR VIDEO.png", "shivansh-electronics-logo.png"),
]


def main() -> None:
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=str(here.parent.parent),
                    help="repository root holding the raw MOTU images")
    ap.add_argument("--out", default=str(here.parent / "flick-output" / "brand-assets"))
    args = ap.parse_args()
    repo, out = Path(args.repo), Path(args.out)

    (out / "images").mkdir(parents=True, exist_ok=True)
    (out / "logos").mkdir(parents=True, exist_ok=True)

    manifest = []
    for original, name, product, description in IMAGES:
        src = repo / original
        if not src.exists():
            raise SystemExit(f"missing source image: {src}")
        ext = src.suffix.lstrip(".").lower()
        shutil.copy2(src, out / "images" / f"{name}.{ext}")
        w, h = Image.open(src).size
        manifest.append(dict(file=f"images/{name}.{ext}", name=name, original=original,
                             product=product, w=w, h=h, ar=round(w / h, 3),
                             description=description))

    for original, name in LOGOS:
        src = repo / original
        if not src.exists():
            raise SystemExit(f"missing logo: {src}")
        shutil.copy2(src, out / "logos" / name)

    (out / "image-manifest.json").write_text(json.dumps(manifest, indent=1) + "\n")

    wide = sum(1 for m in manifest if m["ar"] >= 1.40)
    print(f"staged {len(manifest)} unique images + {len(LOGOS)} logos -> {out}")
    print(f"  wide (AR >= 1.40, need scale-and-fill): {wide}")
    print(f"  near-square (fit natively): {len(manifest) - wide}")
    if len(manifest) != 30:
        raise SystemExit(f"expected 30 unique images, staged {len(manifest)}")


if __name__ == "__main__":
    main()
