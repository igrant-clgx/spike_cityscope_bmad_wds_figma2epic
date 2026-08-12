---
title: 'Story 4.4 — Edit Estimate & New Estimate actions'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'dfb17f7'
final_revision: '4b11e98'
---

<intent-contract>

## Intent

**Problem:** When a result is shown there is no way to revise answers or start over. The homeowner needs a secondary "Edit Estimate" (return to the form, all answers preserved) and a primary "New Estimate" (clean reset, prior `estimateId` invalidated) below the card (FR-24, FR-25, UX-DR13, AD-9).

**Approach:** Render two actions below the card in the success/low-confidence states. "Edit Estimate" (secondary/outlined) clears the current result view (`mutation.reset()` → back to the form) WITHOUT touching the form aggregate, so every captured answer is preserved. "New Estimate" (primary/contained) clears the result AND resets the flow to the `emptyForm()` baseline (form `reset` + stepper remount), which drops the prior result and its `estimateId` so the next estimate computes a fresh one.

## OI-7 resolution (signed for this spike)

Because Edit vs New makes reset user-visible, OI-7 (reset scope) is resolved for the spike as **clear-all**: "New Estimate" resets ALL captured scope to the `emptyForm()` baseline (renovation type, items, property details), consistent with the already-shipped address-change reset. "Edit Estimate" preserves everything. Documented here as the product decision of record for the spike; a production build should re-confirm with Product.

## Boundaries & Constraints

**Always:** "Edit Estimate" is `variant="outlined"` (secondary) and preserves ALL answers (form aggregate untouched — only `mutation.reset()`); "New Estimate" is `variant="contained"` (primary) and resets to `emptyForm()`/`stepFormDefaults()` via the existing form `reset` + stepper remount, and drops the prior result/`estimateId` via `mutation.reset()` (AD-6/AD-9). Actions render ONLY in success/low-confidence states, below the card. Node-only tests; decisions stay pure/testable. No new dependencies. No ad-hoc hex (palette props / theme tokens). No `@mui/icons-material`. Preserve requirement IDs verbatim.

**Block If:** The reset scope decision would need to diverge from the shipped clear-all address-change semantics (would require a Product sign-off beyond this spike's documented OI-7 resolution).

**Never:** Do NOT re-fire an estimate automatically after Edit or New (both return to a deliberate-CTA state). Do NOT change pricing/`EstimateEngine`. Do NOT alter the results state machine's other branches. Do NOT persist the old result after New Estimate.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Actions render | success or lowConfidence view | Outlined "Edit Estimate" + contained "New Estimate" below the card | n/a |
| Edit Estimate | click Edit | `mutation.reset()` → view returns to idle CTA; form answers all intact | n/a |
| New Estimate | click New | `mutation.reset()` + form reset to defaults + stepper remount; view idle; prior `estimateId` gone | n/a |
| Actions absent | idle/loading/error views | No Edit/New actions rendered | n/a |
| New then recalc | after New, calculate again | Fresh request from the empty baseline yields a NEW `estimateId` | n/a |

</intent-contract>

## Code Map

- `src/features/results/ResultsPanel.tsx` -- add `onEdit`/`onNewEstimate` wiring: `ResultsPanel` calls `mutation.reset()` for both and invokes the parent callback for form-level effects; `ResultsPanelView` renders the two buttons in success/lowConfidence.
- `src/features/results/copy.ts` -- add `EDIT_ESTIMATE_LABEL`, `NEW_ESTIMATE_LABEL`.
- `src/features/estimate-form/EstimateFlow.tsx` -- pass an `onNewEstimate` that runs `methods.reset(stepFormDefaults())` + `setStepperKey(k=>k+1)` (reuse the existing address-change reset path); Edit needs no form change.
- `src/features/results/index.ts` -- exports unchanged (already barrels `ResultsPanel`).
- Tests: `src/features/results/ResultsPanel.test.tsx` -- assert both actions render only in success/lowConfidence, correct variants, and that Edit/New invoke the wired callbacks (and `mutation.reset` clears the view).

## Tasks & Acceptance

**Execution:**
- [x] `src/features/results/copy.ts` -- add `EDIT_ESTIMATE_LABEL` ("Edit Estimate"), `NEW_ESTIMATE_LABEL` ("New Estimate").
- [x] `src/features/results/ResultsPanel.tsx` -- render the two actions below the card in success/lowConfidence (`ResultsPanelView`); `ResultsPanel` wires Edit → `mutation.reset()`, New → `mutation.reset()` + `onNewEstimate?.()`; document the estimateId invalidation.
- [x] `src/features/estimate-form/EstimateFlow.tsx` -- pass `onNewEstimate` running the form reset + stepper remount (reuse the shipped reset path).
- [x] `src/features/results/ResultsPanel.test.tsx` -- unit-test the I/O matrix (actions only in success/lowConfidence, variants, callback wiring, view clears after reset).

**Acceptance Criteria:**
- Given I am viewing a result, when the actions render below the card, then a secondary/outlined "Edit Estimate" and a primary/contained "New Estimate" are present (UX-DR13).
- Given I click "Edit Estimate", when the view returns to the form, then all captured answers are preserved (FR-24) and no estimate is auto-fired.
- Given I click "New Estimate", when the flow resets, then the scope is cleared to the `emptyForm()` baseline (FR-25) and the prior result/`estimateId` is dropped (AD-9).
- Given idle/loading/error, when the panel renders, then no Edit/New actions are shown.

## Spec Change Log

## Review Triage Log

Blind Hunter + Edge Case Hunter ran in parallel against the diff since `dfb17f7`. Orchestrator set final severity. Both reported NO high/medium bugs. 5 finding-groups → 2 patched, 1 deferred, 2 rejected/observations.

| # | Finding | Final severity | Disposition |
|---|---------|----------------|-------------|
| BH#1 | `EDIT_ESTIMATE_LABEL`/`NEW_ESTIMATE_LABEL` omitted from the `results` barrel (every other copy label is re-exported) | LOW | **patch** — added both to `index.ts`. |
| BH#3 / EH#1 (same) | `onNewEstimate` was OPTIONAL on `ResultsPanel` while required on the view — a caller omitting it ships a silent half-working "New Estimate" (clears result, not scope) | LOW | **patch** — made `onNewEstimate` REQUIRED; updated the two wired integration tests to supply it. |
| EH#2 | Focus dropped after Edit/New (the focused button unmounts → focus falls to `<body>`); keyboard/SR users lose their place | LOW | **defer** → the epic's already-planned MANUAL a11y check (the node-only harness cannot assert focus/reveal timing/SR announcement). Recorded in `deferred-work.md`. |
| BH#2 | Edit button `color="primary"` vs the spec word "secondary" | LOW | **reject** — the theme defines no distinct brand `secondary` palette (only `text.secondary`), so `color="secondary"` would inject MUI's default purple. The `variant="outlined"` vs the primary `contained` "New" IS the secondary-action hierarchy per UX-DR13; the AC ("secondary/outlined") is satisfied by the outlined variant. |
| — | Edit preserves ALL answers (form aggregate untouched, only `mutation.reset()`); New drops result+`estimateId` AND resets flow to `emptyForm()` (batched in one event handler, no stale-frame race); AD-9 invalidation sufficient (no query keyed by `estimateId` — `useEstimate` is a mutation); actions render only in success/lowConfidence; no auto-refire; no dup ids/SSR gotcha; empty-scope guard holds post-reset; fresh `estimateId` on New→re-select→recalc; labels-snapshot cannot leak stale | — | **verified correct by both reviewers.** |

## Auto Run Result

- **Outcome:** SUCCESS
- **Story:** 4.4 — Edit Estimate & New Estimate actions
- **Baseline:** `dfb17f7`
- **Implementation:** DIRECT (contained). Added two actions below the card in the success/low-confidence states: "Edit Estimate" (`variant="outlined"`, secondary) → `mutation.reset()` only, ALL answers preserved; "New Estimate" (`variant="contained"`, primary) → `mutation.reset()` (drops the prior result + `estimateId`, the AD-9 invalidation seam for a mutation) + `EstimateFlow.onNewEstimate` which resets the flow to `stepFormDefaults()` and remounts the stepper (reusing the shipped address-change reset path). OI-7 resolved for the spike as clear-all (documented in the spec).
- **Review:** Blind Hunter + Edge Case Hunter (parallel). No high/medium findings. 5 groups → 2 patched (barrel export, required `onNewEstimate`), 1 deferred (post-action focus → manual a11y check), 2 rejected/observation (secondary color, hierarchy language).
- **Gates (post-patch):** typecheck ✅ · lint ✅ · test ✅ **386 passed (59 files)** · build ✅. No ad-hoc hex; no new deps; no `@mui/icons-material`.
- **New dependencies:** none.
