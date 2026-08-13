import path from "node:path";
import { fileURLToPath } from "node:url";
import { physicalPropertyReplacements } from "../src/index.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadStylelint() {
  try {
    return (await import("stylelint")).default;
  } catch (error) {
    throw new Error(
      [
        "CSS direction lint failed.",
        "Path: toolings/stylelint-config/package.json",
        `Reason: Stylelint is unavailable: ${error instanceof Error ? error.message : String(error)}`,
        "Next: run pnpm install once from the chameleon-ui monorepo root, then rerun this lint.",
      ].join("\n"),
    );
  }
}

function logicalHint(warning) {
  const matchedProperty = Object.keys(physicalPropertyReplacements)
    .sort((left, right) => right.length - left.length)
    .find((property) =>
    new RegExp(`(?:^|[^a-z-])${property.replaceAll("-", "\\-")}(?:[^a-z-]|$)`, "i").test(
      warning.text,
    ),
    );
  return matchedProperty
    ? `; use ${physicalPropertyReplacements[matchedProperty]} instead`
    : "";
}

/**
 * @complexity time O(c) parser traversal | space O(e) | c = CSS characters, e = violations
 * @guarantees syntax-aware scan with file, line, column, and logical-property next step
 */
export async function lintCssFiles(files) {
  const stylelint = await loadStylelint();
  const result = await stylelint.lint({
    files,
    configFile: path.join(packageRoot, "src", "index.mjs"),
    formatter: "json",
  });

  const diagnostics = result.results.flatMap((fileResult) =>
    fileResult.warnings.map(
      (warning) =>
        `${fileResult.source}:${warning.line}:${warning.column} ${warning.text}${logicalHint(warning)}`,
    ),
  );

  return { diagnostics, errored: result.errored };
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    throw new Error(
      [
        "CSS direction lint failed.",
        "Path: <arguments>",
        "Reason: no CSS files were provided.",
        "Next: pass one or more CSS paths to scripts/lint-css.mjs.",
      ].join("\n"),
    );
  }

  const result = await lintCssFiles(files);
  if (result.diagnostics.length > 0) console.error(result.diagnostics.join("\n"));
  if (result.errored) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
