# MOTU M-Series (M2 · M4 · M6) — 178-second portrait short

A Remotion project producing a **1080 × 1920, 30 fps, 5,340-frame (178.000 s)** light-background
portrait video for the MOTU M2, M4 and M6 audio interfaces, plus a matching portrait thumbnail,
a timed voiceover script, and the two standalone audio deliverables.

**Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces
for East and North East India.**

This is a **standalone short — not part of a series, and not the 298 s landscape video resized.**
It has its own beat structure, its own music deployment and its own pacing.

> **Full 30-image build.** This reel carries **every one of the 30 unique images** in the repository —
> the 27 the landscape video used, plus the 3 that earlier builds had excluded. Nothing is left out
> on a curation judgment, and nothing is cropped to make it fit. See *The 30-image target* below.

---

## How it differs from the landscape deliverable

Both videos share a factual and visual identity — the same verified specifications, the same
palette, the same type system, the same technique vocabulary, the same three MOPs. Everything
below is genuinely different.

| | Landscape (298 s) | Portrait (178 s) |
|---|---|---|
| Canvas | 1920 × 1080 | 1080 × 1920 |
| Padding rule | 56 × 52 px inboard (AVB long-form) | caption-safe zone: top 180 / bottom 220 / sides 64 (AVB reels) |
| Structure | 7 chapters, 42 beats | 7 segments, 34 beats |
| Cadence | 7.10 s average | **5.24 s average** — measurably faster, enforced by `npm run guard` |
| Opening | Problem chapter resolves into the thesis over 40 s | Hook and thesis **fuse**; the claim lands by 0:13 |
| Images | 27 selected | **all 30** — the 27, plus 3 reinstated |
| Music | Chapter-assigned across 3 tracks | **One continuous DIABLO deployment** |
| Layout | Two-column splits | Vertical stacks: copy above, media below |
| Contact panel | Its own beat | Cut — its detail rides on the outro card |

## The 30-image target

Fixed and named, not derived. **27 + 3 = 30**, verified against the repository before any code was
written:

- The **27** the 298 s landscape video actually used — read from that build's own committed
  `../longform/ASSET_COVERAGE.md`, not re-guessed.
- Plus the **3** that both prior builds had excluded, now reinstated. Each is verified distinct
  (md5 + dimensions) from the image that superseded it, and appears **alongside** it:

| Reinstated | Appears alongside |
|---|---|
| `m2Alt` — MOTU M2 (5).jpg, 1000×873 | `m2Glass` — MOTU M2 (3).jpg, 1442×873 |
| `m4Alt` — MOTU M4 (1).jpg, 1442×873 | `m4Desk` — MOTU M4 (7).jpg, 2880×1516 |
| `m6Alt` — MOTU M6 (6).jpg, 2821×1529 | `m6Bright` — MOTU M6 (8).jpg, 3000×2101 |

The repository holds 32 raw files. The two not in the target — `MOTU M4 (3).jpg` and
`MOTU M6 (11).jpg` — are re-confirmed byte-identical to `shRoom` and `shSoftware`. They stay
collapsed; counting them separately would inflate the target to 32 and undo a correct earlier audit.

## FIT + FILL — how the wide images fit a tall frame without being cropped

19 of the 30 are landscape-oriented (AR 1.40–3.45). Dropped into a 1080×1920 frame they either
letterbox to an unreadable sliver or have to be cropped. **Neither happens.**

The complete image is scaled to the binding dimension — width — and shown whole (`object-fit:
contain`), never cut. The height that remains is filled with a heavily blurred, dimmed copy of the
*same image*, so the surround is a colour field pulled from the picture's own palette. At 46 px blur
under a paper wash it reads as field, not as a second copy; the complete image is unmistakably the
subject. A restrained Gimbal rides it so a wide establishing shot still breathes.

| `fit` | count | treatment |
|---|---|---|
| `plate` | 6 | Panel plates, AR 3.26–4.41 — MacroReveal / PortSweep, built for that shape |
| `fill` | 19 | AR ≥ 1.40 — scale-complete-to-width plus field |
| `native` | 5 | AR ≤ 1.35 — fits the frame unaided |

> On the threshold: the ten wide images were described as "roughly 1.7–2.9". Measured, three of them
> are 1.43–1.44 (`m6Studio`, `m6Bright`, `m6Dark`). The list of ten is right; the band is not. The
> threshold is set at **1.40**, which covers all ten *and* nine more that need identical help.

## Carrying 30 images in 178 s

76 % more images than the previous build, in the same runtime. Cutting faster alone would read as
rushed, so the cutting *system* changed:

- **Multi-image beats carry the density.** Four rapid triptychs, two rapid pairs and one stacked duo
  place 16 of the 30 images inside 7 beats — each image still complete and uncropped, each beat
  unified by one point. Holds cross-dissolve rather than cut, so a 2 s hold reads as momentum.
- **Macro-to-Full-Reveal is rationed to exactly three** — `m2Front`, `m4Front`, `m6Front`. They are
  the only three shot at matching angle and scale, and the whole thesis rests on them. `npm run
  guard` fails the build if that count changes.
- **Seven entrance styles** rotate across the 34 beats (`cut`, `dissolve`, `wipeUp`, `scaleIn`,
  `slide`, `sweep`, `rise`). At this beat count a single repeated entrance becomes *the* pattern of
  the piece; the guard fails if any style exceeds 28 % of beats.

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
- **Target set** — fails unless exactly 30 distinct images are present, the 2 collapsed duplicates
  are not double-counted, all 3 reinstated images appear alongside what superseded them, all 10
  named wide images are placed and classified `fill`, and every image appears in at least one beat.
- **Transition variety** — fails if fewer than 5 entrance styles are used, if one style carries more
  than 28 % of beats, or if Macro-to-Full-Reveal is not rationed to exactly 3.

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
