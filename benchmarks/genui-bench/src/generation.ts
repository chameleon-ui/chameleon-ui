import { createInstallKernel, type RegistryItem } from '@chameleon-ui/install-core'
import { registry, searchByIntent } from '@chameleon-ui/registry'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Phase 8 A6: bench.generation_quality harness.
 *
 * Metric (per the frozen definition in tasks/generation-tasks.json): on the
 * standard task set, the rate of tasks where the generator's FIRST output
 *   1. compiles as a ui-render v1.0 schema with zero issues, and
 *   2. covers the task's expected component slugs, and
 *   3. installs through install-core into a clean directory.
 *
 * Honesty rule (轨道卡 §4): without a configured generator there is NO model
 * budget wired in this environment, so the metric stays null. Null is a legal
 * state; fabricating a number is not.
 */

export interface GenerationTask {
  id: string
  prompt: string
  expectSlugs: string[]
}

export interface GenerationTaskSet {
  taskSetVersion: string
  frozenAt: string
  metricDefinition: string
  tasks: GenerationTask[]
}

export interface GenerationResult {
  /** The candidate ui-render v1.0 schema object. */
  schema: unknown
  /** Raw generator output, kept for 存证 (reproducibility). */
  raw: string
}

export interface Generator {
  /** Recorded in the report next to the measured value (model name/version). */
  id: string
  kind: 'template-baseline' | 'external-llm'
  generate(task: GenerationTask): Promise<GenerationResult>
}

export interface GenerationTaskOutcome {
  taskId: string
  passed: boolean
  compileOk: boolean
  coversExpected: boolean
  installOk: boolean
  selectedSlugs: string[]
  raw: string
}

export interface GenerationQualityResult {
  generator: string | null
  taskSetVersion: string
  measuredAt: string
  value: number | null
  successes: number
  attempts: number
  note: string
  outcomes: GenerationTaskOutcome[]
}

const tasksDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'tasks')

export async function loadGenerationTaskSet(): Promise<GenerationTaskSet> {
  const raw = await readFile(join(tasksDir, 'generation-tasks.json'), 'utf8')
  return JSON.parse(raw) as GenerationTaskSet
}

/**
 * The schema-renderer's default component map keys, mirrored here so the
 * harness does not import React into the bench process.
 */
const RENDERABLE_SLUGS = new Set([
  'alert',
  'badge',
  'button',
  'card',
  'divider',
  'empty-state',
  'heading',
  'input',
  'stack',
  'typography',
])

/** Minimal display props per renderable slug for the baseline assembly. */
function baselineProps(slug: string, task: GenerationTask): Record<string, unknown> {
  switch (slug) {
    case 'heading':
      return { level: 'level-2' }
    case 'input':
      return { label: 'Input', value: '' }
    case 'alert':
      return { status: 'info', title: task.id, description: task.prompt }
    case 'empty-state':
      return { title: 'Nothing here yet', description: task.prompt }
    case 'card':
      return { variant: 'default' }
    case 'stack':
      return { direction: 'column', gap: '2' }
    case 'badge':
      return { variant: 'default' }
    case 'typography':
      return { variant: 'body' }
    default:
      return {}
  }
}

function baselineChildren(slug: string): Array<unknown> {
  switch (slug) {
    case 'heading':
      return ['Generated heading']
    case 'button':
      return ['Submit']
    case 'badge':
      return ['New']
    case 'typography':
      return ['Generated body copy.']
    default:
      return []
  }
}

/**
 * Deterministic in-repo baseline generator (NOT an LLM): tokenizes the task
 * prompt, selects components via the A2 intent search over contract data,
 * and assembles a ui-render v1.0 schema. Exists so the harness is exercised
 * end-to-end without a model budget; its outputs are clearly labeled.
 */
export function createTemplateBaselineGenerator(): Generator {
  return {
    id: 'template-baseline-v0 (deterministic intent-search assembly, non-LLM)',
    kind: 'template-baseline',
    async generate(task) {
      const hits = searchByIntent(task.prompt)
      const selected: string[] = []
      for (const hit of hits) {
        if (!RENDERABLE_SLUGS.has(hit.item.id)) continue
        if (selected.includes(hit.item.id)) continue
        selected.push(hit.item.id)
        if (selected.length >= 4) break
      }
      if (!selected.includes('stack')) selected.unshift('stack')

      const [rootSlug, ...rest] = selected
      const children = rest.map((slug) => ({
        component: slug,
        props: baselineProps(slug, task),
        children: baselineChildren(slug),
      }))
      const schema = {
        $schema: 'https://chameleon-ui.dev/schemas/ui-render/v1.0.json',
        version: '1.0',
        root: {
          component: rootSlug,
          props: baselineProps(rootSlug, task),
          children,
        },
      }
      return { schema, raw: JSON.stringify(schema) }
    },
  }
}

/**
 * External LLM generator: POSTs the task set entry to CU_BENCH_LLM_ENDPOINT
 * and expects `{ "schema": {...} }` back. Not exercised in this environment
 * (no endpoint, no budget); the code path is the documented reproduction seam.
 */
export function createHttpLlmGenerator(env: NodeJS.ProcessEnv): Generator {
  const endpoint = env.CU_BENCH_LLM_ENDPOINT?.trim()
  const model = env.CU_BENCH_LLM_MODEL?.trim() || 'unspecified-model'
  if (!endpoint) {
    throw new Error('CU_BENCH_LLM_ENDPOINT is required for the external-llm generator')
  }
  return {
    id: `external-llm:${model}`,
    kind: 'external-llm',
    async generate(task) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model, prompt: task.prompt, format: 'ui-render/v1.0' }),
      })
      if (!response.ok) {
        throw new Error(`LLM endpoint failed (${response.status})`)
      }
      const raw = await response.text()
      const parsed = JSON.parse(raw) as { schema?: unknown }
      return { schema: parsed.schema, raw }
    },
  }
}

/** Resolve the generator from the environment; undefined means "not configured". */
export function generatorFromEnv(env: NodeJS.ProcessEnv): Generator | undefined {
  const id = env.CU_BENCH_GENERATOR?.trim()
  if (!id) return undefined
  if (id === 'template-baseline') return createTemplateBaselineGenerator()
  if (id === 'external-llm') return createHttpLlmGenerator(env)
  throw new Error(`Unknown CU_BENCH_GENERATOR: ${id}`)
}

interface RenderableNode {
  component: string
  props?: Record<string, unknown>
  children?: Array<RenderableNode | string>
}

interface CompileCheck {
  ok: boolean
  slugs: string[]
}

/**
 * Mirror of schema-renderer compile rules (slug membership + depth/node caps)
 * without importing React into the bench harness. Keep aligned with
 * packages/schema-renderer/src/schema.ts.
 */
function checkSchemaCompiles(schema: unknown): CompileCheck {
  if (schema === null || typeof schema !== 'object') return { ok: false, slugs: [] }
  const root = (schema as { root?: unknown }).root
  if ((schema as { version?: unknown }).version !== '1.0' || root === null || typeof root !== 'object') {
    return { ok: false, slugs: [] }
  }
  const slugs: string[] = []
  let nodes = 0
  const walk = (node: RenderableNode | string, depth: number): boolean => {
    if (typeof node === 'string') return true
    nodes += 1
    if (nodes > 500 || depth > 32) return false
    if (typeof node.component !== 'string' || !RENDERABLE_SLUGS.has(node.component)) return false
    slugs.push(node.component)
    for (const child of node.children ?? []) {
      if (!walk(child, depth + 1)) return false
    }
    return true
  }
  const ok = walk(root as RenderableNode, 0)
  return { ok, slugs }
}

async function checkInstall(slugs: string[]): Promise<boolean> {
  const items: RegistryItem[] = []
  for (const slug of new Set(slugs)) {
    const item = registry.find((entry) => entry.id === slug)
    if (!item) return false
    items.push(item)
  }
  const kernel = createInstallKernel(registry)
  const dir = await mkdtemp(join(tmpdir(), 'cu-genui-gen-'))
  try {
    for (const item of items) {
      await kernel.install(item, dir, { source: 'cli' })
    }
    return true
  } catch {
    return false
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

/**
 * Run the generation-quality measurement, or report an honest null when no
 * generator is configured (no model budget; see docs/ai/genui-bench-quarterly.md).
 *
 * @complexity time O(t * (g + i)) | t = tasks, g = generation cost, i = install cost
 */
export async function runGenerationQuality(
  env: NodeJS.ProcessEnv = process.env,
): Promise<GenerationQualityResult> {
  const taskSet = await loadGenerationTaskSet()
  const generator = generatorFromEnv(env)
  const measuredAt = new Date().toISOString()

  if (!generator) {
    return {
      generator: null,
      taskSetVersion: taskSet.taskSetVersion,
      measuredAt,
      value: null,
      successes: 0,
      attempts: 0,
      note: `No generator configured (no model budget in this environment). Task set v${taskSet.taskSetVersion} is in-repo; set CU_BENCH_GENERATOR=template-baseline for the deterministic non-LLM baseline or CU_BENCH_GENERATOR=external-llm with CU_BENCH_LLM_ENDPOINT for a model run. M8 slip documented — null is honest, fabrication is not.`,
      outcomes: [],
    }
  }

  const outcomes: GenerationTaskOutcome[] = []
  for (const task of taskSet.tasks) {
    let outcome: GenerationTaskOutcome
    try {
      const generated = await generator.generate(task)
      const compile = checkSchemaCompiles(generated.schema)
      const covers = compile.ok && task.expectSlugs.every((slug) => compile.slugs.includes(slug))
      const installOk = compile.ok && covers ? await checkInstall(compile.slugs) : false
      outcome = {
        taskId: task.id,
        passed: compile.ok && covers && installOk,
        compileOk: compile.ok,
        coversExpected: covers,
        installOk,
        selectedSlugs: compile.slugs,
        raw: generated.raw,
      }
    } catch (error) {
      outcome = {
        taskId: task.id,
        passed: false,
        compileOk: false,
        coversExpected: false,
        installOk: false,
        selectedSlugs: [],
        raw: error instanceof Error ? error.message : String(error),
      }
    }
    outcomes.push(outcome)
  }

  const successes = outcomes.filter((outcome) => outcome.passed).length
  const attempts = outcomes.length
  return {
    generator: generator.id,
    taskSetVersion: taskSet.taskSetVersion,
    measuredAt,
    value: attempts === 0 ? null : successes / attempts,
    successes,
    attempts,
    note: `Measured with generator "${generator.id}" on task set v${taskSet.taskSetVersion} (${taskSet.frozenAt}). Reproduce: CU_BENCH_GENERATOR=... pnpm bench:genui. Definition: ${taskSet.metricDefinition}`,
    outcomes,
  }
}
