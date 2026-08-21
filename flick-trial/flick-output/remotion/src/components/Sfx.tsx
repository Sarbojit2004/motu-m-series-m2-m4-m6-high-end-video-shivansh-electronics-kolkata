import React from "react";
import { Audio, Sequence } from "remotion";
import { VIDEO } from "../lib/theme";
import { sound } from "../lib/assets";

/**
 * PHASE 4 — the transition/foley layer.
 *
 * Sound effects only where an approved visible action triggers them. There is
 * no background music here: Flick has none by design, and this project layers
 * its own AVB-derived bed on afterwards.
 *
 * WHAT WAS SWAPPED, AND WHY
 * Flick ships a generic bundled sound set. Five of those were replaced with the
 * real, finished files from the approved MOTU AVB build (`_shared/sfx/reuse/`)
 * because that build had already established a branded sound for exactly that
 * action. The remaining six stay as Flick supplied them, because the AVB set
 * genuinely has no equivalent — substituting there would have been invention,
 * not reuse.
 *
 *   REPLACED (AVB-sourced)
 *     Click.mp3        -> avb/encoder-click.wav   knob / button detent
 *     Click.mp3 (A/B)  -> avb/talkback-click.wav  monitor-path toggle
 *     Pop.mp3          -> avb/rj45-snap.wav       connector / panel arrival
 *     Correct.mp3      -> avb/avb-ping.wav        spec + price confirm
 *     Notification.mp3 -> avb/data-stream.wav     throughput / latency figures
 *
 *   KEPT (Flick's own — no AVB equivalent exists)
 *     riser.mp3, Impact.mp3, Zoomin-OR-out.mp3, transitions.mp3,
 *     Popups.mp3, aha-moment.MP3
 */

/** Measured lengths (seconds) so a hit is never clipped or held past its tail. */
export const SFX_SECONDS: Record<string, number> = {
  "avb/avb-ping.wav": 0.55,
  "avb/data-stream.wav": 4.0,
  "avb/encoder-click.wav": 0.09,
  "avb/rj45-snap.wav": 0.22,
  "avb/talkback-click.wav": 0.13,
  "Zoomin-OR-out.mp3": 0.57,
  "transitions.mp3": 0.34,
  "Popups.mp3": 1.02,
  "aha-moment.MP3": 1.23,
  "Impact.mp3": 2.09,
  "riser.mp3": 3.53,
};

export type Hit = { file: string; at: number; volume?: number };

export const hitFrames = (file: string): number =>
  Math.max(2, Math.ceil((SFX_SECONDS[file] ?? 1) * VIDEO.fps));

export const Sfx: React.FC<{ hits: Hit[] }> = ({ hits }) => (
  <>
    {hits.map((h, i) => (
      <Sequence
        key={`${h.file}-${h.at}-${i}`}
        from={Math.max(0, Math.round(h.at))}
        durationInFrames={hitFrames(h.file)}
        name={`sfx-${h.file}`}
      >
        <Audio src={sound(h.file)} volume={h.volume ?? 0.5} />
      </Sequence>
    ))}
  </>
);
