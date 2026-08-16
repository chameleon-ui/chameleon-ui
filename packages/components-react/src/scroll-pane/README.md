# ScrollPane

Single nested scroll host for a region inside AppShell `__main`.

Prefer **one** scroll owner:

| Placement | Effect |
| :--- | :--- |
| Direct child of `__main` | AppShell hides `__main` overflow; this pane owns scroll |
| Inside a `WorkspaceSplit` pane | Use for a long list when `scrollMode="shell"` (default) instead of turning on every pane |

Do not wrap content in `ScrollPane` and also leave competing `overflow: auto` on `__main` ancestors you control — when this is a direct child, the library already disables `__main` scroll.
