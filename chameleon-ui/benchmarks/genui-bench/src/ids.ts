/** Stable GenUI-Bench metric ids. Enterprise columns stay reserved. */
export const BENCH_METRIC_IDS = [
  'bench.install_success_rate',
  'bench.bundle_install_success_rate',
  'bench.idempotent_reinstall_rate',
  'bench.docs_cta_install_success_rate',
  'bench.conflict_reject_rate',
  'bench.block_install_success_rate',
  'bench.generation_quality',
] as const

export type BenchMetricId = (typeof BENCH_METRIC_IDS)[number]

export const RESERVED_METRIC_IDS = ['bench.generation_quality'] as const
