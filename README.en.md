# Chameleon UI

<p align="center">
  <img src="./brand/chameleon-logo.png" alt="Chameleon UI logo" width="120" />
</p>

> **English · [简体中文](README.md) · [繁體中文（香港）](README.zh-HK.md) · [العربية](README.ar.md)**

**AI-native, headless-first, three-end (390/768/1280), cross-framework design system for React and Vue.**

Chameleon UI is a design system built for the AI era. Built on **headless primitives**, it delivers a complete, consistent component library for **React 19** and **Vue 3.5** over one shared set of tokens, contracts, and architecture — and achieves **three-end (phone / tablet / desktop)** responsiveness. Through contract-driven design, MCP, and protocol adapters, **AI agents can "understand" and reliably assemble or install components**.

- **Components**: 103 catalog entries (React and Vue **both** aligned `103/103`)
- **Three-end**: phone 390 / tablet 768 / desktop 1280 viewport-adaptive (density, control sizes, typography vary by end)
- **Themes**: 9 (`line` visual flagship + 8 tribute overlays)
- **Languages**: 21 locales (ICU MessageFormat), incl. RTL (`ar` `ug` `ur` `fa`)
- **Headless**: built on **Ark UI / Zag** (thin wrappers in `primitives` / `primitives-vue`)
- **License**: MIT. Telemetry off by default (`telemetry-notice.v1`).

> **Current version: `0.2.0` (not published to npm)**. Until npm publish, use `link-external` / `pack-external` or the official Vite templates.

---

## Why Chameleon UI

- **Three-end (390 / 768 / 1280)**: the same components adapt automatically across three viewports via container queries + density tokens — density, touch targets, and typography change per end; the desktop collapsible sidebar, tablet rail, and phone bottom Tab all derive from the same `Navigation`.
- **Cross-framework consistency**: one set of design tokens, one set of component contracts, identical React and Vue implementations. Pick one umbrella (`@chameleon-ui/react` or `@chameleon-ui/vue`) for the same experience.
- **Headless core**: presentation and behavior separated from headless logic. Want full control of rendering? Use the `primitives` layer directly.
- **AI-native**: every component has a machine-readable `contract.json` (with `dataAi.role` / `states` / `intents`); `AGENTS.md` is the single source of truth (SSOT) for AI consumption, and the MCP server lets agents query contracts and install components directly.
- **Contract-driven**: component list, contracts, design rules, and lexicon each have one authoritative source, preventing doc/implementation drift.
- **Versioned themes & i18n**: DTCG tokens compile to standard CSS variables; themes and languages are composable, independent packages.

---

## Quick start

### Requirements

- Node `>= 20.19.0`
- pnpm `9.15.0` (Corepack recommended: `corepack enable`)

### Build / run in this repo

```bash
corepack pnpm@9.15.0 install --frozen-lockfile
corepack pnpm@9.15.0 check      # lint + typecheck + test + build
```

Common commands (root `package.json`):

| Command | Purpose |
| :--- | :--- |
| `pnpm build` | Build all packages with Turborepo |
| `pnpm check` | lint + typecheck + test + build in one gate |
| `pnpm clean` | Clean `.turbo` / `dist` / local build caches |
| `pnpm publish:check` | Pre-publish dry-run check (does not push) |
| `pnpm ai:check` | Validate AGENTS / contracts / install doc consistency |
| `pnpm verify:external` | Validate official external templates are consumable |

### Use in your app (before npm publish)

Either way (neither requires `workspace:*`):

```bash
# 1. Pack a tarball, then install in your app
node ./scripts/pack-external.mjs            # React umbrella
node ./scripts/pack-external.mjs --vue     # Vue umbrella
npm install <path-to>/dist-tarballs/chameleon-ui-react-0.2.0.tgz

# 2. Or npm link
node ./scripts/link-external.mjs --vue --apply
```

Official starter templates:

- [`templates/external-vite-react`](./templates/external-vite-react)
- [`templates/external-vite-vue`](./templates/external-vite-vue)

---

## Packages (Workspace)

The repo is a **pnpm + Turborepo** monorepo with 21 `@chameleon-ui/*` packages organized by layer.

### Layer rules

| Layer | Packages | Rule |
| :--- | :--- | :--- |
| **L1 base** | `tokens` · `themes` · `i18n` · `contract` | Framework-agnostic; no `react`/`vue` dependencies |
| **L1 primitives** | `primitives` · `primitives-vue` | Thin wrappers over `@ark-ui/*` / Zag; peer the matching framework |
| **L2 components** | `components` · `components-vue` | L1 only; **never `import '@ark-ui/*'` directly** |
| **L3/L4 adapters** | `adapter-*` · `schema-renderer` | Protocol mapping; writes only via `install-core` |
| **Install core** | `install-core` | The **only** disk writer |
| **Registry** | `registry` · `registry-private` | Read-only / private service; no writes |
| **Shells/services** | `cli` · `mcp-server` · `market-service` | Thin shells; all writes converge to `install-core` |
| **Consumer umbrellas** | `react` · `vue` | One dependency; for end consumers |

### Package overview

| Package | Description |
| :--- | :--- |
| `@chameleon-ui/tokens` | DTCG design-token authoritative source + deterministic CSS variable compile |
| `@chameleon-ui/themes` | Theme overlays + `design-rules` (`line` flagship + 8 tributes) |
| `@chameleon-ui/contract` | JSON Schema + validation for components and design rules |
| `@chameleon-ui/i18n` | ICU MessageFormat runtime, C3 Map lookup, pseudo-locale tools |
| `@chameleon-ui/primitives` · `primitives-vue` | Ark UI / Zag thin wrappers (headless core) |
| `@chameleon-ui/components` | React component implementations (103 slugs + contracts) |
| `@chameleon-ui/components-vue` | Vue components (103/103 slugs + ThemeProvider) |
| `@chameleon-ui/react` | React consumer umbrella |
| `@chameleon-ui/vue` | Vue consumer umbrella |
| `@chameleon-ui/install-core` | Sole disk writer: dependency graph, conflict detection, idempotent copy |
| `@chameleon-ui/registry` | Component/theme catalog |
| `@chameleon-ui/registry-private` | Local/intranet private registry server |
| `@chameleon-ui/cli` | `chameleon` CLI, thin shell into `install-core` |
| `@chameleon-ui/mcp-server` | MCP server (agents query contracts / install components) |
| `@chameleon-ui/schema-renderer` | JSON Schema → component tree (default 10 slugs) |
| `@chameleon-ui/blocks` | Composable scenario blocks |
| `@chameleon-ui/adapter-a2ui` | A2UI protocol adapter |
| `@chameleon-ui/adapter-ag-ui` | AG-UI protocol adapter (**POC**, not officially supported) |
| `@chameleon-ui/adapter-mcp-apps` | MCP Apps (SEP-1865) protocol adapter (**POC**) |
| `@chameleon-ui/market-service` | Theme market / community rules-pack service |
| `@chameleon-ui/utils` | Generic utilities (PNG/image primitives; pure JS, zero native deps) |

---

## Three-end (phone / tablet / desktop)

The core experience is **one set of components adapting to three viewports** — 390 (phone), 768 (tablet), 1280 (desktop) — rather than writing each form separately.

Driver mechanisms:

| Dimension | Three levels | Note |
| :--- | :--- | :--- |
| Breakpoints | `<768` / `768–1279` / `≥1280` | Token `--cu-breakpoint-{mobile,tablet,desktop}` |
| Density | `comfortable` / `standard` / `compact` | Default per end (phone=comfortable / tablet=standard / desktop=compact); overridable via `[data-density]` |
| Controls | 36 / 40 / 44px | `--cu-control-size-{compact,standard,comfortable}` |
| Type | `clamp()` fluid | Scales from `20rem → 80rem` |

- **Width response uses `@container` queries**, not `@media` width breakpoints directly (stylelint blocks it).
- Consuming `@chameleon-ui/tokens/css` **requires also importing `@chameleon-ui/tokens/density.css`**; otherwise density/control sizes won't switch by breakpoint.
- App shell & navigation: `AppShell` provides the three-level app skeleton; `Navigation` uses the same `items` API to morph between desktop sidebar / collapsible tablet rail / phone bottom Tab; `SafeArea` handles notch and gesture-bar insets.

Three-level components: `AppShell` · `Navigation` · `NavigationBar` · `Sidebar` · `TabBar` · `ActionSheet` · `SafeArea`.

The full three-end how-it-works (breakpoint tokens, container queries vs `@media`, per-end density, Navigation morphing, and "why React/Vue are separate"): [**Three-end system**](./docs/theming/three-end-system.en.md).

---

## Components & themes

### Components (103)

The complete list has one authoritative source: [`packages/components/catalog.json`](./packages/components/catalog.json). Each component also ships a machine-readable contract:

- `contract.json` (with `dataAi.role` / `states` / `intents`)
- 21 locale message tables
- Styles, types, tests

### Themes (9)

| Theme | Note |
| :--- | :--- |
| `line` | **Visual flagship** (default product look) |
| `silver-arrow` `stuttgart` `corsa` `cupertino` `siren` `wechat` `ant-blue` | Tribute overlays |
| `community-focus-first` | Community rules pack (`registry:rules`) seed |

> **Status**: `line` is the **only fully-verified visual flagship** (default look; serves as the product standard). The other 8 tribute overlays are **still being refined** and are best used as inspiration/exploration. For a reliable default theme, use `line`.

- How the **token system works**: from DTCG authoritative source to `--cu-*` compilation, reference resolution, cycle detection, and overlay/`$extends` inheritance — see [**Token system**](./docs/theming/token-system.en.md).
- Want your own theme? A theme is an **overlay** (only overrides a subset of core tokens). Step-by-step: [**Create a custom theme**](./docs/theming/creating-a-theme.en.md).

### Languages & RTL

- 21 locales (see `catalog.json`)
- RTL languages: `ar` `ug` `ur` `fa`
- Use `directionForLocale` (`@chameleon-ui/i18n`) to decide direction; do not guess `dir`

---

## AI usage (primary entry)

**`AGENTS.md` is the SSOT for how this library is consumed by AI.** Whether you're a model, an agent, or trying to "have AI assemble it", start there.

- [`AGENTS.md`](./AGENTS.md) — full AI consumption rules (CSS, JS imports, install, MCP, NEVER)
- [`docs/ai/`](./docs/ai/) — additional notes (consume flow, SchemaRenderer, lexicon, theme extends, community packs)
- [**How AI works**](./docs/ai/how-ai-works.en.md) — contract-driven, intent lexicon, MCP chain, map→render→install end-to-end

If MCP is mounted, the standard tool-call order is:

`get_started` → `get_import_specifiers` (before writing imports) → `get_contract` (before emitting a component) → `get_design_rules` (before density/RTL)

**All disk writes must go through `install-core`** (`chameleon add` / MCP `install_*`); do not write a second path elsewhere.

---

## Directory structure

```
.
├── packages/                # all @chameleon-ui/*
├── scripts/                 # lib build / pack / link / publish:check / ai:check
├── templates/               # official external Vite apps (React / Vue)
├── docs/ai/                 # AI consumption notes (SSOT = AGENTS.md)
├── brand/                   # logo / brand assets
├── AGENTS.md                # AI consumption SSOT
├── STRUCTURE.md             # detailed directory map
└── LICENSE · CONTRIBUTING.md · SECURITY.md · CHANGELOG.md
```

> Maintainer lint/build tooling, size budgets, etc. are **not in this repository** (they live outside it) and are irrelevant to consumers.

---

## Reference docs

| Topic | Where |
| :--- | :--- |
| Directory map | [`STRUCTURE.md`](./STRUCTURE.md) |
| AI consumption rules | [`AGENTS.md`](./AGENTS.md) |
| Version changes | [`CHANGELOG.md`](./CHANGELOG.md) |
| Contributing | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| Security | [`SECURITY.md`](./SECURITY.md) |

---

## License

[MIT](./LICENSE)
