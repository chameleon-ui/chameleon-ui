# Theme `$extends` (compile-time)

Derived themes may declare DTCG `$extends` in `tokens.json`. Resolution happens at **build time**; output is still static CSS (no runtime inheritance).

## Usage

Store only the delta. `$extends` is a string or array of paths relative to the theme directory:

```json
{
  "$extends": "../../src/line/tokens.json",
  "radius": { "md": { "$value": { "value": 2, "unit": "px" } } }
}
```

Rules:

- Paths resolve relative to the current theme dir; escaping `packages/themes` is a compile error.
- Parents apply in array order; the derived document wins last. Leaves override; groups deep-merge; leaf↔group shape mismatch errors.
- Cycles error with the chain printed (`start -> a.json -> b.json -> a.json`).
- Max inheritance depth: 16.

`meta.json` may record the chain with an `extends` field.

## Demo

`packages/themes/examples/line-dense/` derives from `line` and overrides three radius variables:

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/themes test
# expects: $extends demo: line-dense derives from line with 3 overridden variables
```

## Official themes

The eight official themes (`line`, `silver-arrow`, `stuttgart`, `corsa`, `cupertino`, `siren`, `wechat`, `ant-blue`) remain **self-contained**. `$extends` is available for derived / community themes; official sets are not switched to inheritance by default.

Byte regression gate: `scripts/test-themes-regression.mjs` (variables.css + tokens.resolved.json vs baseline). Pipeline changes that alter bytes need an explicit `--write-baseline` and review.

## theme-studio export

Export payload shape: `$extends: <baseThemeId>` + `tokens: <delta>` + `removedTokenPaths` (deletes cannot be expressed via `$extends` alone). Unedited export → empty delta object.

## Rollback

Remove `$extends` and fill full tokens to return to a self-contained theme.
