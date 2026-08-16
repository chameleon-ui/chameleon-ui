# Stack

Shipped. Flex layout with token gaps, cross-axis `align` (default `stretch`), main-axis `justify`, and optional `grow` to fill a flex/grid parent (workspace panes, toolbars).

| Prop | Default | Notes |
| :--- | :--- | :--- |
| `direction` | `column` | `row` \| `column` |
| `gap` | `2` | Token steps `0`…`6` |
| `align` | `stretch` | Cross axis; `start` is a real modifier (not stuck on stretch) |
| `justify` | `start` | Main axis; includes `between` |
| `grow` | `false` | `flex: 1 1 auto` + self stretch for pane fill |

Do not freeze `direction="row"` for phone-morphing multi-column workspaces — use `WorkspaceSplit`. Do not import `@ark-ui/*` or `@base-ui/react`; go through `@chameleon-ui/primitives`.
