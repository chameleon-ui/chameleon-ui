import { describe, expect, it } from 'vitest'
import {
  createTemplateBaselineGenerator,
  loadGenerationTaskSet,
  runGenerationQuality,
} from './generation.js'

describe('A6 generation_quality harness', () => {
  it('stays honestly null when no generator is configured', async () => {
    const result = await runGenerationQuality({})
    expect(result.value).toBeNull()
    expect(result.generator).toBeNull()
    expect(result.attempts).toBe(0)
    expect(result.note).toContain('CU_BENCH_GENERATOR')
  })

  it('measures the deterministic template baseline end-to-end', async () => {
    const result = await runGenerationQuality({ CU_BENCH_GENERATOR: 'template-baseline' })
    expect(result.generator).toContain('template-baseline-v0')
    expect(result.attempts).toBeGreaterThanOrEqual(8)
    expect(result.value).not.toBeNull()
    expect(result.value).toBeGreaterThanOrEqual(0)
    expect(result.value).toBeLessThanOrEqual(1)
    // 存证: every outcome keeps the raw generator output for reproduction.
    for (const outcome of result.outcomes) {
      expect(outcome.raw.length).toBeGreaterThan(0)
    }
  }, 30000)

  it('freezes a task set with explicit expectations', async () => {
    const taskSet = await loadGenerationTaskSet()
    expect(taskSet.taskSetVersion).toBe('1.0.0')
    expect(taskSet.tasks.length).toBeGreaterThanOrEqual(8)
    for (const task of taskSet.tasks) {
      expect(task.expectSlugs.length).toBeGreaterThan(0)
    }
  })

  it('template baseline output compiles against the renderable slug set', async () => {
    const generator = createTemplateBaselineGenerator()
    const taskSet = await loadGenerationTaskSet()
    const result = await generator.generate(taskSet.tasks[0]!)
    const schema = result.schema as { version: string; root: { component: string } }
    expect(schema.version).toBe('1.0')
    expect(typeof schema.root.component).toBe('string')
  })
})
