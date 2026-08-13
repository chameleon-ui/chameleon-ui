import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lintCssFiles } from "./lint-css.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const goodFixture = path.join(packageRoot, "fixtures", "good.css");
const badFixture = path.join(packageRoot, "fixtures", "bad.css");

const good = await lintCssFiles([goodFixture]);
assert.equal(good.errored, false, `good.css must pass:\n${good.diagnostics.join("\n")}`);
assert.deepEqual(good.diagnostics, []);

const bad = await lintCssFiles([badFixture]);
assert.equal(bad.errored, true, "bad.css must be rejected");
for (const expected of [
  "border-left",
  "left",
  "margin-left",
  "padding-right",
  "border-inline-start",
  "inset-inline-start",
  "margin-inline-start",
  "padding-inline-end",
]) {
  assert.match(bad.diagnostics.join("\n"), new RegExp(expected));
}
assert.match(bad.diagnostics.join("\n"), /bad\.css:\d+:\d+/);

console.log("[@chameleon-ui/stylelint-config] good fixture passed and bad fixture failed");
