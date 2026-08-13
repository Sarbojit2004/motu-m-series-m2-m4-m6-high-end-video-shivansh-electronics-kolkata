# MOTU M-Series (M2 · M4 · M6) — Two 88-Second Vertical Reels

A Remotion project producing two independently renderable 9:16 reels for the MOTU
M-Series audio interfaces, plus six portrait thumbnails and two timed voiceover
scripts.

**Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India.**

| Part | Title | Covers | Output |
|---|---|---|---|
| 1 | **The Engine** | MOTU heritage, the shared ESS Sabre32 Ultra™ engine, and the M2 as its canvas | `out/motu-mseries-reel-part1-engine.mp4` |
| 2 | **The Scale-Up** | The M4's line inputs and Mix knob; the M6's four preamps, A/B switching, dual headphones and standalone power | `out/motu-mseries-reel-part2-scaleup.mp4` |

Both are **1080 × 1920, 30 fps, exactly 2,640 frames / 88.000 s**.

---

## The narrative rule everything else serves

The M2, M4 and M6 share an **identical** ESS Sabre32 Ultra™ DAC, an identical
120 dB dynamic range, identical −129 dBu EIN preamps and an identical 2.5 ms
round-trip latency. They differ in simultaneous input count and in physical
workflow features — **never in audio fidelity**.

So this is a horizontal continuum of operational capacity, not a vertical ladder
of quality. Nothing in either reel frames the M2 as a compromise or the M6 as an
upgrade in sound. `scripts/branding_audit.mjs` enforces this mechanically.

---

## Quick start

```bash
npm install

# regenerate everything derived (images + all audio) — ~1 minute
npm run bootstrap

# preview
npm run studio

# render
npm run render:p1
npm run render:p2

# thumbnails (six PNGs into thumbnails/)
npm run thumb:p1en && npm run thumb:p1hi && npm run thumb:p1bn
npm run thumb:p2en && npm run thumb:p2hi && npm run thumb:p2bn
```

`public/img/` and `public/audio/` are **not committed** — they are ~20 MB of
derived output that `npm run bootstrap` reproduces deterministically from the
repository's own source files. `public/fonts/` **is** committed: those woff2
faces are inputs, and no render should ever depend on a network fetch.

---

## Format contract

```
canvas      1080 × 1920, 30 fps
runtime     2,640 frames = 88.000 s per part
background  light throughout, every scene, no exceptions

safe zone   0    ..  250   ambient only — no text, no key detail
            250  .. 1580   PRIMARY SAFE AREA — all content lives here
            1580 .. 1920   ambient only
            72px side margins
```

Content is composed across the **whole** frame; the safe zone is a placement
contract, not a letterbox. The 1080 × 1330 inner box is what must survive
cropping on any device, so content biases slightly upward inside it.

---

## Images are never cropped

This was an explicit delivery requirement, and it is enforced structurally
rather than by care:

1. **`src/lib/ledger.json` records every asset's true pixel dimensions.**
   `fitBox()` in `src/lib/images.ts` solves the largest box with the image's
   *exact* aspect ratio, so `objectFit: contain` fills it precisely — no
   letterbox bars, and no part of the frame discarded. `HeroShot`, `Band`,
   `Pair`, `Trio`, `SeqShot` and `ScreenShot` all solve their own boxes, so a
   caller cannot hand them a mismatched ratio.

2. **Camera motion scales the plate, not the image inside a fixed frame.** A
   conventional Ken Burns necessarily crops — the frame stays put while the
   image grows past it. `plateMove()` eases the whole composed unit forward
   instead, so the subject stays complete at every one of the 2,640 frames while
   still reading as the brief's slow macro push-in.

3. **That scale is clamped to the box's side room** (`maxScaleFor`/`clampMove` in
   `Media.tsx`). A full-safe-width plate would otherwise grow straight into the
   72px margins — which is exactly what `scripts/safezone_audit.py` caught on a
   hero in P1S02. Where there is no room, a `[1.0 → 1.035]` push-out is rewritten
   as a `[0.966 → 1.0]` settle-in: same eased travel, arriving at the designed
   geometry instead of overshooting it.

`objectFit: 'cover'` appears in exactly one place — the deliberately
40px-blurred ambient wash in `Stage.tsx`, which carries no readable detail by
design. The branding audit fails the build if it appears anywhere else.

---

## Asset inventory

Enumerated with a real directory listing plus an MD5 and dimension pass, not
assumed:

```
34 media files in the repository
 ├─  2 logo files          — excluded from reel content, exempt from coverage
 └─ 32 coverage-relevant filenames
     └─ 2 byte-identical duplicate pairs merged
          MOTU M4 (3).jpg  == MOTU M2 (10).jpg   (podcast room)
          MOTU M6 (11).jpg == MOTU M4 (8).jpg    (included software)
     == 30 DISTINCT assets → 9 in Part 1, 21 in Part 2
```

Covering a merged entry covers both filenames — they are the same pixels.
`node scripts/coverage.mjs` maps every asset to the scene it appears in and
fails if any is unplaced. **All 30 distinct assets / 32 filenames appear across
the two reels.**

Six of the assets are transparent ultra-wide panel cutouts (aspect 3.26–4.41) —
the front and rear panel plans for each unit. They are presented as full-width
bands so the whole panel is legible edge to edge.

### No added logos

Neither logo file is placed in a reel or a thumbnail, at any point, in any form
— logos are added by hand afterwards. This is enforced structurally: both carry
`part: 0` and no slug in the ledger, are never copied into `public/img`, and
`A()` throws if a scene asks for one.

The exclusion is narrow. Brand marks **already printed on the hardware inside a
supplied photograph** — the MOTU wordmark on a chassis, the small badges in a few
of the lifestyle shots — are part of the photograph and are used exactly as
provided, untouched.

---

## Audio — synthesised here, no external service

`scripts/gen_audio.py` generates every audio asset from scratch with
numpy/scipy: biquad filters, envelopes, comb reverb, stereo widening. Nothing
calls ElevenLabs or any other service, including the SFX tooling bundled in
`claude-code-video-toolkit`.

**120 BPM, 44 bars, A minor.** A bar is exactly 2.000 s = 60 frames, so 88 s is
exactly 44 bars and scene timing can be reasoned about musically.

Three layers, per the sound-design requirement:

| Layer | File | Level |
|---|---|---|
| Constant ambient texture, under **every** frame | `ambient-reel.mp3` (88 s) | `MIX.ambient` |
| Music arrangement | `music-bed-part{1,2}.mp3` (88 s each) | `MIX.bed` |
| 20 transition cues | `chip-stamp`, `meter-bloom`, `knob-detent`, `phantom-click`, `jack-seat`, `slide-pan`, `voltage-line`, `push-in`, … | `MIX.cue` × per-cue |

Both parts share one key, tempo and instrument set — the sonic expression of the
"same engine" thesis. Only the energy contour differs: Part 1 opens sparse and
builds; Part 2 opens already at beat level and runs wider, with a brighter arp
and a counter-melody.

Cues are voiced for this project's **deliberate** pace. Transitions land roughly
every 6–7 s rather than in a rapid montage, so each is a weighted, resolving
sound with a real tail — not a rapid-cut tick played slower.

`MIX` in `src/lib/sfx.ts` is a documented master trim. The three layers sum, and
an untrimmed ambient + bed + loud cue on one frame drove the master to **1.26**
— measured clipping on a range test. The trim buys headroom without making the
SFX quiet; they still sit clearly above the bed, with final balancing left for
post.

---

## Type and colour

The type system is ported structurally from the completed **TASCAM Sonicview**
project: Barlow Condensed 600/700/800 (display), Inter variable (UI/body),
JetBrains Mono variable (technical figures), with the same weight pairing and
size-hierarchy logic. Colour values were **re-derived** for this project's own
light ground and the M-Series' black-chassis / colour-LCD photography.

| Token | Hex | Contrast on `paper` |
|---|---|---|
| `paper` | `#F2F4F7` | — |
| `ink` | `#0A1017` | 17.34:1 |
| `inkSoft` | `#2C3A4A` | 10.52:1 |
| `inkDim` | `#546375` | 5.58:1 |
| `motu` | `#17408F` | **8.80:1** |

`motu` is a darkened derivation of the MOTU wordmark blue sampled from the
supplied logo asset (`#6090F0`, only 2.83:1 and unusable as text). **One accent
across both parts** — a hue shift between them would imply the products differ
in kind.

The LCD's saturated greens (`#56EE00`) appear only inside meter graphics, never
as type, per the brief's rule that the display should be the frame's primary
source of saturated colour.

`NotoINR` sits in every font stack to supply **₹ (U+20B9)**, which none of the
three Latin faces contain — without it the MOP figures resolve the rupee sign
through whatever fallback the render host happens to have.

---

## Vector motion graphics

Built natively in Remotion + SVG (`src/components/Diagram.tsx`).
`motion-canvas` was a conceptual reference only; nothing from it is imported or
run here.

- **`SharedDac`** — the glowing microchip that "stamps" onto each chassis
- **`MeterPanel`** — the 160 × 120 full-colour LCD, with meters that bounce on
  the 120 BPM grid. Tuned to sit mostly in the green, peak into yellow and only
  rarely touch red: a meter pinned at red would undercut the gain-staging point
  the scene is making
- **`LoopbackPath`** — DAW → M-Series → merged with microphone → livestream
- **`CvModular`** — DC-coupled TRS output driving a Eurorack module
- **`IoBar`** — the 2 → 4 → 6 thread carried across both reels
- **`RackFocus`** — the M4/M6 Mix-knob blend, with a rotating indicator

All interpolation is eased cubic-bezier. Nothing in this project moves linearly.

---

## Validation

Every check is a script, so none of it rests on having looked carefully.

```bash
npx tsc --noEmit                    # types
npx remotion compositions           # bundler
npm run audio                       # generate + audit all audio
node scripts/coverage.mjs           # every asset placed, no logo referenced
node scripts/branding_audit.mjs     # 20 copy/branding rules
node scripts/stills.mjs 1           # one verification still per scene
python3 scripts/safezone_audit.py stills/p1/*.png thumbnails/*.png
node scripts/verify_render.mjs out/motu-mseries-reel-part1-engine.mp4
```

**`audit_audio.py`** decodes every file and asserts stereo/48 kHz, non-silent,
non-clipping, a varying RMS envelope, exact 88.000 s on the beds, and that every
cue name in `sfx.ts` resolves to a real file — so a render cannot silently drop
a transition.

**`branding_audit.mjs`** checks no competing interface brand is named, "MRP"
never appears, the distributor designation is exact and never re-typed outside
`copy.ts`, the territory is never generalised to pan-India, no logo is
referenced, no quality-tier framing of the M2 or M4, every rupee figure matches
the brief's verified MOP values, and `objectFit: 'cover'` is not used on content.
It strips comments first, so the source can document a rule without tripping it.

**`safezone_audit.py`** works at the pixel level: dark pixels in a side margin
inside the primary band can only be escaped content, because the ambient wash is
masked out there. The ambient strips are checked for *sharpness* instead, since
a 40px-blurred wash cannot produce strong local gradients but text and plate
edges can.

**`verify_render.mjs`** checks the delivered file itself — 1080 × 1920, 30 fps,
2,640 frames, 88.000 s, both streams present, audio carrying signal without
clipping, and no silent stretch anywhere in the bed.

---

## Deliverables

```
out/motu-mseries-reel-part1-engine.mp4
out/motu-mseries-reel-part2-scaleup.mp4

VO_SCRIPT_REEL_PART1_ENGINE.md          timed to 88.000 s, English only
VO_SCRIPT_REEL_PART2_SCALEUP.md

thumbnails/thumbnail-motu-reel-part1-{english,hindi,bengali}.png
thumbnails/thumbnail-motu-reel-part2-{english,hindi,bengali}.png
```

The reels are **English-only** and carry no burned-in captions. The trilingual
thumbnails are a separate discoverability layer: the Hindi and Bengali variants
are genuinely translated into Devanagari and Bengali script, not badged English.
Verified specification figures and literal model names stay in Latin script,
because that is how they are written in Indian technical copy.

`public/vo/voiceover-reel-part{1,2}.mp3` are silent 88.000 s placeholders
occupying the exact slot each recording will fill.

Market Operating Prices, per the brief's verified Section 4 table:
**M2 ₹26,900 · M4 ₹32,900 · M6 ₹55,900** — per unit, MOP, incl. GST.

---

## Project layout

```
src/
  lib/          theme (palette, safe zone, scene tables) · fonts · anim ·
                images + ledger.json · copy · sfx
  components/   Stage · Type · Media · Diagram · Beat · Cue · Brand · Reel
  scenes/       part1.tsx · part2.tsx
  Part1.tsx  Part2.tsx  Thumbnails.tsx  Root.tsx
scripts/
  build_ledger.py  rebuild_media.py  gen_audio.py  audit_audio.py
  coverage.mjs  branding_audit.mjs  stills.mjs  safezone_audit.py
  verify_render.mjs
public/fonts/   10 vendored woff2 faces (committed)
public/img/     30 deduplicated images (derived)
public/audio/   25 synthesised audio files (derived)
```

Scene tables in `src/lib/theme.ts` are the single source of timing truth. `Reel`
throws if a part's nodes disagree with its table, or if the table does not sum
to exactly 2,640 frames.

---

## Long-form video — 298 s, 1920×1080

`out/motu-mseries-longform.mp4` — one continuous 298-second treatment of the
same story the two reels tell, covering M2, M4 and M6 in a single arc.

### Reproduce the render

```bash
npm install
npm run render:lf          # -> out/motu-mseries-longform.mp4
```

The archive in `dist-zip/` ships the derived `public/` tree (deduplicated
images, synthesised audio, vendored fonts, plate-stripped logos), so those two
commands are all that is needed — nothing is fetched over the network and no
regeneration step is required.

### Regenerate the derived assets from source

Only needed if you change the ledger, the audio design, or the logo prep.
Point `MOTU_MEDIA_DIR` at the directory holding the 34 raw media files:

```bash
python3 -m pip install numpy scipy Pillow
python3 scripts/build_ledger.py          # src/lib/ledger.json  (34 -> 30 distinct)
python3 scripts/rebuild_media.py         # public/img
python3 scripts/prep_logos.py            # public/logo — strips the baked-in white plate
python3 scripts/gen_audio.py             # reel SFX + beds
python3 scripts/gen_audio_longform.py    # 298 s ambient + bed + 3 extra cues
python3 scripts/audit_audio.py           # validates every file decodes and carries signal
```

### Verification

```bash
npm run typecheck
node scripts/lf_coverage.mjs             # all 30 assets appear + content rules
node scripts/branding_cadence.mjs        # Section 9 logo cadence + positional variation
node scripts/lf_stills.mjs               # one still per scene -> frames/lf
python3 scripts/lf_edge_audit.py frames/lf/*.png
node scripts/verify_render.mjs out/motu-mseries-longform.mp4
```

### Thumbnails

```bash
npm run thumb:lfen && npm run thumb:lfhi && npm run thumb:lfbn
```
