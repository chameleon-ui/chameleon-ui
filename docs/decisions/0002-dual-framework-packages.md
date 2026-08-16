# ADR-0002：组件层按框架分包，统一发生在规格层

- 状态：已接受（CSS 单源化为已提议，未实施）
- 日期：2026-08-16

## 背景

组件层有两个包：`@chameleon-ui/components-react`（React，peer `react@^19`）和 `@chameleon-ui/components-vue`（Vue，peer `vue@^3.5`）。曾经讨论过：能否合并成一个 `components`，让开发者只关心 `react` / `vue` 两个伞包。

先说消费层的现状：开发者的主路径已经是伞包（`import { Button } from "@chameleon-ui/react"` 或 `@chameleon-ui/vue`），直接引 `components` / `components-vue` 只是兼容路径。单入口的心智模型已经成立。

再看重复在哪里。2026-08-16 实测，两侧组件的 `styles.css` 是逐字节复制的双份维护，而且已经开始分叉：

```
button / card / input / app-shell / navigation : 两侧一致
table                                          : 两侧不一致
```

CSS 和框架无关，却被维护了两份，`table` 的分叉说明这种方式已经开始出问题。

## 决策

保持两个物理包，不合并。统一放在规格层做：

1. `contract.json` 是每个 slug 的唯一真源（props / events / slots / `dataAi`）。
2. CSS 单源化（已提议）：抽一份样式真源（如独立的 styles 包，或并入 tokens/themes 管线），两个组件包构建时引用。
3. CI parity 门禁：`ai:check` 校验每个 slug 的 props / events / slots 命名与 contract 逐一对齐。CSS 单源化落地后，两侧样式一致由构建保证。

另外明确 parity 的目标：contract 层面的 API 表面对齐，不要求源码逐字相同。框架惯用法的差异（Vue 的 slot / `v-model`，React 的 render props / controlled）允许存在，但要由 contract 显式声明。

## 已否决的备选

合并成单个 `components` 包，四个问题：

1. peer 依赖爆炸。合并包要同时声明 `react@^19` 和 `vue@^3.5` 为 peer，每个消费者都被迫装两套框架，消费者 peer 表的简洁性就没有了。
2. 分裂是从地基继承的。Ark 自身就分 `@ark-ui/react` 和 `@ark-ui/vue`，组件层的双份是结构性必然。
3. 构建链完全不同。React 侧是 `tsc + copy-css`，Vue 侧是 `vite + vue-tsc + SFC`。合并等于把两套构建、测试、CI 塞进同一个发布单元，复杂度不减反增。
4. 版本耦合。任一侧修 bug，另一侧被迫跟升版本号。

## 后果

正面：消费者 peer 矩阵保持干净，各框架构建链独立演进，CSS 漂移有了根治路径。

代价：CSS 单源化落地前，`styles.css` 双份维护的漂移风险继续存在（`table` 已经是实例）。

待办：CSS 单源化的方案设计（包结构、构建改动、verify 脚本）；`ai:check` 增加 parity 校验。

## 重估条件

如果某框架侧的实现需要深度共享运行时逻辑（不只是样式），重新评估"框架无关 core + 薄绑定"的分层，参照 ADR-0003 的 Zag 路径。
