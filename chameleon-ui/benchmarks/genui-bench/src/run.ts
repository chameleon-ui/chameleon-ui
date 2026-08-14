import {
  createInstallKernel,
  InstallError,
  type TelemetryHook,
} from '@chameleon-ui/install-core'
import { listComponents, listThemes, registry } from '@chameleon-ui/registry'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { runGenerationQuality, type GenerationQualityResult } from './generation.js'
import { BENCH_METRIC_IDS, type BenchMetricId } from './ids.js'

export interface BenchMetric {
  id: BenchMetricId
  value: number | null
  unit: 'rate' | 'reserved'
  successes: number
  attempts: number
  note: string
}

export interface BenchReport {
  generatedAt: string
  harness: 'genui-bench'
  registry: {
    components: number
    themes: number
  }
  telemetryDefaultOff: boolean
  metrics: BenchMetric[]
  /** Phase 8 A6: generation harness detail (存证). Absent only if the harness itself failed. */
  generation?: GenerationQualityResult
}

function rate(successes: number, attempts: number): number {
  if (attempts === 0) return 0
  return successes / attempts
}

async function withTemp<T>(run: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), 'cu-genui-'))
  try {
    return await run(dir)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

export async function runHarness(): Promise<BenchReport> {
  const kernel = createInstallKernel(registry)
  const components = listComponents()
  const themes = listThemes()
  const theme = themes[0]
  if (!theme) {
    throw new Error('GenUI-Bench cannot run: registry has no themes.')
  }
  if (components.length === 0) {
    throw new Error('GenUI-Bench cannot run: registry has no components.')
  }

  let installOk = 0
  for (const item of components) {
    const ok = await withTemp(async (dir) => {
      const result = await kernel.install(item, dir, { source: 'cli' })
      return result.installed.includes(item.id)
    }).catch(() => false)
    if (ok) installOk += 1
  }

  let bundleOk = 0
  for (const item of components) {
    const ok = await withTemp(async (dir) => {
      const componentResult = await kernel.install(item, dir, { source: 'cli' })
      const themeResult = await kernel.install(theme, dir, { source: 'cli' })
      return (
        componentResult.installed.includes(item.id) &&
        themeResult.installed.includes(theme.id)
      )
    }).catch(() => false)
    if (ok) bundleOk += 1
  }

  let idempotentOk = 0
  for (const item of components) {
    const ok = await withTemp(async (dir) => {
      await kernel.install(item, dir, { source: 'cli' })
      const second = await kernel.install(item, dir, { source: 'cli' })
      return second.written.length === 0 && second.skipped.length > 0
    }).catch(() => false)
    if (ok) idempotentOk += 1
  }

  let docsOk = 0
  for (const item of components) {
    const ok = await withTemp(async (dir) => {
      const result = await kernel.install(item, dir, { source: 'docs' })
      return result.installed.includes(item.id)
    }).catch(() => false)
    if (ok) docsOk += 1
  }

  let conflictOk = 0
  const probe = components[0]
  if (probe?.files[0]) {
    const rejected = await withTemp(async (dir) => {
      const target = join(dir, probe.files[0].path)
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, 'stale-conflict-bytes', 'utf8')
      try {
        await kernel.install(probe, dir, { source: 'cli' })
        return false
      } catch (error) {
        return error instanceof InstallError
      }
    })
    if (rejected) conflictOk = 1
  }

  const events: string[] = []
  const hook: TelemetryHook = (event) => {
    events.push(event)
  }
  await withTemp(async (dir) => {
    await kernel.install(components[0], dir)
  })
  const telemetryDefaultOff = events.length === 0
  await withTemp(async (dir) => {
    await kernel.install(components[0], dir, { telemetry: hook, source: 'cli' })
  })

  const metrics: BenchMetric[] = [
    {
      id: 'bench.install_success_rate',
      value: rate(installOk, components.length),
      unit: 'rate',
      successes: installOk,
      attempts: components.length,
      note: 'Single-item install through createInstallKernel (source=cli).',
    },
    {
      id: 'bench.bundle_install_success_rate',
      value: rate(bundleOk, components.length),
      unit: 'rate',
      successes: bundleOk,
      attempts: components.length,
      note: `Component + theme ${theme.id} into the same target directory.`,
    },
    {
      id: 'bench.idempotent_reinstall_rate',
      value: rate(idempotentOk, components.length),
      unit: 'rate',
      successes: idempotentOk,
      attempts: components.length,
      note: 'Second install must skip identical files.',
    },
    {
      id: 'bench.docs_cta_install_success_rate',
      value: rate(docsOk, components.length),
      unit: 'rate',
      successes: docsOk,
      attempts: components.length,
      note: 'Same kernel as the docs CTA, source=docs. Docs app itself does not write files.',
    },
    {
      id: 'bench.conflict_reject_rate',
      value: rate(conflictOk, 1),
      unit: 'rate',
      successes: conflictOk,
      attempts: 1,
      note: 'Different on-disk content must throw InstallError before write.',
    },
  ]

  const generation = await runGenerationQuality()
  metrics.push({
    id: 'bench.generation_quality',
    value: generation.value,
    unit: generation.value === null ? 'reserved' : 'rate',
    successes: generation.successes,
    attempts: generation.attempts,
    note: generation.note,
  })

  if (metrics.map((item) => item.id).join() !== BENCH_METRIC_IDS.join()) {
    throw new Error('GenUI-Bench metric id list drifted from BENCH_METRIC_IDS.')
  }

  return {
    generatedAt: new Date().toISOString(),
    harness: 'genui-bench',
    registry: {
      components: components.length,
      themes: themes.length,
    },
    telemetryDefaultOff,
    metrics,
    generation,
  }
}
