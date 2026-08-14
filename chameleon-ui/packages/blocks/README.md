# @chameleon-ui/blocks

Scenario blocks for Chameleon UI. Each block is a composable page fragment
built from `@chameleon-ui/components`, with a `contract.json`, a
`manifest.json` (`registry:block`), Token-only CSS, and 21 locale files.

Phase 7 scaffolding ships **twelve real blocks**. Remaining §7.3 work is
install-core wiring, snapshots, and matrix coverage—not stubbed slugs.

| slug | status |
| :--- | :--- |
| `login` | real |
| `register` | real |
| `crud-page` | real |
| `kanban` | real |
| `gantt` | real |
| `ticket-flow` | real |
| `approval-flow` | real |
| `im-chat` | real |
| `data-screen` | real |
| `trading-terminal` | real |
| `iot-panel` | real |
| `marketing-site` | real |

Copy is authored for `en` and `zh-CN`. The other 19 locales are English ICU
skeletons (`_cuSkeleton: true`) recorded in `locale-gap-table.json`. This is
not a completed 21-language Blocks pack.

Installation into an app still goes through `install-core` only. This package
does not write files to a consumer project.

Kanban movement is keyboard-first labeled buttons; this package does not ship
a pointer-drag engine. Gantt bars are percentage layout on a date scale, not a
dedicated drawing primitive, and large task lists are not virtualized.

## Usage

```ts
import { Login, Register, CrudPage, Kanban, Gantt, TicketFlow, ApprovalFlow, ImChat, MarketingSite } from '@chameleon-ui/blocks'

<Login locale="zh-CN" onSubmit={({ email, password }) => { /* ... */ }} />
```
