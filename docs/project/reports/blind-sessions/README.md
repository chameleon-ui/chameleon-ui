# Blind session inbox

Drop harness exports here via:

```bash
cd chameleon-ui
corepack pnpm@9.15.0 blind:ingest -- path/to/盲测结果.<testerId>.json
```

Files must be **complete human sessions** (16 trials). Dry-run fixtures are rejected.  
Promote only with ≥5 unique testers: `pnpm blind:ingest -- --promote`

See [`../2026-08-15-blind-test-operator-kit.md`](../2026-08-15-blind-test-operator-kit.md).
