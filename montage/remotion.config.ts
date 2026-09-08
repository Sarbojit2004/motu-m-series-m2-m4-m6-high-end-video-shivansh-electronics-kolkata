import { existsSync } from "node:fs";

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(97);
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(60_000);
Config.setChromiumOpenGlRenderer("swangle");

// This environment blocks Remotion's Chrome Headless Shell download, so point
// it at the Chromium that ships with the image. Override with
// REMOTION_BROWSER_EXECUTABLE if you are rendering elsewhere.
const chrome =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(chrome)) {
  Config.setBrowserExecutable(chrome);
}
