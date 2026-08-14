import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themeIds = [
  "line",
  "silver-arrow",
  "stuttgart",
  "corsa",
  "cupertino",
  "siren",
  "wechat",
  "ant-blue",
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
    if (themeId === "cupertino") {
      assert(css.includes("backdrop-filter"), "cupertino: dist CSS must emit frosted-glass backdrop-filter");
      assert(css.includes("-webkit-backdrop-filter"), "cupertino: dist CSS must emit -webkit-backdrop-filter");
      assert(css.includes("--cu-blur-frost"), "cupertino: dist CSS must emit --cu-blur-frost");
      assert(css.includes("--cu-shadow-soft"), "cupertino: dist CSS must emit --cu-shadow-soft");
      assert(css.includes("--cu-radius-xl"), "cupertino: dist CSS must emit --cu-radius-xl");
      assert(css.includes("Theme effects overlay"), "cupertino: effects.css must be concatenated into dist CSS");
      assert(css.includes(".cu-app-shell__header"), "cupertino: frost app-shell header");
      assert(css.includes(".cu-tab-bar"), "cupertino: frost tab-bar");
      assert(css.includes(".cu-dialog__content"), "cupertino: frost dialog");
    }
    assert(meta.id === themeId, `${themeId}: meta.id mismatch`);
    assert(designRules.version === "1.0", `${themeId}: design-rules.json must be version 1.0`);
    for (const group of phase3RuleGroups) {
      assert(designRules[group], `${themeId}: design-rules.json missing ${group}`);
    }

    if (themeId === "stuttgart" || themeId === "silver-arrow") {
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

    if (themeId === "stuttgart") {
      assert(css.includes("--cu-radius-sm: 2px"), "stuttgart: precise sm radius 2px");
      assert(css.includes("--cu-radius-md: 4px"), "stuttgart: surface md radius 4px");
      assert(css.includes("--cu-radius-lg: 6px"), "stuttgart: lg radius 6px");
      assert(css.includes("--cu-color-palette-brand: #bb0a30"), "stuttgart: brand highlight");
      assert(css.includes("--cu-color-palette-paper: #0f0f0f"), "stuttgart: obsidian cabin");
      assert(css.includes("--cu-motion-duration-base: 180ms"), "stuttgart: measured 180ms");
      assert(css.includes("--cu-motion-easing-standard: cubic-bezier(0.25, 0.1, 0.25, 1)"), "stuttgart: ease, no overshoot");
      assert(!css.includes("linear-gradient"), "stuttgart: gradientPolicy forbidden");
      assert(css.includes("transform: none"), "stuttgart: no press bounce");
      assert(designRules.colorBoundaries.gradientPolicy === "forbidden", "stuttgart: no gradients");
      assert(designRules.composition.surfaceHierarchy === "elevation-over-border", "stuttgart: elevation language");
    }

    if (themeId === "silver-arrow") {
      assert(css.includes("--cu-radius-sm: 0px"), "silver-arrow: sharp interactive 0px");
      assert(css.includes("--cu-radius-md: 2px"), "silver-arrow: md 2px");
      assert(css.includes("--cu-radius-lg: 4px"), "silver-arrow: surface 4px");
      assert(css.includes("--cu-color-palette-brand: #5c6b7a"), "silver-arrow: racing slate");
      assert(css.includes("--cu-color-palette-paper: #f8fafc"), "silver-arrow: racing silver");
      assert(css.includes("--cu-motion-duration-base: 100ms"), "silver-arrow: taut 100ms");
      assert(css.includes("--cu-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1)"), "silver-arrow: taut decelerate");
      assert(css.includes("linear-gradient"), "silver-arrow: subtle sheen allowed");
      assert(css.includes("translateY(1px)"), "silver-arrow: taut 1px press, not bounce");
      assert(designRules.colorBoundaries.gradientPolicy === "subtle-only", "silver-arrow: subtle sheen only");
      assert(designRules.composition.surfaceHierarchy === "border-over-elevation", "silver-arrow: border language");
    }

    if (themeId === "line") {
      assert(css.includes("--cu-radius-sm: 2px"), "line: tiny sm radius 2px");
      assert(css.includes("--cu-radius-md: 4px"), "line: tiny md radius 4px");
      assert(css.includes("--cu-radius-lg: 6px"), "line: tiny lg radius 6px");
      assert(css.includes("--cu-blur-surface: 0px"), "line: blur must be zero (no glass)");
      assert(css.includes("--cu-blur-overlay: 0px"), "line: overlay blur must be zero");
      assert(css.includes("--cu-blur-thick: 0px"), "line: thick blur must be zero");
      assert(css.includes("--cu-shadow-sm: none"), "line: flat / hairline, not drop-shadow-heavy");
      assert(css.includes("--cu-motion-duration-fast: 80ms"), "line: snappy 80ms");
      assert(css.includes("--cu-motion-duration-base: 120ms"), "line: 120ms base, no bounce");
      assert(
        css.includes("--cu-motion-easing-standard: cubic-bezier(0.25, 0.1, 0.25, 1)"),
        "line: standard ease, no overshoot",
      );
      assert(css.includes("--cu-color-palette-brand: #111827"), "line: ink brand");
      assert(css.includes("--cu-color-background-subtle: #f4f5f6"), "line: cool canvas");
      assert(css.includes("cu-effects:line"), "line: effects.css must be concatenated");
      assert(css.includes("Theme effects overlay"), "line: effects overlay marker");
      assert(!hasOvershootBezier(css), "line: motion must not use overshoot (no bounce easing)");
      assert(!css.includes("linear-gradient"), "line: gradientPolicy forbidden");
      assert(
        !/backdrop-filter:\s*(?!none)\s*(blur|saturate)/.test(css),
        "line: must not ship frosted-glass blur",
      );
      assert(designRules.colorBoundaries.gradientPolicy === "forbidden", "line: no gradients");
      assert(designRules.composition.surfaceHierarchy === "flat", "line: flat hierarchy");
      assert(designRules.forbiddenPatterns.includes("spring-easing"), "line: forbids spring-easing");
      assert(designRules.forbiddenPatterns.includes("elastic-bounce"), "line: forbids elastic-bounce");
    }

    if (themeId === "ant-blue") {
      assert(css.includes("--cu-radius-sm: 2px"), "ant-blue: historical 2px sm");
      assert(css.includes("--cu-radius-md: 2px"), "ant-blue: historical 2px md");
      assert(css.includes("--cu-radius-lg: 4px"), "ant-blue: modest 4px lg");
      assert(css.includes("--cu-blur-surface: 0px"), "ant-blue: blur must be zero (no glass)");
      assert(css.includes("--cu-blur-overlay: 0px"), "ant-blue: overlay blur must be zero");
      assert(css.includes("--cu-blur-thick: 0px"), "ant-blue: thick blur must be zero");
      assert(css.includes("--cu-motion-duration-base: 200ms"), "ant-blue: 200ms measured motion");
      assert(
        css.includes("--cu-motion-easing-standard: cubic-bezier(0.645, 0.045, 0.355, 1)"),
        "ant-blue: standard ease-in-out, no bounce",
      );
      assert(css.includes("--cu-color-palette-brand: #1677ff"), "ant-blue: brand blue");
      assert(css.includes("--cu-color-background-subtle: #f5f5f5"), "ant-blue: layout gray");
      assert(css.includes("--cu-color-background-inverse: #001529"), "ant-blue: dark sider");
      assert(css.includes("--cu-color-border-default: #d9d9d9"), "ant-blue: hairline gray");
      assert(css.includes("cu-effects:ant-blue"), "ant-blue: effects.css must be concatenated");
      assert(css.includes("Theme effects overlay"), "ant-blue: effects overlay marker");
      assert(!hasOvershootBezier(css), "ant-blue: motion must not use overshoot");
      assert(
        !/backdrop-filter:\s*(?!none)\s*(blur|saturate)/.test(css),
        "ant-blue: must not ship frosted-glass blur",
      );
      assert(designRules.composition.surfaceHierarchy === "elevation-over-border", "ant-blue: elevation hierarchy");
      assert(designRules.forbiddenPatterns.includes("glass-morphism"), "ant-blue: forbids glass");
      assert(designRules.forbiddenPatterns.includes("backdrop-blur"), "ant-blue: forbids backdrop-blur");
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
  for (const themeId of themeIds) {
    assert(
      pkg.exports[`./${themeId}/css`] === `./dist/${themeId}/variables.css`,
      `${themeId}: canonical CSS export ./<id>/css missing`,
    );
  }

  console.log(`[@chameleon-ui/themes] verified ${themeIds.length} theme bundles (Phase 3 rules) + CSS exports`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
