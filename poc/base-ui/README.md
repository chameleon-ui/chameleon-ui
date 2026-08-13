# @chameleon-ui/poc-base-ui

Phase 0 · Base UI 路线沙箱，不发布。

## 范围

- 使用 Base UI 1.x 实现 Button、Input、Dialog。
- 与 Ark UI 路线使用同构核心 Props，以便公平比较。
- 演示 `en` / `en-XA`、`ltr` / `rtl`，以及 390 / 768 / 1280 三种容器宽度。
- 以 ICU MessageFormat 骨架验证变量插值、CLDR 复数与 `select`；`en-XA` 仅扩展 ICU 字面节点并自动达到至少 140%；正式共享 i18n 包仍留到 Phase 1 创建。
- 所有样式钩子使用 `cu-*` class，方向相关布局只使用 CSS 逻辑属性。
- Dialog 的 Esc、焦点陷阱与关闭后焦点归还来自 Base UI；本 POC 不自研焦点算法。
- Phase 0 不发送遥测，也不挂载尚未实现的 `data-ai-*` 属性。

## 命令

```bash
# 在 chameleon-ui 根
corepack pnpm@9.15.0 poc:base

# 固定地址：http://127.0.0.1:4174/

# 构建与回归（先由工程统一安装依赖）
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-base-ui build
corepack pnpm@9.15.0 --filter @chameleon-ui/poc-base-ui test
```

专项测试会逐键校验 ICU 参数与分支结构，并在任一可见分支低于 140% 时失败。

## Phase 1 迁移点

源码中的 `@phase-1` 注释标明未来迁入 `packages/components` 与正式 locale 包的位置；本 POC 始终隔离在 `poc/base-ui`。

性能预算 S1–S5、R1–R3 从 Phase 1 起控。本 POC 只记录 Base UI 的依赖与交互体感，不把试验包体积当作门禁。
