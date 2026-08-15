/**
 * a11y-axe-scan — automated axe-core scan for CAB submission evidence.
 *
 * Scope (line theme): AppShell + Navigation + Button + Form controls on the
 * internal demo. Not a CAB audit. Not a WCAG conformance claim.
 *
 * Usage: corepack pnpm@9.15.0 a11y:axe
 * Writes: docs/project/reports/2026-08-15-a11y-cab-evidence.json
 *         (+ copy under chameleon-ui/benchmarks/reports/)
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const monorepoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(monorepoRoot, '..')
const reportsDir = join(repoRoot, 'docs', 'project', 'reports')
const localReportsDir = join(monorepoRoot, 'benchmarks', 'reports')
const evidenceName = '2026-08-15-a11y-cab-evidence.json'
const DEMO_ORIGIN = 'http://127.0.0.1:4175'
const vrRoot = join(monorepoRoot, 'toolings', 'visual-regression')

const TARGETS = [
  {
    id: 'suite-appshell-common10',
    url: `${DEMO_ORIGIN}/?view=suite&locale=en&theme=line`,
    covers: ['AppShell', 'Button', 'Input', 'Checkbox', 'Select', 'Dialog', 'Tabs'],
  },
  {
    id: 'gallery-appshell-navigation-form',
    url: `${DEMO_ORIGIN}/?view=gallery&locale=en&theme=line`,
    covers: ['AppShell', 'Navigation', 'NavigationBar', 'Form', 'Button', 'gallery form controls'],
  },
  {
    id: 'three-end-navigation',
    url: `${DEMO_ORIGIN}/?view=three-end&locale=en&theme=line`,
    covers: ['AppShell', 'Navigation', 'NavigationBar', 'Button'],
  },
]

async function exists(target) {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
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

function spawnPnpm(args) {
  return spawn('corepack', ['pnpm@9.15.0', ...args], {
    cwd: monorepoRoot,
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
}

function killProcessTree(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {
      try {
        child.kill('SIGTERM')
      } catch {
        /* ignore */
      }
    }
  }
}

function resolveAxeSource() {
  const lighthouseEntry = require.resolve('lighthouse')
  return require.resolve('axe-core/axe.min.js', { paths: [dirname(lighthouseEntry)] })
}

function loadChromium() {
  const testEntry = require.resolve('@playwright/test', { paths: [vrRoot] })
  const fromTest = createRequire(testEntry)
  const playwright = fromTest('playwright-core')
  if (!playwright?.chromium) {
    throw new Error('playwright-core chromium API unavailable')
  }
  return playwright.chromium
}

async function ensureDemoServer() {
  if (await urlUp(DEMO_ORIGIN)) {
    console.log(`[a11y:axe] reusing demo at ${DEMO_ORIGIN}`)
    return null
  }
  console.log('[a11y:axe] building @chameleon-ui/internal-demo…')
  const build = spawnPnpm(['--filter', '@chameleon-ui/internal-demo', 'build'])
  await new Promise((resolve, reject) => {
    build.on('error', reject)
    build.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`demo build exited ${code}`))))
  })
  console.log('[a11y:axe] starting demo preview on :4175…')
  const preview = spawnPnpm(['--filter', '@chameleon-ui/internal-demo', 'preview'])
  const up = await waitForUrl(DEMO_ORIGIN, 90_000)
  if (!up) {
    killProcessTree(preview)
    throw new Error('demo preview did not become ready on :4175')
  }
  return preview
}

async function runAxeOnPage(page, axeSource, target) {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(target.url, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.addScriptTag({ path: axeSource })
  return page.evaluate(async () => {
    // axe is injected globally by addScriptTag
    const result = await globalThis.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      },
    })
    return {
      violations: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags,
        nodes: v.nodes.slice(0, 8).map((n) => ({
          summary: n.failureSummary,
          target: n.target,
          html: n.html?.slice(0, 240),
        })),
      })),
      incomplete: result.incomplete.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodeCount: v.nodes.length,
      })),
      passes: result.passes.length,
      inapplicable: result.inapplicable.length,
      timestamp: result.timestamp,
      testEngine: result.testEngine,
      url: result.url,
    }
  })
}

function summarize(pages) {
  const violationIds = new Map()
  let totalViolations = 0
  for (const page of pages) {
    for (const v of page.axe.violations) {
      totalViolations += 1
      const prev = violationIds.get(v.id) || { id: v.id, impact: v.impact, pages: [], help: v.help }
      prev.pages.push(page.id)
      violationIds.set(v.id, prev)
    }
  }
  return {
    totalPages: pages.length,
    totalViolationRules: violationIds.size,
    totalViolationInstances: totalViolations,
    byRule: [...violationIds.values()],
    clean: totalViolations === 0,
  }
}

async function main() {
  const axeSource = resolveAxeSource()
  const axePkg = JSON.parse(await readFile(join(dirname(axeSource), 'package.json'), 'utf8'))
  let preview = null
  let browser = null
  try {
    preview = await ensureDemoServer()
    const chromium = loadChromium()
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()

    const pages = []
    for (const target of TARGETS) {
      console.log(`[a11y:axe] scanning ${target.id}…`)
      const axe = await runAxeOnPage(page, axeSource, target)
      pages.push({
        id: target.id,
        url: target.url,
        covers: target.covers,
        axe,
      })
      console.log(
        `[a11y:axe] ${target.id}: violations=${axe.violations.length} incomplete=${axe.incomplete.length} passes=${axe.passes}`,
      )
    }

    const lhciPath = join(localReportsDir, 'lhci-latest.json')
    let lighthouseA11y = null
    if (await exists(lhciPath)) {
      const lhci = JSON.parse(await readFile(lhciPath, 'utf8'))
      lighthouseA11y = {
        source: 'chameleon-ui/benchmarks/reports/lhci-latest.json',
        status: lhci.status,
        generatedAt: lhci.generatedAt,
        url: lhci.url,
        accessibilityScore: lhci.extra?.categories?.accessibility ?? null,
        lighthouseVersion: lhci.extra?.lighthouseVersion ?? lhci.toolPin ?? null,
        note: 'Lighthouse accessibility category embeds axe; single lab URL; not a CAB result.',
      }
    }

    const summary = summarize(pages)
    const evidence = {
      schemaVersion: 1,
      kind: 'automated-a11y-evidence',
      generatedAt: new Date().toISOString(),
      commercialClaimsAllowed: false,
      thirdPartyCab: false,
      certificationClaim: false,
      submissionPackReady: true,
      theme: 'line',
      scope: {
        components: ['AppShell', 'Navigation', 'NavigationBar', 'Button', 'Form', 'Input', 'Checkbox', 'Select'],
        demoOrigin: DEMO_ORIGIN,
        pages: TARGETS.map((t) => ({ id: t.id, url: t.url, covers: t.covers })),
      },
      tools: {
        axeCore: axePkg.version,
        axeSource,
        playwright: '@playwright/test (visual-regression pin)',
        lighthouseArtifact: lighthouseA11y,
      },
      summary,
      pages,
      notEvaluated: [
        'Full WCAG 2.1 AA criterion set (manual)',
        'Assistive technology lab (NVDA/JAWS/VoiceOver)',
        'Theme contrast lab sign-off across 8 themes',
        'Revised Section 508 / EN 301 549 tables',
        'Focus-visible lab measurement',
        'Text spacing / reflow AT verification',
      ],
      reproduce: [
        'cd chameleon-ui',
        'corepack pnpm@9.15.0 a11y:axe',
        'Optional prior: corepack pnpm@9.15.0 perf:lhci  # refreshes lhci-latest accessibility category',
      ],
    }

    await mkdir(reportsDir, { recursive: true })
    await mkdir(localReportsDir, { recursive: true })
    const outPath = join(reportsDir, evidenceName)
    const localOut = join(localReportsDir, evidenceName)
    const json = `${JSON.stringify(evidence, null, 2)}\n`
    await writeFile(outPath, json, 'utf8')
    await writeFile(localOut, json, 'utf8')
    console.log(`[a11y:axe] wrote ${outPath}`)
    console.log(`[a11y:axe] summary: clean=${summary.clean} rules=${summary.totalViolationRules}`)
    process.exitCode = 0
  } catch (error) {
    console.error('[a11y:axe] failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  } finally {
    if (browser) await browser.close().catch(() => undefined)
    if (preview) killProcessTree(preview)
  }
}

main()
