import { describe, expect, it } from 'vitest'
import { BENCH_METRIC_IDS, RESERVED_METRIC_IDS } from './ids'

describe('GenUI-Bench metric dictionary', () => {
  it('has at least three citable ids plus a reserved enterprise column', () => {
    expect(BENCH_METRIC_IDS.length).toBeGreaterThanOrEqual(4)
    expect(BENCH_METRIC_IDS.filter((id) => id.startsWith('bench.')).length).toBe(
      BENCH_METRIC_IDS.length,
    )
    expect(RESERVED_METRIC_IDS).toContain('bench.generation_quality')
    expect(BENCH_METRIC_IDS).toContain('bench.install_success_rate')
    expect(BENCH_METRIC_IDS).toContain('bench.bundle_install_success_rate')
    expect(BENCH_METRIC_IDS).toContain('bench.idempotent_reinstall_rate')
  })
})
