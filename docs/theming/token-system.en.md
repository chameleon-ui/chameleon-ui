# How Tokens Work

> **English · [简体中文](token-system.md) · [繁體中文（香港）](token-system.zh-HK.md) · [العربية](token-system.ar.md)**

This document explains how Chameleon UI's **design token system** works: from a DTCG-style JSON authoritative source to browser-ready CSS custom properties (`--cu-*`). Understanding this mechanism is the basis for consuming/overriding tokens and for creating and inheriting themes.

> Companion: [Create a custom theme](./creating-a-theme.md) covers "how to override tokens to make a theme"; this one covers "how the token system itself runs".

---

## 1. One picture

```
packages/tokens/src/core/*.json   ← DTCG authoritative source (single)
        │  flattenTokens(flatten)
        ▼
  flat token list (path → value)
        │  resolveTokens(resolve refs + cycle check)
        ▼
  resolved tokens (no {…} refs)
        │  renderCss
        ▼
  :root { --cu-color-fg-default: …; … }   ← dist/css/variables.css
```

The theme path adds **one overlay step**:

```
core dir + theme tokens.json (overlay)  → overlayTokenTrees(deep merge)  → compile → theme variables.css
```

---

## 2. The authoritative source: `src/core/*.json`

The single numeric source for every design decision is the set of DTCG files under `packages/tokens/src/core/`:

`color.json` · `space.json` · `radius.json` · `shadow.json` · `motion.json` · `typography.json` · `blur.json` · `breakpoint.json` · `density.json`

- The structure is **nested DTCG objects**: groups hold leaves; a leaf is defined by `$type` + `$value`.
- A real example:

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#2563eb", "$type": "color" }
    },
    "background": {
      "default": { "$value": "{color.palette.paper}" }
    }
  }
}
```

- `$value` may be a literal value or a `{...}` reference (see §4).
- **core is the single authority**: components and themes consume its compiled output; they never copy the values themselves.

---

## 3. The three compile steps (`token-compiler.mjs`)

`compileTokenObject(root)` from `@chameleon-ui/tokens/compiler` runs three steps:

### 3.1 `flattenTokens` — flatten

Flattens nested JSON into a flat **path → value** list, e.g. `color.fg.default`, `space.2`. O(n).

### 3.2 `resolveTokens` — resolve references

Resolves every `{...}` reference to a real value (e.g. `{color.palette.paper}` → `#ffffff`). This phase:

- **Cycle detection**: `a` references `b` which references `a` → throws; never produces "partially successful" CSS.
- Unknown references, duplicate paths, and non-serializable values → throw (the error includes path + cause + next step).

### 3.3 `renderCss` — generate CSS variables

Turns each token path into a CSS custom-property name:

```
color.fg.default  →  --cu-color-fg-default
space.2           →  --cu-space-2
breakpoint.mobile →  --cu-breakpoint-mobile
```

Rules (see `cssVariableName`):

- Fixed prefix `--cu-` (constant `tokenCssVariablePrefix`).
- Path segments joined with `-`; illegal characters replaced with `-` and lowercased.
- If multiple paths normalize to the same variable name → throws (guarantees every `--cu-*` is unique).

Output is placed in `:root { … }` and loaded by default via `@chameleon-ui/tokens/css`.

---

## 4. Reference syntax `{...}`

- Inside `$value` you can reference another token with `{<path>}`, e.g. `{color.palette.ink}`.
- References are **not kept** in the output after resolution; `dist/tokens.json` is the resolved flat table that JS/TS can consume directly.
- References cannot create a cycle (cycle detection catches it).

---

## 5. Theme = overlay (override core)

A theme **does not copy** the core source; it provides an **overlay**: `packages/tokens/src/core/` is the base, and the theme's `tokens.json` only states "which subset to override". `overlayTokenTrees` **deep-merges** it (`compileThemeTokens(coreDirectory, overlay, label)`):

- **Leaf hit** → the overlay leaf overrides the core leaf.
- **Group absent from core** → added as a new group.
- **Recursive deep merge of groups**: only referenced branches are overridden; unreferenced ones keep core values.
- **Constraint**: a group cannot override an existing leaf; `$`-prefixed metadata (`$type`/`$description`) passes through and is not treated as a token group in the overlay.

> Complexity O(n log n), space O(n). Guarantee: overlay replacing core leaves does **not copy the core source tree**.

Example: core defines `color.background.subtle = #f6f6f4`; a theme overlays `{ "color": { "background": { "subtle": { "$value": "#eef4f8" } } } }` → the variable becomes `#eef4f8`, other background colors unchanged.

---

## 6. `$extends`: theme inheritance

A theme's overlay document may declare `"$extends": "<ref>" | ["<ref>", ...]` to inherit one or more base themes/documents:

- **Merge order**: parents in array order, then the derived document last — the later one wins on leaf conflicts; groups follow the overlay deep-merge rules.
- **Cycle-safe**: max inheritance depth 16 (`MAX_EXTENDS_DEPTH`); a cycle yields a readable chain error.
- **Ref resolution** is done by an injected `loadRef` (in this repo it's the filesystem, and **restricted to `packages/themes/src`** — escaping to arbitrary paths is disallowed).
- Complexity O(n + e), space O(d), d ≤ 16.
- **`$extends` never leaks into the output.**

---

## 7. Outputs

One compile produces three views (the `compileTokenObject` return value, also written to disk):

| Output | Content |
| :--- | :--- |
| `css` | `:root { --cu-…: … }` (for `@chameleon-ui/tokens/css` and each theme's `/css`) |
| `dtcg` | The resolved DTCG tree (`toResolvedDtcgTree`) |
| `tokens` | The flat resolved token list (`dist/tokens.json`) |

**Determinism guarantee**: no timestamps in the output; identical input → byte-identical output. Stable sort, memoized reference resolution (amortized O(d), max depth 32).

---

## 8. Conventions & limits

- **Framework-free**: token compilation happens only at build time; React / Vue / Svelte are disallowed.
- **Component CSS does not consume `@media` width breakpoints directly**; three-end (390/768/1280) uses `@container` + `--cu-*` breakpoint/density tokens (see the three-end section of [`tokens/README.md`](../../packages/tokens/README.md)).
- **`dist/css/variables.css` is generated — do not hand-edit.**

---

## References

- Compile implementation: [`packages/tokens/scripts/token-compiler.mjs`](../../packages/tokens/scripts/token-compiler.mjs)
- core authoritative source: [`packages/tokens/src/core/`](../../packages/tokens/src/core/)
- Tokens package doc: [`packages/tokens/README.md`](../../packages/tokens/README.md)
- Build a theme with overlays: [`Create a custom theme`](./creating-a-theme.md)
