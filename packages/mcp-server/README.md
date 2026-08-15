# @chameleon-ui/mcp-server

A stdio Model Context Protocol server for Chameleon UI. All file writes go
through `@chameleon-ui/install-core`. Read-only tools (`get_started`,
`list_components`, `get_contract`, `get_design_rules`, `get_import_specifiers`)
do not write disk.

Consumer agents: follow `chameleon-ui/AGENTS.md` and
[`docs/ai/agent-consume.md`](../../docs/ai/agent-consume.md). On attach,
`initialize` returns `instructions`. Call **`get_started` first**, then
`get_import_specifiers` before writing any CSS/JS import.

## Run

Build once, then:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
node ./packages/mcp-server/dist/index.js
```

The server reads JSON-RPC messages on stdin and writes responses on stdout.
Logs and telemetry are sent to stderr.

## Attach in Cursor

After `pnpm --filter @chameleon-ui/mcp-server build`, put this in
`.cursor/mcp.json` (Cursor) or `.mcp.json` (Claude Code) of the **consumer
app**. Do **not** hardcode machine roots (`D:/…`, `/Users/…`).

Consumer workspace as cwd; point at the library with a **relative** path (sibling checkout example):

```json
{
  "mcpServers": {
    "chameleon-ui": {
      "command": "node",
      "args": ["../chameleon-ui/packages/mcp-server/dist/index.js"],
      "env": {
        "CU_TARGET_DIR": "."
      }
    }
  }
}
```

- `args[0]` — relative path from the consumer app to `packages/mcp-server/dist/index.js` inside the `chameleon-ui/` checkout. Adjust `../chameleon-ui/...` if your layout differs.
- `CU_TARGET_DIR` — `.` writes `install_*` into the consumer (resolved from the MCP process cwd, usually the consumer workspace).
- Prefer package bin when `cwd` is the library: `"command": "pnpm"`, `"args": ["--filter", "@chameleon-ui/mcp-server", "exec", "chameleon-mcp"]`, `"cwd": "../chameleon-ui"`, and set `CU_TARGET_DIR` to a path **relative to that library cwd** (e.g. `../my-app`) — not `.`.

Read-only tools work with the bundled catalog even when the target dir is
empty. Packages are unpublished (`0.2.0`); `npx @chameleon-ui/mcp-server`
is **not** available until a registry publish.

Copy-paste consumer rule: [`docs/ai/consumer-agent-bootstrap.md`](../../docs/ai/consumer-agent-bootstrap.md).

## Tools

| Tool | Description |
| :--- | :--- |
| `get_started` | **Call first.** Catalog summary, CSS + `ThemeProvider theme="line"`, tool order, templates, never-do. |
| `list_components` | Catalog slugs by family (browse). Prefer `search_components` + `intent` for needs. |
| `search_components` | Search by `query` (id/name) or `intent` (contract-driven, explainable) |
| `get_component` | Full registry item (files + deps). Prefer `get_contract` for the v0.2 JSON |
| `get_contract` | v0.2 `contract.json` by slug |
| `get_design_rules` | `design-rules.json` by theme id (or community rules pack id) |
| `get_import_specifiers` | Legal CSS/JS specifiers for an external app. Default theme `line`. Call before writing imports. |
| `list_themes` | The 8 official tribute themes (flagship: `line`) |
| `install_component` | Install one component via install-core |
| `install_block` | Install one scenario block (`registry:block`) + component deps via install-core |
| `install_theme` | Install one theme via install-core |
| `install_bundle` | Component + theme (two runs). Prefer `install_with_theme` |
| `install_with_theme` | Component + tokens + fonts + design-rules in one idempotent run |
| `telemetry_opt_out` | Disable telemetry and emit opt-out |
| `record_intent` | Intent-vs-adopt telemetry (no-op unless `CU_TELEMETRY=1`) |

## Environment

- `CU_TARGET_DIR` — install target directory (default: `./chameleon-ui`)
- `CU_TELEMETRY=1` — enable telemetry (off by default)
- `CU_REGISTRY_URL` — optional private registry base URL (bundled catalog if unset)
- `CU_REGISTRY_TOKEN` — bearer token; required when `CU_REGISTRY_URL` is set
- `CU_REGISTRY_NAMESPACE` — namespace (default: `public`)

## Telemetry

Telemetry is **off by default**. When enabled, install and opt-out events are
logged to stderr as JSON. No source code or secrets are collected, and no
network analytics SDK is used.

## Tests

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server test
```
