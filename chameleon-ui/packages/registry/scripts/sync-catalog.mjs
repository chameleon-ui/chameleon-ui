import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(packageRoot, '../..')
const catalogPath = path.join(workspaceRoot, 'packages', 'components', 'catalog.json')
const componentsSrc = path.join(workspaceRoot, 'packages', 'components', 'src')
const blocksSrc = path.join(workspaceRoot, 'packages', 'blocks', 'src')
const themesSrc = path.join(workspaceRoot, 'packages', 'themes', 'src')
const registryRoot = path.join(packageRoot, 'registry')
const themeIds = [
  'line',
  'silver-arrow',
  'stuttgart',
  'corsa',
  'cupertino',
  'siren',
  'wechat',
  'ant-blue',
]
const rulesPackIds = ['community-focus-first']
const blockSlugs = [
  'login',
  'register',
  'crud-page',
  'kanban',
  'gantt',
  'ticket-flow',
  'approval-flow',
  'im-chat',
  'data-screen',
  'trading-terminal',
  'iot-panel',
  'marketing-site',
]
const checkOnly = process.argv.includes('--check')

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function isSkipped(relativePath) {
  const posix = toPosix(relativePath)
  const base = path.posix.basename(posix)
  if (base.endsWith('.test.ts') || base.endsWith('.test.tsx')) return true
  if (posix.split('/').includes('test')) return true
  return false
}

async function collectFiles(directory, relativePrefix = '') {
  const files = []
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const relativePath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name
    if (isSkipped(relativePath)) continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, relativePath)))
    } else {
      files.push({ relativePath: toPosix(relativePath), fullPath })
    }
  }
  return files
}

async function pathExists(target) {
  try {
    await stat(target)
    return true
  } catch {
    return false
  }
}

async function writeItem(kind, item) {
  const directory = path.join(registryRoot, kind)
  await mkdir(directory, { recursive: true })
  const filePath = path.join(directory, `${item.id}.json`)
  const serialized = `${JSON.stringify(item, null, 2)}\n`
  if (checkOnly) {
    if (!(await pathExists(filePath))) {
      throw new Error(`missing registry entry ${kind}/${item.id}.json`)
    }
    const existing = await readFile(filePath, 'utf8')
    if (existing !== serialized) {
      throw new Error(`registry entry ${kind}/${item.id}.json is stale; run scripts/sync-catalog.mjs`)
    }
    return
  }
  await writeFile(filePath, serialized, 'utf8')
}

async function buildBlockItem(slug) {
  const sourceDir = path.join(blocksSrc, slug)
  if (!(await pathExists(sourceDir))) {
    throw new Error(`missing block source: ${sourceDir}`)
  }
  const manifest = JSON.parse(await readFile(path.join(sourceDir, 'manifest.json'), 'utf8'))
  if (manifest.type !== 'registry:block') {
    throw new Error(`block ${slug} manifest.type must be registry:block`)
  }
  if (manifest.slug !== slug) {
    throw new Error(`block ${slug} manifest.slug mismatch (${manifest.slug})`)
  }
  const files = await collectFiles(sourceDir)
  if (files.length === 0) {
    throw new Error(`no installable files for block ${slug}`)
  }
  return {
    id: slug,
    type: 'registry:block',
    name: manifest.name ?? slug,
    dependencies: [...(manifest.dependencies ?? [])],
    files: await Promise.all(
      files.map(async (file) => ({
        path: `blocks/${slug}/${file.relativePath}`,
        content: await readFile(file.fullPath, 'utf8'),
      })),
    ),
  }
}

async function buildComponentItem(component) {
  const sourceDir = path.join(componentsSrc, component.slug)
  if (!(await pathExists(sourceDir))) {
    throw new Error(`missing component source: ${sourceDir}`)
  }
  const files = await collectFiles(sourceDir)
  if (files.length === 0) {
    throw new Error(`no installable files for ${component.slug}`)
  }
  return {
    id: component.slug,
    type: 'registry:ui',
    name: component.name,
    dependencies: [],
    files: await Promise.all(
      files.map(async (file) => ({
        path: `components/${component.slug}/${file.relativePath}`,
        content: await readFile(file.fullPath, 'utf8'),
      })),
    ),
  }
}

async function buildThemeItem(themeId) {
  const sourceDir = path.join(themesSrc, themeId)
  if (!(await pathExists(sourceDir))) {
    throw new Error(`missing theme source: ${sourceDir}`)
  }
  const meta = JSON.parse(await readFile(path.join(sourceDir, 'meta.json'), 'utf8'))
  const files = await collectFiles(sourceDir)
  return {
    id: themeId,
    type: 'registry:theme',
    name: meta.label ?? themeId,
    dependencies: [],
    files: await Promise.all(
      files.map(async (file) => ({
        path: `themes/${themeId}/${file.relativePath}`,
        content: await readFile(file.fullPath, 'utf8'),
      })),
    ),
  }
}

async function buildRulesPackItem(packId) {
  const sourceDir = path.join(themesSrc, packId)
  if (!(await pathExists(sourceDir))) {
    throw new Error(`missing rules pack source: ${sourceDir}`)
  }
  const meta = JSON.parse(await readFile(path.join(sourceDir, 'meta.json'), 'utf8'))
  const files = await collectFiles(sourceDir)
  return {
    id: packId,
    type: 'registry:rules',
    name: meta.label ?? packId,
    dependencies: [],
    files: await Promise.all(
      files.map(async (file) => ({
        path: `rules/${packId}/${file.relativePath}`,
        content: await readFile(file.fullPath, 'utf8'),
      })),
    ),
  }
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  const components = catalog.components
  // Component count is dynamic in Phase 2; consistency is validated against the registry directory later.

  for (const component of components) {
    await writeItem('r', await buildComponentItem(component))
  }
  for (const slug of blockSlugs) {
    await writeItem('b', await buildBlockItem(slug))
  }
  for (const themeId of themeIds) {
    await writeItem('t', await buildThemeItem(themeId))
  }
  for (const packId of rulesPackIds) {
    await writeItem('rules', await buildRulesPackItem(packId))
  }

  const rEntries = (await readdir(path.join(registryRoot, 'r'))).filter((name) => name.endsWith('.json'))
  const bEntries = (await readdir(path.join(registryRoot, 'b'))).filter((name) => name.endsWith('.json'))
  const tEntries = (await readdir(path.join(registryRoot, 't'))).filter((name) => name.endsWith('.json'))
  const rulesEntries = (await readdir(path.join(registryRoot, 'rules'))).filter((name) =>
    name.endsWith('.json'),
  )
  const expectedR = components.map((item) => `${item.slug}.json`).sort()
  const expectedB = blockSlugs.map((id) => `${id}.json`).sort()
  const expectedT = themeIds.map((id) => `${id}.json`).sort()
  const expectedRules = rulesPackIds.map((id) => `${id}.json`).sort()
  const actualR = [...rEntries].sort()
  const actualB = [...bEntries].sort()
  const actualT = [...tEntries].sort()
  const actualRules = [...rulesEntries].sort()
  if (JSON.stringify(actualR) !== JSON.stringify(expectedR)) {
    throw new Error(`registry/r mismatch: expected ${expectedR.join(', ')} got ${actualR.join(', ')}`)
  }
  if (JSON.stringify(actualB) !== JSON.stringify(expectedB)) {
    throw new Error(`registry/b mismatch: expected ${expectedB.join(', ')} got ${actualB.join(', ')}`)
  }
  if (JSON.stringify(actualT) !== JSON.stringify(expectedT)) {
    throw new Error(`registry/t mismatch: expected ${expectedT.join(', ')} got ${actualT.join(', ')}`)
  }
  if (JSON.stringify(actualRules) !== JSON.stringify(expectedRules)) {
    throw new Error(
      `registry/rules mismatch: expected ${expectedRules.join(', ')} got ${actualRules.join(', ')}`,
    )
  }

  console.log(
    `[registry] ${checkOnly ? 'checked' : 'wrote'} ${components.length} components + ${blockSlugs.length} blocks + ${themeIds.length} themes + ${rulesPackIds.length} rules packs`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
