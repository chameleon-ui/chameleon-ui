# AppShell

Three-end **application chrome**: one `navigation` cell morphs TabBar ↔ rail ↔ sidebar. Stack chrome lives in `header`; attribution in `footer`; screens (and optional `WorkspaceSplit`) are the default children / main landmark.

There is **no Vue twin README** — Vue uses the same CSS and the same role map; only prop/slot naming differs (see [Vue vs React](#vue-vs-react)).

### Naming (do not confuse)

| Component | Job | Slot |
| :--- | :--- | :--- |
| **Navigation** | Destination list (TabBar ↔ rail ↔ sidebar) | AppShell `navigation` / `#navigation` |
| **NavigationTitle** (formerly **NavigationBar**) | Stack title + back | AppShell `header` / `#header` |
| **TitleBar** | Sidebar brand mark | **Navigation** `header` / `#header` (sidebar/rail only) |

`NavigationBar` remains a deprecated export alias of `NavigationTitle`.

## Slot map (what goes where)

| Region | React | Vue | Put this | Not this |
| :--- | :--- | :--- | :--- | :--- |
| Stack chrome | `header` prop | `#header` | **`NavigationTitle`** (title, back, bar items) | Site `Navbar`, root tabs, `TitleBar` |
| Tab controller | `navigation` prop | `#navigation` | **`Navigation`** (one `items` list) | `Sidebar` + `TabBar` composed |
| Sidebar brand | — | — | **`TitleBar`** in **Navigation** `header` / `#header` | AppShell `header` |
| Sidebar account | — | — | **`NavAccountCard`** in **Navigation** `footer` / `#footer` | AppShell `footer` |
| Attribution | `footer` prop | `#footer` | **`Footer`** (credits / legal) | `NavAccountCard` |
| Main | `children` | default slot | Screens / **`WorkspaceSplit`** / `ScrollPane` | Frozen desktop Grid / `Stack direction="row"` that ignores morph |

Legacy single-form slots (`sidebar`, `tabBar` / `#tabBar`) exist for specialized chrome that does **not** morph — prefer `navigation`.

```
AppShell
├── header          → NavigationTitle
├── navigation      → Navigation
│   ├── header      → TitleBar          (sidebar/rail only; hidden on compact TabBar)
│   ├── items list  → destinations      (__list is the only scrollport)
│   └── footer      → NavAccountCard    (sidebar/rail only; hides collapse toggle)
├── main (children) → screen / WorkspaceSplit
└── footer          → Footer            (placement via footerPlacement)
```

## Breakpoints (named container `app-shell`)

| Breakpoint | Chrome |
| :--- | :--- |
| Compact (`< 48rem`) | Header + main scrollport + Navigation at block-end (TabBar). TitleBar / NavAccountCard hidden. |
| Tablet (`≥ 48rem`) | 12rem start-edge nav (4.5rem when collapsed) + header/main/(footer) |
| Desktop (`≥ 80rem`) | 16rem persistent sidebar; legacy `tabBar` slot hidden |

## Defaults

| API | Default | Notes |
| :--- | :--- | :--- |
| `footerPlacement` | `'auto'` | Compact → end of **main** (scrolls away); ≥48rem → shell-bottom chrome |
| `footerPlacement: 'shell'` | — | Always dedicated grid row outside main scroll |
| `footerPlacement: 'main'` | — | Always flows at end of main |
| `sidebarLabel` | `'Sidebar'` | `aria-label` on legacy `sidebar` region |
| `landmarks` | `true` (React only) | `false` → plain `div`s for nested demos. Vue always uses `header` / `main` / `footer` landmarks |
| Root attrs | `data-cu-shell`, `data-footer-placement` | Placement attr only when `footer` is set |
| Shell size | fill parent, edge-to-edge | `block-size` / `inline-size: 100%`; no default root margin/padding/radius; **not** `min-block-size: 100dvh` |
| `Footer` / `__footer` surface | transparent | No subtle/paper fill by default |
| Inside main: `WorkspaceSplit` `scrollMode` | `'shell'` | Panes grow with content; `__main` scrolls. Use `'panes'` for fixed-viewport dashboards |

Do **not** rewrite AppShell grid CSS to move footer — use `footerPlacement`.

## Height chain + edge flush

```css
html, body, #root /* React */, #app /* Vue */ { block-size: 100%; margin: 0; }
```

1. `ThemeProvider` / `ToastProvider` are fragment-like (Toaster is a sibling of the slot).
2. Prefer `<ToastProvider fill>` so AppShell’s percentage size resolves.
3. AppShell (`data-cu-shell`) fills its parent edge-to-edge (`inline-size: 100%`, no default root margin/padding/radius) as a flex column with `overflow: hidden`.
4. Do **not** wrap AppShell in a second consumer `[data-cu-shell]` div.
5. Do **not** put `max-width` / `margin-inline: auto` gutters on `#root`/`#app`/AppShell unless the product intentionally wants a non-full-bleed frame. Gray viewport gutters are almost always consumer layout — `__main` padding is content inset only, not a shell gutter.

## Shared chrome row height

Stack header, sidebar brand, and account foot densify together:

```css
min-block-size: calc(var(--cu-control-size-active) + 2 * var(--cu-space-1));
padding-block: var(--cu-space-1); /* NavigationTitle / Navigation __header */
```

| Element | Selector | Formula |
| :--- | :--- | :--- |
| Stack bar | `.cu-navigation-title__frame` | `calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))` |
| Sidebar brand host | `.cu-navigation__header` (≥48rem) | same + `padding-block: var(--cu-space-1)` |
| Account foot | `.cu-nav-account-card` | same |

**Top alignment (≥48rem):** Navigation `__frame` uses `padding-block-start: env(safe-area-inset-top)` only (no extra `--cu-space-3` on start) so TitleBar tops align with NavigationTitle. Do not hardcode rem heights — density tokens must drive the row.

## Scroll owners

| Owner | Behavior |
| :--- | :--- |
| AppShell `__main` | Default scrollport (`overflow-y: auto`, `scrollbar-gutter: auto`) |
| AppShell `__nav` | `overflow: hidden` — does **not** scroll |
| Navigation `__frame` | Does **not** scroll; only `__list` scrolls; `__header` / `__footer` stay pinned |
| `WorkspaceSplit` `scrollMode="shell"` (default) | Split grows; `__main` scrolls |
| `WorkspaceSplit` `scrollMode="panes"` | Direct child → `__main` overflow hidden; panes scroll |
| Direct-child `ScrollPane` | Owns scroll; `__main` overflow hidden |

Do not stack ad-hoc `overflow: auto` on both `__main` and pane content. Do not wrap Navigation + account card as siblings outside the landmark.

## Navigation morph DoD

| Width (CSS px @16px root) | Navigation | WorkspaceSplit (own width; often `__main` after nav) |
| :--- | :--- | :--- |
| 375–430 | Compact **TabBar** — never side rail + collapse | Single column stack |
| 768–820 | Tablet **rail** | Often still stacked when nested |
| 1024 | Tablet **rail** | master\|detail when main ≥48rem |
| ≥1280 | Persistent **sidebar** | master\|detail; three panes only when **main** ≥80rem |

One `items` list — CSS morphs. Tab switch does not push; back pops (`useTabStacks`). Compact overflow: four pins + More. **TitleBar / NavAccountCard are sidebar-only** (compact hides Navigation `__header` / `__footer`). When Navigation `footer` is set, the collapse toggle is omitted.

## Vue vs React

| Concern | React | Vue |
| :--- | :--- | :--- |
| Import | `@chameleon-ui/react` or `@chameleon-ui/components-react` | `@chameleon-ui/vue` or `@chameleon-ui/components-vue` |
| Shell regions | Props: `header`, `navigation`, `footer`, `children` | Slots: `#header`, `#navigation`, `#footer`, default |
| Navigation brand / account | Props `header` / `footer` on `Navigation` | Slots `#header` / `#footer` on `Navigation` |
| Class prop | `className` | `class` |
| `landmarks` | Optional boolean (default `true`) | Not exposed — always landmarks |
| Legacy tab bar | `tabBar` prop | `#tabBar` slot |
| Events | `onBack`, `onSelect`, `onLogout`, `onBrandClick` | `onBack` / `@select` / `@logout` / `@brand-click` (see each component) |

## Recipe — React

```tsx
import {
  AppShell,
  Footer,
  NavAccountCard,
  Navigation,
  NavigationTitle,
  TitleBar,
  ToastProvider,
} from "@chameleon-ui/react";

<ToastProvider fill>
  <AppShell
    header={
      <NavigationTitle
        title={title}
        backLabel={back}
        onBack={canPop ? pop : undefined}
      />
    }
    navigation={
      <Navigation
        label="Main"
        items={tabs}
        activeValue={tab}
        onSelect={selectTab}
        header={
          <TitleBar
            title="Product"
            subtitle="Tagline"
            logoSrc="/logo.png"
            onBrandClick={() => selectTab("home")}
          />
        }
        footer={
          <NavAccountCard
            username="Ada"
            nickname="admin"
            onLogout={signOut}
          />
        }
      />
    }
    footer={
      <Footer>
        <p>Credits</p>
      </Footer>
    }
    /* footerPlacement="auto" is the default */
  >
    {screen}
  </AppShell>
</ToastProvider>
```

## Recipe — Vue

```vue
<script setup lang="ts">
import {
  AppShell,
  Footer,
  NavAccountCard,
  Navigation,
  NavigationTitle,
  TitleBar,
  ToastProvider,
} from "@chameleon-ui/vue";
</script>

<template>
  <ToastProvider fill>
    <AppShell>
      <template #header>
        <NavigationTitle
          :title="title"
          :back-label="back"
          :on-back="canPop ? pop : undefined"
        />
      </template>
      <template #navigation>
        <Navigation
          label="Main"
          :items="tabs"
          :active-value="tab"
          @select="selectTab"
        >
          <template #header>
            <TitleBar
              title="Product"
              subtitle="Tagline"
              logo-src="/logo.png"
              @brand-click="selectTab('home')"
            />
          </template>
          <template #footer>
            <NavAccountCard
              username="Ada"
              nickname="admin"
              @logout="signOut"
            />
          </template>
        </Navigation>
      </template>
      <template #footer>
        <Footer>
          <p>Credits</p>
        </Footer>
      </template>
      <!-- default slot = main -->
      <component :is="screen" />
    </AppShell>
  </ToastProvider>
</template>
```

## NEVER

- Compose `Sidebar` + `TabBar` instead of one `Navigation`
- Put `NavAccountCard` in AppShell `footer` / `#footer` (that is `Footer` / credits)
- Put `TitleBar` in AppShell `header` (that is `NavigationTitle`)
- Freeze a desktop CSS Grid or `Stack direction="row"` that stays multi-column on phone
- Nest `WorkspaceSplit` inside another split’s `detail` (nested splits always stack)
- Set `min-block-size: 100dvh` on AppShell or add a second `[data-cu-shell]` wrapper
- Rewrite shell grid CSS to move footer — use `footerPlacement`
- Import `@ark-ui/*` or `@base-ui/react` — go through `@chameleon-ui/primitives`

## Related

- [`../navigation/README.md`](../navigation/README.md) — tab controller + TitleBar / NavAccountCard slots
- [`../navigation-title/README.md`](../navigation-title/README.md) — stack chrome
- [`../title-bar/README.md`](../title-bar/README.md) — sidebar brand
- [`../nav-account-card/README.md`](../nav-account-card/README.md) — sidebar account foot
- [`../footer/README.md`](../footer/README.md) — attribution
- [`../workspace-split/README.md`](../workspace-split/README.md) — multi-column main content
- Consumer SSOT: [`AGENTS.md`](../../../../AGENTS.md) App chrome
