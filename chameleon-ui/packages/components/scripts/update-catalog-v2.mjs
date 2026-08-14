import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SPECS } from './scaffold-phase6.mjs'

/**
 * Catalog v2.0 (Phase 6): register every on-disk slug that already has
 * contract.json + 21 locales + tests. Backfills family on the frozen 50 and
 * the P5 four. Rewrites src/index.ts from per-slug barrels. Idempotent.
 *
 * Does not invent A/B slugs (space/container/masonry/navbar/steps/command-palette)
 * that are not on disk. Freeze-meeting sign-off remains owner=待指定.
 */

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(packageRoot, 'catalog.json')
const srcRoot = path.join(packageRoot, 'src')

/** Proposed family mapping for pre-P6 slugs (pending freeze-meeting sign-off). */
const FAMILY_BACKFILL = {
  A: ['app-shell', 'divider', 'grid', 'separator', 'stack', 'safe-area'],
  B: ['breadcrumb', 'link', 'menu', 'pagination', 'tabs', 'tab-bar', 'sidebar'],
  C: [
    'button',
    'checkbox',
    'combobox',
    'file-input',
    'form',
    'input',
    'label',
    'number-input',
    'radio',
    'radio-card',
    'select',
    'slider',
    'switch',
    'textarea',
  ],
  D: [
    'accordion',
    'avatar',
    'badge',
    'card',
    'chip',
    'collapse',
    'description-list',
    'empty-state',
    'heading',
    'icon',
    'kbd',
    'list',
    'table',
    'typography',
  ],
  E: [
    'alert',
    'dialog',
    'drawer',
    'hover-card',
    'inline-alert',
    'popover',
    'progress',
    'sheet',
    'skeleton',
    'spinner',
    'toast',
    'tooltip',
    'action-sheet',
  ],
}

const specBySlug = new Map(SPECS.map((spec) => [spec.slug, spec]))

function familyOf(slug) {
  const spec = specBySlug.get(slug)
  if (spec?.family) return spec.family
  for (const [family, slugs] of Object.entries(FAMILY_BACKFILL)) {
    if (slugs.includes(slug)) return family
  }
  return undefined
}

function pascalName(slug) {
  return slug
    .split('-')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join('')
}

async function hasTestFile(directory) {
  const entries = await readdir(directory)
  return entries.some((name) => /\.test\.(ts|tsx)$/.test(name))
}

async function localeSet(directory) {
  try {
    const entries = await readdir(path.join(directory, 'locales'))
    return new Set(entries.filter((name) => name.endsWith('.json')).map((name) => name.replace(/\.json$/, '')))
  } catch {
    return new Set()
  }
}

/**
 * A slug is catalog-eligible when the standard Phase 1 folder is complete.
 * @complexity time O(d) | space O(l) | d = dirents, l = locales
 */
async function eligibleSlugs(requiredLocales) {
  const dirents = await readdir(srcRoot, { withFileTypes: true })
  const found = []
  const skipped = []
  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue
    const slug = dirent.name
    if (slug === 'test' || slug.startsWith('.')) continue
    const directory = path.join(srcRoot, slug)
    const contractPath = path.join(directory, 'contract.json')
    let contract
    try {
      contract = JSON.parse(await readFile(contractPath, 'utf8'))
    } catch {
      skipped.push(`${slug}: no contract.json`)
      continue
    }
    if (!(await hasTestFile(directory))) {
      skipped.push(`${slug}: no *.test.ts(x)`)
      continue
    }
    const locales = await localeSet(directory)
    const missing = requiredLocales.filter((locale) => !locales.has(locale))
    if (missing.length > 0) {
      skipped.push(`${slug}: missing locales ${missing.join(',')}`)
      continue
    }
    found.push({ slug, contract })
  }
  found.sort((a, b) => a.slug.localeCompare(b.slug, 'en'))
  return { found, skipped }
}

function rewritePackageExport(line, slug) {
  return line.replace(/from ['"][^'"]+['"]/, `from './${slug}/index.js'`)
}

async function generateBarrel(slugs) {
  const lines = []
  for (const slug of slugs) {
    const source = await readFile(path.join(srcRoot, slug, 'index.ts'), 'utf8')
    const exportLines = source
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.startsWith('export '))
      .map((line) => rewritePackageExport(line, slug))
    if (exportLines.length === 0) {
      throw new Error(`catalog-v2: ${slug}/index.ts has no export lines`)
    }
    lines.push(...exportLines)
  }
  await writeFile(path.join(srcRoot, 'index.ts'), `${lines.join('\n')}\n`, 'utf8')
}

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const { found, skipped } = await eligibleSlugs(catalog.locales)

for (const component of catalog.components) {
  if (!component.family) {
    const family = familyOf(component.slug)
    if (!family) throw new Error(`No family mapping for existing slug: ${component.slug}`)
    component.family = family
  }
}

const existing = new Set(catalog.components.map((component) => component.slug))
let nextNumber = Math.max(...catalog.components.map((component) => component.n)) + 1
const added = []

for (const { slug, contract } of found) {
  if (existing.has(slug)) continue
  const spec = specBySlug.get(slug)
  const family = spec?.family ?? contract.family ?? familyOf(slug)
  if (!family) throw new Error(`No family mapping for on-disk slug: ${slug}`)
  catalog.components.push({
    n: nextNumber,
    slug,
    name: spec?.name ?? contract.name ?? pascalName(slug),
    tier: spec?.tier ?? 'base',
    family,
    implementation: 'complete',
    requirement: spec?.purpose ?? contract.purpose ?? `Phase 6 addition: ${slug}.`,
  })
  added.push(slug)
  nextNumber += 1
}

catalog.schemaVersion = '2.0'
catalog.$comment =
  'Phase 6 component catalog (v2.0). Repo SSOT for the component list, family mapping, and the S5 common-10 suite. Replacement of any slug requires a dated change note in changeLog. A/B named gaps (space, container, masonry, navbar, steps, command-palette) are not on disk and are not registered. Freeze-meeting sign-off remains owner=待指定.'

if (added.length > 0) {
  catalog.changeLog.push({
    date: '2026-08-13',
    phase: 'P6',
    action: 'add',
    slugs: added,
    note: 'Phase 6 breadth additions present on disk (contract + 21 locales + tests). F/G/H plus C/D/E named gaps. A/B family additions are not on disk. Not a freeze-meeting signature.',
  })
}
if (!catalog.changeLog.some((entry) => entry.action === 'family-backfill')) {
  catalog.changeLog.push({
    date: '2026-08-13',
    phase: 'P6',
    action: 'family-backfill',
    slugs: catalog.components.filter((component) => component.n <= 54).map((component) => component.slug),
    note: 'Backfilled family (A-E, plus P5 safe-area/tab-bar/sidebar/action-sheet) on the frozen 50+P5 four per Phase 6 naming rules; mapping is a proposal pending freeze-meeting sign-off.',
  })
}

await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
await generateBarrel(catalog.components.map((component) => component.slug).sort((a, b) => a.localeCompare(b, 'en')))

console.log(
  `[catalog-v2] components: ${catalog.components.length}; added this run: ${added.length}${
    skipped.length ? `; skipped ineligible: ${skipped.join(' | ')}` : ''
  }`,
)
