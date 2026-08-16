import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import catalog from '../catalog.json'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcRoot = path.join(packageRoot, 'src')
const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>
  status?: string
}

function changeLogSlugs(): Set<string> {
  const changed = new Set<string>()
  for (const entry of catalog.changeLog ?? []) {
    const record = entry as { slug?: string; slugs?: string[] }
    if (typeof record.slug === 'string') changed.add(record.slug)
    for (const slug of record.slugs ?? []) changed.add(slug)
  }
  return changed
}

describe('catalog freeze', () => {
  it('registers unique slugs, S5 common-10, and dated changeLog for post-P1 additions', () => {
    const slugs = catalog.components.map((item) => item.slug)
    expect(catalog.schemaVersion).toBe('2.0')
    expect(slugs.length).toBeGreaterThanOrEqual(54)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(catalog.components.every((item) => typeof item.family === 'string')).toBe(true)
    const changed = changeLogSlugs()
    for (const slug of ['action-sheet', 'tab-bar', 'safe-area', 'sidebar']) {
      expect(slugs).toContain(slug)
      expect(changed.has(slug), `catalog changeLog entry for ${slug}`).toBe(true)
    }
    const p6 = catalog.components.filter((item) => typeof item.n === 'number' && item.n > 54)
    for (const component of p6) {
      expect(changed.has(component.slug), `catalog changeLog entry for ${component.slug}`).toBe(true)
    }
    expect(catalog.s5Suite.appShell).toBe('app-shell')
    expect(catalog.s5Suite.common10).toHaveLength(10)
    expect(catalog.s5Suite.common10).not.toContain('app-shell')
    for (const slug of catalog.s5Suite.common10) {
      expect(slugs).toContain(slug)
    }
    expect(catalog.locales).toHaveLength(21)
    expect(catalog.locales).toContain('zh-CN')
    expect(catalog.locales).toContain('ar')
    expect(catalog.locales).toContain('vi')
  })

  it('ships a locale file for every catalog locale on every component', () => {
    for (const component of catalog.components) {
      const localeDir = path.join(srcRoot, component.slug, 'locales')
      const onDisk = new Set(
        readdirSync(localeDir)
          .filter((name) => name.endsWith('.json'))
          .map((name) => name.replace(/\.json$/, '')),
      )
      for (const locale of catalog.locales) {
        expect(onDisk.has(locale), `${component.slug}/${locale}.json`).toBe(true)
      }
    }
  })

  it('does not depend on Ark or Base UI and has no pending-M0 marker', () => {
    expect(manifest.status).toBeUndefined()
    expect(manifest.dependencies?.['@chameleon-ui/primitives']).toBe('workspace:*')
    expect(manifest.dependencies?.['@ark-ui/react']).toBeUndefined()
    expect(manifest.dependencies?.['@base-ui/react']).toBeUndefined()
  })
})
