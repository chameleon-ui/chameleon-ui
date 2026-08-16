# NavigationTitle

Stack chrome for the current view controller (UINavigationBar / Android Toolbar): **title**, optional **back**, leading / trailing bar items.

Formerly **`NavigationBar`** — renamed so it is not confused with **`Navigation`** (tab controller / destinations). `NavigationBar` remains a deprecated export alias of the same component.

## Where it goes

Put `NavigationTitle` in **AppShell** `header` / Vue `#header`.

| Component | Role | Slot |
| :--- | :--- | :--- |
| **Navigation** | Destination list (TabBar ↔ rail ↔ sidebar) | AppShell `navigation` / `#navigation` |
| **NavigationTitle** | Stack title + back | AppShell `header` / `#header` |
| **TitleBar** | Sidebar brand (logo + title) | **Navigation** `header` / `#header` (sidebar only) |

Full shell recipe: [`../app-shell/README.md`](../app-shell/README.md).

## Defaults

| Prop | Default | Notes |
| :--- | :--- | :--- |
| `backLabel` | `'Back'` | Shown on the back control when `onBack` is set |
| `onBack` | omitted | Omit on root controller → no back control |
| Chrome row height | `calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))` | `.cu-navigation-title__frame`; matches TitleBar host / NavAccountCard |

## React vs Vue

| Concern | React | Vue |
| :--- | :--- | :--- |
| `title` | `ReactNode` prop | `string` prop + optional `#title` slot |
| `leading` / `trailing` | node props | `#leading` / `#trailing` slots |
| Class | `className` | `class` |

## Example

```tsx
<AppShell
  header={
    <NavigationTitle
      title={stacks.current.title}
      backLabel={stacks.previous?.title}
      onBack={stacks.canPop ? stacks.pop : undefined}
    />
  }
  navigation={…}
>
  {screen}
</AppShell>
```

Pair with `useTabStacks`: tab switch does not push; `onBack` calls `pop`.

## NEVER

- Put root destinations here — those belong on `Navigation`
- Put sidebar brand here — that is `TitleBar` in Navigation `header`
- Use site `Navbar` as AppShell stack chrome
- Hardcode rem bar heights — use the shared chrome formula above
