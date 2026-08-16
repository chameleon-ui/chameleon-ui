# ImageCompare

Before/after compare with a draggable, keyboard-accessible divider.

## Props

| Prop | Default | Notes |
| :--- | :--- | :--- |
| `beforeSrc` / `afterSrc` | — | Image URLs |
| `checkerboard` | `true` | Wraps in shared `CheckerboardSurface` |
| `checkerboardContrast` | `strong` | `default` \| `strong` — defaults to **`strong`** for transparent PNG results |
| `orientation` | `horizontal` | `horizontal` \| `vertical` |
| `showKnob` | `true` | Divider knob |

Transparent edges share the same checker tokens as `CheckerboardSurface` / `MaskPaintCanvas` — do not hand-roll a consumer gradient.
