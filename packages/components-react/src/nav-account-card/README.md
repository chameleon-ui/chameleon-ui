# NavAccountCard

Official **Navigation sidebar foot**: avatar | username / nickname | **logout**.

Full shell recipe: [`../app-shell/README.md`](../app-shell/README.md). Navigation: [`../navigation/README.md`](../navigation/README.md).

## Where it goes

Put `NavAccountCard` in **Navigation** `footer` / Vue `#footer` — **not** AppShell `footer` (that is credits via `Footer`).

```tsx
<Navigation
  label="Main"
  items={tabs}
  header={<TitleBar title="Product" … />}
  footer={
    <NavAccountCard
      username="Ada"
      nickname="admin"
      avatarSrc="/ada.png"
      onLogout={() => signOut()}
    />
  }
/>
```

**DoD:** Visible in rail/sidebar (≥48rem). Compact TabBar hides `__footer`. When `footer` is set, Navigation does **not** render the collapse toggle (logout replaces that foot chrome). Only `__list` scrolls; header and footer stay pinned.

## Defaults

| Prop | Default |
| :--- | :--- |
| `logoutLabel` | `'Log out'` |
| `avatarFallback` | First letter of `username` |
| Logout event | React `onLogout` / Vue `@logout` |
| Chrome row height | `calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))` (+ `padding-block: var(--cu-space-1)`) — matches `NavigationTitle` |

Do not hardcode rem heights — densifies with `density.css`.
