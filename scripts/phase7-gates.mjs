/**
 * phase7:gates — 场景 Blocks 门禁（A7.1–A7.5 工程可测部分）。
 *
 * Fails when:
 * - packages/blocks is missing any of the twelve §7.3 slugs
 * - registry sync --check drifts (registry:block entries)
 * - manifest.dependencies ≠ imported @chameleon-ui/components slugs
 * - Block install via install-core is non-idempotent
 * - §7.4 matrix is not 17/17 with honest LEGACY rows
 * - locale-gap-table / skeleton discipline is missing
 * - blocks package lint/test fails
 * - bench.block_install_success_rate is absent from the metric dictionary
 *
 * Does not: npm publish, claim 21-language Blocks, invent device-frame / 3D twin coverage,
 * or sign freeze meetings.
 */
import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const BLOCK_SLUGS = [
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

function fail(message) {
  console.error(`phase7:gates failed: ${message}`)
  process.exitCode = 1
}

function ok(message) {
  console.log(`[P7 ok] ${message}`)
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
  console.log(`\n[phase7:gates] ${label}`)
  await fn()
  if (process.exitCode) throw new Error(`${label} failed`)
}

function pascalToSlug(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function importedComponents(source) {
  const names = [...source.matchAll(/import\s+\{([^}]+)\}\s+from\s+'@chameleon-ui\/components'/g)].flatMap(
    (match) =>
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

async function checkTreeAndManifest() {
  const blocksRoot = join(root, 'packages/blocks/src')
  for (const slug of BLOCK_SLUGS) {
    const dir = join(blocksRoot, slug)
    if (!(await exists(dir))) fail(`missing block ${slug}`)
    if (!(await exists(join(dir, 'manifest.json')))) fail(`${slug} missing manifest.json`)
    if (!(await exists(join(dir, 'contract.json')))) fail(`${slug} missing contract.json`)
    if (!(await exists(join(dir, 'styles.css')))) fail(`${slug} missing styles.css`)
    const fileName = slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
    const sourcePath = join(dir, `${fileName}.tsx`)
    if (!(await exists(sourcePath))) fail(`${slug} missing ${fileName}.tsx`)
    const manifest = JSON.parse(await readFile(join(dir, 'manifest.json'), 'utf8'))
    if (manifest.type !== 'registry:block') fail(`${slug} type is ${manifest.type}`)
    if (manifest.slug !== slug) fail(`${slug} manifest.slug mismatch`)
    if (!manifest.rtl) fail(`${slug} must declare rtl: true`)
    const source = await readFile(sourcePath, 'utf8')
    const imported = importedComponents(source)
    const deps = [...(manifest.dependencies ?? [])].sort()
    if (JSON.stringify(deps) !== JSON.stringify(imported)) {
      fail(`${slug} manifest deps drift: manifest=${deps.join(',')} imports=${imported.join(',')}`)
    }
  }
  ok(`twelve blocks present; manifest ↔ import drift check green`)
}

async function checkGapTable() {
  const gapPath = join(root, 'packages/blocks/locale-gap-table.json')
  if (!(await exists(gapPath))) return fail('missing packages/blocks/locale-gap-table.json')
  const gap = JSON.parse(await readFile(gapPath, 'utf8'))
  if (!Array.isArray(gap.authored) || gap.authored.join() !== 'en,zh-CN,zh-HK') {
    return fail('locale-gap-table.authored must be [en, zh-CN, zh-HK]')
  }
  if (!Array.isArray(gap.skeleton) || gap.skeleton.length !== 18) {
    return fail('locale-gap-table.skeleton must list 18 locales')
  }
  if (!(await exists(join(root, 'packages/blocks/GAPS.md')))) {
    return fail('missing packages/blocks/GAPS.md (kanban/gantt honesty notes)')
  }
  ok('locale gap table + GAPS.md present (no 21-language claim)')
}

async function checkMatrix() {
  const matrixPath = join(root, 'packages/blocks/scenario-matrix.json')
  if (!(await exists(matrixPath))) return fail('missing packages/blocks/scenario-matrix.json')
  const matrix = JSON.parse(await readFile(matrixPath, 'utf8'))
  const rows = matrix.rows ?? []
  if (rows.length !== 17) return fail(`matrix rows = ${rows.length}, expected 17`)
  for (const row of rows) {
    if (!row.scene || !row.coverage) return fail(`matrix row ${row.id} missing scene/coverage`)
    const hasSlugs = Array.isArray(row.slugs) && row.slugs.length > 0
    const hasLegacy = typeof row.legacy === 'string' && row.legacy.startsWith('LEGACY-')
    if (!hasSlugs && !hasLegacy) {
      return fail(`matrix row ${row.id} has neither slugs nor LEGACY-*`)
    }
    if (!hasSlugs && !hasLegacy) {
      return fail(`empty forged row ${row.id}`)
    }
  }
  const legacyIds = rows.filter((row) => row.legacy).map((row) => row.legacy)
  if (!legacyIds.includes('LEGACY-2026-018')) fail('digital-twin row must keep LEGACY-2026-018')
  if (!legacyIds.includes('LEGACY-2026-019')) fail('product-prototype row must keep LEGACY-2026-019')
  ok(`§7.4 matrix 17/17; LEGACY rows=${legacyIds.join(', ')}`)
}

async function checkRegistrySync() {
  await runNode([join(root, 'packages/registry/scripts/sync-catalog.mjs'), '--check'])
  ok('registry sync --check (components + blocks + themes + rules)')
}

async function checkBlockInstall() {
  // Load dist registry + install-core from workspace packages after build.
  await runPnpm(['--filter', '@chameleon-ui/install-core', 'build'])
  await runPnpm(['--filter', '@chameleon-ui/registry', 'build'])

  const { createInstallKernel } = await import(pathToFileURL(join(root, 'packages/install-core/dist/index.js')).href)
  const { listBlocks, registry } = await import(pathToFileURL(join(root, 'packages/registry/dist/index.js')).href)

  const blocks = listBlocks()
  if (blocks.length !== BLOCK_SLUGS.length) {
    return fail(`listBlocks() returned ${blocks.length}, expected ${BLOCK_SLUGS.length}`)
  }
  const kernel = createInstallKernel(registry)
  for (const item of blocks) {
    const dir = await mkdtemp(join(tmpdir(), `cu-p7-${item.id}-`))
    try {
      const first = await kernel.install(item, dir, { source: 'cli' })
      if (!first.installed.includes(item.id)) fail(`${item.id} first install missing id`)
      const second = await kernel.install(item, dir, { source: 'cli' })
      if (second.written.length !== 0 || second.skipped.length === 0) {
        fail(`${item.id} second install not idempotent (written=${second.written.length}, skipped=${second.skipped.length})`)
      }
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  }
  ok(`installed ${blocks.length} blocks via install-core; second pass written=0 / skipped>0`)
}

async function checkBenchMetricId() {
  const idsSource = await readFile(join(root, 'benchmarks/genui-bench/src/ids.ts'), 'utf8')
  if (!idsSource.includes("'bench.block_install_success_rate'")) {
    return fail('bench.block_install_success_rate missing from BENCH_METRIC_IDS')
  }
  ok('bench.block_install_success_rate registered in metric dictionary')
}

async function checkVrSpec() {
  const spec = join(root, 'toolings/visual-regression/tests/p7-blocks.spec.ts')
  if (!(await exists(spec))) return fail('missing p7-blocks.spec.ts')
  ok('p7 blocks VR spec present (Playwright executes with demo preview)')
}

async function main() {
  await step('twelve blocks + manifest drift', checkTreeAndManifest)
  await step('locale gap + GAPS.md', checkGapTable)
  await step('§7.4 scenario matrix 17/17', checkMatrix)
  await step('registry:block sync --check', checkRegistrySync)
  await step('install-core block install + idempotency', checkBlockInstall)
  await step('blocks package lint + test', async () => {
    await runPnpm(['--filter', '@chameleon-ui/blocks', 'lint'])
    await runPnpm(['--filter', '@chameleon-ui/blocks', 'test'])
    ok('blocks lint + test green')
  })
  await step('install-core block graph unit test', async () => {
    await runPnpm(['--filter', '@chameleon-ui/install-core', 'test'])
    ok('install-core tests green')
  })
  await step('bench metric id', checkBenchMetricId)
  await step('VR spec file', checkVrSpec)

  if (!(await exists(join(root, '../docs/project/reports/M7-场景Blocks验收.md')))) {
    fail('missing docs/project/reports/M7-场景Blocks验收.md')
  } else {
    ok('M7 report present')
  }

  console.log(
    JSON.stringify(
      {
        ok: !process.exitCode,
        gates: [
          'blocks-x12',
          'manifest-import-drift',
          'locale-gap-table',
          'scenario-matrix-17',
          'registry-block-sync',
          'install-core-idempotent',
          'blocks-lint-test',
          'bench.block_install_success_rate-id',
          'p7-vr-spec',
          'm7-report',
        ],
        skipped: [
          'npm-publish (user: npm 先不上架)',
          'blocks-market-trading (ops era)',
          'kanban-custom-drag-engine (native HTML5 DnD only; GAPS.md)',
          'gantt-canvas-virtualization (ticks+today marker; GAPS.md)',
          'device-frame-block (LEGACY-2026-019)',
          'digital-twin-3d (LEGACY-2026-018)',
          '21-language-blocks-claim (skeletons only)',
        ],
        note: 'ci:phase7 = ci:phase6 + phase7:gates',
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
