# @chameleon-ui/install-core

Shared install kernel for the Chameleon UI CLI and MCP server. This is the **only**
package that writes files to disk when installing components or themes.

## Phase 1 status

Implemented:

- Dependency graph resolution with cycle detection (`C6`).
- Install planning.
- Conflict detection before writing.
- Idempotent file writes (identical files are skipped on re-run).
- Optional `install` telemetry behind a caller-provided `TelemetryHook`.
- Phase 4 discipline packs: rules merge conflict detection (U9 errors), paid
  download auth port (status codes only; no payment SDK), official homage ids
  stay free SKUs (paid community packs allowed).
- Stable public APIs for CLI and MCP.

Not implemented (install-core still does **not**):

- Network downloads or remote registry fetching (that lives in `@chameleon-ui/registry` HTTP client / `@chameleon-ui/registry-private`).
- Script execution during install.
- Rollback of partial writes beyond up-front conflict detection.

## Public API

```ts
import {
  install,
  createInstallKernel,
  emitOptOut,
  emitIntentVsAdopt,
  mergeDesignRules,
  assertPaidRulesListingAllowed,
  createStubRulesDownloadAuth,
  type RegistryItem,
  type InstallRequest,
  type InstallResult,
  type TelemetryHook,
} from '@chameleon-ui/install-core';
```

- `install(req: InstallRequest): Promise<InstallResult>` — install a single
  registry item without dependency resolution. Throws `InstallError` on conflict.
- `createInstallKernel(registry): InstallKernel` — install an item plus its
  declared dependencies, in topological order. This is the single kernel that
  CLI and MCP must use.
- `emitOptOut(hook?, payload?)` / `emitIntentVsAdopt(hook?, payload)` — helpers
  to emit telemetry events when a hook is provided.

## Telemetry

Telemetry is **off by default**. install-core never sends data itself. Callers
may pass a `TelemetryHook` to receive events:

- `install` — emitted after a successful write (`itemId`, `itemType`, `source`, optional `namespace` / `version`).
- `intent_vs_adopt` — emitted by MCP/CLI after a search recommendation.
- `opt_out` — emitted when the user disables telemetry.

The hook must **not** collect source code or secrets. The CLI and MCP read the
`CU_TELEMETRY` environment variable (`CU_TELEMETRY=1` to enable); otherwise no
hook is passed and no events are recorded.
