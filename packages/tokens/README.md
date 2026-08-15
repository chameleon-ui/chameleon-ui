# @chameleon-ui/tokens

**L1 · DTCG 设计 Token 权威源 + 确定性 CSS 变量编译。禁止依赖 React / Vue / Svelte。**

`tokens` 是整个 Chameleon UI 设计系统的**底层地基**：所有颜色、间距、字体、断点、密度的数值，最终都来自这里，并被编译为标准 CSS 自定义属性（`--cu-*`）。主题（`themes`）、组件（`components`）都消费它。

## 用法

```ts
import "@chameleon-ui/tokens/css";
import "@chameleon-ui/tokens/density.css"; // 三端密度（必选，见下）
```

规范路径（不要手动拼 `dist/` 猜测）：

- `@chameleon-ui/tokens/css` → `dist/css/variables.css`（core 变量）
- `@chameleon-ui/tokens/density.css` → 三端密度切换
- `@chameleon-ui/tokens/tokens.json` → 同名扁平解析表（JS/TS 消费）
- `@chameleon-ui/tokens/compiler` → 编译 API

`./dist/*` 也已导出，因此 `@chameleon-ui/tokens/dist/css/variables.css` 与 canonical `./css` 指向同一文件。常量：`tokensCssSpecifier` / `tokensCssDistSpecifier`（源自 `dist/index.d.ts`）。

**注意：** 消费 `@chameleon-ui/tokens/css` 的应用**必须同时** `import "@chameleon-ui/tokens/density.css"`，否则 `--cu-density-active` / `--cu-control-size-active` 不会随断点或 `[data-density]` 切换。

## 三端 Token（断点 / 密度 / 触控）

Chameleon UI 的"三端一体"（手机 390 / 平板 768 / 桌面 1280）由这些 token 驱动：

| Token | 值 | 含义 |
| :--- | :--- | :--- |
| `--cu-breakpoint-mobile` | `0px` | mobile 档起点（<768px） |
| `--cu-breakpoint-tablet` | `48rem` | tablet 档起点（=768px，768–1279px） |
| `--cu-breakpoint-desktop` | `80rem` | desktop 档起点（≥1280px） |
| `--cu-density-compact/standard/comfortable` | `0.875 / 1 / 1.125` | 密度缩放系数三档 |
| `--cu-density-active` | 随端默认 | 当前密度系数（`density.css` 按断点或 `[data-density]` 切换） |
| `--cu-control-size-compact/standard/comfortable` | `2.25/2.5/2.75rem` | 控件最小高度三档（36/40/44px） |
| `--cu-control-size-active` | 随端默认 | 当前控件最小高度 |
| `--cu-touch-target-min` | `2.75rem` | 触控目标下限（44px） |
| `--cu-typography-size-*` | `clamp(...)` | 流体字号阶梯（20rem→80rem） |

- **随端默认密度**：`density.css` 提供 mobile=comfortable / tablet=standard / desktop=compact，并支持 `<html data-density="compact|standard|comfortable">` 显式覆盖。
- 断点/密度/排版是**编译期数据**：`dist/tokens.json` 是扁平解析表（JS/TS 消费），`src/index.ts` 只导出稳定变量名常量、不复制数值。
- 宽度响应一律走 `@container` 容器查询，组件不直接消费 `@media` 宽度断点（stylelint 会拦截）——这也是三端一体实现的机制之一。

## 构建 / 测试

```bash
pnpm --filter @chameleon-ui/tokens build
pnpm --filter @chameleon-ui/tokens test
```

- `test` 不依赖 Style Dictionary，直接验证确定性快照、引用解析及环引用失败。
- `build` 使用固定版本 Style Dictionary 写入最终产物；功能不全前先在 monorepo 根执行一次 `pnpm install`。

## 编译保证

- 展平与解析为 O(n)，稳定排序 O(n log n)，额外空间 O(n)。
- 单条引用解析用 memo，摊还 O(d)，最大深度 32。
- 环、未知引用、重复路径、不可序列化 CSS 值都会失败，并附路径与下一步；不留下"部分成功"的 CSS。
- 输出不含时间戳，同一输入字节级一致。

## 权威来源

设计师的 token 权威源在 `src/core/*`；主题只能以 **overlay** 消费或覆盖，不能复制一份 core 权威源。
