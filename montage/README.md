# MOTU M-Series — raw-asset portrait montage reel

A 90-second, 2160×3840 (9:16, true 4K), no-voiceover montage covering the MOTU
M2, M4 and M6, built for **Shivansh Electronics, Kolkata**.

Everything on screen is made from two things: the raw MOTU product photography
already committed to this repository, and a paper/type world generated from
scratch in the style of the attached Pinterest motion-graphics reference.

```bash
cd montage
npm install
npm run bootstrap      # generate art + cut the music bed
npm run coverage       # prove all 30 distinct raw images are used
npm run render         # 2160x3840 h264 -> out/motu-mseries-montage-4k.mp4
npm run verify         # probe the delivered file
```

---

## This is a separate deliverable

It shares **no assets, copy or design language** with the thirty collage slides
produced earlier, or with this repo's 88-second reel / long-form projects. It
has its own project directory, its own type system, its own palette, its own
music edit and its own asset pipeline. Nothing is imported from `src/`,
`portrait/`, `longform/` or `flick-trial/`.

The prior collage deliverable's red/black/**yellow** palette, its
alternating-case headlines and its die-cut product cutouts are all absent here.

---

## Photography: original colour

The photographs are used **in their original colour**. The build crops each one
around a chosen focal point and gives it torn paper edges so it sits in the
collage — it does not posterise, duotone, halftone or grade the pixels. The
grain overlay is applied to the paper backdrop *underneath* the photography, so
nothing tints the products.

> This is a deliberate departure from the brief's technique #4, which asked for
> a duotone/halftone screenprint pass. The client asked for original product
> colour instead, mid-build. The screenprint machinery still exists in
> `scripts/texlib.py` (`screenprint`, `tone_map`) if it is ever wanted back.

---

## The reference's technique vocabulary, and where each one lives

| # | Technique | Implementation |
|---|-----------|----------------|
| 1 | Torn/crumpled paper backdrop + directional light streaks | `texlib.crumpled_paper` / `light_streaks` → `components/Paper.tsx` (two plates drifting at different rates, so the light keeps moving) |
| 2 | Letter-by-letter staggered reveal, alternating accent colours | `components/Type.tsx` → `GiantLine` (`step`, `alt`, per-letter tilt and drop) |
| 3 | Giant condensed display type filling real vertical space | Anton, sized from real font metrics (`src/metrics.ts`), up to 720px on the product-name reveals |
| 4 | Photo treatment | **Original colour** — see above |
| 5 | Layered rectangular colour-block title cards | `components/Type.tsx` → `TagLabel`, `components/Block.tsx` → `ColorBlock` |
| 6 | Recurring hand-drawn circle annotation | `components/Doodle.tsx` → `CircleNote`, a wobbled ellipse drawn on by stroke-dashoffset. Recurs 6× |
| 7 | Small "physical object" elements | `components/Plate.tsx` (tilted printed tiles that overshoot and settle), `Doodle.tsx` → `Star`, torn logo scraps |
| 8 | Text-free breathing beats | `quiet` layout — `m2-7` and `m6-5` |
| 9 | Hard flash-to-white as beat-drop punctuation | `components/Flash.tsx`, on every fragment cut and on all three movement changes |
| 10 | Overlapping, stacked multi-layer type | `stack` layout — two photographs plus headline plus two tags at once |

The reference is a stock template preview: its vendor watermark and its
lorem-ipsum placeholder copy are **not** reproduced. Only the technique
vocabulary and its pacing philosophy were taken.

---

## Cut to the music, not to the clock

`Leo - Ratata Video Thalapathy Vijay Anirudh Ravichander.mp3` was analysed by
spectral-flux onset detection plus a comb search over tempo and phase:

- **93.000 BPM**, first beat at **t = 0.2438s**, drift within ±0.01s across the
  whole 129s track — a programmed grid, so a straight trim stays locked.
- The reel takes **90.000s starting at t = 20.2438s** (track beat 31), so reel
  `t=0` lands exactly on a beat. No time-stretching.

Every movement change is a real section change in the track:

| Reel | Track | What the track does | What the reel does |
|------|-------|---------------------|--------------------|
| 0:00 | 20.24s | — | cold open, fragments across all three products |
| 0:06.45 | 26.69s | — | **M2** movement opens |
| 0:36.77 | 57.02s | first drop-out | **M4** movement opens |
| 0:56.13 | 76.37s | big pre-chorus drop-out | **M6** movement opens |
| 1:22.58 | 102.82s | peak chorus | close: callback fragments |
| 1:29.06 | 109.30s | the track's loudest hit | branding lockup lands |
| 1:29.69 | 109.93s | hard break | last frames play over the break |

Hold times fall out of that grid: **M2 averages 3.37s** per composition (the
most deliberate treatment, as the brief asks), **M4 2.77s**, **M6 2.94s** —
all inside the reference's 2.5–3.5s band, with M4 and M6 grouping two
photographs into one composition to fit their larger image counts.

---

## Asset coverage

`npm run coverage` hashes every `MOTU M*.jpg|png` in the repository root,
groups byte-identical files, and fails if any distinct image is missing from
the timeline.

```
raw files in repo root         32
byte-identical duplicate pairs  2   MOTU M2 (10).jpg == MOTU M4 (3).jpg
                                    MOTU M4 (8).jpg  == MOTU M6 (11).jpg
distinct images                30
catalogue entries              30   M2=9  M4=9  M6=12
compositions in the timeline   25
OK: all 30 distinct raw images appear in the reel.
```

---

## Copy

All on-screen text was written for this reel. No spec values, no paragraph
copy, no bullets — every line is a short reference or mood line.

The M-Series' positioning informs the tone without ever appearing as a spec:
the three units share one audio engine and differ in simultaneous input count
and workflow. **No product is framed as a compromise or as a fidelity upgrade.**
The bridge line between the M4 and M6 movements states the continuum outright:

> **SAME ENGINE / MORE ROOM**

and the close resolves it:

> **ONE ENGINE / THREE WAYS IN**

---

## Branding

Both marks are presented as torn scraps of the same paper as the backdrop, so
branding reads as part of the collage rather than a lockup dropped on top.

- **Cold open** — MOTU + Shivansh Electronics logo tags (mandatory)
- **Mid-reel, 0:53.55** — WhatsApp + website on the calm `SAME ENGINE / MORE
  ROOM` bridge (the one optional repeat the brief allows)
- **Close** — both logos, WhatsApp, website, `M2 · M4 · M6`

Contact details are the ones this repository already uses across every prior
deliverable. The brief asks for "WhatsApp icon + number" (singular), so the
primary line is used; `src/components/Brand.tsx` → `CONTACT` is the single
place to change it.

---

## Layout

Authored at **1080×1920** and rendered with `--scale=2` to **2160×3840**, so
type and vector work rasterise at true 4K while the layout maths stays in one
grid.

Seven composition templates keep neighbouring beats from repeating a shape:
`hero`, `band`, `plateHigh`, `plateLow`, `bleedType`, `stack`, `quiet`. Each
shot also carries a `lean` (±1) that mirrors the composition, so no two
adjacent beats lean the same way.

Headline sizes are computed at build time from advance widths read out of the
vendored woff2 faces (`scripts/gen_metrics.mjs` → `src/metrics.ts`), not
estimated — that is what keeps long lines from clipping the frame edge.
Headlines that sit over a dark photograph flip from ink to bone automatically,
driven by the `lum` measured for each crop during the art build.

---

## Files

```
montage/
├── catalog.json            every raw image: crop, focus, output size, luminance
├── src/
│   ├── beat.ts             the 93 BPM grid and the music-in point
│   ├── schedule.ts         the shot list, in beats
│   ├── theme.ts            palette and type stacks
│   ├── measure.ts          headline fitting from real font metrics
│   ├── metrics.ts          GENERATED - advance widths
│   ├── fonts-inline.ts     GENERATED - faces as data URIs
│   └── components/         Paper, Plate, Type, Block, Doodle, Flash, Brand, Scene, ColdOpen, Close
├── scripts/
│   ├── texlib.py           procedural paper, streaks, torn edges, grain
│   ├── build_assets.py     crops all 30 photographs, builds the paper world and logo tags
│   ├── build_music.mjs     cuts the 90s bed out of the RATATA track
│   ├── gen_metrics.mjs     regenerates metrics.ts + fonts-inline.ts from the fonts
│   ├── coverage.mjs        asset-coverage audit
│   ├── stills.mjs          one QA still per beat span
│   └── verify.mjs          probes the delivered mp4
└── out/                    the delivered render
```

`public/art/` and `public/audio/` are derived and gitignored — `npm run
bootstrap` rebuilds both from the repository's own source files. `public/fonts/`
**is** committed: the faces are inputs, and a render must never depend on a
network fetch.

## Rendering notes

The render needs Chrome. This environment blocks Remotion's headless-shell
download, so `remotion.config.ts` points at the Chromium in the image; override
with `REMOTION_BROWSER_EXECUTABLE` elsewhere. The fonts are inlined as data
URIs because fetching them over the dev server races across render workers at
`--concurrency > 1` and can stall a `delayRender()` for the whole render.
