import { staticFile } from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// THE TYPE PAIRING
//
// The client supplied a specimen of BRITTANIC + LO-FLICKER: a heavy brush
// script carrying one word, a black geometric sans carrying the rest. Both are
// commercial fonts and the specimen was an image, not the font files, so the
// two roles are filled by the closest freely-licensable equivalents:
//
//   script  role  Brittanic   -> Pacifico      (bold rounded script, big swash
//                                               capital; lacks Brittanic's
//                                               dry-brush edge)
//   display role  Lo-Flicker  -> Archivo Black (heavy geometric grotesque,
//                                               near-identical in weight and
//                                               proportion)
//
// TO SWAP IN THE REAL FONTS: drop the files in as
//   public/fonts/script.ttf    (Brittanic)
//   public/fonts/display.ttf   (Lo-Flicker)
// and re-render. Nothing else changes — every size, offset and colour below is
// expressed in relative terms and re-flows to whatever face is behind the role.
// ─────────────────────────────────────────────────────────────────────────────

export const SCRIPT = "ReelScript";
export const DISPLAY = "ReelDisplay";

export const FONT_FACE_CSS = `
@font-face {
  font-family: '${SCRIPT}';
  src: url('${staticFile("fonts/script.ttf")}') format('truetype');
  font-weight: 400; font-style: normal; font-display: block;
}
@font-face {
  font-family: '${DISPLAY}';
  src: url('${staticFile("fonts/display.ttf")}') format('truetype');
  font-weight: 400 900; font-style: normal; font-display: block;
}
`;
