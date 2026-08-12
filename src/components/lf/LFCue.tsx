import React from 'react';
import {Audio, Sequence} from 'remotion';
import {LFCueName, lfCue, LF_MIX} from '../../lib/lf-sfx';

/**
 * One synthesised transition cue, scheduled at a local frame inside its scene.
 *
 * Every cue goes through LF_MIX.cue, so the whole transition layer can be
 * trimmed from one place rather than editing a hundred call sites. The
 * per-cue `volume` here is a RELATIVE balance within that layer.
 */
export const Cue: React.FC<{name: LFCueName; at: number; volume?: number}> = ({
  name,
  at,
  volume = 1,
}) => (
  <Sequence from={at} durationInFrames={220} layout="none" name={`sfx:${name}`}>
    <Audio src={lfCue(name)} volume={volume * LF_MIX.cue} />
  </Sequence>
);

/** A run of evenly spaced ticks — the latency / clocking motif. */
export const TickRun: React.FC<{
  from: number;
  count: number;
  every: number;
  volume?: number;
  hi?: boolean;
}> = ({from, count, every, volume = 0.3, hi = false}) => (
  <>
    {new Array(count).fill(0).map((_, i) => (
      <Cue
        key={i}
        name={hi && i % 2 === 1 ? 'tick-hi' : 'tick'}
        at={from + i * every}
        volume={volume * (i % 4 === 0 ? 1 : 0.66)}
      />
    ))}
  </>
);
