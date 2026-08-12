---
title: 'Story 4.3 — Results states: loading, error, empty/low-confidence'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '5536a65'
final_revision: '87d7bda'
---

<intent-contract>

## Intent

**Problem:** Story 4.2 delivered a purely presentational `ResultCostCard`, but nothing requests an estimate or handles the surrounding async lifecycle. The homeowner has no feedback while an estimate is calculated, no honest recovery if the estimate service fails, and no honest message when the result is empty/low-confidence (UX-DR16 results, FR-19..FR-22).

**Approach:** Introduce a persistent Results surface (`src/features/results/ResultsPanel.tsx`) that owns the estimate request lifecycle via the existing `useEstimate()` mutation and renders the four UX-DR16 states — loading/skeleton, success reveal (motion-band, `prefers-reduced-motion`-honoring), non-destructive retryable error (answers preserved), and empty/low-confidence honest message. Wire it into `EstimateFlow` below the stepper with a **persistent** `role="status"` live region (the BH#2 defer carried from Story 4.2). Build the wire request from the completed scope with a pure `buildEstimateRequest(config, values)` that prunes `propertyDetails` to the visible question set (Epic 3 defer, due here).

## Boundaries & Constraints

**Always:** Route the request through `useEstimate()` → `requestEstimate` → `apiFetch` (AD-1/AD-5/AD-9); the mutation SUCCEEDS at the query level while the envelope may be `data.ok === false` — detect the service error via `data.ok === false`, never `isError` alone. Keep the persistent `role="status"` live region mounted across calculating→result→error transitions (do NOT unmount/remount it) so the arrival announcement is reliable. Money stays integer `AudCents` until the view edge (`formatAud`/`formatAudRange`). Honor `prefers-reduced-motion` for the success reveal (reuse `useReducedMotion`/`resolveDuration` and/or the global `MuiCssBaseline` collapse). Preserve ALL captured answers on error + retry (the form aggregate is untouched by a failed request). Node-only tests; extract all state→view decisions into a PURE mapper so they are testable without RTL. No new dependencies. No ad-hoc hex (theme tokens / palette props only). Preserve requirement IDs verbatim.

**Block If:** The estimate request would need scope fields not already present in the flow aggregate/config; or empty/low-confidence "path forward" copy requires a product decision beyond an honest indicative message. (HALT with status blocked.)

**Never:** Do NOT implement Edit/New Estimate actions (Story 4.4) — this story renders results + states only. Do NOT change the pricing logic or the `EstimateEngine` stub (OI-3 stays behind the port). Do NOT branch UI on any pricing internals. Do NOT add `@mui/icons-material` (use inline `<svg>` if an icon is needed). Do NOT auto-fire the estimate on every keystroke — trigger it deliberately (an explicit "Calculate/See estimate" action or an explicit mount of the results surface).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Idle (not yet requested) | mutation idle | No card; a stable prompt/CTA to calculate; live region present but empty | n/a |
| Loading | mutation pending | Skeleton/loading state with `role="status" aria-busy="true"`; answers untouched | n/a |
| Success (normal) | `data.ok === true`, confidence medium/high | `ResultCostCard` revealed (motion band, reduced-motion honored); live region announces arrival | n/a |
| Empty/low-confidence | `data.ok === true`, confidence `low` (and/or degenerate scope) | Honest low-confidence message + forward path (still shows the range, framed humbly) — never a false-precise single number | n/a |
| Service error | `data.ok === false` | Non-destructive error message + Retry button; ALL answers preserved; retry re-fires the same request | Show `error.message`/generic copy; retry via `mutate` |
| Transport/unexpected | `isError === true` | Same non-destructive error surface (checked BEFORE pending/data-undefined) | Generic retryable error |
| Build request | config + form values, some `propertyDetails` for now-hidden questions | `buildEstimateRequest` prunes details to visible questions, returns `{configVersion, itemIds}` (deduped) | Empty scope → still valid request |

</intent-contract>

## Code Map

- `src/features/results/ResultsPanel.tsx` -- NEW. Persistent results surface; owns `useEstimate()`, maps state via the pure mapper, renders idle/loading/success/low-confidence/error; hosts (or is wrapped by) the persistent live region.
- `src/features/results/results-view-state.ts` -- NEW. Pure mapper `toResultsView(mutationState)` → discriminated view model (`idle`/`loading`/`success`/`lowConfidence`/`error`) + the SR announcement string. All decisions here (check `isError` before pending; `data.ok===false`→error; confidence `low`→lowConfidence). Node-testable.
- `src/features/results/build-estimate-request.ts` -- NEW. Pure `buildEstimateRequest(config, values)`: prune `propertyDetails` to visible questions (reuse `filterQuestions`), dedupe/echo `configVersion` + `selectedItemIds` → `EstimateRequest`. (Resolves the Epic 3 stale-answer-pruning defer.)
- `src/features/results/copy.ts` -- extend with loading/error/empty-low-confidence/retry/idle-CTA microcopy (honest, humble; `\u2019` apostrophes).
- `src/features/results/ResultCostCard.tsx` -- reused for the success/low-confidence body; the persistent live region contract documented in its header is now satisfied by `ResultsPanel`.
- `src/features/results/index.ts` -- export `ResultsPanel`, `buildEstimateRequest`, `toResultsView`.
- `src/features/estimate-form/EstimateFlow.tsx` -- mount `<ResultsPanel>` below the stepper; provide config + current `getValues()`/`watch` scope to build the request; keep the address/reset behavior untouched.
- `src/features/estimate-form/use-estimate.ts` -- reuse as-is (`useEstimate`/`requestEstimate`).
- `src/features/estimate-form/question-selection.ts` -- reuse `filterQuestions` for pruning.
- `src/lib/request-state.ts` / `src/components/feedback` -- reuse `ApiResult`, `useReducedMotion`, `resolveDuration`.

## Tasks & Acceptance

**Execution:**
- [x] `src/features/results/build-estimate-request.ts` -- pure request builder pruning `propertyDetails` to visible questions and echoing `configVersion` + deduped `itemIds` -- resolves Epic 3 defer; keeps request honest.
- [x] `src/features/results/results-view-state.ts` -- pure `toResultsView` mapper over the mutation state (isError-first, `data.ok===false`→error, confidence `low`→lowConfidence, pending→loading, idle→idle) + SR announcement string -- the single source of state decisions.
- [x] `src/features/results/copy.ts` -- add loading/error/retry/empty-low-confidence/idle-CTA copy -- honest, humble range framing.
- [x] `src/features/results/ResultsPanel.tsx` -- persistent surface: `useEstimate()`, persistent `role="status"` live region (never remounts), render each view state (loading `aria-busy`, success/low-confidence via `ResultCostCard`, non-destructive retryable error) with motion-band reveal honoring reduced motion -- the UX-DR16 results matrix.
- [x] `src/features/results/index.ts` -- barrel exports.
- [x] `src/features/estimate-form/EstimateFlow.tsx` -- mount `<ResultsPanel>` below the stepper, feeding config + current scope; answers preserved across error/retry.
- [x] `src/features/results/build-estimate-request.test.ts`, `results-view-state.test.ts`, `ResultsPanel.test.tsx` -- unit-test the I/O matrix (pruning, every view-state branch incl. isError-before-pending and `ok===false`, live-region presence in loading+error, reduced-motion path).

**Acceptance Criteria:**
- Given an estimate request is in flight, when the mutation is pending, then a loading/skeleton state with `role="status" aria-busy="true"` shows and all captured answers remain intact.
- Given the estimate resolves successfully, when the result arrives, then the `ResultCostCard` is revealed within the motion band (collapsed under `prefers-reduced-motion`) and the persistent live region announces arrival.
- Given the estimate service returns `data.ok === false` (or the query `isError`), when the error state renders, then a non-destructive message with a Retry action shows, ALL answers are preserved, and retry re-fires the request.
- Given a low-confidence result, when it renders, then an honest low-confidence message with a forward path shows instead of a false-precise single number.
- Given `propertyDetails` contains answers for now-hidden questions, when `buildEstimateRequest` runs, then those answers are pruned and the request carries only `configVersion` + deduped `itemIds`.

## Spec Change Log

## Review Triage Log

Blind Hunter + Edge Case Hunter ran in parallel against the diff since `5536a65`. Orchestrator set final severity. 9 finding-groups → 8 patched, 0 deferred, 0 rejected.

| # | Finding | Final severity | Disposition |
|---|---------|----------------|-------------|
| BH#1 | Two competing `role="status"` regions in success/low-confidence (panel + card) — the reliable persistent region only said "ready" while the $ figure lived in the freshly-mounted card region (the same-commit case SRs announce inconsistently); contradicts the card's own contract | MED | **patch** — removed the inner live region from `ResultCostCard`; the single persistent panel region now announces the arrival AND the formatted range via `formatAudRange`. |
| EH#1 | `buildEstimateRequest` deduped but never filtered `itemIds` to `config.items` — phantom/stale/wrong-type selections sent on the wire | MED | **patch** — filter `selectedItemIds` to ids present in `config.items` (then dedupe). |
| BH#2 | `propertyDetails` pruning was dead code (`void prunedDetails`) — the wire schema is `{configVersion, itemIds}` so answer-pruning can never reach the wire; "Epic 3 defer resolved" was hollow | LOW | **patch** — removed the dead answer-pruning; honest doc-comment: answer-pruning is moot at this seam, the meaningful staleness guard is pruning `itemIds` to the current config (merged with EH#1). |
| BH#3 | Raw backend `error.message` ("engine down") surfaced verbatim to the homeowner — leaks internal detail, breaks the calm/honest copy contract | LOW | **patch** — display the friendly `ERROR_MESSAGE`; raw text/code/requestId preserved on the view model as `detail`/`code`/`requestId` for telemetry only. |
| EH#2 | Range aria-label interpolated `costMin`/`costMax` unordered → SR hears an inverted range when `min > max` (visible text is ordered) | LOW | **patch** — order the label with `Math.min`/`Math.max` to match `formatAudRange`. |
| EH#3 | Calculate CTA enabled with empty scope (`selectedItemIds: []`) → fires a zero-item estimate that can only round-trip to error/low-confidence | LOW | **patch** — disable the CTA when `selectedItemIds.length === 0`. |
| EH#4 | Double-fire race: rapid re-click of Calculate/Retry issued two POSTs before the state flipped to pending | LOW | **patch** — guard `if (mutation.status === 'pending') return;` at the top of `fire()`. |
| BH#4 | Labels recomputed from live `getValues()` each render while `result` reflected calculate-time scope → editing the stepper after calculating desyncs labels from numbers | LOW | **patch** — snapshot the scope-derived labels into state at `fire()` time; the card renders from that snapshot. |
| EH#5 | Hollow reduced-motion test asserted only content presence (true-green — `Collapse unmountOnExit` defaults false) | LOW | **patch** — assert the motion signal (`resolveDuration(REVEAL_MS, true) === 0`) instead. |
| — | Mapper ordering (`isError`→`pending`→`data undefined`→`data.ok===false`→`low`→success) exhaustive & correct; answers preserved on error+retry; `configVersion` echo; empty scope still valid; money only at view edge; no ad-hoc hex; no `@mui/icons-material`; reduced-motion collapse; live-region re-announcement across retry; no 4.4/pricing scope leak | — | **verified correct by both reviewers.** |

## Auto Run Result

- **Outcome:** SUCCESS
- **Story:** 4.3 — Results states (loading / error / empty-low-confidence)
- **Baseline:** `5536a65`
- **Implementation:** SYNC subagent. New persistent `ResultsPanel` owns `useEstimate()` and fires only on an explicit "See my estimate"/Retry action; a pure `toResultsView` mapper (isError-first, non-throwing `data.ok===false`→error, confidence `low`→lowConfidence) drives the UX-DR16 states; a pure `buildEstimateRequest` prunes `itemIds` to the live config and dedupes. A single **persistent** `role="status"` live region (never remounted; `aria-busy` in loading) announces arrival + the formatted range; success reveal via `Collapse` honoring `prefers-reduced-motion`. Wired below the stepper in `EstimateFlow`. `ResultCostCard` reused for success/low-confidence.
- **Review:** Blind Hunter + Edge Case Hunter (parallel). 9 finding-groups → 8 patched (2 MED, 6 LOW), 0 deferred, 0 rejected. Both MEDs (duplicate live region, unfiltered itemIds) fixed.
- **Gates (post-patch):** typecheck ✅ · lint ✅ · test ✅ **383 passed (59 files)** · build ✅. No ad-hoc hex; no new deps.
- **New dependencies:** none.
