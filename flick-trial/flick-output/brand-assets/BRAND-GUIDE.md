# MOTU M-Series portrait reel — brand guide and creative direction

Everything below is a **hard requirement**, not a preference. Values are pulled from the
approved MOTU AVB Series ecosystem build, which is this pipeline's established reference.

## Canvas
- **1080 × 1920, portrait, 30 fps. Total 178.000 s = 5,340 frames.**
- **Caption-safe zone — text, logos and callouts must stay inside it:**
  - top `180px`, bottom `220px`, sides `64px` → usable content box **952 × 1520**
  - background/ambient imagery MAY bleed into those bands; text, logos and callouts NEVER do.

## Palette — light ground for the entire runtime, no exceptions
| token | hex | use |
|---|---|---|
| `paper` | `#F6F8FA` | page ground |
| `paperLift` | `#FDFEFE` | lifted cards/plates |
| `paperEdge` | `#EFF2F6` | gradient edge |
| `ink` | `#0E1116` | headlines (17.9:1 on paper) |
| `inkSoft` | `#20272F` | secondary body (12.6:1) |
| `slate` | `#48525F` | subheads (7.6:1) |
| `slateDim` | `#6B7684` | micro-labels only (4.6:1) |
| `motuBlue` | `#0B5FD0` | accent, URL, prices (6.2:1) |
| `signal` | `#00845F` | LCD-meter green |
| `amber` | `#B4610A` | animated counters |
| `alert` | `#B32218` | the problem beat only |

The page is deliberately held in a **near-white** range so the supplied logos — which carry their
own white background — read as continuous with it.

## Type
- **Archivo** carries headlines, spec callouts and micro-labels. Uppercase, tracked, weights 600–900.
  Spec figures use **tabular numerals** so animated counters don't reflow.
- **Fraunces** (editorial serif) is held back for the hook and the closing turn only.
- Headline floor **62px**; micro-label floor **18px**. Everything must be comfortably readable at a
  glance on a phone, for the actual time it is on screen — not "readable if you look closely".

## Motion vocabulary (this pipeline's established camera language)
- **Gimbal Micro-Movement** — continuous sub-pixel drift + a very shallow scale creep, so a still
  photograph feels physically alive without reading as an effect.
- **Macro-to-Full-Reveal** — open hard on a detail with shallow depth of field, glide back as focus
  expands until the **complete, uncropped** unit is on screen, then hold with a slow drift.
  Roughly 35% macro / 65% reveal-and-hold. Reserve for genuine hero moments.
- **Interface Sequence** — slow dolly-push toward the front-panel LCD while its meters animate.
- **Port Density Sweep** — slow lateral track along a rear connector row, resolving to the whole unit.
- **Scale-and-fill for wide images** — see the next section. This is the one that matters most here.

## THE RULE THAT OVERRIDES EVERYTHING: never crop, never use filler
1. **Every one of the 30 images in `images/` must appear somewhere in the reel**, and must be shown
   **complete and uncropped** at some point in its own treatment. `object-fit: contain`, never `cover`.
2. **25 of the 30 are landscape-oriented (aspect 1.40–4.41).** In a 1080×1920 frame they must be
   scaled **complete to the frame width** and the remaining height filled deliberately — a blurred,
   dimmed copy of the *same* image behind it, or the light-ground gradient. The complete image is
   always the subject; the fill only seats it. **Do not crop them to fill the frame.**
3. **No throwaway filler.** Screen time per image is necessarily short at this density and that is
   accepted and expected — a fast, dynamic cutting rhythm is wanted. What is not accepted is an image
   flashed abruptly, undersized, or dropped in purely to tick a coverage box. Every image, however
   brief, needs real composition: properly framed in the portrait canvas, given an intentional piece
   of motion however fast, and cut to and from with a transition that reads as part of the rhythm.
4. Vary the transition and motion treatment across scenes. At this scene count a single repeated
   entrance becomes the noticeable pattern of the piece.

## Logos — `logos/motu-logo.png`, `logos/shivansh-electronics-logo.png`
Draw each **exactly as supplied**: opaque, with its own white background intact, **directly on the
video with NO box, card, plate or rounded backing of any kind.** Never alpha-key them. The near-white
page is what makes this work. (Note: `mix-blend-mode: multiply` fails here — a parent transform
creates a stacking context and the logo renders with a visible white rectangle. Use layout, not blending.)

**Cadence:** Shivansh Electronics must appear **noticeably more often than MOTU**, and
`www.shivanshelectronics.in` must read as the single most-repeated, most-emphasised element in the reel.

## Fixed facts — never alter these
- **MOTU M2 — Rs. 26,900 · MOTU M4 — Rs. 32,900 · MOTU M6 — Rs. 55,900.**
  Each *per unit, Market Operating Price, inclusive of GST*. State all three **distinctly**.
  Never round, never blend into one figure or a range, never write "starting from".
- CTA: **visit www.shivanshelectronics.in to check the best price** — stated *alongside* the three
  figures, never instead of them.
- Positioning, exact wording: **Shivansh Electronics is the Authorized Distributor of MOTU
  (Mark of the Unicorn, USA) Interfaces for East and North East India.**
- **Never** name or compare against any other audio-interface brand. **Never** mention TASCAM.
- Only verified specs reach the screen: ESS Sabre32 Ultra DAC · 120 dB dynamic range (main outs) ·
  −129 dBu EIN · 2.5 ms round-trip latency (96 kHz, 32-sample buffer) · 24-bit/192 kHz ·
  160×120 full-colour LCD · loopback · MIDI I/O · USB-C. Preamp **gain range is NOT verified — never state it.**
- The M6's four combo inputs are on the **REAR** panel, not the front. The photography confirms this.

## Audio — what NOT to do
Do **not** add background music, and do **not** place sound effects except where they match a visible
on-screen action. This project layers its own music bed and its own branded SFX on top afterwards.
