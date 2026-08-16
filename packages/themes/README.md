# @chameleon-ui/themes

**L1 · 致敬主题 overlay + `design-rules.json` 权威。禁止依赖 UI 框架。**

`themes` 在 `tokens` 核心之上提供**可换肤的 overlay 主题**。每个主题以 overlay 方式覆盖 core token，并携带一套完整的 `design-rules.json`（排版、间距、圆角策略、颜色边界、禁用模式、组合与 RTL 约束）。

当前共 **9 套**主题：视觉旗舰 `linear` + 7 套致敬覆盖层 + 1 个社区纪律包 `community-focus-first`。

> 8 套官方致敬主题已由项目所有者于 2026-08-13 确认无法律问题（所有者确认，非律所意见书），以**免费**官方主题出货。社区纪律包可免费或付费（经 `install-core` 校验）。

## 主题清单

| id | 说明 |
| :--- | :--- |
| `linear` | **视觉旗舰 · Linear 1:1 复刻**（字体/图标除外；依据 linear.app Button.css 与 /login 加载页真实 CSS）。深色优先：主画布 `#121213`、更深的侧边栏 `#09090a`、靛蓝 `#5e6ad2` 仅用于 CTA、药丸形按钮（hover `brightness(1.15)` / 按压 `scale(.97)` / 禁用 `opacity .5`）、白透明度 hairline、内容圆角 ≤8px、字重 510/590、动效 100/160ms ease-out-quad、焦点环 `#7180ff` 偏移 3px、禁回弹/渐变/表面玻璃/彩色阴影。**深/浅手动切换**：`colorScheme="light"` |
| `mercedes` | 梅赛德斯致敬。金属灰 accent，直角偏硬朗 |
| `porsche` | 保时捷致敬。红黑运动配色，紧凑密度 |
| `ferrari` | 法拉利致敬。高饱和红 accent，直角锐利、高对比、无毛玻璃 |
| `apple` | **视觉旗舰 · Apple 1:1 复刻**（字体/图标除外；依据 Human Interface Guidelines 与 iOS 系统色板）。浅色优先：基底 `#FFFFFF`、分组画布 `#F2F2F7`、systemBlue `#007AFF`（深色 `#0A84FF`）、label 纯黑、separator `rgba(60,60,67,0.29)`、systemFill 梯度做选中/hover、chrome 全部走 bar 材质（`saturate(180%) blur(20px)`）、药丸按钮（hover `brightness(1.08)` / 按压 `brightness(0.92)`）、圆角 8/10/14/20、正文 17px / Large Title 34px（行高 22/17）、动效 300ms UIKit ease-in-out、accent 焦点光晕、卡片无阴影。**深/浅手动切换**：默认浅色，`colorScheme="dark"` |
| `tiktok` | TikTok 致敬。高可视琥珀/黑警报，宽字距，无毛玻璃 |
| `wechat` | 微信致敬。品牌绿 + 浅灰列表密度 |
| `alipay` | 支付宝致敬。金融蓝，卡片化圆角 |
| `community-focus-first` | 社区原创可访问性纪律包（非致敬 id；`registry:rules`） |

> **状态说明**：`linear` 与 `apple` 是**两套经过完整断言验证的视觉旗舰**（色值、动效、字级、圆角均由测试锁定），默认外观用 `linear`；「像不像原品」的观感验收仍以浏览器人眼实测为准。其余 6 套致敬覆盖层**仍在打磨中**，可作为灵感与探索。

> 预留但**禁止空壳冒充**的 id：`aurora`、`nocturne`、`ember`、`cascade`、`horizon`、`prism`——仅文档预留，非正式主题。

## 每个主题目录

`src/<id>/` 通常包含：

- `tokens.json` — **overlay** 覆盖 core，不复制 `packages/tokens/src/core`
- `tokens.light.json` — 可选；浅色 scheme overlay（建议 `$extends: "./tokens.json"` 后只翻转色板/阴影），构建为 `:root[data-color-scheme="light"]` 块；消费方用 `<ThemeProvider colorScheme="light">` 手动切换
- `design-rules.json` — 完整 rules：`typography`、`spacing`（含 `radiusStrategy`）、`colorBoundaries`、`forbiddenPatterns`、`composition`、`rtl`
- `meta.json` — `id`、`label`、`preview`、`fonts`；有浅色 scheme 的主题声明 `colorSchemes` + `defaultColorScheme`
- `effects.css` — 可选；构建时追加进 `dist/<id>/variables.css`（圆角/阴影/动效语言）

## CSS 入口（勿猜 `dist/` 路径）

包 `exports` 才是合法 specifier。推荐别名：

```ts
import "@chameleon-ui/themes/apple/css";
```

`./dist/*` 也已导出，以下与上面指向同一文件：

```ts
import "@chameleon-ui/themes/dist/apple/variables.css";
```

TypeScript 可用 `themeCssSpecifier("apple")` / `themeCssDistSpecifier("apple")` 获取这两条字符串（写入 `dist/index.d.ts`）。**不要**使用未导出的路径，如 `@chameleon-ui/themes/apple/variables.css`。

应用层通过加载对应 CSS 切换主题，例如 `data-theme="linear"` 等。

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
