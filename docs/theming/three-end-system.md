# 三端一体工作原理

"三端一体"指 Chameleon UI 用**同一套组件**自动适配**三种设备形态**——手机（390）、平板（768）、桌面（1280），而不是每个形态各写一套。本文讲清楚它的**真实机制**。

> 配套：Token 如何编译见 [`token-system.md`](./token-system.md)；如何建主题见 [`creating-a-theme.md`](./creating-a-theme.md)。

---

## 0. 先厘清一个概念：React / Vue 与"三端"的关系

讲三端前必须先说清"框架"这一维，避免混淆两个不同的"端"：

- **框架维度 = React、Vue**（两个渲染适配层）。见下节。
- **视口/形态维度 = 手机、平板、桌面（三端一体）**。这才是"三端"。

两者正交：React 与 Vue **各自都实现三端一体**。所以"三端一体"不是某个框架独有，而是设计系统的共同能力。

### 为什么区分 React 和 Vue？

因为底层 **headless 内核（Ark UI / Zag）是按框架打包的**，无法跨框架共用接口：

| | React 线 | Vue 线 |
| :--- | :--- | :--- |
| headless 内核 | `@ark-ui/react` → `primitives` | `@ark-ui/vue` → `primitives-vue` |
| 组件壳 | `components`（`*.tsx`） | `components-vue`（`*.vue`） |
| 消费伞包 | `@chameleon-ui/react` | `@chameleon-ui/vue` |

但这两条线**共享同一套设计层**，所以不是"两套随机库"，而是"一个设计系统 × 两个渲染适配"：

- **单一 catalog**：`components/catalog.json`（103 组件）是唯一权威，Vue **没有自己的 catalog**。
- **同一契约**：`contract.json` 被 React 与 Vue 共用（`Button` 的 props/a11y/RTL 行为完全相同）。
- **同一 token / i18n / 主题**：`tokens`、`i18n`（21 语言）、`themes` 全双端共用。

结论：**设计决策在共享的 L1（token/契约/i18n）层，React/Vue 只负责把同一套语义"翻译"成各自框架的组件**。这就是"双框架一致"的根基，也是为什么分 React/Vue、而不是只做一套。

---

## 1. 三端 = 三个断点档位

三端的物理基础是三档**断点 token**（定义在 `packages/tokens/src/core/breakpoint.json`）：

| 档 | token | 值 | 范围 |
| :--- | :--- | :--- | :--- |
| mobile | `breakpoint.mobile` | `0px` | `< 768px` |
| tablet | `breakpoint.tablet` | `48rem` | `768 – 1279px` |
| desktop | `breakpoint.desktop` | `80rem` | `≥ 1280px` |

断点用 **rem**（而非 px）表达，保证跟随根字号缩放、放大不失真。这也是 `390 / 768 / 1280` 这些数字的来源（@16px root）。

---

## 2. 三端最核心的机制：容器查询（`@container`）而非 `@media`

传统做法用 `@media (min-width: 1280px)` 按**视口**切换。Chameleon UI 用的是**容器查询**：组件查看**自己所在容器**的宽度，而不是整个浏览器视口。

```
组件自身宽度 =  < 20rem    → 手机形态
               48–80rem    → 平板形态（可折叠 rail）
              ≥ 80rem      → 桌面形态（持久侧栏）
```

**为什么用容器查询？**
- 组件在"嵌进窄 sidebar"还是"占满宽视口"时，应按**自身可用宽度**变形，而非按浏览器窗口。
- 例如 Navigation（见第 4 节）用 `@container navigation (min-width: …)` 判断自己容器宽度来决定侧栏/可折叠/Tab。

**门禁保证**：组件 CSS **禁止直接消费 `@media` 宽度断点**（stylelint `chameleon/no-breakpoint-literal` 会拦截），宽度响应一律走 `@container`——保证机制不会被绕过、保持一致。

---

## 3. 密度与控件随端变化

三端不仅有"布局"差异，还有**密度**差异：同一组件在手机上更宽松（触控友好）、在桌面上更紧凑。

### 3.1 密度 token（`density.json`）

| token | 系数 |
| :--- | :--- |
| `density.compact` | `0.875` |
| `density.standard` | `1` |
| `density.comfortable` | `1.125` |

控件最小高度三档：`control.size.{compact,standard,comfortable}` = `2.25 / 2.5 / 2.75rem`（即 36 / 40 / 44px @16px root）。`touch-target.min` = `2.75rem`（44px，触控无障碍下限）。

### 3.2 随端默认密度

`@chameleon-ui/tokens/density.css`（由 `scripts/density-css.mjs` 生成）提供**随断点变化的默认密度**：

| 端 | 默认密度 |
| :--- | :--- |
| mobile | `comfortable`（宽松，44px 触控目标） |
| tablet | `standard` |
| desktop | `compact`（紧凑） |

**双通道切换**：
- **视口级**：`@media` 覆盖页面级 shell（页面整体随窗口宽度变密度）。
- **容器级**：`@container app-shell` 覆盖"宽视口里内嵌的窄 shell"（如 dashboard 里嵌一个小面板）——这是 `A5.3` 场景。
- **显式覆盖**：`<html data-density="compact|standard|comfortable">` 可强制指定某档，不受断点影响。

**重要**：消费 `@chameleon-ui/tokens/css` 的应用**必须同时** `import '@chameleon-ui/tokens/density.css'`，否则 `--cu-density-active` / `--cu-control-size-active` 不随断点切换。

---

## 4. 三端导航：同一个 API，三种形态

应用骨架（`AppShell`）与导航（`Navigation`）是"三端一体"最直观的展示——**用同一份 `items` 数据，在三种宽度下呈现三种形态**：

| 端 | Navigation 形态 |
| :--- | :--- |
| 手机（窄容器） | 底部 **Tab Bar**（紧凑），溢出项收进 `More` |
| 平板 | **可折叠 rail** |
| 桌面（宽容器） | **持久侧栏** |

实现：`Navigation` 的 CSS 用容器查询按 `min-width: 48rem / 80rem` 切换形态：

```css
@container navigation (min-width: 80rem) { /* 侧栏形态 */ }
@container navigation (min-width: 48rem)  { /* rail 形态 */ }
@container navigation (max-width: 20rem)  { /* Tab 形态 */ }
```

配套三端组件：`AppShell`（三端应用骨架）· `SafeArea`（刘海/手势条安全区）· `ActionSheet`（手机底部动作面板）· `Navbar` / `NavigationBar`（横向列队导航）。

---

## 5. 工作流：为什么"一套代码、三种形态"不炸

- **样式**：单个组件样式用容器查询写三档，CSS 自定义属性（`--cu-*`）承载 token 值。
- **JS/逻辑**：同一份组件 API（`items`、`locale`、props）——形态切换是纯 CSS 的，不改变数据结构。
- **契约**：`contract.json` 记录 `responsive` 与三端行为，React/Vue 双端共享。

于是"三端一体"不是三份实现，而是**一份契约 + 一份交互逻辑 + 容器查询样式**，在三种宽度下自动变形。

---

## 6. 快速自查

1. 切换了三端不生效？
   - 确认引入了 `@chameleon-ui/tokens/density.css`（见 3.2）。
   - 确认没被 stylelint 挡下 `@media` 宽度断点（应改 `@container`）。
2. 某组件嵌在窄容器里没变小？
   - 它依赖的容器需要设 `container-type: inline-size`（如 Navigation 容器、AppShell）。
3. `data-density` 不生效？
   - `density.css` 未引入，或 `[data-density]` 拼写不符 `compact|standard|comfortable`。

---

## 参考

- 断点/密度 token 源：`packages/tokens/src/core/breakpoint.json` · `density.json`
- 密度生成脚本：`packages/tokens/scripts/density-css.mjs`
- 三端导航样式：`packages/components/src/navigation/styles.css`
- 应用骨架样式：`packages/components/src/app-shell/styles.css`
- Token 工作原理：[`token-system.md`](./token-system.md)
- Token 包文档：[`packages/tokens/README.md`](../../packages/tokens/README.md)
