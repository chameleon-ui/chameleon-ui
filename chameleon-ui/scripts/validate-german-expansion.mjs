import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { meetsExpansion } from '@chameleon-ui/i18n'

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(monorepoRoot, 'packages', 'components', 'catalog.json')
const expansionRatio = 1.35

function flattenMessages(value, prefix = '') {
  if (typeof value === 'string') return { [prefix]: value }
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, nested]) =>
      Object.entries(flattenMessages(nested, prefix ? `${prefix}.${key}` : key)),
    ),
  )
}

async function main() {
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  const complete = catalog.components.filter(
    (item) => item.implementation === 'complete' && item.tier === 'base',
  )
  const issues = []

  for (const item of complete) {
    const localeDir = path.join(monorepoRoot, 'packages', 'components', 'src', item.slug, 'locales')
    const english = flattenMessages(
      JSON.parse(await readFile(path.join(localeDir, 'en.json'), 'utf8')),
    )
    const german = flattenMessages(
      JSON.parse(await readFile(path.join(localeDir, 'de.json'), 'utf8')),
    )

    for (const [key, englishText] of Object.entries(english)) {
      const germanText = german[key]
      if (germanText === undefined) {
        issues.push(`${item.slug}/${key}: missing German translation`)
        continue
      }
      if (!meetsExpansion(englishText, germanText, expansionRatio)) {
        issues.push(
          `${item.slug}/${key}: German expansion below ${expansionRatio} (${germanText.length}/${englishText.length})`,
        )
      }
    }
  }

  if (issues.length > 0) {
    console.error('[german-expansion] failures:\n' + issues.join('\n'))
    process.exitCode = 1
    return
  }

  console.log(
    `[german-expansion] PASS — ${complete.length} complete base components meet ≥${expansionRatio} German expansion`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
