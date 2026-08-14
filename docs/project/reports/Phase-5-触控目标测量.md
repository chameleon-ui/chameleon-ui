# Phase 5 · 触控目标测量（T5.7 / A5.6）

> 日期：2026-08-13  
> 方法：**CSS Token 计算 + 本期清单静态扫描**。未跑 Lighthouse / 未开浏览器 / 无运行时命中测试。  
> 根字号假设：`html` 初始 `font-size` = **16px**（CSS initial；与愿景 §7.1「44px」换算一致）。  
> Owner：待指定。禁止把本文件写成 Lighthouse 分数或全库达标证明。

## 1. Token 地板（权威源）

| 变量 | 编译值 | @16px root |
| :--- | :--- | :--- |
| `--cu-touch-target-min` | `2.75rem` | **44px** |
| `--cu-control-size-comfortable` | `2.75rem` | 44px |
| `--cu-control-size-active`（variables.css 默认 = standard） | `2.5rem` | 40px（桌面未覆盖） |
| `--cu-control-size-active` @ mobile（density.css → comfortable） | `2.75rem` | 44px |

- 愿景 §7.1 / density.json：`touch-target.min` = 2.75rem → 44px。
- `density.css` 在 mobile（`max-width: 47.99rem`）把 `--cu-control-size-active` 重指向 comfortable（44px）。扫描按**移动端**解析该变量。桌面 compact 为 2.25rem = 36px，**不是**触控地板。
- 只把 `min-block-size` / `min-inline-size` 算作 tap 地板；装饰性 `block-size`（如 action-sheet 把手条 0.25rem、spinner 图标）不计。
- 本记录证明 Token 地板为 44px，**不是**抽检每个像素的运行时测量。

## 2. 本期清单覆盖（100% 扫描）

新组件 ×4 + §0.5 改造清单。`status=n/a` 表示该 slug 无独立 tap 控件（例如 safe-area / spinner / skeleton）。`below-floor` 是硬编码小于 2.75rem 的声明，**未改 P6 组件**。

| slug | 范围 | 结果 | 最小计算 tap | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| action-sheet | new | pass | 44px | min computed tap 44px >= 44px |
| tab-bar | new | pass | 44px | min computed tap 44px >= 44px |
| safe-area | new | n/a | — | no rem/px/token min tap size (layout wrapper or non-interactive) |
| sidebar | new | pass | 44px | min computed tap 44px >= 44px |
| checkbox | 改造 | below-floor | 36px | min computed tap 36px < 44px (token floor is 44px @ 16px root) |
| app-shell | 改造 | n/a | — | no rem/px/token min tap size (layout wrapper or non-interactive) |
| dialog | 改造 | n/a | — | no rem/px/token min tap size (layout wrapper or non-interactive) |
| select | 改造 | below-floor | 36px | min computed tap 36px < 44px (token floor is 44px @ 16px root) |
| switch | 改造 | below-floor | 36px | min computed tap 36px < 44px (token floor is 44px @ 16px root) |
| button | 改造 | pass | 44px | min computed tap 44px >= 44px |
| table | 改造 | n/a | — | no rem/px/token min tap size (layout wrapper or non-interactive) |
| radio | 改造 | below-floor | 36px | min computed tap 36px < 44px (token floor is 44px @ 16px root) |
| spinner | 改造 | n/a | — | no rem/px/token min tap size (layout wrapper or non-interactive) |
| tabs | 改造 | pass | 44px | min computed tap 44px >= 44px |
| skeleton | 改造 | n/a | — | no rem/px/token min tap size (layout wrapper or non-interactive) |
| button (vue) | 改造-vue | pass | 44px | min computed tap 44px >= 44px |

- 覆盖 15/15 个清单项（缺文件则失败）。
- 消费 `--cu-touch-target-min` 的 tap 面按 Token 计算为 44px。
- 未宣称全库达标；范围外组件不在本表。

## 3. 明确未做

- 无 Lighthouse / LHCI 分数。
- 无 Playwright 点击热区截图。
- 未改 P6 组件把 2.25rem 控件抬到 44px。
- 虚拟键盘遮挡仍以既有 input 演示页回归，本脚本不测。

## 4. 复现

```
corepack pnpm@9.15.0 --filter @chameleon-ui/tokens build
node ./scripts/measure-touch-targets.mjs
```
