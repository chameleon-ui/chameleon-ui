import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.resolve(packageRoot, "../contract/schemas/design-rules.schema.json");
// CU_THEMES_SRC is a red-proof/test hook used by phase8:gates; production runs never set it.
const themesRoot = process.env.CU_THEMES_SRC ?? path.join(packageRoot, "src");
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
const communityRulesPackIds = ["community-focus-first"];

/** S3 budget warning threshold (gzip KB per theme dist/) — from benchmarks/budgets.json */
const S3_WARN_KB = 20;

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      [
        "Design rules validation failed.",
        `Path: ${filePath}`,
        `Reason: invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        "Next: fix the JSON syntax and rerun validate-rules.",
      ].join("\n"),
    );
  }
}

function formatErrors(documentPath, errors) {
  return [
    "Design rules validation failed.",
    `Path: ${documentPath}`,
    "Reason:",
    ...(errors ?? []).map(
      (error) => `  - ${error.instancePath || "/"}: ${error.message ?? "schema rule failed"}`,
    ),
    "Next: make the document match packages/contract/schemas/design-rules.schema.json.",
  ].join("\n");
}

/**
 * @complexity time O(n*r) | space O(n) | n = document nodes, r = schema rules
 * @guarantees field-level error paths for U9 compliance
 */
async function main() {
  const schema = await readJson(schemaPath);
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false });

  if (!ajv.validateSchema(schema)) {
    throw new Error(formatErrors(schemaPath, ajv.errors ?? []));
  }

  const validate = ajv.compile(schema);

  // Authoring mode: validate a single design-rules document (community pack flow).
  const fileFlagIndex = process.argv.indexOf("--file");
  if (fileFlagIndex >= 0) {
    const singlePath = process.argv[fileFlagIndex + 1];
    if (!singlePath) {
      throw new Error(
        [
          "Design rules validation failed.",
          "Path: <arguments>",
          "Reason: --file requires a design-rules.json path.",
          "Next: pass the document to validate, e.g. validate-rules --file ./design-rules.json.",
        ].join("\n"),
      );
    }
    const document = await readJson(path.resolve(singlePath));
    if (!validate(document)) {
      throw new Error(formatErrors(singlePath, validate.errors ?? []));
    }
    console.log(`[@chameleon-ui/themes] validate-rules --file OK: ${singlePath}`);
    return;
  }

  let passed = 0;

  for (const themeId of themeIds) {
    const rulesPath = path.join(themesRoot, themeId, "design-rules.json");
    const document = await readJson(rulesPath);

    if (!validate(document)) {
      throw new Error(formatErrors(rulesPath, validate.errors ?? []));
    }

    const serialized = JSON.stringify(document);
    const approxKb = Buffer.byteLength(serialized, "utf8") / 1024;
    if (approxKb > S3_WARN_KB) {
      console.warn(
        `[@chameleon-ui/themes] WARN ${themeId}: design-rules.json is ${approxKb.toFixed(2)} KB raw (S3 dist budget ${S3_WARN_KB} KB gzip for full theme)`,
      );
    }

    passed += 1;
  }

  for (const packId of communityRulesPackIds) {
    const rulesPath = path.join(themesRoot, packId, "design-rules.json");
    const document = await readJson(rulesPath);

    if (!validate(document)) {
      throw new Error(formatErrors(rulesPath, validate.errors ?? []));
    }

    passed += 1;
  }

  console.log(
    `[@chameleon-ui/themes] validate-rules: ${passed}/${themeIds.length + communityRulesPackIds.length} documents passed schema v1.0`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
