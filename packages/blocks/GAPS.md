# Blocks gaps (Phase 7 honesty)

## Locale skeletons

Authored copy: `en`, `zh-CN`, `zh-HK` (zh-HK derived from zh-CN via an in-repo SC→TC map —
not a full OpenCC pipeline). The other 18 locales ship English ICU skeletons
(`_cuSkeleton: true`) tracked in `locale-gap-table.json`. Do **not** claim a
completed 21-language Blocks pack.

## Kanban drag

`kanban` moves cards with labeled keyboard buttons **and** native HTML5
drag-and-drop (`draggable` + `dataTransfer`). There is **no** custom pointer-drag
engine, sorting library, or multi-board sync. Treat advanced DnD UX as out of
Phase 7 scope.

## Gantt drawing primitives

`gantt` lays out bars as percentage positions on a date scale, draws **day tick
labels** and an optional **today** marker, and pairs the chart with `Timeline`.
It is **not** a dedicated canvas drawing primitive, and large task lists are not
virtualized. Treat heavy schedules as a degradation case.

## Scenario matrix LEGACY rows

See `scenario-matrix.json`:

- `LEGACY-2026-018` — 数字孪生 3D scene embedding absent (canvas-base is 2D).
- `LEGACY-2026-019` — 产品原型「设备框 Block」not in the §7.3 twelve.

## Market trading

Blocks marketplace commerce is **out of scope** (operations era).
