# MaskPaintCanvas

Paint / erase a mask over a source image and export a natural-pixel PNG mask.

## Layout contract

1. The **host must provide a definite block size**, or nest this component where percentage height resolves (e.g. `WorkspaceSplit` detail / tools panes, or a flex column with `block-size: 100%`).
2. The component **fills its parent** (`block-size: 100%`) and uses an internal `ResizeObserver` to re-run contain-fit. Consumers must **not** invent `62vh` stage hacks.
3. Fallback when the parent height is indefinite: `min-block-size: 20rem` so contain still has a stable box.
4. Brush / erase rings use theme tokens (`--cu-color-accent-default`, `--cu-color-danger-default`). Overlay stroke resolves accent from the theme (not a hard-coded blue).

## Props / handle

| Prop | Default | Notes |
| :--- | :--- | :--- |
| `src` | — | Image URL |
| `fit` | `contain` | Whole image visible, centered |
| `checkerboard` | `true` | Transparent media backdrop on the **contain-fitted** rect (`CheckerboardSurface`) |
| `checkerboardContrast` | `strong` | `default` \| `strong` — mask / inpaint defaults to **strong** |
| `mode` | `paint` | `paint` \| `erase` |
| `brushSize` | `34` | Screen-space CSS px diameter |
| `disabled` | `false` | |
| `zoom` | — | User zoom relative to contain-fit; `1` = fitted. Controlled when set (pair with `zoomChange` / `onZoomChange`) |
| `minZoom` | `1` | Lower zoom clamp |
| `maxZoom` | `8` | Upper zoom clamp |
| `wheelZoom` | `false` | Wheel to zoom inside the stage (`preventDefault`; no page-scroll conflict) |

Stage letterbox uses `--cu-mask-paint-stage-bg` (defaults to `background-subtle`); the checker + hairline sit only on the fitted image bounds so the silhouette reads against the stage.

`exportMask(): Promise<Blob \| null>` — natural resolution, geometry matches on-screen strokes.  
`clearMask(): void`

## Zoom / pan

- Handle: `zoomIn(step?)` / `zoomOut(step?)` (default step ×1.25), `resetZoom()` (back to contain fit, pan reset), `setZoom(z)`, `getZoom()`.
- Zoom composes with contain-fit: display size = natural × fit × zoom; brush stays screen-space; pointer → natural-pixel mapping and `exportMask()` stay geometrically consistent at any zoom.
- Pan when zoomed: **middle-drag** or **Space + drag** (Space is ignored while typing in inputs). Pan is clamped so the image edge never reveals the stage.
- Never fake zoom with consumer CSS `transform: scale()` on the stage, and never nest the canvas in `Canvas`/`CanvasToolbar` pan-zoom — both break the natural-pixel mapping. Use the built-in API.

## Compose

Prefer one outer `WorkspaceSplit`: put the canvas in `#detail` / `detail` and tools in `#tools` / `tools`. For a **fill-parent stage**, use `scrollMode="panes"` (fixed viewport; panes get definite height) or give the detail host an explicit `block-size`. Default `scrollMode="shell"` grows with content — percentage height may not resolve; do not invent `62vh` stage hacks. Do not nest another `WorkspaceSplit` inside detail.
