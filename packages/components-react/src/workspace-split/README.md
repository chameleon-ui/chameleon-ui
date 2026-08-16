# WorkspaceSplit

Master–detail (optional tools) layout that morphs with the shell — not a frozen desktop Grid.

| Breakpoint | Layout |
| :--- | :--- |
| Compact (`< 48rem`) | Single column: master → detail → tools |
| Tablet (`≥ 48rem`) | Master \| detail; tools under detail if present |
| Desktop (`≥ 80rem`) | Master \| detail \| tools (when tools is set) |

Place as a **direct** child of `AppShell` main so height / scroll contracts apply. Do **not** nest a second `WorkspaceSplit` inside `detail` — nested splits always stack; put inspector/tools on the outer `tools` slot. Do **not** replace this with `Stack direction="row"` or a consumer CSS Grid that stays multi-column on phone.

## Scroll owner (unique)

Default `scrollMode="shell"`: panes do **not** get `overflow: auto`. AppShell `__main` is the scroll owner. Short / EmptyState content must not show nested scrollbars or reserved gutters.

| Mode | Guarantee |
| :--- | :--- |
| `shell` (default) | Split grows with content (`min-block-size: 100%`); `__main` scrolls when tall |
| `panes` | Split fills `__main`; panes scroll; `__main` overflow is hidden when split is a direct child |
| `none` | No default pane scroll; use `ScrollPane` or per-pane `masterScroll` / `detailScroll` / `toolsScroll` |

Per-pane `*Scroll` overrides the mode when set. Long queue lists: `masterScroll` or wrap the list in `ScrollPane`. Fixed-viewport dashboards: `scrollMode="panes"`.

Do **not** turn on pane scroll and also fight `__main` with ad-hoc `overflow: auto` on both — one owner only.
