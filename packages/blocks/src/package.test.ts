import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PHASE_2_LOCALES } from '@chameleon-ui/i18n'
import { describe, expect, it } from 'vitest'
import { REAL_BLOCK_SLUGS } from './slugs.js'
import { isSkeletonTree } from './copy.js'

const srcRoot = join(dirname(fileURLToPath(import.meta.url)))
const gapTable = JSON.parse(
  readFileSync(join(srcRoot, '..', 'locale-gap-table.json'), 'utf8'),
) as { authored: string[]; skeleton: string[]; eta: string; owner: string }

function pascalToSlug(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function importedComponents(source: string) {
  const names = [...source.matchAll(/import\s+\{([^}]+)\}\s+from\s+'@chameleon-ui\/components'/g)].flatMap((match) =>
    (match[1] ?? '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => !part.startsWith('type '))
      .map((part) => part.split(/\s+as\s+/)[0]?.trim() ?? '')
      .filter((name) => /^[A-Z]/.test(name))
      .map(pascalToSlug),
  )
  return [...new Set(names)].sort()
}

describe('block locales', () => {
  it('ships 21 locales with authored en/zh-CN/zh-HK and skeleton copies elsewhere', () => {
    expect(gapTable.authored).toEqual(['en', 'zh-CN', 'zh-HK'])
    expect(gapTable.skeleton).toHaveLength(18)
    expect(gapTable.eta).toBe('pending')
    expect(gapTable.owner).toBe('pending')

    for (const slug of REAL_BLOCK_SLUGS) {
      const localeDir = join(srcRoot, slug, 'locales')
      const files = readdirSync(localeDir).filter((name) => name.endsWith('.json'))
      expect(files.sort()).toEqual([...PHASE_2_LOCALES].map((locale) => `${locale}.json`).sort())

      for (const locale of PHASE_2_LOCALES) {
        const tree = JSON.parse(readFileSync(join(localeDir, `${locale}.json`), 'utf8')) as unknown
        if (locale === 'en' || locale === 'zh-CN' || locale === 'zh-HK') {
          expect(isSkeletonTree(tree)).toBe(false)
        } else {
          expect(isSkeletonTree(tree)).toBe(true)
        }
      }
    }
  })
})

describe('manifest drift', () => {
  it('lists the same component slugs the block source imports', () => {
    for (const slug of REAL_BLOCK_SLUGS) {
      const fileName = slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
      const manifest = JSON.parse(
        readFileSync(join(srcRoot, slug, 'manifest.json'), 'utf8'),
      ) as { slug: string; type: string; dependencies: string[] }
      const contract = JSON.parse(readFileSync(join(srcRoot, slug, 'contract.json'), 'utf8')) as {
        slug: string
        schemaVersion: string
      }
      const source = readFileSync(join(srcRoot, slug, `${fileName}.tsx`), 'utf8')
      const imported = importedComponents(source)

      expect(manifest.slug).toBe(slug)
      expect(manifest.type).toBe('registry:block')
      expect(contract.slug).toBe(slug)
      expect(contract.schemaVersion).toBe('0.2')
      expect([...manifest.dependencies].sort()).toEqual(imported)
    }
  })
})
