import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export interface CatalogComponentEntry {
  slug: string
  name: string
  family?: string
}

export interface CatalogDocument {
  components: CatalogComponentEntry[]
  s5Suite?: {
    common10?: string[]
    appShell?: string
  }
}

function loadCatalog(): CatalogDocument {
  const path = require.resolve('@chameleon-ui/components-react/catalog.json')
  return JSON.parse(readFileSync(path, 'utf8')) as CatalogDocument
}

/** Family → slug list from packages/components-react/catalog.json (SSOT). */
export function listComponentsByFamily(): {
  total: number
  families: Array<{ family: string; slugs: string[] }>
  components: Array<{ slug: string; name: string; family: string }>
} {
  const catalog = loadCatalog()
  const byFamily = new Map<string, string[]>()
  const components: Array<{ slug: string; name: string; family: string }> = []

  for (const entry of catalog.components ?? []) {
    const family = entry.family?.trim() || 'unknown'
    const slugs = byFamily.get(family) ?? []
    slugs.push(entry.slug)
    byFamily.set(family, slugs)
    components.push({ slug: entry.slug, name: entry.name, family })
  }

  const families = [...byFamily.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([family, slugs]) => ({ family, slugs: [...slugs].sort() }))

  return {
    total: components.length,
    families,
    components,
  }
}

export function catalogSummaryForAgents() {
  const listed = listComponentsByFamily()
  const catalog = loadCatalog()
  return {
    total: listed.total,
    families: listed.families.map((entry) => ({
      family: entry.family,
      count: entry.slugs.length,
      slugs: entry.slugs,
    })),
    common10: [...(catalog.s5Suite?.common10 ?? [])],
    appShell: catalog.s5Suite?.appShell ?? 'app-shell',
  }
}
