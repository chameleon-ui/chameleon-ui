/**
 * perf:lhci — Phase 9 local Lighthouse measurement for R1–R3.
 *
 * Official page: inner demo AppShell + common-10 (`/?view=suite`) on :4175.
 * Lab stand-in: mobile form factor + Fast 4G + 4× CPU. Not a physical
 * 4×A76 / 4GB device and not cloud LHCI.
 *
 * Sample gate (not a hard fail): on measurement failure this writes an
 * explicit unmeasured artifact and exits 0. Never invents scores.
 */
import { spawn } from 'node:child_process'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const monorepoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(monorepoRoot, '..')
const budgetsPath = join(monorepoRoot, 'benchmarks', 'budgets.json')
const reportsDir = join(monorepoRoot, 'benchmarks', 'reports')
const latestPath = join(reportsDir, 'lhci-latest.json')
const mdPath = join(repoRoot, 'docs', 'project', 'reports', 'Phase-9-Lighthouse-R1-R3.md')
const lhTmpDir = join(reportsDir, '.lhci-tmp')
const chromeUserDataDir = join(reportsDir, '.chrome-user-data')

const DEMO_ORIGIN = 'http://127.0.0.1:4175'
const SUITE_URL = `${DEMO_ORIGIN}/?view=suite&locale=ar&theme=line`
const DOCS_ORIGIN = 'http://127.0.0.1:4176'
const LIGHTHOUSE_PIN = '13.4.1'

/** Chrome DevTools “Fast 4G” + Lighthouse mobile CPU slowdown. */
const FAST_4G = {
  label: 'simulated Fast 4G + 4x CPU (mid-tier Android lab stand-in)',
  rttMs: 60,
  throughputKbps: 9 * 1024,
  requestLatencyMs: 60 * 3.75,
  downloadThroughputKbps: 9 * 1024 * 0.9,
  uploadThroughputKbps: 1.5 * 1024 * 0.9,
  cpuSlowdownMultiplier: 4,
  note: 'Not a physical 4×A76 + 4GB device. Chrome/Lighthouse simulate throttling on the runner host. Cloud LHCI is not used.',
}

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function runPnpm(args, { inherit = true } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('corepack', ['pnpm@9.15.0', ...args], {
      cwd: monorepoRoot,
      shell: true,
      env: process.env,
      stdio: inherit ? 'inherit' : 'pipe',
    })
    let output = ''
    if (!inherit) {
      child.stdout?.on('data', (chunk) => (output += String(chunk)))
      child.stderr?.on('data', (chunk) => (output += String(chunk)))
    }
    child.on('error', reject)
    child.on('exit', (code) => resolve({ code: code ?? 1, output, child }))
  })
}

function spawnPnpm(args) {
  return spawn('corepack', ['pnpm@9.15.0', ...args], {
    cwd: monorepoRoot,
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
}

async function urlUp(url, timeoutMs = 2000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), redirect: 'manual' })
    return res.status >= 200 && res.status < 500
  } catch {
    return false
  }
}

async function waitForUrl(url, timeoutMs) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await urlUp(url)) return true
    await new Promise((r) => setTimeout(r, 400))
  }
  return false
}

function killProcessTree(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', shell: true })
  } else {
    child.kill('SIGTERM')
  }
}

async function findPlaywrightChrome() {
  const roots = []
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) roots.push(process.env.PLAYWRIGHT_BROWSERS_PATH)
  if (process.env.LOCALAPPDATA) roots.push(join(process.env.LOCALAPPDATA, 'ms-playwright'))
  if (process.env.HOME) roots.push(join(process.env.HOME, '.cache', 'ms-playwright'))
  const exe =
    process.platform === 'win32' ? 'chrome.exe' : process.platform === 'darwin' ? 'chrome' : 'chrome'
  for (const root of roots) {
    if (!(await exists(root))) continue
    let entries = []
    try {
      entries = await readdir(root, { withFileTypes: true })
    } catch {
      continue
    }
    const chromiumDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith('chromium'))
      .map((e) => e.name)
      .sort()
      .reverse()
    for (const dir of chromiumDirs) {
      const candidates = [
        join(root, dir, 'chrome-win', exe),
        join(root, dir, 'chrome-win64', exe),
        join(root, dir, 'chrome-linux', exe),
        join(root, dir, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
      ]
      for (const candidate of candidates) {
        if (await exists(candidate)) return candidate
      }
    }
  }
  return null
}

async function loadLighthouse() {
  try {
    const [{ default: lighthouse }, chromeLauncher] = await Promise.all([
      import('lighthouse'),
      import('chrome-launcher'),
    ])
    return { lighthouse, chromeLauncher, source: `lighthouse@${LIGHTHOUSE_PIN} (resolved module)` }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

function numericAudit(lhr, id) {
  const audit = lhr?.audits?.[id]
  if (!audit) return { present: false, value: null, displayValue: null, score: null }
  const value = typeof audit.numericValue === 'number' && Number.isFinite(audit.numericValue) ? audit.numericValue : null
  return {
    present: true,
    value,
    displayValue: audit.displayValue ?? null,
    score: typeof audit.score === 'number' ? audit.score : null,
    numericUnit: audit.numericUnit ?? null,
  }
}

function categoryScore(lhr, id) {
  const cat = lhr?.categories?.[id]
  if (!cat || typeof cat.score !== 'number') return null
  return Math.round(cat.score * 100)
}

function buildArtifact({ budgets, status, unmeasuredReason, url, lhr, chromePath, lighthouseSource, extras }) {
  const r1Limit = budgets.metrics.R1.limitMs
  const r2Limit = budgets.metrics.R2.limitMs
  const r3Limit = budgets.metrics.R3.limitCls
  const generatedAt = new Date().toISOString()
  const lcp = lhr ? numericAudit(lhr, 'largest-contentful-paint') : { present: false, value: null }
  const inp = lhr ? numericAudit(lhr, 'interaction-to-next-paint') : { present: false, value: null }
  const cls = lhr ? numericAudit(lhr, 'cumulative-layout-shift') : { present: false, value: null }
  const tbt = lhr ? numericAudit(lhr, 'total-blocking-time') : { present: false, value: null }

  const r1Measured = typeof lcp.value === 'number'
  const r2Measured = typeof inp.value === 'number'
  const r3Measured = typeof cls.value === 'number'

  return {
    schemaVersion: 1,
    generatedAt,
    tool: 'lighthouse',
    toolPin: LIGHTHOUSE_PIN,
    lighthouseSource: lighthouseSource ?? null,
    status,
    unmeasuredReason: unmeasuredReason ?? null,
    url,
    formFactor: 'mobile',
    throttling: FAST_4G,
    chromePath: chromePath ?? null,
    host: {
      platform: process.platform,
      arch: process.arch,
      node: process.version,
    },
    budgets: { R1: r1Limit, R2: r2Limit, R3: r3Limit },
    metrics: {
      R1: {
        id: 'R1',
        name: 'LCP',
        unit: 'ms',
        limitMs: r1Limit,
        valueMs: r1Measured ? Math.round(lcp.value) : null,
        displayValue: lcp.displayValue,
        status: r1Measured ? 'measured' : 'unmeasured',
        source: 'lighthouse.audits.largest-contentful-paint.numericValue',
        meetsBudget: r1Measured ? lcp.value <= r1Limit : null,
      },
      R2: {
        id: 'R2',
        name: 'INP',
        unit: 'ms',
        limitMs: r2Limit,
        valueMs: r2Measured ? Math.round(inp.value) : null,
        displayValue: inp.displayValue,
        status: r2Measured ? 'measured' : 'unmeasured',
        source: 'lighthouse.audits.interaction-to-next-paint.numericValue',
        meetsBudget: r2Measured ? inp.value <= r2Limit : null,
        note: r2Measured
          ? null
          : 'Navigation-mode Lighthouse often has no INP numericValue (no lab interaction). TBT is recorded as extra only — not used as INP.',
      },
      R3: {
        id: 'R3',
        name: 'CLS',
        unit: 'cls',
        limitCls: r3Limit,
        value: r3Measured ? cls.value : null,
        displayValue: cls.displayValue,
        status: r3Measured ? 'measured' : 'unmeasured',
        source: 'lighthouse.audits.cumulative-layout-shift.numericValue',
        meetsBudget: r3Measured ? cls.value <= r3Limit : null,
      },
    },
    extra: {
      totalBlockingTimeMs: typeof tbt.value === 'number' ? Math.round(tbt.value) : null,
      totalBlockingTimeNote: 'TBT is not R2. Do not treat TBT as INP.',
      categories: lhr
        ? {
            performance: categoryScore(lhr, 'performance'),
            accessibility: categoryScore(lhr, 'accessibility'),
          }
        : null,
      lighthouseVersion: lhr?.lighthouseVersion ?? null,
      fetchTime: lhr?.fetchTime ?? null,
      userAgent: lhr?.userAgent ?? null,
      environment: lhr?.environment ?? null,
    },
    extras: extras ?? [],
    legacy: {
      'LEGACY-2026-001': r1Measured ? 'measured-local-lab' : 'open-unmeasured',
      'LEGACY-2026-002': r2Measured ? 'measured-local-lab' : 'open-unmeasured',
      'LEGACY-2026-003': r3Measured ? 'measured-local-lab' : 'open-unmeasured',
    },
    honesty: {
      invented: false,
      physicalMidTierAndroid: false,
      cloudLhci: false,
      npmPublish: false,
      vpatCertified: false,
      blindTest80: false,
    },
  }
}

function renderMarkdown(artifact) {
  const m = artifact.metrics
  const fmtMs = (row) =>
    row.status === 'measured' && typeof row.valueMs === 'number'
      ? `${row.valueMs} ms (${row.displayValue ?? ''}) ${row.meetsBudget ? '≤ budget' : '> budget'}`
      : '**未测**'
  const fmtCls = (row) =>
    row.status === 'measured' && typeof row.value === 'number'
      ? `${row.value} (${row.displayValue ?? ''}) ${row.meetsBudget ? '≤ budget' : '> budget'}`
      : '**未测**'
  const extras = (artifact.extras ?? [])
    .map((e) => `- ${e.label}: ${e.status === 'measured' ? JSON.stringify(e.metrics) : e.unmeasuredReason}`)
    .join('\n')
  return `# Phase 9 · Lighthouse R1–R3（生成物）

> **禁止手写分数。** 本文件由 \`corepack pnpm@9.15.0 perf:lhci\` 从 \`benchmarks/reports/lhci-latest.json\` 写出。
> 日期：${artifact.generatedAt}
> 口径：${artifact.throttling.label}

## 状态

- artifact \`status\`: **${artifact.status}**
- 未测原因：${artifact.unmeasuredReason ?? '（无）'}
- 工具：${artifact.tool} pin ${artifact.toolPin} · ${artifact.lighthouseSource ?? 'n/a'}
- Lighthouse 版本：${artifact.extra.lighthouseVersion ?? 'n/a'}
- Chrome：\`${artifact.chromePath ?? 'n/a'}\`
- Host：${artifact.host.platform} ${artifact.host.arch} Node ${artifact.host.node}
- URL：\`${artifact.url}\`
- 真机 4×A76+4GB：否（实验室模拟）
- Cloud LHCI：否

## R1–R3

| ID | 预算 | 本次 | LEGACY |
| :--- | :--- | :--- | :--- |
| R1 LCP | ≤ ${m.R1.limitMs} ms | ${fmtMs(m.R1)} | ${artifact.legacy['LEGACY-2026-001']} |
| R2 INP P75 | ≤ ${m.R2.limitMs} ms | ${fmtMs(m.R2)} | ${artifact.legacy['LEGACY-2026-002']} |
| R3 CLS | ≤ ${m.R3.limitCls} | ${fmtCls(m.R3)} | ${artifact.legacy['LEGACY-2026-003']} |

${m.R2.status === 'unmeasured' ? `R2 说明：${m.R2.note}\n` : ''}
TBT（非 R2）：${artifact.extra.totalBlockingTimeMs ?? 'n/a'} ms。${artifact.extra.totalBlockingTimeNote}

## 类别分（非 R* 预算）

Lighthouse category score（0–100；axe 自动检查进 accessibility）。**不是** VPAT 认证，不是 AT 实验室。

- performance: ${artifact.extra.categories?.performance ?? 'n/a'}
- accessibility: ${artifact.extra.categories?.accessibility ?? 'n/a'}

## 其它 URL

${extras || '（无）'}

## 诚实边界

- 未宣称 chameleon-ui.dev 上线
- 未执行 npm publish
- 未宣称盲测 ≥80%
- VPAT 仍 draft / not certified
- owner 仍为待指定
`
}

async function writeArtifacts(artifact) {
  await mkdir(reportsDir, { recursive: true })
  const datedName =
    artifact.status === 'measured' ? `lhci-${isoDate()}.json` : `lhci-${isoDate()}-unmeasured.json`
  const dated = join(reportsDir, datedName)
  const json = `${JSON.stringify(artifact, null, 2)}\n`

  let skipLatest = false
  if (artifact.status === 'unmeasured' && (await exists(latestPath))) {
    try {
      const previous = JSON.parse(await readFile(latestPath, 'utf8'))
      if (previous.status === 'measured') {
        skipLatest = true
        console.log(
          '[perf:lhci] previous lhci-latest.json is measured; not overwriting it with this unmeasured run.',
        )
      }
    } catch {
      // corrupt latest → replace
    }
  }

  if (!skipLatest) {
    await writeFile(latestPath, json, 'utf8')
    await mkdir(dirname(mdPath), { recursive: true })
    await writeFile(mdPath, renderMarkdown(artifact), 'utf8')
    console.log(`[perf:lhci] wrote ${latestPath}`)
    console.log(`[perf:lhci] wrote ${mdPath}`)
  }
  await writeFile(dated, json, 'utf8')
  console.log(`[perf:lhci] wrote ${dated}`)
}

async function ensureDemoPreview() {
  if (await urlUp(DEMO_ORIGIN)) {
    console.log(`[perf:lhci] reusing existing demo server at ${DEMO_ORIGIN}`)
    return { child: null, started: false }
  }
  const distIndex = join(monorepoRoot, 'apps', 'internal-demo', 'dist', 'index.html')
  if (!(await exists(distIndex))) {
    console.log('[perf:lhci] building @chameleon-ui/internal-demo (and workspace deps)…')
    const built = await runPnpm(['--filter', '@chameleon-ui/internal-demo...', 'build'])
    if (built.code !== 0) {
      throw new Error(`demo build exited ${built.code}`)
    }
  }
  console.log('[perf:lhci] starting demo preview on :4175…')
  const child = spawnPnpm(['--filter', '@chameleon-ui/internal-demo', 'preview'])
  const up = await waitForUrl(DEMO_ORIGIN, 120_000)
  if (!up) {
    killProcessTree(child)
    throw new Error(`demo preview did not become ready at ${DEMO_ORIGIN}`)
  }
  return { child, started: true }
}

function applyLocalTmpEnv() {
  process.env.TEMP = lhTmpDir
  process.env.TMP = lhTmpDir
  process.env.TMPDIR = lhTmpDir
}

async function prepareLighthouseDirs() {
  await mkdir(lhTmpDir, { recursive: true })
  await mkdir(chromeUserDataDir, { recursive: true })
  applyLocalTmpEnv()
}

const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: FAST_4G.rttMs,
      throughputKbps: FAST_4G.throughputKbps,
      requestLatencyMs: FAST_4G.requestLatencyMs,
      downloadThroughputKbps: FAST_4G.downloadThroughputKbps,
      uploadThroughputKbps: FAST_4G.uploadThroughputKbps,
      cpuSlowdownMultiplier: FAST_4G.cpuSlowdownMultiplier,
    },
    onlyCategories: ['performance', 'accessibility'],
  },
}

async function runLighthouseOn(url, { lighthouse, chromeLauncher, chromePath }) {
  await prepareLighthouseDirs()
  const chromeFlags = [
    '--headless',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
  ]
  let chrome
  try {
    chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags,
      userDataDir: chromeUserDataDir,
      ignoreDefaultFlags: false,
    })
  } catch (error) {
    console.warn(`[perf:lhci] chrome-launcher failed (${error instanceof Error ? error.message : error}); trying CLI`)
    return runLighthouseCli(url, chromePath)
  }
  try {
    const result = await lighthouse(
      url,
      {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility'],
      },
      lighthouseConfig,
    )
    return result?.lhr ?? result?.lighthouseResult ?? null
  } catch (error) {
    console.warn(`[perf:lhci] lighthouse API failed (${error instanceof Error ? error.message : error}); trying CLI`)
    return runLighthouseCli(url, chromePath)
  } finally {
    if (chrome) await chrome.kill()
  }
}

function runLighthouseCli(url, chromePath) {
  return new Promise((resolve, reject) => {
    const outFile = join(lhTmpDir, 'cli-lhr.json')
    const cli = join(monorepoRoot, 'node_modules', 'lighthouse', 'cli', 'index.js')
    const child = spawn(
      process.execPath,
      [
        cli,
        url,
        '--output=json',
        `--output-path=${outFile}`,
        '--form-factor=mobile',
        '--screenEmulation.mobile',
        '--throttling-method=simulate',
        `--throttling.rttMs=${FAST_4G.rttMs}`,
        `--throttling.throughputKbps=${FAST_4G.throughputKbps}`,
        `--throttling.cpuSlowdownMultiplier=${FAST_4G.cpuSlowdownMultiplier}`,
        '--only-categories=performance,accessibility',
        `--chrome-path=${chromePath}`,
        `--chrome-flags=--headless --disable-gpu --no-first-run --user-data-dir=${chromeUserDataDir}`,
        '--quiet',
      ],
      { cwd: monorepoRoot, env: { ...process.env, TEMP: lhTmpDir, TMP: lhTmpDir, TMPDIR: lhTmpDir } },
    )
    let output = ''
    child.stdout.on('data', (chunk) => (output += String(chunk)))
    child.stderr.on('data', (chunk) => (output += String(chunk)))
    child.on('error', reject)
    child.on('exit', async (code) => {
      if (code !== 0) {
        reject(new Error(`lighthouse CLI exited ${code}: ${output.slice(-2000)}`))
        return
      }
      try {
        const lhr = JSON.parse(await readFile(outFile, 'utf8'))
        resolve(lhr)
      } catch (error) {
        reject(error)
      }
    })
  })
}

async function measure() {
  const budgets = JSON.parse(await readFile(budgetsPath, 'utf8'))
  await prepareLighthouseDirs()
  console.log('[perf:lhci] Phase 9 local Lighthouse — sample gate, not a CI hard fail.')
  console.log(
    `[perf:lhci] Budgets: R1≤${budgets.metrics.R1.limitMs}ms, R2≤${budgets.metrics.R2.limitMs}ms, R3≤${budgets.metrics.R3.limitCls}`,
  )

  const loaded = await loadLighthouse()
  if (!loaded.lighthouse) {
    const artifact = buildArtifact({
      budgets,
      status: 'unmeasured',
      unmeasuredReason: `lighthouse module not loadable (${loaded.error}). Install root dep lighthouse@${LIGHTHOUSE_PIN} or leave unmeasured.`,
      url: SUITE_URL,
      lhr: null,
      chromePath: null,
      lighthouseSource: null,
    })
    await writeArtifacts(artifact)
    return artifact
  }

  let chromePath
  try {
    chromePath = loaded.chromeLauncher.getChromePath()
  } catch {
    chromePath = await findPlaywrightChrome()
  }
  if (!chromePath) {
    const artifact = buildArtifact({
      budgets,
      status: 'unmeasured',
      unmeasuredReason: 'No Chrome/Chromium executable found (chrome-launcher + Playwright browser cache).',
      url: SUITE_URL,
      lhr: null,
      chromePath: null,
      lighthouseSource: loaded.source,
    })
    await writeArtifacts(artifact)
    return artifact
  }

  let preview
  try {
    preview = await ensureDemoPreview()
  } catch (error) {
    const artifact = buildArtifact({
      budgets,
      status: 'unmeasured',
      unmeasuredReason: `demo preview/build failed: ${error instanceof Error ? error.message : error}`,
      url: SUITE_URL,
      lhr: null,
      chromePath,
      lighthouseSource: loaded.source,
    })
    await writeArtifacts(artifact)
    return artifact
  }

  try {
    console.log(`[perf:lhci] running Lighthouse on ${SUITE_URL}`)
    const lhr = await runLighthouseOn(SUITE_URL, {
      lighthouse: loaded.lighthouse,
      chromeLauncher: loaded.chromeLauncher,
      chromePath,
    })
    if (!lhr) {
      throw new Error('lighthouse returned empty lhr')
    }

    const extras = []
    if (await urlUp(DOCS_ORIGIN)) {
      try {
        console.log(`[perf:lhci] docs server up — sampling ${DOCS_ORIGIN} (not R1–R3)`)
        const docsLhr = await runLighthouseOn(DOCS_ORIGIN, {
          lighthouse: loaded.lighthouse,
          chromeLauncher: loaded.chromeLauncher,
          chromePath,
        })
        const docsLcp = numericAudit(docsLhr, 'largest-contentful-paint')
        const docsCls = numericAudit(docsLhr, 'cumulative-layout-shift')
        extras.push({
          label: 'docs :4176 (not R1–R3 kit page)',
          url: DOCS_ORIGIN,
          status: 'measured',
          metrics: {
            lcpMs: typeof docsLcp.value === 'number' ? Math.round(docsLcp.value) : null,
            cls: typeof docsCls.value === 'number' ? docsCls.value : null,
            performance: categoryScore(docsLhr, 'performance'),
            accessibility: categoryScore(docsLhr, 'accessibility'),
          },
        })
      } catch (error) {
        extras.push({
          label: 'docs :4176 (not R1–R3 kit page)',
          url: DOCS_ORIGIN,
          status: 'unmeasured',
          unmeasuredReason: error instanceof Error ? error.message : String(error),
        })
      }
    } else {
      extras.push({
        label: 'docs :4176 (not R1–R3 kit page)',
        url: DOCS_ORIGIN,
        status: 'unmeasured',
        unmeasuredReason: 'docs preview not running; not started (R1–R3 uses demo :4175).',
      })
    }

    const r1 = numericAudit(lhr, 'largest-contentful-paint')
    const r3 = numericAudit(lhr, 'cumulative-layout-shift')
    const anyMeasured = typeof r1.value === 'number' || typeof r3.value === 'number'
    const artifact = buildArtifact({
      budgets,
      status: anyMeasured ? 'measured' : 'unmeasured',
      unmeasuredReason: anyMeasured
        ? null
        : 'Lighthouse ran but LCP/CLS numericValue missing from lhr.',
      url: SUITE_URL,
      lhr,
      chromePath,
      lighthouseSource: loaded.source,
      extras,
    })
    await writeArtifacts(artifact)
    return artifact
  } catch (error) {
    const artifact = buildArtifact({
      budgets,
      status: 'unmeasured',
      unmeasuredReason: `Lighthouse run failed: ${error instanceof Error ? error.message : error}`,
      url: SUITE_URL,
      lhr: null,
      chromePath,
      lighthouseSource: loaded.source,
    })
    await writeArtifacts(artifact)
    return artifact
  } finally {
    if (preview?.started) killProcessTree(preview.child)
  }
}

const artifact = await measure()
console.log(
  JSON.stringify(
    {
      status: artifact.status,
      unmeasuredReason: artifact.unmeasuredReason,
      R1: artifact.metrics.R1,
      R2: artifact.metrics.R2,
      R3: artifact.metrics.R3,
      categories: artifact.extra.categories,
    },
    null,
    2,
  ),
)
if (artifact.status === 'unmeasured') {
  console.log(`[perf:lhci] left unmeasured: ${artifact.unmeasuredReason}`)
} else {
  console.log('[perf:lhci] measured artifact recorded. Do not hand-edit the numbers.')
}
