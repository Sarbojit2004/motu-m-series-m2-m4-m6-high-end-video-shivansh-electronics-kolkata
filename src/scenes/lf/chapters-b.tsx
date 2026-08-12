import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, LF_CONTENT, T} from '../../lib/lf-theme';
import {Body, Kicker, Micro, Rule, Spec} from '../../components/Type';
import {KineticLines} from '../../components/lf/LFType';
import {B} from '../../components/Beat';
import {At, Col, LFBackdrop, LFStage, Rise} from '../../components/lf/LFStage';
import {Hero, PanelBand, Pair, Row, Shot} from '../../components/lf/LFMedia';
import {Cue} from '../../components/lf/LFCue';
import {ChipMotif, IoBar} from '../../components/lf/LFDiagram';
import {MopChip, Outro, SceneBranding} from '../../components/lf/LFBrand';
import {SpecCard} from './chapters-a';
import {EASE_OUT, ramp} from '../../lib/anim';
import {fitBox} from '../../lib/images';

/**
 * CHAPTERS 4-6 — the MOTU M4, the MOTU M6, and the close.
 *
 * The audio-quality case was made once, in chapters 2 and 3. Per the brief's
 * own Beat 2 / Beat 3 logic these chapters spend materially less time
 * re-proving fidelity and more on what each unit adds to a workflow: the M4's
 * rear line inputs and its physical Mix knob, the M6's four preamps, A/B
 * switching, dual headphone outputs and standalone power.
 *
 * Nothing here frames the larger units as better sounding. Where a spec is
 * restated it is restated as UNCHANGED — which is the point.
 */

/** The lateral I/O expansion slide the brief asks for between products. */
const ExpansionSlide: React.FC<{
  fromId: number;
  toId: number;
  fromLabel: string;
  toLabel: string;
  fromIo: [number, string];
  toIo: [number, string];
  dur: number;
}> = ({fromId, toId, fromLabel, toLabel, fromIo, toIo, dur}) => {
  const f = useCurrentFrame();
  // the camera "travels further" to take in the wider panel — an eased lateral
  // move, per the brief's I/O Expansion Slide
  const slide = ramp(f, [18, 96], [0, 1], EASE_OUT);
  const a = fitBox(fromId, LF_CONTENT.x, 300, 1500, 190, 'left');
  const b = fitBox(toId, LF_CONTENT.x, 520, 1500, 190, 'left');
  return (
    <>
      <At x={LF_CONTENT.x} y={150}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.6}>
            MORE CHANNELS · SAME ENGINE
          </Kicker>
        </Rise>
      </At>
      <div style={{opacity: 1 - slide * 0.45, transform: `translateX(${slide * -46}px)`}}>
        <Shot id={fromId} box={a} dur={dur} radius={12} move={{z: [1, 1]}} />
        <At x={a.x + a.w + 34} y={a.y + a.h / 2 - 26} w={300}>
          <Micro size={T.micro} color={C.inkDim} tracking={2.6}>
            {fromLabel}
          </Micro>
          <Spec size={26} color={C.inkDim} weight={500} style={{marginTop: 6}}>
            {fromIo[1]}
          </Spec>
        </At>
      </div>
      <div style={{opacity: slide, transform: `translateX(${(1 - slide) * 96}px)`}}>
        <Shot id={toId} box={b} dur={dur} radius={12} move={{z: [1, 1]}} />
        <At x={b.x + b.w + 34} y={b.y + b.h / 2 - 26} w={300}>
          <Micro size={T.micro} color={C.motu} tracking={2.6}>
            {toLabel}
          </Micro>
          <Spec size={26} color={C.motu} weight={700} style={{marginTop: 6}}>
            {toIo[1]}
          </Spec>
        </At>
      </div>
      <At x={LF_CONTENT.x} y={790}>
        <IoBar w={900} filled={toIo[0]} delay={70} label="SIMULTANEOUS INPUTS" right={toIo[1]} />
      </At>
    </>
  );
};

// ===========================================================================
// CHAPTER 4 — MOTU M4
// ===========================================================================

/** L17 · 200 — the slide from M2 to M4. */
export const L17: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="chapter-mark" at={0} volume={0.85} />
    <Cue name="slide-pan" at={20} volume={0.9} />
    <Cue name="count-tick" at={84} volume={0.7} />
    <ExpansionSlide
      fromId={2}
      toId={11}
      fromLabel="MOTU M2 · REAR"
      toLabel="MOTU M4 · REAR"
      fromIo={[2, '2 IN / 2 OUT']}
      toIo={[4, '4 IN / 4 OUT']}
      dur={dur}
    />
  </LFStage>
);

/** L18 · 300 — the M4 introduced. */
export const L18: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="impact-deep" at={6} volume={0.66} />
    <Cue name="chip-stamp" at={62} volume={0.7} />
    <Cue name="spec-reveal" at={150} volume={0.66} />

    <Col x={LF_CONTENT.x} y={150} w={720}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          MOTU M4
        </Kicker>
      </Rise>
      <Rise delay={9}>
        <Rule w={112} color={C.motu} thickness={5} style={{marginTop: 15, marginBottom: 22}} />
      </Rise>
      <KineticLines
        text={'Four in, four out.'}
        size={T.display}
        weight={800}
        delay={12}
        per={2.6}
        lh={0.93}
      />
      <Rise delay={30} style={{marginTop: 24}}>
        <Body size={T.sub} color={C.inkSoft} lh={1.36} weight={500}>
          Not a better-sounding interface — a wider one. The converter, the preamps and the
          latency figure are the ones already established.
        </Body>
      </Rise>
      <Rise delay={44} style={{marginTop: 28}}>
        <IoBar w={640} filled={4} label="SIMULTANEOUS INPUTS" right="4 IN / 4 OUT" delay={86} />
      </Rise>
      <Rise delay={150} style={{marginTop: 30}}>
        <MopChip product="M4" size={0.9} />
      </Rise>
    </Col>

    <Hero id={12} dur={dur} x={904} y={200} maxW={880} maxH={620} vcenter move={{z: [1, 1.026]}} />
    <ChipMotif x={1590} y={128} size={140} delay={62} label="SAME DAC" />
    <SceneBranding scene="L18" />
  </LFStage>
);

/** L19 · 290 — rear line inputs. */
export const L19: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="slide-pan" at={0} volume={0.7} />
    <Cue name="jack-seat" at={58} volume={0.8} />
    <Cue name="latch" at={124} volume={0.5} />

    <At x={LF_CONTENT.x} y={128} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          M4 · REAR PANEL
        </Kicker>
      </Rise>
      <KineticLines
        text={'Two more line inputs. Nothing to unplug.'}
        size={T.displaySm - 4}
        weight={800}
        delay={10}
        per={2.2}
        lh={0.95}
        style={{marginTop: 18}}
      />
    </At>

    <PanelBand id={11} dur={dur} x={LF_CONTENT.x} y={330} w={1712} move={{z: [1, 1.014], x: [-16, 0]}} />

    <At x={LF_CONTENT.x} y={604} w={1100}>
      <Rise delay={80}>
        <Body size={T.sub - 2} color={C.inkSoft} lh={1.38}>
          A stereo hardware synth can live on the rear line inputs permanently while two
          microphones stay in the front combo jacks. Both are available at once, so a session
          stops being a sequence of repatching decisions.
        </Body>
      </Rise>
    </At>
    <At x={1256} y={598}>
      <SpecCard k="REAR LINE IN" v="2 × 1/4in balanced" delay={124} />
    </At>
    <At x={1256} y={706}>
      <SpecCard k="OUTPUTS" v="4 × TRS · 4 × RCA" delay={140} />
    </At>
    <At x={1256} y={814}>
      <SpecCard k="DC-COUPLED" v="All four outputs" delay={156} />
    </At>

    <SceneBranding scene="L19" />
  </LFStage>
);

/** L20 · 330 — the Input Monitor Mix knob, with a macro rack-focus. */
export const L20: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  // the rack focus: the jack texture starts sharp and softens as the knob
  // resolves — the brief's Tactile Engagement move
  const pull = ramp(f, [40, 118], [0, 1], EASE_OUT);
  const blurA = 0.4 + pull * 5.2;
  const blurB = 5.6 - pull * 5.6;
  return (
    <LFStage>
      <Cue name="push-in" at={0} volume={0.6} />
      <Cue name="knob-detent" at={64} volume={0.95} />
      <Cue name="spec-reveal" at={190} volume={0.6} />

      <At x={LF_CONTENT.x} y={124} w={1420}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
            INPUT MONITOR MIX
          </Kicker>
        </Rise>
        <KineticLines
          text={'A knob, not a menu.'}
          size={T.display}
          weight={800}
          delay={10}
          per={2.4}
          lh={0.95}
          style={{marginTop: 18}}
        />
      </At>

      {/* rack focus: combo-jack texture -> the mix knob. The panel is narrowed
          so the dial sits BESIDE it and the copy below has clear air — at full
          width the body text landed on top of the panel image. */}
      <div style={{filter: `blur(${blurA}px)`, opacity: 1 - pull * 0.5}}>
        <PanelBand id={10} dur={dur} x={LF_CONTENT.x} y={286} w={1230} move={{z: [1, 1.02]}} />
      </div>
      <div style={{filter: `blur(${blurB}px)`, opacity: pull}}>
        <At x={1436} y={288}>
          <MixKnobDial delay={64} />
        </At>
      </div>

      <At x={LF_CONTENT.x} y={700} w={1080}>
        <Rise delay={132}>
          <Body size={T.body} color={C.inkSoft} lh={1.4}>
            Turn toward INPUT to hear yourself directly off the preamp with no round trip at all.
            Turn toward PLAYBACK for the mix coming back from the session. During a vocal take,
            that balance is a thing you reach for — not a window you go looking for.
          </Body>
        </Rise>
      </At>
      <At x={1276} y={700}>
        <SpecCard k="MIX CONTROL" v="Direct ↔ playback" delay={190} />
      </At>
      <At x={1276} y={806}>
        <SpecCard k="ON" v="M4 and M6" delay={206} />
      </At>

      <SceneBranding scene="L20" />
    </LFStage>
  );
};

/** The animated blend dial that resolves during the rack focus. */
const MixKnobDial: React.FC<{delay?: number}> = ({delay = 0}) => {
  const f = useCurrentFrame() - delay;
  const p = ramp(f, [0, 24], [0, 1], EASE_OUT);
  // sweeps from full INPUT toward the middle, then settles slightly playback-side
  const turn = ramp(f, [16, 96], [-125, 34], EASE_OUT);
  const R = 92;
  return (
    <svg width={260} height={260} viewBox="0 0 260 260" style={{opacity: p, display: 'block'}}>
      <circle cx={130} cy={130} r={R + 20} fill={C.paperHi} stroke={C.line} strokeWidth={1.6} />
      {/* arc */}
      <path
        d={`M ${130 + R * Math.cos((Math.PI * 145) / 180)} ${130 + R * Math.sin((Math.PI * 145) / 180)}
            A ${R} ${R} 0 1 1 ${130 + R * Math.cos((Math.PI * 35) / 180)} ${130 + R * Math.sin((Math.PI * 35) / 180)}`}
        fill="none"
        stroke={C.line}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* detent ticks */}
      {new Array(11).fill(0).map((_, i) => {
        const ang = (-215 + i * 25) * (Math.PI / 180);
        const r0 = R + 8;
        const r1 = R + (i % 5 === 0 ? 18 : 13);
        return (
          <line
            key={i}
            x1={130 + r0 * Math.cos(ang)}
            y1={130 + r0 * Math.sin(ang)}
            x2={130 + r1 * Math.cos(ang)}
            y2={130 + r1 * Math.sin(ang)}
            stroke={i % 5 === 0 ? C.motu : C.inkDim}
            strokeWidth={i % 5 === 0 ? 2.6 : 1.5}
            opacity={0.7}
          />
        );
      })}
      {/* knob body */}
      <circle cx={130} cy={130} r={62} fill={C.ink} />
      <circle cx={130} cy={130} r={62} fill="none" stroke={C.motu} strokeWidth={2} opacity={0.5} />
      <g transform={`rotate(${turn} 130 130)`}>
        <rect x={126.5} y={78} width={7} height={34} rx={3.5} fill="#8FB6FA" />
      </g>
      <text x={20} y={246} fontFamily={F.mono} fontSize={16} fill={C.inkDim} letterSpacing={1.4}>
        INPUT
      </text>
      <text
        x={240}
        y={246}
        textAnchor="end"
        fontFamily={F.mono}
        fontSize={16}
        fill={C.inkDim}
        letterSpacing={1.4}
      >
        PLAYBACK
      </text>
    </svg>
  );
};

/** L21 · 330 — three M4 workflows. */
export const L21: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="air-open" at={0} volume={0.5} />
    <Cue name="impact-soft" at={40} volume={0.55} />
    <Cue name="impact-soft" at={96} volume={0.5} />
    <Cue name="impact-soft" at={152} volume={0.45} />

    <At x={LF_CONTENT.x} y={132} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          WHAT FOUR CHANNELS BUYS
        </Kicker>
      </Rise>
      <KineticLines
        text={'Hardware, keys and a room mic — all live at once.'}
        size={T.displaySm - 10}
        weight={800}
        delay={10}
        per={2.0}
        lh={0.96}
        style={{marginTop: 18}}
      />
    </At>

    {/* a three-up comparison is purposeful here: the point IS that these are
        simultaneous, which one image cannot say */}
    <Row ids={[13, 16, 15]} dur={dur} x={LF_CONTENT.x} y={346} w={1712} maxH={420} delay={34} stagger={16} />

    <At x={LF_CONTENT.x} y={806} w={1712}>
      <div style={{display: 'flex', gap: 20, justifyContent: 'space-between'}}>
        {[
          ['OUTBOARD SYNTHS', 'Rear line inputs, always connected'],
          ['KEYS AND CONTROLLERS', 'Playback and direct, blended by hand'],
          ['A KIT OR A ROOM', 'Two mics up, two lines in'],
        ].map(([k, v], i) => (
          <div key={k} style={{width: 540}}>
            <Rise delay={150 + i * 12}>
              <Micro size={T.micro - 2} color={C.motu} tracking={2.6}>
                {k}
              </Micro>
              <Body size={T.body - 3} color={C.inkSoft} lh={1.36} style={{marginTop: 8}}>
                {v}
              </Body>
            </Rise>
          </div>
        ))}
      </div>
    </At>
  </LFStage>
);

/** L22 · 350 — M4 in use, MOP, branding beat. */
export const L22: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="impact-soft" at={6} volume={0.5} />
    <Cue name="brand-in" at={152} volume={0.85} />

    <B from={0} to={140} fade={16}>
      <Pair ids={[14, 17]} dur={150} x={LF_CONTENT.x} y={214} w={1712} maxH={520} delay={6} />
      <At x={LF_CONTENT.x} y={784} w={1712}>
        <Rise delay={40}>
          <Body size={T.sub - 4} color={C.inkSoft} lh={1.36} align="center">
            The same four channels, indoors or out — a fixed monitoring desk, or a microphone and
            a laptop somewhere with better light.
          </Body>
        </Rise>
      </At>
    </B>

    <B from={140} to={dur} fade={18}>
      <SceneBranding scene="L22" mop="M4" />
    </B>
  </LFStage>
);

// ===========================================================================
// CHAPTER 5 — MOTU M6
// ===========================================================================

/** L23 · 180 — the slide from M4 to M6. */
export const L23: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="chapter-mark" at={0} volume={0.85} />
    <Cue name="slide-pan" at={18} volume={0.95} />
    <Cue name="count-tick" at={80} volume={0.7} />
    <ExpansionSlide
      fromId={11}
      toId={19}
      fromLabel="MOTU M4 · REAR"
      toLabel="MOTU M6 · REAR"
      fromIo={[4, '4 IN / 4 OUT']}
      toIo={[6, '6 IN / 4 OUT']}
      dur={dur}
    />
  </LFStage>
);

/** L24 · 290 — the M6 and its four preamps. */
export const L24: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="impact-deep" at={6} volume={0.7} />
    <Cue name="chip-stamp" at={58} volume={0.7} />
    <Cue name="phantom-click" at={120} volume={0.7} />
    <Cue name="spec-reveal" at={158} volume={0.66} />

    <At x={LF_CONTENT.x} y={126} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          MOTU M6
        </Kicker>
      </Rise>
      <KineticLines
        text={'Four microphone preamps.'}
        size={T.display}
        weight={800}
        delay={10}
        per={2.4}
        lh={0.95}
        style={{marginTop: 18}}
      />
    </At>

    <PanelBand id={18} dur={dur} x={LF_CONTENT.x} y={320} w={1712} move={{z: [1, 1.016]}} />

    <At x={LF_CONTENT.x} y={676} w={980}>
      <Rise delay={90}>
        <Body size={T.sub - 2} color={C.inkSoft} lh={1.38}>
          Four combo inputs across the front, two line inputs at the rear. Six sources arriving
          together, through the same preamp design and the same converter as the two-channel M2.
        </Body>
      </Rise>
      <div style={{marginTop: 26}}>
        <IoBar w={860} filled={6} label="SIMULTANEOUS INPUTS" right="6 IN / 4 OUT" delay={130} />
      </div>
    </At>
    <At x={1240} y={672}>
      <SpecCard k="MIC PREAMPS" v="4 × XLR / TRS combo" delay={158} />
    </At>
    <At x={1240} y={790}>
      <MopChip product="M6" size={0.86} />
    </At>

    <SceneBranding scene="L24" />
  </LFStage>
);

/** L25 · 260 — tracking a kit. */
export const L25: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="slide-pan" at={0} volume={0.55} />
    <Cue name="impact-soft" at={34} volume={0.6} />
    <LFBackdrop id={24} opacity={0.2} />

    <Hero id={24} dur={dur} x={LF_CONTENT.x} y={196} maxW={780} maxH={660} move={{z: [1, 1.03]}} />

    <Col x={1000} y={272} w={790}>
      <Rise delay={6}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          MULTI-SOURCE TRACKING
        </Kicker>
      </Rise>
      <KineticLines
        text={'Kick, snare, two overheads.'}
        size={T.displaySm - 8}
        weight={800}
        delay={12}
        per={2.2}
        lh={0.96}
        style={{marginTop: 18}}
      />
      <Rise delay={38} style={{marginTop: 22}}>
        <Body size={T.sub - 3} color={C.inkSoft} lh={1.38}>
          A basic kit needs four microphones up at the same time. That is the whole reason the M6
          exists — not a different sound, a different number of things you can capture in one
          take.
        </Body>
      </Rise>
      <div style={{marginTop: 26}}>
        <IoBar w={760} filled={4} total={6} label="MICS UP" right="4 PREAMPS" delay={80} />
      </div>
    </Col>

    <SceneBranding scene="L25" />
  </LFStage>
);

/** L26 · 270 — a panel, a duo, a room. */
export const L26: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="air-open" at={0} volume={0.5} />
    <Cue name="impact-soft" at={30} volume={0.55} />

    <At x={LF_CONTENT.x} y={124} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          THE SAME FOUR PREAMPS
        </Kicker>
      </Rise>
      <KineticLines
        text={'A four-person panel. A live duo. One room.'}
        size={T.displaySm - 10}
        weight={800}
        delay={10}
        per={2.0}
        lh={0.96}
        style={{marginTop: 18}}
      />
    </At>

    <Pair ids={[25, 27]} dur={dur} x={LF_CONTENT.x} y={310} w={1712} maxH={490} delay={26} stagger={14} />

    <At x={LF_CONTENT.x} y={840} w={1712}>
      <div style={{display: 'flex', gap: 40}}>
        <div style={{width: 830}}>
          <Rise delay={90}>
            <Micro size={T.micro - 2} color={C.motu} tracking={2.6}>
              FOUR HOSTS, FOUR MICROPHONES
            </Micro>
            <Body size={T.body - 3} color={C.inkSoft} lh={1.36} style={{marginTop: 8}}>
              Each voice on its own track, with its own gain, edited separately afterwards.
            </Body>
          </Rise>
        </div>
        <div style={{width: 830}}>
          <Rise delay={104}>
            <Micro size={T.micro - 2} color={C.motu} tracking={2.6}>
              VOICE AND INSTRUMENT, TOGETHER
            </Micro>
            <Body size={T.body - 3} color={C.inkSoft} lh={1.36} style={{marginTop: 8}}>
              A performance captured in one pass, the way it was actually played.
            </Body>
          </Rise>
        </div>
      </div>
    </At>
  </LFStage>
);

/** L27 · 260 — A/B monitor switching. */
export const L27: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const flip = Math.floor(ramp(f, [50, 200], [0, 3.99], EASE_OUT)) % 2 === 0;
  return (
    <LFStage>
      <Cue name="push-in" at={0} volume={0.5} />
      <Cue name="phantom-click" at={62} volume={0.8} />
      <Cue name="phantom-click" at={120} volume={0.7} />
      <Cue name="phantom-click" at={172} volume={0.6} />

      <Col x={LF_CONTENT.x} y={150} w={720}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
            A/B MONITOR SWITCHING
          </Kicker>
        </Rise>
        <Rise delay={9}>
          <Rule w={112} color={C.motu} thickness={5} style={{marginTop: 15, marginBottom: 22}} />
        </Rise>
        <KineticLines
          text={'Two pairs of monitors.\nOne button.'}
          size={T.displaySm}
          weight={800}
          delay={12}
          per={2.4}
          lh={0.94}
        />
        <Rise delay={34} style={{marginTop: 24}}>
          <Body size={T.sub - 3} color={C.inkSoft} lh={1.38}>
            Reference a mix across two different speaker pairs from the front panel, without a
            separate monitor controller in the signal path.
          </Body>
        </Rise>

        {/* the A/B state, switching */}
        <div style={{display: 'flex', gap: 14, marginTop: 30}}>
          {(['A', 'B'] as const).map((k) => {
            const on = (k === 'A') === flip;
            return (
              <div
                key={k}
                style={{
                  width: 116,
                  height: 76,
                  borderRadius: 10,
                  backgroundColor: on ? C.motu : C.paperHi,
                  border: `2px solid ${on ? C.motu : C.line}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 40,
                  color: on ? C.paperHi : C.inkDim,
                }}
              >
                {k}
              </div>
            );
          })}
          <div style={{alignSelf: 'center', marginLeft: 8}}>
            <Micro size={T.micro - 2} color={C.inkDim} tracking={2.4}>
              FRONT-PANEL SWITCH
            </Micro>
          </div>
        </div>
      </Col>

      <Hero id={26} dur={dur} x={904} y={168} maxW={880} maxH={420} move={{z: [1, 1.024]}} />
      <Hero id={22} dur={dur} x={904} y={618} maxW={880} maxH={330} move={{z: [1, 1.02]}} />
    </LFStage>
  );
};

/** L28 · 250 — dual headphone outputs and cue mixing. */
export const L28: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="air-open" at={0} volume={0.45} />
    <Cue name="jack-seat" at={44} volume={0.75} />
    <Cue name="spec-reveal" at={140} volume={0.6} />

    <At x={LF_CONTENT.x} y={126} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          CUE MIXING
        </Kicker>
      </Rise>
      <KineticLines
        text={'Two headphone outputs, routed separately.'}
        size={T.displaySm - 8}
        weight={800}
        delay={10}
        per={2.0}
        lh={0.96}
        style={{marginTop: 18}}
      />
    </At>

    <Pair ids={[21, 23]} dur={dur} x={LF_CONTENT.x} y={306} w={1712} maxH={430} delay={22} />

    <At x={LF_CONTENT.x} y={790} w={1000}>
      <Rise delay={96}>
        <Body size={T.sub - 4} color={C.inkSoft} lh={1.38}>
          The second output carries its own 3-4 routing switch, so a performer can be given a
          different balance from the one the engineer is listening to.
        </Body>
      </Rise>
    </At>
    <At x={1230} y={784}>
      <SpecCard k="HEADPHONE OUTS" v="2 × 1/4in TRS" delay={140} />
    </At>
    <At x={1230} y={888}>
      <SpecCard k="OUTPUT 2" v="3-4 routing switch" delay={156} />
    </At>

    <SceneBranding scene="L28" />
  </LFStage>
);

/** L29 · 240 — standalone DC power. */
export const L29: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="slide-pan" at={0} volume={0.6} />
    <Cue name="latch" at={70} volume={0.55} />
    <Cue name="spec-reveal" at={130} volume={0.6} />

    <At x={LF_CONTENT.x} y={124} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          STANDALONE OPERATION
        </Kicker>
      </Rise>
      <KineticLines
        text={'It runs without a computer attached.'}
        size={T.displaySm - 6}
        weight={800}
        delay={10}
        per={2.1}
        lh={0.96}
        style={{marginTop: 18}}
      />
    </At>

    <PanelBand id={19} dur={dur} x={LF_CONTENT.x} y={318} w={1712} move={{z: [1, 1.012], x: [-14, 0]}} />

    <Hero id={28} dur={dur} x={LF_CONTENT.x} y={560} maxW={840} maxH={360} move={{z: [1, 1.024]}} />

    <At x={1010} y={572} w={806}>
      <Rise delay={86}>
        <Body size={T.body + 1} color={C.inkSoft} lh={1.4}>
          The M6 ships with a multi-blade international DC adapter. That means monitoring works
          with no host connected at all, and it means enough power when the only port available is
          an older USB-A host.
        </Body>
      </Rise>
      <div style={{marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
        <SpecCard k="POWER" v="USB-C bus or DC adapter" delay={130} />
        <SpecCard k="ADAPTER" v="Multi-blade, international" delay={146} />
      </div>
    </At>
  </LFStage>
);

/** L30 · 170 — M6 MOP and branding beat. */
export const L30: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="brand-in" at={18} volume={0.85} />
    <Hero id={29} dur={dur} x={LF_CONTENT.x} y={252} maxW={660} maxH={560} move={{z: [1, 1.024]}} />
    <SceneBranding scene="L30" mop="M6" />
  </LFStage>
);

// ===========================================================================
// CHAPTER 6 — THE CLOSE
// ===========================================================================

/** L31 · 190 — what is in every box. */
export const L31: React.FC<{dur: number}> = ({dur}) => (
  <LFStage>
    <Cue name="chapter-mark" at={0} volume={0.7} />
    <Cue name="latch" at={70} volume={0.5} />

    <At x={LF_CONTENT.x} y={130} w={1420}>
      <Rise delay={4}>
        <Kicker color={C.motu} size={T.kicker} tracking={4.4}>
          INCLUDED WITH EVERY MODEL
        </Kicker>
      </Rise>
      <KineticLines
        text={'The same software bundle, whichever one you choose.'}
        size={T.displaySm - 12}
        weight={800}
        delay={10}
        per={1.9}
        lh={0.96}
        style={{marginTop: 16}}
      />
    </At>

    <Hero id={30} dur={dur} x={LF_CONTENT.x} y={322} maxW={1712} maxH={430} move={{z: [1, 1.016]}} />

    <At x={LF_CONTENT.x} y={800} w={1712}>
      <div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
        <SpecCard k="DAW" v="Performer Lite" delay={70} />
        <SpecCard k="DAW" v="Ableton Live Lite" delay={82} />
        <SpecCard k="CONTENT" v="6 GB of loops" delay={94} />
        <SpecCard k="INSTRUMENTS" v="100+ virtual instruments" delay={106} />
      </div>
    </At>
  </LFStage>
);

/** L32 · 240 — the range, with the I/O bar fully expanded. */
export const L32: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const rows: [number, string, 'M2' | 'M4' | 'M6', number, string][] = [
    [1, 'MOTU M2', 'M2', 2, '2 IN / 2 OUT'],
    [10, 'MOTU M4', 'M4', 4, '4 IN / 4 OUT'],
    [18, 'MOTU M6', 'M6', 6, '6 IN / 4 OUT'],
  ];
  return (
    <LFStage>
      <Cue name="riser-warm" at={0} volume={0.6} />
      <Cue name="count-tick" at={54} volume={0.6} />
      <Cue name="count-tick" at={78} volume={0.6} />
      <Cue name="count-tick" at={102} volume={0.65} />
      <Cue name="impact-deep" at={110} volume={0.6} />

      <At x={LF_CONTENT.x} y={108}>
        <Rise delay={4}>
          <Kicker color={C.motu} size={T.kicker} tracking={4.6}>
            THE RANGE
          </Kicker>
        </Rise>
        <KineticLines
          text={'One engine. Three channel counts.'}
          size={T.displaySm - 8}
          weight={800}
          delay={10}
          per={2.0}
          lh={0.96}
          style={{marginTop: 14}}
        />
      </At>

      {rows.map(([id, name, mop, filled, io], i) => {
        const y = 296 + i * 216;
        const box = fitBox(id, LF_CONTENT.x, y, 760, 148, 'left');
        const p = ramp(f, [40 + i * 20, 66 + i * 20], [0, 1], EASE_OUT);
        return (
          <div key={id} style={{opacity: p, transform: `translateX(${(1 - p) * -22}px)`}}>
            <Shot id={id} box={box} dur={dur} move={{z: [1, 1]}} radius={11} />
            <At x={904} y={y + 6} w={420}>
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 44,
                  color: C.ink,
                  lineHeight: 1,
                }}
              >
                {name}
              </div>
              <div style={{marginTop: 12}}>
                <MopChip product={mop} size={0.72} />
              </div>
            </At>
            <At x={1360} y={y + 22} w={456}>
              <IoBar w={440} filled={filled} right={io} delay={54 + i * 24} cellH={19} />
            </At>
          </div>
        );
      })}

      <SceneBranding scene="L32" />
    </LFStage>
  );
};

/** L33 · 350 — the CTA and the full contact block. */
export const L33: React.FC<{dur: number}> = ({dur}) => (
  <LFStage rails={false}>
    <Cue name="riser-warm" at={0} volume={0.5} />
    <Cue name="brand-in" at={22} volume={0.8} />
    <Cue name="shimmer-warm" at={90} volume={0.6} />
    <Cue name="chime-final" at={250} volume={0.9} />
    <Outro dur={dur} />
  </LFStage>
);
