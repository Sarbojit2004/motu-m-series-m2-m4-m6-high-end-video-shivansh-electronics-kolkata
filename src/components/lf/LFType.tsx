import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../../lib/lf-theme';
import {pop, stag} from '../../lib/anim';

/**
 * A word-by-word kinetic headline that RESPECTS explicit line breaks.
 *
 * The reels' `KineticLine` splits on spaces into a single flex-wrap row, so a
 * "\n" in the text is just another space and the browser breaks wherever the
 * column happens to run out. On the reels' narrow 936px column that mostly
 * matched the intended break; on this video's wider columns it did not — a
 * still of L05 showed "One converter. / Every model." rendering as
 * "ONE / CONVERTER. EVERY / MODEL.", which reads as a typesetting mistake.
 *
 * This version lays out one flex row per authored line while keeping a single
 * continuous word index for the stagger, so the reveal still cascades across
 * the whole headline rather than restarting on each line.
 *
 * It is a separate component rather than a change to `Type.tsx` on purpose:
 * the two reels are already rendered and committed, and editing shared type
 * behaviour would leave their source no longer reproducing their delivered
 * files.
 */
export const KineticLines: React.FC<{
  text: string;
  size?: number;
  color?: string;
  weight?: 600 | 700 | 800;
  delay?: number;
  per?: number;
  gap?: number;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}> = ({
  text,
  size = 92,
  color = C.ink,
  weight = 800,
  delay = 0,
  per = 2.4,
  gap = 18,
  lh = 0.94,
  align = 'left',
  style,
}) => {
  const f = useCurrentFrame();
  const lines = text.split('\n');
  let idx = 0;
  const justify =
    align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

  return (
    <div style={{display: 'flex', flexDirection: 'column', ...style}}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: `${gap * 0.26}px ${gap}px`,
            justifyContent: justify,
          }}
        >
          {line.split(' ').filter(Boolean).map((w, wi) => {
            const s = pop(f, stag(idx++, per, delay), 15);
            return (
              <span
                key={wi}
                style={{
                  fontFamily: F.display,
                  fontWeight: weight,
                  fontSize: size,
                  lineHeight: lh,
                  letterSpacing: -0.5,
                  textTransform: 'uppercase',
                  color,
                  display: 'inline-block',
                  transform: `translateY(${(1 - s) * 26}px)`,
                  opacity: Math.min(1, s * 1.6),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
