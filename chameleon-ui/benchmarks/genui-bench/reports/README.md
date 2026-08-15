Reports are written by `pnpm bench:genui`. Do not commit invented scores.

- `latest.json` / `latest.md` / `index.html` — gitignored local outputs (default path keeps `generation_quality` null without a generator).
- `generation-quality-template-baseline.json` — committed harness measurement for `CU_BENCH_GENERATOR=template-baseline` (not an LLM score).
