/**
 * After the Vite barrel + vue-tsc declarations, emit per-slug JS that matches
 * React's `@chameleon-ui/components/<slug>` consume path.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const dist = join(root, 'dist')

function valueExports(source) {
  const names = []
  for (const block of source.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of block[1].split(',')) {
      const trimmed = part.trim()
      if (!trimmed || trimmed.startsWith('type ')) continue
      const aliased = trimmed.match(/^(?:default\s+as\s+)?(\w+)$/)
      if (aliased) {
        names.push(aliased[1])
        continue
      }
      const renamed = trimmed.match(/^\w+\s+as\s+(\w+)$/)
      if (renamed) names.push(renamed[1])
    }
  }
  return [...new Set(names)]
}

function typeExports(source) {
  const names = []
  for (const block of source.matchAll(/export\s+type\s+\{([^}]+)\}/g)) {
    for (const part of block[1].split(',')) {
      const trimmed = part.trim()
      if (!trimmed) continue
      const renamed = trimmed.match(/^(?:\w+\s+as\s+)?(\w+)$/)
      if (renamed) names.push(renamed[1])
    }
  }
  return [...new Set(names)]
}

const slugs = readdirSync(src, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => {
    try {
      readFileSync(join(src, name, 'index.ts'), 'utf8')
      return true
    } catch {
      return false
    }
  })

for (const slug of slugs) {
  const source = readFileSync(join(src, slug, 'index.ts'), 'utf8')
  const values = valueExports(source)
  const types = typeExports(source)
  if (values.length === 0 && types.length === 0) continue
  const jsLines = []
  const dtsLines = []
  if (values.length > 0) {
    const list = values.join(', ')
    jsLines.push(`export { ${list} } from '../index.js'`)
    dtsLines.push(`export { ${list} } from '../index.js'`)
  }
  if (types.length > 0) {
    dtsLines.push(`export type { ${types.join(', ')} } from '../index.js'`)
  }
  mkdirSync(join(dist, slug), { recursive: true })
  writeFileSync(join(dist, slug, 'index.js'), `${jsLines.join('\n')}\n`)
  writeFileSync(join(dist, slug, 'index.d.ts'), `${dtsLines.join('\n')}\n`)
}

console.log(`[components-vue] emitted ${slugs.length} per-slug exports`)
