/**
 * pnpm ai:check — AI-consumer drift gate.
 *
 * Fails if catalog contracts, MCP tool names, AGENTS.md, or docs/ai
 * consume notes disagree. Does not invent generation_quality scores.
 *
 * Run from chameleon-ui/: node ./scripts/ai-check.mjs
 */
import { readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const workspace = join(root, '..')
const skipContracts = process.argv.includes('--drift-only')

const REQUIRED_MCP_TOOLS = [
  'get_started',
  'list_components',
  'search_components',
  'get_contract',
  'get_design_rules',
  'get_import_specifiers',
  'install_with_theme',
  'list_themes',
]

const CANONICAL_THEME_CSS = '@chameleon-ui/themes/cupertino/css'
const CANONICAL_TOKENS_CSS = '@chameleon-ui/tokens/css'
const UNEXPORTED_THEME_CSS = '@chameleon-ui/themes/cupertino/variables.css'
const COMPONENTS_IMPORT = 'from "@chameleon-ui/components"'
const UMBRELLA_REACT_IMPORT = 'from "@chameleon-ui/react"'
const UMBRELLA_REACT_CSS = '@chameleon-ui/react/css'

const problems = []

function fail(message) {
  problems.push(message)
}

function runNode(args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, env: process.env })
    let output = ''
    child.stdout.on('data', (chunk) => (output += String(chunk)))
    child.stderr.on('data', (chunk) => (output += String(chunk)))
    child.on('error', reject)
    child.on('exit', (code) => resolvePromise({ code: code ?? 1, output }))
  })
}

async function readUtf8(relativeFromRoot) {
  return readFile(join(root, relativeFromRoot), 'utf8')
}

async function readWorkspace(relativeFromWorkspace) {
  return readFile(join(workspace, relativeFromWorkspace), 'utf8')
}

function extractQuotedArray(source, exportName) {
  const pattern = new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const`)
  const match = source.match(pattern)
  if (!match) return []
  return [...match[1].matchAll(/'([^']+)'|"([^"]+)"/g)].map((entry) => entry[1] ?? entry[2])
}

function mustContain(label, text, needle) {
  if (!text.includes(needle)) fail(`${label} must contain ${JSON.stringify(needle)}`)
}

function unexportedCssIsWarned(text) {
  if (!text.includes(UNEXPORTED_THEME_CSS)) return true
  return /not exported|不要使用|不要猜|NEVER|Do not use|禁止/i.test(text)
}

async function checkContracts() {
  const result = await runNode(['packages/contract/scripts/validate-catalog-contracts.mjs'])
  process.stdout.write(result.output)
  if (result.code !== 0) {
    fail('catalog contract gate is red (v0.2 coverage)')
    return
  }
  const match = result.output.match(/(\d+)\/(\d+) contracts valid/)
  if (!match) {
    fail('contract gate did not print N/N contracts valid')
    return
  }
  const validated = Number(match[1])
  const total = Number(match[2])
  if (validated !== total || total === 0) {
    fail(`contract coverage ${validated}/${total} is not 100%`)
  }
}

async function checkMcpAndAgents() {
  const constants = await readUtf8('packages/mcp-server/src/constants.ts')
  const toolNames = extractQuotedArray(constants, 'MCP_TOOL_NAMES')
  const themeIds = extractQuotedArray(constants, 'THEME_IDS')
  const locales = extractQuotedArray(constants, 'PHASE_2_LOCALES')

  const themesSrc = await readUtf8('packages/themes/src/ids.ts')
  const i18nSrc = await readUtf8('packages/i18n/src/locales.ts')
  const officialThemes = extractQuotedArray(themesSrc, 'themeIds')
  const officialLocales = extractQuotedArray(i18nSrc, 'PHASE_2_LOCALES')

  if (JSON.stringify(themeIds) !== JSON.stringify(officialThemes)) {
    fail('mcp-server THEME_IDS drifted from @chameleon-ui/themes themeIds')
  }
  if (JSON.stringify(locales) !== JSON.stringify(officialLocales)) {
    fail('mcp-server PHASE_2_LOCALES drifted from @chameleon-ui/i18n PHASE_2_LOCALES')
  }
  if (locales.length !== 21) fail(`expected 21 locales, got ${locales.length}`)
  if (themeIds.length !== 8) fail(`expected 8 themes, got ${themeIds.length}`)

  for (const name of REQUIRED_MCP_TOOLS) {
    if (!toolNames.includes(name)) fail(`MCP_TOOL_NAMES missing ${name}`)
  }

  const agents = await readUtf8('AGENTS.md')
  const consume = await readWorkspace('docs/ai/agent-consume.md')
  const mcpReadme = await readUtf8('packages/mcp-server/README.md')
  const schemaDoc = await readWorkspace('docs/ai/schema-renderer.md')

  mustContain('chameleon-ui/AGENTS.md', agents, CANONICAL_THEME_CSS)
  mustContain('chameleon-ui/AGENTS.md', agents, CANONICAL_TOKENS_CSS)
  mustContain('chameleon-ui/AGENTS.md', agents, UMBRELLA_REACT_IMPORT)
  mustContain('chameleon-ui/AGENTS.md', agents, UMBRELLA_REACT_CSS)
  mustContain('chameleon-ui/AGENTS.md', agents, COMPONENTS_IMPORT)
  mustContain('chameleon-ui/AGENTS.md', agents, 'workspace:*')
  mustContain('chameleon-ui/AGENTS.md', agents, 'NEVER')
  mustContain('chameleon-ui/AGENTS.md', agents, 'get_started')
  mustContain('docs/ai/agent-consume.md', consume, 'get_started')
  mustContain('docs/ai/agent-consume.md', consume, UMBRELLA_REACT_CSS)
  mustContain('docs/ai/agent-consume.md', consume, 'mcpServers')
  mustContain('packages/mcp-server/README.md', mcpReadme, 'mcpServers')
  mustContain('packages/mcp-server/README.md', mcpReadme, 'get_started')
  mustContain('docs/ai/schema-renderer.md', schemaDoc, '"version": "1.0"')
  mustContain('docs/ai/schema-renderer.md', schemaDoc, 'SchemaRenderer')

  try {
    const bootstrap = await readWorkspace('docs/ai/consumer-agent-bootstrap.md')
    mustContain('docs/ai/consumer-agent-bootstrap.md', bootstrap, 'get_started')
    mustContain('docs/ai/consumer-agent-bootstrap.md', bootstrap, UMBRELLA_REACT_CSS)
    mustContain('docs/ai/consumer-agent-bootstrap.md', bootstrap, 'ThemeProvider')
  } catch {
    fail('docs/ai/consumer-agent-bootstrap.md is missing')
  }
  for (const name of REQUIRED_MCP_TOOLS) {
    if (!agents.includes(name)) fail(`AGENTS.md missing MCP tool ${name}`)
    if (!mcpReadme.includes(name)) fail(`mcp-server README missing tool ${name}`)
  }
  for (const id of officialThemes) {
    if (!agents.includes(id)) fail(`AGENTS.md missing theme id ${id}`)
  }
  for (const locale of officialLocales) {
    if (!agents.includes(locale)) fail(`AGENTS.md missing locale ${locale}`)
  }
  if (!unexportedCssIsWarned(agents)) {
    fail('AGENTS.md mentions the unexported CSS path without a NEVER/not-exported warning')
  }
}

async function main() {
  if (!skipContracts) await checkContracts()
  await checkMcpAndAgents()

  if (problems.length > 0) {
    console.error('ai:check failed:')
    for (const problem of problems) console.error(` - ${problem}`)
    process.exitCode = 1
    return
  }
  console.log('[ai:check] contracts + MCP tools + AGENTS.md + docs/ai consume notes are in lockstep')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
