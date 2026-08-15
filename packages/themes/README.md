# @chameleon-ui/themes

**L1 · 致敬主题 overlay + `design-rules.json` 权威。禁止依赖 UI 框架。**

`themes` 在 `tokens` 核心之上提供**可换肤的 overlay 主题**。每个主题以 overlay 方式覆盖 core token，并携带一套完整的 `design-rules.json`（排版、间距、圆角策略、颜色边界、禁用模式、组合与 RTL 约束）。

当前共 **9 套**主题：视觉旗舰 `line` + 7 套致敬覆盖层 + 1 个社区纪律包 `community-focus-first`。

> 8 套官方致敬主题已由项目所有者于 2026-08-13 确认无法律问题（所有者确认，非律所意见书），以**免费**官方主题出货。社区纪律包可免费或付费（经 `install-core` 校验）。

## 主题清单

| id | 说明 |
| :--- | :--- |
| `line` | **视觉旗舰**。极简线框，小圆角 |
| `silver-arrow` | 金属灰 accent，直角偏硬朗 |
| `stuttgart` | 红黑运动配色，紧凑密度 |
| `corsa` | 高饱和红 accent，直角锐利、高对比、无毛玻璃 |
| `cupertino` | 圆角友好，系统蓝 accent |
| `siren` | 高可视琥珀/黑警报，宽字距，无毛玻璃 |
| `wechat` | 品牌绿 + 浅灰列表密度 |
| `ant-blue` | 金融蓝，卡片化圆角 |
| `community-focus-first` | 社区原创可访问性纪律包（非致敬 id；`registry:rules`） |

> **状态说明**：`line` 是**唯一经过完整验证的视觉旗舰**（默认外观，作为产品标准）。其余 8 套致敬覆盖层**仍在打磨中**，可作为灵感与探索；需要可靠默认主题请用 `line`。

> 预留但**禁止空壳冒充**的 id：`aurora`、`nocturne`、`ember`、`cascade`、`horizon`、`prism`——仅文档预留，非正式主题。

## 每个主题目录

`src/<id>/` 通常包含：

- `tokens.json` — **overlay** 覆盖 core，不复制 `packages/tokens/src/core`
- `design-rules.json` — 完整 rules：`typography`、`spacing`（含 `radiusStrategy`）、`colorBoundaries`、`forbiddenPatterns`、`composition`、`rtl`
- `meta.json` — `id`、`label`、`preview`、`fonts`
- `effects.css` — 可选；构建时追加进 `dist/<id>/variables.css`（圆角/阴影/动效语言）

## CSS 入口（勿猜 `dist/` 路径）

包 `exports` 才是合法 specifier。推荐别名：

```ts
import "@chameleon-ui/themes/cupertino/css";
```

`./dist/*` 也已导出，以下与上面指向同一文件：

```ts
import "@chameleon-ui/themes/dist/cupertino/variables.css";
```

TypeScript 可用 `themeCssSpecifier("cupertino")` / `themeCssDistSpecifier("cupertino")` 获取这两条字符串（写入 `dist/index.d.ts`）。**不要**使用未导出的路径，如 `@chameleon-ui/themes/cupertino/variables.css`。

应用层通过加载对应 CSS 切换主题，例如 `data-theme="line"` 等。

## 构建 / 校验

```bash
pnpm --filter @chameleon-ui/tokens build
pnpm --filter @chameleon-ui/themes build
pnpm --filter @chameleon-ui/themes test
pnpm --filter @chameleon-ui/themes validate-rules
```

## 依赖

- `@chameleon-ui/tokens` — core 单源；overlay 通过 `compileThemeTokens` 合并
- **禁止**依赖 React / Vue / Svelte

## 创建自定义主题

想添加自己的品牌主题？主题是一个 overlay（只覆盖 core token 子集）。完整分步教程见：

[**docs/theming/creating-a-theme.md**](../../docs/theming/creating-a-theme.md)

要点：新建 `src/<id>/`（`tokens.json` + `design-rules.json` + `meta.json` + 可选 `effects.css`）→ 把 `<id>` 加进 `build-themes.mjs` 的 `themeIds` → 构建 → 在 `exports` 加 `./<id>/css` 别名 → 用 `@chameleon-ui/themes/<id>/css` 引入。
