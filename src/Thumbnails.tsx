import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, Part, SAFE} from './lib/theme';
import {MOP} from './lib/copy';
import {AmbientMotes, AmbientPhoto, At, Stage} from './components/Stage';
import {Band, HeroShot} from './components/Media';
import {Micro} from './components/Type';
import {SharedDac} from './components/Diagram';
import {loadFonts} from './lib/fonts';

/**
 * TRILINGUAL PORTRAIT THUMBNAILS — 1080 x 1920, three per part.
 *
 * A discoverability/localisation layer that is deliberately separate from the
 * reels: the reel content itself is English-only (prompt Section 5), while each
 * part gets an English, a Hindi and a Bengali thumbnail.
 *
 * The Hindi and Bengali variants are genuinely translated — headline, product
 * framing, price label and CTA all read in Devanagari and Bengali script
 * respectively. They are not an English thumbnail with a badge added.
 *
 * Two things stay in Latin script on purpose, because that is how they are
 * actually written in Indian technical and retail copy: the verified
 * specification figures (ESS Sabre32 Ultra™, 120 dB, −129 dBu, 2.5 ms) and the
 * literal product names (MOTU M2 / M4 / M6). Translating a model number or a
 * converter's trade name would make the thumbnail read as a mistranslation.
 *
 * NO ADDED LOGOS — same rule and same narrow scope as the reels. Neither logo
 * file is placed here. Brand marks already printed on the hardware inside a
 * supplied photograph are untouched.
 *
 * These are 120-frame compositions rendered as a still at frame 100, so every
 * staged reveal has settled. Rendering at frame 0 would catch everything at
 * opacity 0.
 */

export const THUMB_FRAMES = 120;
export const THUMB_STILL_FRAME = 100;

type Lang = 'en' | 'hi' | 'bn';

type Copy = {
  badge: string;
  part: string;
  head: string;
  /** Small line under the headline. Latin specs stay Latin. */
  sub: string;
  /** Label under each price. */
  mopLabel: string;
  perUnit: string;
  cta: string;
  /** Caption on the shared-engine motif (Part 1 only). */
  motif?: string;
};

const font = (l: Lang): string => (l === 'hi' ? F.deva : l === 'bn' ? F.beng : F.display);
const uiFont = (l: Lang): string => (l === 'hi' ? F.deva : l === 'bn' ? F.beng : F.ui);

/** Devanagari and Bengali need more leading and must not be letter-spaced tight. */
const headSize = (l: Lang): number => (l === 'en' ? 104 : 82);
const headLh = (l: Lang): number => (l === 'en' ? 0.88 : 1.24);
const headTrack = (l: Lang): number => (l === 'en' ? -1 : 0);

const SPEC_EN = 'ESS Sabre32 Ultra™  ·  120 dB  ·  −129 dBu  ·  2.5 ms';

const P1: Record<Lang, Copy> = {
  en: {
    badge: 'ENGLISH',
    part: 'PART 1 OF 2 · THE ENGINE',
    head: 'ONE ENGINE.\nTHREE SIZES.',
    sub: SPEC_EN,
    mopLabel: 'MARKET OPERATING PRICE (MOP), INCL. GST',
    perUnit: 'PER UNIT',
    cta: 'Authorized Distributor — East & North East India',
    motif: 'THE SHARED ENGINE',
  },
  hi: {
    badge: 'हिन्दी',
    part: 'भाग 1 / 2 · इंजन',
    head: 'एक ही इंजन।\nतीन आकार।',
    sub: SPEC_EN,
    mopLabel: 'मार्केट ऑपरेटिंग प्राइस (MOP), GST सहित',
    perUnit: 'प्रति यूनिट',
    cta: 'अधिकृत वितरक — पूर्व और उत्तर-पूर्व भारत',
    motif: 'साझा इंजन',
  },
  bn: {
    badge: 'বাংলা',
    part: 'পর্ব ১ / ২ · ইঞ্জিন',
    head: 'একই ইঞ্জিন।\nতিনটি আকার।',
    sub: SPEC_EN,
    mopLabel: 'মার্কেট অপারেটিং প্রাইস (MOP), GST সহ',
    perUnit: 'প্রতি ইউনিট',
    cta: 'অনুমোদিত পরিবেশক — পূর্ব ও উত্তর-পূর্ব ভারত',
    motif: 'শেয়ার্ড ইঞ্জিন',
  },
};

const P2: Record<Lang, Copy> = {
  en: {
    badge: 'ENGLISH',
    part: 'PART 2 OF 2 · THE SCALE-UP',
    head: 'MORE CHANNELS.\nSAME ENGINE.',
    sub: SPEC_EN,
    mopLabel: 'MARKET OPERATING PRICE (MOP), INCL. GST',
    perUnit: 'PER UNIT',
    cta: 'Authorized Distributor — East & North East India',
  },
  hi: {
    badge: 'हिन्दी',
    part: 'भाग 2 / 2 · विस्तार',
    head: 'ज़्यादा चैनल।\nवही इंजन।',
    sub: SPEC_EN,
    mopLabel: 'मार्केट ऑपरेटिंग प्राइस (MOP), GST सहित',
    perUnit: 'प्रति यूनिट',
    cta: 'अधिकृत वितरक — पूर्व और उत्तर-पूर्व भारत',
  },
  bn: {
    badge: 'বাংলা',
    part: 'পর্ব ২ / ২ · সম্প্রসারণ',
    head: 'আরও চ্যানেল।\nএকই ইঞ্জিন।',
    sub: SPEC_EN,
    mopLabel: 'মার্কেট অপারেটিং প্রাইস (MOP), GST সহ',
    perUnit: 'প্রতি ইউনিট',
    cta: 'অনুমোদিত পরিবেশক — পূর্ব ও উত্তর-পূর্ব ভারত',
  },
};

/** Prominent language badge — required on every thumbnail. */
const LangBadge: React.FC<{c: Copy; lang: Lang}> = ({c, lang}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
    <div
      style={{
        backgroundColor: C.motu,
        color: C.paperHi,
        fontFamily: uiFont(lang),
        fontWeight: 700,
        fontSize: 25,
        letterSpacing: lang === 'en' ? 3.4 : 0.6,
        padding: '9px 18px 10px',
        borderRadius: 6,
        lineHeight: 1.15,
        whiteSpace: 'nowrap',
      }}
    >
      {c.badge}
    </div>
    <div
      style={{
        fontFamily: uiFont(lang),
        fontWeight: 600,
        fontSize: 17,
        letterSpacing: lang === 'en' ? 2.4 : 0.4,
        color: C.inkDim,
        whiteSpace: 'nowrap',
      }}
    >
      {c.part}
    </div>
  </div>
);

/** Price block. The MOP terminology is fixed; only its label is translated. */
const PriceRow: React.FC<{
  items: {name: string; amount: string}[];
  c: Copy;
  lang: Lang;
}> = ({items, c, lang}) => (
  <div>
    <div style={{display: 'flex', gap: 12}}>
      {items.map((it) => (
        <div
          key={it.name}
          style={{
            flex: 1,
            backgroundColor: C.paperHi,
            border: `1px solid ${C.line}`,
            borderTop: `4px solid ${C.motu}`,
            borderRadius: 9,
            padding: '13px 16px 15px',
            boxShadow: '0 16px 36px -26px rgba(10,16,23,0.34)',
          }}
        >
          <div
            style={{
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 31,
              lineHeight: 1,
              color: C.ink,
              letterSpacing: 0.3,
            }}
          >
            {it.name}
          </div>
          <div
            style={{
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 40,
              color: C.ink,
              marginTop: 8,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {it.amount}
          </div>
          <div
            style={{
              fontFamily: uiFont(lang),
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: lang === 'en' ? 1.5 : 0.2,
              color: C.inkDim,
              marginTop: 7,
            }}
          >
            {c.perUnit}
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        fontFamily: uiFont(lang),
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: lang === 'en' ? 1.7 : 0.2,
        color: C.inkSoft,
        marginTop: 11,
      }}
    >
      {c.mopLabel}
    </div>
  </div>
);

/** The distributor pointer. Never drops "Authorized Distributor", never
 *  generalises the territory beyond East and North East India. */
const CtaLine: React.FC<{c: Copy; lang: Lang}> = ({c, lang}) => (
  <div style={{display: 'flex', alignItems: 'stretch', gap: 0}}>
    <div style={{width: 5, backgroundColor: C.motu, borderRadius: 3, flexShrink: 0}} />
    <div style={{paddingLeft: 15}}>
      <div
        style={{
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 33,
          letterSpacing: 0.2,
          color: C.ink,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        Shivansh Electronics
      </div>
      <div
        style={{
          fontFamily: uiFont(lang),
          fontWeight: 600,
          fontSize: lang === 'en' ? 19 : 20,
          lineHeight: lang === 'en' ? 1.3 : 1.45,
          color: C.inkSoft,
          marginTop: 7,
          maxWidth: 880,
        }}
      >
        {c.cta}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// PART 1 — M2 + the shared-engine motif
// ---------------------------------------------------------------------------
const Thumb1: React.FC<{lang: Lang}> = ({lang}) => {
  // Thumbnails do not go through Reel, which is where the reels load fonts.
  loadFonts();
  const c = P1[lang];
  return (
    <AbsoluteFill>
      <Stage part={1 as Part}>
        <AmbientPhoto id={4} opacity={0.5} />
        <AmbientMotes part={1 as Part} n={20} />

        <At y={6}>
          <LangBadge c={c} lang={lang} />
        </At>

        <At y={92} w={SAFE.w}>
          <div
            style={{
              fontFamily: font(lang),
              fontWeight: 800,
              fontSize: headSize(lang),
              lineHeight: headLh(lang),
              letterSpacing: headTrack(lang),
              color: C.ink,
              textTransform: lang === 'en' ? 'uppercase' : 'none',
              whiteSpace: 'pre-line',
            }}
          >
            {c.head}
          </div>
        </At>

        <At y={lang === 'en' ? 300 : 330} w={SAFE.w}>
          <Micro size={17} tracking={1.6} color={C.motu} caps={false}>
            {c.sub}
          </Micro>
        </At>

        {/* the M2, complete and uncropped */}
        <HeroShot id={3} y={362} maxW={SAFE.w} maxH={434} dur={THUMB_FRAMES} />

        {/* shared-engine motif + product name */}
        <At y={828} w={SAFE.w}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <SharedDac size={158} delay={0} />
            <div>
              <div
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 66,
                  lineHeight: 0.94,
                  color: C.ink,
                  letterSpacing: -0.4,
                }}
              >
                MOTU M2
              </div>
              <div
                style={{
                  fontFamily: F.mono,
                  fontWeight: 500,
                  fontSize: 21,
                  letterSpacing: 1.2,
                  color: C.inkSoft,
                  marginTop: 8,
                }}
              >
                2-IN / 2-OUT USB-C
              </div>
              <div
                style={{
                  fontFamily: uiFont(lang),
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: lang === 'en' ? 2.0 : 0.3,
                  color: C.motu,
                  marginTop: 9,
                }}
              >
                {c.motif}
              </div>
            </div>
          </div>
        </At>

        <At y={1046} w={SAFE.w}>
          <PriceRow items={[{name: 'MOTU M2', amount: MOP.M2}]} c={c} lang={lang} />
        </At>

        <At y={1222} w={SAFE.w}>
          <CtaLine c={c} lang={lang} />
        </At>
      </Stage>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PART 2 — M4 and M6
// ---------------------------------------------------------------------------
const Thumb2: React.FC<{lang: Lang}> = ({lang}) => {
  loadFonts();
  const c = P2[lang];
  return (
    <AbsoluteFill>
      <Stage part={2 as Part}>
        <AmbientPhoto id={23} opacity={0.5} />
        <AmbientMotes part={2 as Part} n={20} />

        <At y={6}>
          <LangBadge c={c} lang={lang} />
        </At>

        <At y={92} w={SAFE.w}>
          <div
            style={{
              fontFamily: font(lang),
              fontWeight: 800,
              fontSize: headSize(lang),
              lineHeight: headLh(lang),
              letterSpacing: headTrack(lang),
              color: C.ink,
              textTransform: lang === 'en' ? 'uppercase' : 'none',
              whiteSpace: 'pre-line',
            }}
          >
            {c.head}
          </div>
        </At>

        <At y={lang === 'en' ? 300 : 330} w={SAFE.w}>
          <Micro size={17} tracking={1.6} color={C.motu} caps={false}>
            {c.sub}
          </Micro>
        </At>

        {/*
          M4 product shot, then the M6 front panel edge to edge. Both complete
          and uncropped.

          Both boxes are solved against the FULL safe width so the two plates
          share a common centre line. Passing a narrower `maxW` to HeroShot
          centres the image inside that narrower box, not inside the frame, which
          left the M4 plate visibly shifted off the M6 band's axis.
        */}
        <HeroShot id={12} y={360} maxW={SAFE.w} maxH={372} dur={THUMB_FRAMES} />
        <Band id={18} dur={THUMB_FRAMES} y={752} w={836} padY={14} />

        <At y={1046} w={SAFE.w}>
          <PriceRow
            items={[
              {name: 'MOTU M4', amount: MOP.M4},
              {name: 'MOTU M6', amount: MOP.M6},
            ]}
            c={c}
            lang={lang}
          />
        </At>

        <At y={1222} w={SAFE.w}>
          <CtaLine c={c} lang={lang} />
        </At>
      </Stage>
    </AbsoluteFill>
  );
};

export const Thumb1EN: React.FC = () => <Thumb1 lang="en" />;
export const Thumb1HI: React.FC = () => <Thumb1 lang="hi" />;
export const Thumb1BN: React.FC = () => <Thumb1 lang="bn" />;
export const Thumb2EN: React.FC = () => <Thumb2 lang="en" />;
export const Thumb2HI: React.FC = () => <Thumb2 lang="hi" />;
export const Thumb2BN: React.FC = () => <Thumb2 lang="bn" />;
