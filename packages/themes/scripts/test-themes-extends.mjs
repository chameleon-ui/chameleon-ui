/**
 * Phase 8 §3.7: derived-theme demo proof + $extends regression.
 *  - compiles `examples/line-dense` (extends `line`, delta-only storage)
 *  - asserts the diff vs the parent is exactly the overridden variable set
 *  - asserts non-overridden tokens are byte-identical to the parent output
 * Run: node scripts/test-themes-extends.mjs
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileThemeTokens, resolveThemeExtends } from "@chameleon-ui/tokens/compiler";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const themesRoot = path.join(packageRoot, "src");
const coreDirectory = path.resolve(packageRoot, "../tokens/src/core");
const exampleDirectory = path.join(packageRoot, "examples", "line-dense");

function createFsLoader(baseDirectory) {
  return async (ref) => {
    const resolved = path.resolve(baseDirectory, ref);
    const relative = path.relative(packageRoot, resolved);
    assert.ok(
      !relative.startsWith("..") && !path.isAbsolute(relative),
      `$extends ref escapes the themes package: ${ref}`,
    );
    return JSON.parse(await readFile(resolved, "utf8"));
  };
}

function cssVarMap(css) {
  const map = new Map();
  for (const line of css.split("\n")) {
    const match = /^\s{2}(--cu-[a-z0-9-]+):\s*(.+);$/.exec(line);
    if (match) map.set(match[1], match[2]);
  }
  return map;
}

async function main() {
  const parentOverlay = JSON.parse(
    await readFile(path.join(themesRoot, "line", "tokens.json"), "utf8"),
  );
  const derivedDocument = JSON.parse(
    await readFile(path.join(exampleDirectory, "tokens.json"), "utf8"),
  );
  assert.equal(derivedDocument.$extends, "../../src/line/tokens.json");

  const resolvedDerived = await resolveThemeExtends(
    derivedDocument,
    createFsLoader(exampleDirectory),
    { label: "line-dense" },
  );
  assert.ok(!("$extends" in resolvedDerived), "$extends must be stripped after resolution");

  const parent = await compileThemeTokens(coreDirectory, parentOverlay, "line");
  const derived = await compileThemeTokens(coreDirectory, resolvedDerived, "line-dense");

  const parentVars = cssVarMap(parent.css);
  const derivedVars = cssVarMap(derived.css);

  assert.equal(
    derivedVars.size,
    parentVars.size,
    "derived theme must contain the full inherited variable set",
  );

  const expectedOverrides = ["--cu-radius-lg", "--cu-radius-md", "--cu-radius-sm"];
  const differences = [];
  for (const [name, value] of derivedVars) {
    if (parentVars.get(name) !== value) differences.push(name);
  }
  differences.sort();
  assert.deepEqual(
    differences,
    expectedOverrides,
    `diff must be exactly the delta variables: ${expectedOverrides.join(", ")}`,
  );
  assert.equal(derivedVars.get("--cu-radius-md"), "2px", "derived radius delta applied");
  assert.equal(parentVars.get("--cu-radius-md"), "8px", "parent stays untouched");

  assert.ok(!derived.css.includes("$extends"), "compiled CSS is static (零运行时不破)");

  console.log(
    `[@chameleon-ui/themes] $extends demo: line-dense derives from line with ${differences.length} overridden variables (${differences.join(", ")})`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
