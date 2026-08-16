import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeIds = [
  "linear",
  "mercedes",
  "porsche",
  "ferrari",
  "apple",
  "tiktok",
  "wechat",
  "alipay",
];
const phase3RuleGroups = [
  "typography",
  "spacing",
  "colorBoundaries",
  "forbiddenPatterns",
  "composition",
  "rtl",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** CSS cubic-bezier overshoot = any control point outside [0, 1] (spring / bounce). */
function hasOvershootBezier(css) {
  const pattern = /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g;
  let match = pattern.exec(css);
  while (match) {
    const points = match.slice(1, 5).map(Number);
    if (points.some((value) => value < 0 || value > 1)) return true;
    match = pattern.exec(css);
  }
  return false;
}

function runValidateRules() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["./scripts/validate-rules.mjs"], {
      cwd: packageRoot,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error("validate-rules exited with a non-zero code"));
    });
  });
}

async function main() {
  await runValidateRules();

  for (const themeId of themeIds) {
    const distDirectory = path.join(packageRoot, "dist", themeId);
    const css = await readFile(path.join(distDirectory, "variables.css"), "utf8");
    const designRules = JSON.parse(await readFile(path.join(distDirectory, "design-rules.json"), "utf8"));
    const meta = JSON.parse(await readFile(path.join(distDirectory, "meta.json"), "utf8"));

    assert(css.includes("--cu-"), `${themeId}: variables.css missing --cu-* output`);
    if (themeId === "apple") {
      // Apple 1:1 flagship spec (light-first; reference: HIG color/typography/
      // materials guidance, iOS system color ramp. SF Pro / SF Symbols excluded).
      assert(css.includes("backdrop-filter"), "apple: dist CSS must emit frosted-glass backdrop-filter");
      assert(css.includes("-webkit-backdrop-filter"), "apple: dist CSS must emit -webkit-backdrop-filter");
      assert(css.includes("--cu-blur-frost"), "apple: dist CSS must emit --cu-blur-frost");
      assert(css.includes("--cu-shadow-soft"), "apple: dist CSS must emit --cu-shadow-soft");
      assert(css.includes("--cu-radius-xl"), "apple: dist CSS must emit --cu-radius-xl");
      assert(css.includes("Theme effects overlay"), "apple: effects.css must be concatenated into dist CSS");
      assert(css.includes(".cu-app-shell__header"), "apple: frost app-shell header");
      assert(css.includes(".cu-tab-bar"), "apple: frost tab-bar");
      assert(css.includes(".cu-dialog__content"), "apple: frost dialog");
      assert(css.includes("cu-effects:apple"), "apple: effects.css marker");
      assert(css.includes("color-scheme: light"), "apple: light-first native scheme");
      assert(
        css.includes(':root[data-color-scheme="dark"]'),
        "apple: ships a manual dark scheme block (tokens.dark.json)",
      );
      // iOS light ramp
      assert(css.includes("--cu-radius-sm: 8px"), "apple: control radius 8px");
      assert(css.includes("--cu-radius-md: 10px"), "apple: grouped-cell radius 10px");
      assert(css.includes("--cu-radius-lg: 14px"), "apple: alert radius 14px");
      assert(css.includes("--cu-radius-xl: 20px"), "apple: sheet radius 20px");
      assert(css.includes("--cu-color-palette-brand: #007AFF"), "apple: systemBlue (light)");
      assert(css.includes("--cu-color-palette-danger: #FF3B30"), "apple: systemRed (light)");
      assert(css.includes("--cu-color-background-default: #FFFFFF"), "apple: systemBackground (light)");
      assert(css.includes("--cu-color-background-subtle: #F2F2F7"), "apple: systemGroupedBackground");
      assert(css.includes("--cu-color-fg-default: #000000"), "apple: label (light) is pure black");
      assert(
        css.includes("--cu-color-fg-muted: rgba(60, 60, 67, 0.6)"),
        "apple: secondaryLabel (light)",
      );
      assert(
        css.includes("--cu-color-border-default: rgba(60, 60, 67, 0.29)"),
        "apple: separator (light)",
      );
      assert(
        css.includes("--cu-color-fill-secondary: rgba(120, 120, 128, 0.16)"),
        "apple: secondarySystemFill (light)",
      );
      // iOS dark ramp
      assert(css.includes("--cu-color-palette-brand: #0A84FF"), "apple: systemBlue (dark)");
      assert(css.includes("--cu-color-palette-danger: #FF453A"), "apple: systemRed (dark)");
      assert(css.includes("--cu-color-background-default: #000000"), "apple: systemBackground (dark) pure black");
      assert(css.includes("--cu-color-background-elevated: #2C2C2E"), "apple: tertiarySystemBackground (dark)");
      assert(
        css.includes("--cu-color-border-default: rgba(84, 84, 88, 0.6)"),
        "apple: separator (dark)",
      );
      // Materials stay ON (opposite of the zero-blur themes)
      assert(
        css.includes("saturate(var(--cu-saturate-frost)) blur(var(--cu-blur-frost))"),
        "apple: chrome uses the bar material (saturate 180% + blur 20px)",
      );
      // Motion: UIKit 0.3s ease-in-out
      assert(css.includes("--cu-motion-duration-base: 300ms"), "apple: 300ms base (UIKit default)");
      assert(
        css.includes("--cu-motion-easing-standard: cubic-bezier(0.42, 0, 0.58, 1)"),
        "apple: UIKit ease-in-out",
      );
      assert(!hasOvershootBezier(css), "apple: motion must not use overshoot (no bounce easing)");
      // Typography: 17px body, 34px Large Title, 22/17 line-height
      assert(css.includes("--cu-typography-size-body: 1.0625rem"), "apple: 17px body");
      assert(css.includes("--cu-typography-size-heading-1: 2.125rem"), "apple: 34px Large Title");
      assert(css.includes("--cu-typography-line-height-body: 1.29"), "apple: 22/17 body line-height");
      assert(!css.includes("SF Pro"), "apple: SF Pro must not be referenced (font not replicated)");
      // Component-level DoD
      assert(css.includes("border-radius: 9999px"), "apple: pill CTAs");
      assert(css.includes("brightness(1.08)"), "apple: restrained hover lift");
      assert(css.includes("brightness(0.92)"), "apple: dim-on-press (UIControl highlight)");
      assert(css.includes("--cu-focus-halo"), "apple: accent focus halo");
      assert(css.includes("cu-effects:apple"), "apple: effects overlay marker");
      assert(designRules.typography.tracking === "normal", "apple: tracking stays normal (no tight display tracking)");
    }
    assert(meta.id === themeId, `${themeId}: meta.id mismatch`);
    assert(designRules.version === "1.0", `${themeId}: design-rules.json must be version 1.0`);
    for (const group of phase3RuleGroups) {
      assert(designRules[group], `${themeId}: design-rules.json missing ${group}`);
    }

    if (themeId === "porsche" || themeId === "mercedes") {
      assert(
        !hasOvershootBezier(css),
        `${themeId}: motion must not use overshoot (no spring / bounce)`,
      );
      assert(
        !/backdrop-filter:\s*(?!none)\s*(blur|saturate)/.test(css),
        `${themeId}: must not ship frosted-glass blur`,
      );
      assert(css.includes("Theme radius.css"), `${themeId}: radius.css must be concatenated`);
      assert(css.includes("Theme shadow.css"), `${themeId}: shadow.css must be concatenated`);
      assert(css.includes("Theme motion.css"), `${themeId}: motion.css must be concatenated`);
      assert(css.includes("Theme effects overlay"), `${themeId}: effects.css must be concatenated`);
      assert(
        designRules.forbiddenPatterns.includes("elastic-bounce"),
        `${themeId}: forbiddenPatterns must include elastic-bounce`,
      );
      assert(
        designRules.forbiddenPatterns.includes("spring-animation"),
        `${themeId}: forbiddenPatterns must include spring-animation`,
      );
    }

    if (themeId === "porsche") {
      assert(css.includes("--cu-radius-sm: 2px"), "porsche: precise sm radius 2px");
      assert(css.includes("--cu-radius-md: 4px"), "porsche: surface md radius 4px");
      assert(css.includes("--cu-radius-lg: 6px"), "porsche: lg radius 6px");
      assert(css.includes("--cu-color-palette-brand: #bb0a30"), "porsche: brand highlight");
      assert(css.includes("--cu-color-palette-paper: #0f0f0f"), "porsche: obsidian cabin");
      assert(css.includes("--cu-motion-duration-base: 180ms"), "porsche: measured 180ms");
      assert(css.includes("--cu-motion-easing-standard: cubic-bezier(0.25, 0.1, 0.25, 1)"), "porsche: ease, no overshoot");
      assert(!css.includes("linear-gradient"), "porsche: gradientPolicy forbidden");
      assert(css.includes("transform: none"), "porsche: no press bounce");
      assert(designRules.colorBoundaries.gradientPolicy === "forbidden", "porsche: no gradients");
      assert(designRules.composition.surfaceHierarchy === "elevation-over-border", "porsche: elevation language");
    }

    if (themeId === "mercedes") {
      assert(css.includes("--cu-radius-sm: 0px"), "mercedes: sharp interactive 0px");
      assert(css.includes("--cu-radius-md: 2px"), "mercedes: md 2px");
      assert(css.includes("--cu-radius-lg: 4px"), "mercedes: surface 4px");
      assert(css.includes("--cu-color-palette-brand: #5c6b7a"), "mercedes: racing slate");
      assert(css.includes("--cu-color-palette-paper: #f8fafc"), "mercedes: racing silver");
      assert(css.includes("--cu-motion-duration-base: 100ms"), "mercedes: taut 100ms");
      assert(css.includes("--cu-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1)"), "mercedes: taut decelerate");
      assert(css.includes("linear-gradient"), "mercedes: subtle sheen allowed");
      assert(css.includes("translateY(1px)"), "mercedes: taut 1px press, not bounce");
      assert(designRules.colorBoundaries.gradientPolicy === "subtle-only", "mercedes: subtle sheen only");
      assert(designRules.composition.surfaceHierarchy === "border-over-elevation", "mercedes: border language");
    }

    if (themeId === "linear") {
      // Linear 1:1 flagship spec (dark-first; reference: linear.app extracted CSS vars).
      assert(css.includes("--cu-radius-sm: 4px"), "linear: sm radius 4px");
      assert(css.includes("--cu-radius-md: 6px"), "linear: control radius 6px");
      assert(css.includes("--cu-radius-lg: 8px"), "linear: surface radius 8px");
      assert(css.includes("--cu-radius-xl: 8px"), "linear: radius capped at 8px (pill CTAs excepted)");
      assert(css.includes("--cu-blur-surface: 0px"), "linear: blur must be zero (no glass)");
      assert(css.includes("--cu-blur-overlay: 0px"), "linear: overlay blur must be zero");
      assert(css.includes("--cu-blur-thick: 0px"), "linear: thick blur must be zero");
      assert(css.includes("inset"), "linear: elevation via inset highlight, not drop shadows");
      assert(css.includes("--cu-motion-duration-fast: 100ms"), "linear: 100ms fast");
      assert(css.includes("--cu-motion-duration-base: 160ms"), "linear: 160ms base, no bounce");
      assert(
        css.includes("--cu-motion-easing-standard: cubic-bezier(0.45, 0, 0.55, 1)"),
        "linear: ease-in-out-quad standard (app evidence)",
      );
      assert(
        css.includes("--cu-motion-easing-enter: cubic-bezier(0.25, 0.46, 0.45, 0.94)"),
        "linear: ease-out-quad enter (Button.css evidence)",
      );
      assert(css.includes("--cu-color-palette-brand: #5e6ad2"), "linear: indigo accent #5e6ad2");
      assert(css.includes("--cu-color-background-default: #121213"), "linear: app canvas #121213");
      assert(css.includes("--cu-color-background-subtle: #09090a"), "linear: sidebar/chrome #09090a, darker than canvas");
      assert(css.includes("--cu-color-background-elevated: #1c1c1d"), "linear: elevated dark surface #1c1c1d");
      assert(css.includes("--cu-color-fg-default: #f7f8f8"), "linear: text-primary rgb(247,248,248)");
      assert(css.includes("--cu-color-fg-muted: #8a8f98"), "linear: text-secondary rgb(138,143,152)");
      assert(
        css.includes("--cu-color-border-default: rgba(255, 255, 255, 0.08)"),
        "linear: white-alpha hairline border",
      );
      assert(css.includes("--cu-typography-weight-medium: 510"), "linear: 510 medium axis");
      assert(css.includes("--cu-typography-weight-semibold: 590"), "linear: 590 semibold axis");
      assert(css.includes("--cu-typography-size-body: 0.875rem"), "linear: 14px body");
      assert(css.includes("cu-effects:linear"), "linear: effects.css must be concatenated");
      assert(css.includes("Theme effects overlay"), "linear: effects overlay marker");
      assert(css.includes("color-scheme: dark"), "linear: dark-first native scheme");
      assert(
        css.includes(':root[data-color-scheme="light"]'),
        "linear: ships a manual light scheme block",
      );
      assert(!css.includes("background-size: 16px 16px"), "linear: no scaffold grid on main");
      assert(!hasOvershootBezier(css), "linear: motion must not use overshoot (no bounce easing)");
      assert(!css.includes("linear-gradient"), "linear: gradientPolicy forbidden");
      assert(
        !/\.cu-(dialog__content|navigation|tab-bar|card|app-shell)[^}]*backdrop-filter:\s*(?!none)\s*(blur|saturate)/.test(css),
        "linear: surfaces must not ship frosted-glass blur (button secondary blur(4px) is Linear evidence)",
      );
      /* Component-level DoD — evidence: linear.app Button.css + /login loading CSS. */
      assert(css.includes("scale(0.97)"), "linear: scale(.97) press on buttons");
      assert(css.includes("brightness(1.15)"), "linear: primary hover = brightness(115%)");
      assert(css.includes("border-radius: 9999px"), "linear: pill CTAs (radius-rounded)");
      assert(css.includes("#7180ff"), "linear: focus ring / selection blue #7180ff");
      assert(css.includes("outline-offset: 3px"), "linear: focus outline offset 3px");
      assert(
        css.includes(":root[data-color-scheme='light'] .cu-button--outline"),
        "linear: light-scheme secondary button override",
      );
      assert(designRules.colorBoundaries.gradientPolicy === "forbidden", "linear: no gradients");
      assert(designRules.composition.surfaceHierarchy === "flat", "linear: flat hierarchy");
      assert(designRules.forbiddenPatterns.includes("spring-easing"), "linear: forbids spring-easing");
      assert(designRules.forbiddenPatterns.includes("elastic-bounce"), "linear: forbids elastic-bounce");
      assert(designRules.forbiddenPatterns.includes("scaffold-grid"), "linear: forbids scaffold grid");
      assert(designRules.typography.tracking === "tight", "linear: tight tracking");
    }

    if (themeId === "alipay") {
      assert(css.includes("--cu-radius-sm: 2px"), "alipay: historical 2px sm");
      assert(css.includes("--cu-radius-md: 2px"), "alipay: historical 2px md");
      assert(css.includes("--cu-radius-lg: 4px"), "alipay: modest 4px lg");
      assert(css.includes("--cu-blur-surface: 0px"), "alipay: blur must be zero (no glass)");
      assert(css.includes("--cu-blur-overlay: 0px"), "alipay: overlay blur must be zero");
      assert(css.includes("--cu-blur-thick: 0px"), "alipay: thick blur must be zero");
      assert(css.includes("--cu-motion-duration-base: 200ms"), "alipay: 200ms measured motion");
      assert(
        css.includes("--cu-motion-easing-standard: cubic-bezier(0.645, 0.045, 0.355, 1)"),
        "alipay: standard ease-in-out, no bounce",
      );
      assert(css.includes("--cu-color-palette-brand: #1677ff"), "alipay: brand blue");
      assert(css.includes("--cu-color-background-subtle: #f5f5f5"), "alipay: layout gray");
      assert(css.includes("--cu-color-background-inverse: #001529"), "alipay: dark sider");
      assert(css.includes("--cu-color-border-default: #d9d9d9"), "alipay: hairline gray");
      assert(css.includes("cu-effects:alipay"), "alipay: effects.css must be concatenated");
      assert(css.includes("Theme effects overlay"), "alipay: effects overlay marker");
      assert(!hasOvershootBezier(css), "alipay: motion must not use overshoot");
      assert(
        !/backdrop-filter:\s*(?!none)\s*(blur|saturate)/.test(css),
        "alipay: must not ship frosted-glass blur",
      );
      assert(designRules.composition.surfaceHierarchy === "elevation-over-border", "alipay: elevation hierarchy");
      assert(designRules.forbiddenPatterns.includes("glass-morphism"), "alipay: forbids glass");
      assert(designRules.forbiddenPatterns.includes("backdrop-blur"), "alipay: forbids backdrop-blur");
    }

    if (themeId === "wechat") {
      assert(css.includes("#07c160"), "wechat: brand green missing");
      assert(css.includes("#ededed"), "wechat: chat-canvas gray missing");
      assert(css.includes("#95ec69"), "wechat: bubble green missing");
      assert(css.includes("--cu-radius-sm: 6px"), "wechat: friendly sm radius");
      assert(css.includes("--cu-radius-md: 8px"), "wechat: friendly md radius");
      assert(css.includes("--cu-blur-surface: 0px"), "wechat: blur must be zero (no glass)");
      assert(css.includes("--cu-motion-easing-standard:"), "wechat: motion easing token");
      assert(css.includes("Theme effects overlay"), "wechat: effects.css must be concatenated into dist CSS");
      assert(css.includes(".cu-chat-bubble"), "wechat: bubble surface rules");
      assert(
        !/backdrop-filter:\s*(?!none)\s*(blur|saturate)/.test(css),
        "wechat: must not ship frosted-glass blur",
      );
      assert(
        !/cubic-bezier\([^)]*[1-9]\.\d{2,}/.test(css),
        "wechat: motion must not use spring overshoot",
      );
      assert(designRules.spacing.density === "compact", "wechat: density must stay compact");
      assert(
        designRules.forbiddenPatterns.includes("frosted-glass"),
        "wechat: forbiddenPatterns must include frosted-glass",
      );
    }
  }

  const pkg = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
  assert(pkg.exports["./dist/*"] === "./dist/*", "package exports must alias ./dist/* (filesystem-shaped CSS imports)");
  function cssExportTarget(entry) {
    if (typeof entry === "string") return entry;
    if (entry && typeof entry === "object") return entry.style ?? entry.default ?? entry.import;
    return undefined;
  }
  for (const themeId of themeIds) {
    assert(
      cssExportTarget(pkg.exports[`./${themeId}/css`]) === `./dist/${themeId}/variables.css`,
      `${themeId}: canonical CSS export ./<id>/css missing`,
    );
  }

  console.log(`[@chameleon-ui/themes] verified ${themeIds.length} theme bundles (Phase 3 rules) + CSS exports`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
