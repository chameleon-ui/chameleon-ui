/**
 * Phase 8 §3.7: 8-theme byte-regression gate for the token pipeline.
 * Baseline hashes were captured from the pre-$extends compiler output
 * (2026-08-13). Any compiler change that alters an official theme artifact
 * fails this gate (产物逐字节 diff；回归绿前不切换默认).
 * Run: node scripts/test-themes-regression.mjs
 * Regenerate ONLY after a reviewed pipeline change: ... --write-baseline
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = path.join(packageRoot, "scripts", "theme-artifacts-baseline.json");
const writeBaseline = process.argv.includes("--write-baseline");

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

const artifacts = ["variables.css", "tokens.resolved.json"];

function sha256(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

async function main() {
  const current = { generatedFrom: "packages/themes/dist (pre-$extends pipeline)", themes: {} };
  for (const themeId of themeIds) {
    current.themes[themeId] = {};
    for (const artifact of artifacts) {
      const content = await readFile(
        path.join(packageRoot, "dist", themeId, artifact),
        "utf8",
      );
      current.themes[themeId][artifact] = sha256(content);
    }
  }

  if (writeBaseline) {
    await writeFile(baselinePath, `${JSON.stringify(current, null, 2)}\n`, "utf8");
    console.log(`[@chameleon-ui/themes] wrote regression baseline for ${themeIds.length} themes`);
    return;
  }

  const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
  const drift = [];
  for (const themeId of themeIds) {
    for (const artifact of artifacts) {
      const expected = baseline.themes?.[themeId]?.[artifact];
      const actual = current.themes[themeId][artifact];
      if (expected !== actual) {
        drift.push(`${themeId}/${artifact}: baseline ${expected?.slice(0, 12)}… != current ${actual.slice(0, 12)}…`);
      }
    }
  }

  assert.equal(
    drift.length,
    0,
    `theme artifact regression:\n - ${drift.join("\n - ")}`,
  );
  console.log(
    `[@chameleon-ui/themes] regression green: ${themeIds.length} themes × ${artifacts.length} artifacts byte-identical to baseline`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
