# @chameleon-ui/tokens

L1 · DTCG Design Token 权威源与确定性 CSS 变量产物。

- **O2 已裁定：Style Dictionary 4.x。** Phase 0 选择其作为构建编排器；仓内薄层负责稳定排序、引用环检测和可读错误，避免上游默认格式变化破坏产物。
- **禁止**依赖 React / Vue / Svelte；Token 编译仅发生在构建期。
- 权威源位于 `src/core/*.json`；未来主题只能以 overlay 消费或覆盖，不能复制一份 core 权威源。
- 输出固定为 `dist/css/variables.css`，变量名为 `color.fg.default` → `--cu-color-fg-default`。

## 命令

```bash
pnpm --filter @chameleon-ui/tokens build
pnpm --filter @chameleon-ui/tokens test
```

`test` 不依赖 Style Dictionary，直接验证确定性快照、引用解析及环引用失败；`build` 使用固定版本 Style Dictionary 写入最终文件。若依赖尚未安装，先在 monorepo 根执行一次 `pnpm install`。

## 复杂度与失败保证

- 展平与解析为 O(n)，稳定排序为 O(n log n)，额外空间 O(n)，其中 n 为 Token 数。
- 单条引用解析使用 memo，摊还 O(d)，最大深度 32。
- 环、未知引用、重复路径和不可序列化 CSS 值都会失败；错误包含路径、原因和下一步，不会留下“部分成功”的 CSS。
- 输出不含时间戳；同一输入字节级一致。
