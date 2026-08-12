import React from 'react';
import {Audio, Sequence} from 'remotion';
import {CueName, MIX, cue} from '../lib/sfx';

/**
 * One synthesised SFX hit, scheduled at a local frame inside its scene.
 *
 * `durationInFrames` is generous because several cues have long tails (the
 * chip-stamp rings for 1.9 s, the final chime for 3 s) and Remotion truncates
 * audio at the end of its Sequence.
 */
export const Cue: React.FC<{name: CueName; at: number; volume?: number}> = ({
  name,
  at,
  volume = 1,
}) => (
  <Sequence from={at} durationInFrames={140} layout="none" name={`sfx:${name}`}>
    {/* MIX.cue is the global transition-cue trim — see src/lib/sfx.ts */}
    <Audio src={cue(name)} volume={volume * MIX.cue} />
  </Sequence>
);

/**
 * A run of evenly spaced clock ticks — the 2.5 ms round-trip latency motif.
 * Locked to the 120 BPM grid by callers (15 frames = one beat) so the ticks sit
 * with the music rather than against it.
 */
export const TickRun: React.FC<{
  from: number;
  count: number;
  every: number;
  volume?: number;
  hi?: boolean;
}> = ({from, count, every, volume = 0.36, hi = false}) => (
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
