# AGENTS.md — consume `@chameleon-ui/*`

You are generating or editing an **external app** that consumes Chameleon UI.

**This file is the SSOT.** Do not invent import paths. Do not copy `workspace:*` into a consumer `package.json`.

Deeper notes (same checkout): [`docs/ai/consumer-agent-bootstrap.md`](./docs/ai/consumer-agent-bootstrap.md) · [`docs/ai/agent-consume.md`](./docs/ai/agent-consume.md) · [`docs/ai/schema-renderer.md`](./docs/ai/schema-renderer.md).

---

## Start here in 60 seconds

**Pick exactly one umbrella** — React **or** Vue. Never both. Never default to React if the user (or existing `package.json`) already chose Vue — and the reverse.

### React

```tsx
// main.tsx
import "@chameleon-ui/react/css"; // real dist/css.css after build
import { ThemeProvider, ToastProvider, Button } from "@chameleon-ui/react";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme="linear" locale="zh-CN">
    <ToastProvider fill>
      <Button>OK</Button>
    </ToastProvider>
  </ThemeProvider>,
);
```

```css
html, body, #root { block-size: 100%; margin: 0; }
```

### Vue

```ts
// main.ts
import { createApp } from "vue";
import "@chameleon-ui/vue/css"; // real dist/css.css after build
import App from "./App.vue";

createApp(App).mount("#app");
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ThemeProvider, ToastProvider, Button } from "@chameleon-ui/vue";
</script>

<template>
  <ThemeProvider theme="linear" locale="zh-CN">
    <ToastProvider fill>
      <Button>OK</Button>
    </ToastProvider>
  </ThemeProvider>
</template>
```

```css
html, body, #app { block-size: 100%; margin: 0; }
```

Unstyled / “not Chameleon” almost always means **missing CSS** or **missing `ThemeProvider`**.

| Track | Umbrella | Catalog |
| :--- | :--- | :--- |
| React | `@chameleon-ui/react` | full React catalog + `ThemeProvider` |
| Vue | `@chameleon-ui/vue` | **116/116** + `ThemeProvider` |

Packages are **`0.4.0` and not on npm yet.** Node **≥ 20.19**.

---

## Install into an external app

Until npm publish, use **umbrella tarball**, **`npm link`**, or an **official Vite template** (`file:`). Prefer **one** umbrella.

```bash
# After the matching umbrella is built in this checkout:
node ./scripts/pack-external.mjs # → dist-tarballs/chameleon-ui-react-0.4.0.tgz
node ./scripts/pack-external.mjs --vue # → dist-tarballs/chameleon-ui-vue-0.4.0.tgz

# in the consumer app:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.4.0.tgz
# or:
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-vue-0.4.0.tgz
```

```bash
node ./scripts/link-external.mjs --apply # then: npm link @chameleon-ui/react
node ./scripts/link-external.mjs --vue --apply # then: npm link @chameleon-ui/vue
```

Official templates: `templates/external-vite-react` · `templates/external-vite-vue` — build the matching umbrella, then `npm install` && `npm run dev`.

Legacy five-pack (compatibility only): `--legacy-five` on pack/link. Prefer **one umbrella**.

**Never** write `"@chameleon-ui/components-react": "workspace:*"` (or any `workspace:*`) in a non-workspace consumer `package.json`.

### Peers (install in the consumer app)

Required **peer versions for the consumer app** (not monorepo internals):

| Stack | Peers |
| :--- | :--- |
| React | `react@^19` · `react-dom@^19` · `@ark-ui/react@5.38.0` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14` |
| Vue | `vue@^3.5` · `@ark-ui/vue@5.38.1` · `intl-messageformat@11.2.13` · `@formatjs/icu-messageformat-parser@3.5.14` |

React **18 is out of range.** Vite tips (in official templates): `resolve.preserveSymlinks: true`, dedupe framework + Ark + FormatJS. **Do not** add `resolve.alias` for `@chameleon-ui/*` CSS — package `exports` must resolve.

---

## CSS (copy exactly — never invent)

Preferred (one import):

```ts
import "@chameleon-ui/react/css";
import "@chameleon-ui/vue/css";
```

- **Both** umbrellas `/css` = tokens + density + flagship `linear` + **components** (real file: `exports` → `dist/css.css`).
- React components bundle: `@chameleon-ui/components-react/css` → `dist/index.css` (already inside `@chameleon-ui/react/css`).
- Vue components bundle: `@chameleon-ui/components-vue/css` → `dist/index.css` (already inside `@chameleon-ui/vue/css`).

Also valid (same layers, split):

```ts
import "@chameleon-ui/themes/linear/css";
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
import "@chameleon-ui/components-react/css"; // React; already inside @chameleon-ui/react/css
import "@chameleon-ui/components-vue/css"; // Vue; already inside @chameleon-ui/vue/css
```

Also valid: `@chameleon-ui/themes/dist/linear/variables.css`, `@chameleon-ui/tokens/dist/css/variables.css`.

Default product chrome is **`linear`**. Official theme ids: `linear` · `mercedes` · `porsche` · `ferrari` · `apple` · `tiktok` · `wechat` · `alipay`.

```ts
import "@chameleon-ui/themes/apple/css";
import "@chameleon-ui/react/themes/apple/css"; // same file via React umbrella
import "@chameleon-ui/vue/themes/apple/css"; // same file via Vue umbrella
```


Then `<ThemeProvider theme="apple" …>`. Single theme via umbrella CSS is enough for `linear`. Multi-theme: pass `overlays` (raw CSS) so only `[data-theme]` paints.

**Dark / light manual switching:** `<ThemeProvider theme="linear" colorScheme="light" …>` sets `data-color-scheme` on `<html>`; omit `colorScheme` for the theme default (`linear` is dark-first). Schemes ship inside the theme CSS as `:root[data-color-scheme="light"]` overrides — no extra import. Themes with a light scheme declare `colorSchemes` in `meta.json`.

**Never:** `import "@chameleon-ui/themes/apple/variables.css"` — **not exported**.

**`linear` and `apple` are the visual flagships — value-level 1:1 replicas locked by assertions.** `linear` (dark-first): app canvas `#121213` under darker `#09090a` chrome, indigo accent `#5e6ad2` on CTAs only, pill CTAs with `brightness(115%)` hover + `scale(.97)` press, white-alpha hairline borders, radius capped at 8px, 510/590 variable weights, 100/160ms ease-out-quad motion, focus ring `#7180ff` offset 3px, no bounce / gradients / surface glass / colored shadows (evidence: linear.app Button.css + /login loading CSS). `apple` (light-first, manual dark via `colorScheme="dark"`): `#FFFFFF` base over the `#F2F2F7` grouped canvas, systemBlue `#007AFF` (dark: `#0A84FF`), label pure black, separator `rgba(60,60,67,0.29)`, systemFill ramp for selection/hover, bar materials (`saturate(180%) blur(20px)`) on all chrome, pill CTAs with `brightness(1.08)` hover + dim-on-press, 8/10/14/20px radius steps, 17px body / 34px Large Title at 22/17 line-height, 300ms UIKit ease-in-out, accent focus halo; proprietary fonts and icons intentionally not replicated. Other six are tribute overlays. Flagship acceptance is **token overlay + component-level visual DoD** (Button solid/outline/ghost hierarchy, Upload browse as solid CTA, AppShell/Nav/Upload/Card/EmptyState surface density) — not “CSS loaded + brand hex matches.” `recognition_rate` stays `null` — do not invent rates. Do **not** replace Chameleon theme CSS with Tailwind / Ant / handmade tokens.

---

## JS imports

```ts
import { Button, Card, Table, ThemeProvider } from "@chameleon-ui/react";
import { AppShell, Button, Navigation, NavigationTitle, ThemeProvider } from "@chameleon-ui/vue";
```

Also valid:

```ts
import { Button } from "@chameleon-ui/components-react";
import { Button } from "@chameleon-ui/components-vue";
```

Named exports are **PascalCase**. Slugs are **kebab-case** (`data-grid` → `DataGrid`). Optional: `from "@chameleon-ui/components-react/button"` or `from "@chameleon-ui/components-vue/button"`.

---

## App chrome

Native model: **tab controller + per-tab stack**. Not a marketing navbar. Deep recipe: [`packages/components-react/src/app-shell/README.md`](./packages/components-react/src/app-shell/README.md).

### Slot → component

| Role | Component | Where |
| :--- | :--- | :--- |
| Root destinations | `Navigation` | AppShell `navigation` / Vue `#navigation` |
| Sidebar brand (logo+title) | `TitleBar` | **Navigation** `header` / `#header` (**not** AppShell) |
| Sidebar account + logout | `NavAccountCard` | **Navigation** `footer` / `#footer` (**not** AppShell) |
| Stack (title, back) | `NavigationTitle` (formerly `NavigationBar`) | AppShell `header` / Vue `#header` |
| Credits / legal | `Footer` | AppShell `footer` / Vue `#footer` |
| Main screens | children / default | AppShell main — optional `WorkspaceSplit` |
| Site links | `Navbar` | **not** AppShell |

**Do not confuse:** `Navigation` = destinations · `NavigationTitle` = stack title/back · `TitleBar` = sidebar brand (not the stack title).

### Defaults

| API | Default |
| :--- | :--- |
| AppShell `footerPlacement` | `'auto'` — compact → end of **main** (scrolls away); ≥48rem → shell-bottom |
| AppShell `sidebarLabel` | `'Sidebar'` |
| AppShell `landmarks` | `true` (React); Vue always landmarks |
| `Footer` / AppShell `__footer` surface | transparent |
| Navigation `maxCompactItems` | `4` |
| Navigation `collapsible` | `true` (omitted when `footer` set) |
| NavigationTitle `backLabel` | `'Back'` |
| TitleBar | `brandInteractive` / `preventContextMenu` / `userSelectNone` → `true`; `density` → `'default'` |
| NavAccountCard `logoutLabel` | `'Log out'` |
| WorkspaceSplit `scrollMode` (inside main) | `'shell'` |

### Chrome row height + top alignment

Shared formula (do **not** hardcode rem):

`min-block-size: calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))` (+ `padding-block: var(--cu-space-1)` on NavigationTitle / Navigation `__header`).

Applies to: `NavigationTitle` `__frame` · Navigation `__header` (TitleBar host) · `NavAccountCard`.

≥48rem: Navigation `__frame` top is `env(safe-area-inset-top)` only (no extra start padding) so TitleBar aligns with NavigationTitle.

### Height chain

`html, body, #root|#app { block-size: 100%; margin: 0 }` → prefer `<ToastProvider fill>` → AppShell fills parent (`data-cu-shell`) **edge-to-edge** (`inline-size: 100%`, no default shell margin/padding/radius). Do **not** set `min-block-size: 100dvh` on the shell or wrap it in a second `[data-cu-shell]`. Do **not** put `max-width` / centered gutters on `#root`/`#app`/AppShell unless you intentionally want a non-full-bleed app.

```tsx
import {
  AppShell,
  Footer,
  NavAccountCard,
  Navigation,
  NavigationTitle,
  TitleBar,
} from "@chameleon-ui/react";

<AppShell
  header={<NavigationTitle title={title} backLabel={back} onBack={canPop ? pop : undefined} />}
  navigation={
    <Navigation
      label="Main"
      items={tabs}
      activeValue={tab}
      onSelect={selectTab}
      header={
        <TitleBar title="Product" subtitle="Tagline" logoSrc="/logo.png" onBrandClick={() => selectTab("home")} />
      }
      footer={
        <NavAccountCard username="Ada" nickname="admin" onLogout={signOut} />
      }
    />
  }
  footer={
    <Footer>
      <p>Credits</p>
    </Footer>
  }
>
  {screen}
</AppShell>
```

Vue: same names from `@chameleon-ui/vue`; AppShell slots `#header` / `#navigation` / `#footer`; Navigation brand/account use **Navigation** `#header` / `#footer` (not AppShell `#footer`). One `items` list — CSS morphs TabBar ↔ rail ↔ sidebar. Do **not** compose `Sidebar` + `TabBar`. Tab switch does not push; back pops (`useTabStacks`). Compact overflow: four pins + More. **TitleBar and NavAccountCard are sidebar-only** — compact TabBar hides Navigation `__header` / `__footer`; do not duplicate brand or account chrome on mobile. When Navigation `footer` is set, the collapse toggle is omitted.

**Sidebar scroll contract:** AppShell `__nav` and Navigation `__frame` do **not** scroll. Only `__list` is the scrollport; `__header` / `__footer` stay pinned.

**Unique scroll owner:** AppShell `__main` is the default scrollport (`scrollbar-gutter: auto`). `WorkspaceSplit` defaults to `scrollMode="shell"`. For fixed-viewport dashboards use `scrollMode="panes"`. Direct-child `ScrollPane` also owns scroll. Do **not** fight `__main` with ad-hoc `overflow: auto` on both.

**三端一体 content (not chrome):** Multi-column workspaces must use **one** `WorkspaceSplit` (optional `#tools` / `tools`) as a direct child of AppShell main. Do **not** nest another `WorkspaceSplit` inside `detail`. Do **not** freeze `Stack direction="row"`, fixed `flex` columns, or a desktop CSS Grid that stays multi-column on phone.

**Stack layout:** Default `align="stretch"`. Use `grow` so a Stack fills a flex/grid parent. Do not invent consumer flex CSS for that.

**ButtonGroup:** For exclusive tool toggles, wrap `Button` children in `ButtonGroup` (`variant="attached"|"spaced"`; `orientation`; `size` sm|md). Selection stays on each Button.

**Transparent media:** Use library `CheckerboardSurface` / `MaskPaintCanvas`·`ImageCompare` `checkerboard` (shared tokens `--cu-checkerboard-a/b`). Mask / compare default to `checkerboardContrast="strong"`. Do **not** hand-roll `repeating-conic-gradient` or consumer `--cu-checkerboard-*` overrides.

**Mask zoom:** `MaskPaintCanvas` has official zoom — props `zoom` (controlled) / `minZoom` / `maxZoom` / `wheelZoom`, handle `zoomIn` / `zoomOut` / `resetZoom` / `setZoom` / `getZoom`, event `zoomChange` / `onZoomChange`. Pan when zoomed: middle-drag or Space+drag. **Never** fake zoom with consumer CSS `transform: scale()` on the stage or nest it in `Canvas` pan-zoom — both break the pointer → natural-pixel mask mapping.

### Device CSS width → expected morph (@16px root)

| CSS width (examples) | Shell / Navigation | WorkspaceSplit (own width; often `__main` after nav) |
| :--- | :--- | :--- |
| 375–430 (SE/XR/12/14–16 Pro Max, Pixel, Galaxy S) | Compact **TabBar** — never side rail + collapse | Single column stack |
| 768–820 (Nest Hub / iPad Mini portrait, Z Fold cover-ish) | Tablet **rail** | Usually still stacked when nested (main ≈ shell − 12rem < 48rem); standalone ≥48rem → master\|detail, tools under detail |
| 1024 (iPad Air/Pro portrait, Surface) | Tablet **rail** | master\|detail (tools under) when main ≥48rem — never three skinny panes |
| ≥1280 (desktop / large landscape) | Persistent **sidebar** | master\|detail (+ tools under) at 1280; three panes only when **main** ≥80rem (~96rem shell with 16rem nav) |

Chrome tokens stay `48rem` / `80rem`. WorkspaceSplit three-pane opens at **80rem** (not 64rem) so a 1280 CSS px shell with a 16rem sidebar does not crush three columns.

---

## MCP (optional)

If MCP is attached: **`get_started`** once → **`get_import_specifiers`** before imports → **`get_contract`** before emit → **`get_design_rules`** before density/RTL. Prefer **`search_components`** (`intent`); browse with **`list_components`**. If MCP is **not** attached: copy paths from this file; do not invent alternatives.

| When | Tool |
| :--- | :--- |
| First call | `get_started` |
| About to write `import` | `get_import_specifiers` |
| Browse by family | `list_components` |
| Need a component | `search_components` |
| About to emit JSX/SFC | `get_contract` |
| Density / radius / RTL | `get_design_rules` |
| List skins | `list_themes` |
| Scaffold into `CU_TARGET_DIR` | `install_with_theme` (+ other `install_*`) |

Also: `get_component` · `install_component` · `install_block` · `install_theme` · `install_bundle` · `telemetry_opt_out` · `record_intent`.

Attach: [`packages/mcp-server/README.md`](./packages/mcp-server/README.md). Consumer `.cursor/mcp.json` uses **relative paths only**. Building the MCP binary is **optional** (only when attaching MCP) — see Appendix. `npx @chameleon-ui/mcp-server` unavailable until publish. Disk writes **only** via `chameleon add` / MCP `install_*` → `install-core`.

---

## CLI / contracts / locales / SchemaRenderer

```
chameleon add button
chameleon install-with-theme button apple
```

`chameleon add` is the only CLI write for a single component.

- Contracts: `@chameleon-ui/components-react/contracts/<slug>` · MCP `get_contract` · disk `packages/components-react/src/<slug>/contract.json` (v0.2). Every contract has `dataAi.role` + `dataAi.states` + `dataAi.intents`. Schema `$id`: `https://chameleon-ui.dev/schemas/component-contract/v0.2.json`.
- Design rules: `@chameleon-ui/themes/apple/design-rules` · MCP `get_design_rules` · disk `packages/themes/src/<theme>/design-rules.json`.

Locales (21): `zh-CN` `zh-HK` `ja` `ko` `ru` `hi` `en` `de` `ar` `ug` `sw` `ha` `am` `es` `fr` `pt` `bn` `id` `ur` `fa` `vi` 
RTL: `ar` `ug` `ur` `fa`. Use `directionForLocale` from `@chameleon-ui/i18n`. **Do not guess `dir`.** Pass `locale` into `ThemeProvider`.

SchemaRenderer emit:

```json
{
  "version": "1.0",
  "root": { "component": "<slug>", "props": {}, "children": [] }
}
```

Default map **10 slugs only**: `alert` `badge` `button` `card` `divider` `empty-state` `heading` `input` `stack` `typography`. React: `@chameleon-ui/schema-renderer`. Vue: `@chameleon-ui/schema-renderer/vue`. For `table` / `chart` / `kpi-dashboard`, use the umbrella — do not pretend SchemaRenderer covers the full catalog. Details: [`docs/ai/schema-renderer.md`](./docs/ai/schema-renderer.md).

---

## NEVER

- `import "@chameleon-ui/themes/apple/variables.css"` — **not exported**.
- `"@chameleon-ui/components-react": "workspace:*"` (or any `workspace:*`) in a non-pnpm-workspace app.
- A second installer. Disk writes only via `chameleon add` / MCP `install_*` → `install-core`.
- Both `@chameleon-ui/react` **and** `@chameleon-ui/vue` in one app.
- Treat AG-UI as supported. `@chameleon-ui/adapter-ag-ui` is **POC**.
- Invent `bench.generation_quality` scores. Honest value is `null` without a configured generator.
- Claim theme recognition rates (「一眼认出 ≥80%」 or any %). Blind test is **PROTOCOL-READY / not_run**; `rate` is `null` until real human trials.
- Claim accessibility certification (VPAT certified, WCAG AA certified, Section 508, third-party CAB). Docs VPAT is **status=draft**, **published-internal**, **commercialClaimsAllowed=false**.
- Substitute Tailwind / other UI kits for Chameleon theme CSS.
- Compose `Sidebar` + `TabBar` instead of `Navigation`.
- Add Vite `resolve.alias` hacks for `@chameleon-ui/*/css` when exports should resolve.

---

## Task Master

- Project task configuration lives in `.taskmaster/config.json`; it uses the `openai-compatible` provider.
- Use the configured Task Master MCP server or `task-master` CLI to inspect and update planned work. Do not create a second task-management store.
- Before starting a tracked task, review its details and dependencies. Mark it complete only after the relevant validation has passed.
- Keep API keys out of repository files. The Task Master MCP server receives `OPENAI_COMPATIBLE_API_KEY` from the Codex host environment.

---

## Appendix: library maintainers

For people building **this** checkout — not the default path for consumer AIs.

This repository is the **library unit**. Maintainer lint/typecheck configs and size budgets are **not tracked in this repository** (they live outside it) and are irrelevant to consumers.

**Why things are the way they are:** architecture decision records live in [`docs/decisions/`](./docs/decisions/README.md) (package manager, dual-framework split, Ark UI foundation). Read the relevant ADR before proposing structural changes.

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/react... build
corepack pnpm@9.15.0 --filter @chameleon-ui/vue... build
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
node ./scripts/verify-vue-css-consume.mjs
pnpm verify:external
pnpm ai:check
```
