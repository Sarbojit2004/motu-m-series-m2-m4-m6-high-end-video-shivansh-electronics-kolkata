import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F, SAFE, Part, accent, accentOnDark} from '../lib/theme';
import {
  CONTACT,
  CTA,
  DISTRIBUTOR_LINE,
  PARTNER,
  PARTNER_ROLE,
  PARTNER_ROLE_STRIP,
  SOCIALS,
} from '../lib/copy';
import {Body, Display, Kicker, Micro, Rule, Spec} from './Type';
import {ramp, stag} from '../lib/anim';

/**
 * Shivansh Electronics branding — TEXT ONLY.
 *
 * No logo file is ever placed in a reel, neither MOTU's nor Shivansh
 * Electronics'. Both logo assets are excluded from the ledger's usable set, so
 * `A()` throws if a scene ever asks for one (see src/lib/images.ts). Logos are
 * added by hand afterwards.
 *
 * That exclusion is narrow and deliberate: it governs only a logo Claude would
 * add as its own overlay graphic. Brand marks already printed on the hardware
 * inside a supplied photograph — the MOTU wordmark on a chassis, the small
 * badges present in a few of the lifestyle shots — are part of the photograph
 * and are left exactly as provided.
 *
 * The distributor designation is used in FULL wherever the CTA appears. The
 * territory is never generalised and "Authorized Distributor" is never softened
 * to dealer or reseller.
 */

/** Slim contact strip woven through the body of each reel. */
export const ContactStrip: React.FC<{
  part: Part;
  y: number;
  dur: number;
  index?: number;
  delay?: number;
}> = ({part, y, dur, index = 0, delay = 0}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const s = SOCIALS[index % SOCIALS.length];
  const p = Math.min(ramp(f, [delay, delay + 18], [0, 1]), ramp(f, [dur - 16, dur], [1, 0]));
  // Inset 6px each side. The strip's right-aligned URL would otherwise sit
  // exactly on the x=1008 margin boundary, where antialiased glyph edges spill a
  // pixel or two past it. Technically compliant, but the padding contract is the
  // point of this format, so it is kept visibly inboard.
  const INSET = 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x + INSET,
        top: SAFE.y + y,
        width: SAFE.w - INSET * 2,
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        opacity: p,
        // Structural guarantee: even if this copy is later lengthened, nothing
        // can paint outside the strip's box and into the side margin.
        overflow: 'hidden',
      }}
    >
      <div style={{width: 5, height: 20, backgroundColor: a, borderRadius: 3, flexShrink: 0}} />
      <Micro
        color={C.inkSoft}
        size={12.5}
        tracking={1.3}
        style={{whiteSpace: 'nowrap', flexShrink: 0}}
      >
        {PARTNER} · {PARTNER_ROLE_STRIP}
      </Micro>
      <div style={{flex: 1, minWidth: 12, height: 1, backgroundColor: C.line}} />
      {/* caps={false}: these are URLs and must stay lowercase — an uppercased
          path is both harder to read and not what a viewer should type. */}
      <Micro
        color={a}
        size={12.5}
        tracking={1.1}
        caps={false}
        style={{whiteSpace: 'nowrap', flexShrink: 0}}
      >
        {s.value}
      </Micro>
    </div>
  );
};

/** Corner part-marker — orients the viewer inside the two-part series. */
export const PartMark: React.FC<{part: Part; label: string; dur: number}> = ({
  part,
  label,
  dur,
}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const p = Math.min(ramp(f, [4, 22], [0, 1]), ramp(f, [dur - 14, dur], [1, 0]));
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y + 2,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: p * 0.92,
      }}
    >
      <div style={{width: 26, height: 3, backgroundColor: a}} />
      <Micro color={C.inkDim} size={14.5} tracking={2.8}>
        {label}
      </Micro>
    </div>
  );
};

/**
 * The full distributor designation as a standalone block. Used wherever the CTA
 * language appears mid-reel, so a viewer who only sees one beat still gets the
 * complete, unabbreviated statement.
 */
export const DistributorBlock: React.FC<{
  part: Part;
  w?: number;
  delay?: number;
  size?: number;
}> = ({part, w = SAFE.w, delay = 0, size = 21}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const p = ramp(f, [delay, delay + 20], [0, 1]);
  return (
    <div
      style={{
        width: w,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        borderLeft: `4px solid ${a}`,
        paddingLeft: 16,
      }}
    >
      <Body size={size} color={C.inkSoft} weight={500} lh={1.42}>
        {DISTRIBUTOR_LINE}
      </Body>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  delay: number;
  a: string;
  size?: number;
}> = ({label, value, delay, a, size = 20}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 14], [0, 1]);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <div style={{width: 124, flexShrink: 0}}>
        <Micro color={C.inkDim} size={13} tracking={2.0}>
          {label}
        </Micro>
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 500,
          fontSize: size,
          letterSpacing: 0.3,
          color: C.ink,
        }}
      >
        {value}
      </div>
      <div
        style={{flex: 1, height: 1, backgroundColor: C.lineSoft, transform: 'translateY(-4px)'}}
      />
      <div style={{width: 6, height: 6, borderRadius: 6, backgroundColor: a, opacity: 0.7}} />
    </div>
  );
};

/**
 * The outro. Both parts get it in full; Part 2's is longer and is the
 * definitive close of the series, so it also carries the address and a final
 * resolve.
 */
export const Outro: React.FC<{part: Part; dur: number}> = ({part, dur}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const aDark = accentOnDark(part);
  const head = ramp(f, [6, 30], [0, 1]);

  return (
    <>
      {/* CTA block */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 36,
          width: SAFE.w,
          opacity: head,
          transform: `translateY(${(1 - head) * 16}px)`,
        }}
      >
        <Kicker color={a} size={19} tracking={4.4}>
          {CTA.eyebrow}
        </Kicker>
        <Rule w={104} color={a} thickness={4} style={{marginTop: 13, marginBottom: 18}} />
        <Display size={76} lh={0.9} color={C.ink}>
          {CTA.headline}
        </Display>
      </div>

      {/* the full, unabbreviated distributor designation */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 268,
          width: SAFE.w,
        }}
      >
        <DistributorBlock part={part} delay={22} size={22} />
      </div>

      {/* partner identity plate */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 396,
          width: SAFE.w,
          opacity: ramp(f, [30, 52], [0, 1]),
        }}
      >
        <div
          style={{
            backgroundColor: C.ink,
            borderRadius: 10,
            padding: '17px 22px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 44,
              letterSpacing: -0.2,
              lineHeight: 1,
              color: C.paperHi,
              textTransform: 'uppercase',
            }}
          >
            {PARTNER}
          </div>
          <Micro color={aDark} size={13.5} tracking={1.9} style={{lineHeight: 1.4}}>
            {PARTNER_ROLE}
          </Micro>
        </div>
      </div>

      {/* contact rows */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 566,
          width: SAFE.w,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Row label="WEBSITE" a={a} delay={stag(0, 3.2, 38)} value={CONTACT.website} />
        <Row label="GATEWAY HUB" a={a} delay={stag(1, 3.2, 38)} value={CONTACT.linktree} />
        <Row label="WHATSAPP" a={a} delay={stag(2, 3.2, 38)} value={CONTACT.phones[0]} />
        <Row label="WHATSAPP" a={a} delay={stag(3, 3.2, 38)} value={CONTACT.phones[1]} />
        <Row label="WHATSAPP" a={a} delay={stag(4, 3.2, 38)} value={CONTACT.phones[2]} />
        <Row label="WA CHANNEL" a={a} delay={stag(5, 3.2, 38)} value={CONTACT.whatsappChannel} />
        <Row label="INSTAGRAM" a={a} delay={stag(6, 3.2, 38)} value={CONTACT.instagram} />
        <Row label="YOUTUBE" a={a} delay={stag(7, 3.2, 38)} value={CONTACT.youtube} />
        <Row label="LINKEDIN" a={a} delay={stag(8, 3.2, 38)} value={CONTACT.linkedin} />
        <Row label="FACEBOOK" a={a} delay={stag(9, 3.2, 38)} value={CONTACT.facebook} />
        <Row label="THREADS" a={a} delay={stag(10, 3.2, 38)} value={CONTACT.threads} />
        <Row label="X" a={a} delay={stag(11, 3.2, 38)} value={CONTACT.x} />
      </div>

      {/* address */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.x,
          top: SAFE.y + 1174,
          width: SAFE.w,
          opacity: ramp(f, [dur - 190, dur - 164], [0, 1]),
        }}
      >
        <div style={{height: 1, backgroundColor: C.line, marginBottom: 13}} />
        <Micro color={C.inkDim} size={13} tracking={2.0}>
          SHOWROOM
        </Micro>
        <Spec
          size={18}
          color={C.inkSoft}
          weight={400}
          tracking={0.2}
          style={{marginTop: 7, lineHeight: 1.42}}
        >
          {CONTACT.address}
        </Spec>
      </div>
    </>
  );
};
