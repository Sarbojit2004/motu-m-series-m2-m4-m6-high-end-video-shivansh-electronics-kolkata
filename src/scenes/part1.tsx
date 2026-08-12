import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F, PART1, SAFE} from '../lib/theme';
import {CONTINUITY, MOP, PART_TITLE, SHARED_SPECS} from '../lib/copy';
import {EASE_CAMERA, ramp, sceneIn, stag} from '../lib/anim';
import {AmbientPhoto, AmbientMotes, At, Stage} from '../components/Stage';
import {Band, HeroShot, Trio} from '../components/Media';
import {
  Body,
  Chip,
  CountUp,
  Display,
  Kicker,
  Micro,
  MopTag,
  Rule,
  SpecCard,
  Sub,
} from '../components/Type';
import {
  CvModular,
  IoBar,
  LoopbackPath,
  MeterPanel,
  SharedDac,
  SharedDacLabel,
  SharedSpecStrip,
} from '../components/Diagram';
import {ContactStrip, DistributorBlock, Outro, PartMark} from '../components/Brand';
import {Cue, TickRun} from '../components/Cue';
import {SceneNode} from '../components/Reel';

/**
 * PART 1 — "THE ENGINE"
 *
 * Establishes MOTU's heritage and the shared ESS Sabre32 Ultra DAC / 120 dB /
 * −129 dBu EIN / 2.5 ms engine that anchors the whole line, using the M2 as the
 * vehicle for that explanation. Per the brief's Beat 1 logic the M2 possesses
 * every core spec, which makes it the right canvas to teach the technology once
 * — so Part 2 never has to re-prove audio quality.
 *
 * NARRATIVE GUARD. Nothing here frames the M2 as a compromise or an entry
 * tier. It is presented as the same instrument at the smallest scale: "every
 * core spec, in the smallest body". No other interface brand is named,
 * referenced or implied.
 *
 * PACING. Nine distinct assets across 88 s. Every scene carries a single hero
 * image with real screen time, composed to its own aspect ratio; the vector
 * diagrams carry the beats that photography cannot.
 *
 * LAYOUT. All coordinates are inside the 936 x 1330 primary safe rect, so
 * nothing critical enters the 0-250 or 1580-1920 ambient strips or the 72px
 * side margins.
 */

const D = (i: number) => PART1[i].dur;

// ---------------------------------------------------------------------------
// P1S01 — Hook: the same flagship engine, three sizes
// ---------------------------------------------------------------------------
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(0);
  // No supplied image shows all three units together, so the family is
  // established by stacking the three front panels — the ascending input count
  // is then readable at a glance. The M4/M6 panels are counted toward Part 2;
  // this is a cameo.
  const TRIO: [number, number, number] = [1, 10, 18];
  // 700px keeps the three stacked bands inside the 670px of vertical room the
  // safe rect leaves below the headline; Trio centres them itself.
  const trioW = 700;

  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={4} opacity={0.5} />
        <AmbientMotes part={1} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            MOTU M-SERIES · M2 · M4 · M6
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={84} lh={0.88}>
            {'THE SAME FLAGSHIP\nENGINE. THREE SIZES.'}
          </Display>
        </At>
        <At y={262} w={820}>
          <Sub size={28} color={C.inkSoft}>
            Identical conversion. Identical preamps. Identical latency. You choose
            how many channels you need — not how good it sounds.
          </Sub>
        </At>

        {/* the three front panels, each complete edge to edge; unit tags sit
            below the stack rather than over any plate */}
        <Trio ids={TRIO} dur={dur} y={368} w={trioW} delay={16} stagger={16} padY={14} />

        <At y={1032} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12, justifyContent: 'center'}}>
            {[
              {n: 'M2', io: '2 IN / 2 OUT'},
              {n: 'M4', io: '4 IN / 4 OUT'},
              {n: 'M6', io: '6 IN / 4 OUT'},
            ].map((u, i) => {
              const p = ramp(f, [stag(i, 7, 74), stag(i, 7, 74) + 16], [0, 1]);
              return (
                <div
                  key={u.n}
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * 10}px)`,
                    backgroundColor: C.paperHi,
                    border: `1px solid ${C.lineSoft}`,
                    borderTop: `3px solid ${C.motu}`,
                    borderRadius: 7,
                    padding: '10px 20px 11px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: F.display,
                      fontWeight: 800,
                      fontSize: 32,
                      lineHeight: 1,
                      color: C.ink,
                    }}
                  >
                    {u.n}
                  </div>
                  <Micro size={12.5} tracking={1.6} color={C.inkDim} style={{marginTop: 5}}>
                    {u.io}
                  </Micro>
                </div>
              );
            })}
          </div>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={0} delay={100} />
      </Stage>

      <Cue name="reverse-swell" at={0} volume={0.7} />
      <Cue name="impact-deep" at={10} volume={0.85} />
      <Cue name="jack-seat" at={20} volume={0.6} />
      <Cue name="jack-seat" at={36} volume={0.6} />
      <Cue name="jack-seat" at={52} volume={0.62} />
      <Cue name="latch" at={78} volume={0.5} />
      <Cue name="latch" at={85} volume={0.46} />
      <Cue name="latch" at={92} volume={0.44} />
      <Cue name="riser-warm" at={dur - 46} volume={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S02 — MOTU heritage
// ---------------------------------------------------------------------------
const S02: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(1);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={4} opacity={0.52} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            MARK OF THE UNICORN
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'A PROFESSIONAL AUDIO\nCOMPANY, ON YOUR DESK'}
          </Display>
        </At>
        <At y={252} w={860}>
          <Sub size={27}>
            Founded in Cambridge, Massachusetts in 1980, developing professional
            computer-based audio technology and music software since 1984.
          </Sub>
        </At>

        <HeroShot id={4} y={392} maxW={SAFE.w} maxH={470} dur={dur} move={{z: [1.0, 1.035]}} />

        <At y={900} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="FOUNDED" value="1980 · Cambridge, MA" delay={40} width={300} />
            <SpecCard label="PRO AUDIO SINCE" value="1984" delay={48} width={196} />
            <SpecCard label="M-SERIES LINE" value="M2 · M4 · M6" delay={56} width={272} />
          </div>
        </At>
        <At y={1024} w={880}>
          <Body size={25} color={C.inkSoft}>
            The M-Series distils that studio, broadcast and film-scoring
            engineering into a desktop enclosure.
          </Body>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={1} delay={80} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.6} />
      <Cue name="impact-soft" at={10} volume={0.66} />
      <Cue name="push-in" at={24} volume={0.42} />
      <Cue name="latch" at={42} volume={0.5} />
      <Cue name="latch" at={50} volume={0.46} />
      <Cue name="latch" at={58} volume={0.44} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S03 — The shared engine: ESS Sabre32 Ultra DAC
// ---------------------------------------------------------------------------
const S03: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(2);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={3} opacity={0.44} />
        <AmbientMotes part={1} n={20} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            THE SHARED ENGINE
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'ONE AUDIO ENGINE\nACROSS ALL THREE'}
          </Display>
        </At>

        {/* the microchip motif "stamps" in — brief Section 11 */}
        <At y={286} w={SAFE.w}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <SharedDac size={210} delay={14} />
          </div>
        </At>
        <At y={512} w={SAFE.w}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <SharedDacLabel delay={40} />
          </div>
        </At>

        <At y={566} w={SAFE.w}>
          <SharedSpecStrip items={SHARED_SPECS} delay={52} cols={3} />
        </At>

        <At y={790} w={880}>
          <Body size={26} color={C.inkSoft}>
            The same converter, the same preamp specification and the same latency
            figure, whether you are recording two channels or six.
          </Body>
        </At>

        <HeroShot id={3} y={904} maxW={SAFE.w} maxH={258} dur={dur} move={{z: [1.0, 1.025]}} />

        <ContactStrip part={1} y={1272} dur={dur} index={2} delay={100} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="chip-stamp" at={14} volume={0.95} />
      <Cue name="sub-bloom" at={16} volume={0.5} />
      <Cue name="latch" at={54} volume={0.44} />
      <Cue name="latch" at={62} volume={0.42} />
      <Cue name="latch" at={70} volume={0.4} />
      <Cue name="latch" at={78} volume={0.38} />
      <Cue name="impact-soft" at={104} volume={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S04 — 120 dB dynamic range
// ---------------------------------------------------------------------------
const S04: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(3);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={7} opacity={0.5} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            HEADROOM
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={84} lh={0.88}>
            {'MASSIVE HEADROOM,\nBY DESIGN'}
          </Display>
        </At>

        <At y={266} w={SAFE.w}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 18}}>
            <CountUp to={120} dur={44} delay={12} size={138} suffix="dB" color={C.ink} />
            <Micro size={14} tracking={2.2} color={C.inkDim} style={{paddingBottom: 22}}>
              DYNAMIC RANGE
            </Micro>
          </div>
        </At>

        <At y={432} w={870}>
          <Sub size={27}>
            120 dB of dynamic range on the main balanced outputs — the quiet
            detail in a mix survives, and the loud parts have room to go.
          </Sub>
        </At>

        <HeroShot id={7} y={566} maxW={SAFE.w} maxH={420} dur={dur} move={{z: [1.0, 1.032]}} />

        <At y={1016} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="DYNAMIC RANGE" value="120 dB · main outputs" delay={54} width={340} />
            <SpecCard label="CONVERSION" value="24-bit / 192 kHz" delay={62} width={286} />
          </div>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={3} delay={84} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="riser-warm" at={6} volume={0.5} />
      <Cue name="impact-deep" at={54} volume={0.72} />
      <Cue name="push-in" at={62} volume={0.4} />
      <Cue name="latch" at={56} volume={0.44} />
      <Cue name="latch" at={64} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S05 — −129 dBu EIN preamps
// ---------------------------------------------------------------------------
const S05: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(4);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={5} opacity={0.5} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            THE NOISE FLOOR
          </Kicker>
        </At>
        {/* caps={false} because the headline carries a unit: uppercasing would
            render "dBu" as "DBU", which is wrong for a spec-driven brief. The
            copy is authored in the exact case it should display. */}
        <At y={98} w={SAFE.w}>
          <Display size={78} lh={0.88} caps={false}>
            {'−129 dBu EIN ON\nEVERY MIC PREAMP'}
          </Display>
        </At>
        <At y={252} w={860}>
          <Sub size={27}>
            Drive a gain-hungry dynamic microphone hard and the signal path stays
            clean — no hiss to subtract afterwards.
          </Sub>
        </At>

        <HeroShot id={5} y={378} maxW={SAFE.w} maxH={490} dur={dur} move={{z: [1.0, 1.034]}} />

        <At y={906} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="MIC PREAMP EIN" value="−129 dBu" delay={44} width={250} />
            <SpecCard label="PHANTOM POWER" value="48 V, per input" delay={52} width={286} />
            <SpecCard label="MONITORING" value="1-touch, per input" delay={60} width={314} />
          </div>
        </At>
        <At y={1032} w={880}>
          <Body size={24} color={C.inkSoft}>
            Independent gain, independent 48 V and a dedicated hardware monitor
            button on each channel.
          </Body>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={4} delay={84} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="impact-soft" at={10} volume={0.62} />
      <Cue name="phantom-click" at={46} volume={0.7} />
      <Cue name="phantom-click" at={54} volume={0.6} />
      <Cue name="latch" at={62} volume={0.44} />
      <Cue name="push-in" at={28} volume={0.36} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S06 — The metering reveal (live animated LCD)
// ---------------------------------------------------------------------------
const S06: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(5);
  const panelW = 548;
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={3} opacity={0.44} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            THE METERING REVEAL
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={80} lh={0.88}>
            {'SEE EXACTLY WHAT\nYOU ARE RECORDING'}
          </Display>
        </At>

        {/* Vector LCD with meters locked to the 120 BPM bed — a photograph
            cannot bounce, and the brief asks for live metering. */}
        <At x={(SAFE.w - panelW) / 2} y={272}>
          <MeterPanel w={panelW} channels={2} outs={2} delay={12} label="M2 · METERS" />
        </At>

        {/* the real front panel, complete, edge to edge */}
        <Band id={1} dur={dur} y={718} padY={18} />

        <At y={1000} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="LCD DISPLAY" value="160 × 120, full colour" delay={64} width={330} />
            <SpecCard label="METERED" value="every input & output" delay={72} width={306} />
          </div>
        </At>
        <At y={1124} w={880}>
          <Body size={24} color={C.inkSoft}>
            Real-time level detail instead of a single clipping LED — gain staging
            becomes something you can simply look at.
          </Body>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={5} delay={100} />
      </Stage>

      <Cue name="push-in" at={0} volume={0.56} />
      <Cue name="meter-bloom" at={14} volume={0.8} />
      <TickRun from={40} count={10} every={15} volume={0.2} hi />
      <Cue name="jack-seat" at={100} volume={0.56} />
      <Cue name="latch" at={66} volume={0.44} />
      <Cue name="latch" at={74} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S07 — 2.5 ms round-trip latency
// ---------------------------------------------------------------------------
const LatencyTrack: React.FC<{w: number; delay: number}> = ({w, delay}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 34], [0, 1], EASE_CAMERA);
  const dotX = 20 + (w - 40) * p;
  return (
    <div style={{width: w, position: 'relative', height: 92}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 44,
          width: w,
          height: 4,
          borderRadius: 3,
          backgroundColor: C.paperDeep,
          border: `1px solid ${C.lineSoft}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 44,
          width: w * p,
          height: 4,
          borderRadius: 3,
          backgroundColor: C.motu,
        }}
      />
      {[
        {t: 0, l: 'INPUT'},
        {t: 1, l: 'OUTPUT'},
      ].map((m) => (
        <div
          key={m.l}
          style={{
            position: 'absolute',
            left: m.t === 0 ? 0 : undefined,
            right: m.t === 1 ? 0 : undefined,
            top: 6,
            textAlign: m.t === 0 ? 'left' : 'right',
          }}
        >
          <Micro size={13} tracking={2.2} color={C.inkDim}>
            {m.l}
          </Micro>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: dotX - 7,
          top: 37,
          width: 14,
          height: 14,
          borderRadius: 14,
          backgroundColor: C.motu,
          boxShadow: `0 0 14px ${C.motu}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 62,
          textAlign: 'center',
        }}
      >
        <Micro size={14} tracking={2.4} color={C.motu} caps={false}>
          2.5 ms ROUND TRIP · 96 kHz · 32-SAMPLE BUFFER
        </Micro>
      </div>
    </div>
  );
};

const S07: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(6);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={8} opacity={0.5} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            REAL-TIME MONITORING
          </Kicker>
        </At>
        {/* caps={false} — see the note in S05: "ms" must not become "MS". */}
        <At y={98} w={SAFE.w}>
          <Display size={86} lh={0.88} caps={false}>
            {'2.5 ms ROUND-TRIP\nLATENCY'}
          </Display>
        </At>
        <At y={250} w={860}>
          <Sub size={27}>
            Track through amp simulators and heavy reverbs and the timing still
            feels immediate — nothing to play around.
          </Sub>
        </At>

        <At y={368} w={SAFE.w}>
          <LatencyTrack w={SAFE.w} delay={14} />
        </At>

        <HeroShot id={8} y={490} maxW={SAFE.w} maxH={430} dur={dur} move={{z: [1.0, 1.03]}} />

        <At y={958} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="ROUND-TRIP LATENCY" value="2.5 ms @ 96 kHz" delay={52} width={342} />
            <SpecCard label="BUFFER" value="32 samples" delay={60} width={244} />
          </div>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={6} delay={84} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <TickRun from={14} count={9} every={15} volume={0.26} hi />
      <Cue name="impact-soft" at={48} volume={0.6} />
      <Cue name="latch" at={54} volume={0.44} />
      <Cue name="latch" at={62} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S08 — MOTU M2, the unit
// ---------------------------------------------------------------------------
const S08: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(7);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={3} opacity={0.46} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Kicker color={C.motu} size={20} tracking={4.0}>
              MOTU M2
            </Kicker>
            <Rule w={44} color={C.motu} thickness={3} />
            <Micro size={13.5} tracking={2.2} color={C.inkDim}>
              2-IN / 2-OUT USB-C
            </Micro>
          </div>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'EVERY CORE SPEC,\nIN THE SMALLEST BODY'}
          </Display>
        </At>

        <HeroShot id={3} y={288} maxW={SAFE.w} maxH={462} dur={dur} move={{z: [1.0, 1.034]}} />

        <At y={790} w={SAFE.w}>
          <IoBar ins={2} outs={2} max={6} delay={30} animateFrom={0} />
        </At>

        <At y={888} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="INPUTS" value="2× XLR / TRS combo" delay={46} width={318} />
            <SpecCard label="OUTPUTS" value="2× TRS + 2× RCA" delay={54} width={300} />
          </div>
        </At>

        <At y={1010}>
          <MopTag product="M2" amount={MOP.M2} delay={66} />
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={7} delay={90} />
      </Stage>

      <Cue name="impact-deep" at={4} volume={0.78} />
      <Cue name="push-in" at={12} volume={0.44} />
      <Cue name="count-tick" at={32} volume={0.5} />
      <Cue name="count-tick" at={44} volume={0.5} />
      <Cue name="latch" at={48} volume={0.44} />
      <Cue name="latch" at={56} volume={0.42} />
      <Cue name="shimmer-warm" at={66} volume={0.34} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S09 — M2 rear panel + DC-coupled CV
// ---------------------------------------------------------------------------
const S09: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(8);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={8} opacity={0.44} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            M2 · REAR PANEL
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={78} lh={0.88}>
            {'DC-COUPLED OUTPUTS,\n5-PIN MIDI'}
          </Display>
        </At>

        {/* the complete rear panel, edge to edge — nothing trimmed */}
        <Band id={2} dur={dur} y={266} padY={18} />

        <At y={556} w={SAFE.w}>
          <CvModular delay={26} />
        </At>

        <At y={776} w={880}>
          <Body size={25} color={C.inkSoft}>
            Because the TRS outputs are DC-coupled, they can send control voltage
            straight from your session to a modular rig.
          </Body>
        </At>

        <At y={900} w={SAFE.w}>
          <div style={{display: 'flex', gap: 12}}>
            <SpecCard label="TRS OUTPUTS" value="2× balanced, DC-coupled" delay={58} width={358} />
            <SpecCard label="MIDI" value="5-pin in & out" delay={66} width={254} />
          </div>
        </At>
        <At y={1024} w={880}>
          <Body size={24} color={C.inkSoft}>
            Two mirrored RCA outputs sit alongside them, and the whole unit runs
            bus-powered over USB-C.
          </Body>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={8} delay={90} />
      </Stage>

      <Cue name="slide-pan" at={0} volume={0.7} />
      <Cue name="jack-seat" at={18} volume={0.6} />
      <Cue name="voltage-line" at={30} volume={0.66} />
      <Cue name="latch" at={60} volume={0.44} />
      <Cue name="latch" at={68} volume={0.42} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S10 — Driver loopback
// ---------------------------------------------------------------------------
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(9);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={9} opacity={0.5} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            DRIVER LOOPBACK
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={78} lh={0.88}>
            {'STREAM WITHOUT A\nVIRTUAL CABLE'}
          </Display>
        </At>

        <At y={256} w={SAFE.w}>
          <LoopbackPath delay={14} h={424} />
        </At>

        <HeroShot id={9} y={708} maxW={SAFE.w} maxH={330} dur={dur} move={{z: [1.0, 1.03]}} />

        <At y={1064} w={880}>
          <Body size={25} color={C.inkSoft}>
            Computer playback and a live microphone merge inside the driver and
            leave as one clean feed — useful the moment you start a podcast or a
            livestream.
          </Body>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={4} delay={92} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="latch" at={16} volume={0.46} />
      <Cue name="latch" at={26} volume={0.44} />
      <Cue name="latch" at={34} volume={0.42} />
      <Cue name="voltage-line" at={44} volume={0.36} />
      <Cue name="impact-soft" at={52} volume={0.56} />
      <Cue name="push-in" at={70} volume={0.36} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S11 — The M2 in the world + Market Operating Price
// ---------------------------------------------------------------------------
const S11: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(10);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientPhoto id={6} opacity={0.52} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={62}>
          <Kicker color={C.motu} size={20} tracking={4.0}>
            WHERE THE M2 GOES
          </Kicker>
        </At>
        <At y={98} w={SAFE.w}>
          <Display size={82} lh={0.88}>
            {'COMPACT, BUS-POWERED,\nREADY TO TRACK'}
          </Display>
        </At>

        <HeroShot id={6} y={272} maxW={SAFE.w} maxH={470} dur={dur} move={{z: [1.0, 1.036]}} />

        <At y={776}>
          <MopTag product="M2" amount={MOP.M2} delay={26} />
        </At>

        <At y={900} w={SAFE.w}>
          <DistributorBlock part={1} delay={44} size={21} />
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={2} delay={80} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="impact-soft" at={10} volume={0.6} />
      <Cue name="shimmer-warm" at={26} volume={0.36} />
      <Cue name="latch" at={46} volume={0.44} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S12 — Continuation into Part 2
// ---------------------------------------------------------------------------
const S12: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(11);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientMotes part={1} n={28} opacity={0.6} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />

        <At y={272} w={SAFE.w}>
          <Kicker color={C.motu} size={19} tracking={4.4} style={{textAlign: 'center'}}>
            {CONTINUITY[1].kicker}
          </Kicker>
        </At>
        <At y={330} w={SAFE.w}>
          <Display size={98} lh={0.9} align="center">
            {'SAME ENGINE.\nTWO MORE SIZES.'}
          </Display>
        </At>

        <At y={580} w={SAFE.w}>
          <IoBar ins={2} outs={2} max={6} delay={18} animateFrom={0} label="THIS PART · M2" />
        </At>

        <At y={706} w={SAFE.w}>
          <div style={{display: 'flex', justifyContent: 'center', gap: 12}}>
            {['MOTU M4 · 4 IN / 4 OUT', 'MOTU M6 · 6 IN / 4 OUT'].map((s, i) => {
              const p = ramp(f, [stag(i, 8, 40), stag(i, 8, 40) + 18], [0, 1]);
              return (
                <div key={s} style={{opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
                  <Chip bg={C.ink} size={16}>
                    {s}
                  </Chip>
                </div>
              );
            })}
          </div>
        </At>
        <At y={790} w={SAFE.w}>
          <Micro
            size={15}
            tracking={2.8}
            color={C.inkDim}
            style={{textAlign: 'center', opacity: ramp(f, [56, 74], [0, 1])}}
          >
            CONTINUE TO PART 2 — THE SCALE-UP
          </Micro>
        </At>

        <ContactStrip part={1} y={1272} dur={dur} index={0} delay={40} />
      </Stage>

      <Cue name="riser-warm" at={0} volume={0.62} />
      <Cue name="impact-deep" at={16} volume={0.8} />
      <Cue name="count-tick" at={22} volume={0.52} />
      <Cue name="shimmer-warm" at={44} volume={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// P1S13 — CTA & Shivansh Electronics outro
// ---------------------------------------------------------------------------
const S13: React.FC = () => {
  const f = useCurrentFrame();
  const dur = D(12);
  return (
    <AbsoluteFill style={{opacity: sceneIn(f)}}>
      <Stage part={1}>
        <AmbientMotes part={1} n={22} opacity={0.5} />
        <PartMark part={1} label={`PART 1 OF 2 · ${PART_TITLE[1]}`} dur={dur} />
        <Outro part={1} dur={dur} />
      </Stage>

      <Cue name="air-open" at={0} volume={0.5} />
      <Cue name="impact-soft" at={8} volume={0.6} />
      <Cue name="latch" at={40} volume={0.4} />
      <Cue name="latch" at={48} volume={0.38} />
      <Cue name="shimmer-warm" at={62} volume={0.44} />
      <Cue name="chime-final" at={dur - 96} volume={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const part1Scenes: SceneNode[] = [
  {...PART1[0], node: <S01 />},
  {...PART1[1], node: <S02 />},
  {...PART1[2], node: <S03 />},
  {...PART1[3], node: <S04 />},
  {...PART1[4], node: <S05 />},
  {...PART1[5], node: <S06 />},
  {...PART1[6], node: <S07 />},
  {...PART1[7], node: <S08 />},
  {...PART1[8], node: <S09 />},
  {...PART1[9], node: <S10 />},
  {...PART1[10], node: <S11 />},
  {...PART1[11], node: <S12 />},
  {...PART1[12], node: <S13 />},
];
