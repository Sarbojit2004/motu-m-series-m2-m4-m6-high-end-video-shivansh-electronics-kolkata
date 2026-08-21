# Remotion Brief

## Approved format

- 1080 × 1920 portrait, 30 fps
- 25 independently registered compositions, 5340 frames total (178.000 s)
- Light ground throughout. Caption-safe zone: top 180 / bottom 220 / sides 64.

## Selected assets

- All 30 unique images from `brand-assets/images/`, copied to `remotion/public/brand-assets/`
- `brand-assets/logos/motu-logo.png`, `brand-assets/logos/shivansh-electronics-logo.png`
- Bundled sound effects from `remotion/public/sounds/`

## Non-negotiable build rules

1. Images render with `object-fit: contain` — **never** `cover`. No image is cropped.
2. Wide images (AR ≥ 1.40, 25 of 30) scale complete to frame width; the remaining height is filled
   with a blurred, dimmed copy of the same image behind the complete one.
3. Logos draw as plain `<Img>` — no box, card, plate or rounded backing, never alpha-keyed.
4. All text inside the caption-safe zone. Headline floor 62px, micro floor 18px.
5. Prices render as three distinct figures — Rs. 26,900 / Rs. 32,900 / Rs. 55,900 — never blended.
6. No background music. Sound effects only where an approved visible action triggers them.

## Scenes

| # | id | component | frames | dur | assets | SFX |
|---|---|---|---|---|---|---|
| 1 | `hook-the-difference` | `HookTheDifference` | 0–240 | 8s | 1 | riser.mp3 |
| 2 | `the-old-trade-off` | `TheOldTradeOff` | 240–450 | 7s | 1 | Impact.mp3 |
| 3 | `one-engine-three-sizes` | `OneEngineThreeSizes` | 450–720 | 9s | 3 | Pop.mp3 |
| 4 | `shared-converter` | `SharedConverter` | 720–960 | 8s | 2 | Correct.mp3 |
| 5 | `shared-noise-and-latency` | `SharedNoiseAndLatency` | 960–1200 | 8s | 2 | Notification.mp3 |
| 6 | `shared-metering` | `SharedMetering` | 1200–1350 | 5s | 1 | Click.mp3 |
| 7 | `m2-introduction` | `M2Introduction` | 1350–1530 | 6s | 1 | Zoomin-OR-out.mp3 |
| 8 | `m2-front-panel` | `M2FrontPanel` | 1530–1800 | 9s | 1 | Zoomin-OR-out.mp3 |
| 9 | `m2-rear-panel` | `M2RearPanel` | 1800–2010 | 7s | 1 | Click.mp3 |
| 10 | `m2-in-the-room` | `M2InTheRoom` | 2010–2280 | 9s | 3 | transitions.mp3 |
| 11 | `m2-price` | `M2Price` | 2280–2430 | 5s | 1 | Correct.mp3 |
| 12 | `m4-introduction` | `M4Introduction` | 2430–2580 | 5s | 1 | Zoomin-OR-out.mp3 |
| 13 | `m4-front-panel` | `M4FrontPanel` | 2580–2850 | 9s | 1 | Click.mp3 |
| 14 | `m4-rear-panel` | `M4RearPanel` | 2850–3060 | 7s | 1 | Click.mp3 |
| 15 | `m4-in-the-room` | `M4InTheRoom` | 3060–3330 | 9s | 3 | transitions.mp3 |
| 16 | `m4-price` | `M4Price` | 3330–3480 | 5s | 1 | Correct.mp3 |
| 17 | `m6-introduction` | `M6Introduction` | 3480–3630 | 5s | 1 | Zoomin-OR-out.mp3 |
| 18 | `m6-front-panel` | `M6FrontPanel` | 3630–3900 | 9s | 1 | Pop.mp3 |
| 19 | `m6-rear-panel` | `M6RearPanel` | 3900–4110 | 7s | 1 | Click.mp3 |
| 20 | `m6-control-room` | `M6ControlRoom` | 4110–4320 | 7s | 1 | Click.mp3 |
| 21 | `m6-full-ensemble` | `M6FullEnsemble` | 4320–4590 | 9s | 3 | transitions.mp3 |
| 22 | `m6-price` | `M6Price` | 4590–4740 | 5s | 2 | Correct.mp3 |
| 23 | `shared-extras` | `SharedExtras` | 4740–4950 | 7s | 1 | Popups.mp3 |
| 24 | `all-three-prices-and-cta` | `AllThreePricesAndCta` | 4950–5190 | 8s | 3 | Correct.mp3, aha-moment.MP3 |
| 25 | `distributor-close` | `DistributorClose` | 5190–5340 | 5s | 0 | — |

## Per-scene requirements

### 1. `hook-the-difference` → `HookTheDifference` (240 frames)

- **Transcript:** Everyone can hear the difference between a room and a recording of that room. What sits in between decides it.
- **Visual:** The live-duo frame fills the top two thirds, scaled complete to the frame width with a blurred, dimmed copy of itself filling the space above and below it. A slow Gimbal Micro-Movement drift keeps it alive. The Shivansh Electronics logo sits in the lower-right safe area, drawn plain.
- **Text:** EVERYONE CAN HEAR / THE DIFFERENCE.  (Fraunces, ink)  ·  www.shivanshelectronics.in
- **Sequence:** Headline arrives line by line from below; the URL fades up last.
- **Assets:** shared-live-duo.jpg
- **SFX:** riser.mp3 under the headline arrival.  |  **Coupled:** The second headline line lands as the riser peaks.
- **Out:** Crossfade to a light page.

### 2. `the-old-trade-off` → `TheOldTradeOff` (210 frames)

- **Transcript:** For years that meant two bad options. An interface that adds hiss to everything, or one priced out of reach.
- **Visual:** The wide podcast room shown complete on its own blurred field, drifting slowly. Two short caption chips sit beneath it.
- **Text:** ADDS HISS TO EVERYTHING  /  OR PRICED OUT OF REACH  (alert red)
- **Sequence:** The two chips arrive one after the other, each with a small settle.
- **Assets:** shared-podcast-room.jpg
- **SFX:** Impact.mp3 on the second chip.  |  **Coupled:** The chip snaps to its settled position on the impact.
- **Out:** Wipe up into the thesis.

### 3. `one-engine-three-sizes` → `OneEngineThreeSizes` (270 frames)

- **Transcript:** The MOTU M-Series ends that. Three interfaces — M2, M4, M6 — one identical engine, differing only in how much you record at once.
- **Visual:** Each of the three front panels is held ALONE and WHOLE, centred, for roughly 2.2s in sequence — M2, then M4, then M6 — before all three stack vertically under one heading. Every panel is uncropped.
- **Text:** ONE ENGINE. / THREE SIZES.  ·  labels: MOTU M2 2 IN / 2 OUT · MOTU M4 4 IN / 4 OUT · MOTU M6 6 IN / 4 OUT  ·  MOTU logo
- **Sequence:** Three solo holds in order, then the three assemble into a stacked column.
- **Assets:** m2-front-panel.png, m4-front-panel.png, m6-front-panel.png
- **SFX:** Pop.mp3 as each panel lands.  |  **Coupled:** One pop per panel arrival, three in total.
- **Out:** Transform — the stacked column contracts into the chip motif of the next scene.

### 4. `shared-converter` → `SharedConverter` (240 frames)

- **Transcript:** Every model carries the same ESS Sabre32 Ultra converter, delivering a hundred and twenty decibels of dynamic range on its main outputs.
- **Visual:** The two white-ground hero shots sit one above the other, each complete and uncropped on the light page. A counter climbs to 120 dB between them.
- **Text:** ESS SABRE32 ULTRA  ·  120 dB  ·  DYNAMIC RANGE, MAIN OUTPUTS  ·  www.shivanshelectronics.in
- **Sequence:** Counter climbs 0 → 120; the two hero shots drift gently apart as it does.
- **Assets:** m2-hero-white.jpg, m4-hero-white.jpg
- **SFX:** Correct.mp3 when the counter locks at 120.  |  **Coupled:** The number stops climbing exactly on the sound.
- **Out:** Clean cut.

### 5. `shared-noise-and-latency` → `SharedNoiseAndLatency` (240 frames)

- **Transcript:** The preamps measure minus one hundred and twenty-nine dBu of equivalent input noise. Round-trip latency is two and a half milliseconds.
- **Visual:** The close cable/connector frame and the low-angle desk frame cross-dissolve, each complete on its own field. Two spec figures sit over the light page beneath them.
- **Text:** −129 dBu EIN  ·  2.5 ms ROUND-TRIP  (96 kHz, 32-sample buffer)
- **Sequence:** The two figures count in one after the other.
- **Assets:** m4-outdoor-cable.jpg, m6-low-angle.jpg
- **SFX:** Notification.mp3 on each figure landing.  |  **Coupled:** Each figure settles on its own sound.
- **Out:** Crossfade.

### 6. `shared-metering` → `SharedMetering` (150 frames)

- **Transcript:** And every model meters every input and output on a full-colour display.
- **Visual:** Interface Sequence — a slow dolly-push toward the LCD macro, complete and uncropped, its meter bars reading clearly.
- **Text:** FULL-COLOUR METERING. EVERY INPUT, EVERY OUTPUT.  ·  Shivansh logo
- **Sequence:** The push-in settles as the caption arrives.
- **Assets:** m6-lcd-macro.jpg
- **SFX:** Click.mp3 as the caption locks.  |  **Coupled:** Caption lands on the click.
- **Out:** Zoom through into the M2 title.

### 7. `m2-introduction` → `M2Introduction` (180 frames)

- **Transcript:** Start with the smallest. The MOTU M2 — two in, two out.
- **Visual:** The overhead dark-desk frame sits complete on its blurred field behind a large product title.
- **Text:** MOTU M2  ·  TWO IN, TWO OUT  ·  MOTU logo
- **Sequence:** Title scales in; the capacity label follows.
- **Assets:** m2-overhead-dark.jpg
- **SFX:** Zoomin-OR-out.mp3 on the title.  |  **Coupled:** Title scale peaks with the sound.
- **Out:** Clean cut into the macro.

### 8. `m2-front-panel` → `M2FrontPanel` (270 frames)

- **Transcript:** Two combo inputs on the front, each with its own preamp gain, its own forty-eight volt phantom power, and a one-touch monitor button.
- **Visual:** MACRO-TO-FULL-REVEAL. Opens hard on a single combo input with shallow depth of field, glides back as focus expands, resolving to the COMPLETE, uncropped M2 front panel, then holds with a slow drift.
- **Text:** TWO COMBO INPUTS · OWN PREAMP GAIN · 48V · ONE-TOUCH MONITOR  ·  www.shivanshelectronics.in
- **Sequence:** Three callout chips arrive one by one as the reveal resolves.
- **Assets:** m2-front-panel.png
- **SFX:** Zoomin-OR-out.mp3 across the pull-back.  |  **Coupled:** The pull-back begins on the sound.
- **Out:** Slide left to the rear panel.

### 9. `m2-rear-panel` → `M2RearPanel` (210 frames)

- **Transcript:** Behind it, two DC-coupled balanced outputs, mirrored RCA, five-pin MIDI in and out, and USB-C bus power.
- **Visual:** PORT DENSITY SWEEP — a slow lateral track along the rear connector row, resolving in the last third to the COMPLETE, uncropped rear panel.
- **Text:** DC-COUPLED TRS OUT · MIRRORED RCA · 5-PIN MIDI · USB-C BUS POWER
- **Sequence:** Each connector group labels itself as the sweep passes it.
- **Assets:** m2-rear-panel.png
- **SFX:** Click.mp3 per connector group.  |  **Coupled:** One click per label as the sweep reaches it.
- **Out:** Crossfade.

### 10. `m2-in-the-room` → `M2InTheRoom` (270 frames)

- **Transcript:** It weighs just over a pound and runs entirely off the cable. Which means the studio goes wherever the song starts.
- **Visual:** Three complete room frames in sequence, roughly 3s each, each scaled whole to the frame width on its own blurred field, each with its own slow drift and a small caption chip.
- **Text:** AT THE DESK  /  ON THE COUCH  /  WHEREVER THE SONG STARTS  ·  Shivansh logo
- **Sequence:** Cross-dissolve between the three; caption chip changes with each.
- **Assets:** m2-desk-macbook.jpg, m2-couch-guitar.jpg, m2-glass-table.jpg
- **SFX:** transitions.mp3 at each change.  |  **Coupled:** The dissolve midpoint lands on the sound.
- **Out:** Crossfade to the price card.

### 11. `m2-price` → `M2Price` (150 frames)

- **Transcript:** The MOTU M2 — twenty-six thousand nine hundred rupees, inclusive of GST.
- **Visual:** The producer-desk frame complete on its field, with a large price lockup over the light page beneath it.
- **Text:** MOTU M2 — Rs. 26,900  ·  per unit · MOP, inclusive of GST  ·  www.shivanshelectronics.in
- **Sequence:** Price scales up and settles; the GST line fades in under it.
- **Assets:** m2-producer-desk.jpg
- **SFX:** Correct.mp3 as the price settles.  |  **Coupled:** Price stops moving on the sound.
- **Out:** Clean cut.

### 12. `m4-introduction` → `M4Introduction` (150 frames)

- **Transcript:** Add two inputs and you get the MOTU M4.
- **Visual:** The studio-desk frame complete on its field behind the M4 title.
- **Text:** MOTU M4  ·  FOUR IN, FOUR OUT  ·  MOTU logo
- **Sequence:** Title scales in; capacity label follows.
- **Assets:** m4-studio-desk.jpg
- **SFX:** Zoomin-OR-out.mp3 on the title.  |  **Coupled:** Title scale peaks with the sound.
- **Out:** Clean cut into the macro.

### 13. `m4-front-panel` → `M4FrontPanel` (270 frames)

- **Transcript:** The same two combo preamps, plus a physical Input Monitor Mix knob — blending live input against computer playback by hand, no routing software needed.
- **Visual:** MACRO-TO-FULL-REVEAL, focused on the Input Monitor Mix knob — the one control the M2 does not have. Resolves to the COMPLETE, uncropped M4 front panel.
- **Text:** INPUT MONITOR MIX  ·  BLEND LIVE INPUT AGAINST PLAYBACK, BY HAND  ·  www.shivanshelectronics.in
- **Sequence:** A rotation indicator sweeps around the knob as the reveal resolves.
- **Assets:** m4-front-panel.png
- **SFX:** Click.mp3 repeated as the knob indicator steps round.  |  **Coupled:** One click per detent step of the indicator.
- **Out:** Slide left to the rear panel.

### 14. `m4-rear-panel` → `M4RearPanel` (210 frames)

- **Transcript:** The back grows to match: two dedicated line inputs, four DC-coupled outputs, four mirrored RCA, and MIDI.
- **Visual:** PORT DENSITY SWEEP along the M4 rear row, resolving to the COMPLETE, uncropped rear panel. The added LINE IN pair is highlighted as the sweep passes it.
- **Text:** 2 × DEDICATED LINE IN · 4 × DC-COUPLED OUT · 4 × RCA · MIDI
- **Sequence:** The two new line inputs pulse as they are named.
- **Assets:** m4-rear-panel.png
- **SFX:** Click.mp3 per connector group.  |  **Coupled:** One click per label.
- **Out:** Crossfade.

### 15. `m4-in-the-room` → `M4InTheRoom` (270 frames)

- **Transcript:** So two microphones stay patched to the front while a stereo synthesizer records through the rear. Four channels, and room to leave a session set up.
- **Visual:** Three complete frames in sequence, roughly 3s each, on their own fields with slow drift and caption chips.
- **Text:** ON THE SYNTH  /  AT THE DESK  /  TRACKING A KIT  ·  Shivansh logo
- **Sequence:** Cross-dissolve between the three.
- **Assets:** m4-synth-top.jpg, m4-desk-daw.jpg, m4-drum-overhead.jpg
- **SFX:** transitions.mp3 at each change.  |  **Coupled:** Dissolve midpoint on the sound.
- **Out:** Crossfade to the price card.

### 16. `m4-price` → `M4Price` (150 frames)

- **Transcript:** The MOTU M4 — thirty-two thousand nine hundred rupees, inclusive of GST.
- **Visual:** The white-ground M4 hero returns, complete and uncropped, with the price lockup beneath it.
- **Text:** MOTU M4 — Rs. 32,900  ·  per unit · MOP, inclusive of GST  ·  www.shivanshelectronics.in
- **Sequence:** Price scales up and settles.
- **Assets:** m4-hero-white.jpg
- **SFX:** Correct.mp3 as the price settles.  |  **Coupled:** Price stops on the sound.
- **Out:** Clean cut.

### 17. `m6-introduction` → `M6Introduction` (150 frames)

- **Transcript:** And when two channels are not enough — the MOTU M6.
- **Visual:** The desktop-studio frame complete on its field behind the M6 title.
- **Text:** MOTU M6  ·  SIX IN, FOUR OUT  ·  MOTU logo
- **Sequence:** Title scales in; capacity label follows.
- **Assets:** m6-desktop-studio.jpg
- **SFX:** Zoomin-OR-out.mp3 on the title.  |  **Coupled:** Title scale peaks with the sound.
- **Out:** Clean cut into the macro.

### 18. `m6-front-panel` → `M6FrontPanel` (270 frames)

- **Transcript:** Four microphone preamps: four gain controls, four phantom switches, four monitor buttons — and two headphone outputs, in the same desktop footprint.
- **Visual:** MACRO-TO-FULL-REVEAL opening on the four gain knobs, gliding back to the COMPLETE, uncropped M6 front panel including both headphone outputs.
- **Text:** 4 × GAIN · 4 × 48V · 4 × MON · TWO HEADPHONE OUTS  ·  www.shivanshelectronics.in
- **Sequence:** The four gain positions light one by one as the reveal resolves.
- **Assets:** m6-front-panel.png
- **SFX:** Pop.mp3 per gain position.  |  **Coupled:** One pop per position lighting.
- **Out:** Slide left to the rear panel.

### 19. `m6-rear-panel` → `M6RearPanel` (210 frames)

- **Transcript:** The four combo jacks moved to the rear, alongside two more line inputs and a fifteen volt DC socket.
- **Visual:** PORT DENSITY SWEEP along the M6 rear row — the four combo jacks, the two extra line inputs and the 15V DC socket — resolving to the COMPLETE, uncropped rear panel.
- **Text:** 4 × MIC/LINE/GUITAR (REAR) · LINE IN 5/6 · 15V DC
- **Sequence:** Each of the four combo jacks numbers itself as the sweep passes.
- **Assets:** m6-rear-panel.png
- **SFX:** Click.mp3 per jack.  |  **Coupled:** One click per jack number.
- **Out:** Crossfade.

### 20. `m6-control-room` → `M6ControlRoom` (210 frames)

- **Transcript:** An A-B switch compares your mix across two monitor pairs. The second headphone output carries its own cue mix.
- **Visual:** The dark-desk frame complete on its field. An A/B indicator toggles between two monitor-pair icons over the light page beneath.
- **Text:** A/B ACROSS TWO MONITOR PAIRS  ·  SECOND HEADPHONE OUT, ITS OWN CUE MIX
- **Sequence:** The A/B indicator flips from A to B and back.
- **Assets:** m6-dark-desk.jpg
- **SFX:** Click.mp3 on each A/B flip.  |  **Coupled:** The indicator changes state on the click.
- **Out:** Wipe up.

### 21. `m6-full-ensemble` → `M6FullEnsemble` (270 frames)

- **Transcript:** Which is what six inputs actually buy you. A four-person panel. A drum kit in a single pass. A small band, live in the room.
- **Visual:** Three complete frames in sequence, roughly 3s each, on their own fields with slow drift and caption chips.
- **Text:** A FOUR-PERSON PANEL  /  A KIT IN ONE PASS  /  THE WHOLE SETUP  ·  Shivansh logo
- **Sequence:** Cross-dissolve between the three.
- **Assets:** m6-podcast-panel.jpg, m6-drum-kit-room.jpg, m6-full-setup.jpg
- **SFX:** transitions.mp3 at each change.  |  **Coupled:** Dissolve midpoint on the sound.
- **Out:** Crossfade to the price card.

### 22. `m6-price` → `M6Price` (150 frames)

- **Transcript:** The MOTU M6 — fifty-five thousand nine hundred rupees, inclusive of GST.
- **Visual:** The couch and bright-studio frames cross-dissolve, each complete on its field, with the price lockup over the light page beneath.
- **Text:** MOTU M6 — Rs. 55,900  ·  per unit · MOP, inclusive of GST  ·  www.shivanshelectronics.in
- **Sequence:** Price scales up and settles as the second frame arrives.
- **Assets:** m6-couch-songwriting.jpg, m6-bright-studio.jpg
- **SFX:** Correct.mp3 as the price settles.  |  **Coupled:** Price stops on the sound.
- **Out:** Clean cut.

### 23. `shared-extras` → `SharedExtras` (210 frames)

- **Transcript:** Every model ships with loopback for streaming, DC-coupled outputs for modular gear, and software to record on day one.
- **Visual:** The software-bundle montage complete and uncropped on the light page, with three capability chips arriving beneath it.
- **Text:** LOOPBACK  ·  DC-COUPLED OUTPUTS  ·  SOFTWARE IN THE BOX  ·  Shivansh logo
- **Sequence:** The three chips arrive one by one.
- **Assets:** shared-software-bundle.jpg
- **SFX:** Popups.mp3 as the chips arrive.  |  **Coupled:** One pop per chip.
- **Out:** Wipe up into the price wall.

### 24. `all-three-prices-and-cta` → `AllThreePricesAndCta` (240 frames)

- **Transcript:** Twenty-six thousand nine hundred. Thirty-two thousand nine hundred. Fifty-five thousand nine hundred. To check the best current price, visit shivanshelectronics dot in.
- **Visual:** The three front panels stack vertically, each complete and uncropped, each paired with its own price on the right. The URL sits large beneath all three.
- **Text:** MOTU M2 Rs. 26,900 / MOTU M4 Rs. 32,900 / MOTU M6 Rs. 55,900 · per unit · MOP, inclusive of GST · VISIT www.shivanshelectronics.in TO CHECK THE BEST PRICE
- **Sequence:** The three price rows arrive one by one, then the URL scales up last.
- **Assets:** m2-front-panel.png, m4-front-panel.png, m6-front-panel.png
- **SFX:** Correct.mp3 per price row, aha-moment.MP3 on the URL.  |  **Coupled:** Each row lands on its own sound; the URL peaks on the last.
- **Out:** Crossfade to the close.

### 25. `distributor-close` → `DistributorClose` (150 frames)

- **Transcript:** Shivansh Electronics — authorized MOTU distributor for East and North East India.
- **Visual:** Flat light page. The MOTU logo and the Shivansh Electronics logo sit stacked and centred, both drawn plain with no box or plate, above the full designation line and the URL.
- **Text:** Shivansh Electronics — Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India  ·  www.shivanshelectronics.in
- **Sequence:** Logos fade up together; the designation line and URL follow.
- **Assets:** logos only
- **SFX:** none  |  **Coupled:** none
- **Out:** Hold to end.   ## Coverage check  - Unique images supplied: **30** - Images placed with a first appearance: **30** - Missing: **0** — none - Scenes: **25**, total **178.000 s**
