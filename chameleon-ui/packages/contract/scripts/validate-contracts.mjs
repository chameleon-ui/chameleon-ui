import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import { glob } from 'node:fs/promises'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const schemaPath = path.join(packageRoot, 'schemas', 'component-contract.schema.json')

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'))
  } catch (error) {
    throw new Error(
      [
        'Contract validation failed.',
        `Path: ${filePath}`,
        `Reason: invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        'Next: fix the JSON syntax and rerun the contract test.',
      ].join('\n'),
    )
  }
}

function formatErrors(documentPath, errors) {
  return [
    'Contract validation failed.',
    `Path: ${documentPath}`,
    'Reason:',
    ...(errors ?? []).map(
      (error) => `  - ${error.instancePath || '/'}: ${error.message ?? 'schema rule failed'}`,
    ),
    'Next: make the document match schemas/component-contract.schema.json and rerun the contract test.',
  ].join('\n')
}

/**
 * @complexity time O(n*r) | space O(n) | n = document nodes, r = schema rules
 * @guarantees validates component-directory contracts without copying their bodies into this package
 */
async function main() {
  const schema = await readJson(schemaPath)
  const ajv = new Ajv2020({ allErrors: true, strict: true, validateFormats: false })
  if (!ajv.validateSchema(schema)) {
    throw new Error(formatErrors(schemaPath, ajv.errors ?? []))
  }
  const validate = ajv.compile(schema)

  const patterns = process.argv.slice(2)
  if (patterns.length === 0) {
    throw new Error(
      [
        'Contract validation failed.',
        'Path: <arguments>',
        'Reason: no contract.json paths were provided.',
        'Next: pass one or more contract.json paths (globs allowed).',
      ].join('\n'),
    )
  }

  const files = []
  for (const pattern of patterns) {
    if (pattern.includes('*')) {
      const matches = []
      for await (const match of glob(pattern.replaceAll('\\', '/'))) {
        matches.push(path.resolve(match))
      }
      if (matches.length === 0) {
        throw new Error(
          [
            'Contract validation failed.',
            `Path: ${pattern}`,
            'Reason: the glob matched no contract files.',
            'Next: create contract.json beside the component implementation.',
          ].join('\n'),
        )
      }
      files.push(...matches)
    } else {
      files.push(path.resolve(pattern))
    }
  }

  for (const filePath of files) {
    const document = await readJson(filePath)
    if (!validate(document)) {
      throw new Error(formatErrors(filePath, validate.errors ?? []))
    }
  }

  console.log(`[@chameleon-ui/contract] validated ${files.length} component contract(s)`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
