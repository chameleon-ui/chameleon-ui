# Phase 9 · VPAT publication status (published-internal)

> **Audience:** commercial / procurement / marketing readers who must not confuse an engineering draft with certification.  
> **VPAT artifact:** still `status=draft` (ITI template incomplete; PDF binary LEGACY-2026-006).  
> **Publication scope:** **published-internal** on the local docs site.  
> **Auditor:** Internal engineering. Owner **待指定**. **Not a third-party CAB.**  
> **Commercial accessibility / certification claims:** **Not allowed** (`commercialClaimsAllowed=false`).  
> **CAB submission pack:** **ready** (`submissionPackReady=true`) — evidence + engagement checklist only; **no** signed ACR yet.

Canonical artifact: [`chameleon-ui/apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md`](../../chameleon-ui/apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md)  
Docs-site mirror of this status: `/compliance/VPAT-status.md`  
Blind recognition is unrelated: see [`A9.5-盲测决策-PROTOCOL-READY.md`](./A9.5-盲测决策-PROTOCOL-READY.md) (`rate=null`).  
CAB pack: [`2026-08-15-a11y-cab-submission-pack.md`](./2026-08-15-a11y-cab-submission-pack.md) · evidence [`2026-08-15-a11y-cab-evidence.json`](./2026-08-15-a11y-cab-evidence.json) · human blocker [`2026-08-15-a11y-cab-blocker.md`](./2026-08-15-a11y-cab-blocker.md).

## 1. Status table (honest)

| Dimension | Value |
| :--- | :--- |
| VPAT ITI / vendor `status` | **`draft`** (not `published` in the A9.2 “formal VPAT” sense) |
| Docs-site visibility | **published-internal** — file is served from the docs compliance folder; not a silent private note |
| Third-party CAB / lab | **No** — Not a third-party CAB |
| Legally signed | **No** |
| Certified / Section 508 determination | **No** |
| Commercial claims allowed (WCAG AA certified, “accessible by VPAT”, procurement-ready a11y badge) | **No** (`commercialClaimsAllowed=false`) |
| `submissionPackReady` | **`true`** — automated evidence + CAB engagement checklist filed 2026-08-15; does **not** authorize commercial claims |
| Owner | 待指定 |
| Legacy | LEGACY-2026-006 (PDF binary), LEGACY-2026-007 (draft / unsigned) |

## 2. What was evaluated (engineering only)

Summarized from the draft VPAT; details and remarks live in the artifact.

| Area | How |
| :--- | :--- |
| Catalog / contracts | Source review vs `catalog.json` complete slugs + component `a11y` / `dataAi` |
| Size / VR | `perf:size`; Playwright VR (RTL, AppShell + common-10) |
| Optional Lighthouse a11y category | Automated axe on one lab demo page when `perf:lhci` measured — **not** an AT lab, **not** a VPAT score |
| Scoped axe (2026-08-15) | `pnpm a11y:axe` on suite / gallery / three-end (`line`) — see CAB evidence JSON; **not** CAB |
| Keyboard (core primitives) | Relies on Ark/Zag; Partially Supports in draft table |

## 3. What is Not Evaluated (do not imply otherwise)

| Area | Status |
| :--- | :--- |
| Full WCAG 2.1 AA criterion set | Many rows **Not Evaluated** (contrast lab, AT traversal, text spacing, focus visible, etc.) |
| Revised Section 508 / EN 301 549 tables | **Not Evaluated** |
| Assistive-technology lab session | **Not done** |
| Theme contrast lab sign-off | **Not done** (line muted token adjusted for 4.5:1 on automated check only) |
| Theme recognition / 「一眼认出 ≥80%」 | **Not run** (`rate=null`) — not an a11y claim either |
| Paid third-party CAB / signed ACR | **Not done** — see CAB blocker |

## 4. Commercial storytelling rules

Allowed:

- Link to this status page and the draft VPAT markdown.
- Link to the CAB submission pack and say evidence is ready for a real CAB.
- Say: engineering draft, published-internal, Not certified, Not a third-party CAB, many criteria Not Evaluated, `commercialClaimsAllowed=false`.

Forbidden:

- “VPAT certified”, “508 certified”, “WCAG AA certified”, “third-party audited”, “accessibility guaranteed”.
- Treating Lighthouse / axe scores as VPAT completion or CAB certification.
- Treating `submissionPackReady=true` as certification.
- Treating `status=draft` draft visibility as A9.2 formal `status=published`.

## 5. Path to A9.2 / third-party CAB

1. Owner engages a real CAB using [`2026-08-15-a11y-cab-blocker.md`](./2026-08-15-a11y-cab-blocker.md).
2. AT + contrast lab + signed ACR/VPAT.
3. Only then: consider formal `status=published`, list LEGACY exceptions, versioned public file, and a legal decision on `commercialClaimsAllowed`.

A9.2 still requires formal `status=published`, LEGACY exceptions listed, versioned public file. That needs AT/contrast work + owner + **signed third-party ACR** — **not** claimed by this status page.
