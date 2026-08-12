---
title: 'Story 6.1: Screen-state matrix sign-off'
type: 'chore'
created: '2026-08-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '864f3be'
final_revision: ''
---

<intent-contract>

## Intent

**Problem:** Epics 1–5 built each surface's states story-by-story, but no artifact confirms the *complete* screen-state matrix (FR-35, UX-DR16 sign-off) — every surface (address, form, results, lead) implementing empty/initial, in-progress, validation-error, loading, success, API-error, and empty/low-confidence — and `[OPEN]` OI-5 (the source of truth for matrix completeness) is unresolved.

**Approach:** Produce a verification-artifact matrix (`screen-state-matrix.md`) that enumerates each surface × each canonical state, cites the implementing code + the node test that proves it, marks each cell present / n-a-by-design / gap, resolves OI-5 by naming the discriminated view-state mappers + their exhaustive tests as the single completeness source of truth, and logs any real gap as a defect against the owning epic. No feature rebuild.

## Boundaries & Constraints

**Always:** Cite a real file path AND a real passing test for every "present" cell; mark honestly (present / n/a-by-design / gap); preserve requirement IDs verbatim (FR-35, UX-DR16, OI-5); keep the artifact node-verifiable (point at existing tests, do not add browser deps).

**Block If:** A surface is missing a canonical state that IS required by its spec (a genuine functional gap) AND fixing it is more than a small contained remediation — then HALT with `blocked` and log the defect against the owning epic for a dedicated story.

**Never:** Rebuild or refactor feature code; add test dependencies; assert states the node-only harness cannot (focus/SR timing — those belong to Story 6.2); invent tests or cite non-existent files.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Surface implements a canonical state | mapper branch + test exist | matrix cell = present, cites file + test | n/a |
| State not applicable to a surface | e.g. results has no "validation-error" (it consumes a computed estimate) | cell = n/a-by-design with a one-line rationale | n/a |
| Genuine missing required state | required by spec, absent | cell = gap; logged as owning-epic defect | HALT/blocked if remediation is non-trivial |

</intent-contract>

## Code Map

- `src/features/results/results-view-state.ts` -- `toResultsView` discriminated union: idle/loading/success/lowConfidence/error — results-surface completeness source.
- `src/features/lead/lead-view-state.ts` -- `toLeadView`: form/submitting/success/error — lead-surface completeness source.
- `src/features/address/AddressModal.tsx` -- address search/resolve states (loading via `isFetching`/settled, empty predictions, service error via `data.ok===false`, resolved success); `validate-manual-address.ts` -- manual-entry validation-error state.
- `src/features/estimate-form/step-state.ts` + `validate-answer.ts` -- form stepper: empty/initial (no step complete), in-progress (partial), validation-error (`validateAnswer`), completion.
- `src/features/*/**.test.ts(x)` -- the exhaustive node tests each cell cites (e.g. `results-view-state.test.ts`, `lead-view-state.test.ts`, `validate-manual-address.test.ts`, `validate-answer.test.ts`, `step-state.test.ts`).
- `_bmad-output/implementation-artifacts/screen-state-matrix.md` (NEW) -- the sign-off artifact.

## Tasks & Acceptance

**Execution:**
- [x] `_bmad-output/implementation-artifacts/screen-state-matrix.md` -- CREATE the sign-off matrix: 4 surfaces × 7 canonical states, each cell present(file+test) / n-a-by-design(rationale) / gap(owning-epic defect); include an OI-5 resolution section naming the view-state mappers + exhaustive tests as the completeness source of truth; a defects-logged section (empty if none); a verdict.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- (finalization) mark `6-1-screen-state-matrix-sign-off: done`.
- [x] Verify the cited tests actually exist and pass (`npm test`), so the matrix is evidence-backed, not assertion.

**Acceptance Criteria:**
- Given Epics 2–5 complete, when the matrix is reviewed, then every surface (address, form, results, lead) has each of the 7 canonical states marked present(with file+test) / n-a-by-design(with rationale) / gap (FR-35, UX-DR16 sign-off).
- Given a cell marked present, when its citation is checked, then the cited file and test both exist and the test passes.
- Given `[OPEN]` OI-5, when the matrix is signed off, then OI-5 is resolved by naming the discriminated view-state mappers + their exhaustive node tests as the single source of truth for matrix completeness.
- Given any gap, when found, then it is logged as a defect against the owning epic (and HALT/blocked if remediation is non-trivial).

## Verification

**Commands:**
- `npm test` -- expected: all suites green; every test cited in the matrix exists and passes.
- `npm run typecheck && npm run lint` -- expected: exit 0 (no code changes expected, but confirm the tree stays green).

**Manual checks:**
- Each matrix "present" cell names a real file + real test (spot-check 4–5 across surfaces).
- OI-5 resolution is explicit and defensible; defects section is honest (empty only if truly no gaps).

## Review Triage Log

Verification story — the reviewer loop shifts from bug-hunting to **auditing the artifact for completeness, honesty, and evidence**. One adversarial auditor (opus-4.8) verified every `present` citation against the actual test files, challenged every `n/a-by-design` cell, hunted for missed user-reachable states, and pressure-tested the OI-5 resolution.

- **Result: 0 CRITICAL, 2 MINOR.** All 22 `present` citations exist verbatim; no hollow/mislabeled cell; all 6 `n/a-by-design` rationales defensible; the form config-load "graceful degradation via disabled CTA" claim verified as the ACTUAL behavior in `EstimateFlow.tsx` + `ResultsPanel` (`config === undefined` → CTA disabled), not a cover story; no omitted user-reachable state. Suite green (522/522) as the evidence base.
- **MINOR (fixed):** the OI-5 resolution overstated completeness as "compile-time-total" — the view-state mappers are `if`-chains over input state (not `switch`es over the output discriminant), so a new union member would not fail compilation. Reworded to "test-enforced branch coverage," with an explicit note that `resolveConfidence` is the one place a `never`-default compile guard applies. No feature code changed (appropriate for a verification pass).
- **MINOR (accepted):** the address low-confidence→empty-results substitution is a defensible definitional choice, already framed as an "honest analog."

## Auto Run Result

- **Type:** verification / documentation (no feature code changed).
- **Deliverable:** `screen-state-matrix.md` — 4 surfaces × 7 canonical states = 28 cells → 22 `present` (each file + passing test), 6 `n/a-by-design` (rationale), 0 gaps; OI-5 resolved (view-state unions + exhaustive tests as source of truth); 0 defects logged.
- **Review:** 1 adversarial auditor, 0 critical / 2 minor; 1 wording fix applied.
- **Gates:** `npm test` ✓ (522/522, the matrix's evidence base) · typecheck ✓ · lint ✓ (tree unchanged). No new deps.
