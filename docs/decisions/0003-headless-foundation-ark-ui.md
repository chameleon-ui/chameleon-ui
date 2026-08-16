# ADR-0003：headless 地基基于 Ark UI，以 primitives 为隔离层

- 状态：已接受
- 日期：2026-08-16

## 背景

组件层不直接依赖 Ark。`@chameleon-ui/primitives` 的包描述就是规则：组件必须 import 这个包，不允许 import `@ark-ui/*`。Ark 只存在于 primitives 的薄封装之下，理论上可以替换。

曾经讨论过：地基为什么不自己写。

headless 层的实际内容：焦点陷阱、按 WAI-ARIA APG 的键盘映射、portal / dismiss layer、屏幕阅读器行为、跨浏览器兼容。这是组件库里最深、最容易出 bug 的部分，而且和无障碍合规风险直接相关。

当时不自己写的三个理由：

1. 风险归属。本库文档自述 VPAT 是 `status=draft`、`commercialClaimsAllowed=false`，连继承来的无障碍能力都还没完成认证。自建地基意味着从此自己承担每一个 a11y bug，而不是继承 Radix/Ark 多年的修复积累。
2. 投入量级。Chakra UI 团队在 ad-hoc 状态逻辑上踩了多年坑，之后推倒重来做了 Zag 状态机；Radix 背后是专职团队。headless 层是数人年级的投入。
3. 机会成本。本库的差异化在主题体系、contract / `dataAi`、MCP server、SchemaRenderer。花时间重写 combobox 的键盘导航，就少了花在这些方向上的时间。

## 决策

地基继续用 Ark UI（`@ark-ui/react@5.38.0` / `@ark-ui/vue@5.38.1`），位置固定在 primitives 之下。隔离层的纪律由现有检查机制保证：组件层禁止直接 import `@ark-ui/*`。

## 已否决的备选

全量自建 headless：在 0.3.0 未发布、团队规模有限的当下不是合适的时机，理由见背景。

立即直建 Zag：Zag.js 是框架无关的状态机（Ark = Zag + 每框架的 DOM 接线）。在 Zag 上自建 React/Vue 绑定可以得到一份行为真源、两个框架投影，这是比 CSS 单源更深的统一。代价是 Ark 已经完成的全量 DOM/ARIA 接线要收回自己做。结论：记录为未来选项，本周期不执行。

## 后果

正面：行为层质量继承自成熟地基，投入集中在差异化方向。

代价：行为层的能力上限受 Ark 约束；`@ark-ui/react` 和 `@ark-ui/vue` 之间的行为漂移会成为本库的 parity 风险源。Ark 大版本升级需要两侧同步评估，避免半升级状态。

## 重估条件

满足任一条件时重新评估直建 Zag：

1. Ark 两侧实现的行为漂移成为实际的 parity 问题；
2. 需要 Ark 没有的交互模式；
3. 团队规模足以承担地基的维护。

届时先用 1 到 2 个组件做 Zag-under-primitives 的实验，不做全量重写。
