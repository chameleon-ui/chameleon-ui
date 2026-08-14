# GenUI-Bench report

Generated: 2026-08-14T01:48:12.430Z

Registry: 101 components, 8 themes.

Telemetry default off: true

| Metric | Value | n | Note |
| :--- | :--- | :--- | :--- |
| `bench.install_success_rate` | 1.0000 | 101/101 | Single-item install through createInstallKernel (source=cli). |
| `bench.bundle_install_success_rate` | 1.0000 | 101/101 | Component + theme ant-blue into the same target directory. |
| `bench.idempotent_reinstall_rate` | 1.0000 | 101/101 | Second install must skip identical files. |
| `bench.docs_cta_install_success_rate` | 1.0000 | 101/101 | Same kernel as the docs CTA, source=docs. Docs app itself does not write files. |
| `bench.conflict_reject_rate` | 1.0000 | 1/1 | Different on-disk content must throw InstallError before write. |
| `bench.generation_quality` | null (reserved) | 0/0 | No generator configured (no model budget in this environment). Task set v1.0.0 is in-repo; set CU_BENCH_GENERATOR=template-baseline for the deterministic non-LLM baseline or CU_BENCH_GENERATOR=external-llm with CU_BENCH_LLM_ENDPOINT for a model run. M8 slip documented — null is honest, fabrication is not. |

## Generation quality detail (Phase 8 A6)

Generator: none configured (honest null)
Task set: v1.0.0 · Measured at: 2026-08-14T01:48:12.430Z

No outcomes: generator not configured. Set CU_BENCH_GENERATOR to measure.

## Reproduce

```
cd chameleon-ui
corepack pnpm@9.15.0 bench:genui
# generation_quality measurement (optional, needs a generator):
#   CU_BENCH_GENERATOR=template-baseline pnpm bench:genui
```

This file is produced by the harness. Do not hand-edit numbers.
