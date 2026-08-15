# Format-check fixtures only

`盲测结果.dry-run.example.json` is produced by:

```bash
cd chameleon-ui
corepack pnpm@9.15.0 blind:validate -- --dry-run-format
```

It uses `kind=dry-run-fixture` / `captureSource=dry-run-fixture`.  
**Never** promote it to `盲测结果.json` or treat its `rate` as a product recognition rate. Ingest rejects it.
