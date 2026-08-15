# @chameleon-ui/install-core

**L3 安装内核 —— 整个 Chameleon UI 唯一写盘的包。**

CLI 与 MCP server 安装组件/主题时，**只有**本包负责写盘。其他任何包（`cli`、`mcp-server`、`adapter-*`、docs 的安装提示）都不得各自写一套安装逻辑。

## Public API

```ts
import {
  install,
  createInstallKernel,
  emitOptOut,
  emitIntentVsAdopt,
  mergeDesignRules,
  assertPaidRulesListingAllowed,
  createStubRulesDownloadAuth,
  type RegistryItem,
  type InstallRequest,
  type InstallResult,
  type TelemetryHook,
} from '@chameleon-ui/install-core';
```

- `install(req)` — 安装单个 registry 项（不做依赖解析）。冲突时抛 `InstallError`。
- `createInstallKernel(registry)` — 安装一项**及其声明的依赖**，按拓扑顺序。**CLI 和 MCP 都必须用它**。
- `emitOptOut(hook?, payload?)` / `emitIntentVsAdopt(hook?, payload)` — 提供 hook 时发遥测事件的助手。

## 已实现

- 依赖图解析 + 环检测（C6）
- 安装规划（dependency resolution）
- **冲突检测**（写盘前）
- **幂等写入**（相同文件重复运行跳过）
- 可选 install 遥测（调用者提供 `TelemetryHook` 才启用）
- Phase 4 纪律包：规则合并冲突检测（U9 错误）、付费下载鉴权端口（仅状态码，无支付 SDK）、官方致敬 id 保持免费 SKU（社区付费包允许）

## 尚未实现（本包明确不做）

- 网络下载 / 远程 registry 拉取（在 `@chameleon-ui/registry` HTTP client / `registry-private`）
- 安装期间执行脚本
- 超出"写盘前冲突检测"的局部写入回滚

## 遥测

遥测**默认关闭**；install-core 自身从不发送数据。调用者可传 `TelemetryHook` 接收事件：

- `install` — 成功写盘后发出（`itemId` / `itemType` / `source`，可选 `namespace` / `version`）
- `intent_vs_adopt` — MCP/CLI 在一次搜索推荐后发出
- `opt_out` — 用户关闭遥测时发出

hook **不得**收集源码或密钥。CLI / MCP 读取 `CU_TELEMETRY` 环境变量（`=1` 启用）；否则不传 hook、不记录事件。
