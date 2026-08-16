# TitleBar

Official **Navigation sidebar brand header** (logo + title + subtitle).

Full shell recipe: [`../app-shell/README.md`](../app-shell/README.md). Navigation: [`../navigation/README.md`](../navigation/README.md).

## Where it goes

Put `TitleBar` in **Navigation** `header` / Vue `#header` — **not** AppShell `header` (that is `NavigationTitle`).

Compact TabBar **must not** show this structure: Navigation hides `.cu-navigation__header` below 48rem (formal DoD).

## Defaults

| Behavior | Default |
| :--- | :--- |
| Interactive (home) | `brandInteractive={true}` |
| Click | `onBrandClick` / Vue `@brand-click` first, then `homeHref` unless `preventDefault` |
| Context menu | suppressed (`preventContextMenu={true}`) |
| Text selection | `user-select: none` (`userSelectNone={true}`) |
| Density | `density="default"` (`compact` = mark-only) |
| Host chrome row | Navigation `__header`: `calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))` |
| Collapsed rail | CSS hides title/subtitle under `.cu-navigation--collapsed` |

## Example

```tsx
<Navigation
  label="Main"
  items={tabs}
  header={
    <TitleBar
      title="EraseLab"
      subtitle="智能去水印"
      logoSrc="/logo.png"
      onBrandClick={() => selectTab('home')}
    />
  }
/>
```
