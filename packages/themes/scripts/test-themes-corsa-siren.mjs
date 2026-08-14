/**
 * Distinct visual-language signatures for corsa (sport red) and siren (emergency).
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
  const corsa = await readFile(path.join(packageRoot, "dist", "corsa", "variables.css"), "utf8");
  const siren = await readFile(path.join(packageRoot, "dist", "siren", "variables.css"), "utf8");

  assert.equal(cssVar(corsa, "--cu-color-palette-brand"), "#d40000", "corsa brand is aggressive red");
  assert.equal(cssVar(corsa, "--cu-radius-sm"), "0px", "corsa interactive radius is knife-sharp");
  assert.equal(cssVar(corsa, "--cu-radius-md"), "0px", "corsa controls are square");
  assert.equal(cssVar(corsa, "--cu-blur-surface"), "0px", "corsa has no frost");
  assert.equal(cssVar(corsa, "--cu-motion-easing-standard"), "linear", "corsa motion is linear, not spring");
  assert.match(corsa, /corsa effects: sport, no glass/);
  assert.match(corsa, /backdrop-filter:\s*none/);
  assert.match(corsa, /3px 3px 0 #0a0a0a/, "corsa uses hard offset shadows");
  assert.doesNotMatch(corsa, /Ferrari|prancing|cavallino/i);

  assert.equal(cssVar(siren, "--cu-color-palette-brand"), "#f5c400", "siren brand is high-vis amber");
  assert.notEqual(cssVar(siren, "--cu-color-palette-brand"), "#d40000", "siren is not corsa red");
  assert.notEqual(cssVar(siren, "--cu-color-palette-brand"), "#00704a", "siren is not cafe green");
  assert.equal(cssVar(siren, "--cu-radius-md"), "6px", "siren is industrial, not iOS glass");
  assert.notEqual(cssVar(siren, "--cu-radius-sm"), "0px", "siren forbids corsa-sharp corners");
  assert.equal(cssVar(siren, "--cu-blur-surface"), "0px", "siren has no frost");
  assert.equal(cssVar(siren, "--cu-font-tracking-wide"), "0.08em", "siren tracking is wide");
  assert.match(siren, /siren effects: emergency\/alert/);
  assert.match(siren, /repeating-linear-gradient/);
  assert.match(siren, /backdrop-filter:\s*none/);
  assert.doesNotMatch(siren, /Georgia|Times New Roman|mermaid|starbucks/i);

  const corsaRules = JSON.parse(
    await readFile(path.join(packageRoot, "src", "corsa", "design-rules.json"), "utf8"),
  );
  const sirenRules = JSON.parse(
    await readFile(path.join(packageRoot, "src", "siren", "design-rules.json"), "utf8"),
  );
  assert.ok(corsaRules.forbiddenPatterns.includes("frost-glass"));
  assert.ok(corsaRules.forbiddenPatterns.includes("elastic-bounce"));
  assert.equal(corsaRules.colorBoundaries.gradientPolicy, "forbidden");
  assert.ok(sirenRules.forbiddenPatterns.includes("frost-glass"));
  assert.ok(sirenRules.forbiddenPatterns.includes("luxury-blur"));
  assert.ok(sirenRules.forbiddenPatterns.includes("sharp-corners"));
  assert.equal(sirenRules.typography.tracking, "wide");
  assert.equal(corsaRules.typography.tracking, "tight");

  console.log("[@chameleon-ui/themes] corsa + siren visual-language signatures verified");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
