# @chameleon-ui/components-vue

Vue implementations for Chameleon UI. React (`@chameleon-ui/components`) remains the primary SSOT. This package ports the **catalog 103 slugs** plus ThemeProvider.

- **Rule**: import **only** `@chameleon-ui/primitives-vue`, `@chameleon-ui/tokens`, and `@chameleon-ui/i18n`. Never `@ark-ui/*`.
- **CSS**: consumer theme is `@chameleon-ui/themes/<id>/css` (prefer `line`). Package CSS is a side-effect of the barrel and `@chameleon-ui/components-vue/css`.
- **data-ai-***: roots set `data-ai-role` / `data-ai-state`; interactive components set `data-ai-intent`.

## Coverage

Catalog Vue is **103/103**. ThemeProvider is extra (not a catalog slug). Per-slug: `import { Button } from '@chameleon-ui/components-vue/button'`. SchemaRenderer default map is 10 slugs: `@chameleon-ui/schema-renderer/vue`.

## Usage

```vue
<script setup lang="ts">
import { AppShell, Button, Navigation, NavigationBar, ThemeProvider } from '@chameleon-ui/components-vue'
import '@chameleon-ui/themes/line/css'
import '@chameleon-ui/tokens/css'
import '@chameleon-ui/tokens/density.css'
</script>
```

External app: `templates/external-vite-vue`. Link with `node ./scripts/link-external.mjs --vue --apply`. Never `workspace:*` outside this pnpm workspace.
