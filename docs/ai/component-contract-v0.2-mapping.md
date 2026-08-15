# Component contract v0.2 — key mapping

Canonical schema: `https://chameleon-ui.dev/schemas/component-contract/v0.2.json` (docs-site mirror: `/schemas/component-contract/v0.2.json`; public host pending).

On-disk contracts: `packages/components/src/<slug>/contract.json`. MCP: `get_contract` with `{ "slug": "…" }`. Intent vocabulary: [`data-ai-vocabulary.md`](./data-ai-vocabulary.md).

Project key names are **canonical v0.2**. An older report (§8.2) used different names for some fields — map below for external validators. Semantics are unchanged.

## Why keys were not renamed across the catalog

- Catalog contracts, registry, docs-site copies, and intent search already consume these keys.
- Report §8.2 was a field-naming proposal, not a published standard.
- The table below is enough for mechanical rename at validation time (no semantic loss).

## Canonical v0.2 ↔ report §8.2

| Canonical v0.2 | Report §8.2 | Notes / convert |
| :--- | :--- | :--- |
| `purpose` | `purpose` | identity |
| `scenarios` | `scenarios` | identity |
| `props` | `props` | identity |
| `variants` | `variants` | identity |
| `states` | `states` | identity |
| `composition` | `compositionRules` | rename key; child keys identity |
| `antiPatterns` | `antiPatterns` | identity |
| `a11y` | `a11y` | identity |
| `responsive` | `threeEndBehavior` (web slice) | rename; platforms split out |
| `platforms` | `threeEndBehavior` (platform matrix) | rename |
| `rtl` | `rtlBehavior` | rename |
| `dataAi` | (report §8.1 runtime markers) | required in v0.2: `role` + `states` + `intents` |
| `telemetry` | — | reserved hook names; default no send |
| `mechanics` | — | optional; morph / pairing notes |
| `usage` | — | optional; ordered steps |
| `exports` | — | optional; component / hook / function / type |
| `props.*.payload` | — | optional; meaningful when `type=event` |

Optional in v0.2 (non-breaking): `mechanics`, `usage`, `exports`, `props.payload`. Omitting them is valid.

## v0.1 → v0.2 breaking changes

1. `schemaVersion`: `0.1` → `0.2`.
2. Top-level `required` adds `dataAi`.
3. `dataAi.required`: `["role"]` → `["role","states","intents"]` (`intents` ≥ 1; each intent must appear in [`data-ai-vocabulary.md`](./data-ai-vocabulary.md)).
4. No key renames or deletions vs v0.1 document shape. Archive schema: `schemas/component-contract.v0.1.json`.

## External validators

Load the v0.2 JSON Schema (2020-12). To speak report §8.2 names, rewrite keys per the table above before/after validate — semantics stay the same.
