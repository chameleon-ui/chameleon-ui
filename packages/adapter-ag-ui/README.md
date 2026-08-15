# @chameleon-ui/adapter-ag-ui

**L3 协议适配（POC）—— AG-UI 组件状态 ↔ agent 状态的同步。** 不进 L1/L2。协议分支只在适配器。

## 支持级别

**POC**（决策记录见 [DECISION.md](./DECISION.md)）：双向状态同步已实现且有断言测试；**尚未**与 AG-UI 参考实现做线上互操作认证，不宣称协议认证。**版本统一到 0.2.0**；如事件形状变更，会在 CHANGELOG 记录。

## 能力

- `createAgUiPeerPair(initialState)` — agent ↔ frontend 内存对等端，双向 `STATE_SNAPSHOT` / `STATE_DELTA`（RFC 6902 `add`/`replace`/`remove` 子集）
- 回环防护 — 远端应用的状态不再回发（测试断言）
- 断线恢复 — `disconnect()` 后事件丢弃，`reconnect()` 由 agent 发 `SYNC_REQUEST`，frontend 全量重同步
- `adapt(directive, registry)` — AG-UI 渲染指令 → install-core 安装计划（`source: 'ag-ui'`，**本包不写盘**）

## Demo

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/adapter-ag-ui build
corepack pnpm@9.15.0 --filter @chameleon-ui/adapter-ag-ui demo
```

打印一次「用户输入 → agent delta 应答 → 断线重连重同步」的完整事件转录（`demo/state-sync.mjs`）。

## 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/adapter-ag-ui test
```

断言覆盖：双向同步、delta 幂等应用、回环计数、断线重连、`source=ag-ui` 安装计划经 install-core 落盘且幂等。
