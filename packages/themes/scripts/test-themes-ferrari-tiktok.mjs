/**
 * Distinct visual-language signatures for ferrari (sport red) and tiktok (emergency).
 * Run after build-themes.mjs so dist/variables.css includes effects.css.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function cssVar(css, name) {
  const match = new RegExp(`(?:^|\\n)\\s{2}${name}:\\s*([^;]+);`).exec(css);
  return match ? match[1] : null;
}

async function main() {
  const ferrari = await readFile(path.join(packageRoot, "dist", "ferrari", "variables.css"), "utf8");
  const tiktok = await readFile(path.join(packageRoot, "dist", "tiktok", "variables.css"), "utf8");

  assert.equal(cssVar(ferrari, "--cu-color-palette-brand"), "#d40000", "ferrari brand is aggressive red");
  assert.equal(cssVar(ferrari, "--cu-radius-sm"), "0px", "ferrari interactive radius is knife-sharp");
  assert.equal(cssVar(ferrari, "--cu-radius-md"), "0px", "ferrari controls are square");
  assert.equal(cssVar(ferrari, "--cu-blur-surface"), "0px", "ferrari has no frost");
  assert.equal(cssVar(ferrari, "--cu-motion-easing-standard"), "linear", "ferrari motion is linear, not spring");
  assert.match(ferrari, /cu-effects:ferrari — sport, no glass/);
  assert.match(ferrari, /backdrop-filter:\s*none/);
  assert.match(ferrari, /3px 3px 0 #0a0a0a/, "ferrari uses hard offset shadows");
  // Brand-id word ("ferrari") is expected in artifact comments; the legal guard
  // forbids distinctive brand marks / trade dress, not the internal id.
  assert.doesNotMatch(ferrari, /prancing|cavallino/i);

  assert.equal(cssVar(tiktok, "--cu-color-palette-brand"), "#f5c400", "tiktok brand is high-vis amber");
  assert.notEqual(cssVar(tiktok, "--cu-color-palette-brand"), "#d40000", "tiktok is not ferrari red");
  assert.notEqual(cssVar(tiktok, "--cu-color-palette-brand"), "#00704a", "tiktok is not cafe green");
  assert.equal(cssVar(tiktok, "--cu-radius-md"), "6px", "tiktok is industrial, not iOS glass");
  assert.notEqual(cssVar(tiktok, "--cu-radius-sm"), "0px", "tiktok forbids ferrari-sharp corners");
  assert.equal(cssVar(tiktok, "--cu-blur-surface"), "0px", "tiktok has no frost");
  assert.equal(cssVar(tiktok, "--cu-font-tracking-wide"), "0.08em", "tiktok tracking is wide");
  assert.match(tiktok, /cu-effects:tiktok — emergency\/alert/);
  assert.match(tiktok, /repeating-linear-gradient/);
  assert.match(tiktok, /backdrop-filter:\s*none/);
  assert.doesNotMatch(tiktok, /Georgia|Times New Roman|mermaid|starbucks/i);

  const ferrariRules = JSON.parse(
    await readFile(path.join(packageRoot, "src", "ferrari", "design-rules.json"), "utf8"),
  );
  const tiktokRules = JSON.parse(
    await readFile(path.join(packageRoot, "src", "tiktok", "design-rules.json"), "utf8"),
  );
  assert.ok(ferrariRules.forbiddenPatterns.includes("frost-glass"));
  assert.ok(ferrariRules.forbiddenPatterns.includes("elastic-bounce"));
  assert.equal(ferrariRules.colorBoundaries.gradientPolicy, "forbidden");
  assert.ok(tiktokRules.forbiddenPatterns.includes("frost-glass"));
  assert.ok(tiktokRules.forbiddenPatterns.includes("luxury-blur"));
  assert.ok(tiktokRules.forbiddenPatterns.includes("sharp-corners"));
  assert.equal(tiktokRules.typography.tracking, "wide");
  assert.equal(ferrariRules.typography.tracking, "tight");

  console.log("[@chameleon-ui/themes] ferrari + tiktok visual-language signatures verified");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
