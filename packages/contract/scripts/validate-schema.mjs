import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(packageRoot, "schemas", "component-contract.schema.json");
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
  const [schema, sample] = await Promise.all([readJson(schemaPath), readJson(samplePath)]);
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false });

  if (!ajv.validateSchema(schema)) {
    throw new Error(formatErrors(schemaPath, ajv.errors ?? []));
  }

  const validate = ajv.compile(schema);
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

  console.log("[@chameleon-ui/contract] schema meta-check and sample validation passed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
