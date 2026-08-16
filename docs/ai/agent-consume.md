# Agent 消费：挂载与组合规范

完整规则以 [`../AGENTS.md`](../AGENTS.md) 为准。本文是面向外部消费应用的挂载与组合规范。

可直接粘贴的短规则见 [`consumer-agent-bootstrap.md`](./consumer-agent-bootstrap.md)。

三条基本约束：不要编造 CSS specifier；不要把 `workspace:*` 拷进消费者的 `package.json`；不要编造 `generation_quality` 分数、主题识别率或无障碍认证。

## 发射顺序

| 步骤 | 动作 |
| :--- | :--- |
| 0 | 选一个伞包（`@chameleon-ui/react` 或 `@chameleon-ui/vue`） |
| 1 | 引入伞包 CSS：`@chameleon-ui/react/css` 或 `@chameleon-ui/vue/css`（两者都指向真实 `dist/css.css`：tokens + density + linear + components） |
| 2 | 根节点包 `<ThemeProvider theme="linear" locale="…">`（`linear` 旗舰的含义是 CSS + 主题 + 组件级视觉 DoD，包括 Button 层级、Upload browse CTA、外壳发丝线节奏，不是只有 token 存在就算） |
| 3 | JS 也从同一个伞包引入 |
| 4 | 挂了 MCP：先调一次 `get_started`，写任何 `import` 前调 `get_import_specifiers` |
| 5 | 发组件前：对该 slug 调 `get_contract` |
| 6 | 处理密度、半径、RTL 前：带主题 id 调 `get_design_rules` |
| 7 | 找组件优先 `search_components`（`intent`），浏览用 `list_components` |
| 8 | 写盘只经 `chameleon add` 或 MCP `install_*` → `install-core` |
| 9 | SchemaRenderer 默认映射为 10 slugs，见 [`schema-renderer.md`](./schema-renderer.md) |
| 10 | `@chameleon-ui/adapter-ag-ui` 是 POC，不是 supported |

等价的拆分 CSS 引入（同样的层）：`@chameleon-ui/themes/linear/css` + `@chameleon-ui/tokens/css` + density + `@chameleon-ui/components-react/css`（React）或 `@chameleon-ui/components-vue/css`（Vue）。主题覆盖层：`@chameleon-ui/react/themes/<id>/css` 或 `@chameleon-ui/vue/themes/<id>/css`。致敬主题示例：`@chameleon-ui/themes/apple/css`。

禁止：`import "@chameleon-ui/themes/apple/variables.css"`，该路径未导出。

## CSS / JS（照抄即可）

```ts
import "@chameleon-ui/react/css"; // 真实 dist/css.css
import { Button, Card, Table, ThemeProvider } from "@chameleon-ui/react";
```

```ts
import "@chameleon-ui/vue/css"; // 真实 dist/css.css
import { AppShell, Button, Navigation, NavigationTitle, ThemeProvider } from "@chameleon-ui/vue";
```

底层包依然可用：`@chameleon-ui/components-react` 和 `@chameleon-ui/components-vue`。命名导出一律 PascalCase，slug 一律 kebab-case（`data-grid` → `DataGrid`）。

旗舰主题是 `linear`。包版本 `0.4.0`，未发布，用 pack-external、link 或 `file:` 接入（见下文）。

## App 外壳

原生模型是 tab 控制器加每 tab 一个栈，不是营销导航栏。规则以 [`AGENTS.md`](../AGENTS.md) 的 App chrome 一节为准，深度配方在 [`packages/components-react/src/app-shell/README.md`](../../packages/components-react/src/app-shell/README.md)。

### 槽位与组件

| 角色 | 组件 | 位置 |
| :--- | :--- | :--- |
| 根目的地 | `Navigation` | AppShell `navigation` / Vue `#navigation` |
| 侧栏品牌区 | `TitleBar` | Navigation 的 `header` / `#header`（不是 AppShell） |
| 侧栏账户与登出 | `NavAccountCard` | Navigation 的 `footer` / `#footer`（不是 AppShell） |
| 栈（标题、返回） | `NavigationTitle`（旧名 `NavigationBar`） | AppShell `header` / Vue `#header` |
| 版权、法律 | `Footer` | AppShell `footer` / Vue `#footer` |
| 主屏 | children / default | 可选 `WorkspaceSplit` |
| 站点链接 | `Navbar` | 不属于 AppShell |

### 默认值与高度

| API | 默认 |
| :--- | :--- |
| `footerPlacement` | `'auto'`（compact 时随 main 滚动，≥48rem 时固定在外壳底部） |
| `Footer` / `__footer` | 透明 |
| WorkspaceSplit `scrollMode` | `'shell'` |
| 外壳行高 | `calc(var(--cu-control-size-active) + 2 * var(--cu-space-1))`，作用于 NavigationTitle、Navigation `__header`、NavAccountCard |
| ≥48rem 顶部对齐 | Navigation `__frame` 起始仅留 safe-area |
| 高度链 | `html, body, #root|#app { block-size: 100%; margin: 0 }` → `<ToastProvider fill>` → AppShell 在父容器内边到边（除非有意，不要套 max-width 容器） |

```tsx
import {
  AppShell,
  Footer,
  NavAccountCard,
  Navigation,
  NavigationTitle,
  TitleBar,
} from "@chameleon-ui/react";

<AppShell
  header={<NavigationTitle title={title} backLabel={back} onBack={canPop ? pop : undefined} />}
  navigation={
    <Navigation
      label="Main"
      items={tabs}
      activeValue={tab}
      onSelect={selectTab}
      header={<TitleBar title="Product" subtitle="Tagline" logoSrc="/logo.png" onBrandClick={() => selectTab("home")} />}
      footer={<NavAccountCard username="Ada" nickname="admin" onLogout={signOut} />}
    />
  }
  footer={
    <Footer>
      <p>Credits</p>
    </Footer>
  }
>
  {screen}
</AppShell>
```

Vue 侧同名组件从 `@chameleon-ui/vue` 引入。AppShell 槽位为 `#header` / `#navigation` / `#footer`，品牌和账户用 Navigation 的 `#header` / `#footer`。一份 `items` 列表，CSS 负责 TabBar、护栏、侧栏之间的变形。注意：

- 不要组合 `Sidebar` + `TabBar`；
- `TitleBar` 和 `NavAccountCard` 仅用于侧栏；
- Navigation 设了 `footer` 时折叠开关省略；
- 不要再套第二层 `[data-cu-shell]`；
- 不要把 NavAccountCard 放进 AppShell footer。

ButtonGroup：互斥工具开关用它包住 `Button` 子节点（`variant="attached"|"spaced"`、`orientation`、`size`），选中态留在每个 Button 自己身上。

多列主体用一个 `WorkspaceSplit`（可选 `tools` / `#tools`）。滚动默认 `scrollMode="shell"`；某列必须自滚时用 `panes`、`*Scroll` 或 `ScrollPane`，不要在 `__main` 之下叠互相竞争的 `overflow: auto`。

设备到形态的对应（CSS px，@16px root）：375–430 用 TabBar 加单列工作区；768–820 用导航护栏，嵌在外壳内时通常仍单列；1024 用护栏加 master|detail（tools 在 detail 下）；≥1280 用侧栏加 master|detail；三栏仅当 WorkspaceSplit 主区 ≥80rem（带 16rem 导航时约 96rem 外壳）。

透明媒体用 `CheckerboardSurface`，或 `MaskPaintCanvas`、`ImageCompare` 的 `checkerboard`，共享 token，两者默认 `checkerboardContrast="strong"`。MaskPaint 的棋盘格只覆盖 contain 适配的矩形，letterbox 黑边不算。不要手写棋盘格渐变。MaskPaintCanvas 的缩放是内置的（`zoom` / `minZoom` / `maxZoom` / `wheelZoom`，句柄 `zoomIn`、`zoomOut`、`resetZoom`、`setZoom`、`getZoom`，平移用中键拖或 Space+拖），不要在舞台上用 CSS `transform: scale()` 自己实现。

模板：`templates/external-vite-react` · `templates/external-vite-vue`。

## 外部安装（未发布的 0.4.0）

在已构建的 `chameleon-ui/` 检出中执行（面向消费者的脚本，消费者侧不需要 monorepo filter）：

```bash
node ./scripts/pack-external.mjs
# 消费者侧：
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-react-0.4.0.tgz
```

```bash
node ./scripts/link-external.mjs --apply
npm link @chameleon-ui/react
```

Vue：

```bash
node ./scripts/pack-external.mjs --vue
npm install ../chameleon-ui/dist-tarballs/chameleon-ui-vue-0.4.0.tgz
# 或：
node ./scripts/link-external.mjs --vue --apply
npm link @chameleon-ui/vue
```

只装一个伞包。legacy 五包用 `--legacy-five`（见 AGENTS.md）。官方模板：`templates/external-vite-react` · `templates/external-vite-vue`。

Peer 版本在消费者应用里钉：React 侧 `react@^19` 和 `@ark-ui/react@5.38.0`，Vue 侧 `vue@^3.5` 和 `@ark-ui/vue@5.38.1`，两侧都需要 AGENTS.md 里的 FormatJS 钉版。React 18 不在支持范围内。Node ≥ 20.19。

## MCP 挂载（可选）

仅当消费者使用 MCP。在本库检出中构建一次 server：

```bash
# 仅挂载 MCP 时需要
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
```

消费者的 `.cursor/mcp.json` 或 Claude Code `.mcp.json` 只用相对路径，不要写机器绝对路径：

```json
{
  "mcpServers": {
    "chameleon-ui": {
      "command": "node",
      "args": ["../chameleon-ui/packages/mcp-server/dist/index.js"],
      "env": {
        "CU_TARGET_DIR": "."
      }
    }
  }
}
```

调整 `args[0]` 使其指向 `packages/mcp-server/dist/index.js`。`CU_TARGET_DIR: "."` 表示安装进消费者目录。完整挂载说明见 [`packages/mcp-server/README.md`](../../packages/mcp-server/README.md)。

`npx @chameleon-ui/mcp-server` 在 npm 发布前不可用。

### 工具

| 时机 | 工具 |
| :--- | :--- |
| 会话第一次调用 | `get_started` |
| 即将写 `import` | `get_import_specifiers` |
| 按家族浏览目录 | `list_components` |
| 按意图找组件 | `search_components`（带 `intent`） |
| 即将为某 slug 发 JSX/SFC | `get_contract` |
| 主题密度、RTL | `get_design_rules` |
| 列主题 | `list_themes` |
| 向 `CU_TARGET_DIR` 搭脚手架 | `install_with_theme`（及其他 `install_*`） |

另有：`get_component` · `install_component` · `install_block` · `install_theme` · `install_bundle` · `telemetry_opt_out` · `record_intent`。

## SchemaRenderer

见 [`schema-renderer.md`](./schema-renderer.md)。不要把 AG-UI POC 当作 supported。
