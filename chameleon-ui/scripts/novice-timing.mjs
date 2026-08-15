/**
 * T3.3 / A3.3 — novice timing harness (script only).
 *
 * Records wall-clock for a fixed install flow into a temp directory.
 * Does NOT claim the 10-minute human DoD; that requires a real novice
 * session with video. This script only makes the stopwatch reproducible.
 *
 * Usage (from chameleon-ui/):
 *   corepack pnpm@9.15.0 exec node ./scripts/novice-timing.mjs
 */
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const reportPath = join(root, '../docs/project/reports/Phase-3-novice-timing.pending.json')

async function main() {
  await import(pathToFileURL(join(root, 'packages/registry/scripts/sync-catalog.mjs')).href).catch(() => {})
  const { createInstallKernel } = await import(
    pathToFileURL(join(root, 'packages/install-core/dist/index.js')).href
  )
  const { getRegistryItem, registry } = await import(
    pathToFileURL(join(root, 'packages/registry/dist/index.js')).href
  )

  const button = getRegistryItem('button')
  const theme = getRegistryItem('line')
  if (!button || !theme) {
    throw new Error('bundled registry missing button or line — build registry first')
  }

  const dir = await mkdtemp(join(tmpdir(), 'cu-novice-'))
  const started = Date.now()
  let ok = false
  let error = null
  try {
    const kernel = createInstallKernel(registry)
    await kernel.install(button, dir, { source: 'cli' })
    await kernel.install(theme, dir, { source: 'cli' })
    ok = true
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
  const elapsedMs = Date.now() - started

  const report = {
    status: 'script_run',
    humanNoviceSession: false,
    claimedUnder10Minutes: false,
    rate: null,
    elapsedMs,
    flow: ['chameleon add button', 'chameleon add-theme line'],
    ok,
    error,
    note:
      'Stopwatch only. Do not mark PHASE3 T3.3 / A3.3 as human-met. Video + novice operator still pending (owner 待指定).',
    generatedAt: new Date().toISOString(),
  }

  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify(report, null, 2))
  if (!ok) process.exitCode = 1
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
