# Blocks gaps (Phase 7 honesty)

## Locale skeletons

Authored copy: `en`, `zh-CN`. The other 19 locales ship English ICU skeletons
(`_cuSkeleton: true`) tracked in `locale-gap-table.json`. Do **not** claim a
completed 21-language Blocks pack.

## Kanban drag engine

`kanban` moves cards with labeled keyboard-first buttons. There is **no**
pointer-drag engine in this package. A self-built drag engine is out of Phase 7
scope (→ later / ops if ever).

## Gantt drawing primitives

`gantt` lays out bars as percentage positions on a date scale and pairs them
with `Timeline`. It is **not** a dedicated drawing primitive, and large task
lists are not virtualized. Treat heavy schedules as a degradation case.

## Scenario matrix LEGACY rows

See `scenario-matrix.json`:

- `LEGACY-2026-018` — 数字孪生 3D scene embedding absent (canvas-base is 2D).
- `LEGACY-2026-019` — 产品原型「设备框 Block」not in the §7.3 twelve.

## Market trading

Blocks marketplace commerce is **out of scope** (operations era).
