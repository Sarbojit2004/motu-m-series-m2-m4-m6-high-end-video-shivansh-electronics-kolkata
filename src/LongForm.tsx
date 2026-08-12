import React from 'react';
import {LF_SCENES} from './lib/lf-theme';
import {LFShell, LFSceneNode} from './components/lf/LFShell';
import * as A from './scenes/lf/chapters-a';
import * as Bc from './scenes/lf/chapters-b';

/**
 * The 298-second MOTU M-Series long-form video.
 *
 * One continuous arc — no part break, no continuation device. The reels' split
 * structure deliberately does not carry over here: this is the extended single
 * treatment of the same story, so it runs shared engine -> M2 -> M4 -> M6 ->
 * CTA without interruption.
 *
 *   npm run render:lf  ->  out/motu-mseries-longform.mp4
 */

const NODES: Record<string, React.FC<{dur: number}>> = {
  L01: A.L01, L02: A.L02, L03: A.L03, L04: A.L04,
  L05: A.L05, L06: A.L06, L07: A.L07, L08: A.L08, L09: A.L09, L10: A.L10,
  L11: A.L11, L12: A.L12, L13: A.L13, L14: A.L14, L15: A.L15, L16: A.L16,
  L17: Bc.L17, L18: Bc.L18, L19: Bc.L19, L20: Bc.L20, L21: Bc.L21, L22: Bc.L22,
  L23: Bc.L23, L24: Bc.L24, L25: Bc.L25, L26: Bc.L26, L27: Bc.L27, L28: Bc.L28,
  L29: Bc.L29, L30: Bc.L30,
  L31: Bc.L31, L32: Bc.L32, L33: Bc.L33,
};

export const LongForm: React.FC = () => {
  const scenes: LFSceneNode[] = LF_SCENES.map((s) => {
    const Node = NODES[s.id];
    if (!Node) throw new Error(`no scene component registered for ${s.id}`);
    return {...s, node: <Node dur={s.dur} />};
  });
  return <LFShell scenes={scenes} />;
};
