# CheckerboardSurface

Token-colored checkerboard so transparent media edges stay visible against the stage.

## Props

| Prop | Default | Notes |
| :--- | :--- | :--- |
| `cellSize` | `md` | `sm` \| `md` \| `lg` (0.5 / 0.75 / 1rem cell) |
| `contrast` | `default` | `default` \| `strong` — use **`strong`** for mask / inpaint editors |

## Tokens

| Token | Role |
| :--- | :--- |
| `--cu-checkerboard-a` / `--cu-checkerboard-b` | Cell colors (theme may override) |
| `--cu-checkerboard-mix-a` / `--cu-checkerboard-mix-b` | Fg mix % (defaults **40% / 5%**; `strong` **56% / 4%**) |
| `--cu-checkerboard-cell` | Cell size (set via `cellSize`) |

Dark cell (A) mixes into `background-subtle`; light cell (B) into `background-elevated` so warm paper themes keep A/B apart. Themes can retune via `:root .cu-checkerboard-surface { --cu-checkerboard-mix-a: … }` (`linear` pushes strong to **~62% / 3%**). Consumers should **not** hand-roll `repeating-conic-gradient` for product chrome.

## Compose

`MaskPaintCanvas` and `ImageCompare` reuse this surface when `checkerboard` is on. Both default to `checkerboardContrast="strong"`. MaskPaint places the checker on the contain-fitted rect only; stage letterbox uses `--cu-mask-paint-stage-bg`.
