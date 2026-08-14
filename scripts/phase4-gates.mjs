import { access, readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function fail(message) {
  console.error(`phase4:gates failed: ${message}`)
  process.exitCode = 1
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

async function checkAdapterDemo() {
  const demoDir = join(root, 'packages/adapter-mcp-apps/demo')
  const required = ['README.md', 'form-submit.mcp-apps.json', 'form-submit.html']
  for (const name of required) {
    if (!(await exists(join(demoDir, name)))) fail(`MCP Apps demo missing ${name}`)
  }
  const doc = JSON.parse(await readFile(join(demoDir, 'form-submit.mcp-apps.json'), 'utf8'))
  if (doc.kind !== 'mcp-apps') fail('MCP Apps demo document is not kind=mcp-apps')
  if (!String(doc.uri).startsWith('ui://')) fail('MCP Apps demo URI must use ui://')
  const html = await readFile(join(demoDir, 'form-submit.html'), 'utf8')
  if (!html.includes('data-cu-poc="mcp-apps"')) fail('MCP Apps demo HTML missing POC marker')
  if (/status\s*=\s*["']certified["']/i.test(html)) fail('MCP Apps demo must not claim certified')
  console.log('[P4 ok] adapter-mcp-apps demo form-submit present')
}

async function checkVpatDraft() {
  const mdPath = join(root, 'apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md')
  const pdfNamed = join(root, 'apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.pdf.md')
  for (const file of [mdPath, pdfNamed]) {
    if (!(await exists(file))) fail(`VPAT draft missing ${file}`)
  }
  const text = await readFile(mdPath, 'utf8')
  if (!/status\s*=\s*draft/i.test(text) && !/\*\*status\*\*\s*=\s*`?draft`?/i.test(text)) {
    fail('VPAT must declare status=draft')
  }
  if (/\bcertified\b/i.test(text) && !/not certified/i.test(text)) {
    fail('VPAT draft must not present itself as certified')
  }
  if (/\blegally signed\b/i.test(text) && !/not legally signed/i.test(text)) {
    fail('VPAT draft must not present itself as legally signed')
  }
  console.log('[P4 ok] VPAT draft artifacts present (status=draft)')
}

async function checkLocaleSkeletons() {
  const catalog = JSON.parse(await readFile(join(root, 'packages/components/catalog.json'), 'utf8'))
  const localesDir = join(root, 'apps/docs/src/locales')
  const missing = []
  for (const locale of catalog.locales) {
    if (!(await exists(join(localesDir, `${locale}.json`)))) missing.push(locale)
  }
  if (missing.length) fail(`docs chrome locales missing: ${missing.join(', ')}`)
  const gap = join(root, 'apps/docs/static/compliance/locale-gap-table.json')
  if (!(await exists(gap))) fail('locale gap table missing')
  const table = JSON.parse(await readFile(gap, 'utf8'))
  if (!table.gapCount) fail('gap table unexpectedly empty; marketing/skeletons must remain LEGACY')
  console.log(`[P4 ok] 21 chrome locale files; gap table rows=${table.gapCount}`)
}

async function checkDashboardAndHandover() {
  const files = [
    join(root, 'apps/docs/src/components/Dashboard.tsx'),
    join(root, '..', 'docs/project/handover/建设期移交说明书.md'),
    join(root, '..', 'docs/project/reports/M4-v2.0建设收口.md'),
    join(root, '..', 'docs/project/reports/Phase-4-全量性能与a11y审计.md'),
    join(root, 'PHASE4.md'),
  ]
  for (const file of files) {
    if (!(await exists(file))) fail(`missing ${file}`)
  }
  const pages = await readFile(join(root, 'apps/docs/src/components/Dashboard.tsx'), 'utf8')
  if (!pages.includes('Dashboard') || !pages.includes('bench.')) {
    fail('docs dashboard must consume bench.* ids')
  }
  if (/telemetry\.[a-z_]+_v2/.test(pages)) fail('dashboard must not invent new telemetry event names')
  const handover = await readFile(join(root, '..', 'docs/project/handover/建设期移交说明书.md'), 'utf8')
  if (!handover.includes('待指定')) fail('handover ops recipient must be 待指定')
  const audit = await readFile(join(root, '..', 'docs/project/reports/Phase-4-全量性能与a11y审计.md'), 'utf8')
  for (const id of ['LEGACY-2026-001', 'LEGACY-2026-002', 'LEGACY-2026-003']) {
    if (!audit.includes(id)) fail(`audit report missing ${id} for unmeasured R*`)
  }
  if (/\bLighthouse score\b/i.test(audit) && !/no Lighthouse/i.test(audit)) {
    fail('audit must not invent Lighthouse scores')
  }
  console.log('[P4 ok] dashboard / handover / M4 / audit / PHASE4.md')
}

async function checkL1Boundary() {
  const l1 = ['tokens', 'themes', 'i18n', 'contract', 'primitives']
  for (const name of l1) {
    const pkg = JSON.parse(await readFile(join(root, 'packages', name, 'package.json'), 'utf8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
    if (deps['@chameleon-ui/adapter-mcp-apps']) {
      fail(`L1 package ${name} must not depend on adapter-mcp-apps`)
    }
    if (deps['@chameleon-ui/market-service']) {
      fail(`L1 package ${name} must not depend on market-service`)
    }
  }
  console.log('[P4 ok] adapter-mcp-apps / market-service are not L1 dependencies')
}

async function checkMarketRulesPack() {
  const listingsSrc = await readFile(join(root, 'packages/market-service/src/listings.ts'), 'utf8')
  if (!listingsSrc.includes('community-focus-first')) {
    fail('market-service must seed community-focus-first')
  }
  if (!listingsSrc.includes("type: 'registry:rules'")) {
    fail('market-service must list registry:rules packs')
  }
  const serverSrc = await readFile(join(root, 'packages/market-service/src/server.ts'), 'utf8')
  if (!serverSrc.includes('createInstallKernel')) {
    fail('market-service install must call install-core')
  }
  if (!serverSrc.includes("source: 'market'")) {
    fail('market-service install source must be market')
  }
  if (!serverSrc.includes('guardPaidListingInstall')) {
    fail('market-service must keep official homage listings free (not paid SKUs)')
  }
  const packDir = join(root, 'packages/themes/src/community-focus-first')
  for (const name of ['design-rules.json', 'meta.json', 'tokens.json']) {
    if (!(await exists(join(packDir, name)))) fail(`community-focus-first missing ${name}`)
  }
  console.log('[P4 ok] market lists/installs community-focus-first via install-core')
}

async function main() {
  console.log('\n[phase4:gates] docs locale skeletons + gap table')
  await runPnpm(['--filter', '@chameleon-ui/docs', 'run', 'locales:skeleton'])
  if (process.exitCode) return

  console.log('\n[phase4:gates] @chameleon-ui/adapter-mcp-apps test')
  await runPnpm(['--filter', '@chameleon-ui/adapter-mcp-apps', 'test'])
  if (process.exitCode) return

  console.log('\n[phase4:gates] @chameleon-ui/market-service test')
  await runPnpm(['--filter', '@chameleon-ui/market-service', 'test'])
  if (process.exitCode) return

  console.log('\n[phase4:gates] rules pack tests (install-core + registry)')
  await runPnpm([
    '--filter',
    '@chameleon-ui/install-core',
    'test',
    '--',
    'src/__tests__/rules-pack.test.ts',
  ])
  if (process.exitCode) return
  await runPnpm([
    '--filter',
    '@chameleon-ui/registry',
    'test',
    '--',
    'src/__tests__/rules-pack.test.ts',
  ])
  if (process.exitCode) return

  await checkAdapterDemo()
  await checkVpatDraft()
  await checkLocaleSkeletons()
  await checkDashboardAndHandover()
  await checkL1Boundary()
  await checkMarketRulesPack()

  if (process.exitCode) return

  console.log(
    JSON.stringify(
      {
        ok: true,
        gates: [
          'adapter-mcp-apps',
          'mcp-apps-demo',
          'market-service',
          'install-core-rules',
          'registry-rules',
          'market-community-focus-first',
          'vpat-draft',
          'docs-21-locale-skeleton',
          'locale-gap-table',
          'dashboard',
          'handover',
          'audit-legacy-r1-r3',
          'm4-report',
          'l1-boundary',
        ],
        note: 'Phase 4 engineering gates. Includes ci:phase3 only when invoked via ci:phase4. Not Lighthouse, not VPAT certified, not npm publish, not 80% blind-test.',
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
