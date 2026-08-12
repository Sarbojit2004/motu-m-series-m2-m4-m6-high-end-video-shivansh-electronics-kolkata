import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts are vendored into public/fonts so a 2640-frame render never depends on
// a network fetch. Loaded via the FontFace API behind delayRender so no frame
// is ever painted with a fallback face.
//
// The five Latin faces are copied verbatim from the completed TASCAM Sonicview
// project — this project ports that type system rather than inventing one
// (prompt Section 8b).
//
// The Devanagari and Bengali faces are used ONLY by the thumbnail
// compositions. The reels themselves are English-only (Section 5), so those
// two faces are optional: if they are absent from public/fonts the reel render
// is unaffected and only the Hindi/Bengali thumbnails would fall back.

type Face = {family: string; file: string; weight: string; optional?: boolean};

const FACES: Face[] = [
  {family: 'BarlowCondensed', file: 'fonts/bc-600.woff2', weight: '600'},
  {family: 'BarlowCondensed', file: 'fonts/bc-700.woff2', weight: '700'},
  {family: 'BarlowCondensed', file: 'fonts/bc-800.woff2', weight: '800'},
  {family: 'Inter', file: 'fonts/inter-var.woff2', weight: '100 900'},
  {family: 'JetBrainsMono', file: 'fonts/jbm-var.woff2', weight: '100 800'},
  // Supplies the Indian Rupee sign (U+20B9). None of the three Latin faces
  // above contain it — they are Google "latin" subsets, and ₹ ships in the
  // devanagari subset — so without this the MOP figures resolve ₹ through
  // whatever fallback the render host happens to provide. Every MOP callout in
  // both reels depends on it, so it is NOT optional.
  {family: 'NotoINR', file: 'fonts/noto-inr-var.woff2', weight: '100 900'},
  // Thumbnails only; the reels are English-only, so a missing file here must
  // not fail a reel render.
  {family: 'NotoSansDevanagari', file: 'fonts/noto-deva-400.woff2', weight: '400', optional: true},
  {family: 'NotoSansDevanagari', file: 'fonts/noto-deva-700.woff2', weight: '700', optional: true},
  {family: 'NotoSansBengali', file: 'fonts/noto-beng-400.woff2', weight: '400', optional: true},
  {family: 'NotoSansBengali', file: 'fonts/noto-beng-700.woff2', weight: '700', optional: true},
];

let started = false;

/**
 * Waits only on the explicit FontFace loads. `document.fonts.ready` resolves
 * against every font the document might still be resolving and was observed to
 * hang a render worker under concurrency, so it is deliberately not awaited.
 */
export const loadFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('load-fonts', {
    timeoutInMilliseconds: 90000,
    retries: 2,
  });

  Promise.all(
    FACES.map(async (f) => {
      try {
        const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
          weight: f.weight,
          style: 'normal',
          display: 'block',
        });
        const loaded = await face.load();
        document.fonts.add(loaded);
      } catch (e) {
        if (!f.optional) throw e;
      }
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};
