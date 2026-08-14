import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentSchemaPath = path.join(packageRoot, "schemas", "component-contract.schema.json");
const componentSchemaV01Path = path.join(packageRoot, "schemas", "component-contract.v0.1.json");
const designRulesSchemaPath = path.join(packageRoot, "schemas", "design-rules.schema.json");
const samplePath = path.join(packageRoot, "samples", "button.contract.json");

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      [
        "Contract validation failed.",
        `Path: ${filePath}`,
        `Reason: invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        "Next: fix the JSON syntax and rerun the contract test.",
      ].join("\n"),
    );
  }
}

function formatErrors(documentPath, errors) {
  return [
    "Contract validation failed.",
    `Path: ${documentPath}`,
    "Reason:",
    ...errors.map(
      (error) =>
        `  - ${error.instancePath || "/"}: ${error.message ?? "schema rule failed"}`,
    ),
    "Next: make the document match schemas/component-contract.schema.json and rerun the contract test.",
  ].join("\n");
}

/**
 * @complexity time O(n*r) | space O(n) | n = document nodes, r = applicable schema rules
 * @guarantees strict schema compilation and errors located by instance path
 */
async function main() {
  const [componentSchema, componentSchemaV01, designRulesSchema, sample] = await Promise.all([
    readJson(componentSchemaPath),
    readJson(componentSchemaV01Path),
    readJson(designRulesSchemaPath),
    readJson(samplePath),
  ]);
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false });

  if (!ajv.validateSchema(componentSchema)) {
    throw new Error(formatErrors(componentSchemaPath, ajv.errors ?? []));
  }

  if (!ajv.validateSchema(componentSchemaV01)) {
    throw new Error(formatErrors(componentSchemaV01Path, ajv.errors ?? []));
  }

  if (componentSchemaV01?.$id?.includes("/v0.1.json") !== true) {
    throw new Error(
      formatErrors(componentSchemaV01Path, [
        { instancePath: "/$id", message: "archived schema must keep the v0.1 $id" },
      ]),
    );
  }

  if (!ajv.validateSchema(designRulesSchema)) {
    throw new Error(formatErrors(designRulesSchemaPath, ajv.errors ?? []));
  }

  const validate = ajv.compile(componentSchema);
  if (!validate(sample)) {
    throw new Error(formatErrors(samplePath, validate.errors ?? []));
  }

  const invalidSample = { ...sample };
  delete invalidSample.slug;
  if (validate(invalidSample)) {
    throw new Error(
      [
        "Contract validation failed.",
        "Path: generated-invalid-sample/slug",
        "Reason: the validator accepted a document missing required slug.",
        "Next: inspect the schema required list before merging.",
      ].join("\n"),
    );
  }

  console.log("[@chameleon-ui/contract] component + design-rules schema meta-check and sample validation passed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
