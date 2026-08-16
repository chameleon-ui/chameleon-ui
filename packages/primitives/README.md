# @chameleon-ui/primitives

**L1 · Headless / a11y 基元封装（React）。基于 Ark UI / Zag。**

`primitives` 是 React 侧的 **headless 内核**层：它把 Ark UI / Zag 的"无头逻辑"薄封装成语义化的 Primitive 组件。`@chameleon-ui/components-react` 只依赖本包，**禁止**直接 `import "@ark-ui/*"`。

> **路线说明（O1 已裁定）**：正式路线只使用 **Ark UI / Zag**。Base UI 仅保留在 `poc/base-ui` 作 M0 对比证据，不得进入本包或 `components`。

## Public API

| Export | Ark / Zag 来源 |
| :--- | :--- |
| `ButtonPrimitive` | `ark.button` |
| `FieldPrimitive` / `InputPrimitive` | `@ark-ui/react/field` |
| `DialogPrimitive` | `@ark-ui/react/dialog` + portal |
| `CheckboxPrimitive` | `@ark-ui/react/checkbox` |
| `RadioGroupPrimitive` | `@ark-ui/react/radio-group` |
| `SwitchPrimitive` | `@ark-ui/react/switch` |
| `SelectPrimitive` | `@ark-ui/react/select` |
| `TabsPrimitive` | `@ark-ui/react/tabs` |
| `PopoverPrimitive` | `@ark-ui/react/popover` |
| `TooltipPrimitive` | `@ark-ui/react/tooltip` |
| `ToastPrimitive` | `@ark-ui/react/toast` |

## 职责边界

- **只封装** Ark UI / Zag 行为；**禁止**混入 `@base-ui/react`；**禁止**自研焦点陷阱或选择算法。
- **焦点陷阱、Escape 关闭、触发还原**都由 Zag 经 Ark UI 委托完成——在 `components` 里不要重写它们。

## 测试

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/primitives test
```
