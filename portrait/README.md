# MOTU M-Series (M2 · M4 · M6) — 178-second portrait short

A Remotion project producing a **1080 × 1920, 30 fps, 5,340-frame (178.000 s)** light-background
portrait video for the MOTU M2, M4 and M6 audio interfaces, plus a matching portrait thumbnail,
a timed voiceover script, and the two standalone audio deliverables.

**Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces
for East and North East India.**

This is a **standalone short — not part of a series, and not the 298 s landscape video resized.**
It has its own beat structure, its own image selection, its own music deployment and its own pacing.

---

## How it differs from the landscape deliverable

Both videos share a factual and visual identity — the same verified specifications, the same
palette, the same type system, the same technique vocabulary, the same three MOPs. Everything
below is genuinely different.

| | Landscape (298 s) | Portrait (178 s) |
|---|---|---|
| Canvas | 1920 × 1080 | 1080 × 1920 |
| Padding rule | 56 × 52 px inboard (AVB long-form) | caption-safe zone: top 180 / bottom 220 / sides 64 (AVB reels) |
| Structure | 7 chapters, 42 beats | 7 segments, 30 beats |
| Cadence | 7.10 s average | **5.93 s average** — measurably faster, enforced by `npm run guard` |
| Opening | Problem chapter resolves into the thesis over 40 s | Hook and thesis **fuse**; the claim lands by 0:13 |
| Images | 27 selected | **17 selected** — its own cut, see `src/assets.ts` |
| Music | Chapter-assigned across 3 tracks | **One continuous DIABLO deployment** |
| Layout | Two-column splits | Vertical stacks: copy above, media below |
| Contact panel | Its own beat | Cut — its detail rides on the outro card |

The ten images the landscape build uses and this one drops are all wide landscape room shots
(aspect 1.7–2.9). At 1080 px wide they either letterboxed to a sliver with the product unreadable,
or would have had to be cropped — and Section 3 does not permit cropping. So they were cut from the
selection instead, which is exactly the response the brief asks for when canvas pressure collides
with the full-and-legible rule.

---

## Quick start

```bash
npm install
npm run setup      # stage assets into public/ and synthesize the four new SFX
npm run verify     # typecheck + content guard + coverage + branding + VO + audio
npm run render     # -> out/motu-m-series-portrait-short.mp4
```

If Remotion cannot reach its Chrome download host, point it at a local Chromium:

```bash
export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-or-headless_shell
```

---

## The verification gate

`npm run verify` runs the same six checks as the landscape build, against the **same
`src/schedule.ts` that renders the picture**, plus two the portrait canvas adds:

- **Caption-safe zone** — fails if `SAFE.top`/`bottom`/`marginX` drift from the AVB reel values
  (180 / 220 / 64).
- **Cadence** — fails if the average beat is not noticeably faster than the landscape cut's 7.10 s.

---

## Deliverables

| File | What it is |
|---|---|
| `out/motu-m-series-portrait-short.mp4` | The master. 1080 × 1920, 30 fps, 5,340 frames, audio embedded. |
| `out/thumbnail-motu-m-series-portrait.png` | 1080 × 1920 portrait thumbnail. |
| `out/motu-m-series-portrait-music-bed.wav` | The music bed exactly as deployed, full runtime. |
| `out/motu-m-series-portrait-transition-sfx-timeline.wav` | The transition-SFX layer alone, every hit at its exact timestamp, music silent. |
| `../VO_SCRIPT_MOTU_M_SERIES_PORTRAIT_178S.md` | The timestamped narration script. |
| `../dist-zip/motu-m-series-portrait-project.zip` | Self-contained reproduction. |

Drop the read at `public/vo/voiceover-portrait.mp3` and set `HAS_VOICEOVER = true` in
`src/Audio.tsx`.

---

## Audio (Section 9)

**Layer 1 — music bed.** A single unified **DIABLO** deployment, deliberately different from the
landscape build's chapter-hopping. DIABLO measures 170.5 s, so one pass plus a single short seam
relay covers the whole reel, giving the short a continuous musical identity. The stems still enter
progressively across the segments, so the M2 → M4 → M6 build the brief asks for is intact.

**Layer 2 — transition/foley.** The same reuse-first split as the landscape build: **five of the
nine sounds are the real, finished files from the MOTU AVB repository**, reused directly
(`encoder-click`, `talkback-click`, `avb-ping`, `data-stream`, `rj45-snap`), with `encoder-click`
sequenced 5–7× to build a knob turn rather than synthesizing a new file. Four are synthesized
because the AVB set does not cover them: `xlr-lock`, `usbc-seat`, `counter-tick`, `panel-air`.

---

## What this project does NOT use

The earlier M-Series build in this repository (`src/` at the repo root, `out/motu-mseries-*.mp4`,
`thumbnails/`) is **superseded in full** and is not referenced here in any way. Design values come
from the approved MOTU AVB Series ecosystem build; `src/theme.ts` records the provenance of each.
