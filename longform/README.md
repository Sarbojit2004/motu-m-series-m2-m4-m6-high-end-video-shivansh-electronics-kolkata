# MOTU M-Series (M2 · M4 · M6) — 298-second landscape long-form

A Remotion project producing a **1920 × 1080, 30 fps, 8,940-frame (298.000 s)** light-background
long-form video for the MOTU M2, M4 and M6 audio interfaces, plus a matching landscape thumbnail,
a timed voiceover script, and the two standalone audio deliverables.

**Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces
for East and North East India.**

---

## The claim everything else serves

The M2, M4 and M6 share a **verified-identical** audio engine — the same ESS Sabre32 Ultra™ DAC,
the same 120 dB dynamic range, the same −129 dBu EIN preamps, the same 2.5 ms round-trip latency,
the same 24-bit/192 kHz, the same 160 × 120 full-colour LCD, the same loopback. They differ only in
simultaneous channel count and in physical workflow controls.

So this is a **horizontal continuum of capacity, not a vertical ladder of quality**, and the
structure is built to make that unmistakable: Chapter 2 establishes the shared engine *before* any
single product gets a segment, so the fidelity claim is made once and never has to be re-proved,
and the product order is M2 → M4 → M6 so the flagship engine is introduced on the *smallest* unit.

Source: the client's *MOTU M-Series Video Brief* verified specification table, independently
corroborated against MOTU's own M6 press material and independent reviews.

> **One correction to the brief.** It places the M6's four combo inputs on the *front* panel. The
> supplied product photography (`MOTU M6 (2).png`, the rear panel) shows all four MIC/LINE/GUITAR
> combo jacks on the **rear**, and independent reviews agree. The accurate placement is used — and it
> is a better story: same desktop footprint, twice the preamps.

---

## Quick start

```bash
npm install
npm run setup      # stage assets into public/ and synthesize the four new SFX
npm run verify     # typecheck + content guard + coverage + branding + VO + audio
npm run render     # -> out/motu-m-series-longform.mp4
```

| Command | What it does |
|---|---|
| `npm run setup` | `copy-assets` + `make-sfx`. Required once before any render. |
| `npm run studio` | Remotion Studio for interactive review. |
| `npm run verify` | The full pre-render gate (see below). |
| `npm run qa` | Renders one still per beat to `out/qa/`. Add beat ids to limit it. |
| `npm run render` | The 298 s master. |
| `npm run render:thumb` | `out/thumbnail-motu-m-series-longform.png` (1920 × 1080). |
| `npm run render:audio` | Both standalone audio deliverables. |
| `npm run make-zip` | The self-contained project zip. |

### Chromium

Remotion normally downloads its own Chrome Headless Shell on first render. If that host is not
reachable, point it at a local Chromium:

```bash
export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-or-headless_shell
```

`remotion.config.ts` and `scripts/browser.mjs` already probe the common locations.

---

## The verification gate

`npm run verify` runs six checks, all against the **same `src/schedule.ts` that renders the
picture**, so none of them can drift from what is on screen:

| Check | What it fails on |
|---|---|
| `typecheck` | Any type error. |
| `guard` | Any other audio-interface brand; any TASCAM mention; a price that is not one of the three exact MOPs; blended / rounded / "starting from" price language; a drifted distributor designation; a runtime that misses 8,940 frames; a beat longer than 5% of runtime. |
| `coverage` | Any curated image that is never placed, or any beat referencing an image outside the selection. Writes `ASSET_COVERAGE.md`. |
| `branding` | A Shivansh gap over the 24 s guideline, or MOTU not being noticeably less frequent. Writes `BRANDING_CADENCE.md`. |
| `vo` | Any narration line that cannot be read inside its beat at ≤175 wpm. Writes the VO script. |
| `validate-audio` | Any music stem or SFX file that does not decode. |

`scripts/audio-profile.mjs <file.wav>` is the audio-only pass: it fails on silence, on clipping, and
on a bed loud enough to bury narration.

---

## Deliverables

| File | What it is |
|---|---|
| `out/motu-m-series-longform.mp4` | The master. 1920 × 1080, 30 fps, 8,940 frames, audio embedded. |
| `out/thumbnail-motu-m-series-longform.png` | 1920 × 1080 landscape thumbnail. |
| `out/motu-m-series-longform-music-bed.wav` | The music bed exactly as deployed, full runtime. |
| `out/motu-m-series-longform-transition-sfx-timeline.wav` | The transition-SFX layer alone, every hit at its exact timestamp, music silent. |
| `../VO_SCRIPT_MOTU_M_SERIES_LONGFORM_298S.md` | The timestamped narration script. |
| `../dist-zip/motu-m-series-longform-project.zip` | Self-contained reproduction. |

The two WAVs are rendered from the **same schedule** as the picture, by dedicated
`MusicBedOnly` / `SfxTimelineOnly` compositions. They drop onto a timeline already in sync with the
MP4 — they are not re-timed by hand, they are the same arithmetic. Ship them so loudness can be
balanced by hand against a separately recorded voiceover.

### Adding the voiceover

Drop the read at `public/vo/voiceover-longform.mp3` and set `HAS_VOICEOVER = true` in
`src/Audio.tsx`. The bed measures roughly −30 dBFS RMS at its quietest and −19 dBFS at its loudest,
true peak −4.8 dBFS, so a voice tracked around −16 dBFS sits cleanly above it without ducking.

---

## Audio (Section 9)

**Layer 1 — music bed.** Chapter-assigned from the stems in the MOTU AVB repository's
`sound-effects/`, chosen by measured analysis of all 22 files rather than assumption. DIABLO is the
spine because it is the only complete four-stem set with enough level spread to add layers one at a
time (bass −11.7 / drums −10.0 / instruments −16.9 / melody −19.5 dB); ETERNITY, the other four-stem
set, is too compressed at −6.3 dB mean to sit under a voice. Mindscape (drumless, ambient) carries
the problem statement; Black & Blue gives Chapter 6 a deliberate colour change so Chapter 7's return
to DIABLO reads as a climax. The arrangement builds as the narrative goes M2 → M4 → M6, exactly as
the brief's Dynamic Progression section asks — measurably, from −30 dB to −19 dB.

**Layer 2 — transition/foley.** This is a genuine departure from every prior build in this
workflow, which synthesized its whole palette because none existed. **Five of the nine sounds are
the real, finished files from the AVB repository**, reused directly:

| Reused from AVB | Used for |
|---|---|
| `encoder-click` | Gain-pot detents — and **sequenced 5–7× to build a knob turn** for the M4/M6 Mix knob, rather than synthesizing a new "turn" file. |
| `talkback-click` | 48 V / MON / A-B / 3-4 button engagements. |
| `avb-ping` | Confirmation moments — spec reveals, the price lockup. |
| `data-stream` | The loopback and DC-coupled/CV diagrams. |
| `rj45-snap` | Generic connector seating in montage transitions. |

Four sounds are synthesized (`scripts/make-sfx.mjs`) because the AVB set genuinely does not cover
them: `xlr-lock` (an XLR barrel is metallic with a sprung latch; `rj45-snap` is a *plastic*
network-latch — the wrong physical object), `usbc-seat` (no rack equivalent exists), `counter-tick`
(the committed AVB five contain no short tick at all) and `panel-air` (a band-limited transition
marker, deliberately not a whoosh). All are high-passed at or above 900 Hz, matching the workflow's
character rules, and all are deterministic — the same build produces byte-identical files.

---

## What this project does NOT use

This repository contains an earlier M-Series video and reel build (`src/LongForm.tsx`,
`src/Part1.tsx`, `src/Part2.tsx`, `out/motu-mseries-*.mp4`, `thumbnails/`, and its own VO scripts).
That work is **superseded in full** and none of it is referenced here — not its scene code, not its
pacing, not its type system, not its fonts, not its audio approach. The only thing taken from it is
the confirmation of which raw assets exist in the repository.

Design values instead come from the approved **MOTU AVB Series ecosystem long-form** build: the
palette, the type system (Archivo + Fraunces), the 56 × 52 px edge padding, the technique
implementations (`Plate`, `Gimbal`, `MacroReveal`, `PortSweep`, `Drift`, `Montage`), the motion
primitives, the two-layer audio architecture, and the branding-cadence pattern. `src/theme.ts`
records the provenance of every value.
