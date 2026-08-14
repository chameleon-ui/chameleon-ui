import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(packageRoot, '../..')
const schemaPath = path.join(packageRoot, 'schemas', 'component-contract.schema.json')

// Test hooks for the Phase 8 red-proof gate; production runs never set these.
const catalogPath =
  process.env.CU_CATALOG_JSON ?? path.join(workspaceRoot, 'packages', 'components', 'catalog.json')
const componentsSrc =
  process.env.CU_COMPONENTS_SRC ?? path.join(workspaceRoot, 'packages', 'components', 'src')

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
        [
          'Contract coverage gate failed.',
          `Path: ${filePath}`,
          'Reason: the catalog lists this component but no contract.json exists beside the implementation.',
          'Next: author contract.json (schema v0.2) before merging the catalog entry.',
        ].join('\n'),
      )
    }
    throw new Error(
      [
        'Contract coverage gate failed.',
        `Path: ${filePath}`,
        `Reason: invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        'Next: fix the JSON syntax and rerun the contract gate.',
      ].join('\n'),
    )
  }
}

function formatErrors(documentPath, errors) {
  return [
    'Contract coverage gate failed.',
    `Path: ${documentPath}`,
    'Reason:',
    ...(errors ?? []).map(
      (error) => `  - ${error.instancePath || '/'}: ${error.message ?? 'schema rule failed'}`,
    ),
    'Next: make the document match schemas/component-contract.schema.json (v0.2) and rerun the contract gate.',
  ].join('\n')
}

/**
 * Catalog-driven contract coverage gate (Phase 8 A1 hard gate).
 * Every catalog slug must ship a contract.json that validates against the
 * current schema. In-flight component directories that are not yet in the
 * catalog are out of scope until their catalog entry lands.
 *
 * @complexity time O(c*n*r) | space O(n) | c = catalog slugs, n = document nodes, r = schema rules
 * @guarantees 100% catalog coverage; field-level error paths for U9 compliance
 */
async function main() {
  const schema = await readJson(schemaPath)
  const catalog = await readJson(catalogPath)
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false })
  if (!ajv.validateSchema(schema)) {
    throw new Error(formatErrors(schemaPath, ajv.errors ?? []))
  }
  const validate = ajv.compile(schema)

  // CU_CONTRACT_MAX_N isolates Phase 8 A1 from concurrent P5/P6 catalog growth
  // (A8.1 DoD is the frozen 50). Unset in production = 100% catalog coverage.
  const maxNRaw = process.env.CU_CONTRACT_MAX_N
  const maxN = maxNRaw === undefined || maxNRaw === '' ? Number.POSITIVE_INFINITY : Number(maxNRaw)
  if (!Number.isFinite(maxN) && maxNRaw !== undefined && maxNRaw !== '') {
    throw new Error(`CU_CONTRACT_MAX_N must be a number, got ${JSON.stringify(maxNRaw)}`)
  }
  const entries = catalog.components.filter((component) => {
    if (!Number.isFinite(maxN)) return true
    return typeof component.n === 'number' && component.n <= maxN
  })
  const slugs = entries.map((component) => component.slug)
  let validated = 0
  for (const slug of slugs) {
    const contractPath = path.join(componentsSrc, slug, 'contract.json')
    const document = await readJson(contractPath)
    if (document.slug !== slug) {
      throw new Error(
        [
          'Contract coverage gate failed.',
          `Path: ${contractPath}`,
          `Reason: contract slug "${document.slug}" does not match catalog slug "${slug}".`,
          'Next: keep contract.json slug aligned with the directory and catalog entry.',
        ].join('\n'),
      )
    }
    if (!validate(document)) {
      throw new Error(formatErrors(contractPath, validate.errors ?? []))
    }
    validated += 1
  }

  if (validated !== slugs.length || validated === 0) {
    throw new Error(
      [
        'Contract coverage gate failed.',
        `Path: ${catalogPath}`,
        `Reason: validated ${validated} contract(s) for ${slugs.length} catalog slug(s).`,
        'Next: every catalog component must ship a valid contract.json.',
      ].join('\n'),
    )
  }

  const schemaVersion = schema.properties?.schemaVersion?.const ?? 'unknown'
  const isolation =
    Number.isFinite(maxN) ? ` (isolated n<=${maxN}; catalog has ${catalog.components.length})` : ''
  console.log(
    `[@chameleon-ui/contract] catalog coverage gate: ${validated}/${slugs.length} contracts valid against schema v${schemaVersion}${isolation}`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
