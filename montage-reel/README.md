# MOTU M-Series Square Montage Reel — build notes

**Deliverable:** `MOTU_M_SERIES_MONTAGE_2160.mp4` — 2160×2160 (1:1), 30 fps, 90.000 s,
H.264 high / yuv420p, AAC 320 kbps. No voiceover.

**Source material:** the 30 collage slides generated earlier in this same session
(10 × MOTU M2, 10 × MOTU M4, 10 × MOTU M6). Nothing was regenerated and no new
visual asset was authored. No design language from the repository's existing
88-second-reel / 298-second long-form project was used, and none of that
project's validation scripts were run against this output.

## How "reuse, don't regenerate" was guaranteed

The collage build is deterministic, so it can be re-run and taken apart along its
own z-order instead of being redrawn. Before decomposing anything, every slide was
re-rendered and compared against the delivered PNG:

* **28 / 30 reproduce bit-for-bit** (100.0000 % of pixels, max channel delta 0).
* `M6_01` differs by mean 0.08/255 — invisible.
* `M2_10` differs because the *delivered* file captured one word of its top
  headline drawn in a fallback face before the webfont finished loading. The
  re-render draws it in the intended face. A font-loading glitch was not worth
  reproducing; flagged rather than hidden.

Two real defects were found and fixed while establishing this:

1. **Non-deterministic auto-fit.** The M2/M4 headline auto-fit measured against
   whichever font metrics happened to be live. The delivered set was measured
   against *fallback* metrics with the webfonts applied afterwards; reproducing
   that ordering deterministically is what takes those 5 slides to bit-identical.
2. **Clip-registry clearing.** The M6 bodies register their torn-paper clip paths
   when built (`slide01` does so at import). Clearing the registry afterwards
   silently stripped every torn edge — straight rectangles instead of torn paper.

## Decomposition

Each slide is split along its existing z-order into four depth planes plus
per-element sprites — no element is reordered:

| plane | z | contents |
|---|---|---|
| `bg` | ≤ 9 | torn colour zones, wedges, spray, halftone, drips |
| `mid` | 10–16 | secondary photography, scribbles, low call-outs |
| `hero` | 17–19 | hero product cut-outs |
| sprites | 20–29 | headline rows, lens prop, sticker call-outs, badge |
| `brand` | ≥ 30 | Shivansh / MOTU / website / WhatsApp block |

Recompositing the planes and sprites reproduces the flat slide to
**99.99 % within ±2/255** (mean delta 0.009); the residue is antialiasing at
sprite edges.

## Motion

* **Depth-staged parallax** — bg 0.45, mid 0.80, hero 1.26, sprites 1.10,
  brand 0.92. The background drifts slowest, the hero cut-out rides closest.
* **Gimbal camera** — six moves rotated per shot (push, pull, pushL, pushR,
  driftUp, pushTight) with a rack-focus that lands early in the shot, plus a
  two-frequency handheld drift on every plane so nothing is ever locked off.
* **Componentised type** — headline rows wipe in on a soft diagonal edge across
  the alternating-case letterforms, the two rows staggered against each other and
  distinct in timing from the call-outs.
* **Sticker call-outs** — stamped in one at a time, each with its own delay,
  scale punch and settle.
* **Branding** — settles in and carries a slow 0.6 % pulse; never static, never
  illegible, and never doubled by an added overlay (§6).
* **Grade** — the collage's own grain generator re-run at master size, drifting
  per frame, plus the same vignette.

## Music

Analysis first, edit second. Spectral-flux onset detection put the track at
**184.57 BPM** (bar = 2.6008 s) with structural breaks at **75.9 s** and
**107.8 s**. The cut map was built on that grid.

The reel is **34 bars**. Movement lengths were chosen so the product changes land
on the track's real breaks:

| segment | source bars | source time | output |
|---|---|---|---|
| cold open | 0–2 | 0.16–5.36 s | 0.000–5.294 |
| M2 | 19–29 | 49.58–75.59 s | 5.294–31.765 |
| M4 | 29–41 | 75.59–106.79 s | 31.765–63.529 |
| M6 | 41–49 | 106.79–127.60 s | 63.529–84.706 |
| close | 2–4 | 5.36–10.57 s | 84.706–90.000 |

Bars 19→49 are **one unbroken run of the track**, so the entire body of the reel
contains no music edit at all — only two splices exist, into the cold open and
out to the close, both bar-aligned with a 30 ms equal-power crossfade. A single
global `atempo` of 0.98247 maps 88.426 s of music onto exactly 90.000 s.
Mixed hot: peak 0.97, RMS −11.6 dBFS.

## Transitions

Six types rotated so no two consecutive cuts repeat: `cut`, `whip` (edge-padded
directional smear), `push` (gimbal push-through), `tear`, `punch`, `flash`.
`tear` — an animated torn-paper edge built with the same fBm generator that cut
the collage's own paper — appears at least once per product movement. The two
product-to-product changes use the colour flash, drawn from the collage palette.
