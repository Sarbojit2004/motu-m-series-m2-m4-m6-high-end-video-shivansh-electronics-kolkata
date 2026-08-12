/**
 * Fixed copy shared by both reels.
 *
 * HARD RULES enforced here and everywhere downstream:
 *
 *   · The distributor designation is used in FULL and UNABBREVIATED wherever
 *     the CTA appears. It is never shortened, the territory is never
 *     generalised to "across India" or "pan-India", and "Authorized
 *     Distributor" is never swapped for "dealer" or "reseller".
 *
 *   · Pricing is always "Market Operating Price" / "MOP", incl. GST. The words
 *     "MRP" and a bare "price" appear nowhere.
 *
 *   · No other audio-interface manufacturer is named or alluded to.
 *
 *   · Nothing may imply the M2 or M4 sound inferior to the M6. They share the
 *     identical DAC, preamp EIN and latency figures; they differ in I/O count
 *     and workflow features only.
 */

export const PARTNER = 'Shivansh Electronics';

/** The exact, unabbreviated designation from the brief's Executive Summary. */
export const DISTRIBUTOR_LINE =
  'Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India.';

/** Role line for the dark identity plate — still carries the full territory. */
export const PARTNER_ROLE =
  'Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India';

/** Compact form for mid-size blocks. Territory intact, never generalised. */
export const PARTNER_ROLE_SHORT = 'Authorized Distributor · East and North East India';

/**
 * Label for the slim ambient contact strip only.
 *
 * The strip is one line inside a 924px container shared with a rotating URL. The
 * full territory-bearing role needs 1062px there at a legible size and was
 * measured overflowing 138px straight across the right safe margin — caught by
 * scripts/safezone_audit.py on frames pulled back out of the delivered render.
 *
 * So the strip carries the designation without the territory, and the COMPLETE
 * unabbreviated statement is carried by `DistributorBlock` (which appears
 * mid-reel in both parts) and by the `Outro` in both parts, where it has the room
 * to be set legibly. Nothing is generalised — the territory is stated in full
 * wherever the CTA actually appears; it is simply not crammed into an ambient
 * one-line strip.
 */
export const PARTNER_ROLE_STRIP = 'Authorized Distributor';

export const CONTACT = {
  website: 'shivanshelectronics.in',
  linktree: 'shivanshelectronics.in/linktree-hub',
  whatsappChannel: 'shivanshelectronics.in/whatsapp-channel',
  phones: ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755'],
  instagram: 'shivanshelectronics.in/instagram-page',
  facebook: 'shivanshelectronics.in/facebook-page',
  linkedin: 'shivanshelectronics.in/linkedin-page',
  threads: 'shivanshelectronics.in/threads-profile',
  x: 'shivanshelectronics.in/x-twitter-profile',
  youtube: 'shivanshelectronics.in/youtube-channel',
  address:
    'Raja Electric — Shivansh Electronics, 3, Ramanath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal, India 700031',
} as const;

/** Social handles woven through the body of each reel, not just the outro. */
export const SOCIALS: {label: string; value: string}[] = [
  {label: 'Web', value: CONTACT.website},
  {label: 'Gateway hub', value: CONTACT.linktree},
  {label: 'Instagram', value: CONTACT.instagram},
  {label: 'YouTube', value: CONTACT.youtube},
  {label: 'WhatsApp Channel', value: CONTACT.whatsappChannel},
  {label: 'LinkedIn', value: CONTACT.linkedin},
  {label: 'Facebook', value: CONTACT.facebook},
  {label: 'Threads', value: CONTACT.threads},
  {label: 'X', value: CONTACT.x},
];

/** Verified Market Operating Prices — brief Section 4 master table. */
export const MOP = {
  M2: '₹26,900',
  M4: '₹32,900',
  M6: '₹55,900',
} as const;

export const MOP_SUFFIX = 'per unit (MOP, incl. GST)';

/** Full MOP line for a single product. */
export const mopLine = (p: 'M2' | 'M4' | 'M6'): string =>
  `MOTU ${p} — ${MOP[p]} ${MOP_SUFFIX}`;

/** Specifications shared identically by all three units (brief Section 4). */
export const SHARED_SPECS = [
  {k: 'DAC', v: 'ESS Sabre32 Ultra™'},
  {k: 'DYNAMIC RANGE', v: '120 dB'},
  {k: 'MIC PREAMP EIN', v: '−129 dBu'},
  {k: 'ROUND-TRIP LATENCY', v: '2.5 ms'},
  {k: 'CONVERSION', v: '24-bit / 192 kHz'},
  {k: 'LCD METERING', v: '160 × 120, full colour'},
] as const;

export const CTA = {
  eyebrow: 'WHERE TO BUY',
  headline: 'Choose your channel count.\nKeep the studio quality.',
  body:
    'The M2, M4 and M6 share one audio engine. Talk to the regional distribution authority for the M-Series and match the I/O count to the way you actually record.',
} as const;

/** Continuity beats between the two parts (prompt Section 0c). */
export const CONTINUITY = {
  1: {
    kicker: 'PART 1 OF 2 · THE ENGINE',
    line: 'One engine. Two channels.',
    next: 'Same engine. Two more sizes.',
  },
  2: {
    kicker: 'PART 2 OF 2 · THE SCALE-UP',
    line: 'Two, four or six channels.',
    next: 'One engine, three sizes — that is the M-Series.',
  },
} as const;

export const PART_TITLE = {
  1: 'THE ENGINE',
  2: 'THE SCALE-UP',
} as const;
