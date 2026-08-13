import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  compileTokenDirectory,
  compileTokenObject,
  TokenCompilerError,
} from "./token-compiler.mjs";

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
  assert.equal(first.tokens.length, 12, "fixture should compile twelve Phase 0 tokens");
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

await testDeterministicSnapshot();
await testReadableCycleFailure();
testReadableUnknownReferenceFailure();
console.log("[@chameleon-ui/tokens] deterministic, alias, and cycle tests passed");
