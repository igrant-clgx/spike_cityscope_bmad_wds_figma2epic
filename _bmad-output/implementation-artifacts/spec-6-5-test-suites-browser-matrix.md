---
title: 'Story 6.5: Test suites & browser support matrix'
type: 'chore'
created: '2026-08-14'
status: 'ready-for-dev'
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
- [ ] `src/server/journey.e2e.test.ts` -- CREATE: an end-to-end journey over the concrete stubs (address suggest/resolve → estimate → consented lead), asserting id threading, idempotency dedup, consent-gate rejection, and no-PII observability; runs green in `npm test`.
- [ ] `_bmad-output/implementation-artifacts/test-suites-and-browser-matrix.md` -- CREATE: a suite inventory by category (unit / component-structural / route / E2E-journey / a11y-static) with measured counts + pass evidence; a documented + reasoned NFR-12 browser support matrix (evergreen targets, graceful degradation) resolving `[OPEN] matrix TBD`; a defects section; a verdict + honest node-only-harness ceiling (cross-browser = manual-pass).
- [ ] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- (finalization) mark `6-5-test-suites-browser-matrix: done`.
- [ ] Confirm the tree stays green (`npm run typecheck && npm run lint && npm test && npm run build`).

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
