# 2026-08-15 · A11y CAB submission pack

> **Not a certificate.** This pack prepares engagement with a real Conformity Assessment Body (CAB).  
> **commercialClaimsAllowed=false** until a signed ACR/VPAT from that CAB exists.  
> Machine index: [`2026-08-15-a11y-cab-evidence.json`](./2026-08-15-a11y-cab-evidence.json)  
> Residual human blocker: [`2026-08-15-a11y-cab-blocker.md`](./2026-08-15-a11y-cab-blocker.md)

## 1. Product & scope (what to buy audit time for)

| Item | Value |
| :--- | :--- |
| Product | Chameleon UI (`@chameleon-ui/components` + themes/tokens) |
| Version under test | `0.1.9` workspace (artifact VPAT still names `0.0.0` draft) |
| Flagship theme | **`line`** |
| In-scope chrome | `AppShell`, `Navigation`, `NavigationBar` |
| In-scope actions / forms | `Button`, `Form`, `Input`, `Checkbox`, `Select` (+ related form controls on gallery) |
| Reference harness | `apps/internal-demo` on `http://127.0.0.1:4175` |
| Out of scope this pack | Full 101-slug catalog AT pass; 8-theme contrast lab; Revised 508 / EN 301 549 tables; npm-published consumers |

### Sample pages for CAB

1. `/?view=suite&locale=en&theme=line` — AppShell + common-10 (Button, Input, Select, Checkbox, Dialog, Tabs…)
2. `/?view=gallery&locale=en&theme=line` — AppShell + Navigation + Form + catalog gallery
3. `/?view=three-end&locale=en&theme=line` — Navigation morph playground

Recommended CAB sample size: **these 3 pages × desktop + mobile viewports**, plus **keyboard-only** and **one AT** (NVDA or VoiceOver) on the suite page. Do **not** claim full WCAG 2.1 AA from automated-only work.

## 2. Current honesty status

| Flag | Value |
| :--- | :--- |
| VPAT artifact | `status=draft` · [`VPAT-ChameleonUI-v0.0.0.md`](../../chameleon-ui/apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md) |
| Publication scope | **published-internal** |
| Third-party CAB | **No** |
| Legally signed ACR | **No** |
| `commercialClaimsAllowed` | **`false`** |
| `submissionPackReady` | **`true`** (evidence + engagement checklist exist; CAB not yet engaged) |

Canonical status narrative: [`Phase-9-VPAT-status.md`](./Phase-9-VPAT-status.md).

## 3. Known Not Evaluated (do not sell as Supports)

Copied from draft VPAT / Phase-9 status; still accurate after this automated slice:

- Full WCAG 2.1 AA criterion set (many rows remain **Not Evaluated**)
- Revised Section 508 / EN 301 549 tables
- Assistive-technology lab session (NVDA / JAWS / VoiceOver)
- Theme contrast lab sign-off across all 8 homage themes
- Focus-visible / text-spacing lab measurement
- Theme recognition ≥80% (`rate=null`; unrelated to a11y cert)

## 4. Automated scan results (2026-08-15)

Tooling already in-repo:

| Tool | Command / artifact | Role |
| :--- | :--- | :--- |
| axe-core 4.13.0 via Playwright | `corepack pnpm@9.15.0 a11y:axe` → this evidence JSON | Scoped WCAG 2.x A/AA + best-practice |
| Lighthouse a11y category | `perf:lhci` → `chameleon-ui/benchmarks/reports/lhci-latest.json` | Single-URL lab; **not** CAB |

Latest axe summary (see JSON for full nodes):

| Page | Violations | Incomplete | Passes |
| :--- | ---: | ---: | ---: |
| suite-appshell-common10 | **0** | 2 | 39 |
| gallery-appshell-navigation-form | **1** | 3 | 60 |
| three-end-navigation | **0** | 1 | 34 |

Residual automated finding (gallery only):

- **`aria-valid-attr-value`** on Ark/Zag `Tabs` trigger `aria-controls` IDREF (`tabs:…:content-…`). Content stays mounted (`lazyMount=false`, `unmountOnExit=false`) but axe still flags the IDREF. Treat as **library residual for CAB manual review**, not a commercial “fixed / certified” claim.

Prior LHCI accessibility category on suite (ar + line) was **100** in `lhci-latest.json` — still **not** a VPAT score.

## 5. Defects fixed in this slice (engineering)

| Area | Fix |
| :--- | :--- |
| `line` `color.fg.muted` | `#73716c` → `#6b6964` so caption/label contrast ≥ 4.5:1 on `#f4f3ef` |
| `Combobox` | Required visible `label` + `ValueText` (was unlabeled combobox trigger) |
| `Calendar` / `DatePicker` | `aria-selected` on `gridcell`; day buttons named by ISO date; DatePicker input `role="combobox"` for `aria-expanded` |
| `Statistic` | Trend text via visually-hidden span (no prohibited `aria-label` on generic span) |
| `Heatmap` | Real `role="row"` structure (no `display:contents` row collapse) |
| `MindMap` / `FlowNode` | `role="treeitem"` when used inside tree |
| `DataGrid` | `tabIndex={0}` on scrollable viewport |
| `AppShell` | `landmarks={false}` for nested demos; gallery uses it |
| `Form` | `aria-label` from `label` / `submitLabel` |
| Demo | Suite `h1`; unique Navigation labels; three-end chrome as `region` (not duplicate banner) |

## 6. How to reproduce

```bash
cd chameleon-ui
corepack pnpm@9.15.0 a11y:axe
# optional: refresh Lighthouse a11y category on suite
corepack pnpm@9.15.0 perf:lhci
```

Evidence lands at:

- `docs/project/reports/2026-08-15-a11y-cab-evidence.json`
- `chameleon-ui/benchmarks/reports/2026-08-15-a11y-cab-evidence.json` (copy)

## 7. Recommended CAB engagement checklist (what to buy)

Use [`2026-08-15-a11y-cab-blocker.md`](./2026-08-15-a11y-cab-blocker.md) for the vendor shortlist template. Purchase should include:

1. **Standard:** WCAG 2.1 AA (U1 engineering target) against the scope above; optionally quote Revised 508 / EN 301 549 as separate line items.
2. **Methods:** automated + **manual** keyboard + **AT** sample (state tool + OS).
3. **Sample size:** 3 demo URLs × 2 viewports minimum; document any catalog expansion as change-order.
4. **Deliverables (required):**
   - Signed **Accessibility Conformance Report (ACR)** / completed **VPAT®** (ITI template) with auditor identity
   - Issues list with severity + WCAG criteria
   - Retest of critical/serious items after fixes
5. **Explicit non-deliverables:** marketing badges, “certified accessible” seals for README, or permission to set `commercialClaimsAllowed=true` without the signed ACR on file.
6. **After CAB signs:** update `Phase-9-VPAT-status.md`, bump VPAT artifact out of draft only when A9.2 criteria are met, set `commercialClaimsAllowed=true` **only** if legal/owner approve the exact claim language.

## 8. Path to true third-party certification

```
submission pack (this file) → engage CAB (blocker.md) → AT/contrast lab
  → signed ACR/VPAT → legal review → commercialClaimsAllowed decision
```

Until the signed ACR exists: **Not a third-party CAB. commercialClaimsAllowed=false.**
