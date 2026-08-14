# @chameleon-ui/themes

L1 · 致敬主题 overlay + **`design-rules.json` 权威**。

8 套官方致敬主题已由项目所有者于 **2026-08-13** 确认无法律问题（所有者确认，非律所意见书），以**免费**官方主题出货。社区纪律包可以免费或付费。

## Phase 2 主题（8）

| id | 路径 | 说明 |
| :--- | :--- | :--- |
| `line` | `src/line/` | 极简线框，小圆角 |
| `silver-arrow` | `src/silver-arrow/` | 金属灰 accent，直角偏硬朗 |
| `stuttgart` | `src/stuttgart/` | 红黑运动配色，紧凑密度 |
| `corsa` | `src/corsa/` | 高饱和红 accent，直角锐利、高对比、无毛玻璃 |
| `cupertino` | `src/cupertino/` | 圆角友好，系统蓝 accent |
| `siren` | `src/siren/` | 高可视琥珀/黑警报，宽字距，无毛玻璃 |
| `wechat` | `src/wechat/` | 品牌绿 + 浅灰列表密度 |
| `ant-blue` | `src/ant-blue/` | 金融蓝，卡片化圆角 |

每个主题目录含：

- `tokens.json` — **overlay** 覆盖 core，不复制 `packages/tokens/src/core`
- `design-rules.json` — Phase 3 完整 rules：`typography`、`spacing`（含 `radiusStrategy`）、`colorBoundaries`、`forbiddenPatterns`、`composition`、`rtl`
- `meta.json` — `id`、`label`、`preview`、`fonts`
- `effects.css` — 可选；构建时追加进 `dist/<id>/variables.css`（圆角/阴影/动效语言）

## 构建

```bash
pnpm --filter @chameleon-ui/tokens build
pnpm --filter @chameleon-ui/themes build
pnpm --filter @chameleon-ui/themes test
pnpm --filter @chameleon-ui/themes validate-rules
```

## CSS 入口（勿猜 `dist/` 路径）

包 `exports` 才是合法 specifier。推荐别名：

```ts
import "@chameleon-ui/themes/cupertino/css";
```

`dist/` 形状也已导出（`./dist/*`），以下与上面指向同一文件：

```ts
import "@chameleon-ui/themes/dist/cupertino/variables.css";
```

TypeScript 可从 `themeCssSpecifier("cupertino")` / `themeCssDistSpecifier("cupertino")` 取到这两条字符串（写入 `dist/index.d.ts`）。不要使用未导出的路径，例如 `@chameleon-ui/themes/cupertino/variables.css`。

切换演示：`data-theme="line"` 等（由应用层加载对应 CSS）。

## 构建

## 社区纪律包（Phase 4）

| id | 路径 | 说明 |
| :--- | :--- | :--- |
| `community-focus-first` | `src/community-focus-first/` | 社区原创可访问性纪律包（非致敬 id） |

制品：`design-rules.json` + 可选 `tokens.json` overlay + `meta.json`。Registry `type` = `registry:rules`。

## 依赖

- `@chameleon-ui/tokens` — core 单源；overlay 通过 `compileThemeTokens` 合并
- **禁止**依赖 UI 框架

## 预留主题 id（禁止空壳冒充）

`aurora`、`nocturne`、`ember`、`cascade`、`horizon`、`prism` — 仅文档预留，非 Phase 2 八主题名单。
