import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, LF_CANVAS, LF_CONTENT, LF_RIGHT, T} from '../../lib/lf-theme';
import {
  CONTACT,
  DISTRIBUTOR_LINE,
  MOP,
  MOP_SUFFIX,
  PARTNER,
  PARTNER_ROLE_SHORT,
} from '../../lib/copy';
import {BrandBeat, beatsFor} from '../../lib/lf-brand-plan';
import {Body, Display, Kicker, Micro, Rule, Spec} from '../Type';
import {LogoInline, LogoMark, logoSize} from './Logo';
import {ramp, stag} from '../../lib/anim';

/**
 * Shivansh Electronics and MOTU branding for the long-form video.
 *
 * This is the exact inverse of the reels' rule. The reels add no logo at all;
 * here both marks recur throughout by explicit requirement, always shown
 * directly with no box, always moving. Every placement comes from the audited
 * plan in lib/lf-brand-plan.ts so scripts/branding_cadence.mjs is checking the
 * same data the picture is drawn from.
 *
 * The distributor designation is used in full and unabbreviated wherever the
 * CTA appears. The one compact form (PARTNER_ROLE_SHORT) keeps the territory
 * intact and is used only where a single line genuinely cannot carry the full
 * sentence at a legible size — never in place of the CTA statement itself.
 */

const contactValue = (k: NonNullable<BrandBeat['contact']>): string => {
  if (k === 'phone0') return CONTACT.phones[0];
  if (k === 'phone1') return CONTACT.phones[1];
  if (k === 'phone2') return CONTACT.phones[2];
  return CONTACT[k];
};

const CONTACT_LABEL: Record<string, string> = {
  website: 'WEBSITE',
  linktree: 'GATEWAY HUB',
  whatsappChannel: 'WHATSAPP CHANNEL',
  instagram: 'INSTAGRAM',
  youtube: 'YOUTUBE',
  linkedin: 'LINKEDIN',
  facebook: 'FACEBOOK',
  threads: 'THREADS',
  x: 'X',
  phone0: 'WHATSAPP',
  phone1: 'WHATSAPP',
  phone2: 'WHATSAPP',
};

/**
 * A lower-third: the mark plus one rotating contact detail.
 *
 * Anchored to the same slot the plan names, so a `third` at `bl` sits bottom
 * left with its text running right of the mark, and one at `tr` sits top right
 * with its text running left — the copy reflows rather than the mark moving to
 * suit the copy.
 */
const Third: React.FC<{b: BrandBeat}> = ({b}) => {
  const f = useCurrentFrame() - b.at;
  const size = b.size ?? 52;
  const {w, h} = logoSize(b.brand, size);
  const right = b.pos.endsWith('r');
  const top = b.pos.startsWith('t');

  const p = Math.min(ramp(f, [0, 20], [0, 1]), ramp(f, [b.dur - 16, b.dur], [1, 0]));
  if (p <= 0.002) return null;

  const label = b.contact ? CONTACT_LABEL[b.contact] : 'WEBSITE';
  const value = b.contact ? contactValue(b.contact) : CONTACT.website;

  return (
    <>
      <LogoMark brand={b.brand} pos={b.pos} size={size} at={b.at} dur={b.dur} />
      <div
        style={{
          position: 'absolute',
          left: right ? undefined : 104 + w + 26,
          right: right ? 104 + w + 26 : undefined,
          top: top ? 96 + h / 2 - 30 : LF_CANVAS.h - 96 - h / 2 - 30,
          opacity: p,
          transform: `translateX(${(1 - p) * (right ? 18 : -18)}px)`,
          textAlign: right ? 'right' : 'left',
          whiteSpace: 'nowrap',
        }}
      >
        <Micro size={T.micro - 3} color={C.inkDim} tracking={2.6}>
          {PARTNER} · {PARTNER_ROLE_SHORT}
        </Micro>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 0.3,
            color: C.motu,
            marginTop: 7,
            whiteSpace: 'nowrap',
          }}
        >
          {label} · {value}
        </div>
      </div>
    </>
  );
};

/**
 * A dedicated branding moment between segments.
 *
 * Carries the mark large, the FULL unabbreviated distributor designation, and a
 * rotating contact detail. Two of the four sit centred and two are offset (cl /
 * cr) with the copy balanced opposite — the cadence audit rejected all four
 * defaulting to centre, which would have been a pinned mark by another name.
 */
const Beat: React.FC<{b: BrandBeat; mop?: 'M2' | 'M4' | 'M6'}> = ({b, mop}) => {
  const f = useCurrentFrame() - b.at;
  const size = b.size ?? 96;
  const p = Math.min(ramp(f, [0, 24], [0, 1]), ramp(f, [b.dur - 20, b.dur], [1, 0]));
  if (p <= 0.002) return null;

  const offset = b.pos === 'cl' ? 'left' : b.pos === 'cr' ? 'right' : 'center';
  const colW = offset === 'center' ? 1280 : 980;
  const x =
    offset === 'left'
      ? LF_CONTENT.x
      : offset === 'right'
        ? LF_RIGHT - colW
        : Math.round((LF_CANVAS.w - colW) / 2);
  const align = offset === 'center' ? 'center' : offset === 'right' ? 'right' : 'left';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 300,
        width: colW,
        opacity: p,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
      }}
    >
      <LogoInline brand={b.brand} size={size} delay={4} />
      <Rule
        w={128}
        color={C.motu}
        thickness={5}
        style={{marginTop: 34, marginBottom: 26, opacity: ramp(f, [16, 34], [0, 1])}}
      />
      <div style={{opacity: ramp(f, [22, 44], [0, 1]), maxWidth: colW}}>
        <Body size={T.sub - 3} color={C.ink} weight={600} lh={1.36} align={align}>
          {DISTRIBUTOR_LINE}
        </Body>
      </div>
      {mop ? (
        <div style={{opacity: ramp(f, [38, 58], [0, 1]), marginTop: 26}}>
          <MopChip product={mop} />
        </div>
      ) : null}
      {b.contact ? (
        <div
          style={{
            opacity: ramp(f, [mop ? 52 : 40, mop ? 72 : 60], [0, 1]),
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{width: 7, height: 7, borderRadius: 7, backgroundColor: C.motu}} />
          <div
            style={{
              fontFamily: F.mono,
              fontWeight: 600,
              fontSize: 31,
              letterSpacing: 0.5,
              color: C.motu,
            }}
          >
            {contactValue(b.contact)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** The verified Market Operating Price, in the exact mandated terminology. */
export const MopChip: React.FC<{product: 'M2' | 'M4' | 'M6'; size?: number}> = ({product, size = 1}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 14,
      backgroundColor: C.ink,
      borderRadius: 10,
      padding: `${14 * size}px ${24 * size}px ${12 * size}px`,
    }}
  >
    <span
      style={{
        fontFamily: F.display,
        fontWeight: 800,
        fontSize: 38 * size,
        color: C.paperHi,
        letterSpacing: -0.2,
      }}
    >
      {MOP[product]}
    </span>
    <span
      style={{
        fontFamily: F.mono,
        fontWeight: 500,
        fontSize: 19 * size,
        letterSpacing: 1.2,
        color: '#8FB6FA',
        textTransform: 'uppercase',
      }}
    >
      {MOP_SUFFIX}
    </span>
  </div>
);

/**
 * The complete, unabbreviated distributor statement as a standalone block.
 * Used wherever a CTA lands mid-video.
 */
export const DistributorBlock: React.FC<{
  x?: number;
  y: number;
  w?: number;
  delay?: number;
  size?: number;
}> = ({x = LF_CONTENT.x, y, w = 1240, delay = 0, size = T.body}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 22], [0, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        display: 'flex',
        gap: 20,
      }}
    >
      <div style={{width: 6, borderRadius: 3, backgroundColor: C.motu, flexShrink: 0}} />
      <Body size={size} color={C.ink} weight={600} lh={1.4}>
        {DISTRIBUTOR_LINE}
      </Body>
    </div>
  );
};

/** Renders every branding appearance the plan declares for one scene. */
export const SceneBranding: React.FC<{scene: string; mop?: 'M2' | 'M4' | 'M6'}> = ({
  scene,
  mop,
}) => (
  <>
    {beatsFor(scene).map((b, i) => {
      if (b.form === 'third') return <Third key={i} b={b} />;
      if (b.form === 'beat') return <Beat key={i} b={b} mop={mop} />;
      if (b.form === 'outro') return null; // the outro composes its own marks
      return <LogoMark key={i} brand={b.brand} pos={b.pos} size={b.size} at={b.at} dur={b.dur} />;
    })}
  </>
);

// ---------------------------------------------------------------------------
// OUTRO
// ---------------------------------------------------------------------------
const Row2: React.FC<{label: string; value: string; delay: number; size?: number}> = ({
  label,
  value,
  delay,
  size = 21,
}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 14], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        opacity: p,
        transform: `translateY(${(1 - p) * 9}px)`,
      }}
    >
      <div style={{width: 146, flexShrink: 0}}>
        <Micro color={C.inkDim} size={18} tracking={2.2}>
          {label}
        </Micro>
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 500,
          fontSize: size,
          letterSpacing: 0.4,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
      <div style={{flex: 1, height: 1, backgroundColor: C.lineSoft, transform: 'translateY(-5px)'}} />
      <div style={{width: 7, height: 7, borderRadius: 7, backgroundColor: C.motu, opacity: 0.7}} />
    </div>
  );
};

/**
 * The closing block: both marks shown directly, the full designation, all three
 * Market Operating Prices recapped, and the complete contact set.
 */
export const Outro: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const head = ramp(f, [8, 34], [0, 1]);

  return (
    <>
      {/* both marks, top corners, shown directly with no plate */}
      <LogoMark brand="shivansh" pos="tl" size={84} at={24} dur={dur - 24} />
      <LogoMark brand="motu" pos="tr" size={58} at={24} dur={dur - 24} />

      <div
        style={{
          position: 'absolute',
          left: LF_CONTENT.x,
          top: 250,
          width: 900,
          opacity: head,
          transform: `translateY(${(1 - head) * 16}px)`,
        }}
      >
        <Kicker color={C.motu} size={T.kicker} tracking={4.6}>
          WHERE TO BUY
        </Kicker>
        <Rule w={124} color={C.motu} thickness={5} style={{marginTop: 16, marginBottom: 22}} />
        <Display size={T.displaySm} lh={0.92} color={C.ink}>
          {'Choose your channel count.\nKeep the studio quality.'}
        </Display>
      </div>

      {/* the complete unabbreviated designation */}
      <DistributorBlock y={496} w={900} delay={30} size={27} />

      {/* All three Market Operating Prices recapped, stacked so the block
          stays inside the left column and clear of the contact list. */}
      <div
        style={{
          position: 'absolute',
          left: LF_CONTENT.x,
          top: 636,
          width: 900,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {(['M2', 'M4', 'M6'] as const).map((p, i) => {
          const o = ramp(f, [stag(i, 7, 54), stag(i, 7, 54) + 18], [0, 1]);
          return (
            <div
              key={p}
              style={{
                opacity: o,
                transform: `translateY(${(1 - o) * 10}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <span
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 32,
                  color: C.ink,
                  letterSpacing: -0.2,
                  width: 158,
                  flexShrink: 0,
                }}
              >
                MOTU {p}
              </span>
              <MopChip product={p} size={0.62} />
            </div>
          );
        })}
      </div>

      {/* contact block */}
      <div
        style={{
          position: 'absolute',
          left: 1076,
          top: 262,
          width: 740,
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
        }}
      >
        <div style={{opacity: ramp(f, [26, 46], [0, 1]), marginBottom: 8}}>
          <Micro color={C.inkDim} size={19} tracking={3.0}>
            CONNECT
          </Micro>
        </div>
        <Row2 label="WEBSITE" delay={stag(0, 3.2, 34)} value={CONTACT.website} />
        <Row2 label="GATEWAY HUB" delay={stag(1, 3.2, 34)} value={CONTACT.linktree} />
        <Row2 label="WHATSAPP" delay={stag(2, 3.2, 34)} value={CONTACT.phones[0]} />
        <Row2 label="WHATSAPP" delay={stag(3, 3.2, 34)} value={CONTACT.phones[1]} />
        <Row2 label="WHATSAPP" delay={stag(4, 3.2, 34)} value={CONTACT.phones[2]} />
        <Row2 label="WA CHANNEL" delay={stag(5, 3.2, 34)} value={CONTACT.whatsappChannel} />
        <Row2 label="YOUTUBE" delay={stag(6, 3.2, 34)} value={CONTACT.youtube} />
        <Row2 label="INSTAGRAM" delay={stag(7, 3.2, 34)} value={CONTACT.instagram} />
        <Row2 label="LINKEDIN" delay={stag(8, 3.2, 34)} value={CONTACT.linkedin} />
        <Row2 label="FACEBOOK" delay={stag(9, 3.2, 34)} value={CONTACT.facebook} />
        <Row2 label="THREADS" delay={stag(10, 3.2, 34)} value={CONTACT.threads} />
        <Row2 label="X" delay={stag(11, 3.2, 34)} value={CONTACT.x} />
      </div>

      {/* address */}
      <div
        style={{
          position: 'absolute',
          left: LF_CONTENT.x,
          top: 856,
          width: 900,
          opacity: ramp(f, [96, 118], [0, 1]),
        }}
      >
        <div style={{height: 1, backgroundColor: C.line, marginBottom: 14}} />
        <Micro color={C.inkDim} size={18} tracking={2.2}>
          SHOWROOM
        </Micro>
        <Spec
          size={23}
          color={C.inkSoft}
          weight={400}
          tracking={0.2}
          style={{marginTop: 9, lineHeight: 1.44}}
        >
          {CONTACT.address}
        </Spec>
      </div>
    </>
  );
};
