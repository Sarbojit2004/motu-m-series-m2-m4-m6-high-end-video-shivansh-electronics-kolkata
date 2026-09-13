# MOTU M-Series — 90-second full-bleed vertical reel

A Remotion project producing one 9:16 reel for the MOTU **M2 / M4 / M6** audio
interfaces, plus a portrait thumbnail, a timed voiceover script for the client
to record, and a coverage ledger proving every product image in the repository
is on screen.

**Shivansh Electronics is the Authorised Distributor of MOTU (Mark of the
Unicorn, USA) for East and North East India.**

```
canvas     2160 × 3840, 30 fps
runtime    2,700 frames = 90.000 s exactly
narration  00:00.0 – 01:23.6   (214 words, 165 wpm written / 153.6 effective)
end screen 01:23.5 – 01:30.0
output     out/motu-mseries-reel.mp4
```

---

## The five constraints this build is shaped by

Everything in here follows from five instructions, and it is worth stating them
plainly because most of the non-obvious decisions below are downstream of one of
them.

**1. The picture fills the screen; only the text is inset.** "Completely occupy
the entire screen space, leaving adequate padding top, left, right and bottom,
under one universal measurement metric." Those two halves are only compatible
one way: the *imagery* runs to all four edges with nothing letterboxed, and the
*padding* is a safe box that everything readable lives inside. That box —
`SAFE` in `src/theme.ts` — is the intersection of Instagram Reels', YouTube
Shorts' and TikTok's overlays, so one master is safe on all three without a
per-platform re-render.

```
left   132 px          right  268 px   ← wider: the vertical action rail
top    300 px          bottom 720 px   ← the caption block + comment bar
```

**2. Typography at 64% opacity.** Because the picture now reaches the edges, the
type sits *on* the product rather than beside it. The whole typographic layer is
held at `TYPE_OPACITY = 0.64` — one multiplier, applied once in `Reel.tsx`, so
the caption and the graphics next to it can never drift to different
transparencies. Legibility is bought back with a hard, tight drop shadow on
every tier rather than with a scrim, because a scrim would hide exactly the
content the transparency exists to reveal.

**3. The same type system as the AVB explainer.** Same two faces, same
three-tier lockup, same rule that the script face always lands on the word the
sentence turns on. Sized up, because type competing with a full-bleed photograph
needs more weight than type sitting on an empty ground.

**4. No branding anywhere until the end screen.** No logo, no company name, no
phone number, no website at any point in the body of the reel — all of it on the
end card, once. Branding sprinkled through a reel asks a viewer to ignore it
thirty times; branding withheld until the end arrives on a viewer who has
already decided to watch to the end.

**5. A plain read, with the anticipation in the structure.** The client records
this himself and describes himself as a plain speaker, so there is no rhetoric
in the script to perform — no superlatives, no build-up language. The hook is
carried by *form*: an open question, an answer withheld for one beat, then a
capability that widens three times. A flat, clear read lands it correctly.

---

## Quick start

```bash
npm install

npm run assets      # repo images  -> public/images/ + src/assets.ts
npm run audio       # music bed + 9 SFX cues, mastered to EBU R128
npm run plan        # print the shot plan and the coverage count
npm run script      # write ../VO_SCRIPT_MSERIES_REEL_90S.md
npm run coverage    # write ../ASSET_COVERAGE_MSERIES_REEL_90S.md

npm run studio      # preview
npm run preview     # 480p check render
npm run render      # 2160 × 3840 final
npm run thumb       # portrait thumbnail
```

---

## What drives what

There is not one hand-typed frame number in the render path. Three files, in
order, and each one derives from the one above it:

| File | Owns |
|---|---|
| `src/script.ts` | what is said. Every duration comes from a caption's **spoken** word count at 165 wpm, with `sw` overrides where numerals expand ("120 dB" is eight spoken words, not two). |
| `src/shots.ts` | what is shown. Caption lines are grouped into shots; seven lines are pinned to a specific image by hand; the rest of each product's pool is spread evenly across the shots that remain. |
| `src/Reel.tsx` | how it is staged, transitioned, annotated and mixed. |

Re-time the script and the picture, the graphics, the cue sheet, the printed
voiceover script and the coverage ledger all move with it.

---

## The layer stack

```
4  outro     the end screen — the only brand marks in the film
3  overlay   ALL typography, held at 0.64 opacity
             ├ caption lockup, bottom-anchored inside the safe box
             ├ product tag (M2 / M4 / M6) + reel progress
             ├ demonstratives — input ladder, meters, latency trace
             └ spec chips
2  scrim     a gradient across the top third only
1  picture   full-bleed photography, edge to edge, under a camera move
```

**Why the scrim exists, and why it is only at the top.** The overlay's top block
is dense technical text at 64% opacity, and half the supplied product
photography is shot on white seamless — without it, the spec block would sit on
a blown-out field and disappear. It is confined to the top third, where the
subject almost never is. The caption at the bottom needs no scrim: the bleed
shots already carry a tonal floor there.

---

## Staging: four kinds, all full-bleed

| Kind | What it is | Why it exists |
|---|---|---|
| `bleed` | one photograph filling the frame under a camera move | the default |
| `panel` | a transparent ultra-wide panel plan, tracked laterally | bleeding a 4:1 plan to a 9:16 frame would crop it to a sliver and destroy the only thing it is for — reading the connector row end to end |
| `split` | two photographs on a diagonal | for lines that compare two things |
| `mosaic` | three or more drifting as one plane | the hook and the close are *about* all three products, so they show all three |

**Every shot carries a real camera move** — push, pull, lateral track, tilt or a
slow orbit, eased rather than linear, so it reads as a dolly on a slider rather
than a CSS transition. The plate is oversized past the frame *before* the move
is applied and the move travels inside that overscan, so the visible window is
always filled and no edge is ever exposed.

---

## Transitions

Eight moves, chosen from each shot's own seed, with the larger ones held back
for segment boundaries. Each shot's sequence is extended past its end and the
next shot is stacked on top, so an incoming shot animates over a still-live
outgoing one and the film never dips to black between two shots.

`fade` · `wipeDiag` · `whipLeft` · `whipRight` · `punchIn` · `pullBack` ·
`slideUp` · `flash`

**No `filter: blur()` anywhere.** At 4K a full-surface Gaussian is a convolution
over 8.3 million pixels on every frame it runs; on the AVB build a single 90 px
text glow cost more than the entire rest of the frame. Every move here is
transform, opacity, clip-path or a gradient. The motion blur a whip pan wants is
suggested instead by a travelling accent streak — one `linear-gradient` div.

---

## The demonstratives

The brief asked for extra product text, extra animation and extra
demonstratives. The temptation is to answer that with more motion. The problem
this reel actually has is more specific: **the M2, the M4 and the M6 are the
same chassis, the same finish, the same knobs and the same badge position.** On
a phone, in a feed, photographs of the three are indistinguishable.

So every added graphic does one job — make the *difference* visible, because the
difference is the whole argument of the script.

| Graphic | Where | What it shows |
|---|---|---|
| **Input ladder** | each product section | six slots; two lit, then four, then six. The empty slots stay drawn, which is what makes the M2's ladder read as "two of a possible six" rather than just "two". |
| **Dynamic-range meter** | engine section | 120 dB against a 140 dB scale — a number a viewer cannot picture, drawn as a proportion they can |
| **Noise-floor meter** | engine section | −129 dBu with the *clean range above it* filled, not the sliver below. Filling to −129 on a −140…0 scale draws a 7% bar that looks like a broken meter and says the opposite of what the figure means. |
| **Latency trace** | engine section | a pulse leaving the input, crossing the converter and arriving back — round trip as a journey, not a number |
| **Spec chips** | every section | facts the narration has no time to say, so a viewer reading the screen and a viewer listening to the voice come away with different halves of the same datasheet |
| **Comparison ladder** | the close | 2 / 4 / 6 side by side, each in its product's accent. The frame the whole script is built to arrive at, and the one thing a viewer could screenshot and act on. |

Per-product accent colour is not decoration either — it is what tells a viewer
which of three identical boxes is on screen, and it is deliberately a different
triad from the AVB explainer's so the two films do not look like re-edits of one
another.

| | Accent | Why |
|---|---|---|
| M2 | amber `#FFA63D` | the portable one — warm, bus-powered, the studio in a bag |
| M4 | cyan `#42C8F0` | signal and blend — the Mix knob section |
| M6 | rose `#FF6BA6` | the loudest of the three, and a control room |

---

## Audio

Everything is synthesised from scratch — no sample is fetched, sourced or
imported. `scripts/gen_audio.py` produces a continuous 90-second music bed and
nine SFX cues.

**The palette is deliberately nothing like the AVB explainer's.** Both films are
for the same distributor and will sit next to each other on the same channel; if
they shared a cue set they would read as two edits of one film.

| | AVB explainer | M-Series reel |
|---|---|---|
| tempo | 84 BPM | 96 BPM |
| harmony | A minor, detuned saw pads | D major, sine pad + felt pluck |
| pulse | a filtered 62 Hz tick | a brushed off-beat shaker |
| vocabulary | links, clocks, streams | air, snaps, chimes, counting |

**Every cue is married to a transition kind.** `TRANS_CUE` in
`src/components/Transitions.tsx` is the other half of the table in
`gen_audio.py`: a whip pan is always an air slide, a diagonal wipe is always a
snap, and the input-ladder slots are locked frame-for-frame to a counting blip.
The picture and the sound were chosen at the same time, which is why a shot
change here reads as an edit rather than as a dissolve.

**Loudness is measured, not inferred.** The bed and the reference transition cue
are mastered to **−23 LUFS (EBU R128)** with a single computed gain — not
`loudnorm`'s dynamic mode, which would compress deliberate transients. Every
source then plays at unity in the timeline; a volume multiplier there would
silently undo the mastering. That is not hypothetical: the previous film's first
cut peak-normalised its bed to −15.5 dBFS and scaled it again at 0.42 in the
render, which put a slow, low-crest-factor pad at roughly −37 LUFS — present in
the file, inaudible in the room.

```
music-bed          -23.0 LUFS     riser-short   -23.0   (the reference cue)
                                  chime-lift    -24.5
                                  outro-bloom   -25.0
                                  slide-air     -26.0
                                  impact-soft   -26.5
                                  gate-snap     -27.0
                                  air-pass      -29.0
                                  tick-glass    -34.0
                                  count-blip    -36.0
```

The bed is also carved with a broad −7 dB dip at 1.6 kHz (`speech_pocket`), so
the 300 Hz – 4 kHz band the voice lives in is left open by design rather than
rescued by ducking later.

---

## The narration

`public/audio/vo.wav` is a **silent placeholder of exactly 90.000 s**. The client
records the take in `../VO_SCRIPT_MSERIES_REEL_90S.md`, drops the file in at that
path, and re-renders — no code change, no re-timing. **No AI or synthesised
voice is used anywhere in this build.**

If the recorded read runs long or short:

```bash
node --experimental-strip-types scripts/sync-vo.mjs
```

measures the take and reports the drift per segment, so the edit can be nudged
to the voice rather than the voice being asked to hit the edit.

---

## Fonts

The supplied specimen was **Brittanic + Lo-Flicker**, as an image — both are
commercial faces and the font files were not provided. The two *roles* are
filled by the closest freely-licensable equivalents:

| Role | Specimen | Standing in |
|---|---|---|
| script — carries one key word | Brittanic | Pacifico |
| display — carries everything else | Lo-Flicker | Archivo Black |

To swap the real faces in, drop them at `public/fonts/script.ttf` and
`public/fonts/display.ttf` and re-render. Every size and offset is expressed
relative to the role, so the lockup re-flows to whatever face is behind it.

---

## Asset coverage

All **32** M2/M4/M6 filenames in the repository root are accounted for, as
**30 distinct images** — two pairs are byte-identical across products:

```
MOTU M2 (10).jpg  ==  MOTU M4 (3).jpg
MOTU M4 (8).jpg   ==  MOTU M6 (11).jpg
```

That merge matters more here than it would elsewhere: showing one photograph
twice under two different product labels and two different accent colours would
break the exact discipline the reel depends on. `npm run coverage` regenerates
the full ledger from the same shot plan the video renders from and exits
non-zero if anything is unplaced.
