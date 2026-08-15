# Phase 5 · design-rules density v1.1 — engineering freeze pack

> Date: 2026-08-15  
> Status: **engineering-ready / wet-ink unsigned**  
> LEGACY: density enum migration (tracked under Phase-5 合入检查; do not conflate with docs LEGACY-2026-004 chrome skeletons)

## 1. Conflict (evidence)

| Side | Enum |
| :--- | :--- |
| design-rules schema v1.0 (`packages/contract/schemas/design-rules.schema.json`) | `compact \| comfortable \| spacious` |
| Vision / tokens density ladder (`--cu-density-*`) | `compact \| standard \| comfortable` |

Current theme inventory (`packages/themes/src/*/design-rules.json` + community pack):

| density (v1.0) | themes |
| :--- | :--- |
| `compact` | silver-arrow, stuttgart, corsa, siren, wechat |
| `comfortable` | line, cupertino, ant-blue, community-focus-first |
| `spacious` | **none in tree today** |

## 2. Proposed mapping (frozen for the meeting; not applied)

| v1.0 | v1.1 |
| :--- | :--- |
| `compact` | `compact` |
| `comfortable` | `standard` |
| `spacious` | `comfortable` |

Compat strategy when executed: keep reading v1.0 values for one minor; emit deprecation in validate-rules; flip schema `$id` to v1.1 only after wet-ink.

## 3. Engineering checklist (no signature)

- [x] Token ladder `compact/standard/comfortable` in `tokens` + `density.css`
- [x] Apps import `density.css` (phase5:gates)
- [x] Migration narrative in `docs/engineering/容器查询与三端规范.md` §3
- [x] This freeze pack + inventory table
- [ ] Schema file `design-rules.schema.json` bumped to v1.1 — **blocked by owner wet-ink**
- [ ] Theme JSON rewritten to v1.1 enum — **blocked by owner wet-ink**
- [ ] Freeze-meeting signature — **blocked by owner 待指定**

## 4. What agents must not do

- Do not flip schema/theme enum without a signed freeze note.
- Do not invent a signature or backdate a meeting.
- Do not claim design-rules v1.1 is live while themes still validate as v1.0.
