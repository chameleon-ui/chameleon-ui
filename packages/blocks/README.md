# @chameleon-ui/blocks

**L3 · 可组合的场景块（scenario blocks）。**

每个 block 是一段可组合的页面片段，由 `@chameleon-ui/components-react` 构成，并带 `contract.json`、`manifest.json`（`registry:block`）、Token-only CSS 与 21 个 locale 文件。

## Blocks（12 个，均 real）

`login` · `register` · `crud-page` · `kanban` · `gantt` · `ticket-flow` · `approval-flow` · `im-chat` · `data-screen` · `trading-terminal` · `iot-panel` · `marketing-site`

每条都接通 Registry 同步（`registry/b`）、install-core 写入、§7.4 matrix 覆盖与 `phase7:gates`。

## 安装

安装只能经 `@chameleon-ui/install-core`：

```bash
chameleon add-block login
# MCP: install_block { "id": "login" }
```

## 语言覆盖（诚实说明）

Block 文案只编写了 `en` 与 `zh-CN`；其余 19 个 locale 是英文 ICU 骨架（`_cuSkeleton: true`），记录在 `locale-gap-table.json` 中——**不是完整的 21 语言 Blocks 包**。详见 `GAPS.md`；矩阵见 `scenario-matrix.json`。

## 实现说明

- Kanban 移动是键盘优先的命名按钮；本包**不**提供指针拖拽引擎。
- Gantt 条是日期刻度上的百分比布局，**不是**专用绘图原语；大任务列表未虚拟化。

## 用法

```ts
import { Login, Register, CrudPage, Kanban, Gantt, TicketFlow, ApprovalFlow, ImChat, MarketingSite } from '@chameleon-ui/blocks'

<Login locale="zh-CN" onSubmit={({ email, password }) => { /* ... */ }} />
```
