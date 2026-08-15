# Phase 9 · VPAT publication status (published-internal)

> **Audience:** commercial / procurement / marketing readers who must not confuse an engineering draft with certification.  
> **VPAT artifact:** still `status=draft` (ITI template incomplete; PDF binary LEGACY-2026-006).  
> **Publication scope:** **published-internal** on the local docs site.  
> **Auditor:** Internal engineering. Owner **待指定**. **Not a third-party CAB.**  
> **Commercial accessibility / certification claims:** **Not allowed.**

Canonical artifact: [`chameleon-ui/apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md`](../../chameleon-ui/apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md)  
Docs-site mirror of this status: `/compliance/VPAT-status.md`  
Blind recognition is unrelated: see [`A9.5-盲测决策-PROTOCOL-READY.md`](./A9.5-盲测决策-PROTOCOL-READY.md) (`rate=null`).

## 1. Status table (honest)

| Dimension | Value |
| :--- | :--- |
| VPAT ITI / vendor `status` | **`draft`** (not `published` in the A9.2 “formal VPAT” sense) |
| Docs-site visibility | **published-internal** — file is served from the docs compliance folder; not a silent private note |
| Third-party CAB / lab | **No** — Not a third-party CAB |
| Legally signed | **No** |
| Certified / Section 508 determination | **No** |
| Commercial claims allowed (WCAG AA certified, “accessible by VPAT”, procurement-ready a11y badge) | **No** |
| Owner | 待指定 |
| Legacy | LEGACY-2026-006 (PDF binary), LEGACY-2026-007 (draft / unsigned) |

## 2. What was evaluated (engineering only)

Summarized from the draft VPAT; details and remarks live in the artifact.

| Area | How |
| :--- | :--- |
| Catalog / contracts | Source review vs `catalog.json` complete slugs + component `a11y` / `dataAi` |
| Size / VR | `perf:size`; Playwright VR (RTL, AppShell + common-10) |
| Optional Lighthouse a11y category | Automated axe on one lab demo page when `perf:lhci` measured — **not** an AT lab, **not** a VPAT score |
| Keyboard (core primitives) | Relies on Ark/Zag; Partially Supports in draft table |

## 3. What is Not Evaluated (do not imply otherwise)

| Area | Status |
| :--- | :--- |
| Full WCAG 2.1 AA criterion set | Many rows **Not Evaluated** (contrast lab, AT traversal, text spacing, focus visible, etc.) |
| Revised Section 508 / EN 301 549 tables | **Not Evaluated** |
| Assistive-technology lab session | **Not done** |
| Theme contrast lab sign-off | **Not done** |
| Theme recognition / 「一眼认出 ≥80%」 | **Not run** (`rate=null`) — not an a11y claim either |

## 4. Commercial storytelling rules

Allowed:

- Link to this status page and the draft VPAT markdown.
- Say: engineering draft, published-internal, Not certified, Not a third-party CAB, many criteria Not Evaluated.

Forbidden:

- “VPAT certified”, “508 certified”, “WCAG AA certified”, “third-party audited”, “accessibility guaranteed”.
- Treating Lighthouse accessibility category scores as VPAT completion.
- Treating `status=draft` draft visibility as A9.2 formal `status=published`.

## 5. Path to A9.2 (out of scope for this honesty slice)

A9.2 still requires formal `status=published`, LEGACY exceptions listed, versioned public file. That needs AT/contrast work + owner — **not** claimed by this status page.
