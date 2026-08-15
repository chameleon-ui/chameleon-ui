# SchemaRenderer

Package: `@chameleon-ui/schema-renderer`. Renders a JSON tree into components using a **fixed default map of 10 slugs**.

| Adapter | Status |
| :--- | :--- |
| `@chameleon-ui/adapter-a2ui` | supported |
| `@chameleon-ui/adapter-mcp-apps` | supported |
| `@chameleon-ui/adapter-ag-ui` | **POC** — do not treat as supported |

## Emit this shape

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

Committed examples: `packages/schema-renderer/examples/` (`login-form.json`, `status-card.json`, `empty-results.json`). Copy into the consumer — the package does not export an `examples` subpath.

## Render

### React

```tsx
import { SchemaRenderer } from "@chameleon-ui/schema-renderer";
import schema from "./login-form.json";

export function Page() {
  return <SchemaRenderer schema={schema} />;
}
```

### Vue

```ts
import { SchemaRenderer } from "@chameleon-ui/schema-renderer/vue";
```

Same 10-slug default map.

## Default map (10 slugs only)

`alert` · `badge` · `button` · `card` · `divider` · `empty-state` · `heading` · `input` · `stack` · `typography`

Unknown slugs render a `data-schema-error` placeholder (no white screen). Limits: depth ≤ 32, nodes ≤ 500.

`table`, `chart`, `kpi-dashboard`, `tabs`, `grid`, and the rest of the catalog are **not** in the default map. Import them from `@chameleon-ui/react` or `@chameleon-ui/vue` (or pass a custom `map` prop). Do **not** claim full-catalog SchemaRenderer coverage.

## Not this package

- Wire formats (A2UI / MCP Apps / AG-UI) → matching `adapter-*` (AG-UI remains POC).
- File scaffolding → `install-core` / `chameleon add`. SchemaRenderer only renders.
