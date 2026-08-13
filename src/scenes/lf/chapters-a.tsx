import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, LF_CONTENT, T} from '../../lib/lf-theme';
import {SHARED_SPECS} from '../../lib/copy';
import {Body, Kicker, Micro, Rule, Spec} from '../../components/Type';
import {KineticLines} from '../../components/lf/LFType';
import {B} from '../../components/Beat';
import {At, Col, LFBackdrop, LFMotes, LFStage, Rise} from '../../components/lf/LFStage';
import {Hero, PanelBand, Shot} from '../../components/lf/LFMedia';
import {Cue, TickRun} from '../../components/lf/LFCue';
import {
  ChipMotif,
  CvDiagram,
  IoBar,
  LcdMeters,
  LoopbackDiagram,
} from '../../components/lf/LFDiagram';
import {MopChip, SceneBranding} from '../../components/lf/LFBrand';
import {EASE_OUT, ramp} from '../../lib/anim';
import {fitBox} from '../../lib/images';

/**
 * CHAPTERS 1-3 — the promise, the shared engine, and the MOTU M2.
 *
 * Pacing follows Section 3: one hero asset per beat, given real screen time and
 * real compositional weight. Scenes average nine seconds, which is roughly
 * three times what a montage-driven cut would allow, and the layouts use that
 * room rather than filling it with more assets.
 *
 * Every photograph is drawn through Hero / PanelBand / Pair / Row, all of which
 * solve their box from the asset's true ratio and fit with `contain`. Nothing
 * is cropped anywhere in this file.
 */

const HEAD_Y = 150;

/** Standard left text column + right hero. */
const SplitR: React.FC<{
  kicker: string;
  head: string;
  sub?: string;
  children?: React.ReactNode;
  headSize?: number;
}> = ({kicker, head, sub, children, headSize = T.display}) => (
  <Col x={LF_CONTENT.x} y={HEAD_Y} w={764}>
    <Rise delay={4}>
      <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
        {kicker}
      </Kicker>
    </Rise>
    <Rise delay={9}>
      <Rule w={112} color={C.motu} thickness={5} style={{marginTop: 15, marginBottom: 22}} />
    </Rise>
    <KineticLines text={head} size={headSize} weight={800} delay={12} per={2.6} lh={0.93} />
    {sub ? (
      <Rise delay={30} style={{marginTop: 24}}>
        <Body size={T.sub} color={C.inkSoft} lh={1.36} weight={500}>
          {sub}
        </Body>
      </Rise>
    ) : null}
    {children}
  </Col>
);

/** A labelled spec figure — the brief's "supporting specification callout". */
export const SpecCard: React.FC<{k: string; v: string; delay?: number; big?: boolean}> = ({
  k,
  v,
  delay = 0,
  big = false,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 18], [0, 1], EASE_OUT);
  // A "big" figure is only big when the value is short enough to stay one
  // compact line. A long value at 68px overflows the card and, in a stacked
  // column, walks the whole layout off the bottom of the frame.
  const vSize = big ? (v.length <= 9 ? T.specBig : T.spec + 16) : T.spec;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        backgroundColor: C.paperHi,
        border: `1px solid ${C.line}`,
        borderLeft: `4px solid ${C.motu}`,
        borderRadius: 10,
        padding: big ? '20px 26px 18px' : '15px 20px 13px',
        display: 'inline-block',
      }}
    >
      <Micro size={T.micro - 3} color={C.inkDim} tracking={2.4}>
        {k}
      </Micro>
      <Spec
        size={vSize}
        color={C.ink}
        weight={500}
        tracking={0.2}
        style={{marginTop: 7}}
      >
        {v}
      </Spec>
    </div>
  );
};

// ===========================================================================
// CHAPTER 1 — THE PROMISE
// ===========================================================================

/** L01 · 300 — Hook: one engine, three sizes. */
export const L01: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const panels: [number, number, number] = [1, 10, 18];
  return (
    <LFStage>
      <Cue name="air-open" at={0} volume={0.8} />
      <Cue name="chip-stamp" at={16} volume={0.9} />
      <Cue name="impact-deep" at={150} volume={0.7} />
      <LFMotes n={26} opacity={0.34} />

      <B from={0} to={148} fade={16}>
        <Col x={LF_CONTENT.x} y={330} w={1420}>
          <Rise delay={6}>
            <Kicker color={C.motu} size={T.kicker} tracking={5.0}>
              MOTU M-SERIES · M2 · M4 · M6
            </Kicker>
          </Rise>
          <KineticLines
            text={'The exact same flagship studio engine.\nIn three different sizes.'}
            size={T.hero}
            weight={800}
            delay={14}
            per={2.2}
            lh={0.93}
            style={{marginTop: 26}}
          />
        </Col>
      </B>

      <B from={140} to={dur} fade={18}>
        <At x={LF_CONTENT.x} y={116}>
          <Rise delay={6}>
            <Kicker color={C.inkDim} size={T.kicker - 3} tracking={4.2}>
              ONE AUDIO ENGINE · THREE CHANNEL COUNTS
            </Kicker>
          </Rise>
        </At>
        {panels.map((id, i) => {
          const y = 190 + i * 208;
          const box = fitBox(id, LF_CONTENT.x, y, 1180, 170, 'left');
          const p = ramp(f - 140, [10 + i * 14, 34 + i * 14], [0, 1], EASE_OUT);
          return (
            <div key={id} style={{opacity: p, transform: `translateX(${(1 - p) * -26}px)`}}>
              <Shot id={id} box={box} dur={dur - 140} move={{z: [1, 1.012]}} radius={12} />
              <At x={box.x + box.w + 42} y={box.y + box.h / 2 - 40} w={420}>
                <div
                  style={{
                    fontFamily: F.display,
                    fontWeight: 800,
                    fontSize: 54,
                    color: C.ink,
                    lineHeight: 1,
                  }}
                >
                  {['MOTU M2', 'MOTU M4', 'MOTU M6'][i]}
                </div>
                <Spec size={26} color={C.motu} weight={500} style={{marginTop: 9}}>
                  {['2 in / 2 out', '4 in / 4 out', '6 in / 4 out'][i]}
                </Spec>
              </At>
            </div>
          );
        })}
      </B>

      <SceneBranding scene="L01" />
    </LFStage>
  );
};

/** L02 · 280 — the choice creators are handed. */
export const L02: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="reverse-swell" at={0} volume={0.6} />
    <Cue name="impact-soft" at={20} volume={0.6} />
    <LFBackdrop id={7} opacity={0.24} />

    <SplitR
      kicker="THE USUAL TRADE-OFF"
      head={'Cheap and noisy,\nor priced out of reach.'}
      sub={
        'Anyone building a first serious recording setup is handed a binary: budget hardware that puts audible hiss on every vocal take, or studio-tier conversion at a number that does not fit a first investment.'
      }
    />
    <Hero
      id={7}
      dur={dur}
      x={900}
      y={168}
      maxW={860}
      maxH={700}
      vcenter
      move={{z: [1, 1.03]}}
    />
    <SceneBranding scene="L02" />
  </LFStage>
);

/** L03 · 320 — MOTU heritage. */
export const L03: React.FC<{dur: number}> = ({dur}) => {
  return (
    <LFStage>
      <Cue name="chapter-mark" at={0} volume={0.55} />
      <Cue name="spec-reveal" at={90} volume={0.7} />
      <Cue name="spec-reveal" at={128} volume={0.62} />

      <Col x={LF_CONTENT.x} y={196} w={800}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
            MARK OF THE UNICORN
          </Kicker>
        </Rise>
        <Rise delay={9}>
          <Rule w={112} color={C.motu} thickness={5} style={{marginTop: 15, marginBottom: 22}} />
        </Rise>
        <KineticLines
          text={'Cambridge, Massachusetts.\nSince 1980.'}
          size={T.displaySm}
          weight={800}
          delay={12}
          per={2.6}
          lh={0.93}
        />
        <Rise delay={34} style={{marginTop: 22}}>
          <Body size={T.body} color={C.inkSoft} lh={1.38} weight={500}>
            Four decades building professional computer audio hardware — the rack-mounted
            interfaces behind commercial studios, primetime television and film scoring.
          </Body>
        </Rise>
        <div style={{display: 'flex', gap: 14, marginTop: 30}}>
          <SpecCard k="FOUNDED" v="1980" delay={90} />
          <SpecCard k="PRO AUDIO SINCE" v="1984" delay={104} />
        </div>
      </Col>

      <Hero id={3} dur={dur} x={952} y={214} maxW={820} maxH={560} move={{z: [1, 1.026]}} />
      <At x={952} y={796} w={820}>
        <Rise delay={128}>
          <Body size={T.body} color={C.inkSoft} lh={1.4} align="center">
            The M-Series is that engineering brought down to a desktop chassis — not a consumer
            company reaching up, but a professional audio company reaching across.
          </Body>
        </Rise>
      </At>

      <SceneBranding scene="L03" />
    </LFStage>
  );
};

/** L04 · 300 — the M-Series premise + first full branding beat. */
export const L04: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="push-in" at={0} volume={0.6} />
    <Cue name="brand-in" at={62} volume={0.85} />

    <B from={0} to={56} fade={14}>
      <Col x={LF_CONTENT.x} y={352} w={1420}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.6}>
            THE M-SERIES PREMISE
          </Kicker>
        </Rise>
        <KineticLines
          text={'You are not choosing an audio quality tier.'}
          size={T.displaySm}
          weight={800}
          delay={10}
          per={2.2}
          lh={0.95}
          style={{marginTop: 22}}
        />
        <Rise delay={28} style={{marginTop: 18}}>
          <Body size={T.sub} color={C.inkSoft} lh={1.36}>
            You are choosing how many things you need to record at once.
          </Body>
        </Rise>
      </Col>
    </B>

    <B from={52} to={dur} fade={16}>
      <SceneBranding scene="L04" />
    </B>
  </LFStage>
);

// ===========================================================================
// CHAPTER 2 — THE SHARED ENGINE
// ===========================================================================

/** L05 · 300 — ESS Sabre32 Ultra DAC, with the chip motif. */
export const L05: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="chapter-mark" at={0} volume={0.7} />
    <Cue name="chip-stamp" at={52} volume={0.95} />
    <Cue name="spec-reveal" at={150} volume={0.66} />

    <SplitR
      kicker="THE SHARED ENGINE"
      head={'One converter.\nEvery model.'}
      sub={
        'The ESS Sabre32 Ultra™ digital-to-analog converter is not reserved for the largest unit in the range. It is the same part, with the same performance, in all three.'
      }
    >
      <Rise delay={44} style={{marginTop: 30}}>
        <SpecCard k="DAC" v="ESS Sabre32 Ultra™" big />
      </Rise>
    </SplitR>

    <ChipMotif x={1010} y={196} size={250} delay={46} />
    <Hero id={12} dur={dur} x={904} y={498} maxW={880} maxH={380} move={{z: [1, 1.024]}} />
    <At x={904} y={196} w={880}>
      <Rise delay={120}>
        <div style={{textAlign: 'right'}}>
          <Micro size={T.micro} color={C.inkDim} tracking={2.6}>
            IDENTICAL ON M2 · M4 · M6
          </Micro>
        </div>
      </Rise>
    </At>

    <SceneBranding scene="L05" />
  </LFStage>
);

/** L06 · 280 — 120 dB dynamic range. */
export const L06: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const grow = ramp(f, [40, 96], [0, 1], EASE_OUT);
  return (
    <LFStage>
      <Cue name="slide-pan" at={0} volume={0.55} />
      <Cue name="sub-bloom" at={42} volume={0.7} />
      <Cue name="spec-reveal" at={96} volume={0.7} />
      <LFBackdrop id={26} opacity={0.2} />

      <SplitR
        kicker="HEADROOM"
        head={'120 dB of\ndynamic range.'}
        sub={
          'The distance between the quietest detail the converter resolves and the loudest peak it takes without clipping. More headroom means a mix that keeps its nuance instead of flattening.'
        }
      />

      {/* a dynamic-range bar that grows to full scale */}
      <At x={LF_CONTENT.x} y={706} w={720}>
        <div
          style={{
            height: 30,
            borderRadius: 6,
            backgroundColor: C.paperDeep,
            border: `1px solid ${C.line}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${grow * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${C.motu}, ${C.motuMid})`,
            }}
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 11}}>
          <Micro size={T.micro - 3} color={C.inkDim} tracking={2.2}>
            NOISE FLOOR
          </Micro>
          <Micro size={T.micro - 3} color={C.motu} tracking={2.2}>
            120 dB · MAIN OUTPUTS
          </Micro>
        </div>
      </At>

      <Hero id={26} dur={dur} x={904} y={210} maxW={880} maxH={620} vcenter move={{z: [1, 1.03]}} />
      <SceneBranding scene="L06" />
    </LFStage>
  );
};

/** L07 · 270 — −129 dBu EIN preamps. */
export const L07: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="jack-seat" at={14} volume={0.85} />
    <Cue name="phantom-click" at={74} volume={0.8} />
    <Cue name="spec-reveal" at={112} volume={0.66} />

    <At x={LF_CONTENT.x} y={124} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          THE PREAMPS
        </Kicker>
      </Rise>
      <KineticLines
        text={'−129 dBu EIN. Gain without hiss.'}
        size={T.displaySm}
        weight={800}
        delay={10}
        per={2.4}
        lh={0.95}
        style={{marginTop: 20}}
      />
    </At>

    <PanelBand id={1} dur={dur} x={LF_CONTENT.x} y={330} w={1712} move={{z: [1, 1.014]}} />

    <At x={1250} y={614}>
      <SpecCard k="MIC PREAMP EIN" v="−129 dBu" delay={112} big />
    </At>
    <At x={1250} y={742}>
      <SpecCard k="PHANTOM POWER" v="48V, per channel" delay={132} />
    </At>

    <SceneBranding scene="L07" />
  </LFStage>
);

/** L08 · 270 — 2.5 ms round-trip latency. */
export const L08: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="air-open" at={0} volume={0.5} />
    <TickRun from={34} count={12} every={9} volume={0.34} hi />
    <Cue name="spec-reveal" at={148} volume={0.7} />

    <SplitR
      kicker="MONITORING"
      head={'2.5 ms\nround trip.'}
      sub={
        'Measured at 96 kHz with a 32-sample buffer. Fast enough that tracking a part through a virtual amp or a heavy vocal chain feels immediate rather than delayed.'
      }
    >
      <div style={{display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap'}}>
        <SpecCard k="ROUND-TRIP LATENCY" v="2.5 ms" delay={148} />
        <SpecCard k="AT" v="96 kHz / 32 smp" delay={162} />
      </div>
    </SplitR>

    <Hero id={5} dur={dur} x={904} y={196} maxW={880} maxH={640} vcenter move={{z: [1, 1.032]}} />
    <SceneBranding scene="L08" />
  </LFStage>
);

/** L09 · 290 — the LCD metering reveal, with a slow macro push-in. */
export const L09: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="push-in" at={0} volume={0.75} />
    <Cue name="meter-bloom" at={58} volume={0.95} />
    <Cue name="spec-reveal" at={168} volume={0.6} />
    <LFBackdrop id={20} opacity={0.22} blur={62} />

    <At x={LF_CONTENT.x} y={118} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          THE CENTREPIECE
        </Kicker>
      </Rise>
      <KineticLines
        text={'A full-colour meter for every input and output.'}
        size={T.displaySm - 6}
        weight={800}
        delay={10}
        per={2.0}
        lh={0.96}
        style={{marginTop: 18}}
      />
    </At>

    {/* the macro push-in: a slow, eased move into the control surface */}
    <Hero
      id={20}
      dur={dur}
      x={LF_CONTENT.x}
      y={310}
      maxW={880}
      maxH={600}
      move={{z: [1, 1.055], x: [0, -10]}}
    />

    <LcdMeters x={1080} y={330} w={470} h={280} channels={6} delay={58} seed={5} />
    <At x={1080} y={648} w={700}>
      <Rise delay={96}>
        <Body size={T.body + 2} color={C.inkSoft} lh={1.4}>
          160 × 120 pixels of real metering, live on the front panel. Gain staging stops being
          guesswork against a single clip LED and becomes something you can simply read.
        </Body>
      </Rise>
      <div style={{marginTop: 24}}>
        <SpecCard k="LCD METERING" v="160 × 120, full colour" delay={168} />
      </div>
    </At>

    <SceneBranding scene="L09" />
  </LFStage>
);

/** L10 · 150 — the shared-spec recap + branding beat. */
export const L10: React.FC<{dur: number}> = () => (
  <LFStage>
    <Cue name="brand-in" at={18} volume={0.85} />
    <Cue name="latch" at={30} volume={0.5} />

    <Col x={LF_CONTENT.x} y={168} w={860}>
      <Rise delay={2}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          IDENTICAL ON EVERY MODEL
        </Kicker>
      </Rise>
      <Rise delay={7}>
        <Rule w={112} color={C.motu} thickness={5} style={{marginTop: 14, marginBottom: 24}} />
      </Rise>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 13, width: 860}}>
        {SHARED_SPECS.map((s, i) => (
          <SpecCard key={s.k} k={s.k} v={s.v} delay={12 + i * 5} />
        ))}
      </div>
    </Col>

    <SceneBranding scene="L10" />
  </LFStage>
);

// ===========================================================================
// CHAPTER 3 — MOTU M2
// ===========================================================================

/** L11 · 300 — the M2 introduced. */
export const L11: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="chapter-mark" at={0} volume={0.8} />
    <Cue name="impact-deep" at={26} volume={0.66} />
    <Cue name="count-tick" at={96} volume={0.6} />

    <SplitR
      kicker="MOTU M2"
      head={'Two channels.\nEvery core spec.'}
      sub={
        'The smallest interface in the range carries the whole engine — the same converter, the same preamps, the same latency figure, the same full-colour metering.'
      }
    >
      <Rise delay={40} style={{marginTop: 28}}>
        <IoBar w={640} filled={2} label="SIMULTANEOUS INPUTS" right="2 IN / 2 OUT" delay={90} />
      </Rise>
    </SplitR>

    <Hero id={4} dur={dur} x={904} y={210} maxW={880} maxH={600} vcenter move={{z: [1, 1.028]}} />
    <At x={904} y={834} w={880}>
      <Rise delay={150} style={{display: 'flex', justifyContent: 'center'}}>
        <MopChip product="M2" size={0.9} />
      </Rise>
    </At>
  </LFStage>
);

/** L12 · 280 — M2 front panel. */
export const L12: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="slide-pan" at={0} volume={0.6} />
    <Cue name="knob-detent" at={62} volume={0.6} />
    <Cue name="latch" at={120} volume={0.5} />

    <At x={LF_CONTENT.x} y={130} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          M2 · FRONT PANEL
        </Kicker>
      </Rise>
      <KineticLines
        text={'Two combo inputs. One-touch monitoring.'}
        size={T.displaySm - 4}
        weight={800}
        delay={10}
        per={2.2}
        lh={0.95}
        style={{marginTop: 18}}
      />
    </At>

    <PanelBand id={1} dur={dur} x={LF_CONTENT.x} y={340} w={1712} move={{z: [1, 1.016]}} />

    <At x={LF_CONTENT.x} y={640} w={1712}>
      <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
        <SpecCard k="INPUTS" v="2 × XLR / TRS combo" delay={100} />
        <SpecCard k="PHANTOM" v="48V, switched per channel" delay={112} />
        <SpecCard k="MONITORING" v="Dedicated MON per input" delay={124} />
        <SpecCard k="HEADPHONES" v="1 × 1/4in, own volume" delay={136} />
      </div>
    </At>
  </LFStage>
);

/** L13 · 270 — M2 rear I/O. */
export const L13: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="slide-pan" at={0} volume={0.7} />
    <Cue name="jack-seat" at={56} volume={0.7} />
    <Cue name="latch" at={116} volume={0.5} />

    <At x={LF_CONTENT.x} y={130} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          M2 · REAR PANEL
        </Kicker>
      </Rise>
      <KineticLines
        text={'Balanced outs, RCA, MIDI, USB-C.'}
        size={T.displaySm - 4}
        weight={800}
        delay={10}
        per={2.2}
        lh={0.95}
        style={{marginTop: 18}}
      />
    </At>

    <PanelBand id={2} dur={dur} x={LF_CONTENT.x} y={336} w={1712} move={{z: [1, 1.014], x: [-14, 0]}} />

    <At x={LF_CONTENT.x} y={636} w={1712}>
      <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
        <SpecCard k="MAIN OUT" v="2 × 1/4in TRS balanced" delay={96} />
        <SpecCard k="MIRRORED" v="2 × RCA unbalanced" delay={108} />
        <SpecCard k="MIDI" v="5-pin in / out" delay={120} />
        <SpecCard k="POWER" v="USB-C bus powered" delay={132} />
      </div>
    </At>

    <SceneBranding scene="L13" />
  </LFStage>
);

/** L14 · 330 — the loopback signal path. */
export const L14: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="air-open" at={0} volume={0.5} />
    <Cue name="voltage-line" at={40} volume={0.34} />
    <TickRun from={70} count={8} every={11} volume={0.22} />
    <Cue name="shimmer-warm" at={190} volume={0.5} />

    <B from={0} to={116} fade={14}>
      <Hero id={9} dur={116} x={952} y={214} maxW={830} maxH={560} vcenter move={{z: [1, 1.03]}} />
      <Col x={LF_CONTENT.x} y={300} w={780}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
            LOOPBACK
          </Kicker>
        </Rise>
        <KineticLines
          text={'Your computer and your microphone, as one clean feed.'}
          size={T.displaySm - 12}
          weight={800}
          delay={10}
          per={2.0}
          lh={0.96}
          style={{marginTop: 20}}
        />
        <Rise delay={34} style={{marginTop: 22}}>
          <Body size={T.sub - 2} color={C.inkSoft} lh={1.36}>
            Built into the driver — no third-party virtual audio cable to install, configure or
            have fail mid-stream.
          </Body>
        </Rise>
      </Col>
    </B>

    <B from={108} to={dur} fade={16}>
      <At x={LF_CONTENT.x} y={112}>
        <Kicker color={C.inkDim} size={T.kicker - 3} tracking={4.0}>
          DRIVER LOOPBACK · SIGNAL PATH
        </Kicker>
      </At>
      <LoopbackDiagram x={150} y={166} w={1620} delay={12} />
      <At x={LF_CONTENT.x} y={880} w={1420}>
        <Rise delay={130}>
          <Body size={T.body} color={C.inkSoft} lh={1.4}>
            One capture device for the streaming software: the live microphone and the computer's
            own playback, already mixed in the interface.
          </Body>
        </Rise>
      </At>
    </B>

  </LFStage>
);

/** L15 · 280 — DC-coupled outputs, CV / modular. */
export const L15: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="voltage-line" at={26} volume={0.8} />
    <Cue name="latch" at={130} volume={0.5} />

    <At x={LF_CONTENT.x} y={122} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          DC-COUPLED OUTPUTS
        </Kicker>
      </Rise>
      <KineticLines
        text={'The outputs send control voltage, not just audio.'}
        size={T.displaySm - 6}
        weight={800}
        delay={10}
        per={2.0}
        lh={0.95}
        style={{marginTop: 18}}
      />
    </At>

    <CvDiagram x={LF_CONTENT.x} y={276} w={1160} delay={22} />

    <Hero id={8} dur={dur} x={1290} y={286} maxW={500} maxH={330} move={{z: [1, 1.03]}} />
    <At x={1290} y={648} w={500}>
      <Rise delay={104}>
        <Body size={T.body - 2} color={C.inkSoft} lh={1.4}>
          A DAW can address a modular rack directly through the balanced outputs — sequencing
          voltage the same way it sequences notes.
        </Body>
      </Rise>
    </At>
  </LFStage>
);

/** L16 · 220 — M2 in the world, MOP, branding beat. */
export const L16: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="brand-in" at={26} volume={0.85} />
    <Cue name="impact-soft" at={4} volume={0.5} />

    <SceneBranding scene="L16" mop="M2" />
    <Hero id={6} dur={dur} x={1122} y={286} maxW={680} maxH={430} move={{z: [1, 1.026]}} />
    <At x={1122} y={744} w={680}>
      <Rise delay={70}>
        <Body size={T.body - 1} color={C.inkSoft} lh={1.4}>
          Bus-powered over USB-C, small enough to travel, and carrying the same engine as every
          other interface in the range.
        </Body>
      </Rise>
    </At>
  </LFStage>
);
