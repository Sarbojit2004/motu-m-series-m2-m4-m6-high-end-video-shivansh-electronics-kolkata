/**
 * THE BRANDING PLAN — declared as data, so it can be audited.
 *
 * Section 9 sets three hard requirements that are easy to satisfy by accident
 * and easy to break by accident:
 *
 *   1. No stretch longer than ~25-30 s passes without visible Shivansh
 *      Electronics presence, across the whole 298 s.
 *   2. Every major product chapter (engine/M2, M4, M6) contains at least one
 *      Shivansh beat.
 *   3. Logos move. Neither mark may sit pinned in one fixed slot; each
 *      appearance is its own composed moment, entering and leaving
 *      deliberately.
 *
 * Declaring every appearance here — rather than scattering logo placements
 * through 33 scene files — means scripts/branding_cadence.mjs can compute the
 * real absolute timeline from the scene table and FAIL the build on a gap, a
 * missing chapter, or a mark that never moves. The scenes render FROM this
 * list, so the audit and the picture cannot drift apart.
 *
 * `form` records how the presence is carried, because Section 9 asks for the
 * form to vary too, not just the coordinates:
 *   mark    a bare logo placed in the frame
 *   third   a lower-third carrying a contact detail
 *   beat    a dedicated full branding moment between segments
 *   outro   the closing block
 */
export type BrandKey = 'shivansh' | 'motu';

export type Pos =
  | 'tl' | 'tc' | 'tr'
  | 'cl' | 'center' | 'cr'
  | 'bl' | 'bc' | 'br';

export type BrandBeat = {
  /** Scene this appearance lives in. */
  scene: string;
  /** Local frame inside that scene where the mark starts appearing. */
  at: number;
  /** How long it stays. */
  dur: number;
  brand: BrandKey;
  pos: Pos;
  form: 'mark' | 'third' | 'beat' | 'outro';
  /** Rotating contact detail, for `third` / `beat` / `outro` forms. */
  contact?: keyof typeof CONTACT_KEYS;
  /** Logo height in px. */
  size?: number;
};

/** Just the key names — values live in copy.ts CONTACT. */
export const CONTACT_KEYS = {
  website: 1,
  linktree: 1,
  whatsappChannel: 1,
  instagram: 1,
  youtube: 1,
  linkedin: 1,
  facebook: 1,
  threads: 1,
  x: 1,
  phone0: 1,
  phone1: 1,
  phone2: 1,
} as const;

/**
 * Every branding appearance in the video.
 *
 * Shivansh: 17 appearances, largest gap 28 s, every product chapter covered.
 * MOTU: 6 appearances — deliberately far fewer, but including genuine
 * mid-video moments at 158 s and 217 s rather than only bookending.
 *
 * Positions cycle deliberately: no two consecutive appearances of the same
 * mark share a slot, and neither mark uses one slot more than three times
 * across the runtime.
 *
 * The four dedicated `beat` moments do NOT all sit centred, even though a
 * centred composition is the obvious default for one. scripts/branding_cadence
 * caught that default putting Shivansh in the centre slot four times, which is
 * the "pinned mark" failure Section 9 is guarding against wearing a different
 * hat — so two beats centre the mark and two offset it (cl / cr) with the copy
 * balanced against it on the opposite side.
 */
export const BRAND_BEATS: BrandBeat[] = [
  // ---- ch1 open + heritage ---------------------------------------------
  {scene: 'L01', at: 96, dur: 190, brand: 'motu', pos: 'bc', form: 'mark', size: 54},
  {scene: 'L01', at: 186, dur: 108, brand: 'shivansh', pos: 'br', form: 'mark', size: 58},
  {scene: 'L02', at: 150, dur: 124, brand: 'shivansh', pos: 'bl', form: 'third', contact: 'website', size: 52},
  {scene: 'L03', at: 40, dur: 200, brand: 'motu', pos: 'tl', form: 'mark', size: 60},
  {scene: 'L04', at: 60, dur: 234, brand: 'shivansh', pos: 'center', form: 'beat', contact: 'linktree', size: 104},

  // ---- ch2 the shared engine -------------------------------------------
  {scene: 'L05', at: 130, dur: 160, brand: 'motu', pos: 'br', form: 'mark', size: 52},
  {scene: 'L06', at: 120, dur: 154, brand: 'shivansh', pos: 'tl', form: 'mark', size: 54},
  {scene: 'L07', at: 150, dur: 114, brand: 'shivansh', pos: 'br', form: 'third', contact: 'whatsappChannel', size: 50},
  {scene: 'L09', at: 130, dur: 154, brand: 'shivansh', pos: 'bl', form: 'mark', size: 54},
  {scene: 'L10', at: 20, dur: 124, brand: 'shivansh', pos: 'cr', form: 'beat', contact: 'instagram', size: 88},

  // ---- ch3 MOTU M2 ------------------------------------------------------
  {scene: 'L13', at: 110, dur: 154, brand: 'shivansh', pos: 'tr', form: 'third', contact: 'youtube', size: 52},
  {scene: 'L16', at: 30, dur: 184, brand: 'shivansh', pos: 'cl', form: 'beat', contact: 'phone0', size: 96},

  // ---- ch4 MOTU M4 ------------------------------------------------------
  {scene: 'L18', at: 100, dur: 176, brand: 'motu', pos: 'tr', form: 'mark', size: 56},
  {scene: 'L19', at: 130, dur: 154, brand: 'shivansh', pos: 'br', form: 'mark', size: 54},
  {scene: 'L20', at: 170, dur: 154, brand: 'shivansh', pos: 'bl', form: 'third', contact: 'linkedin', size: 50},
  {scene: 'L22', at: 150, dur: 190, brand: 'shivansh', pos: 'center', form: 'beat', contact: 'phone1', size: 100},

  // ---- ch5 MOTU M6 ------------------------------------------------------
  {scene: 'L24', at: 90, dur: 190, brand: 'motu', pos: 'bl', form: 'mark', size: 56},
  {scene: 'L25', at: 130, dur: 124, brand: 'shivansh', pos: 'tl', form: 'mark', size: 54},
  {scene: 'L28', at: 110, dur: 134, brand: 'shivansh', pos: 'tr', form: 'third', contact: 'facebook', size: 52},
  {scene: 'L30', at: 20, dur: 144, brand: 'shivansh', pos: 'cr', form: 'beat', contact: 'phone2', size: 92},

  // ---- ch6 close --------------------------------------------------------
  {scene: 'L32', at: 60, dur: 174, brand: 'shivansh', pos: 'tr', form: 'mark', size: 56},
  {scene: 'L33', at: 24, dur: 322, brand: 'shivansh', pos: 'tl', form: 'outro', size: 84},
  {scene: 'L33', at: 24, dur: 322, brand: 'motu', pos: 'tr', form: 'outro', size: 58},
];

export const beatsFor = (scene: string): BrandBeat[] =>
  BRAND_BEATS.filter((b) => b.scene === scene);
