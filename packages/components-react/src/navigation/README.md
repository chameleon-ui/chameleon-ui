# Navigation

Tab controller: one `items` list morphs TabBar ↔ rail ↔ sidebar. Mount in **AppShell** `navigation` / `#navigation`.

Full shell recipe + height chain: [`../app-shell/README.md`](../app-shell/README.md).

## Sidebar brand header

Official path: put **`TitleBar`** in `header` / Vue `#header`.

```tsx
<Navigation
  label="Main"
  items={tabs}
  header={<TitleBar title="Product" subtitle="Tagline" logoSrc="/logo.png" onBrandClick={goHome} />}
/>
```

**DoD:** TitleBar / `__header` is visible in rail/sidebar (≥48rem). Compact TabBar hides `__header` — do not duplicate logo+title+subtitle on mobile.

Chrome row (host): `min-block-size: calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))` with `padding-block: var(--cu-space-1)` — matches `NavigationTitle`. See [`../title-bar/README.md`](../title-bar/README.md).

## Sidebar account foot

Official path: put **`NavAccountCard`** in `footer` / Vue `#footer` — **not** AppShell `footer` (that is credits via `Footer`).

```tsx
<Navigation
  label="Main"
  items={tabs}
  footer={<NavAccountCard username="Ada" nickname="admin" onLogout={signOut} />}
/>
```

**DoD:** Visible in rail/sidebar (≥48rem). Compact TabBar hides `__footer`. When `footer` is set, the collapse toggle is **not** rendered. Scroll contract: only `__list` scrolls; header and footer stay pinned. AppShell `__nav` uses `overflow: hidden`.

See [`../nav-account-card/README.md`](../nav-account-card/README.md).

## Defaults

| Prop | Default |
| :--- | :--- |
| `maxCompactItems` | `4` (capped) |
| `moreLabel` | `'More'` |
| `collapsible` | `true` (ignored when `footer` is set) |
| `defaultCollapsed` | `false` |
| `expandLabel` / `collapseLabel` | `'Expand navigation'` / `'Collapse navigation'` |

## NEVER

- Compose `Sidebar` + `TabBar` for the same destinations
- Put stack title/back here — that is `NavigationTitle` in AppShell `header`
- Wrap Navigation + account card as siblings outside the landmark
