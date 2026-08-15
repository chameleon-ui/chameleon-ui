# Token 工作原理

> **简体中文 · [English](token-system.en.md) · [繁體中文（香港）](token-system.zh-HK.md) · [العربية](token-system.ar.md)**

本文说明 Chameleon UI 的 **design token 系统**是如何工作的：从一份 DTCG 风格的 JSON 权威源，到浏览器可用的 CSS 自定义属性（`--cu-*`）。理解这个机制，是使用/覆盖 token、创建与继承主题的基础。

> 配套：[创建自定义主题](./creating-a-theme.md) 讲了"怎么覆盖 token 做主题"；本文讲"token 系统本身如何运转"。

---

## 1. 一张图

```
packages/tokens/src/core/*.json   ← DTCG 权威源（唯一）
        │  flattenTokens(展平)
        ▼
  扁平 token 列表（path → value）
        │  resolveTokens(解析引用 + 环检测)
        ▼
  已解析的 token（无 {…} 引用）
        │  renderCss
        ▼
  :root { --cu-color-fg-default: …; … }   ← dist/css/variables.css
```

主题路径上多了**一步 overlay**：

```
core 目录 + 主题 tokens.json(overlay)  → overlayTokenTrees(深合并)  → 编译 → 主题 variables.css
```

---

## 2. 权威源：`src/core/*.json`

所有设计决策的唯一数值来源是 `packages/tokens/src/core/` 下的几个 DTCG 文件：

`color.json` · `space.json` · `radius.json` · `shadow.json` · `motion.json` · `typography.json` · `blur.json` · `breakpoint.json` · `density.json`

- 结构是**嵌套 DTCG 对象**：组（group）下挂叶子（leaf），叶子由 `$type` + `$value` 定义。
- 一个真实例子：

```json
{
  "color": {
    "palette": {
      "brand": { "$value": "#2563eb", "$type": "color" }
    },
    "background": {
      "default": { "$value": "{color.palette.paper}" }
    }
  }
}
```

- `$value` 可直接是值，也可以是 `{...}` 引用（见第 4 节）。
- core 是**单一权威**：组件、主题都消费它编译出的产物，不各自复制一份数值。

---

## 3. 编译三步（`token-compiler.mjs`）

`@chameleon-ui/tokens/compiler` 的 `compileTokenObject(root)` 按三步处理：

### 3.1 `flattenTokens` — 展平

把嵌套 JSON 展平成一个 **path → value** 的扁平列表，例如 `color.fg.default`、`space.2`。复杂度 O(n)。

### 3.2 `resolveTokens` — 解析引用

把每个 `{...}` 引用解析成真实值（例如 `{color.palette.paper}` → `#ffffff`）。这一阶段会：

- **环检测**：`a` 引用 `b` 又引用 `a` → 抛错，绝不产生"部分成功"的 CSS。
- **未知引用**、重复路径、不可序列化值 → 抛错（错误含路径 + 原因 + 下一步）。

### 3.3 `renderCss` — 生成 CSS 变量

把每个 token 路径转成 CSS 自定义属性名：

```
color.fg.default  →  --cu-color-fg-default
space.2           →  --cu-space-2
breakpoint.mobile →  --cu-breakpoint-mobile
```

规则（见 `cssVariableName`）：

- 前缀固定 `--cu-`（常量 `tokenCssVariablePrefix`）。
- 路径段用 `-` 连接；非法字符替换为 `-`，并转小写。
- 若多个路径归一化到同一变量名 → 抛错（保证每个 `--cu-*` 唯一）。

产物装入 `:root { … }`，默认加载进 `@chameleon-ui/tokens/css`。

---

## 4. 引用语法 `{...}`

- `$value` 里可用 `{<path>}` 引用其它 token，例如 `{color.palette.ink}`。
- 引用解析后**不会再保留**在输出里；`dist/tokens.json` 是已解析的扁平表，JS/TS 可直接消费。
- 引用不会造成循环（环检测会拦住）。

---

## 5. 主题 = overlay（覆盖 core）

主题**不复制** core 源，而是提供一个 **overlay**：`packages/tokens/src/core/` 是基底，主题的 `tokens.json` 只写"要覆盖的子集"，由 `overlayTokenTrees` 做**深合并**（`compileThemeTokens(coreDirectory, overlay, label)`）：

- **叶子命中** → 用 overlay 的叶子覆盖 core 的叶子。
- **组不在 core** → 作为新组加入。
- **组递归深合并**：只覆盖提及的分支，未提及的保持 core 值。
- **约束**：不能用一个组去覆盖一个已有叶子；`$` 开头的元数据（`$type`/`$description`）直通，不在 overlay 里被当成 token 组。

> 复杂度 O(n log n)，空间 O(n)。保证：overlay 替换 core 叶子时**不复制 core 源树**。

例子：core 定义 `color.background.subtle = #f6f6f4`，某主题 overlay：`{ "color": { "background": { "subtle": { "$value": "#eef4f8" } } } }` → 最终该变量为 `#eef4f8`，其余背景色不变。

---

## 6. `$extends`：主题继承

一个主题的 overlay 文档可声明 `"$extends": "<ref>" | ["<ref>", ...]`，从而继承一个或多个基础主题/文档：

- **合并顺序**：父文档按数组顺序，derived（派生文档）最后——后者在叶子冲突时胜出；组按 overlay 的深合并规则。
- **环安全**：最大继承深度 16（`MAX_EXTENDS_DEPTH`），循环引用会给出可读的 chain 报错。
- **ref 解析**：由调用方注入的 `loadRef` 完成（本仓库是文件系统，且**限定在 `packages/themes/src` 内**，禁止逃逸到任意路径）。
- 复杂度 O(n + e)，空间 O(d)，d ≤ 16。
- **`$extends` 不会泄漏进输出**。

---

## 7. 产物

一次编译产出三份视图（`compileTokenObject` 的返回值，也写盘）：

| 产物 | 内容 |
| :--- | :--- |
| `css` | `:root { --cu-…: … }`（供 `@chameleon-ui/tokens/css` 与各主题 `/css`） |
| `dtcg` | 已解析的 DTCG 树（`toResolvedDtcgTree`） |
| `tokens` | 扁平 resolved token 列表（`dist/tokens.json`） |

**确定性保证**：输出不含时间戳；相同输入字节级一致。稳定排序、memo 化引用解析（摊还 O(d)，最大深度 32）。

---

## 8. 约定与限制

- **不依赖框架**：token 编译只发生在构建期，禁止 React / Vue / Svelte。
- **组件 CSS 不直接消费 `@media` 宽度断点**；三端（390/768/1280）用 `@container` + `--cu-*` 断点/密度 token（见 [`tokens/README.md`](../../packages/tokens/README.md) 的三端章节）。
- **`dist/css/variables.css` 是生成物，不要手改**。

---

## 参考

- 编译实现：[`packages/tokens/scripts/token-compiler.mjs`](../../packages/tokens/scripts/token-compiler.mjs)
- core 权威源：[`packages/tokens/src/core/`](../../packages/tokens/src/core/)
- token 包文档：[`packages/tokens/README.md`](../../packages/tokens/README.md)
- 用 overlay 建主题：[`创建自定义主题`](./creating-a-theme.md)
