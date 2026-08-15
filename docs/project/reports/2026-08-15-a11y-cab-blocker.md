# 2026-08-15 · A11y CAB blocker (human next step)

> Paid Conformity Assessment Body (CAB) **cannot** be invoked from this agent environment  
> (no procurement account, no vendor contract, no ability to schedule AT lab time).  
> **Do not invent certificates, audit dates, or org names.**

## Exact next human step

1. Assign an **owner** (replace `待指定` on VPAT status).
2. Fill the vendor shortlist below and send the same RFP to ≥2 CABs.
3. Attach this repo’s pack:
   - [`2026-08-15-a11y-cab-submission-pack.md`](./2026-08-15-a11y-cab-submission-pack.md)
   - [`2026-08-15-a11y-cab-evidence.json`](./2026-08-15-a11y-cab-evidence.json)
   - Draft VPAT: `chameleon-ui/apps/docs/static/compliance/VPAT-ChameleonUI-v0.0.0.md`
4. After quote + SOW: schedule lab; keep `commercialClaimsAllowed=false` until signed ACR is filed.

## Vendor shortlist template (fill in — leave blanks empty)

| # | Candidate CAB / lab | Contact | WCAG 2.1 AA ACR/VPAT? | AT tools offered | Quote (currency) | ETA weeks | Notes |
| :---: | :--- | :--- | :---: | :--- | :--- | ---: | :--- |
| 1 | _TBD — do not invent_ | | | | | | |
| 2 | _TBD — do not invent_ | | | | | | |
| 3 | _TBD — do not invent_ | | | | | | |

Suggested search keywords for procurement (not endorsements):  
“WCAG 2.1 AA VPAT ACR conformity assessment”, “Section 508 VPAT vendor”, “EN 301 549 accessibility audit”.

## Must-buy deliverables (copy into SOW)

- [ ] Signed ACR / completed ITI VPAT® naming product + version
- [ ] Auditor legal name + date of evaluation
- [ ] Scope matching submission pack (line theme + AppShell / Navigation / Button / Form controls)
- [ ] Manual keyboard + at least one AT platform documented
- [ ] Issues tracker + retest of critical/serious
- [ ] Explicit statement that Lighthouse/axe alone is **not** the conformance basis

## Must-not-buy / must-not-ship

- Fake “certified” badges in README or docs
- Setting `commercialClaimsAllowed=true` without the signed ACR on disk
- Claiming Section 508 / EN 301 549 if those tables were not purchased

## Residual automated note for the CAB

Gallery page may still show axe `aria-valid-attr-value` on Ark `Tabs` `aria-controls` IDREFs. Suite and three-end pages were **0 violations** in the 2026-08-15 evidence run. Ask the CAB to validate Tabs under AT rather than treating axe alone as pass/fail for that control.
