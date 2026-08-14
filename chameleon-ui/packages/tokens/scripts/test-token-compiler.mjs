import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  compileTokenDirectory,
  compileTokenObject,
  resolveThemeExtends,
  TokenCompilerError,
} from "./token-compiler.mjs";
import { renderDensityCss } from "./density-css.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coreDirectory = path.join(packageRoot, "src", "core");
const cycleDirectory = path.join(packageRoot, "tests", "fixtures", "cycle");
const expectedCssPath = path.join(packageRoot, "tests", "expected.css");

async function testDeterministicSnapshot() {
  const expected = await readFile(expectedCssPath, "utf8");
  const first = await compileTokenDirectory(coreDirectory);
  const second = await compileTokenDirectory(coreDirectory);

  assert.equal(first.css, expected, "compiled CSS must match the reviewed snapshot");
  assert.equal(second.css, first.css, "same input must produce byte-identical CSS");
  assert.equal(
    first.tokens.length,
    40,
    "core should compile 40 tokens (12 Phase 0 + 12 Phase 5 breakpoint/density + 8 typography + 8 radius/shadow/blur)",
  );
}

async function testPhase5BreakpointAndDensityTokens() {
  const compiled = await compileTokenDirectory(coreDirectory);
  const cssValues = new Map(
    compiled.tokens.map((token) => [token.path.join("."), token.value]),
  );

  // Breakpoints: mobile <768px / tablet 768-1279px / desktop >=1280px (vision §7.1).
  assert.deepEqual(cssValues.get("breakpoint.mobile"), { value: 0, unit: "px" });
  assert.deepEqual(cssValues.get("breakpoint.tablet"), { value: 48, unit: "rem" });
  assert.deepEqual(cssValues.get("breakpoint.desktop"), { value: 80, unit: "rem" });

  // Density ladder: compact / standard / comfortable multipliers + control sizes.
  assert.equal(cssValues.get("density.compact"), 0.875);
  assert.equal(cssValues.get("density.standard"), 1);
  assert.equal(cssValues.get("density.comfortable"), 1.125);
  assert.equal(cssValues.get("density.active"), 1);
  assert.deepEqual(cssValues.get("control.size.compact"), { value: 2.25, unit: "rem" });
  assert.deepEqual(cssValues.get("control.size.standard"), { value: 2.5, unit: "rem" });
  assert.deepEqual(cssValues.get("control.size.comfortable"), { value: 2.75, unit: "rem" });
  assert.deepEqual(cssValues.get("control.size.active"), { value: 2.5, unit: "rem" });

  // Touch target floor (vision §7.1: 44px == 2.75rem at the 16px root).
  assert.deepEqual(cssValues.get("touch-target.min"), { value: 2.75, unit: "rem" });

  for (const variable of [
    "--cu-breakpoint-mobile",
    "--cu-breakpoint-tablet",
    "--cu-breakpoint-desktop",
    "--cu-density-compact",
    "--cu-density-standard",
    "--cu-density-comfortable",
    "--cu-density-active",
    "--cu-control-size-compact",
    "--cu-control-size-standard",
    "--cu-control-size-comfortable",
    "--cu-control-size-active",
    "--cu-touch-target-min",
  ]) {
    assert.ok(compiled.css.includes(variable), `variables.css must emit ${variable}`);
  }

  const densityCss = renderDensityCss(compiled);
  assert.ok(densityCss.includes("@container app-shell"), "A5.3: density follows named app-shell container");
  assert.ok(densityCss.includes("--cu-control-size-active: 2.75rem"), "phone density is 44px/2.75rem");
  assert.ok(densityCss.includes("@media (max-width: 47.99rem)"), "viewport media remains the :root fallback");
}

async function testPhase5TypographyTokens() {
  const compiled = await compileTokenDirectory(coreDirectory);
  const cssValues = new Map(
    compiled.tokens.map((token) => [token.path.join("."), token.value]),
  );

  const fluidSizes = [
    "typography.size.caption",
    "typography.size.body",
    "typography.size.heading-3",
    "typography.size.heading-2",
    "typography.size.heading-1",
  ];
  for (const name of fluidSizes) {
    const value = cssValues.get(name);
    assert.equal(typeof value, "string", `${name} must serialize as a CSS clamp() string`);
    assert.match(String(value), /^clamp\(/, `${name} must be a clamp() fluid size`);
    assert.match(String(value), /rem/, `${name} clamp() must use rem floors/caps`);
    assert.match(String(value), /vw/, `${name} clamp() preferred value must track viewport`);
  }

  assert.equal(cssValues.get("typography.line-height.tight"), 1.15);
  assert.equal(cssValues.get("typography.line-height.snug"), 1.25);
  assert.equal(cssValues.get("typography.line-height.body"), 1.6);

  for (const variable of [
    "--cu-typography-size-caption",
    "--cu-typography-size-body",
    "--cu-typography-size-heading-3",
    "--cu-typography-size-heading-2",
    "--cu-typography-size-heading-1",
    "--cu-typography-line-height-tight",
    "--cu-typography-line-height-snug",
    "--cu-typography-line-height-body",
  ]) {
    assert.ok(compiled.css.includes(variable), `variables.css must emit ${variable}`);
  }

  assert.match(
    compiled.css,
    /--cu-typography-size-heading-1:\s*clamp\(/,
    "heading-1 must emit a static clamp() custom property (no runtime JS)",
  );
}

async function testRadiusShadowBlurFallbacks() {
  const compiled = await compileTokenDirectory(coreDirectory);
  const cssValues = new Map(
    compiled.tokens.map((token) => [token.path.join("."), token.value]),
  );

  assert.deepEqual(cssValues.get("radius.sm"), { value: 4, unit: "px" });
  assert.deepEqual(cssValues.get("radius.md"), { value: 8, unit: "px" });
  assert.deepEqual(cssValues.get("radius.lg"), { value: 12, unit: "px" });
  assert.equal(cssValues.get("radius.xl"), undefined);
  assert.deepEqual(cssValues.get("blur.surface"), { value: 0, unit: "px" });
  assert.deepEqual(cssValues.get("blur.thick"), { value: 0, unit: "px" });
  assert.match(String(cssValues.get("shadow.sm")), /color-mix\(in srgb, #111827 12%/);
  assert.match(String(cssValues.get("shadow.md")), /color-mix\(in srgb, #111827 16%/);
  assert.match(String(cssValues.get("shadow.lg")), /color-mix\(in srgb, #111827 32%/);

  for (const variable of [
    "--cu-radius-sm",
    "--cu-radius-md",
    "--cu-radius-lg",
    "--cu-shadow-sm",
    "--cu-shadow-md",
    "--cu-shadow-lg",
    "--cu-blur-surface",
    "--cu-blur-thick",
  ]) {
    assert.ok(compiled.css.includes(variable), `variables.css must emit ${variable}`);
  }
}

async function testReadableCycleFailure() {
  await assert.rejects(
    () => compileTokenDirectory(cycleDirectory),
    (error) => {
      assert.ok(error instanceof TokenCompilerError);
      assert.match(error.message, /cycle\.a -> cycle\.b -> cycle\.c -> cycle\.a/);
      assert.match(error.message, /circular token reference detected/);
      assert.match(error.message, /Next: break the cycle/);
      return true;
    },
  );
}

function testReadableUnknownReferenceFailure() {
  assert.throws(
    () =>
      compileTokenObject({
        color: {
          missing: { $type: "color", $value: "{color.does-not-exist}" },
        },
      }),
    (error) => {
      assert.ok(error instanceof TokenCompilerError);
      assert.match(error.message, /Path: color\.missing/);
      assert.match(error.message, /reference target color\.does-not-exist does not exist/);
      assert.match(error.message, /Next: correct/);
      return true;
    },
  );
}

/** In-memory loadRef doubles for $extends tests. */
function loaderFor(documents) {
  return async (ref) => {
    if (!(ref in documents)) {
      throw new Error(`no such ref: ${ref}`);
    }
    return documents[ref];
  };
}

async function testExtendsMergesBaseAndDerived() {
  const base = {
    radius: {
      $type: "dimension",
      sm: { $value: { value: 2, unit: "px" } },
      md: { $value: { value: 4, unit: "px" } },
    },
    color: { brand: { $value: "#111827" } },
  };
  const derived = {
    $extends: "base.json",
    radius: { md: { $value: { value: 6, unit: "px" } } },
  };

  const resolved = await resolveThemeExtends(derived, loaderFor({ "base.json": base }), {
    label: "derived",
  });

  assert.equal("$extends" in resolved, false, "$extends must be stripped from the output");
  assert.deepEqual(resolved.radius.sm.$value, { value: 2, unit: "px" }, "base leaf survives");
  assert.deepEqual(resolved.radius.md.$value, { value: 6, unit: "px" }, "derived leaf wins");
  assert.deepEqual(resolved.color.brand.$value, "#111827", "untouched base groups survive");
}

async function testExtendsChainsAndArrayOrder() {
  const docs = {
    "a.json": { color: { brand: { $value: "#aaa" }, fg: { $value: "#000" } } },
    "b.json": { $extends: "a.json", color: { brand: { $value: "#bbb" } } },
  };
  const derived = {
    $extends: ["a.json", "b.json"],
    color: { brand: { $value: "#ccc" } },
  };

  const resolved = await resolveThemeExtends(derived, loaderFor(docs), { label: "derived" });
  assert.deepEqual(resolved.color.brand.$value, "#ccc", "derived document wins over parents");
  assert.deepEqual(resolved.color.fg.$value, "#000", "grandparent leaf flows through the chain");
}

async function testExtendsCycleFailsReadably() {
  const docs = {
    "a.json": { $extends: "b.json" },
    "b.json": { $extends: "a.json" },
  };
  await assert.rejects(
    () => resolveThemeExtends({ $extends: "a.json" }, loaderFor(docs), { label: "start" }),
    (error) => {
      assert.ok(error instanceof TokenCompilerError);
      assert.match(error.message, /circular \$extends reference detected/);
      assert.match(error.message, /start -> a\.json -> b\.json -> a\.json/);
      return true;
    },
  );
}

async function testExtendsMissingRefFailsReadably() {
  await assert.rejects(
    () => resolveThemeExtends({ $extends: "nope.json" }, loaderFor({}), { label: "derived" }),
    (error) => {
      assert.ok(error instanceof TokenCompilerError);
      assert.match(error.message, /cannot load \$extends ref "nope\.json"/);
      return true;
    },
  );
}

async function testOverlayRestatesGroupType() {
  const base = {
    blur: {
      $type: "dimension",
      surface: { $value: { value: 0, unit: "px" } },
    },
  };
  const derived = {
    $extends: "base.json",
    blur: {
      $type: "dimension",
      surface: { $value: { value: 0, unit: "px" } },
      overlay: { $value: { value: 0, unit: "px" } },
    },
  };
  const resolved = await resolveThemeExtends(derived, loaderFor({ "base.json": base }), {
    label: "line",
  });
  assert.equal(resolved.blur.$type, "dimension", "restated $type is metadata, not a token");
  assert.deepEqual(resolved.blur.surface.$value, { value: 0, unit: "px" });
  assert.deepEqual(resolved.blur.overlay.$value, { value: 0, unit: "px" }, "new overlay leaf is added");
}

async function testExtendsCompilesToSameEngine() {
  // A derived theme compiles through the same deterministic engine and the
  // output is static CSS (零运行时不破): no $extends survives into artifacts.
  const base = { color: { $type: "color", brand: { $value: "#112233" } } };
  const derived = {
    $extends: "base.json",
    color: { fg: { $type: "color", $value: "{color.brand}" } },
  };
  const resolved = await resolveThemeExtends(derived, loaderFor({ "base.json": base }), {
    label: "derived",
  });
  const compiled = compileTokenObject(resolved);
  assert.ok(compiled.css.includes("--cu-color-brand: #112233;"));
  assert.ok(compiled.css.includes("--cu-color-fg: #112233;"), "alias into inherited base resolves");
  assert.ok(!compiled.css.includes("$extends"));
}

await testDeterministicSnapshot();
await testPhase5BreakpointAndDensityTokens();
await testPhase5TypographyTokens();
await testRadiusShadowBlurFallbacks();
await testReadableCycleFailure();
testReadableUnknownReferenceFailure();
await testExtendsMergesBaseAndDerived();
await testExtendsChainsAndArrayOrder();
await testExtendsCycleFailsReadably();
await testExtendsMissingRefFailsReadably();
await testOverlayRestatesGroupType();
await testExtendsCompilesToSameEngine();

async function testCssPackageExports() {
  const pkg = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
  assert.equal(pkg.exports["./css"], "./dist/css/variables.css");
  assert.equal(pkg.exports["./density.css"], "./dist/css/density.css");
  assert.equal(pkg.exports["./dist/*"], "./dist/*");
}

await testCssPackageExports();
console.log("[@chameleon-ui/tokens] deterministic, breakpoint/density, typography, alias, cycle, $extends, and CSS exports tests passed");
