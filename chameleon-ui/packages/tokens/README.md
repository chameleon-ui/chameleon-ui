# @chameleon-ui/tokens

L1 · DTCG Design Token 权威源与确定性 CSS 变量产物。

- **O2 已裁定：Style Dictionary 4.x。** Phase 0 选择其作为构建编排器；仓内薄层负责稳定排序、引用环检测和可读错误，避免上游默认格式变化破坏产物。
- **禁止**依赖 React / Vue / Svelte；Token 编译仅发生在构建期。
- 权威源位于 `src/core/*.json`；未来主题只能以 overlay 消费或覆盖，不能复制一份 core 权威源。
- 输出固定为 `dist/css/variables.css`，变量名为 `color.fg.default` → `--cu-color-fg-default`。

## CSS 入口（勿猜 `dist/` 路径）

```ts
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css";
```

`./dist/*` 也已导出，因此 `@chameleon-ui/tokens/dist/css/variables.css` 与 canonical `./css` 指向同一文件。常量：`tokensCssSpecifier` / `tokensCssDistSpecifier`（见 `dist/index.d.ts`）。

## Phase 5 三端 Token（断点 / 密度 / 触控）

| Token | 值 | 含义 |
| :--- | :--- | :--- |
| `--cu-breakpoint-mobile` | `0px` | mobile 档起点（<768px 生效） |
| `--cu-breakpoint-tablet` | `48rem` | tablet 档起点（=768px，768–1279px） |
| `--cu-breakpoint-desktop` | `80rem` | desktop 档起点（=1280px，≥1280px） |
| `--cu-density-compact` / `standard` / `comfortable` | `0.875` / `1` / `1.125` | 密度缩放系数三档 |
| `--cu-density-active` | 随端默认 | 当前密度系数；`density.css` 按断点或 `[data-density]` 切换 |
| `--cu-control-size-compact` / `standard` / `comfortable` | `2.25/2.5/2.75rem` | 控件最小高度三档（36/40/44px @16px root） |
| `--cu-control-size-active` | 随端默认 | 当前控件最小高度 |
| `--cu-touch-target-min` | `2.75rem` | 触控目标下限（愿景 §7.1：44px，用 rem 随根字号缩放） |
| `--cu-typography-size-{caption,body,heading-3,heading-2,heading-1}` | `clamp(...)` | 流体字号阶梯（20rem→80rem / `--cu-breakpoint-desktop`） |
| `--cu-typography-line-height-{tight,snug,body}` | `1.15` / `1.25` / `1.6` | 行高阶梯 |

- 断点/密度/排版是**编译期数据**：`dist/tokens.json` 是同名扁平解析表（JS/TS 消费），`src/index.ts` 只导出稳定变量名常量，不复制数值。
- **随端默认密度**：`dist/css/density.css`（构建期由 token 值内插生成）提供 mobile=comfortable / tablet=standard / desktop=compact，并支持 `<html data-density="compact|standard|comfortable">` 显式覆盖；不新增组件必填 prop。
- 消费 `@chameleon-ui/tokens/css` 的 app **必须同时** `import '@chameleon-ui/tokens/density.css'`，否则 `--cu-density-active` / `--cu-control-size-active` 不会随断点或 `[data-density]` 切换（`phase5:gates` 扫描）。
- 组件 CSS 不直接消费 `@media` 宽度断点（stylelint `chameleon/no-breakpoint-literal` 拦截）；宽度响应一律走 `@container`，阈值取值见 `docs/engineering/容器查询与三端规范.md`。
- **design-rules v1.1**（`spacious` → `standard` 枚举迁移）草稿见规范 §3；冻结会未签，owner **待指定**，不得伪签。

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
