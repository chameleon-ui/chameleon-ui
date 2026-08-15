# @chameleon-ui/vue

One install for Vue consumers. Pulls `@chameleon-ui/tokens`, `i18n`, `primitives-vue`, `themes`, and `components-vue` (workspace `0.2.0` graph). **Not on npm yet** — use `pack-external` / `link-external` / `file:`.

```bash
cd chameleon-ui
node ./scripts/pack-external.mjs --vue
# consumer:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-vue-0.2.0.tgz
```

```ts
import { Button, ThemeProvider } from "@chameleon-ui/vue";
import "@chameleon-ui/vue/css";
```

Pin peers at the app root: `vue@^3.5`, `@ark-ui/vue@5.38.1`, `intl-messageformat@11.2.13`, `@formatjs/icu-messageformat-parser@3.5.14`.

Legacy five-pack: `node ./scripts/pack-external.mjs --vue --legacy-five`.
