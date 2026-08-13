# @chameleon-ui/install-core

未来 CLI 与 MCP 共用的安装内核落点。

## Phase 0 状态：仅预留，未实现

- 当前唯一公共 API 是类型 `TelemetryHook`。
- 没有钩子实例、事件分发器、安装解析、Registry 读取、网络请求或磁盘写入。
- **不会发送任何遥测事件，也不能被对外演示为已有回流能力。**
- `@phase-1 @telemetry:hook` 只标记未来扩展点；Phase 1 实现仍须满足告知、可关闭、禁止采集源码与密钥等约束。

安装规划、冲突检测、幂等写入和遥测事件全部延期到 Phase 1；本阶段不得在本包继续增加假实现。
