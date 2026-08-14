# @chameleon-ui/registry

Phase 2 registry catalog for Chameleon UI. JSON entries under `registry/r/` (components)
and `registry/t/` (themes) are the install payloads. Discipline packs live under
`registry/rules/` with `type: registry:rules`. **File writes still happen only in
`@chameleon-ui/install-core`.** CLI, MCP, docs CTA, and GenUI-Bench read this catalog and
pass items to the kernel. This package does not write user project files.

## Entries

50 component slugs from [`packages/components/catalog.json`](../components/catalog.json)
plus 8 Phase 2 themes. Sync from source with:

```bash
pnpm --filter @chameleon-ui/registry sync
```

`--check` (used by `test`) fails if a generated entry is missing or stale.

| Kind | IDs |
| :--- | :--- |
| `registry:ui` | all 50 catalog slugs (`button`, `app-shell`, `accordion`, … `slider`) |
| `registry:theme` | `line`, `silver-arrow`, `stuttgart`, `corsa`, `cupertino`, `siren`, `wechat`, `ant-blue` |
| `registry:rules` | `community-focus-first`（社区纪律包；`rules/<id>/` 写盘路径） |

## Public API

```ts
import {
  registry,
  getRegistryItem,
  searchRegistry,
  listThemes,
  listComponents,
  listRulesPacks,
  prepareRulesInstall,
  type RegistryItem,
} from '@chameleon-ui/registry';
```

These names are the CLI/MCP contract. Do not rename them.

Bundled items also expose `namespace` (`public`) and `version` (`0.0.0`) at
load time. The JSON files under `registry/` stay schema-compatible; those two
fields are filled in by the loader so private servers can speak the same item
shape.

## Private registry client

When `CU_REGISTRY_URL` is unset, CLI/MCP keep using this bundled catalog (local
R&D, no remote). When it is set, they fetch the same `RegistryItem` schema from
a private server with `CU_REGISTRY_TOKEN` and optional `CU_REGISTRY_NAMESPACE`.

```ts
import {
  createRegistryClientFromEnv,
  createHttpRegistryClient,
  prepareInstall,
} from '@chameleon-ui/registry';
```

File writes still happen only in `@chameleon-ui/install-core`.
