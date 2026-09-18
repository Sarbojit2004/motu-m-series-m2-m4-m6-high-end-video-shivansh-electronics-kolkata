# M2, M4 and M6 — social slides

Twenty-nine editorial slides at **2160 × 2160** for the Instagram feed, in the
same design system as the TASCAM Sonicview and Model sets and the other MOTU
products. The MOTU mark sits in the branding rail.

| Folder | Product | Slides | Frames |
|---|---|---|---|
| `m2-square-2160/` | MOTU M2 | 9 | 9 |
| `m4-square-2160/` | MOTU M4 | 10 | 10 |
| `m6-square-2160/` | MOTU M6 | 10 | 13 |

**M2 has nine slides, not ten, by the rule that a product with fewer than ten
supplied frames gets one slide per frame.** Each photograph leads its own slide;
bands and plates then draw from the rest, so every frame appears several times
across a set but never twice on one slide. The verification pass checks both.

## The composition

One display line set to the full measure, a photograph punched through it, a
wide lower photograph, a figure caption beneath it, a plate register beside it,
and the branding rail on a white colophon.

Where the photograph covers the display line the buried type is brought forward
over it at 36%, per-pixel rather than per-letter: the headline is drawn twice,
the base layer staying behind the photograph at full opacity so every uncovered
part renders unchanged, and a second copy above it masked by the hero's own
alpha. The transition falls on the product's outline, not a bounding box.

## Matte handling

Only four frames in these libraries are keyable white sweeps — M2-08, M4-06 and
M6-02. M6-06 looks like a sweep and is not: the trim measured as a no-op, so it
is treated as a photo block. That check matters because the matte keys on a
white ground flooded in from the frame border, and handed a frame it cannot key
it returns the whole rectangle and *raises nothing* — `prep.py` reports the
result rather than trusting the mode.

## Rules the build holds to

- Every product photograph and both logos appear in their **original colour**,
  unmodified. Nothing is desaturated, filtered or AI-generated.
- All textures (halftone, paper grain) are generated programmatically.
- Only four informational items appear: the MOTU logo, the Shivansh Electronics
  logo, the website, and the WhatsApp icon with the three numbers.
- No social handles, email, pricing, unverified specification claims, or a
  call-to-action sentence.

Latest verification — M2 9/9, M4 10/10 and M6 10/10 exact at 2160 × 2160; every
frame placed, none twice on a slide; worst per-channel colour drift **0.80**,
**1.08** and **0.82** of 255; no prohibited content; **zero pixels altered
outside any product silhouette** by the forward text layer.

## Rebuilding

```
python3 ingest.py <repo> "MOTU M2" M2 ids_m2.json   # dedup + inventory
python3 prep.py m2                                   # mattes, trims, textures
SERIES=m2 python3 build_sq.py                        # render
SERIES=m2 python3 verify_sq.py                       # measure
```

`build_sq.py` and `verify_sq.py` are shared with every other series and select
with `SERIES=`. The renderer must launch with `--allow-file-access-from-files`:
a CSS `mask-image` is fetched as a cross-origin resource and Chromium blocks
`file://` for those, so without it the forward text layer silently never paints.
