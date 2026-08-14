/**
 * phase5:gates — 三端内核工程门禁（轨道卡 A5.7）。
 *
 * Fails when:
 * - tokens tests fail
 * - variables.css missing --cu-breakpoint-* / --cu-density-* / typography clamp / touch-target
 * - density.css missing active-var switching
 * - apps that consume tokens/css do not import density.css
 * - stylelint chameleon/no-breakpoint-literal fails on component CSS
 * - touch-target token floor computes below 44px @ 16px root
 * - A5.3 / T5.8 spec files are missing
 *
 * Playwright for those specs runs in phase1:gates (`visual-regression test:playwright`),
 * not duplicated here. Does not invent Lighthouse numbers.
 */
import { access, readFile, readdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(root, '..')

const REQUIRED_VARS = [
  '--cu-breakpoint-mobile',
  '--cu-breakpoint-tablet',
  '--cu-breakpoint-desktop',
  '--cu-density-compact',
  '--cu-density-standard',
  '--cu-density-comfortable',
  '--cu-density-active',
  '--cu-control-size-compact',
  '--cu-control-size-standard',
  '--cu-control-size-comfortable',
  '--cu-control-size-active',
  '--cu-touch-target-min',
  '--cu-typography-size-body',
  '--cu-typography-size-heading-1',
]

const REQUIRED_DENSITY_IMPORT_APPS = [
  'apps/docs/src/theme/Root.tsx',
  'apps/internal-demo/src/main.tsx',
  'apps/theme-studio/src/main.tsx',
  'apps/market/src/main.tsx',
]

function fail(message) {
  console.error(`phase5:gates failed: ${message}`)
  process.exitCode = 1
}

function ok(message) {
  console.log(`[P5 ok] ${message}`)
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
  console.log(`\n[phase5:gates] ${label}`)
  await fn()
  if (process.exitCode) throw new Error(`${label} failed`)
}

async function collectFiles(directory, predicate) {
  const files = []
  if (!(await exists(directory))) return files
  const entries = await readdir(directory, { withFileTypes: true, recursive: true })
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const full = join(entry.parentPath ?? directory, entry.name)
    const rel = relative(root, full).replaceAll('\\', '/')
    if (rel.includes('node_modules/') || rel.includes('/dist/')) continue
    if (predicate(rel, entry.name)) files.push(full)
  }
  return files.sort((a, b) => a.localeCompare(b, 'en'))
}

async function checkTokenArtifacts() {
  const variablesPath = join(root, 'packages/tokens/dist/css/variables.css')
  const densityPath = join(root, 'packages/tokens/dist/css/density.css')
  if (!(await exists(variablesPath))) fail('missing packages/tokens/dist/css/variables.css')
  if (!(await exists(densityPath))) fail('missing packages/tokens/dist/css/density.css')
  if (process.exitCode) return

  const variables = await readFile(variablesPath, 'utf8')
  const density = await readFile(densityPath, 'utf8')
  const missing = REQUIRED_VARS.filter((name) => !variables.includes(`${name}:`))
  if (missing.length) fail(`variables.css missing ${missing.join(', ')}`)

  if (!variables.includes('clamp(')) fail('variables.css missing fluid clamp() typography')
  if (!variables.includes('--cu-touch-target-min: 2.75rem')) {
    fail('variables.css --cu-touch-target-min must be 2.75rem')
  }

  for (const needle of [
    '--cu-density-active:',
    '--cu-control-size-active:',
    "[data-density='compact']",
    "[data-density='standard']",
    "[data-density='comfortable']",
    '@media (max-width: 47.99rem)',
    '@media (min-width: 80rem)',
  ]) {
    if (!density.includes(needle)) fail(`density.css missing ${needle}`)
  }
  ok('breakpoint / density / typography / touch-target artifacts present')
}

async function checkDensityImports() {
  for (const rel of REQUIRED_DENSITY_IMPORT_APPS) {
    const file = join(root, rel)
    if (!(await exists(file))) {
      fail(`missing required app entry ${rel}`)
      continue
    }
    const text = await readFile(file, 'utf8')
    if (!text.includes("@chameleon-ui/tokens/density.css")) {
      fail(`${rel} must import @chameleon-ui/tokens/density.css`)
    }
    if (!text.includes("@chameleon-ui/tokens/css")) {
      fail(`${rel} must import @chameleon-ui/tokens/css`)
    }
  }

  const sourceFiles = await collectFiles(root, (rel, name) =>
    /\.(tsx|ts|jsx|js|vue|css)$/.test(name) &&
    (rel.startsWith('apps/') || rel.startsWith('poc/') || rel.startsWith('packages/')),
  )

  const offenders = []
  for (const file of sourceFiles) {
    const text = await readFile(file, 'utf8')
    const consumesVariables =
      text.includes("@chameleon-ui/tokens/css") &&
      !text.includes("@chameleon-ui/tokens/css/")
    if (!consumesVariables) continue
    if (!text.includes("@chameleon-ui/tokens/density.css")) {
      offenders.push(relative(root, file).replaceAll('\\', '/'))
    }
  }
  if (offenders.length) {
    fail(`density.css not imported next to tokens/css: ${offenders.join(', ')}`)
  } else {
    ok(`density.css imported by required apps and every tokens/css consumer (${REQUIRED_DENSITY_IMPORT_APPS.length} apps + scan)`)
  }
}

async function checkStylelintBreakpointLiteral() {
  await runNode([
    join(root, 'toolings/stylelint-config/scripts/lint-css.mjs'),
    './packages/components/**/*.css',
    './packages/components-vue/**/*.css',
  ])
  ok('chameleon/no-breakpoint-literal clean on components CSS')
}

async function checkTouchTargetLog() {
  await runNode([join(root, 'scripts/measure-touch-targets.mjs')])
  const md = join(repoRoot, 'docs/project/reports/Phase-5-触控目标测量.md')
  const json = join(repoRoot, 'docs/project/reports/Phase-5-触控目标测量.json')
  if (!(await exists(md))) fail('touch-target measurement markdown missing')
  if (!(await exists(json))) fail('touch-target measurement json missing')
  if (process.exitCode) return
  const record = JSON.parse(await readFile(json, 'utf8'))
  if (record.lighthouse) fail('touch-target log must not claim Lighthouse')
  if (record.tokens.touchTargetMinPx < 44) {
    fail(`touch-target floor ${record.tokens.touchTargetMinPx}px < 44px`)
  }
  if (record.coverage.scanned < record.coverage.listed) {
    fail(`touch-target list coverage ${record.coverage.scanned}/${record.coverage.listed}`)
  }
  ok(`touch-target token floor ${record.tokens.touchTargetMinPx}px; list ${record.coverage.scanned}/${record.coverage.listed}`)
}

async function checkContainerDrivenSpecs() {
  const required = [
    'packages/components/src/test/container-driven.test.tsx',
    'toolings/visual-regression/tests/container-driven.spec.ts',
    'toolings/visual-regression/tests/p5-whitelist-morph.spec.ts',
    'toolings/visual-regression/tests/safe-area.spec.ts',
  ]
  for (const rel of required) {
    if (!(await exists(join(root, rel)))) fail(`missing ${rel}`)
  }
  ok('A5.3 / T5.8 / A5.4 spec files present (Playwright executes them in phase1:gates)')
}

async function main() {
  await step('token compiler tests', async () => {
    await runPnpm(['--filter', '@chameleon-ui/tokens', 'test'])
  })
  if (process.exitCode) return

  await step('token build', async () => {
    await runPnpm(['--filter', '@chameleon-ui/tokens', 'build'])
  })
  if (process.exitCode) return

  await step('token artifacts', checkTokenArtifacts)
  if (process.exitCode) return

  await step('density.css app imports', checkDensityImports)
  if (process.exitCode) return

  await step('stylelint no-breakpoint-literal', checkStylelintBreakpointLiteral)
  if (process.exitCode) return

  await step('touch-target measurement log', checkTouchTargetLog)
  if (process.exitCode) return

  await step('container-driven / morph spec files', checkContainerDrivenSpecs)
  if (process.exitCode) return

  console.log(
    JSON.stringify(
      {
        ok: true,
        gates: [
          'tokens-test',
          'breakpoint-density-typography-vars',
          'density-css-switching',
          'density-css-app-import-scan',
          'stylelint-no-breakpoint-literal',
          'touch-target-token-floor-44px',
          'container-driven-spec-files',
        ],
        skipped: [
          'playwright-container-driven (runs in phase1:gates visual-regression)',
          'lighthouse-r1-r3 (LEGACY-2026-001…003)',
        ],
        note: 'Phase 5 infrastructure gates. ci:phase5 = ci:phase4 + phase5:gates. No Lighthouse. design-rules v1.1 unsigned (owner 待指定).',
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
