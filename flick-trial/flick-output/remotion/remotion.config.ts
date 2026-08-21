import { Config } from "@remotion/cli/config";

// Remotion's own Chrome Headless Shell download host is egress-blocked in this
// environment, so point at the Chromium that ships with the container.
Config.setBrowserExecutable(
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"
);
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(2);
Config.setChromiumOpenGlRenderer("swangle");
