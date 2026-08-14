/**
 * phase6:gates — 组件广度工程门禁（轨道卡 A6.7）。
 *
 * Fails when:
 * - catalog is not schemaVersion 2.0 with 101 unique slugs
 * - a catalog slug is missing family A–H, contract v0.2, 21 locale files, src dir, or index export path
 * - named F/G/H / A补 / B补 slugs are absent
 * - Vue subset is below 20 SFC components, or a second token authority appears
 * - budgets.json is missing F/G rows (S2 + F + G gzip is measured here)
 * - Vue S1 gzip exceeds the S1 ceiling
 * - components / components-vue lint fails
 *
 * Does not: sign freeze/budget/Vue-scope meetings, publish, invent locale quality,
 * or claim R1–R3 / WebGL. Locale files that byte-match `en.json` are reported as
 * skeletons (not a fail).
 */
import { access, readdir, readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(root, '..')
const EXPECTED_SLUGS = 101
const FAMILIES = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
const REQUIRED_F = ['chart', 'kpi-dashboard', 'ticker', 'sparkline', 'heatmap', 'gauge']
const REQUIRED_G = [
  'canvas-base',
  'flow-node',
  'edge',
  'mind-map',
  'graph-view',
  'pipeline-view',
  'canvas-toolbar',
]
const REQUIRED_H = [
  'editor',
  'markdown-renderer',
  'comment-thread',
  'chat-bubble',
  'code-block',
  'article-card',
  'share-panel',
]
const REQUIRED_A = ['space', 'container', 'masonry']
const REQUIRED_B = ['navbar', 'steps', 'command-palette']

function fail(message) {
  console.error(`phase6:gates failed: ${message}`)
  process.exitCode = 1
}

function ok(message) {
  console.log(`[P6 ok] ${message}`)
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

function runPnpm(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('corepack', ['pnpm@9.15.0', ...args], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`corepack pnpm@9.15.0 ${args.join(' ')} exited ${code}`))
    })
  })
}

function runNode(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`node ${args.join(' ')} exited ${code}`))
    })
  })
}

async function step(label, fn) {
  console.log(`\n[phase6:gates] ${label}`)
  await fn()
  if (process.exitCode) throw new Error(`${label} failed`)
}

function missingFrom(required, present) {
  return required.filter((slug) => !present.has(slug))
}

async function checkCatalogAndTree() {
  const catalogPath = join(root, 'packages/components/catalog.json')
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
  if (catalog.schemaVersion !== '2.0') fail(`catalog schemaVersion is ${catalog.schemaVersion}, expected 2.0`)

  const components = catalog.components ?? []
  const slugs = components.map((item) => item.slug)
  const unique = new Set(slugs)
  if (unique.size !== EXPECTED_SLUGS) {
    fail(`catalog unique slug count is ${unique.size}, expected ${EXPECTED_SLUGS}`)
  }
  if (slugs.length !== unique.size) fail(`catalog has duplicate slugs (${slugs.length} rows, ${unique.size} unique)`)

  const missingFamily = components.filter((item) => !FAMILIES.has(item.family)).map((item) => item.slug)
  if (missingFamily.length) fail(`catalog slugs missing family A–H: ${missingFamily.join(', ')}`)

  const missing = {
    F: missingFrom(REQUIRED_F, unique),
    G: missingFrom(REQUIRED_G, unique),
    H: missingFrom(REQUIRED_H, unique),
    A: missingFrom(REQUIRED_A, unique),
    B: missingFrom(REQUIRED_B, unique),
  }
  for (const [family, absent] of Object.entries(missing)) {
    if (absent.length) fail(`family ${family} missing slugs: ${absent.join(', ')}`)
  }

  const srcRoot = join(root, 'packages/components/src')
  const indexSource = await readFile(join(srcRoot, 'index.ts'), 'utf8')
  const locales = catalog.locales ?? []
  if (locales.length !== 21) fail(`catalog.locales length is ${locales.length}, expected 21`)

  let skeletonPairs = 0
  const skeletonByLocale = Object.fromEntries(locales.map((locale) => [locale, 0]))

  for (const item of components) {
    const dir = join(srcRoot, item.slug)
    if (!(await exists(dir))) fail(`missing component directory packages/components/src/${item.slug}`)
    if (!(await exists(join(dir, 'index.ts')))) fail(`missing ${item.slug}/index.ts`)
    if (!(await exists(join(dir, 'contract.json')))) fail(`missing ${item.slug}/contract.json`)
    const contract = JSON.parse(await readFile(join(dir, 'contract.json'), 'utf8'))
    if (contract.schemaVersion !== '0.2') {
      fail(`${item.slug} contract schemaVersion is ${contract.schemaVersion}, expected 0.2`)
    }
    if (contract.slug !== item.slug) fail(`${item.slug} contract.slug is ${contract.slug}`)
    if (!indexSource.includes(`./${item.slug}/`)) {
      fail(`packages/components/src/index.ts does not export ./${item.slug}/`)
    }
    const enPath = join(dir, 'locales', 'en.json')
    if (!(await exists(enPath))) fail(`${item.slug} missing locales/en.json`)
    const enText = await readFile(enPath, 'utf8')
    for (const locale of locales) {
      const localePath = join(dir, 'locales', `${locale}.json`)
      if (!(await exists(localePath))) fail(`${item.slug} missing locales/${locale}.json`)
      if (locale === 'en') continue
      const other = await readFile(localePath, 'utf8')
      if (other === enText) {
        skeletonPairs += 1
        skeletonByLocale[locale] += 1
      }
    }
  }

  ok(`catalog v2.0 n=${unique.size}; F/G/H/A补/B补 present; index exports every slug`)
  ok(
    `21 locale files exist for every slug; ${skeletonPairs} files are byte-identical to en.json (skeletons, not claimed translations)`,
  )
  console.log(JSON.stringify({ localeSkeletonsIdenticalToEn: skeletonByLocale }, null, 2))
  return catalog
}

async function checkBudgets(catalog) {
  const budgets = JSON.parse(await readFile(join(root, 'benchmarks/budgets.json'), 'utf8'))
  const s2 = budgets.metrics?.S2
  const familyF = budgets.metrics?.F
  const familyG = budgets.metrics?.G
  if (!s2?.components?.includes('data-grid')) fail('budgets.metrics.S2.components must include data-grid')
  if (!familyF?.components) fail('budgets.metrics.F row missing')
  if (!familyG?.components) fail('budgets.metrics.G row missing')

  const haveF = new Set(familyF.components)
  const haveG = new Set(familyG.components)
  const missingF = missingFrom(REQUIRED_F, haveF)
  const missingG = missingFrom(REQUIRED_G, haveG)
  if (missingF.length) fail(`budgets F row missing ${missingF.join(', ')}`)
  if (missingG.length) fail(`budgets G row missing ${missingG.join(', ')}`)
  if (familyF.limitKbGzip == null) fail('budgets F limitKbGzip missing')
  if (familyG.limitKbGzip == null) fail('budgets G limitKbGzip missing')

  const catalogF = catalog.components.filter((item) => item.family === 'F').map((item) => item.slug).sort()
  const catalogG = catalog.components.filter((item) => item.family === 'G').map((item) => item.slug).sort()
  if (JSON.stringify([...REQUIRED_F].sort()) !== JSON.stringify(catalogF)) {
    fail(`catalog family F ${catalogF.join(',')} !== required ${REQUIRED_F.slice().sort().join(',')}`)
  }
  if (JSON.stringify([...REQUIRED_G].sort()) !== JSON.stringify(catalogG)) {
    fail(`catalog family G ${catalogG.join(',')} !== required ${REQUIRED_G.slice().sort().join(',')}`)
  }
  ok('budgets.json has S2 + F + G rows; F/G slug lists match catalog')
}

async function checkVueSubset() {
  const vueSrc = join(root, 'packages/components-vue/src')
  const entries = await readdir(vueSrc, { withFileTypes: true })
  const vueSlugs = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const files = await readdir(join(vueSrc, entry.name))
    if (files.some((name) => name.endsWith('.vue'))) vueSlugs.push(entry.name)
  }
  if (vueSlugs.length < 20) fail(`Vue SFC count is ${vueSlugs.length}, expected ≥20`)

  const vueIndex = await readFile(join(vueSrc, 'index.ts'), 'utf8')
  for (const slug of vueSlugs) {
    if (!vueIndex.includes(`./${slug}/`)) fail(`components-vue index does not export ./${slug}/`)
  }

  const offenders = []
  async function walk(directory) {
    const children = await readdir(directory, { withFileTypes: true })
    for (const child of children) {
      const full = join(directory, child.name)
      if (child.isDirectory()) {
        await walk(full)
        continue
      }
      if (!/\.(vue|ts|css)$/.test(child.name) || child.name.includes('.test.')) continue
      const text = await readFile(full, 'utf8')
      if (/(?:from|import)\s+['"]@(?:ark-ui|base-ui)\//.test(text)) {
        offenders.push(`${relative(root, full).replaceAll('\\', '/')} imports ark/base`)
      }
      if (/tokens\.json|color\.json|palette\.json/.test(text) && !text.includes('@chameleon-ui/tokens')) {
        offenders.push(`${relative(root, full).replaceAll('\\', '/')} looks like a second token document`)
      }
    }
  }
  await walk(vueSrc)
  if (offenders.length) fail(`Vue token/primitive boundary: ${offenders.join('; ')}`)

  const pkg = JSON.parse(await readFile(join(root, 'packages/components-vue/package.json'), 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.peerDependencies }
  if (!deps['@chameleon-ui/tokens']) fail('components-vue must depend on @chameleon-ui/tokens')
  if (!deps['@chameleon-ui/primitives-vue']) fail('components-vue must depend on @chameleon-ui/primitives-vue')
  ok(`Vue subset ${vueSlugs.length} SFCs (${vueSlugs.sort().join(', ')}); tokens via @chameleon-ui/tokens`)
}

async function checkSampleSpecs() {
  const required = ['toolings/visual-regression/tests/p6-family-sample.spec.ts']
  for (const rel of required) {
    if (!(await exists(join(root, rel)))) fail(`missing ${rel}`)
  }
  ok('F/G/H sample VR spec file present (Playwright executes it in phase1:gates)')
}

async function main() {
  let catalog
  await step('catalog v2.0 + tree + contract v0.2 + 21 locales + exports', async () => {
    catalog = await checkCatalogAndTree()
  })
  if (process.exitCode) return

  await step('catalog contract schema coverage', async () => {
    await runNode([join(root, 'packages/contract/scripts/validate-catalog-contracts.mjs')])
    ok('validate-catalog-contracts (v0.2) green')
  })
  if (process.exitCode) return

  await step('budgets F/G/S2 rows', async () => {
    await checkBudgets(catalog)
  })
  if (process.exitCode) return

  await step('S2 + F + G gzip (measured, not invented)', async () => {
    await runNode([join(root, 'benchmarks/scripts/check-size.mjs'), '--only=S2,F,G'])
    ok('S2/F/G size gate green')
  })
  if (process.exitCode) return

  await step('Vue ≥20 + token boundary', checkVueSubset)
  if (process.exitCode) return

  await step('Vue S1 gzip (same ceiling as React S1, peers external)', async () => {
    await runNode([join(root, 'benchmarks/scripts/check-vue-size.mjs')])
    ok('Vue S1 size gate green')
  })
  if (process.exitCode) return

  await step('lint components + components-vue', async () => {
    await runPnpm(['--filter', '@chameleon-ui/components', 'lint'])
    await runPnpm(['--filter', '@chameleon-ui/components-vue', 'lint'])
    ok('components and components-vue lint green')
  })
  if (process.exitCode) return

  await step('F/G/H sample VR spec file', checkSampleSpecs)
  if (process.exitCode) return

  console.log(
    JSON.stringify(
      {
        ok: true,
        gates: [
          'catalog-v2.0-101-slugs',
          'family-map-A-H',
          'contract-v0.2',
          'locales-21-present',
          'index-exports',
          'F6-G7-H7-A3-B3',
          'budgets-S2-F-G',
          'gzip-S2-F-G',
          'vue-subset-ge-20',
          'vue-s1-gzip',
          'lint-components-and-vue',
          'p6-family-sample-spec-file',
        ],
        skipped: [
          'catalog-v2.0-freeze-meeting (owner 待指定)',
          'budget-revision-meeting (owner 待指定)',
          'vue-scope-memo (owner 待指定)',
          'locale-translation-quality (skeletons reported, not claimed)',
          'R1-R3',
          'G-WebGL-Worker-LOD',
        ],
        note: 'ci:phase6 = ci:phase5 + phase6:gates. Unsigned meetings stay unsigned.',
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
