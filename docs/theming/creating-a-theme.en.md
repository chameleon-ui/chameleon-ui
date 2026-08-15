# Create a Custom Theme

> **English · [简体中文](creating-a-theme.md) · [繁體中文（香港）](creating-a-theme.zh-HK.md) · [العربية](creating-a-theme.ar.md)**

This guide shows you how to add **your own theme** to Chameleon UI. It is based on the real mechanism: a theme is an **overlay** — it overrides only a subset of the core tokens rather than copying the whole set — and the `themes` build script compiles it into a single CSS variable file.

> Prerequisite: you have run `pnpm install` at the repo root and are familiar with `packages/themes` and `packages/tokens`.

---

## 1. Understand: theme = overlay

- **core** lives in `packages/tokens/src/core/` — the single authoritative source for all design tokens (color, spacing, radius, shadow, motion, typography).
- **Theme directory** lives in `packages/themes/src/<id>/`; its `tokens.json` only describes **what you want to change**. Uncovered tokens inherit from core.
- Component CSS and themes consume these values via **CSS custom properties** (`--cu-*`).

A minimal theme directory has 4 files:

```
src/<id>/
├── tokens.json        # overlay: overrides a subset of core tokens (required)
├── design-rules.json  # typography / spacing / radius / contrast / forbidden patterns (required)
├── meta.json          # id / label / preview / fonts (required; id must equal the dir name)
└── effects.css        # optional: radius/shadow/motion language, appended into CSS on build
```

---

## 2. Step 1: create the theme directory

Create a directory under `packages/themes/src/` (ids are lowercase hyphenated, e.g. `my-brand`):

```bash
mkdir packages/themes/src/my-brand
```

### 2.1 `tokens.json` (overlay)

Only write the tokens you want to change. The `$type`/key style and the `{...}` reference syntax below match the real core shape (compare `packages/tokens/src/core/*.json`).

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#0ea5e9" },
      "ink":   { "$value": "#0b1220" },
      "paper": { "$value": "#fbfcfd" }
    },
    "background": {
      "default":   { "$value": "{color.palette.paper}" },
      "subtle":    { "$value": "#eef4f8" },
      "elevated":  { "$value": "{color.palette.paper}" },
      "inverse":   { "$value": "{color.palette.ink}" }
    },
    "fg": {
      "default": { "$value": "{color.palette.ink}" },
      "muted":   { "$value": "#52606e" }
    }
  },
  "radius": {
    "sm": { "$value": { "value": 6, "unit": "px" } },
    "md": { "$value": { "value": 10, "unit": "px" } },
    "lg": { "$value": { "value": 16, "unit": "px" } }
  }
}
```

**Key rules**
- References use `{...}` to point at existing tokens, e.g. `{color.palette.ink}`; they are expanded by the compiler to avoid repeating literals.
- You do **not** need to enumerate the whole core — only what you change.
- To **inherit another theme** instead of core, add `"$extends": "./line/tokens.json"` at the top (the ref must resolve inside `packages/themes/src`; escaping is disallowed).

### 2.2 `meta.json` (required; id must equal the dir name)

```json
{
  "id": "my-brand",
  "label": "My Brand",
  "preview": { "accent": "#0ea5e9", "surface": "#fbfcfd" },
  "fonts": { "sans": "system-ui, sans-serif" }
}
```

> The build asserts `meta.id === dirName`; a mismatch throws.

### 2.3 `design-rules.json` (required)

Compare the full structure of the official themes (e.g. `packages/themes/src/line/design-rules.json`). Minimal usable version:

```json
{
  "version": "1.0",
  "typography": {
    "scale": "major-third",
    "lineHeightBody": 1.5,
    "fontFamilyToken": "font.family.sans",
    "headingWeightToken": "font.weight.semibold"
  },
  "spacing": {
    "rhythm": 8,
    "density": "comfortable",
    "scale": {
      "strategy": "rem-steps",
      "steps": ["space.0", "space.1", "space.2", "space.3", "space.4", "space.5", "space.6"]
    },
    "radiusStrategy": {
      "default": "radius.md",
      "interactive": "radius.sm",
      "surface": "radius.lg"
    }
  },
  "colorBoundaries": {
    "accentUsage": "primary-actions-only",
    "surfaceLayers": [
      "color.background.default",
      "color.background.subtle",
      "color.background.elevated"
    ]
  },
  "forbiddenPatterns": [],
  "composition": {
    "surfaceHierarchy": "flat",
    "preferredStacks": ["button", "input", "stack"],
    "componentRules": {}
  },
  "rtl": {
    "supported": true,
    "strategy": "logical-properties-only; no runtime DOM mirroring"
  }
}
```

### 2.4 `effects.css` (optional)

Add an `effects.css` when needed (radius/shadow/motion language); it is appended to the produced `variables.css` on build. Omit it if not needed.

---

## 3. Step 2: register into the build

The theme build script `packages/themes/scripts/build-themes.mjs` holds a **hardcoded `themeIds` array** (currently the 8 official themes). Add `my-brand`:

```js
const themeIds = [
  "line", "silver-arrow", "stuttgart", "corsa", "cupertino", "siren", "wechat", "ant-blue",
  "my-brand", // ← new
];
```

Then build:

```bash
pnpm --filter @chameleon-ui/themes build
```

The output appears at `packages/themes/dist/my-brand/variables.css`.

---

## 4. Step 3: expose exports (optional but recommended)

Official themes have matching `./<id>/css`, `./<id>/meta` specifiers. Recommended: add convenient aliases for your theme in `packages/themes/package.json` `exports`:

```jsonc
"./my-brand/css":           { "style": "./dist/my-brand/variables.css", "import": "./dist/my-brand/variables.css", "default": "./dist/my-brand/variables.css" },
"./my-brand/css?raw":       "./dist/my-brand/variables.css",
"./my-brand/meta":          "./dist/my-brand/meta.json",
"./my-brand/design-rules":  "./dist/my-brand/design-rules.json",
"./my-brand/tokens":        "./dist/my-brand/tokens.json"
```

> Even without aliases, the `./dist/*` wildcard already exists, so `@chameleon-ui/themes/dist/my-brand/variables.css` works — but adding aliases matches the official usage.

---

## 5. Use your theme

React:

```tsx
import "@chameleon-ui/themes/my-brand/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import { ThemeProvider } from "@chameleon-ui/react";

<ThemeProvider theme="my-brand">{/* app */}</ThemeProvider>
```

Vue:

```vue
<script setup lang="ts">
import '@chameleon-ui/themes/my-brand/css'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
import { ThemeProvider } from '@chameleon-ui/vue'
</script>
```

> Don't forget to also import `@chameleon-ui/tokens/density.css` — otherwise density/control sizes won't switch by breakpoint.

---

## 6. Validate

- `pnpm --filter @chameleon-ui/themes validate-rules` schema-validates `design-rules.json`.
- `pnpm --filter @chameleon-ui/themes test` runs theme regression tests.
- Inspect the output: `packages/themes/dist/my-brand/variables.css` should contain only the overridden variables.
- `meta.id` must equal the directory name, otherwise the build throws.

---

## References

- Official theme examples: `packages/themes/src/line/` (minimal), `packages/themes/src/cupertino/` (with `effects.css`)
- core token authoritative source: `packages/tokens/src/core/*.json`
- Themes package doc: [`packages/themes/README.md`](../../packages/themes/README.md)
- Token compile mechanism: [`packages/tokens/README.md`](../../packages/tokens/README.md)
- How the token system works: [`token-system.md`](./token-system.md)
