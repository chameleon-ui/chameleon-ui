/**
 * Phase 8 one-off codemod (kept for audit): add data-ai-intent to every
 * catalog component root element and backfill data-ai-state on the 13
 * components from the track-card audit list. Only ADDs data-ai-* attributes.
 * Run: node scripts/codemod-phase8-data-ai.mjs [--check]
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { COMPONENT_INTENTS } from './codemod-phase8-contracts.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const componentsSrc = join(root, 'packages', 'components', 'src')
const checkOnly = process.argv.includes('--check')
const invokedDirectly =
  !!process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

const STATE_BACKFILL = {
  breadcrumb: 'default',
  'description-list': 'default',
  divider: 'default',
  'empty-state': 'default',
  grid: 'default',
  kbd: 'default',
  label: 'default',
  link: 'default',
  menu: 'open',
  'number-input': 'default',
  pagination: 'default',
  progress: 'default',
  slider: 'default',
}

async function main() {
  const catalog = JSON.parse(
    await readFile(join(root, 'packages', 'components', 'catalog.json'), 'utf8'),
  )
  const problems = []
  let touched = 0

  for (const component of catalog.components) {
    const slug = component.slug
    const contract = JSON.parse(
      await readFile(join(componentsSrc, slug, 'contract.json'), 'utf8'),
    )
    const role = contract.dataAi?.role ?? slug
    const intent = (contract.dataAi?.intents ?? COMPONENT_INTENTS[slug] ?? [])[0]
    if (!intent) {
      problems.push(`${slug}: no primary intent available`)
      continue
    }

    const dir = join(componentsSrc, slug)
    const files = (await readdir(dir)).filter(
      (name) => name.endsWith('.tsx') && !name.includes('.test.'),
    )
    let edited = false
    for (const name of files) {
      const filePath = join(dir, name)
      const source = await readFile(filePath, 'utf8')
      const roleAttr = `data-ai-role="${role}"`
      if (!source.includes(roleAttr)) continue
      if (source.includes('data-ai-intent=') && source.includes('data-ai-state=')) continue

      let next = source
      const additions = []
      if (!source.includes('data-ai-state=') && STATE_BACKFILL[slug]) {
        additions.push(`data-ai-state="${STATE_BACKFILL[slug]}"`)
      }
      if (!source.includes('data-ai-intent=')) {
        additions.push(`data-ai-intent="${intent}"`)
      }
      if (additions.length === 0) continue

      if (STATE_BACKFILL[slug] && next.split(roleAttr).length - 1 !== 1) {
        problems.push(`${slug}: state backfill needs exactly one ${roleAttr} in ${name}`)
        continue
      }
      next = next.replaceAll(roleAttr, `${roleAttr} ${additions.join(' ')}`)

      if (next !== source) {
        edited = true
        if (checkOnly) {
          problems.push(`${slug}: ${name} missing ${additions.join(', ')}`)
        } else {
          await writeFile(filePath, next, 'utf8')
        }
      }
    }
    if (edited) touched += 1
    if (!edited && !checkOnly) {
      // Verify the component already carries the full triple somewhere.
      const all = await Promise.all(
        files.map(async (name) => readFile(join(dir, name), 'utf8')),
      )
      const joined = all.join('\n')
      for (const attr of ['data-ai-role=', 'data-ai-state=', 'data-ai-intent=']) {
        if (!joined.includes(attr)) problems.push(`${slug}: still missing ${attr}`)
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`codemod-phase8-data-ai problems:\n - ${problems.join('\n - ')}`)
  }
  console.log(
    `[codemod-phase8-data-ai] ${checkOnly ? 'checked' : 'edited'} ${catalog.components.length} components; ${touched} files touched`,
  )
}

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
