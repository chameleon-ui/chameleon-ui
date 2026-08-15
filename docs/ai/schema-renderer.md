# SchemaRenderer — JSON → component tree

Package: `@chameleon-ui/schema-renderer`. **supported** for the default map below. Protocol adapters are separate: `adapter-a2ui` / `adapter-mcp-apps` = supported; `adapter-ag-ui` = **POC** (do not treat as supported).

## Emit this

```json
{
  "$schema": "https://chameleon-ui.dev/schemas/ui-render/v1.0.json",
  "version": "1.0",
  "root": {
    "component": "card",
    "props": { "variant": "outlined", "padding": "lg" },
    "children": [
      { "component": "heading", "props": { "level": "level-2" }, "children": ["Sign in"] },
      {
        "component": "stack",
        "props": { "direction": "column", "gap": "2" },
        "children": [
          { "component": "input", "props": { "label": "Email", "value": "", "type": "email" } },
          { "component": "button", "props": { "variant": "solid" }, "children": ["Continue"] }
        ]
      }
    ]
  }
}
```

Committed examples: `chameleon-ui/packages/schema-renderer/examples/` (`login-form.json`, `status-card.json`, `empty-results.json`). Prefer copying those.

## Render

Copy `packages/schema-renderer/examples/login-form.json` into the consumer app (the package does not export an examples subpath). Then:

```tsx
import { SchemaRenderer } from "@chameleon-ui/schema-renderer";
import schema from "./login-form.json";

export function Page() {
  return <SchemaRenderer schema={schema} />;
}
```

Vue: `import { SchemaRenderer } from "@chameleon-ui/schema-renderer/vue"`. Same 10-slug default map.

## Default map (10 slugs only)

`alert` · `badge` · `button` · `card` · `divider` · `empty-state` · `heading` · `input` · `stack` · `typography`

Unknown slugs become a `data-schema-error` placeholder (no white screen). Depth ≤ 32, nodes ≤ 500.

`table`, `chart`, `kpi-dashboard`, `tabs`, `grid` and the rest of the catalog are **not** in the default map. Import them from `@chameleon-ui/components` or `@chameleon-ui/components-vue`, or pass a custom `map` prop. Do not claim full-catalog SchemaRenderer coverage.

## Not this package

- A2UI / MCP Apps / AG-UI wire format → use the matching `adapter-*` (AG-UI remains POC).
- `install-core` writes files; SchemaRenderer only renders.
