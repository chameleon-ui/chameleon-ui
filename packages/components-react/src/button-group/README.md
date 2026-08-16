# ButtonGroup

Groups related `Button` children into an **attached/segmented** or **spaced** cluster (EraseLab-style tool toggles: paint vs erase).

```tsx
import { Button, ButtonGroup } from '@chameleon-ui/react'

<ButtonGroup label="Mask tools" size="sm" variant="attached">
  <Button size="sm" variant={mode === 'paint' ? 'solid' : 'outline'} onClick={() => setMode('paint')}>
    Paint
  </Button>
  <Button size="sm" variant={mode === 'erase' ? 'solid' : 'outline'} onClick={() => setMode('erase')}>
    Erase
  </Button>
</ButtonGroup>
```

| Prop | Default | Notes |
| :--- | :--- | :--- |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `variant` | `attached` | `attached` (shared borders) \| `spaced` (token gap) |
| `size` | `md` | Size hint for nested `.cu-button` |
| `label` | — | `aria-label` for the group |
| `disabled` | `false` | Group-level `aria-disabled`; still disable each Button |

Selection state stays on each `Button` (`solid` vs `outline`). Uses existing Button tokens; CSS prefix `cu-button-group`.
