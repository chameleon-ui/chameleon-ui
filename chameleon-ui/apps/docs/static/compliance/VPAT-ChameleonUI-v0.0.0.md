# VPAT® Revised 508 Edition (draft)

**Product:** Chameleon UI  
**Version:** 0.0.0  
**Report filename:** `VPAT-ChameleonUI-v0.0.0.pdf` (markdown stand-in; PDF binary export is LEGACY-2026-006)  
**status=draft**  
**publicationScope=published-internal** (visible on the local docs site; not A9.2 formal `status=published`)  
**Not certified.** **Not legally signed.** **Not a third-party CAB.**  
**commercialClaimsAllowed=false** — do not use this file for procurement “certified accessible” storytelling.

Status page (evaluated vs Not Evaluated, claim rules): `docs/project/reports/Phase-9-VPAT-status.md` and `/compliance/VPAT-status.md`.  
CAB submission pack (evidence only; not a certificate): `docs/project/reports/2026-08-15-a11y-cab-submission-pack.md` (`submissionPackReady=true`, `commercialClaimsAllowed=false`).

This is an engineering draft. It is not an ITI-signed VPAT, not a third-party lab report, and not a Section 508 determination.

| Field | Value |
| :--- | :--- |
| Report date | 2026-08-14 |
| Contact | 待指定 |
| Evaluation methods | Source/contract review against `packages/components/catalog.json` (101 complete slugs) + component `a11y` / `dataAi` contracts; `perf:size`; Playwright visual-regression (RTL, AppShell+common-10). Optional local Lighthouse accessibility category (axe) on the demo suite page — **not** an AT lab, **not** a VPAT score. See `docs/project/reports/Phase-9-Lighthouse-R1-R3.md` (generated). No assistive-technology lab session. |
| Applicable | WCAG 2.1 AA (engineering target U1). Revised 508 / EN 301 549 tables not completed. |
| Standard revision | VPAT® 2.5 structure (abridged) |
| Auditor | Internal engineering draft. Owner 待指定. **Not a third-party CAB.** |
| Commercial claims | **Not allowed** (`commercialClaimsAllowed=false`) |

## Product description

React component library (Ark/Zag primitives via `@chameleon-ui/primitives`), **101 catalog slugs** (all `implementation=complete` in catalog.json as of this draft), 8 official homage themes, 21 product locales, local docs site (authored chrome: zh-CN / zh-HK / en). Official homage themes were cleared by the project owner on 2026-08-13 (owner confirmation, not a third-party legal opinion) and ship as **free** official themes.

## Evaluation notes

- Keyboard and focus behavior for primitives come from Ark UI / Zag; this draft does not re-test every APG pattern.
- RTL uses CSS logical properties; official VR is `apps/internal-demo` AppShell + common-10 at 390/768/1280 for `ar`.
- R1–R3 runtime metrics: **do not copy numbers into this VPAT**. Authority is the generated Lighthouse artifact (`chameleon-ui/benchmarks/reports/lhci-latest.json`). If that file is `status=unmeasured`, R* remain unmeasured (LEGACY-2026-001…003).
- Blind-test «一眼认出 ≥80%» was **not** run and **must not** be claimed (LEGACY-2026-008).
- Lighthouse accessibility category, when measured, is automated axe on one lab page. It does **not** promote this file out of draft, and it is not a certification.

## WCAG 2.1 AA (abridged)

Conformance: **Supports** / **Partially Supports** / **Does Not Support** / **Not Evaluated**.

| Criterion | Level | Status | Remarks |
| :--- | :--- | :--- | :--- |
| 1.1.1 Non-text Content | A | Partially Supports | Component contracts require accessible names; Icon has `label`; not all slugs have live docs previews. |
| 1.3.1 Info and Relationships | A | Partially Supports | Semantic elements via primitives; contract `a11y.role` is documentation, not a runtime proof. |
| 1.3.2 Meaningful Sequence | A | Not Evaluated | No AT traversal lab. |
| 1.4.3 Contrast (Minimum) | AA | Not Evaluated | Theme homage palettes not contrast-lab signed. |
| 1.4.4 Resize text | AA | Not Evaluated | |
| 1.4.10 Reflow | AA | Partially Supports | Container queries / breakpoints in contracts; VR covers 390/768/1280 on the demo suite only. |
| 1.4.11 Non-text Contrast | AA | Not Evaluated | |
| 1.4.12 Text Spacing | AA | Not Evaluated | |
| 1.4.13 Content on Hover or Focus | AA | Not Evaluated | |
| 2.1.1 Keyboard | A | Partially Supports | Core primitives are keyboard-operable; no full-library AT keyboard audit. |
| 2.1.2 No Keyboard Trap | A | Partially Supports | Dialog focus trap is intended; Esc-to-exit is the engineering rule (U2). Not every overlay re-tested this slice. |
| 2.4.3 Focus Order | A | Partially Supports | Dialog open/close restore is specified; not lab-measured. |
| 2.4.7 Focus Visible | AA | Not Evaluated | |
| 2.5.5 Target Size | AAA (related U4) | Partially Supports | Compact controls keep a 44px target in contracts; not pixel-audited for all 101 slugs. |
| 3.1.1 Language of Page | A | Supports (docs) | Docs set `lang` from the locale prefix. Demo sets `documentElement.lang` from the locale query. |
| 3.1.2 Language of Parts | AA | Partially Supports | Component ICU exists per locale; contract body remains English (LEGACY-2026-017). Docs chrome still has locale gaps (see locale-gap-table.json; owner 待指定). |
| 4.1.2 Name, Role, Value | A | Partially Supports | Catalog `data-ai-role` / `data-ai-state` / `data-ai-intent` gated in phase8; not a substitute for ARIA completeness or an AT lab. |

## Revised Section 508 / EN 301 549

**Not Evaluated.** Do not treat this draft as a 508 or EN declaration.

## Commercial claims

**Not allowed.** Do not claim WCAG AA certification, Section 508 determination, third-party CAB audit, or “VPAT published / certified” from this draft. Lighthouse axe scores (when present) do not change this rule. Theme recognition ≥80% is separately **not run** (LEGACY-2026-008; A9.5 = PROTOCOL-READY).

## Legal

VPAT® is a registered trademark of the Information Technology Industry Council (ITI). This document is an internal engineering draft and is **not** an official VPAT completed in the ITI template with vendor signature.

Next revision reserved: after AT lab + contrast audit + PDF export (LEGACY-2026-006, LEGACY-2026-007). This file stays **status=draft** until those exist; docs-site scope remains **published-internal** only. Owner 待指定.
