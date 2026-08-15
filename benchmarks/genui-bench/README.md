# GenUI-Bench

First-period install harness for Chameleon UI. It calls **real**
`@chameleon-ui/install-core` against the live `@chameleon-ui/registry`.
It does not talk to npm, Lighthouse, or a public leaderboard.

## Metrics

| Id | Meaning |
| :--- | :--- |
| `bench.install_success_rate` | Single component install via the kernel (`source=cli`) |
| `bench.bundle_install_success_rate` | Component + first theme into one target dir |
| `bench.idempotent_reinstall_rate` | Second install skips identical files |
| `bench.docs_cta_install_success_rate` | Same kernel, `source=docs` (docs CTA path; the docs app does not write) |
| `bench.conflict_reject_rate` | Different on-disk content is rejected |
| `bench.block_install_success_rate` | Phase 7: each `registry:block` installs via the kernel and reinstalls idempotently |
| `bench.generation_quality` | Phase 8: measured when a generator is configured (`CU_BENCH_GENERATOR`); **null** by default because no model budget/endpoint exists in this environment. Null is honest; fabrication is not. Task set: `tasks/generation-tasks.json`. |

## Reproduce

From `chameleon-ui/`:

```
corepack pnpm@9.15.0 bench:genui
```

Writes `benchmarks/genui-bench/reports/latest.json`, `latest.md`, and `index.html`.
Those files are generated; do not hand-edit the numbers.

Linked from the docs site at `/en/bench` and `/zh-CN/bench`.
