# Phase 1 size budgets

Numbers come from `docs/engineering/工程约定与命名规范.md` §11.1. This directory is not a pnpm package.

| File | Role |
| :--- | :--- |
| `budgets.json` | S1/S3/S4 hard gates and S5 sample limits |
| `reports/lhci-latest.json` | Phase 9 Lighthouse R1–R3 **generated** artifact (`pnpm perf:lhci`). Do not hand-edit. Unmeasured runs must set `status=unmeasured` with a reason. |
| `scripts/check-size.mjs` | Root `perf:size` implementation (S1/S3/S4 hard + S5 AppShell+common-10 sample) |
| `fixtures/oversize.mjs` | Note only. The S1 reject sample is a high-entropy buffer inside `check-size.mjs` (`'x'.repeat` is not valid gzip evidence). |

POC whole-app gzip is **not** an S1 measurement. Peers (React, Ark UI / Zag) are external.

## GenUI-Bench

`benchmarks/genui-bench` is a pnpm package. It installs live registry items through
`@chameleon-ui/install-core` and writes `reports/latest.json`. Root script:
`pnpm bench:genui`. Do not hand-edit the numbers.

