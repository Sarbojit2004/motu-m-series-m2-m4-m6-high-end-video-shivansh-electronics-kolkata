import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(96);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setConcurrency(3);

// Remotion's own Chrome Headless Shell download host is not reachable from this
// build environment. A pre-installed Chromium is used instead. Override with
// REMOTION_BROWSER_EXECUTABLE when building elsewhere.
import { existsSync } from "node:fs";
const CHROME = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean).find((p) => existsSync(p as string));
if (CHROME) Config.setBrowserExecutable(CHROME);
