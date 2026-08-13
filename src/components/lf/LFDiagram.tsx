import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, T} from '../../lib/lf-theme';
import {EASE_OUT, ramp, rnd} from '../../lib/anim';
import {Micro} from '../Type';

/**
 * The four vector graphics the creative brief's Section 11 asks for, built as
 * native Remotion/SVG. Motion-canvas is deliberately not involved — Section 0b
 * says to treat it as conceptual reference only and implement natively.
 *
 * These are the elaborated long-form versions. The reels had to state each idea
 * in two or three seconds; here each diagram gets a real beat, so the signal
 * paths actually travel, the chip actually stamps, and the I/O bar actually
 * counts.
 *
 * All motion is eased. The brief is explicit that linear movement "feels cheap
 * and robotic", so every interpolation below runs through EASE_OUT or a spring.
 */

// ---------------------------------------------------------------------------
// 1. THE SHARED DAC MOTIF
//
// A minimalist microchip that stamps onto the chassis as each unit's segment
// begins — the visual carrier of "the brain is identical across all three".
// ---------------------------------------------------------------------------
export const ChipMotif: React.FC<{
  x: number;
  y: number;
  size?: number;
  delay?: number;
  label?: string;
  stamp?: boolean;
}> = ({x, y, size = 190, delay = 0, label = 'ESS SABRE32 ULTRA™', stamp = true}) => {
  const f = useCurrentFrame() - delay;
  const p = ramp(f, [0, 26], [0, 1], EASE_OUT);
  // the "stamp": overshoot down onto the surface, then settle
  const s = stamp ? 1.5 - 0.5 * p : 1;
  const glow = ramp(f, [18, 46], [0, 1]);
  const pulse = 0.72 + 0.28 * Math.sin((f - 18) * 0.09);
  const pins = 7;
  const body = size * 0.62;
  const off = (size - body) / 2;

  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: p}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{display: 'block'}}>
        <defs>
          <linearGradient id="chipFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.paperHi} />
            <stop offset="100%" stopColor={C.paperDeep} />
          </linearGradient>
        </defs>
        <g transform={`translate(${size / 2} ${size / 2}) scale(${s}) translate(${-size / 2} ${-size / 2})`}>
          {/* pins */}
          {new Array(pins).fill(0).map((_, i) => {
            const step = body / (pins + 1);
            const c = off + step * (i + 1);
            const len = off * 0.66;
            const o = ramp(f, [8 + i * 1.6, 24 + i * 1.6], [0, 1]);
            return (
              <g key={i} opacity={o}>
                <rect x={c - 3} y={off - len} width={6} height={len} rx={2} fill={C.motu} opacity={0.72} />
                <rect x={c - 3} y={off + body} width={6} height={len} rx={2} fill={C.motu} opacity={0.72} />
                <rect x={off - len} y={c - 3} width={len} height={6} rx={2} fill={C.motu} opacity={0.72} />
                <rect x={off + body} y={c - 3} width={len} height={6} rx={2} fill={C.motu} opacity={0.72} />
              </g>
            );
          })}
          {/* glow halo */}
          <rect
            x={off - 8}
            y={off - 8}
            width={body + 16}
            height={body + 16}
            rx={18}
            fill="none"
            stroke={C.motu}
            strokeWidth={2}
            opacity={glow * 0.30 * pulse}
          />
          {/* body */}
          <rect
            x={off}
            y={off}
            width={body}
            height={body}
            rx={13}
            fill="url(#chipFace)"
            stroke={C.motu}
            strokeWidth={2.6}
          />
          {/* die trace */}
          <rect
            x={off + body * 0.24}
            y={off + body * 0.24}
            width={body * 0.52}
            height={body * 0.52}
            rx={6}
            fill="none"
            stroke={C.motu}
            strokeWidth={1.6}
            opacity={0.5 + 0.3 * glow}
          />
          <circle cx={off + body * 0.5} cy={off + body * 0.5} r={body * 0.11} fill={C.motu} opacity={glow * 0.85} />
          {/* orientation notch */}
          <circle cx={off + 17} cy={off + 17} r={4.4} fill={C.motu} opacity={0.6} />
        </g>
      </svg>
      {label ? (
        <div style={{marginTop: 10, opacity: ramp(f, [26, 46], [0, 1]), width: size, textAlign: 'center'}}>
          <Micro size={T.micro - 3} color={C.motu} tracking={2.2}>
            {label}
          </Micro>
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. LOOPBACK SIGNAL PATH
//
// Computer/DAW -> interface -> merging with a live microphone -> out to a
// livestream. The long-form version actually animates packets along the path
// rather than just drawing it.
// ---------------------------------------------------------------------------
const NodeBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  delay: number;
  accent?: boolean;
  icon?: 'monitor' | 'box' | 'mic' | 'cast';
}> = ({x, y, w, h, label, sub, delay, accent = false, icon = 'box'}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 20], [0, 1], EASE_OUT);
  const stroke = accent ? C.motu : C.inkDim;
  return (
    <g opacity={p} transform={`translate(${x} ${y}) scale(${0.96 + 0.04 * p})`}>
      <rect
        width={w}
        height={h}
        rx={12}
        fill={C.paperHi}
        stroke={stroke}
        strokeWidth={accent ? 2.6 : 1.8}
      />
      <g transform={`translate(${w / 2} ${h * 0.34})`} stroke={stroke} strokeWidth={2.2} fill="none">
        {icon === 'monitor' ? (
          <>
            <rect x={-26} y={-18} width={52} height={34} rx={3} />
            <line x1={-11} y1={22} x2={11} y2={22} />
            <line x1={0} y1={16} x2={0} y2={22} />
          </>
        ) : null}
        {icon === 'box' ? (
          <>
            <rect x={-32} y={-14} width={64} height={28} rx={4} />
            <circle cx={-19} cy={0} r={4.5} />
            <circle cx={-5} cy={0} r={4.5} />
            <rect x={6} y={-6} width={22} height={12} rx={2} fill={C.motu} stroke="none" opacity={0.55} />
          </>
        ) : null}
        {icon === 'mic' ? (
          <>
            <rect x={-8} y={-20} width={16} height={26} rx={8} />
            <path d="M -15 2 A 15 15 0 0 0 15 2" />
            <line x1={0} y1={17} x2={0} y2={24} />
          </>
        ) : null}
        {icon === 'cast' ? (
          <>
            <circle cx={0} cy={4} r={4} fill={stroke} />
            <path d="M -12 -6 A 17 17 0 0 1 12 -6" />
            <path d="M -21 -15 A 30 30 0 0 1 21 -15" />
          </>
        ) : null}
      </g>
      <text
        x={w / 2}
        y={h * 0.74}
        textAnchor="middle"
        fontFamily={F.ui}
        fontSize={20}
        fontWeight={700}
        fill={C.ink}
        letterSpacing={0.4}
      >
        {label}
      </text>
      {sub ? (
        <text
          x={w / 2}
          y={h * 0.89}
          textAnchor="middle"
          fontFamily={F.mono}
          fontSize={14}
          fill={C.inkDim}
          letterSpacing={1.1}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

/** Packets travelling along a straight run. */
const Packets: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  n?: number;
  speed?: number;
  color?: string;
}> = ({x1, y1, x2, y2, delay, n = 3, speed = 0.011, color = C.motu}) => {
  const f = useCurrentFrame() - delay;
  if (f < 0) return null;
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const t = ((f * speed + i / n) % 1);
        const e = t;
        return (
          <circle
            key={i}
            cx={x1 + (x2 - x1) * e}
            cy={y1 + (y2 - y1) * e}
            r={5}
            fill={color}
            opacity={0.28 + 0.6 * Math.sin(Math.PI * t)}
          />
        );
      })}
    </>
  );
};

const Wire: React.FC<{d: string; delay: number; dash?: boolean; color?: string}> = ({
  d,
  delay,
  dash = false,
  color = C.line,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 26], [0, 1], EASE_OUT);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeDasharray={dash ? '7 7' : undefined}
      pathLength={1}
      strokeDashoffset={dash ? undefined : 1 - p}
      style={dash ? {opacity: p} : {strokeDasharray: 1}}
    />
  );
};

export const LoopbackDiagram: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  delay?: number;
}> = ({x, y, w = 1420, h = 330, delay = 0}) => {
  const bw = 210;
  const bh = 128;
  const rowY = 96;
  const gap = (w - bw * 4) / 3;
  const cx = (i: number) => i * (bw + gap);
  const midY = rowY + bh / 2;

  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>
        {/* DAW -> interface */}
        <Wire d={`M ${cx(0) + bw} ${midY} L ${cx(1)} ${midY}`} delay={delay + 22} />
        <Packets x1={cx(0) + bw} y1={midY} x2={cx(1)} y2={midY} delay={delay + 44} />

        {/* mic joins from below into the interface */}
        <Wire
          d={`M ${cx(1) + bw / 2} ${rowY + bh + 96} L ${cx(1) + bw / 2} ${rowY + bh + 34} Q ${cx(1) + bw / 2} ${rowY + bh} ${cx(1) + bw / 2 + 22} ${rowY + bh}`}
          delay={delay + 40}
          color={C.motu}
        />

        {/* interface -> merged -> stream */}
        <Wire d={`M ${cx(1) + bw} ${midY} L ${cx(2)} ${midY}`} delay={delay + 56} color={C.motu} />
        <Packets x1={cx(1) + bw} y1={midY} x2={cx(2)} y2={midY} delay={delay + 74} n={4} />
        <Wire d={`M ${cx(2) + bw} ${midY} L ${cx(3)} ${midY}`} delay={delay + 74} color={C.motu} />
        <Packets x1={cx(2) + bw} y1={midY} x2={cx(3)} y2={midY} delay={delay + 90} n={4} />

        <NodeBox x={cx(0)} y={rowY} w={bw} h={bh} label="COMPUTER / DAW" sub="PLAYBACK" delay={delay} icon="monitor" />
        <NodeBox x={cx(1)} y={rowY} w={bw} h={bh} label="M-SERIES" sub="DRIVER LOOPBACK" delay={delay + 16} accent icon="box" />
        <NodeBox x={cx(2)} y={rowY} w={bw} h={bh} label="MERGED" sub="MIC + PLAYBACK" delay={delay + 50} accent icon="box" />
        <NodeBox x={cx(3)} y={rowY} w={bw} h={bh} label="LIVESTREAM" sub="ONE CLEAN FEED" delay={delay + 68} icon="cast" />

        {/* the live mic, entering from below */}
        <NodeBox
          x={cx(1) - bw / 2 + bw / 2}
          y={rowY + bh + 96}
          w={bw}
          h={bh - 26}
          label="MICROPHONE"
          sub="LIVE INPUT"
          delay={delay + 34}
          icon="mic"
        />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. CV / MODULAR SYNTHESIZER DIAGRAM
//
// A DC-coupled TRS output sending a straight voltage line into a Eurorack case.
// ---------------------------------------------------------------------------
export const CvDiagram: React.FC<{x: number; y: number; w?: number; delay?: number}> = ({
  x,
  y,
  w = 1160,
  delay = 0,
}) => {
  const f = useCurrentFrame() - delay;
  const h = 300;
  const jackX = 96;
  const rackX = w - 330;
  const midY = 150;
  const p = ramp(f, [0, 24], [0, 1], EASE_OUT);
  const travel = ramp(f, [26, 74], [0, 1], EASE_OUT);
  const holdV = ramp(f, [74, 96], [0, 1]);

  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: p}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>
        {/* TRS jack */}
        <g transform={`translate(${jackX} ${midY})`}>
          <circle r={40} fill={C.paperHi} stroke={C.ink} strokeWidth={2.6} />
          <circle r={22} fill="none" stroke={C.inkDim} strokeWidth={2} />
          <circle r={9} fill={C.ink} />
          <text
            y={70}
            textAnchor="middle"
            fontFamily={F.mono}
            fontSize={16}
            fill={C.inkDim}
            letterSpacing={1.6}
          >
            DC-COUPLED TRS
          </text>
        </g>

        {/* the voltage line — deliberately straight, this is DC not audio */}
        <line
          x1={jackX + 42}
          y1={midY}
          x2={jackX + 42 + (rackX - jackX - 42) * travel}
          y2={midY}
          stroke={C.motu}
          strokeWidth={3.4}
        />
        {/* a stepped control voltage riding the line once it lands */}
        {holdV > 0.01 ? (
          <polyline
            points={(() => {
              const x0 = jackX + 60;
              const x1 = rackX - 18;
              const steps = 8;
              const pts: string[] = [];
              for (let i = 0; i < steps; i++) {
                const a = x0 + ((x1 - x0) * i) / steps;
                const b = x0 + ((x1 - x0) * (i + 1)) / steps;
                const lvl = midY - 12 - ((i * 37) % 46);
                pts.push(`${a},${lvl}`, `${b},${lvl}`);
              }
              return pts.join(' ');
            })()}
            fill="none"
            stroke={C.motu}
            strokeWidth={2.4}
            opacity={holdV * 0.85}
          />
        ) : null}

        {/* Eurorack case */}
        <g transform={`translate(${rackX} ${midY - 96})`} opacity={ramp(f, [56, 82], [0, 1])}>
          <rect width={300} height={192} rx={10} fill={C.paperHi} stroke={C.ink} strokeWidth={2.4} />
          {new Array(5).fill(0).map((_, i) => (
            <g key={i} transform={`translate(${14 + i * 56} 14)`}>
              <rect width={46} height={164} rx={5} fill={C.paperDeep} stroke={C.line} strokeWidth={1.4} />
              {new Array(3).fill(0).map((_, k) => (
                <circle
                  key={k}
                  cx={23}
                  cy={30 + k * 34}
                  r={7}
                  fill="none"
                  stroke={i === 0 ? C.motu : C.inkDim}
                  strokeWidth={1.8}
                />
              ))}
              <rect
                x={11}
                y={132}
                width={24}
                height={5}
                rx={2.5}
                fill={i % 2 ? C.motu : C.inkDim}
                opacity={0.55}
              />
            </g>
          ))}
          <text
            x={150}
            y={222}
            textAnchor="middle"
            fontFamily={F.mono}
            fontSize={16}
            fill={C.inkDim}
            letterSpacing={1.6}
          >
            EURORACK / MODULAR
          </text>
        </g>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 4. I/O COMPARISON BAR
//
// Expands 2 -> 4 -> 6 across the runtime. The one motif that runs through both
// the reels and this video, so the series reads as one piece.
// ---------------------------------------------------------------------------
/**
 * The I/O comparison bar.
 *
 * NOTE this is a FLOW element, not an absolutely-positioned one. Every call
 * site wraps it in `At`, `Col` or a spaced `div`, so an absolute root ignored
 * those wrappers' margins and stacked the bar at their origin — which put it
 * straight through L25's headline. Position it with the wrapper.
 */
export const IoBar: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  filled: number;
  total?: number;
  label?: string;
  right?: string;
  delay?: number;
  cellH?: number;
}> = ({w = 720, filled, total = 6, label, right, delay = 0, cellH = 22}) => {
  const f = useCurrentFrame();
  const gap = 12;
  const cw = (w - gap * (total - 1)) / total;
  return (
    <div style={{position: 'relative', width: w}}>
      {(label || right) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 12,
            opacity: ramp(f, [delay, delay + 16], [0, 1]),
          }}
        >
          {label ? (
            <Micro size={T.micro - 2} color={C.inkDim} tracking={2.8}>
              {label}
            </Micro>
          ) : <span />}
          {right ? (
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 30,
                color: C.motu,
                letterSpacing: 0.2,
              }}
            >
              {right}
            </div>
          ) : null}
        </div>
      )}
      <div style={{display: 'flex', gap}}>
        {new Array(total).fill(0).map((_, i) => {
          const on = i < filled;
          const d = delay + 14 + i * 6;
          const p = ramp(f, [d, d + 18], [0, 1], EASE_OUT);
          return (
            <div
              key={i}
              style={{
                width: cw,
                height: cellH,
                borderRadius: 5,
                backgroundColor: on ? C.motu : C.paperDeep,
                border: on ? 'none' : `1px solid ${C.line}`,
                opacity: on ? p : 0.55 * p,
                transform: `scaleY(${0.5 + 0.5 * p})`,
                transformOrigin: 'center',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ANIMATED LCD METERING
//
// The brief asks for the on-screen meters to animate "as if reacting to an
// invisible, rhythmic audio track" during the metering reveal. Deterministic,
// so it renders identically every time.
// ---------------------------------------------------------------------------
export const LcdMeters: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  channels?: number;
  delay?: number;
  seed?: number;
}> = ({x, y, w = 420, h = 240, channels = 6, delay = 0, seed = 3}) => {
  const f = useCurrentFrame() - delay;
  const p = ramp(f, [0, 22], [0, 1], EASE_OUT);
  if (p <= 0.002) return null;

  const padX = 20;
  const padY = 18;
  const gap = 9;
  const cw = (w - padX * 2 - gap * (channels - 1)) / channels;
  const ch = h - padY * 2 - 24;
  const segs = 14;

  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: p}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block'}}>
        <rect width={w} height={h} rx={10} fill="#0B1620" stroke={C.ink} strokeWidth={2} />
        {new Array(channels).fill(0).map((_, c) => {
          // deterministic pseudo-audio: two detuned oscillators + a noise floor
          const ph = rnd(seed * 31 + c * 17) * 6.28;
          const lvl =
            0.52 +
            0.30 * Math.sin(f * 0.16 + ph) +
            0.16 * Math.sin(f * 0.41 + ph * 2.3) +
            0.06 * (rnd(Math.floor(f / 3) * 7 + c * 13) - 0.5);
          const lit = Math.max(1, Math.min(segs, Math.round(lvl * segs)));
          return (
            <g key={c} transform={`translate(${padX + c * (cw + gap)} ${padY})`}>
              {new Array(segs).fill(0).map((_, s) => {
                const idx = segs - 1 - s;
                const on = idx < lit;
                const sh = ch / segs;
                // LCD colour law: green body, amber shoulder, red only at the top
                const col = idx >= segs - 2 ? '#E5484D' : idx >= segs - 5 ? '#ADF100' : '#56EE00';
                return (
                  <rect
                    key={s}
                    x={0}
                    y={s * sh}
                    width={cw}
                    height={sh - 2.4}
                    rx={1.6}
                    fill={on ? col : '#14303A'}
                    opacity={on ? 0.95 : 0.5}
                  />
                );
              })}
              <text
                y={ch + 17}
                x={cw / 2}
                textAnchor="middle"
                fontFamily={F.mono}
                fontSize={12}
                fill="#7FA0AE"
              >
                {c + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
