import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, SAFE} from '../lib/theme';
import {EASE_CAMERA, meterLevel, ramp, stag} from '../lib/anim';
import {Micro} from './Type';

/**
 * The vector/SVG motion assets the creative brief's Section 11 asks for, built
 * natively in Remotion + SVG.
 *
 *   · SharedDac      — the glowing minimalist microchip that "stamps" onto each
 *                      chassis as its segment begins, reinforcing that the
 *                      brain is identical across all three units
 *   · MeterPanel     — the full-colour 160x120 LCD, with meters that bounce as
 *                      if reacting to audio (brief Section 7's Metering Reveal)
 *   · LoopbackPath   — Computer/DAW -> M-Series -> merged with Microphone ->
 *                      out to Livestream, explaining driver loopback
 *   · CvModular      — a DC-coupled TRS output sending a straight voltage line
 *                      to a Eurorack module
 *   · IoBar          — the horizontal bar that expands 2 -> 4 -> 6, carried
 *                      across both reels as a continuity thread
 *   · RackFocus      — the M4/M6 tactile-engagement device: focal plane pulls
 *                      from the combo-jack texture to the Mix knob
 *
 * motion-canvas was consulted only as a conceptual reference for scripting
 * these; nothing from it is imported or run inside this Remotion project.
 */

// ---------------------------------------------------------------------------
// Shared DAC microchip motif
// ---------------------------------------------------------------------------
export const SharedDac: React.FC<{
  size?: number;
  delay?: number;
  label?: string;
  glow?: boolean;
}> = ({size = 190, delay = 0, label = 'ESS SABRE32 ULTRA™', glow = true}) => {
  const f = useCurrentFrame();
  // the "stamp": overshoots slightly then settles — eased, never linear
  const stampIn = ramp(f, [delay, delay + 20], [0, 1], EASE_CAMERA);
  const settle = ramp(f, [delay + 14, delay + 34], [1, 0], EASE_CAMERA);
  const s = 0.86 + stampIn * 0.14 + settle * 0.07;
  const pulse = 0.5 + 0.5 * Math.sin(((f - delay) / 30) * 1.5);
  const pins = 7;
  const body = size * 0.56;
  const pinLen = size * 0.13;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        opacity: stampIn,
        transform: `scale(${s})`,
        transformOrigin: 'center center',
      }}
    >
      {glow ? (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.16,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.motu}${Math.round(
              (0.16 + pulse * 0.12) * 255,
            )
              .toString(16)
              .padStart(2, '0')} 0%, ${C.motu}00 68%)`,
          }}
        />
      ) : null}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display: 'block'}}>
        {/* pins */}
        {new Array(pins).fill(0).map((_, i) => {
          const step = body / (pins + 1);
          const o = (size - body) / 2 + step * (i + 1);
          const lit = ramp(f, [delay + 8 + i * 1.6, delay + 20 + i * 1.6], [0, 1]);
          const col = i % 2 === 0 ? C.motu : C.inkDim;
          return (
            <g key={i} opacity={0.35 + lit * 0.65}>
              <rect x={o - 2} y={(size - body) / 2 - pinLen} width={4} height={pinLen} fill={col} rx={1} />
              <rect x={o - 2} y={(size + body) / 2} width={4} height={pinLen} fill={col} rx={1} />
              <rect x={(size - body) / 2 - pinLen} y={o - 2} width={pinLen} height={4} fill={col} rx={1} />
              <rect x={(size + body) / 2} y={o - 2} width={pinLen} height={4} fill={col} rx={1} />
            </g>
          );
        })}
        {/* body */}
        <rect
          x={(size - body) / 2}
          y={(size - body) / 2}
          width={body}
          height={body}
          rx={size * 0.045}
          fill={C.ink}
        />
        <rect
          x={(size - body) / 2 + 5}
          y={(size - body) / 2 + 5}
          width={body - 10}
          height={body - 10}
          rx={size * 0.032}
          fill="none"
          stroke={C.motuOnDark}
          strokeWidth={1.4}
          opacity={0.5 + pulse * 0.4}
        />
        {/* orientation notch */}
        <circle
          cx={(size - body) / 2 + body * 0.19}
          cy={(size - body) / 2 + body * 0.19}
          r={size * 0.021}
          fill={C.motuOnDark}
          opacity={0.85}
        />
        {/* die trace */}
        <path
          d={`M ${size / 2 - body * 0.16} ${size / 2 + body * 0.1}
              L ${size / 2 - body * 0.02} ${size / 2 + body * 0.1}
              L ${size / 2 - body * 0.02} ${size / 2 - body * 0.06}
              L ${size / 2 + body * 0.17} ${size / 2 - body * 0.06}`}
          fill="none"
          stroke={C.lcdGreen}
          strokeWidth={2}
          strokeLinecap="square"
          opacity={0.34 + pulse * 0.4}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: size * 0.5 - 9,
            textAlign: 'center',
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: size * 0.062,
            letterSpacing: 1.2,
            color: C.paperHi,
            opacity: ramp(f, [delay + 16, delay + 32], [0, 1]),
          }}
        >
          DAC
        </div>
      ) : null}
    </div>
  );
};

/** The chip label, set beside the motif rather than inside it. */
export const SharedDacLabel: React.FC<{delay?: number; text?: string}> = ({
  delay = 0,
  text = 'ESS SABRE32 ULTRA™',
}) => {
  const f = useCurrentFrame();
  return (
    <Micro
      size={16}
      tracking={2.8}
      color={C.motu}
      style={{opacity: ramp(f, [delay, delay + 18], [0, 1])}}
    >
      {text}
    </Micro>
  );
};

// ---------------------------------------------------------------------------
// The full-colour LCD, with live metering
// ---------------------------------------------------------------------------
/**
 * A vector recreation of the M-Series' 160x120 full-colour LCD.
 *
 * The brief (Section 7) requires that the on-screen meters "animate
 * dynamically, bouncing as if reacting to an invisible, rhythmic audio track".
 * A still photograph cannot do that, so the metering is drawn as vector and
 * driven by `meterLevel`, which is locked to the 120 BPM music grid — the bars
 * hit on the beat and release between them.
 *
 * Colours are sampled from the real LCD in the supplied M6 macro asset, so the
 * graphic and the photography agree.
 */
export const MeterPanel: React.FC<{
  w?: number;
  channels?: number;
  outs?: number;
  delay?: number;
  label?: string;
  showScale?: boolean;
}> = ({w = 400, channels = 2, outs = 2, delay = 0, label, showScale = true}) => {
  const f = useCurrentFrame();
  const h = Math.round(w * 0.75); // 160x120 -> 4:3
  const inn = ramp(f, [delay, delay + 18], [0, 1]);
  const pad = w * 0.055;
  const headH = h * 0.13;
  const barsTop = pad + headH;
  const barsH = h - barsTop - pad - h * 0.1;
  const total = channels + outs;
  const gapG = w * 0.045; // gap between IN group and OUT group
  const avail = w - pad * 2 - gapG;
  const bw = avail / total;
  const barW = bw * 0.62;

  const seg = 13; // segmented LED look, like the real display

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.028,
        backgroundColor: C.lcdBody,
        border: `${Math.max(2, w * 0.008)}px solid ${C.ink}`,
        boxShadow: `0 20px 46px -22px rgba(10,16,23,0.55), inset 0 0 ${w * 0.09}px rgba(86,238,0,0.10)`,
        position: 'relative',
        overflow: 'hidden',
        opacity: inn,
      }}
    >
      {/* glass sheen — kept subtle so it never washes out the meters, per the
          brief's rule that the display must not glare */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
      {/* header */}
      <div
        style={{
          position: 'absolute',
          left: pad,
          top: pad * 0.7,
          right: pad,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: w * 0.042,
            letterSpacing: 1.4,
            color: C.lcdGreen,
            opacity: 0.9,
          }}
        >
          {label ?? 'METERS'}
        </span>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 500,
            fontSize: w * 0.034,
            letterSpacing: 1.1,
            color: C.lcdYellow,
            opacity: 0.72,
          }}
        >
          24-BIT / 192 kHz
        </span>
      </div>

      {/* dB scale rules */}
      {showScale
        ? [0.18, 0.42, 0.68].map((t, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: pad,
                right: pad,
                top: barsTop + barsH * t,
                height: 1,
                backgroundColor: C.lcdGreen,
                opacity: 0.13,
              }}
            />
          ))
        : null}

      {/* bars */}
      {new Array(total).fill(0).map((_, i) => {
        const isOut = i >= channels;
        const gx = pad + i * bw + (isOut ? gapG : 0) + (bw - barW) / 2;
        const lvl = meterLevel(f - delay, i, isOut ? 0.62 : 0.5) * ramp(f, [delay + 6, delay + 26], [0, 1]);
        const litSegs = Math.round(lvl * seg);
        return (
          <div key={i} style={{position: 'absolute', left: gx, top: barsTop, width: barW, height: barsH}}>
            {new Array(seg).fill(0).map((__, s) => {
              const fromTop = seg - 1 - s;
              const sh = barsH / seg;
              const on = s < litSegs;
              // green low, yellow upper-mid, red top — the real LCD's ramp
              const col =
                fromTop <= 1 ? C.lcdRed : fromTop <= 3 ? C.lcdYellow : C.lcdGreen;
              return (
                <div
                  key={s}
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: s * sh,
                    width: '100%',
                    height: sh - Math.max(1, barsH * 0.006),
                    borderRadius: 1,
                    backgroundColor: col,
                    opacity: on ? 0.95 : 0.07,
                    boxShadow: on ? `0 0 ${w * 0.014}px ${col}` : undefined,
                  }}
                />
              );
            })}
          </div>
        );
      })}

      {/* channel numbers + IN / OUT group labels */}
      {new Array(total).fill(0).map((_, i) => {
        const isOut = i >= channels;
        const gx = pad + i * bw + (isOut ? gapG : 0);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: gx,
              top: barsTop + barsH + h * 0.012,
              width: bw,
              textAlign: 'center',
              fontFamily: F.mono,
              fontWeight: 600,
              fontSize: w * 0.036,
              color: isOut ? C.lcdYellow : C.lcdGreen,
              opacity: 0.8,
            }}
          >
            {isOut ? (outs === 2 ? ['L', 'R'][i - channels] : `${i - channels + 1}`) : `${i + 1}`}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: pad,
          bottom: pad * 0.34,
          width: channels * bw,
          textAlign: 'center',
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: w * 0.033,
          letterSpacing: 2,
          color: C.lcdGreen,
          opacity: 0.62,
        }}
      >
        IN
      </div>
      <div
        style={{
          position: 'absolute',
          left: pad + channels * bw + gapG,
          bottom: pad * 0.34,
          width: outs * bw,
          textAlign: 'center',
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: w * 0.033,
          letterSpacing: 2,
          color: C.lcdYellow,
          opacity: 0.62,
        }}
      >
        OUT
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// I/O comparison bar — the continuity thread across both reels
// ---------------------------------------------------------------------------
export const IoBar: React.FC<{
  ins: number;
  outs?: number;
  max?: number;
  w?: number;
  delay?: number;
  animateFrom?: number;
  label?: string;
}> = ({ins, outs, max = 6, w = SAFE.w, delay = 0, animateFrom, label}) => {
  const f = useCurrentFrame();
  const from = animateFrom ?? ins;
  const grow = ramp(f, [delay, delay + 26], [0, 1], EASE_CAMERA);
  const shown = from + (ins - from) * grow;
  const cellGap = 9;
  const cellW = (w - cellGap * (max - 1)) / max;
  const appear = ramp(f, [delay, delay + 14], [0, 1]);

  return (
    <div style={{width: w, opacity: appear}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 9,
        }}
      >
        <Micro size={14} tracking={2.6} color={C.inkDim}>
          {label ?? 'SIMULTANEOUS INPUTS'}
        </Micro>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 22,
            color: C.motu,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(shown)}
          {outs !== undefined ? (
            <span style={{color: C.inkDim, fontWeight: 500}}> IN / {outs} OUT</span>
          ) : null}
        </div>
      </div>
      <div style={{display: 'flex', gap: cellGap}}>
        {new Array(max).fill(0).map((_, i) => {
          const fill = Math.max(0, Math.min(1, shown - i));
          return (
            <div
              key={i}
              style={{
                width: cellW,
                height: 12,
                borderRadius: 3,
                backgroundColor: C.paperDeep,
                border: `1px solid ${C.lineSoft}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${fill * 100}%`,
                  height: '100%',
                  backgroundColor: C.motu,
                  borderRadius: 2,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Loopback signal path
// ---------------------------------------------------------------------------
const NodeBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  glyph: React.ReactNode;
  delay: number;
  accentCol?: string;
  dark?: boolean;
}> = ({x, y, w, h, title, glyph, delay, accentCol = C.motu, dark = false}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 18], [0, 1], EASE_CAMERA);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 10,
        backgroundColor: dark ? C.ink : C.paperHi,
        border: `1px solid ${dark ? C.ink : C.line}`,
        boxShadow: '0 16px 36px -24px rgba(10,16,23,0.36)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      <div style={{color: dark ? C.motuOnDark : accentCol, display: 'flex'}}>{glyph}</div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: dark ? C.paperHi : C.inkSoft,
          textAlign: 'center',
          lineHeight: 1.25,
          paddingLeft: 6,
          paddingRight: 6,
        }}
      >
        {title}
      </div>
    </div>
  );
};

const GlyphLaptop = ({s = 30}: {s?: number}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <rect x="3" y="4" width="18" height="12" rx="1.6" />
    <path d="M1.5 19h21l-1.4-2.4H2.9L1.5 19Z" />
  </svg>
);
const GlyphMic = ({s = 30}: {s?: number}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7" />
  </svg>
);
const GlyphBroadcast = ({s = 30}: {s?: number}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <circle cx="12" cy="12" r="2.4" />
    <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 16.5a6.4 6.4 0 0 0 0-9M4.4 4.4a10 10 0 0 0 0 15.2M19.6 19.6a10 10 0 0 0 0-15.2" />
  </svg>
);
const GlyphInterface = ({s = 32}: {s?: number}) => (
  <svg width={s} height={s} viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <rect x="2" y="4" width="28" height="16" rx="2" />
    <circle cx="8" cy="12" r="2.4" />
    <circle cx="15" cy="12" r="2.4" />
    <path d="M21 8.5v7M24 8.5v7M27 8.5v7" />
  </svg>
);
const GlyphEurorack = ({s = 32}: {s?: number}) => (
  <svg width={s} height={s} viewBox="0 0 32 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <rect x="2" y="2" width="28" height="20" rx="1.6" />
    <circle cx="8" cy="8" r="2" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="24" cy="8" r="2" />
    <path d="M6 15h4M14 15h4M22 15h4M6 18.5h20" />
  </svg>
);

/** Animated dot travelling a path, used by both signal diagrams. */
const FlowDots: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  color?: string;
  n?: number;
  speed?: number;
  dashed?: boolean;
}> = ({x1, y1, x2, y2, delay, color = C.motu, n = 3, speed = 46, dashed = false}) => {
  const f = useCurrentFrame();
  const on = ramp(f, [delay, delay + 14], [0, 1]);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <>
      <svg
        style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}
        width={1}
        height={1}
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={2}
          opacity={0.26 * on}
          strokeDasharray={dashed ? '6 6' : undefined}
        />
      </svg>
      {new Array(n).fill(0).map((_, i) => {
        const t = (((f - delay) * speed) / 60 / (len / 100) + i / n) % 1;
        if (f < delay) return null;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;
        const fadeEnds = Math.sin(Math.PI * t);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - 4,
              top: cy - 4,
              width: 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: color,
              opacity: on * fadeEnds * 0.92,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

/**
 * Loopback: the computer's own output is routed back through the interface,
 * merged with the live microphone, and sent out as one stream — no third-party
 * virtual audio cable required.
 */
export const LoopbackPath: React.FC<{w?: number; h?: number; delay?: number}> = ({
  w = SAFE.w,
  h = 430,
  delay = 0,
}) => {
  const bw = 176;
  const bh = 104;
  const midX = (w - bw) / 2;
  const topY = 8;
  const midY = 156;
  const botY = 304;

  return (
    <div style={{position: 'relative', width: w, height: h}}>
      {/* DAW top-left, Mic top-right, interface centre, broadcast bottom */}
      <FlowDots x1={bw / 2 + 6} y1={topY + bh} x2={midX + bw * 0.36} y2={midY} delay={delay + 20} />
      <FlowDots
        x1={w - bw / 2 - 6}
        y1={topY + bh}
        x2={midX + bw * 0.64}
        y2={midY}
        delay={delay + 26}
        color={C.lcdGreenInk}
      />
      <FlowDots
        x1={w / 2}
        y1={midY + bh}
        x2={w / 2}
        y2={botY}
        delay={delay + 36}
        n={4}
        speed={58}
      />

      <NodeBox
        x={6}
        y={topY}
        w={bw}
        h={bh}
        title={'COMPUTER\nDAW PLAYBACK'}
        glyph={<GlyphLaptop />}
        delay={delay}
      />
      <NodeBox
        x={w - bw - 6}
        y={topY}
        w={bw}
        h={bh}
        title={'LIVE\nMICROPHONE'}
        glyph={<GlyphMic />}
        delay={delay + 8}
        accentCol={C.lcdGreenInk}
      />
      <NodeBox
        x={midX}
        y={midY}
        w={bw}
        h={bh}
        title={'M-SERIES\nDRIVER LOOPBACK'}
        glyph={<GlyphInterface />}
        delay={delay + 16}
        dark
      />
      <NodeBox
        x={midX}
        y={botY}
        w={bw}
        h={bh}
        title={'LIVESTREAM\nONE MERGED FEED'}
        glyph={<GlyphBroadcast />}
        delay={delay + 30}
      />
    </div>
  );
};

/**
 * CV / modular: the DC-coupled TRS outputs can carry control voltage straight
 * to a Eurorack module — a capability the brief flags as rare at this tier.
 */
export const CvModular: React.FC<{w?: number; h?: number; delay?: number}> = ({
  w = SAFE.w,
  h = 190,
  delay = 0,
}) => {
  const f = useCurrentFrame();
  const bw = 210;
  const bh = 104;
  const y = 34;
  const x2 = w - bw;
  const on = ramp(f, [delay + 18, delay + 34], [0, 1]);
  // a stepped voltage staircase rather than a smooth curve — it is a control
  // voltage, not audio
  const steps = 6;
  const lineY = y + bh / 2;
  const span = x2 - bw;

  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <svg
        style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
        width={w}
        height={h}
      >
        <path
          d={new Array(steps)
            .fill(0)
            .map((_, i) => {
              const sx = bw + (span * i) / steps;
              const ex = bw + (span * (i + 1)) / steps;
              const sy = lineY + 20 - (40 * i) / (steps - 1);
              return `${i === 0 ? 'M' : 'L'} ${sx} ${sy} L ${ex} ${sy}`;
            })
            .join(' ')}
          fill="none"
          stroke={C.motu}
          strokeWidth={2.4}
          strokeLinecap="square"
          opacity={0.34 + on * 0.5}
          strokeDasharray={span * 1.6}
          strokeDashoffset={(1 - on) * span * 1.6}
        />
      </svg>
      <FlowDots
        x1={bw + 4}
        y1={lineY + 20}
        x2={x2 - 4}
        y2={lineY - 20}
        delay={delay + 24}
        n={2}
        speed={40}
        dashed
      />
      <NodeBox
        x={0}
        y={y}
        w={bw}
        h={bh}
        title={'DC-COUPLED\n1/4" TRS OUTPUT'}
        glyph={<GlyphInterface />}
        delay={delay}
        dark
      />
      <NodeBox
        x={x2}
        y={y}
        w={bw}
        h={bh}
        title={'EURORACK\nMODULAR SYNTH'}
        glyph={<GlyphEurorack />}
        delay={delay + 12}
      />
      <div
        style={{
          position: 'absolute',
          left: bw,
          top: y - 26,
          width: span,
          textAlign: 'center',
          opacity: on,
        }}
      >
        <Micro size={13} tracking={2.4} color={C.motu}>
          CONTROL VOLTAGE
        </Micro>
      </div>
    </div>
  );
};

/**
 * The brief's Tactile Engagement device (M4 & M6): the focal plane starts on
 * the combo-jack texture and pulls sharply to the Mix knob, while an on-screen
 * indicator rotates to visualise blending direct input against playback.
 */
export const RackFocus: React.FC<{
  w?: number;
  delay?: number;
  /** 0 = fully DIRECT INPUT, 1 = fully COMPUTER PLAYBACK. */
  to?: number;
}> = ({w = 320, delay = 0, to = 0.62}) => {
  const f = useCurrentFrame();
  const inP = ramp(f, [delay, delay + 20], [0, 1], EASE_CAMERA);
  const rot = ramp(f, [delay + 14, delay + 62], [-125, -125 + 250 * to], EASE_CAMERA);
  const size = w * 0.52;
  const mix = ramp(f, [delay + 14, delay + 62], [0, to], EASE_CAMERA);

  return (
    <div style={{width: w, opacity: inP}}>
      <div style={{display: 'flex', alignItems: 'center', gap: w * 0.07}}>
        {/* the knob */}
        <div style={{width: size, height: size, position: 'relative', flexShrink: 0}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `conic-gradient(from -130deg, ${C.motu} 0deg, ${C.motu} ${
                mix * 250
              }deg, ${C.paperDeep} ${mix * 250}deg, ${C.paperDeep} 250deg, transparent 250deg)`,
              WebkitMask: `radial-gradient(circle, transparent 0 ${size * 0.38}px, #000 ${
                size * 0.4
              }px)`,
              mask: `radial-gradient(circle, transparent 0 ${size * 0.38}px, #000 ${size * 0.4}px)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: size * 0.13,
              borderRadius: '50%',
              background: `linear-gradient(155deg, #2A323C 0%, ${C.ink} 62%)`,
              border: `1px solid ${C.ink}`,
              boxShadow: '0 8px 20px -10px rgba(10,16,23,0.6)',
              transform: `rotate(${rot}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: size * 0.08,
                width: 3,
                height: size * 0.22,
                marginLeft: -1.5,
                borderRadius: 2,
                backgroundColor: C.motuOnDark,
                boxShadow: `0 0 8px ${C.motuOnDark}`,
              }}
            />
          </div>
        </div>
        {/* the blend readout */}
        <div style={{flex: 1}}>
          <Micro size={13} tracking={2.2} color={C.inkDim}>
            INPUT MONITOR MIX
          </Micro>
          <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8}}>
            {[
              {k: 'DIRECT INPUT', v: 1 - mix},
              {k: 'COMPUTER PLAYBACK', v: mix},
            ].map((r) => (
              <div key={r.k}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: F.mono,
                    fontSize: 12.5,
                    letterSpacing: 1.3,
                    color: C.inkSoft,
                    marginBottom: 4,
                  }}
                >
                  <span>{r.k}</span>
                  <span style={{color: C.motu, fontWeight: 700}}>{Math.round(r.v * 100)}%</span>
                </div>
                <div
                  style={{
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: C.paperDeep,
                    border: `1px solid ${C.lineSoft}`,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${r.v * 100}%`,
                      height: '100%',
                      backgroundColor: C.motu,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * A compact spec strip — the identical shared-engine figures, presented the
 * same way in both reels so the "same engine" claim is visually literal.
 */
export const SharedSpecStrip: React.FC<{
  items: readonly {k: string; v: string}[];
  w?: number;
  delay?: number;
  cols?: number;
}> = ({items, w = SAFE.w, delay = 0, cols = 3}) => {
  const f = useCurrentFrame();
  const gap = 12;
  const cw = (w - gap * (cols - 1)) / cols;
  return (
    <div style={{width: w, display: 'flex', flexWrap: 'wrap', gap}}>
      {items.map((it, i) => {
        const d = stag(i, 4, delay);
        const p = ramp(f, [d, d + 16], [0, 1]);
        return (
          <div
            key={it.k}
            style={{
              width: cw,
              opacity: p,
              transform: `translateY(${(1 - p) * 12}px)`,
              backgroundColor: C.paperHi,
              border: `1px solid ${C.lineSoft}`,
              borderTop: `3px solid ${C.motu}`,
              borderRadius: 7,
              padding: '11px 13px 12px',
            }}
          >
            <Micro size={11.5} tracking={1.8} color={C.inkDim}>
              {it.k}
            </Micro>
            <div
              style={{
                fontFamily: F.mono,
                fontWeight: 600,
                fontSize: 20,
                color: C.ink,
                marginTop: 5,
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              {it.v}
            </div>
          </div>
        );
      })}
    </div>
  );
};
