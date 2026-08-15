# @chameleon-ui/react

One install for React consumers. Pulls `@chameleon-ui/tokens`, `i18n`, `primitives`, `themes`, and `components` (workspace `0.2.0` graph). **Not on npm yet** — use `pack-external` / `link-external` / `file:`.

```bash
cd chameleon-ui
node ./scripts/pack-external.mjs
# consumer:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.2.0.tgz
```

```ts
import { Button, ThemeProvider } from "@chameleon-ui/react";
import "@chameleon-ui/react/css";
```

Pin peers at the app root: `react@^19`, `react-dom@^19`, `@ark-ui/react@5.38.0`, `intl-messageformat@11.2.13`, `@formatjs/icu-messageformat-parser@3.5.14`.

Legacy five-pack: `node ./scripts/pack-external.mjs --legacy-five`.
