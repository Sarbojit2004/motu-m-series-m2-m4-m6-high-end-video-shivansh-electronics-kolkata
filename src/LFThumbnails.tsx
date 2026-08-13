import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, F, LF_CANVAS, LF_CONTENT, LF_RIGHT} from './lib/lf-theme';
import {DISTRIBUTOR_LINE, MOP} from './lib/copy';
import {loadFonts} from './lib/fonts';
import {LFStage} from './components/lf/LFStage';
import {Shot} from './components/lf/LFMedia';
import {LogoInline} from './components/lf/Logo';
import {fitBox, meta} from './lib/images';
import {EASE_OUT, ramp} from './lib/anim';

/**
 * Trilingual 1920x1080 thumbnails for the long-form video.
 *
 * The video's narration is English only; this is a discoverability layer, so
 * the Hindi and Bengali variants are genuinely translated — headline, kicker,
 * price label and CTA all read in Devanagari and Bengali script rather than
 * being an English thumbnail with a badge added.
 *
 * Deliberately NOT translated: the literal product names (MOTU M2 / M4 / M6),
 * the I/O counts, and the ₹ figures. Translating a model number would read as
 * a mistranslation, and the numerals are the same in all three.
 *
 * BOTH LOGOS APPEAR HERE, shown directly with no box — the long-form rule, the
 * opposite of the reels'. They are drawn from public/logo, whose baked-in white
 * plate scripts/prep_logos.py removes.
 *
 * Rendered as a still at frame 100 of a 120-frame composition so every staged
 * reveal has settled; a still at frame 0 would catch the layout at opacity 0.
 */

export const LF_THUMB_FRAMES = 120;

type Lang = 'en' | 'hi' | 'bn';

type Copy = {
  badge: string;
  kicker: string;
  head: string;
  sub: string;
  mopLabel: string;
  points: string[];
  cta: string;
};

const headFont = (l: Lang): string => (l === 'hi' ? F.deva : l === 'bn' ? F.beng : F.display);
const uiFont = (l: Lang): string => (l === 'hi' ? F.deva : l === 'bn' ? F.beng : F.ui);

// Devanagari and Bengali need more leading and must not be tracked tight.
const headSize = (l: Lang): number => (l === 'en' ? 108 : 84);
const headLh = (l: Lang): number => (l === 'en' ? 0.88 : 1.26);
const headTrack = (l: Lang): number => (l === 'en' ? -1.2 : 0);

const SPEC_EN = 'ESS Sabre32 Ultra™  ·  120 dB  ·  −129 dBu  ·  2.5 ms';

const COPY: Record<Lang, Copy> = {
  en: {
    badge: 'ENGLISH',
    kicker: 'MOTU M-SERIES · M2 · M4 · M6',
    head: 'ONE ENGINE.\nTHREE SIZES.',
    sub: SPEC_EN,
    mopLabel: 'MARKET OPERATING PRICE (MOP), INCL. GST · PER UNIT',
    points: ['Full-colour LCD metering', 'Driver loopback', 'DC-coupled outputs'],
    cta: DISTRIBUTOR_LINE,
  },
  hi: {
    badge: 'हिन्दी',
    kicker: 'मोटू एम-सीरीज़ · M2 · M4 · M6',
    head: 'एक ही इंजन।\nतीन आकार।',
    sub: SPEC_EN,
    mopLabel: 'मार्केट ऑपरेटिंग प्राइस (MOP), GST सहित · प्रति यूनिट',
    points: ['फ़ुल-कलर LCD मीटरिंग', 'ड्राइवर लूपबैक', 'DC-कपल्ड आउटपुट'],
    cta: 'शिवांश इलेक्ट्रॉनिक्स, MOTU (मार्क ऑफ़ द यूनिकॉर्न, USA) इंटरफ़ेस के लिए पूर्व और उत्तर-पूर्व भारत का अधिकृत वितरक है।',
  },
  bn: {
    badge: 'বাংলা',
    kicker: 'মোটু এম-সিরিজ · M2 · M4 · M6',
    head: 'একই ইঞ্জিন।\nতিনটি আকার।',
    sub: SPEC_EN,
    mopLabel: 'মার্কেট অপারেটিং প্রাইস (MOP), GST সহ · প্রতি ইউনিট',
    points: ['ফুল-কালার LCD মিটারিং', 'ড্রাইভার লুপব্যাক', 'DC-কাপল্ড আউটপুট'],
    cta: 'শিবাংশ ইলেকট্রনিক্স, MOTU (মার্ক অফ দ্য ইউনিকর্ন, USA) ইন্টারফেসের জন্য পূর্ব ও উত্তর-পূর্ব ভারতের অনুমোদিত পরিবেশক।',
  },
};

/** Prominent language badge — required on every thumbnail. */
const Badge: React.FC<{c: Copy; lang: Lang}> = ({c, lang}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: C.motu,
      color: C.paperHi,
      fontFamily: uiFont(lang),
      fontWeight: 700,
      fontSize: 25,
      letterSpacing: lang === 'en' ? 4.2 : 1.2,
      padding: '11px 22px 10px',
      borderRadius: 7,
    }}
  >
    {c.badge}
  </div>
);

/** One product row: name + I/O + MOP on the left, its front panel on the right. */
const ProductRow: React.FC<{
  id: number;
  name: string;
  io: string;
  price: string;
  y: number;
  delay: number;
}> = ({id, name, io, price, y, delay}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 20], [0, 1], EASE_OUT);
  const m = meta(id);
  const panelW = 470;
  const panelH = Math.round(panelW / (m.w / m.h));
  const box = fitBox(id, 1346, y + Math.round((150 - panelH) / 2), panelW, 150, 'left');

  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * 20}px)`}}>
      <div style={{position: 'absolute', left: 992, top: y + 16, width: 330}}>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 42,
            color: C.ink,
            lineHeight: 1,
            letterSpacing: -0.2,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 500,
            fontSize: 20,
            color: C.inkDim,
            letterSpacing: 1.2,
            marginTop: 7,
          }}
        >
          {io}
        </div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 11,
            backgroundColor: C.ink,
            borderRadius: 7,
            padding: '8px 15px 7px',
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: 31,
            color: C.paperHi,
            letterSpacing: -0.2,
          }}
        >
          {price}
        </div>
      </div>
      <Shot id={id} box={box} dur={LF_THUMB_FRAMES} move={{z: [1, 1]}} radius={10} />
    </div>
  );
};

const Thumb: React.FC<{lang: Lang}> = ({lang}) => {
  loadFonts();
  const c = COPY[lang];
  const f = useCurrentFrame();
  const rise = (d: number) => {
    const p = ramp(f, [d, d + 20], [0, 1], EASE_OUT);
    return {opacity: p, transform: `translateY(${(1 - p) * 16}px)`};
  };

  return (
    <AbsoluteFill>
      <LFStage rails={false}>
        {/* both marks, shown directly — no box, no plate */}
        <div style={{position: 'absolute', left: LF_CONTENT.x, top: 62}}>
          <LogoInline brand="shivansh" size={62} delay={2} />
        </div>
        <div style={{position: 'absolute', right: LF_CANVAS.w - LF_RIGHT, top: 68}}>
          <LogoInline brand="motu" size={46} delay={6} />
        </div>

        {/* left column */}
        <div style={{position: 'absolute', left: LF_CONTENT.x, top: 214, width: 830}}>
          <div style={rise(8)}>
            <Badge c={c} lang={lang} />
          </div>
          <div
            style={{
              ...rise(14),
              fontFamily: uiFont(lang),
              fontWeight: 700,
              fontSize: 23,
              letterSpacing: lang === 'en' ? 3.8 : 0.8,
              color: C.inkDim,
              textTransform: lang === 'en' ? 'uppercase' : 'none',
              marginTop: 22,
            }}
          >
            {c.kicker}
          </div>
          <div
            style={{
              ...rise(20),
              fontFamily: headFont(lang),
              fontWeight: 800,
              fontSize: headSize(lang),
              lineHeight: headLh(lang),
              letterSpacing: headTrack(lang),
              color: C.ink,
              textTransform: lang === 'en' ? 'uppercase' : 'none',
              whiteSpace: 'pre-line',
              marginTop: 16,
            }}
          >
            {c.head}
          </div>
          <div
            style={{
              ...rise(34),
              width: 118,
              height: 5,
              backgroundColor: C.motu,
              borderRadius: 3,
              marginTop: 26,
            }}
          />
          <div
            style={{
              ...rise(40),
              fontFamily: F.mono,
              fontWeight: 500,
              fontSize: 25,
              letterSpacing: 0.5,
              color: C.inkSoft,
              marginTop: 24,
            }}
          >
            {c.sub}
          </div>
          <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 15}}>
            {c.points.map((pt, i) => (
              <div
                key={pt}
                style={{
                  ...rise(46 + i * 5),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 9,
                    backgroundColor: C.motu,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontFamily: uiFont(lang),
                    fontWeight: 600,
                    fontSize: 27,
                    color: C.inkSoft,
                    letterSpacing: 0.1,
                  }}
                >
                  {pt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right column — all three products, each with its own MOP */}
        <div
          style={{
            ...rise(26),
            position: 'absolute',
            left: 992,
            top: 196,
            fontFamily: uiFont(lang),
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: lang === 'en' ? 2.6 : 0.6,
            color: C.inkDim,
            textTransform: lang === 'en' ? 'uppercase' : 'none',
          }}
        >
          {c.mopLabel}
        </div>
        <ProductRow id={1} name="MOTU M2" io="2 IN / 2 OUT" price={MOP.M2} y={246} delay={30} />
        <ProductRow id={10} name="MOTU M4" io="4 IN / 4 OUT" price={MOP.M4} y={432} delay={38} />
        <ProductRow id={18} name="MOTU M6" io="6 IN / 4 OUT" price={MOP.M6} y={618} delay={46} />

        {/* the distributor designation, full and unabbreviated */}
        <div
          style={{
            ...rise(56),
            position: 'absolute',
            left: LF_CONTENT.x,
            top: 872,
            width: 1712,
            display: 'flex',
            gap: 18,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 6,
              alignSelf: 'stretch',
              borderRadius: 3,
              backgroundColor: C.motu,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: uiFont(lang),
              fontWeight: 600,
              fontSize: lang === 'en' ? 29 : 26,
              lineHeight: lang === 'en' ? 1.34 : 1.44,
              color: C.ink,
            }}
          >
            {c.cta}
          </div>
        </div>
      </LFStage>
    </AbsoluteFill>
  );
};

export const LFThumbEN: React.FC = () => <Thumb lang="en" />;
export const LFThumbHI: React.FC = () => <Thumb lang="hi" />;
export const LFThumbBN: React.FC = () => <Thumb lang="bn" />;
