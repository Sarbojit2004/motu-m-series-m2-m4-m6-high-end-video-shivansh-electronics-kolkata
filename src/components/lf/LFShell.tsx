import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame} from 'remotion';
import {C, F, LF_CANVAS, LF_CONTENT, LF_SCENES, LFScene, T} from '../../lib/lf-theme';
import {lfAmbient, lfBed, lfVo, LF_MIX} from '../../lib/lf-sfx';
import {loadFonts} from '../../lib/fonts';
import {Micro} from '../Type';
import {ramp} from '../../lib/anim';

/**
 * Shell for the 298-second long-form video.
 *
 * Scenes come from the table in lf-theme.ts and each renders OVERLAP frames
 * longer than its slot, so the incoming scene cross-dissolves over the outgoing
 * one instead of the frame dipping to the ground colour at every cut. At this
 * video's deliberate pace a hard cut every nine seconds would read as a
 * slideshow; the overlap is what keeps it feeling like one continuous piece.
 *
 * THREE AUDIO LAYERS, all running the full 8940 frames:
 *   ambient  a continuous low texture — Section 7a requires presence under
 *            every frame, not silence between transition cues
 *   bed      the music arrangement, with its six-chapter build
 *   vo       a silent 298 s placeholder occupying the exact slot the recorded
 *            voiceover will fill
 *
 * Per-scene transition cues are scheduled inside the scenes themselves.
 */

export const LF_OVERLAP = 16;

export type LFSceneNode = LFScene & {node: React.ReactNode};

/**
 * A persistent, very quiet chapter marker in the top-left.
 *
 * Not branding — it is the wayfinding a five-minute piece needs so a viewer
 * always knows which product is on screen. Deliberately at micro size and
 * inkDim so it never competes with content.
 */
const ChapterTag: React.FC<{label: string; dur: number}> = ({label, dur}) => {
  const f = useCurrentFrame();
  const p = Math.min(ramp(f, [6, 26], [0, 1]), ramp(f, [dur - 14, dur], [1, 0]));
  return (
    <div
      style={{
        position: 'absolute',
        left: LF_CONTENT.x,
        top: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: p * 0.9,
      }}
    >
      <div style={{width: 30, height: 3, backgroundColor: C.motu}} />
      <Micro color={C.inkDim} size={T.micro - 3} tracking={3.2}>
        {label}
      </Micro>
    </div>
  );
};

/** Slim running-time indicator, bottom right. Ambient, never critical. */
const Progress: React.FC<{from: number; total: number}> = ({from, total}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, (from + f) / total);
  return (
    <div
      style={{
        position: 'absolute',
        right: LF_CANVAS.w - (LF_CONTENT.x + LF_CONTENT.w),
        bottom: 50,
        width: 210,
        opacity: 0.5,
      }}
    >
      <div style={{height: 3, backgroundColor: C.line, borderRadius: 2, overflow: 'hidden'}}>
        <div style={{width: `${t * 100}%`, height: '100%', backgroundColor: C.motu}} />
      </div>
    </div>
  );
};

export const LFShell: React.FC<{scenes: LFSceneNode[]}> = ({scenes}) => {
  loadFonts();

  if (scenes.length !== LF_SCENES.length) {
    throw new Error(
      `long-form: ${scenes.length} scene nodes for ${LF_SCENES.length} table rows`,
    );
  }

  let f = 0;
  const placed = scenes.map((s, i) => {
    const row = LF_SCENES[i];
    if (s.id !== row.id || s.dur !== row.dur) {
      throw new Error(
        `long-form scene ${i}: ${s.id}/${s.dur} does not match table ${row.id}/${row.dur}`,
      );
    }
    const from = f;
    f += s.dur;
    return {...s, from};
  });
  const total = f;

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <Audio src={lfAmbient()} volume={LF_MIX.ambient} />
      <Audio src={lfBed()} volume={LF_MIX.bed} />
      <Audio src={lfVo()} volume={1} />

      {placed.map((s, i) => (
        <Sequence
          key={s.id}
          from={s.from}
          durationInFrames={s.dur + (i < placed.length - 1 ? LF_OVERLAP : 0)}
          name={`${s.id} · ${s.label}`}
        >
          {s.node}
          <ChapterTag label={CHAPTER_LABEL[s.ch]} dur={s.dur} />
          <Progress from={s.from} total={total} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const CHAPTER_LABEL: Record<string, string> = {
  open: 'MOTU M-SERIES',
  engine: 'THE SHARED ENGINE',
  m2: 'MOTU M2 · 2 IN / 2 OUT',
  m4: 'MOTU M4 · 4 IN / 4 OUT',
  m6: 'MOTU M6 · 6 IN / 4 OUT',
  cta: 'WHERE TO BUY',
};

export {F};
