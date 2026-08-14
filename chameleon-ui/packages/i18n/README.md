# @chameleon-ui/i18n

L1 · Shared locale identifiers, ICU MessageFormat, and catalog lookup.

- **No UI framework** in `package.json`.
- Component copy stays in each component `locales/` directory. This package loads and formats; it is not a second copy of Button/Input/Dialog strings.
- Hot-path lookup is a `Map` (**C3**, expected O(1)). Do not linear-scan language packs on format.
- Pseudo-locale `en-XA` expands **ICU literal nodes only** to ≥140%. Do not `replaceAll` over a whole message object.
- Phase 1 locales: `zh-CN`, `en`, `de`, `ar`. Phase 2 expands to **21** locales in `PHASE_2_LOCALES` (see `src/locales.ts`). Document `lang` + `dir` come from the locale; RTL languages include `ar`, `ug`, `ur`, `fa`.

## Public API

| Export | Role |
| :--- | :--- |
| `PHASE_1_LOCALES` | Frozen BCP 47 list (4) |
| `PHASE_2_LOCALES` | Shipping BCP 47 list (21) |
| `PSEUDO_LOCALE` | `en-XA` |
| `directionForLocale` | `ltr` \| `rtl` from language |
| `createCatalog` / `getMessage` | Flatten nested JSON into a `Map` |
| `formatMessage` | ICU plural / select / interpolation |
| `expandPseudoMessages` / `validatePseudoExpansion` | Literal-only ≥140% gate |
| `measureLiteralExpansion` | C10 expansion ratio (German / pseudo) |

## Commands

```bash
corepack pnpm@9.15.0 --filter @chameleon-ui/i18n test
```
