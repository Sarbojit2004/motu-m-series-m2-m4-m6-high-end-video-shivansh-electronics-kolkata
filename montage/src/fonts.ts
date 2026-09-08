import React from "react";
import { continueRender, delayRender } from "remotion";
import { FONT_CSS } from "./fonts-inline";

/**
 * The display and tag faces, inlined as data URIs (see
 * scripts/gen_metrics.mjs). Fetching woff2 over the dev server races across
 * render workers at concurrency > 1 and can stall a delayRender for the whole
 * render; a data URI has nothing to fetch and nothing to race on.
 *
 * `document.fonts.load` is still awaited so the first frame is never drawn in
 * the fallback stack, and it resolves immediately for a local face.
 */
let injected = false;

export const injectFonts = () => {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-montage-fonts", "");
  el.textContent = FONT_CSS;
  document.head.appendChild(el);
};

injectFonts();

export const FontGate: React.FC = () => {
  const [handle] = React.useState(() => delayRender("montage fonts"));
  React.useEffect(() => {
    injectFonts();
    const fonts = document.fonts as unknown as {
      load: (f: string) => Promise<unknown>;
    };
    Promise.all([
      fonts.load('400 100px "MontageDisplay"'),
      fonts.load('700 40px "MontageTag"'),
      fonts.load('500 40px "MontageTag"'),
    ])
      .catch(() => undefined)
      .then(() => continueRender(handle));
  }, [handle]);
  return null;
};
