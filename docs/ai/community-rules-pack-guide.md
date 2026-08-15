# Community design-rules packs

A **rules pack** is the “bone” of a theme: `design-rules.json` plus optional token overrides. Sample pack: `community-focus-first`.

## Create

Directory contents:

| File | Required | Notes |
| :--- | :--- | :--- |
| `design-rules.json` | yes | Validated against design-rules schema |
| `meta.json` | yes | `id`, `label`, `kind: "community"`, `pricing` |
| `tokens.json` | yes | May be `{}` |

Rules:

- Pack `id` **must** use the `community-` prefix.
- Official homage ids (`line` · `silver-arrow` · `stuttgart` · `corsa` · `cupertino` · `siren` · `wechat` · `ant-blue`) are reserved — community packs must not reuse them as paid SKUs (`install-core` `rules-policy` rejects that).
- Schema: `packages/contract/schemas/design-rules.schema.json` (`$id`: `https://chameleon-ui.dev/schemas/design-rules/v1.0.json`; docs-site mirror `/schemas/design-rules/v1.0.json`; public GET pending — do not claim it is live).

## Validate

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/themes validate-rules -- --file <path/to/design-rules.json>
```

Same code path as CI (`packages/themes/scripts/validate-rules.mjs`). Invalid fields → non-zero exit with field path.

## Register

- Source theme dir: `packages/themes/src/<id>/`
- Registry entry: `packages/registry/registry/rules/<id>.json` (generated via `sync-catalog.mjs`)
- Market listings: `type: "registry:rules"`; paid packs go through `RulesDownloadAuthPort` / `prepareRulesInstall`; free packs install without that gate

Before listing: schema valid · `community-` prefix · `meta.kind=community` · pricing policy legal.

## Install

Writes go **only** through `install-core` (idempotent):

```bash
chameleon add community-focus-first
# or MCP install_* / market CTA — source ∈ {cli, mcp, docs, market}
```

On disk: `rules/<id>/{design-rules.json, meta.json, tokens.json}`. Re-run skips existing files.

Lifecycle test: `packages/registry/src/__tests__/community-rules-lifecycle.test.ts`.

## Sample pack paths

| Step | Path |
| :--- | :--- |
| Source | `packages/themes/src/community-focus-first/` |
| Broken fixture | `packages/registry/test-fixtures/community-rules/broken-design-rules.json` |
| Registry | `packages/registry/registry/rules/community-focus-first.json` |

## Hard rules

- No second write path for installs (`scripts/scan-bypass-writes.mjs` is in CI).
- Do not list packs that fail `validate-rules`.
