# Footer

First-class **AppShell** attribution chrome (credits / legal / links).

Default surface is **transparent** (no filled paper/subtle background). Theme a fill only if the product needs one. AppShell `__footer` host matches that default.

Full shell recipe: [`../app-shell/README.md`](../app-shell/README.md).

## Where it goes

Put `Footer` in **AppShell** `footer` / Vue `#footer` — **not** Navigation `#footer` (that is the sidebar account foot / `NavAccountCard`).

```tsx
import { AppShell, Footer } from '@chameleon-ui/react'

<AppShell
  header={…}
  navigation={…}
  footer={
    <Footer>
      <p>UI powered by Chameleon UI.</p>
    </Footer>
  }
>
  {screen}
</AppShell>
```

## Placement (AppShell owns morph)

| `footerPlacement` | Behavior |
| :--- | :--- |
| `'auto'` (**default**) | Compact → flows at end of **main** (scrolls away); ≥48rem → shell-bottom chrome |
| `'shell'` | Always dedicated grid row outside main scroll |
| `'main'` | Always flows at the end of main |

Do not rewrite AppShell grid CSS to move footer.

## React vs Vue

| Concern | React | Vue |
| :--- | :--- | :--- |
| Content | `children` | default slot |
| Class | `className` | `class` |
