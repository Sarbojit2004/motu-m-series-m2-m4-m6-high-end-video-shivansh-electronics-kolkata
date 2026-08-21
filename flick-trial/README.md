# MOTU M-Series 178 s portrait reel — built with Flick

A rebuild of the 178-second MOTU M2 / M4 / M6 portrait reel using
[Flick](https://github.com/Creatorberry/flick) as the **primary build engine**
rather than hand-writing Remotion scenes. Claude Code's job here was to operate
Flick correctly, inject this project's standing rules at the exact points Flick
asks for them, and verify what Flick produced.

Branch: `TRIAL-REEL-INSTAGRAM-GITHUB-REPO`. The earlier hand-written portrait
build on `claude/motu-m-series-videos-852x51` is untouched — this is a parallel
trial, not a replacement.

---

## Deliverables

| File | What it is |
|---|---|
| `out/motu-m-series-portrait-flick-trial.mp4` | 1080 × 1920, 30 fps, **5,340 frames / 178.000 s** |
| `out/motu-m-series-portrait-flick-trial-music-bed.wav` | Full-runtime music bed, continuous, no SFX |
| `out/motu-m-series-portrait-flick-trial-transition-sfx-timeline.wav` | Full-runtime foley layer, continuous, **music-silent** |
| `out/thumbnail-motu-m-series-portrait-flick-trial.png` | 1080 × 1920 cover frame |
| `../dist-zip/motu-m-series-portrait-flick-trial-project.zip` | Reopenable project |

The master is CRF 18 and 57.8 MiB, which is over the 30 MiB limit on most chat
and messaging surfaces. `scripts/make-preview.mjs` writes compressed review
copies to `out/preview/` (1080p ~15 MiB and 720p ~7 MiB). Those are for review
only — the master is what gets published. Both assert the 5,340-frame count, so
a preview can never quietly become a different cut.
| `../VO_SCRIPT_MOTU_M_SERIES_PORTRAIT_178S.md` | Voiceover script (on this branch) |

Both WAVs run the full 178.000 s and are generated from the **same schedule**
that drives the picture, so they drop onto a timeline already in sync rather
than needing to be re-aligned by hand.

---

## How the asset set was decided

Not carried over from the previous build. The raw files in the parent repo were
enumerated fresh:

1. **32** raw image files at repo root.
2. **md5** found two byte-identical pairs — `MOTU M2 (10)` ≡ `MOTU M4 (3)`, and
   `MOTU M4 (8)` ≡ `MOTU M6 (11)`.
3. All **435** remaining pairs were then compared **pixel-wise**, not by
   filename. Nothing fell below the near-duplicate threshold; the closest pair
   (`M2 (8)` vs `M4 (4)`, distance 25.52) was **visually confirmed** to be a
   genuine M2/M4 difference — the M4 carries the Mix knob and the 3-4 button.
4. **Result: 30 genuinely unique images**, all 30 given to Flick.

That the number matches the previous build is a coincidence of the input, not
an anchor that was applied to it.

---

## The Flick pipeline, as actually run

| Flick step | What it asked for | What it was given |
|---|---|---|
| 1 — source | transcript or video link | `script-for-flick.txt`, written first, 25 timestamped lines, 454 words / 153 wpm |
| 1 — aspect / brand / opinion | ratio, brand assets, creative direction | 9:16, 30 images + 2 logos with semantic names, and `brand-assets/BRAND-GUIDE.md` |
| 2 — plan | `flick-plan.md` for approval | 25 named scenes, each with on-screen content, text, assets, sound and transition |
| 3 — build | one component + one composition per scene | `remotion/src/scenes/*.tsx`, 25 compositions in `Root.tsx` |
| 3 — render | `render-scene.mjs` per scene | `flick-output/scenes/<name>/<name>.mp4` |

`BRAND-GUIDE.md` is where this project's non-negotiables were injected, because
that is the one point in Flick's flow that accepts creative direction. It
carries the palette with contrast ratios, the type system, the caption-safe
zone, the never-crop and no-filler rules, the unboxed-logo rule (including the
`mix-blend-mode` trap), the branding cadence, the fixed MOPs, and the explicit
instruction *"Do not add background music."*

### Where Flick stops and this project starts

Flick builds **one composition per scene and deliberately no all-scenes
composition**. Concatenating the 25 renders into the single 5,340-frame master
is therefore not something Flick does — `scripts/assemble-master.mjs` does it,
and re-verifies every scene's frame count against `scene-spec.json` before
joining. Flick also has **no background music by design**, so the bed is this
project's own layer, added at master level.

The assembly takes the **picture** from the 25 scene renders and **both audio
layers from their full-runtime WAVs**, rather than lifting the foley out of the
scene files. Two reasons: scene 25 has no sound effects and therefore carries no
audio stream, which the concat demuxer cannot splice; and taking the foley from
the WAV makes the standalone SFX deliverable *literally the same samples* as the
SFX in the master, not a second rendering of the same schedule.

Frame counts are asserted with `framecrc`, which emits one line per frame. This
ffmpeg build emits no `frame=` counter under `-c copy -f null`, and the
container `time=` field omits the last frame's duration — a 150-frame file
reports `00:00:04.93` — so neither is safe for an exact-length assertion.

---

## Phase 4 — audio

Two layers, both authored at absolute master timecode in
`remotion/src/audio/`, both exported as their own composition.

**Music bed.** The approved AVB DIABLO stem deployment, re-cut into seven
movements against Flick's 25-scene structure so each still enters on a musical
point. `BED_TRIM = 0.34`, carried from the portrait build where it was measured
rather than inherited.

**Transition SFX.** Flick ships a generic bundled sound set. Five sounds were
replaced with the real finished files from the approved AVB build, because that
build had already established a branded sound for exactly that action. Six were
**kept as Flick supplied them**, because the AVB set has no equivalent —
substituting there would have been invention, not reuse.

| Flick's bundled sound | Action | Decision |
|---|---|---|
| `Click.mp3` | knob / button detent | → `avb/encoder-click.wav` |
| `Click.mp3` (scene 20) | monitor A/B toggle | → `avb/talkback-click.wav` |
| `Pop.mp3` | connector / panel arrival | → `avb/rj45-snap.wav` |
| `Correct.mp3` | spec + price confirm | → `avb/avb-ping.wav` |
| `Notification.mp3` | throughput / latency figures | → `avb/data-stream.wav` |
| `riser.mp3` | opening rise | kept (Flick's own) |
| `Impact.mp3` | problem hit | kept (Flick's own) |
| `Zoomin-OR-out.mp3` | camera push | kept (Flick's own) |
| `transitions.mp3` | montage cross | kept (Flick's own) |
| `Popups.mp3` | chips arriving | kept (Flick's own) |
| `aha-moment.MP3` | CTA reveal | kept (Flick's own) |

**32 hits total — 18 AVB-sourced, 14 Flick's own.**

`scripts/extract-hits.mjs` lifts every hit out of the 25 scene sources and
re-expresses it at master frames, so the standalone SFX WAV is generated from
the same source of truth as the foley baked into the scene renders. It cannot
drift from what you hear in the video.

---

## Rebuilding

```bash
cd flick-output/remotion && npm install && cd ../..
node scripts/extract-hits.mjs           # regenerate src/audio/hits.ts
bash scripts/render-all-scenes.sh       # 25 scenes via Flick's render-scene.mjs
bash scripts/render-audio.sh            # the two standalone WAVs
node scripts/assemble-master.mjs        # concat + mix the bed
node scripts/verify.mjs                 # Phase 3 rule checks
node scripts/make-preview.mjs           # compressed review copies (optional)
node scripts/make-zip.mjs
```

`remotion.config.ts` points at the container's pre-installed Chromium, because
Remotion's own Chrome Headless Shell download host is egress-blocked here.
