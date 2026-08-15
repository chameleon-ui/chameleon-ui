/**
 * phase8:gates — AI 阶梯收口门禁（轨道卡 §4: 统一进 phase*-gates）。
 *
 * A1 契约硬门禁（catalog 100% + v0.2）+ 红proof
 * A2 意图搜索固定测试集 + install_with_theme 幂等 + 旁路写盘扫描（含红proof）
 * A3 validate-rules 硬门禁 + 红proof + 社区包全链路
 * A4 adapter-ag-ui / schema-renderer 测试 + L1 边界
 * A5 全量 catalog data-ai 三件套 + 红proof
 * A6 bench.generation_quality 诚实性断言（null 必须带 slip 说明；非 null 必须带 generator/任务集版本）
 * §3.7 $extends 8 主题字节回归
 */
import { spawn } from 'node:child_process'
import { access, cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function fail(message) {
  console.error(`phase8:gates failed: ${message}`)
  process.exitCode = 1
}

function ok(message) {
  console.log(`[P8 ok] ${message}`)
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

function dump(output) {
  const text = String(output ?? '').trimEnd()
  if (text) console.log(text)
}

function runNode(args, env = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      env: { ...process.env, ...env },
    })
    let output = ''
    child.stdout.on('data', (chunk) => (output += String(chunk)))
    child.stderr.on('data', (chunk) => (output += String(chunk)))
    child.on('error', reject)
    child.on('exit', (code) => resolvePromise({ code: code ?? 1, output }))
  })
}

function runPnpm(args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn('corepack', ['pnpm@9.15.0', ...args], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`corepack pnpm@9.15.0 ${args.join(' ')} exited ${code}`))
    })
  })
}

async function step(label, fn) {
  console.log(`\n[phase8:gates] ${label}`)
  await fn()
  if (process.exitCode) throw new Error(`${label} failed`)
}

/* ---------- A1 ---------- */

async function checkContractGate() {
  const pass = await runNode(['packages/contract/scripts/validate-catalog-contracts.mjs'])
  dump(pass.output)
  if (pass.code !== 0) return fail('contract catalog gate must be green (full catalog v0.2)')
  ok('A1 catalog contract gate green (full catalog v0.2; n<=50 isolation removed)')
}

async function checkContractRedProof() {
  // Copy one contract, break it (remove dataAi.intents), point the gate at the
  // broken tree via the env hook, and require a non-zero exit.
  const temp = await mkdtemp(join(tmpdir(), 'cu-p8-contract-red-'))
  try {
    await cp(join(root, 'packages/components/src'), join(temp, 'src'), { recursive: true })
    await cp(
      join(root, 'packages/components/catalog.json'),
      join(temp, 'catalog.json'),
    )
    const target = join(temp, 'src/button/contract.json')
    const broken = JSON.parse(await readFile(target, 'utf8'))
    delete broken.dataAi.intents
    await writeFile(target, JSON.stringify(broken, null, 2), 'utf8')

    const red = await runNode(['packages/contract/scripts/validate-catalog-contracts.mjs'], {
      CU_COMPONENTS_SRC: join(temp, 'src'),
      CU_CATALOG_JSON: join(temp, 'catalog.json'),
    })
    dump(red.output)
    if (red.code === 0) return fail('A1 red-proof: broken contract was NOT rejected')
    if (!red.output.includes('dataAi')) return fail('A1 red-proof: error must locate dataAi')
    ok('A1 red-proof: contract without dataAi.intents turns the gate red')
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

/* ---------- A2 ---------- */

async function checkRegistryTests() {
  await runPnpm(['--filter', '@chameleon-ui/registry', 'test'])
  ok('A2 intent-search frozen set + install_with_theme idempotency + rules lifecycle')
}

async function checkBypassScan() {
  const pass = await runNode(['scripts/scan-bypass-writes.mjs'])
  dump(pass.output)
  if (pass.code !== 0) return fail('bypass-write scan must be green')

  const temp = await mkdtemp(join(tmpdir(), 'cu-p8-bypass-red-'))
  try {
    await writeFile(
      join(temp, 'evil.ts'),
      "import { writeFile } from 'node:fs/promises'\nawait writeFile('x', 'y')\n",
      'utf8',
    )
    const red = await runNode(['scripts/scan-bypass-writes.mjs'], { CU_SCAN_EXTRA_ROOT: temp })
    dump(red.output)
    if (red.code === 0) return fail('A2 red-proof: bypass write was NOT detected')
    ok('A2 bypass-write scan green + red-proof (injected writeFile detected)')
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

/* ---------- A3 ---------- */

async function checkValidateRules() {
  const pass = await runNode(['packages/themes/scripts/validate-rules.mjs'])
  dump(pass.output)
  if (pass.code !== 0) return fail('validate-rules must be green (8/8 + community pack)')
  ok('A3 validate-rules green (8/8 themes + community-focus-first)')
}

async function checkValidateRulesRedProof() {
  const temp = await mkdtemp(join(tmpdir(), 'cu-p8-rules-red-'))
  try {
    await cp(join(root, 'packages/themes/src'), join(temp, 'src'), { recursive: true })
    const target = join(temp, 'src/line/design-rules.json')
    const broken = JSON.parse(await readFile(target, 'utf8'))
    delete broken.rtl
    await writeFile(target, JSON.stringify(broken, null, 2), 'utf8')

    const red = await runNode(['packages/themes/scripts/validate-rules.mjs'], {
      CU_THEMES_SRC: join(temp, 'src'),
    })
    dump(red.output)
    if (red.code === 0) return fail('A3 red-proof: broken rules were NOT rejected')
    if (!red.output.includes('rtl')) return fail('A3 red-proof: error must locate the rtl group')
    ok('A3 red-proof: rules without rtl group turn the gate red')
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

/* ---------- A4 ---------- */

async function checkAdapterPackages() {
  await runPnpm(['--filter', '@chameleon-ui/adapter-a2ui', 'test'])
  await runPnpm(['--filter', '@chameleon-ui/adapter-mcp-apps', 'test'])
  await runPnpm(['--filter', '@chameleon-ui/adapter-ag-ui', 'test'])
  await runPnpm(['--filter', '@chameleon-ui/schema-renderer', 'test'])
  ok('A4 adapter-a2ui/mcp-apps (supported) + adapter-ag-ui (POC) + schema-renderer tests')
}

async function checkL1Boundary() {
  const l1 = ['tokens', 'themes', 'i18n', 'contract', 'primitives']
  for (const name of l1) {
    const pkg = JSON.parse(await readFile(join(root, 'packages', name, 'package.json'), 'utf8'))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
    for (const forbidden of [
      '@chameleon-ui/adapter-a2ui',
      '@chameleon-ui/adapter-mcp-apps',
      '@chameleon-ui/adapter-ag-ui',
      '@chameleon-ui/schema-renderer',
      '@chameleon-ui/market-service',
    ]) {
      if (deps[forbidden]) return fail(`L1 package ${name} must not depend on ${forbidden}`)
    }
  }
  ok('A4 L1/L2 boundary: no protocol adapter or schema-renderer leaks into L1')
}

/* ---------- A5 ---------- */

async function checkDataAi() {
  // `pnpm test -- file` appends args to the whole script (`vitest run && validate-…`),
  // so isolate with `exec vitest` and do not run P5/P6 component unit tests.
  const result = await runPnpmCapture(
    ['--filter', '@chameleon-ui/components', 'exec', 'vitest', 'run', 'src/catalog-data-ai.test.ts'],
  )
  dump(result.output)
  if (result.code !== 0) return fail('A5 catalog-data-ai test must be green')
  const vocab = await runNode(['scripts/generate-data-ai-vocabulary.mjs', '--check'])
  dump(vocab.output)
  if (vocab.code !== 0) return fail('data-ai vocabulary drift')
  ok('A5 full-catalog data-ai triple gate green + vocabulary in sync')
}

async function checkDataAiRedProof() {
  // Copy the component sources (text-only fixtures), strip one data-ai-intent,
  // and require the catalog gate test to fail when pointed at the broken tree.
  const temp = await mkdtemp(join(tmpdir(), 'cu-p8-dataai-red-'))
  try {
    await cp(join(root, 'packages/components/src'), join(temp, 'src'), { recursive: true })
    const target = join(temp, 'src/divider/Divider.tsx')
    const source = await readFile(target, 'utf8')
    await writeFile(target, source.replace(' data-ai-intent="separate-sections"', ''), 'utf8')

    const red = await runPnpmCapture(
      ['--filter', '@chameleon-ui/components', 'exec', 'vitest', 'run', 'src/catalog-data-ai.test.ts'],
      { CU_COMPONENTS_SRC: join(temp, 'src') },
    )
    dump(red.output)
    if (red.code === 0) return fail('A5 red-proof: missing data-ai-intent was NOT caught')
    if (!red.output.includes('data-ai-intent')) {
      return fail('A5 red-proof: failure output must name data-ai-intent')
    }
    ok('A5 red-proof: removing data-ai-intent turns the catalog gate red')
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

function runPnpmCapture(args, env = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn('corepack', ['pnpm@9.15.0', ...args], {
      cwd: root,
      shell: true,
      env: { ...process.env, ...env },
    })
    let output = ''
    child.stdout.on('data', (chunk) => (output += String(chunk)))
    child.stderr.on('data', (chunk) => (output += String(chunk)))
    child.on('error', reject)
    child.on('exit', (code) => resolvePromise({ code: code ?? 1, output }))
  })
}

/* ---------- A6 ---------- */

async function loadBenchReport() {
  const candidates = [
    join(root, 'benchmarks/genui-bench/reports/latest.json'),
    join(root, 'apps/docs/static/bench/latest.json'),
  ]
  for (const path of candidates) {
    if (await exists(path)) {
      return { path, report: JSON.parse(await readFile(path, 'utf8')) }
    }
  }
  return fail('A6: missing bench latest.json (run bench:genui or sync docs/static/bench)')
}

async function checkBenchHonesty() {
  const loaded = await loadBenchReport()
  if (!loaded) return
  const { path, report } = loaded
  const metric = report.metrics?.find((entry) => entry.id === 'bench.generation_quality')
  if (!metric) return fail('bench report missing bench.generation_quality')
  if (!report.generatedAt || !report.generation?.measuredAt || !report.generation?.taskSetVersion) {
    return fail('A6: bench report must record generatedAt + generation.measuredAt + taskSetVersion')
  }
  const note = String(metric.note ?? '')
  if (!note.includes('pnpm bench:genui') && !note.includes('CU_BENCH_GENERATOR')) {
    return fail('A6: bench note must include reproduce hint (pnpm bench:genui / CU_BENCH_GENERATOR)')
  }
  if (metric.value === null) {
    if (!note.includes('CU_BENCH_GENERATOR') || !report.generation?.taskSetVersion) {
      return fail('A6: null generation_quality must carry the honest-null note + task set version')
    }
    ok(`A6 generation_quality is honestly null (${path})`)
  } else {
    if (!report.generation?.generator || !report.generation?.taskSetVersion) {
      return fail('A6: measured generation_quality must record generator + taskSetVersion')
    }
    ok(`A6 generation_quality measured by ${report.generation.generator} = ${metric.value}`)
  }

  const baselinePath = join(
    root,
    'benchmarks/genui-bench/reports/generation-quality-template-baseline.json',
  )
  if (!(await exists(baselinePath))) {
    return fail(
      'A6: missing committed template-baseline report (CU_BENCH_GENERATOR=template-baseline bench:genui → copy to generation-quality-template-baseline.json)',
    )
  }
  const baseline = JSON.parse(await readFile(baselinePath, 'utf8'))
  const baselineMetric = baseline.metrics?.find((entry) => entry.id === 'bench.generation_quality')
  if (baselineMetric?.value === null || baselineMetric?.value === undefined) {
    return fail('A6: template-baseline report must be a non-null harness measurement (not invented)')
  }
  if (!baseline.generation?.generator?.includes('template-baseline')) {
    return fail('A6: template-baseline report must record generator id containing template-baseline')
  }
  if (!baseline.generation?.taskSetVersion || !baseline.generation?.measuredAt) {
    return fail('A6: template-baseline report must record taskSetVersion + measuredAt')
  }
  if (!Array.isArray(baseline.generation?.outcomes) || baseline.generation.outcomes.length < 8) {
    return fail('A6: template-baseline report must keep per-task outcomes (≥8) for 存证')
  }
  ok(
    `A6 template-baseline measured ${baselineMetric.successes}/${baselineMetric.attempts} = ${baselineMetric.value} (task set v${baseline.generation.taskSetVersion})`,
  )
}

/* ---------- §3.7 $extends ---------- */

async function checkExtendsRegression() {
  const result = await runNode(['packages/themes/scripts/test-themes-regression.mjs'])
  dump(result.output)
  if (result.code !== 0) return fail('8-theme byte regression must be green')
  ok('$extends: 8 themes byte-identical to the pre-pipeline baseline')
}

/* ---------- AI consumer SSOT ---------- */

async function checkMcpServerTests() {
  await runPnpm(['--filter', '@chameleon-ui/mcp-server', 'test'])
  ok('MCP tools: search_components intent, get_contract, get_design_rules, get_import_specifiers, list_themes')
}

async function checkAiConsumer() {
  const result = await runNode(['scripts/ai-check.mjs', '--drift-only'])
  dump(result.output)
  if (result.code !== 0) return fail('ai:check drift (MCP / AGENTS.md / install MDX) is red')
  ok('AI consumer SSOT: MCP tools, AGENTS.md, install MDX import examples locked')
}

/* ---------- main ---------- */

async function main() {
  await step('A1 contract catalog gate (schema v0.2)', checkContractGate)
  await step('A1 contract gate red-proof', checkContractRedProof)
  await step('A2 registry tests (intent + install_with_theme + rules lifecycle)', checkRegistryTests)
  await step('A2 MCP server tools', checkMcpServerTests)
  await step('A2 bypass-write scan + red-proof', checkBypassScan)
  await step('A3 validate-rules hard gate', checkValidateRules)
  await step('A3 validate-rules red-proof', checkValidateRulesRedProof)
  await step('A4 adapters + schema-renderer tests', checkAdapterPackages)
  await step('A4 L1/L2 boundary', checkL1Boundary)
  await step('A5 catalog data-ai gate', checkDataAi)
  await step('A5 catalog data-ai red-proof', checkDataAiRedProof)
  await step('A6 bench generation_quality honesty', checkBenchHonesty)
  await step('$extends 8-theme byte regression', checkExtendsRegression)
  await step('AI consumer SSOT drift (MCP + AGENTS.md + install MDX)', checkAiConsumer)

  console.log(
    JSON.stringify(
      {
        ok: true,
        gates: [
          'a1-contract-catalog-v0.2',
          'a1-contract-red-proof',
          'a2-intent-search-frozen-set',
          'a2-install-with-theme',
          'a2-mcp-server-tools',
          'a2-bypass-write-scan',
          'a3-validate-rules-hard-gate',
          'a3-rules-red-proof',
          'a3-community-rules-lifecycle',
          'a4-adapter-a2ui-supported',
          'a4-adapter-mcp-apps-supported',
          'a4-adapter-ag-ui-poc',
          'a4-schema-renderer-snapshots',
          'a4-l1-boundary',
          'a5-catalog-data-ai-triple',
          'a5-data-ai-red-proof',
          'a6-generation-quality-honesty',
          'extends-8-theme-byte-regression',
          'ai-consumer-ssot-drift',
        ],
        note: 'Phase 8 AI-ladder gates. Default generation_quality is honestly null without a configured generator; template-baseline measurement is committed separately. AG-UI adapter is POC per DECISION.md. AI consumer SSOT is chameleon-ui/AGENTS.md.',
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
