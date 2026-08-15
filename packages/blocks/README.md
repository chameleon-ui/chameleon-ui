# @chameleon-ui/blocks

Scenario blocks for Chameleon UI. Each block is a composable page fragment
built from `@chameleon-ui/components`, with a `contract.json`, a
`manifest.json` (`registry:block`), Token-only CSS, and 21 locale files.

Phase 7 ships **twelve real blocks** with Registry sync (`registry/b`),
install-core wiring, §7.4 matrix coverage, and `phase7:gates`.

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
not a completed 21-language Blocks pack. Honesty notes: `GAPS.md`. Matrix:
`scenario-matrix.json`.

Installation into an app goes through `install-core` only:

```
chameleon add-block login
# MCP: install_block { "id": "login" }
```

Kanban movement is keyboard-first labeled buttons; this package does not ship
a pointer-drag engine. Gantt bars are percentage layout on a date scale, not a
dedicated drawing primitive, and large task lists are not virtualized.

## Usage

```ts
import { Login, Register, CrudPage, Kanban, Gantt, TicketFlow, ApprovalFlow, ImChat, MarketingSite } from '@chameleon-ui/blocks'

<Login locale="zh-CN" onSubmit={({ email, password }) => { /* ... */ }} />
```
