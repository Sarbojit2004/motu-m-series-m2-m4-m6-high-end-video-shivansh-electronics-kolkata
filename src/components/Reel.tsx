import React from 'react';
import {AbsoluteFill, Audio, Sequence} from 'remotion';
import {Part, Scene, SCENES, TOTAL_FRAMES} from '../lib/theme';
import {MIX, ambient, bed, vo} from '../lib/sfx';
import {loadFonts} from '../lib/fonts';

/**
 * Shell for one 88-second part.
 *
 * Scenes are laid out from the part's scene table and each one renders OVERLAP
 * frames longer than its slot, so the incoming scene cross-dissolves over the
 * outgoing one instead of the frame dipping to the ground colour at every cut.
 *
 * THREE AUDIO LAYERS, bottom to top (prompt Section 8a):
 *
 *   1. `ambient()`  — the constant subtle texture. One 88 s file spanning the
 *                     whole composition, so there is a continuous low-level
 *                     sonic presence under EVERY frame rather than silence
 *                     between transition cues.
 *   2. `bed(part)`  — the music arrangement.
 *   3. per-scene `Cue`s — the transition hits, scheduled inside each scene.
 *
 * Levels are deliberately generous: the brief for this project asks for SFX
 * that are genuinely audible and present in the mix, with final balancing done
 * in post. The music bed still leaves headroom for the voiceover that gets
 * recorded separately — public/vo/voiceover-reel-partN.mp3 is a silent 88 s
 * placeholder occupying the exact slot that recording will fill.
 */

export const OVERLAP = 14;

export type SceneNode = Scene & {node: React.ReactNode};

export const Reel: React.FC<{part: Part; scenes: SceneNode[]}> = ({part, scenes}) => {
  loadFonts();

  const table = SCENES[part];
  if (scenes.length !== table.length) {
    throw new Error(`part ${part}: ${scenes.length} scene nodes for ${table.length} table rows`);
  }

  let f = 0;
  const placed = scenes.map((s, i) => {
    if (s.id !== table[i].id || s.dur !== table[i].dur) {
      throw new Error(
        `part ${part} scene ${i}: ${s.id}/${s.dur} does not match table ${table[i].id}/${table[i].dur}`,
      );
    }
    const from = f;
    f += s.dur;
    return {...s, from};
  });

  if (f !== TOTAL_FRAMES) {
    throw new Error(`part ${part}: scene table sums to ${f}, expected ${TOTAL_FRAMES}`);
  }

  return (
    <AbsoluteFill>
      {/* 1 — constant ambient texture, under the entire runtime */}
      <Audio src={ambient()} volume={MIX.ambient} />
      {/* 2 — music bed */}
      <Audio src={bed(part)} volume={MIX.bed} />
      {/* 3 — voiceover slot (silent placeholder) */}
      <Audio src={vo(part)} volume={1} />

      {placed.map((s, i) => (
        <Sequence
          key={s.id}
          from={s.from}
          durationInFrames={s.dur + (i < placed.length - 1 ? OVERLAP : 0)}
          name={`${s.id} · ${s.label}`}
        >
          {s.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
