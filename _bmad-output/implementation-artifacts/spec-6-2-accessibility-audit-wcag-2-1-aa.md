---
title: 'Story 6.2: Accessibility audit (WCAG 2.1 AA)'
type: 'chore'
created: '2026-08-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '87a9afb'
final_revision: 'b4666cd'
---

<intent-contract>

## Intent

**Problem:** The assembled app has never had a whole-system WCAG 2.1 AA accessibility **audit** (NFR-1, UX-DR20), and the deferred SR-only-correctness items converge here: two competing `role="status"` live regions on the success screen (Story 5.4), the SR-only announce regions not using the established `visuallyHidden` treatment (inconsistent with `EstimateStepper`), and post-action / lead-form focus management (Story 4.4 defer — focus falls to `<body>`).

**Approach:** Produce a WCAG 2.1 AA audit artifact (`accessibility-audit.md`) that verifies every checkpoint the node-only harness CAN assert (roles, accessible names, label/`aria-describedby` wiring, live-region presence, text-not-colour, 44px targets, token contrast) with citations, and documents the dynamic checkpoints (keyboard traversal, focus movement, SR announcement timing, axe run) as a manual-pass with concrete findings/recommendations. Apply the one node-testable code remediation — make the Results + Lead announce regions `visuallyHidden` SR-only (consistent one-region-per-surface treatment, removing the visible-duplicate announcement text) — and SPECIFY the focus-management remediation (dynamic, manual-pass) precisely.

## Boundaries & Constraints

**Always:** Cite real code + tests for every in-harness "pass"; be explicit about the node-only-harness ceiling (no jsdom/axe/browser → dynamic checks are documented manual-pass, not asserted); keep the live-region treatment consistent with `EstimateStepper`'s `visuallyHidden` pattern; preserve requirement IDs (NFR-1, UX-DR20, WCAG SC numbers).

**Block If:** A remediation requires new test dependencies (axe/jsdom/RTL) or a non-trivial refactor of a wired component to make focus testable — then keep it as a documented manual-pass recommendation instead (do not add deps).

**Never:** Add axe/Playwright/jsdom/RTL; assert dynamic behavior the harness can't run; hide a genuine failure behind "manual pass"; change visible copy or the visual layout beyond removing the redundant visible announce text.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| SR-only announce region | Results/Lead live region rendered | uses `visuallyHidden` (SR-only), text present in DOM, one region per surface | n/a |
| In-harness checkpoint | role/name/label/describedby present | audit cell = pass, cites file + test | n/a |
| Dynamic checkpoint | focus/traversal/SR-timing/axe | audit cell = manual-pass with finding + recommendation | n/a |
| Genuine failure found | e.g. missing label | logged as a defect + remediated if node-safe, else recommendation | HALT only if non-trivial |

</intent-contract>

## Code Map

- `src/features/results/ResultsPanel.tsx` -- persistent `role="status"` region (line ~80) currently `sx={{ minHeight: 0 }}` → change to `visuallyHidden`.
- `src/features/lead/LeadPanel.tsx` -- persistent `role="status"` region (line ~48) currently `sx={{ minHeight: 0 }}` → `visuallyHidden` (resolves the 5.4 two-competing-visible-regions concern; regions become SR-only, one per surface, announcing at disjoint times).
- `src/features/estimate-form/EstimateStepper.tsx` -- the established `sx={visuallyHidden}` pattern (line ~78) to mirror.
- `src/features/*/LeadForm.tsx`, `DynamicField.tsx`, `ManualAddressForm.tsx` -- `aria-describedby` error wiring (audit citations).
- `src/theme/tokens.ts` / `theme.ts` -- `minTarget = 44` (target-size checkpoint), token palette (contrast checkpoint).
- `_bmad-output/implementation-artifacts/accessibility-audit.md` (NEW) -- the audit artifact.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- resolve the 5.4 live-region item; move focus-management to a documented manual-pass recommendation.

## Tasks & Acceptance

**Execution:**
- [x] `src/features/results/ResultsPanel.tsx` + `src/features/lead/LeadPanel.tsx` -- make the announce regions `visuallyHidden` (import `visuallyHidden` from `@mui/utils`), removing the redundant visible announcement text and giving each surface exactly one SR-only polite region.
- [x] `src/features/results/ResultsPanel.test.tsx` + `src/features/lead/LeadPanel.test.tsx` -- assert the live region is SR-only (`visuallyHidden` style present) while the announcement text remains in the DOM.
- [x] `_bmad-output/implementation-artifacts/accessibility-audit.md` -- CREATE: WCAG 2.1 AA audit across the 4 POUR principles + key SCs; in-harness `pass`/`manual-pass`/`n-a` per checkpoint with citations; a "Deferred-item resolution" section (live regions FIXED; focus management SPECIFIED for the manual pass with concrete recommendations); a defects section; a verdict + honest harness-ceiling statement.
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- append the resolution of the 5.4 competing-live-region item and the focus-management manual-pass recommendation.
- [x] Verify all 4 gates green.

**Acceptance Criteria:**
- Given the assembled app, when the a11y audit runs, then every WCAG 2.1 AA checkpoint is marked pass (in-harness, cited) / manual-pass (documented finding + recommendation) / n-a, with an explicit statement that axe/keyboard/SR are manual-pass under the node-only harness (NFR-1, UX-DR20).
- Given the Results and Lead surfaces, when rendered, then each mounts exactly one SR-only (`visuallyHidden`) persistent polite live region — no visible-duplicate announcement, no two competing visible regions (resolves the Story 5.4 defer).
- Given the carried focus-management defer (Story 4.4), when the audit is signed off, then the focus-relocation gap after Edit/New and on lead-form state changes is documented with a concrete recommendation for the manual pass.

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` -- expected: all exit 0; new SR-only-region assertions pass.

**Manual checks:**
- Audit artifact honestly separates in-harness `pass` from `manual-pass`; no dynamic check is claimed as automated.
- The `visuallyHidden` regions still contain the announcement text in `renderToStaticMarkup` output (SR-reachable).

## Review Triage Log

One adversarial reviewer (opus-4.8) checked BOTH the code remediation and the audit artifact. **Result: 0 CRITICAL, 2 MINOR (both fixed).**

- **CODE cleared, ship as-is:** `visuallyHidden` is the correct `@mui/utils` export using CSS `clip` (not `display:none`), so the announcement text stays in the DOM (SR-reachable) while no longer visibly duplicating the card's range; the visible dollar figure on `ResultCostCard` is untouched; `aria-busy` intact; exactly one live region per surface; the two new SR-only tests are genuine two-sided proofs (clip-rect present AND text present). 524 tests green, build clean. Correctly discharges the Story 5.4 competing/visible `role="status"` concern.
- **AUDIT honest:** no dynamic checkpoint dressed up as automated; no real AA failure hidden behind manual-pass; focus-order (2.4.3) deferral to a documented manual-pass recommendation is the correct call for the node-only harness (shipping unverifiable `.focus()` code would be less honest).
- **MINOR-1 (fixed):** two composite/paraphrased `DynamicField.test.tsx` citations replaced with the exact individual test names (text/numeric/date describedby; radio/select/slider/budget error).
- **MINOR-2 (fixed):** added **SC 1.4.11 Non-text Contrast** (AA) as a `manual-pass` item — the app relies on error border/glow + focus-ring indicators that 1.4.11 governs and the audit had omitted.

## Auto Run Result

- **Type:** verification + small code remediation.
- **Code:** Results + Lead persistent live regions → `visuallyHidden` (SR-only, one per surface; removes visible-duplicate announcement) — resolves the Story 5.4 EH#2 defer. +2 node tests (SR-only clip-rect + text-present).
- **Deliverable:** `accessibility-audit.md` — WCAG 2.1 AA audit across POUR; each SC `pass` (cited test) / `manual-pass` (dynamic, documented recommendation) / `n-a`; deferred-item resolution table (live regions FIXED, focus order SPECIFIED); honest node-only-harness ceiling statement.
- **Deferrals updated:** `deferred-work.md` — 5.4 live-region item RESOLVED; 4.4 focus-order moved to a documented manual-pass recommendation.
- **Review:** 1 adversarial reviewer, 0 critical / 2 minor (both fixed).
- **Gates:** typecheck ✓ · lint ✓ · test ✓ (524) · build ✓. No new deps.
