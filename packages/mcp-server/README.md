# @chameleon-ui/mcp-server

**L3 · 面向 Chameleon UI 的 stdio Model Context Protocol server。**

让 AI 代理（agent）能查询组件契约、获得合法 import specifier，并**经 `@chameleon-ui/install-core`** 安装组件/主题/Blocks。只读工具（`get_started`、`list_components`、`get_contract`、`get_design_rules`、`get_import_specifiers`）**不写盘**；写盘只经 install-core。

> AI 代理请先读 [`AGENTS.md`](../../AGENTS.md) 与 [`docs/ai/agent-consume.md`](../../docs/ai/agent-consume.md)。挂载时 `initialize` 返回 `instructions`；**先调 `get_started`**，任何 CSS/JS import 前先 `get_import_specifiers`。

## 运行

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server build
node ./packages/mcp-server/dist/index.js
```

server 从 stdin 读 JSON-RPC，往 stdout 写响应；日志与遥测发到 stderr。

## 挂载到 Cursor / Claude Code

在**消费者工程**的 `.cursor/mcp.json`（Cursor）或 `.mcp.json`（Claude Code）里配置。**不要**硬编码机器根路径（`D:/…`、`/Users/…`）。

消费者工作区为 cwd，用**相对**路径指向库（兄弟 checkout 示例）：

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

- `args[0]` — 从消费者工程到 `chameleon-ui/packages/mcp-server/dist/index.js` 的相对路径。布局不同则调整 `../chameleon-ui/...`。
- `CU_TARGET_DIR` — `.` 把 `install_*` 写进消费者（相对 MCP 进程 cwd，通常是消费者工作区）。
- 若 library 即 cwd：`"command": "pnpm"`、`"args": ["--filter", "@chameleon-ui/mcp-server", "exec", "chameleon-mcp"]`、`"cwd": "../chameleon-ui"`，并把 `CU_TARGET_DIR` 设为**相对该 library cwd** 的路径（如 `../my-app`）——不是 `.`。

只读工具在目标目录为空时也用捆绑目录工作。包当前 `0.4.0` 未发布；`npx @chameleon-ui/mcp-server` 在 npm 发布前**不可用**。

可直接复制的消费者规则：[`docs/ai/consumer-agent-bootstrap.md`](../../docs/ai/consumer-agent-bootstrap.md)。

## 工具

| 工具 | 说明 |
| :--- | :--- |
| `get_started` | **先调用**。目录摘要、CSS + `ThemeProvider theme="linear"`、工具顺序、模板、禁止项 |
| `list_components` | 按 family 浏览 catalog（偏好 `search_components` + `intent`） |
| `search_components` | 按 `query`（id/name）或 `intent`（契约驱动、可解释）搜索 |
| `get_component` | 完整 registry 项（文件+依赖）；取 v0.2 JSON 用 `get_contract` |
| `get_contract` | 按 slug 取 v0.2 `contract.json` |
| `get_design_rules` | 按 theme id（或社区 rules pack id）取 `design-rules.json` |
| `get_import_specifiers` | 外部工程合法 CSS/JS specifier；默认主题 `linear`。写 import 前调用 |
| `list_themes` | 8 套官方致敬主题（旗舰：`linear`） |
| `install_component` | 经 install-core 装一个组件 |
| `install_block` | 经 install-core 装一个场景块（`registry:block`）+ 组件依赖 |
| `install_theme` | 经 install-core 装一个主题 |
| `install_bundle` | 组件+主题（两次运行）；优先 `install_with_theme` |
| `install_with_theme` | 组件+tokens+字体+design-rules 一次幂等完成 |
| `telemetry_opt_out` | 关闭遥测并发出 opt-out |
| `record_intent` | intent-vs-adopt 遥测（除非 `CU_TELEMETRY=1`，否则空操作） |

## 环境变量

- `CU_TARGET_DIR` — 安装目标目录（默认 `./chameleon-ui`）
- `CU_TELEMETRY=1` — 启用遥测（默认关闭）
- `CU_REGISTRY_URL` — 可选私有 registry base URL（不设则用捆绑目录）
- `CU_REGISTRY_TOKEN` — bearer token；`CU_REGISTRY_URL` 设置时必须
- `CU_REGISTRY_NAMESPACE` — 命名空间（默认 `public`）

## Telemetry

默认**关闭**。启用时安装与 opt-out 事件以 JSON 打到 stderr。不采集源码或密钥，不用网络分析 SDK。

## 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/mcp-server test
```
