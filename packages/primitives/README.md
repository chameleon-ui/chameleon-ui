# @chameleon-ui/primitives

L1 · Headless / a11y 基元封装。

Phase 0 空壳标记：`status: pending-M0`。该标记用于证明 M0 前未提前填实正式基元包；选型结论验收后由 Phase 1 首次实现提交更新生命周期状态。

- **O1 已裁定：正式路线选择 Ark UI。** Base UI 仅保留在 `poc/base-ui` 作为 M0 对比证据，不得进入正式包。  
- 依据：两条 POC 的 Button / Input / Dialog、键盘、RTL 与构建均通过；Ark 的 React、Vue、Solid、Svelte 官方适配能显著降低既定 Vue 路线的重复状态机成本。  
- Phase 1 只允许封装 `@ark-ui/*` / Zag 行为；禁止混入 `@base-ui/react`，禁止自研焦点陷阱或选择算法。  
- 被 `@chameleon-ui/components` 依赖  
- 对比沙箱在 `poc/ark-ui`、`poc/base-ui`；双轨止于 M0，不在本包长期并存。
