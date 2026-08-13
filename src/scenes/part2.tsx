import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F, PART2, SAFE} from '../lib/theme';
import {CONTINUITY, MOP, PART_TITLE, SHARED_SPECS} from '../lib/copy';
import {ramp, sceneIn} from '../lib/anim';
import {AmbientMotes, AmbientPhoto, At, Stage} from '../components/Stage';
import {Band, HeroShot, Pair, ScreenShot, SeqShot, bandHeight} from '../components/Media';
import {
  Body,
  Display,
  Kicker,
  Micro,
  MopTag,
  Rule,
  SpecCard,
  Sub,
} from '../components/Type';
import {IoBar, MeterPanel, RackFocus, SharedSpecStrip} from '../components/Diagram';
import {ContactStrip, DistributorBlock, Outro, PartMark} from '../components/Brand';
import {BSlide} from '../components/Beat';
import {Cue} from '../components/Cue';
import {SceneNode} from '../components/Reel';

/**
 * PART 2 — "THE SCALE-UP"
 *
 * Part 1 made the audio-quality case once, on the M2. So this reel deliberately
 * spends almost no time re-proving fidelity and instead moves through what
 * actually differs: the M4's added line inputs and its physical Input Monitor
 * Mix knob, then the M6's four mic preamps, A/B monitor switching, dual
 * headphone outputs and standalone DC power.
 *
 * NARRATIVE GUARD. The scale-up is horizontal, never vertical. The M6 is not
 * "the good one" — S01 opens by restating that the engine is identical, and the
 * shared-spec strip appears again in the same form it took in Part 1 so the
 * claim is visually literal. No other interface brand is named or implied.
 *
 * CONTINUITY. Same light palette, same type system, same accent and the same
 * SFX identity as Part 1; only the music bed's energy contour differs, opening
 * already at beat level. The I/O Comparison Bar thread continues, resolving
 * 2 -> 4 -> 6 in S05.
 *
 * PACING. 21 distinct assets across 88 s — denser than Part 1 but still ~4 s
 * per asset. Scenes that carry three images do so because they are genuinely
 * presenting a sequence (three tracking scenarios in S08) or a justified
 * comparison (the two rear panels in S05), never to hit a coverage quota.
 */

const D = (i: number) => PART2[i].dur;
const P2MARK = `PART 2 OF 2 · ${PART_TITLE[2]}`;

// ---------------------------------------------------------------------------
// P2S01 — Open: the engine is settled, now the scale
// ---------------------------------------------------------------------------
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(0);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={13} opacity={0.5} />
        <AmbientMotes part={2} n={22} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            {CONTINUITY[2].kicker}
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={84} lh={0.88}>
            {'THE ENGINE IS SETTLED.\nNOW THE SCALE.'}
          </Display>
        </At>
        <At y={266} w={860}>
          <Sub size={28}>
            Everything Part 1 established stays exactly the same. What changes
            from here is how many sources you can bring in at once.
          </Sub>
        </At>

        {/* the identical figures, in the identical form they took in Part 1 —
            the "same engine" claim made visually literal */}
        <At y={412} w={SAFE.w}>
          <SharedSpecStrip items={SHARED_SPECS} delay={14} cols={3} />
        </At>

        <At y={648} w={SAFE.w}>
          <IoBar ins={2} outs={2} max={6} delay={40} animateFrom={0} label="ESTABLISHED · M2" />
        </At>

        <At y={766} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="NEXT" value="MOTU M4 · 4-in / 4-out" delay={56} width={352} />
            <SpecCard label="THEN" value="MOTU M6 · 6-in / 4-out" delay={64} width={352} />
          </div>
        </At>
        <At y={892} w={880}>
          <Body size={25} color={C.inkSoft}>
            Not a better-sounding interface. A larger one.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={0} delay={72} />
      </Stage>

      <Cue name="reverse-swell" at={0} volume={0.62} />
      <Cue name="impact-deep" at={8} volume={0.7} />
      <Cue name="latch" at={16} volume={0.42} />
      <Cue name="latch" at={24} volume={0.4} />
      <Cue name="latch" at={32} volume={0.38} />
      <Cue name="count-tick" at={42} volume={0.48} />
      <Cue name="riser-warm" at={dur - 44} volume={0.56} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S02 — MOTU M4: 4-in / 4-out
// ---------------------------------------------------------------------------
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(1);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={12} opacity={0.46} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Kicker color={C.motu} size={20} tracking={4.0}>
              MOTU M4
            </Kicker>
            <Rule w={44} color={C.motu} thickness={3} />
            <Micro size={13.5} tracking={2.2} color={C.inkDim}>
              4-IN / 4-OUT USB-C
            </Micro>
          </div>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'TWO MORE INPUTS,\nALWAYS CONNECTED'}
          </Display>
        </At>
        <At y={252} w={860}>
          <Sub size={26}>
            Two rear line inputs join the two front combo jacks — leave the
            microphones plugged in and record hardware at the same time.
          </Sub>
        </At>

        {/* the complete front panel, edge to edge */}
        <Band id={10} dur={dur} y={382} padY={18} />

        <HeroShot id={12} y={670} maxW={SAFE.w} maxH={288} dur={dur} move={{z: [1.0, 1.03]}} />

        <At y={984} w={SAFE.w}>
          <IoBar ins={4} outs={4} max={6} delay={38} animateFrom={2} />
        </At>

        <At y={1082}>
          <MopTag product="M4" amount={MOP.M4} delay={56} size={0.9} />
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={1} delay={80} />
      </Stage>

      <Cue name="impact-deep" at={4} volume={0.72} />
      <Cue name="jack-seat" at={18} volume={0.6} />
      <Cue name="push-in" at={30} volume={0.4} />
      <Cue name="count-tick" at={40} volume={0.52} />
      <Cue name="count-tick" at={52} volume={0.5} />
      <Cue name="shimmer-warm" at={56} volume={0.32} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S03 — The Input Monitor Mix knob (tactile engagement)
// ---------------------------------------------------------------------------
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(2);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={16} opacity={0.48} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            TACTILE CONTROL
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'A KNOB, NOT A\nMENU'}
          </Display>
        </At>
        <At y={252} w={840}>
          <Sub size={26}>
            Blend the live input against computer playback by hand, mid-take —
            no routing software in the way.
          </Sub>
        </At>

        {/*
          The brief's rack-focus device: the focal plane pulls to the Mix knob
          while an on-screen indicator rotates.

          Width is 620, not 720 — RackFocus is as tall as its knob (w × 0.52), so
          720 would make it 374px tall and run straight into the image pair
          below. At 620 it is 322px, which leaves the pair its own room.
        */}
        <At y={350} w={SAFE.w}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <RackFocus w={620} delay={12} to={0.62} />
          </div>
        </At>

        <Pair ids={[16, 15]} dur={dur} y={700} maxH={280} delay={40} stagger={9} />

        <At y={1004} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="INPUT MONITOR MIX" value="physical, front panel" delay={64} width={356} />
            <SpecCard label="ALSO ON" value="MOTU M6" delay={72} width={224} />
          </div>
        </At>
        <At y={1128} w={880}>
          <Body size={24} color={C.inkSoft}>
            The same knob appears on the M6 — once you have hardware sources, you
            want your hand on the balance.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={2} delay={84} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="knob-detent" at={14} volume={0.72} />
      <Cue name="jack-seat" at={40} volume={0.5} />
      <Cue name="latch" at={66} volume={0.42} />
      <Cue name="latch" at={74} volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S04 — The M4 in the world
// ---------------------------------------------------------------------------
const S04: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(3);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={17} opacity={0.5} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            WHERE THE M4 GOES
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'SYNTHS IN, MICS IN,\nNOTHING UNPLUGGED'}
          </Display>
        </At>

        {/* three in-use contexts, each solved to its own aspect ratio */}
        <SeqShot ids={[13, 14, 17]} dur={dur} y={300} maxW={SAFE.w} maxH={520} fadeF={16} />

        <At y={870} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="REAR LINE INPUTS" value={'2× 1/4" balanced'} delay={30} width={300} />
            <SpecCard label="OUTPUTS" value={'4× TRS + 4× RCA'} delay={38} width={300} />
          </div>
        </At>
        <At y={996} w={880}>
          <Body size={25} color={C.inkSoft}>
            A stereo hardware synth on the rear inputs, two microphones on the
            front — recorded together, in one pass.
          </Body>
        </At>
        <At y={1128} w={SAFE.w}>
          <DistributorBlock part={2} delay={52} size={19} />
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={3} delay={80} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="impact-soft" at={8} volume={0.6} />
      <Cue name="slide-pan" at={66} volume={0.44} />
      <Cue name="slide-pan" at={133} volume={0.44} />
      <Cue name="latch" at={32} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S05 — I/O expansion slide: 2 -> 4 -> 6
// ---------------------------------------------------------------------------
const S05: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(4);
  const h4 = bandHeight(11, SAFE.w, 18);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientMotes part={2} n={26} opacity={0.55} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            THE I/O EXPANSION
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={92} lh={0.88}>
            {'TWO. FOUR. SIX.'}
          </Display>
        </At>

        {/*
          The brief's "I/O Expansion Slide": the camera has to travel further to
          take in the wider connectivity. The M4 rear panel slides out to the
          left as the longer M6 rear panel slides in — a genuine comparison, and
          the one place in this reel where two assets share a beat by design.
        */}
        <BSlide from={0} to={72} fade={14} dx={-150}>
          <Band id={11} dur={dur} y={272} padY={18} />
          <At x={0} y={272 + h4 + 14}>
            <Micro size={14} tracking={2.4} color={C.inkDim}>
              MOTU M4 · REAR · 4 IN / 4 OUT
            </Micro>
          </At>
        </BSlide>
        <BSlide from={72} to={dur} fade={14} dx={190}>
          <Band id={19} dur={dur} y={272} padY={18} />
          <At x={0} y={272 + bandHeight(19, SAFE.w, 18) + 14}>
            <Micro size={14} tracking={2.4} color={C.motu}>
              MOTU M6 · REAR · 6 IN / 4 OUT
            </Micro>
          </At>
        </BSlide>

        {/*
          delay 62, not 78: the bar's growth runs 26 frames, so at 78 it only
          finished at 104 and held 1.5 s of a 150-frame scene. At 62 it lands by
          88 and holds ~2.1 s — it is the scene's payoff and needs to be seen
          settled, not still moving as the cut arrives.
        */}
        <At y={600} w={SAFE.w}>
          <IoBar ins={6} outs={4} max={6} delay={62} animateFrom={4} />
        </At>

        <At y={706} w={880}>
          <Body size={27} color={C.inkSoft}>
            The panel gets longer. The converter, the preamps and the latency
            figure do not change.
          </Body>
        </At>

        {/*
          The three figures that stay identical, in the same form they take in
          Part 1's engine scene and again in S01. This is the load-bearing proof
          of the whole series thesis, so the scene that shows the panel growing
          is exactly where it belongs — and it gives this transition beat real
          content instead of empty space.

          Delays are early because this scene is only 150 frames. Reveals at 88
          and 100 left these on screen for barely 1.7 s, flashing in just as the
          scene dissolves out. Now they settle first and act as the constant, and
          the I/O bar growing 4 -> 6 at frame 78 is the late payoff against them.
        */}
        <At y={840} w={SAFE.w}>
          <SharedSpecStrip items={SHARED_SPECS.slice(0, 3)} delay={30} cols={3} />
        </At>
        <At y={962} w={SAFE.w}>
          <Micro
            size={14}
            tracking={2.4}
            color={C.motu}
            style={{opacity: ramp(f, [48, 66], [0, 1])}}
          >
            IDENTICAL ON M2 · M4 · M6
          </Micro>
        </At>

        <At y={1044} w={SAFE.w}>
          <DistributorBlock part={2} delay={56} size={19} />
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={4} delay={60} />
      </Stage>

      <Cue name="slide-pan" at={0} volume={0.76} />
      <Cue name="slide-pan" at={66} volume={0.8} />
      <Cue name="count-tick" at={78} volume={0.56} />
      <Cue name="count-tick" at={90} volume={0.56} />
      <Cue name="impact-soft" at={96} volume={0.56} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S06 — MOTU M6: four mic preamps
// ---------------------------------------------------------------------------
const S06: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(5);
  const panelW = 512;
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={22} opacity={0.46} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Kicker color={C.motu} size={20} tracking={4.0}>
              MOTU M6
            </Kicker>
            <Rule w={44} color={C.motu} thickness={3} />
            <Micro size={13.5} tracking={2.2} color={C.inkDim}>
              6-IN / 4-OUT USB-C
            </Micro>
          </div>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'FOUR MIC PREAMPS,\nONE DESKTOP BOX'}
          </Display>
        </At>

        {/* the complete M6 front panel — four combo inputs, edge to edge */}
        <Band id={18} dur={dur} y={268} padY={18} />

        {/* six inputs metered live, on the 120 BPM grid */}
        <At x={(SAFE.w - panelW) / 2} y={618}>
          <MeterPanel w={panelW} channels={6} outs={4} delay={30} label="M6 · METERS" />
        </At>

        <At y={1024} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="MIC PREAMPS" value="4× XLR / TRS combo" delay={62} width={330} />
            <SpecCard label="LINE INPUTS" value={'2× 1/4" rear'} delay={70} width={266} />
          </div>
        </At>
        <At y={1148} w={880}>
          <Body size={24} color={C.inkSoft}>
            Four microphones at once — the same −129 dBu preamp on every one of
            them.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={5} delay={90} />
      </Stage>

      <Cue name="impact-deep" at={4} volume={0.76} />
      <Cue name="jack-seat" at={16} volume={0.58} />
      <Cue name="phantom-click" at={24} volume={0.56} />
      <Cue name="phantom-click" at={31} volume={0.52} />
      <Cue name="phantom-click" at={38} volume={0.48} />
      <Cue name="phantom-click" at={45} volume={0.44} />
      <Cue name="meter-bloom" at={32} volume={0.7} />
      <Cue name="latch" at={64} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S07 — The M6 control surface
// ---------------------------------------------------------------------------
const S07: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(6);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={21} opacity={0.44} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            THE CONTROL SURFACE
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'EVERYTHING YOU\nREACH FOR MID-TAKE'}
          </Display>
        </At>

        {/* the macro control-surface shot: mix knob, A/B, and the LCD showing
            six inputs and the B output bus — complete, uncropped */}
        <HeroShot id={20} y={262} maxW={SAFE.w} maxH={608} dur={dur} move={{z: [1.0, 1.038]}} />

        <At y={906} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="A/B MONITOR" value="front-panel switch" delay={40} width={300} />
            <SpecCard label="MONITOR MIX" value="physical knob" delay={48} width={266} />
            <SpecCard label="LCD" value="160 × 120" delay={56} width={230} />
          </div>
        </At>
        <At y={1032} w={880}>
          <Body size={25} color={C.inkSoft}>
            Input balance, monitor selection and full-colour metering — all of it
            on the front panel, where your hands already are.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={6} delay={84} />
      </Stage>

      <Cue name="push-in" at={0} volume={0.54} />
      <Cue name="knob-detent" at={20} volume={0.6} />
      <Cue name="latch" at={42} volume={0.44} />
      <Cue name="latch" at={50} volume={0.42} />
      <Cue name="latch" at={58} volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S08 — Multi-source tracking
// ---------------------------------------------------------------------------
const S08: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(7);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={24} opacity={0.5} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            SIX SOURCES AT ONCE
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'A KIT. A PANEL.\nA BAND IN THE ROOM.'}
          </Display>
        </At>

        {/* three genuine tracking scenarios — a real sequence, not a montage
            engineered for coverage */}
        <SeqShot ids={[24, 25, 27]} dur={dur} y={296} maxW={SAFE.w} maxH={560} fadeF={18} />

        <At y={900} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="SIMULTANEOUS INPUTS" value="6" delay={30} width={294} />
            <SpecCard label="EVERY PREAMP" value="−129 dBu EIN" delay={38} width={294} />
          </div>
        </At>
        <At y={1026} w={880}>
          <Body size={25} color={C.inkSoft}>
            Kick, snare and a pair of overheads. Or four people around a table.
            Or a duo tracked live, together.
          </Body>
        </At>
        <At y={1150} w={SAFE.w}>
          <IoBar ins={6} outs={4} max={6} delay={52} animateFrom={6} />
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={7} delay={90} />
      </Stage>

      <Cue name="impact-deep" at={4} volume={0.7} />
      <Cue name="slide-pan" at={80} volume={0.46} />
      <Cue name="slide-pan" at={162} volume={0.46} />
      <Cue name="latch" at={32} volume={0.42} />
      <Cue name="count-tick" at={54} volume={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S09 — A/B monitoring + dual headphone outputs
// ---------------------------------------------------------------------------
const S09: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(8);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={26} opacity={0.48} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            REFERENCE & CUE
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'TWO SPEAKER PAIRS,\nTWO HEADPHONE MIXES'}
          </Display>
        </At>
        <At y={252} w={860}>
          <Sub size={26}>
            Switch monitors from the front panel to check a mix, and send the
            second headphone output its own 3-4 cue.
          </Sub>
        </At>

        {/* a justified pairing: speakers on one side, headphones on the other —
            the two halves of the claim */}
        <Pair ids={[26, 21]} dur={dur} y={392} maxH={392} delay={20} stagger={10} />

        <At y={834} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="A/B MONITOR SWITCH" value="front panel" delay={48} width={324} />
            <SpecCard label="HEADPHONE OUTS" value={'2× 1/4" TRS'} delay={56} width={286} />
          </div>
        </At>
        <At y={958} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="SECOND OUTPUT" value="3-4 routing switch" delay={64} width={330} />
            <SpecCard label="TRS OUTPUTS" value="4× balanced, DC-coupled" delay={72} width={378} />
          </div>
        </At>
        <At y={1086} w={880}>
          <Body size={24} color={C.inkSoft}>
            The monitor-controller job, handled on the interface itself.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={8} delay={88} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="knob-detent" at={22} volume={0.5} />
      <Cue name="phantom-click" at={50} volume={0.62} />
      <Cue name="phantom-click" at={58} volume={0.56} />
      <Cue name="latch" at={66} volume={0.42} />
      <Cue name="latch" at={74} volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S10 — Standalone DC power
// ---------------------------------------------------------------------------
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(9);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={29} opacity={0.5} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            POWER, UNTETHERED
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'RUNS WITHOUT A\nCOMPUTER ATTACHED'}
          </Display>
        </At>
        <At y={252} w={860}>
          <Sub size={26}>
            The M6 ships with a multi-blade international DC adapter — monitor
            standalone, or power up from an older USB-A host.
          </Sub>
        </At>

        <Pair ids={[29, 23]} dur={dur} y={396} maxH={392} delay={18} stagger={10} />

        <At y={838} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="POWER" value="USB-C bus or DC adapter" delay={44} width={374} />
            <SpecCard label="UNIQUE TO" value="MOTU M6" delay={52} width={236} />
          </div>
        </At>
        <At y={962} w={880}>
          <Body size={24} color={C.inkSoft}>
            The M2 and M4 run bus-powered over USB-C, each with its own power
            switch.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={0} delay={80} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="jack-seat" at={20} volume={0.6} />
      <Cue name="sub-bloom" at={26} volume={0.4} />
      <Cue name="latch" at={46} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S11 — Included software
// ---------------------------------------------------------------------------
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(10);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientMotes part={2} n={20} opacity={0.5} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            IN EVERY BOX
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'READY TO RECORD\nOUT OF THE BOX'}
          </Display>
        </At>

        <ScreenShot id={30} dur={dur} y={288} maxW={SAFE.w} maxH={330} move={{z: [1.0, 1.028]}} />

        <At y={664} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="DAW" value="Performer Lite" delay={26} width={286} />
            <SpecCard label="ALSO" value="Ableton Live Lite" delay={34} width={308} />
          </div>
        </At>
        <At y={790} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="LOOPS" value="6 GB" delay={42} width={200} />
            <SpecCard label="INSTRUMENTS" value="100+ virtual" delay={50} width={286} />
          </div>
        </At>
        <At y={918} w={880}>
          <Body size={25} color={C.inkSoft}>
            The identical bundle ships with the M2, the M4 and the M6.
          </Body>
        </At>
        <At y={1010} w={SAFE.w}>
          <DistributorBlock part={2} delay={60} size={19} />
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={3} delay={78} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="impact-soft" at={10} volume={0.56} />
      <Cue name="latch" at={28} volume={0.42} />
      <Cue name="latch" at={36} volume={0.4} />
      <Cue name="latch" at={44} volume={0.38} />
      <Cue name="latch" at={52} volume={0.36} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S12 — The range: three sizes, three Market Operating Prices
// ---------------------------------------------------------------------------
const RangeCard: React.FC<{
  name: string;
  io: string;
  amount: string;
  delay: number;
  highlight?: boolean;
}> = ({name, io, amount, delay, highlight = false}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 18], [0, 1]);
  return (
    <div
      style={{
        flex: 1,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        backgroundColor: highlight ? C.ink : C.paperHi,
        border: `1px solid ${highlight ? C.ink : C.line}`,
        borderTop: `4px solid ${C.motu}`,
        borderRadius: 9,
        padding: '13px 15px 15px',
        boxShadow: '0 16px 36px -26px rgba(10,16,23,0.32)',
      }}
    >
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 34,
          lineHeight: 1,
          color: highlight ? C.paperHi : C.ink,
          letterSpacing: 0.2,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 500,
          fontSize: 14,
          letterSpacing: 1.1,
          color: highlight ? C.motuOnDark : C.inkDim,
          marginTop: 6,
        }}
      >
        {io}
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 30,
          color: highlight ? C.paperHi : C.ink,
          marginTop: 10,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}
      >
        {amount}
      </div>
    </div>
  );
};

const S12: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(11);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientPhoto id={28} opacity={0.48} />
        <PartMark part={2} label={P2MARK} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            THE RANGE
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={84} lh={0.88}>
            {'PICK THE SIZE.\nNOT THE QUALITY.'}
          </Display>
        </At>

        <Pair ids={[28, 22]} dur={dur} y={286} maxH={330} delay={14} stagger={9} />

        <At y={666} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12, alignItems: 'stretch'}}>
            <RangeCard name="M2" io="2 IN / 2 OUT" amount={MOP.M2} delay={34} />
            <RangeCard name="M4" io="4 IN / 4 OUT" amount={MOP.M4} delay={42} />
            <RangeCard name="M6" io="6 IN / 4 OUT" amount={MOP.M6} delay={50} highlight />
          </div>
        </At>
        <At y={866} w={SAFE.w}>
          <Micro size={15} tracking={1.9} color={C.inkSoft}>
            PER UNIT · MARKET OPERATING PRICE (MOP) · INCL. GST
          </Micro>
        </At>

        <At y={926} w={SAFE.w}>
          <IoBar ins={6} outs={4} max={6} delay={58} animateFrom={2} label="THE WHOLE RANGE" />
        </At>

        <At y={1046} w={880}>
          <Body size={25} color={C.inkSoft}>
            One converter. One preamp specification. One latency figure. Three
            sizes.
          </Body>
        </At>

        <ContactStrip part={2} y={1272} dur={dur} index={1} delay={78} />
      </Stage>

      <Cue name="impact-deep" at={4} volume={0.7} />
      <Cue name="count-tick" at={36} volume={0.5} />
      <Cue name="count-tick" at={44} volume={0.5} />
      <Cue name="count-tick" at={52} volume={0.54} />
      <Cue name="shimmer-warm" at={58} volume={0.4} />
      <Cue name="riser-warm" at={dur - 42} volume={0.56} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P2S13 — The definitive CTA close of the series
// ---------------------------------------------------------------------------
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(12);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={2}>
        <AmbientMotes part={2} n={24} opacity={0.5} />
        <PartMark part={2} label={P2MARK} dur={dur} />
        <Outro part={2} dur={dur} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.52} />
      <Cue name="impact-deep" at={8} volume={0.66} />
      <Cue name="latch" at={40} volume={0.4} />
      <Cue name="latch" at={48} volume={0.38} />
      <Cue name="latch" at={56} volume={0.36} />
      <Cue name="shimmer-warm" at={66} volume={0.46} />
      <Cue name="chime-final" at={dur - 108} volume={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const part2Scenes: SceneNode[] = [
  {...PART2[0], node: <S01 />},
  {...PART2[1], node: <S02 />},
  {...PART2[2], node: <S03 />},
  {...PART2[3], node: <S04 />},
  {...PART2[4], node: <S05 />},
  {...PART2[5], node: <S06 />},
  {...PART2[6], node: <S07 />},
  {...PART2[7], node: <S08 />},
  {...PART2[8], node: <S09 />},
  {...PART2[9], node: <S10 />},
  {...PART2[10], node: <S11 />},
  {...PART2[11], node: <S12 />},
  {...PART2[12], node: <S13 />},
];
