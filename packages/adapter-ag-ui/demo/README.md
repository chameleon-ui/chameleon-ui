# AG-UI adapter demo

`state-sync.mjs` 是可直接运行的最小演示：在内存中创建 agent/frontend 对等端，演示

1. 用户编辑组件状态（frontend）→ agent 收到 `STATE_SNAPSHOT`；
2. agent 推送 `STATE_DELTA` → frontend 状态更新；
3. 断线期间的编辑在 `reconnect()` 后通过全量快照恢复。

运行：

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/adapter-ag-ui build
corepack pnpm@9.15.0 --filter @chameleon-ui/adapter-ag-ui demo
```

断言级验证（含回环防护计数）在 `src/ag-ui.test.ts`。
