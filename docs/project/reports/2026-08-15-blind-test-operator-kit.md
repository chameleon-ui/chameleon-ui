# Blind-test operator kit (2026-08-15)

> **Goal:** land real human recognition scores under [`盲测协议.md`](./盲测协议.md) without inventing percentages.  
> **A9.5 today:** still **`PROTOCOL-READY`** (`rate=null`). This kit is how the owner finishes with **5 people in under one day**.  
> Harness: `http://127.0.0.1:5175/?view=blind` · Schema: [`schemas/blind-test-result.schema.json`](./schemas/blind-test-result.schema.json)

## What only humans can still do

| Humans must… | Scripts will never… |
| :--- | :--- |
| Look at each stimulus and pick a theme / `unknown` | Invent `guess` or `correct` |
| Export JSON from the demo after 16 trials | Type a recognition % into the kanban |
| Be ≥5 independent people for aggregate | Promote A9.5 / ≥80% from a single session or dry-run |

Automated UI tests may click through the harness to prove the path works; those exports are **not** product rates. Dry-run fixtures use `kind=dry-run-fixture` and are rejected by ingest.

## One-command demo (operator)

From `chameleon-ui/` (PATH must include corepack shims on Windows):

```bash
# Terminal A — start demo
corepack pnpm@9.15.0 demo

# Terminal B — open blind view
corepack pnpm@9.15.0 demo:blind
```

Or one terminal that starts demo + opens the URL:

```bash
corepack pnpm@9.15.0 demo:blind -- --with-demo
```

URL opened: `http://127.0.0.1:5175/?view=blind&locale=en`  
Chinese facilitators: append `&locale=zh-CN` manually if needed.

## Printable runbook (one sheet per tester)

1. Sit the tester at a normal browser window. **No** DevTools, **no** viewing page source / `data-theme`.
2. Open the blind URL above. Confirm chrome does **not** show a theme name and the address bar has **no** `theme=`.
3. Enter a stable tester id (e.g. `alice`, `bob`, `operator-local` only for the operator’s own honest run).
4. Check the honesty checkbox → **Start session**.
5. For each of **16** screens (8 themes × 2, shuffled): look → choose one of the 8 ids or `unknown` → **Lock in guess**. No mid-session reveal.
6. At the end: **Download JSON** (filename `盲测结果.<testerId>.json`) or Copy JSON.
7. Hand the file to the owner. Do **not** announce the on-screen “X of 16” as a product metric.

Timebox: ~8–12 minutes per person.

## Owner: ingest + merge (no invented numbers)

```bash
cd chameleon-ui

# Validate one export (rejects mismatched correct flags / hand-typed rates)
corepack pnpm@9.15.0 blind:validate -- ../path/to/盲测结果.alice.json

# Store under docs/project/reports/blind-sessions/
corepack pnpm@9.15.0 blind:ingest -- ../path/to/盲测结果.alice.json

# Repeat for bob/cara/dan/erin…

# When ≥5 unique human tester files exist:
corepack pnpm@9.15.0 blind:ingest -- --promote
```

`--promote` behavior:

| Sessions | Writes | `rate` | A9.5 |
| :--- | :--- | :--- | :--- |
| Fewer than 5 | `_aggregate.partial.json` + pending stays `not_run` / `rate=null` | null | PROTOCOL-READY |
| ≥5 | `盲测结果.json` + pending mirror | `correct/answered` from trials only | Updated only then; `slogan80Allowed` only if rate ≥ 0.8 |

Dry-run format check (does **not** publish a product rate):

```bash
corepack pnpm@9.15.0 blind:validate -- --dry-run-format
# → docs/project/reports/fixtures/盲测结果.dry-run.example.json
```

## Finish in under one day with 5 people

| Slot | Action |
| :--- | :--- |
| 09:00 | Owner starts `pnpm demo`, prints this page, prepares 5 tester ids |
| 09:15–11:00 | Rotate 5 people (~10 min each + buffer). Collect 5 JSON downloads |
| 11:00 | `blind:validate` each file → `blind:ingest` each → `blind:ingest -- --promote` |
| 11:15 | If aggregate `rate ≥ 0.8`, owner may update commercial narrative **with the linked JSON**; else keep 「一眼认出 ≥80%」 unchecked |

## Paths (SSOT)

| Artifact | Path |
| :--- | :--- |
| Protocol | `docs/project/reports/盲测协议.md` |
| Pending (honest empty) | `docs/project/reports/盲测结果.pending.json` |
| Session inbox | `docs/project/reports/blind-sessions/` |
| Aggregate (after ≥5) | `docs/project/reports/盲测结果.json` |
| A9.5 decision | `docs/project/reports/A9.5-decision.json` |
| Theme quantification | `docs/project/reports/2026-08-15-theme-quantification.md` (`recognition_rate=null` until real JSON) |
| Schema | `docs/project/reports/schemas/blind-test-result.schema.json` |

## Honesty gates

- Never edit `rate` by hand in pending or aggregate.
- Never promote a Playwright / unit-test perfect score as recognition evidence.
- Theme quantification KB / design-rules counts are **not** recognition rates.
- Until `--promote` with ≥5 humans succeeds, product claim 「一眼认出 ≥80%」 remains **forbidden**.
