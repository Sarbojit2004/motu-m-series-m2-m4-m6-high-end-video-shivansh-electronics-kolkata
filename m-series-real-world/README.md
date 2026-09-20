# MOTU M-Series — two films, one project

Two deliverables for Shivansh Electronics, rendered from one Remotion project so
that a change to the script, the shot plan or the design system lands in both.

| | Composition | Size | Length |
|---|---|---|---|
| Vertical reel | `Reel` | 2160 × 3840 | 89.87 s · 2696 frames |
| Landscape explainer | `Explainer` | 3840 × 2160 | 298.33 s · 8950 frames |
| Reel cover | `ThumbnailReel` | 2160 × 3840 | still |
| Explainer cover | `ThumbnailVideo` | 3840 × 2160 | still |

Both durations are **derived, not typed**: the script's own spoken length decides
when the narration ends, the end screen is a fixed six or ten seconds after it,
and the composition is exactly that long. Editing a caption re-times both films.

```bash
npm install
npm run assets        # rebuild the asset library + manifest from the repo
npm run timeline      # write the timeline both the audio and the picture read
npm run audio         # rebuild the beds, the cue palette and the VO placeholders
npm run coverage      # prove both films from the same data the renderer reads
npm run studio        # preview
sh scripts/render.sh Reel motu-m-series-reel 2696 344
sh scripts/pipeline.sh   # everything after: mux, explainer, covers, segments
```

## What drives what

```
src/script.ts      what is said, and when   — spoken word count sets every duration
src/shots.ts       what is shown, and when  — each shot pinned to its caption
src/films.ts       the two deliverables assembled from those two
src/Film.tsx       how it is staged, transitioned, captioned and mixed
```

There is not one hand-typed frame number in the films. `buildTimeline()` lays
every caption on an absolute timeline from how long its words take to say at
165 wpm, with a 0.4 s breath between chapters and a 0.2 s beat after a line that
closes a thought — the pacing model the AVB series and the UltraLite-mk5 / 828
films were cut to, which lands at about 156 wpm effective. `placeShots()` then
pins each shot to a caption index, so the picture changes on the word it belongs
to and a slower recorded read moves the picture with it instead of leaving it
behind.

`scripts/coverage.mjs` proves it: every frame of speech in both films carries
exactly one shot, with no overlaps and nothing shorter than twelve frames. It
exits non-zero if that stops being true, and it caught two things this build
would otherwise have shipped.

## The design system

Carried over from the AVB series and the UltraLite-mk5 / 828 films by instruction:

* the type pairing — a heavy brush script carrying **one** word per caption, a
  black geometric sans carrying the rest
* the three-tier caption lockup, split at that key word
* `TYPE_OPACITY = 0.64` — the entire typographic layer at 64%, applied once by
  the film's own type layer so nothing can drift out of step
* legibility bought back with a hard, tight drop shadow rather than a scrim,
  because a scrim would hide exactly the picture the transparency reveals
* full-bleed imagery, nothing letterboxed, no ground showing through
* gimbal camera language only — dolly, orbit, push, rack focus
* no branding of any kind until the end screen

Changed for this product:

* **The accent palette comes off the hardware.** Every hue was sampled from the
  M-Series panel renders in this repository: the colour LCD's own green and
  amber meter bars, the cyan MON buttons, the red 48V legends, the blue power
  LED, the near-black chassis. Colour means *which idea*, never *which model* —
  because the argument of both films is that the three are the same machine in
  three sizes, and colour-coding the models would contradict it.
* **No image is ever sliced.** The diagonal split used on an earlier film
  cropped two photographs to opposing triangles meeting on a seam; in practice
  each was first cropped to a sliver and then had half of that clipped away, so
  neither subject was ever fully visible. `StackBleed` replaces it and shows two
  **complete** plates — stacked in the vertical film, side by side in the
  landscape one. **No picture in either film is cropped, clipped or cut.**
* **`DetailZoom`.** The panel renders run to 2442 px wide, so a crop of one row
  of gain knobs is still sharper than the frame it lands in. That is what lets a
  shot push into the control the narration is naming — the four gain knobs while
  the voice says "four microphone preamps", the MON button while it says
  "straight to the outputs". Each region's brightness is normalised from its own
  measured luminance, so a push into the M2's near-black headphone corner and
  one into the M4's lit meter both land on a ground the overlay can hold against.

## The films' argument

The M-Series is three sizes of one machine. The converters are the same, the
preamps are the same, the round trip is the same; what changes is how many
things you can point at it. So neither film says a bigger box sounds better — it
says a bigger box holds a bigger room. That is both the honest reading of the
specification and the more useful thing for someone deciding.

`src/theme.ts` carries a `SPEC` table of the only numbers the films may state,
each checked against dealer and trade documentation before it was written into a
caption. Two things that check caught:

* the **M6's four combo inputs are on its REAR panel** — nothing plugs into its
  front, which carries the four gain knobs, the meter, the monitor knob and two
  headphone outs;
* the **input/playback Mix knob exists on the M4 and M6 but not on the M2**,
  which has the one-touch hardware monitoring without the blend.

Both were written into the B-roll prompts as well as into the script.

## The assets

`scripts/prep_assets.py` builds `public/img/` and emits `src/assets.generated.ts`
with every size measured off the file, including each picture's **content
bounding box**. Several of these are studio shots of one interface floating on
white and the hardware occupies a different fraction of each canvas, so plates
are positioned by content rather than by canvas — otherwise the product sits
somewhere different in every shot.

Two files are deliberately unused; `scripts/prep_assets.py` says which and why.

### The ten deployment clips

Generated on Kling v3.0 from Nano Banana Pro start frames built on the real
product photography in this repository — ten real-world deployments, each
carrying all three interfaces, each with people working, each a gimbal move.
`ASSETS.md` names them and maps each to its generation.

They arrive **through the repository**, because the build session's egress
policy denies `cloudfront.net`, where Higgsfield serves every result. So every
shot that wants a clip also names a still, and `clip()` returning null chooses
between them. Both films render on the product photography alone and get better
the moment the clips land — no shot has to be re-planned, and nothing is a black
hole waiting for an asset.

## The audio

The bed is **synthesised, not licensed**. The AVB series and the UltraLite-mk5 /
828 films did not use a track; they generated one — 96 BPM, a Cm / A♭ / E♭ / B♭
progression, a detuned saw pad over a sine sub, a sixteenth arpeggio that only
appears above an energy threshold, a kit that drops out where the writing needs
room, and a whole-step lift at the midpoint. `scripts/gen_audio.py` reproduces
that engine bar for bar. What differs is only the length and where the energy
zones fall, and those are read off the chapter list rather than typed — so
re-writing a chapter re-scores it.

The transition cues come from the palette cut for the Soundcraft Signature Plus
films, by instruction: 25 single events plus a four-second outro bloom. A chapter
turn gets a riser into it and an impact on it; a caption that closes a thought
gets a light tick. Nothing fires on every caption, because a cue on every line
stops being punctuation and becomes a rhythm.

Everything is mastered to one reference (−23 LUFS, EBU R128) with each cue
trimmed relative to the bed, so **every source plays at unity**. A volume
multiplier in the renderer would silently undo the mastering. Cues too short for
R128's 400 ms gate are levelled by a BS.1770 momentary window computed in the
script instead of by ffmpeg, which reports −70 for anything shorter.

### The stems

Both layers ship as standalone files in `out/` as well as inside the films, so
they can be auditioned, re-levelled or handed to an editor on their own:

| File | Length | Level |
|---|---|---|
| `…-reel-music-bed.mp3` | 89.87 s | −23.1 LUFS · peak −2.5 dBFS |
| `…-reel-transitions.flac` | 89.87 s | −26.9 LUFS · 19 cues |
| `…-explainer-music-bed.mp3` | 298.33 s | −23.1 LUFS · peak −2.9 dBFS |
| `…-explainer-transitions.flac` | 298.33 s | −28.5 LUFS · 50 cues |

The cue positions come from `scripts/timeline.json`, which is written by the
**same TypeScript the renderer imports**. A second copy of the pacing rules in
Python would agree until either copy was touched and then drift a cue off a cut
with nothing to show why.

### The narration

`public/vo/vo-reel.wav` and `vo-video.wav` are silent placeholders at exactly
each film's length. Drop the recorded narration in at those paths and re-render;
nothing else changes. Both scripts are in `src/script.ts`; `scripts/timeline.json` carries every
caption with its exact in and out point to record against.

## Delivery

The 4K masters are cut into **playable segments** rather than compressed, because
the brief asked for the uncompressed original: each segment is a standalone MP4
stream-copied from the master, so nothing is re-encoded and rejoining them is a
concatenation rather than a render. `rejoin.txt` sits beside them:

```bash
ffmpeg -f concat -safe 0 -i rejoin.txt -c copy motu-m-series-reel.mp4
```
