/**
 * Evidence note for S1 reject samples.
 * Do not use `'x'.repeat(n)` as a gzip oversize fixture — gzip stores it in tens of bytes.
 * `perf:size` generates a deterministic high-entropy buffer in check-size.mjs instead.
 */
export const note = 'S1 oversize evidence lives in benchmarks/scripts/check-size.mjs'
