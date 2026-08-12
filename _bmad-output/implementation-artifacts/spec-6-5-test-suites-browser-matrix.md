---
title: 'Story 6.5: Test suites & browser support matrix'
type: 'chore'
created: '2026-08-14'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'af9a668'
final_revision: ''
---

<intent-contract>

## Intent

**Problem:** NFR-11 requires unit + E2E-journey + accessibility test suites present and passing, with the E2E journey running green against the stub adapters end-to-end; NFR-12 requires a documented + verified browser support matrix (marked `[OPEN] matrix TBD`). The repo has 70 node-only unit/component/route test files and per-use-case tests against fakes, but (a) no single **end-to-end journey** test that walks address→estimate→lead through the concrete stub adapters in one flow, and (b) no documented browser matrix.

**Approach:** (1) **Small remediation:** add one node-level E2E journey test (`src/server/journey.e2e.test.ts`) that composes the REAL application use-cases over the REAL stub adapters (address suggest/resolve → estimate compute → consented lead capture), asserting the pipeline runs green, ids thread across the three seams, idempotency dedups, the consent gate blocks, and the analytics taxonomy fires with no PII. (2) Produce a verification artifact (`test-suites-and-browser-matrix.md`) that inventories the suites by category (unit / component-structural / route / E2E-journey / a11y-static) with counts + pass evidence, and documents + reasons the NFR-12 browser support matrix (evergreen targets, graceful degradation, the node-only-harness ceiling: no Playwright/Cypress/axe/BrowserStack, so cross-browser is a documented manual-pass). This resolves the `[OPEN] matrix TBD`.

## Boundaries & Constraints

**Always:** Compose the journey over the CONCRETE stubs (no mocks) so it proves the adapters wire together; keep it node-only (no jsdom/RTL/browser); cite real test files + counts in the artifact; document the browser matrix with a reasoned rationale and record the cross-browser manual-pass ceiling honestly; preserve IDs (NFR-11, NFR-12); the E2E journey must run green in the standard `npm test`.

**Block If:** The journey test reveals a real defect in how the stub adapters compose (an id that doesn't thread, a broken seam) that needs a non-trivial fix — HALT/blocked and log it.

**Never:** Add Playwright/Cypress/axe/Lighthouse/BrowserStack or any browser/e2e runner dep (out of spike scope, node-only harness); assert cross-browser rendering the harness can't produce as automated `pass`; invent test counts (measure them).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| E2E journey happy path | stub adapters, valid scope + consented lead | green: ids thread address→estimate→lead, record stored w/ AD-10 markings | fails loud if a seam breaks |
| E2E idempotency | retried lead POST, same key | same leadId, no second record | n/a |
| E2E consent gate | consent-less lead | rejects, no record stored | asserted rejection |
| E2E observability | full journey | taxonomy fires (`step_completed`/`estimate_generated`/`lead_submitted`), no PII value serialized | n/a |
| Suite inventory | test tree | counts by category + pass evidence in artifact | n/a |
| Browser matrix | no browser runner | documented + reasoned matrix; cross-browser = manual-pass | n/a |
| Compose defect | a seam doesn't wire | logged as owning-epic defect | HALT if non-trivial |

</intent-contract>

## Code Map

- `src/server/journey.e2e.test.ts` (NEW) -- node-level E2E journey over the concrete stub adapters (address→estimate→lead) + idempotency + consent-gate + no-PII observability.
- `src/server/adapters/{address,estimate,lead,analytics}/*.ts` -- the concrete stub adapters the journey composes (OI-3/OI-11 swap seams).
- `src/server/application/{address,estimate,lead}.ts` -- the use-cases the journey drives.
- `src/**/*.test.ts(x)`, `app/api/v1/**/route.test.ts` -- the existing 70 unit/component/route suites inventoried in the artifact.
- `_bmad-output/planning-artifacts/functional-requirements.md` -- NFR-11, NFR-12 (matrix `[OPEN]`).
- `_bmad-output/implementation-artifacts/test-suites-and-browser-matrix.md` (NEW).

## Tasks & Acceptance

**Execution:**
- [x] `src/server/journey.e2e.test.ts` -- CREATE: an end-to-end journey over the concrete stubs (address suggest/resolve → estimate → consented lead), asserting id threading, idempotency dedup, consent-gate rejection, and no-PII observability; runs green in `npm test`.
- [x] `_bmad-output/implementation-artifacts/test-suites-and-browser-matrix.md` -- CREATE: a suite inventory by category (unit / component-structural / route / E2E-journey / a11y-static) with measured counts + pass evidence; a documented + reasoned NFR-12 browser support matrix (evergreen targets, graceful degradation) resolving `[OPEN] matrix TBD`; a defects section; a verdict + honest node-only-harness ceiling (cross-browser = manual-pass).
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- (finalization) mark `6-5-test-suites-browser-matrix: done`.
- [x] Confirm the tree stays green (`npm run typecheck && npm run lint && npm test && npm run build`).

**Acceptance Criteria:**
- Given the assembled app, when the test suites run, then unit, E2E-journey (against stubs), and a11y-static suites exist and pass (NFR-11) — inventoried with measured counts + pass evidence.
- Given the E2E journey, when it runs, then it walks address→estimate→lead through the concrete stub adapters and passes green end-to-end (ids thread, idempotency dedups, consent gate blocks, no-PII observability).
- Given browser support, when NFR-12 is verified, then the supported browser matrix is documented + reasoned (evergreen + graceful degradation), resolving `[OPEN] matrix TBD`, with cross-browser rendering honestly recorded as a manual-pass under the node-only harness.

## Verification

**Commands:**
- `npx vitest run src/server/journey.e2e.test.ts` -- expected: green (the E2E journey passes against the stubs).
- `npm run typecheck && npm run lint && npm test && npm run build` -- expected: all exit 0.
- `find src app -name "*.test.ts*" | wc -l` -- expected: the count recorded in the artifact.

**Manual checks:**
- The journey composes the CONCRETE stubs (no mocks) and asserts id threading across all three seams.
- The suite inventory counts match a real `find`; the browser matrix is specific + reasoned; the cross-browser manual-pass ceiling is stated honestly.

## Review Triage Log

Verification story shipping BOTH an artifact AND one new test — one adversarial auditor (opus-4.8) checked (a) the new E2E journey test is correct + meaningful (not vacuous) and (b) the artifact is complete, honest, evidenced.

**Audit result: HONEST AND COMPLETE — 0 critical, 1 minor (fixed).**

- Ran the new test: `npx vitest run src/server/journey.e2e.test.ts` → 4 green; full suite 71 files / 528 tests green. **CLEARED.**
- Journey quality (the critical check): composes the CONCRETE stubs via the REAL use-cases (no mocks); ids thread genuinely (`peek()` store's estimateId === the estimate's); idempotency proves real dedup (same key → same leadId, one record); consent gate proves rejection + zero stored records; no-PII assertion is a real serialize-and-grep for actual PII values. No assertion passes trivially against broken code. **CLEARED — meaningful, not tautological.**
- Import/API fidelity: factory names, use-case signatures, `peek()`, `encryptAtRest`/`retentionMonths`, both hex-id regexes all match source; `.test.ts` correctly excluded from the arch boundary walk. **CLEARED.**
- Count integrity: independently reproduced 71 files / 528 tests / 5 route / 21 `.test.tsx` / 45 `src` `.test.ts` / 16 a11y — all truthful; overlap caveat honest. **CLEARED.**
- NFR-12 matrix: resolves the real prior `[OPEN] matrix TBD`; evergreen + graceful-degradation with per-browser rationale; cross-browser correctly labelled manual-pass; every risk-spot grounded in actual code (`100dvh`/`visuallyHidden`/`flexWrap`/reduced-motion/focus-ring). **CLEARED.**
- Overclaim check: no browser/interaction/axe result claimed as automated `pass`; "runs green end-to-end against stubs" backed by the 4 passing tests. **CLEARED.**

**MINOR (fixed):** the journey's analytics events are hand-tracked in the test (the spike use-cases don't auto-wire analytics), so the no-PII assertion validates the typed event-contract discipline + serialization, not pipeline auto-emission — the artifact's "taxonomy fires with no PII" wording was tightened to say exactly that.

No CRITICAL issues. No HALT/blocked condition.

## Auto Run Result

- **Outcome:** ✅ done — E2E journey added (green) + verification artifact delivered, audited HONEST AND COMPLETE, tree green.
- **Deliverables:** (1) `src/server/journey.e2e.test.ts` (NEW, 4 tests) — node-level end-to-end journey composing the concrete stub adapters through the real use-cases (address→estimate→lead), asserting id threading, idempotency dedup, consent-gate rejection, no-PII observability. (2) `test-suites-and-browser-matrix.md` — measured suite inventory (71 files / 528 tests across unit / component-structural / route / E2E-journey / a11y-static), the E2E-journey evidence table, and the documented + reasoned NFR-12 browser support matrix (evergreen + graceful degradation + risk-spot checklist) resolving `[OPEN] matrix TBD`; verdict + honest node-only-harness ceiling (live DOM / axe / cross-browser / UI-E2E = manual-pass).
- **Code change:** +1 test file (`journey.e2e.test.ts`); no production code changed.
- **Gates:** typecheck ✅, lint ✅, test ✅ (528, +4), build ✅.
- **Review:** 1 adversarial auditor (test correctness + artifact honesty), 0 critical / 1 minor (fixed).
