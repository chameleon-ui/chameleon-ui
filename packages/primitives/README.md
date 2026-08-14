# @chameleon-ui/primitives

L1 · Headless / a11y 基元封装。

**O1 已裁定：正式路线只使用 Ark UI / Zag。** Base UI 仅保留在 `poc/base-ui` 作为 M0 对比证据，不得进入本包或 `@chameleon-ui/components`。

- Phase 0 空壳标记 `status: pending-M0` 已移除；本包给出正式 API。
- 只封装 `@ark-ui/*` / Zag 行为。禁止混入 `@base-ui/react`。禁止自研焦点陷阱或选择算法。
- `@chameleon-ui/components` 只依赖本包，**禁止**直接 `import` `@ark-ui/*`。

## Public API

| Export | Ark / Zag source |
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

Focus trapping, Escape dismissal, and trigger restoration are delegated to Zag via Ark UI. Do not reimplement them in components.

## Commands

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/primitives test
```
