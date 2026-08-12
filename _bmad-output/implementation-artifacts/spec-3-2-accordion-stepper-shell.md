---
title: 'Story 3.2 — Accordion stepper shell & flow aggregate'
type: 'feature'
created: '2026-08-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'ed87bcf8d353dc61366823793e0e494dd84b1f1c'
final_revision: 'e0e6c96c2737b4adc18314d08ba287da8e09ff2f'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** Epic 3's guided form needs a progressive-disclosure accordion shell (one step at a time) and a single owner of in-progress scope across Step 1–3 (AD-6). Today only the address slot exists; there is no stepper, no react-hook-form flow aggregate, and no place for Step 1–3 answers. Story 2.5's address-change reset also cannot yet be *observed* on dependent scope because no dependent scope exists.

**Approach:** (1) Extend the pure domain flow aggregate with the Step 1–3 scope slots so `emptyForm()` defines them and `changeAddress` resets them for free (proving Story 2.5's forward-compat). (2) Introduce `react-hook-form` (AD-6, architecture-pinned) as the single in-progress-form-state owner via a page-level `EstimateFlow` container; lift the address state up so a real address change calls `reset()` on the form, finally making the dependent-scope reset observable + surfacing the reset notice. (3) Build the `EstimateStepper` accordion shell: exactly one step expanded, each header a `<button aria-expanded>`, a completed step collapsing to a summary line with a completion indicator (OI-9 `[ASSUMPTION]` check icon), ~300ms motion honoring `prefers-reduced-motion`, and a screen-reader step-change announcement. Step bodies are placeholders — Stories 3.3–3.5 fill them.

**Interaction-testing decision (Epic 1 retro action #2 / Epic 2 retro action #4):** Stay NODE-ONLY (no jsdom/RTL). Extract all step-progression, completion, and reset decisions into PURE functions unit-tested exhaustively; render the shell with `renderToStaticMarkup` to assert structure (buttons, `aria-expanded`, one-expanded, seeded-completed summary + check icon, SR live region). Expand/collapse focus behaviour and live-region announcement timing are covered by a DOCUMENTED manual a11y check, consistent with the Story 2.3 MUI focus-trap precedent. No new test dependency.

## Boundaries & Constraints

**Always:**
- Domain aggregate stays PURE (no zod/react/next/@mui): extend `RenovationEstimateForm` with `renovationTypeId: string | null`, `selectedItemIds: string[]`, `propertyDetails: PropertyDetailAnswers`; `emptyForm()` initializes all to their empty baseline; `setAddress` preserves step slots; `changeAddress` (rebuild-from-`emptyForm()`) clears them — do not special-case the new slots.
- Exactly ONE step is expanded at any time (UX-DR7). Each accordion header is a real `<button>` exposing `aria-expanded` reflecting its open state (UX-DR7/UX-DR18).
- A completed step, when collapsed, shows a summary line plus a completion indicator (OI-9 `[ASSUMPTION]`: a check icon). Completion is decided by a PURE predicate over form values.
- A SINGLE `react-hook-form` instance owns all in-progress Step 1–3 input (AD-6); server/async state stays in TanStack Query. Step components read/write via `useFormContext` — no ad-hoc `useState` for field values.
- Changing an already-confirmed address resets the react-hook-form flow scope to the step defaults (dependent-scope reset, FR-9/Story 2.5) AND surfaces the existing `ADDRESS_CHANGED_RESET_NOTICE` toast; the FIRST address set does neither.
- Accordion expand/collapse uses the ~300ms `standard` motion token and collapses under `prefers-reduced-motion` (existing theme `MuiCssBaseline` rule + `useReducedMotion`/`resolveDuration` where JS-driven).
- Step change is announced to screen readers via an `aria-live` region (UX-DR20).
- Use theme tokens / MUI props only — no ad-hoc hex.

**Block If:**
- OI-7 semantics would need to CHANGE from the documented `[ASSUMPTION]` (clear dependent scope). It does not here — we implement clear. Do not block; keep clear-on-change.

**Never:**
- Do NOT build Step 1 type selection, Step 2 items, or Step 3 field rendering/validation (Stories 3.3/3.4/3.5) — step bodies are minimal placeholders.
- Do NOT fetch config here (that is the step stories via `useFormConfig`); the shell must not depend on config content.
- Do NOT introduce jsdom/RTL or any test dependency. `react-hook-form@^7.85.0` is the ONLY new runtime dependency (architecture-mandated, AD-6).
- Do NOT regress Epic 2 address behaviour: the modal, suggest/resolve, manual entry, and first-set-vs-change semantics must all still work after the lift.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Empty aggregate | `emptyForm()` | `{ address:null, renovationTypeId:null, selectedItemIds:[], propertyDetails:{} }` | n/a |
| Address change clears steps | form with type/items/details set, then `changeAddress(form, other)` | result equals `setAddress(emptyForm(), other)` — all step slots reset | n/a |
| setAddress preserves steps | form with step data, `setAddress(form, addr)` | step slots unchanged, only address replaced | n/a |
| Step completion predicate | `isStepComplete('type', values)` | true iff `renovationTypeId !== null`; `'items'` true iff `selectedItemIds.length >= 1` | unknown step id → false |
| One-expanded invariant | expand step B while A open | only B expanded; `setExpanded` replaces, never unions | n/a |
| First address set | `EstimateFlow` handleConfirm, address was null | set address; NO form reset; NO toast | n/a |
| Real address change | handleConfirm, address already set | set address; `reset(stepFormDefaults())`; info toast | n/a |
| Shell structure | render stepper (no data) | 3 headers as `<button aria-expanded>`, step 1 expanded by default, SR live region present | n/a |
| Completed-step summary | render stepper with seeded complete step | that step shows summary line + check-icon indicator | n/a |

## Code Map

- `src/server/domain/flow/renovation-estimate-form.ts` -- EDIT. Add `renovationTypeId`/`selectedItemIds`/`propertyDetails` slots + `PropertyDetailAnswers`/`PropertyAnswerValue` types; extend `emptyForm()`. `setAddress`/`changeAddress` unchanged in body (spread/rebuild handles new slots) — update JSDoc.
- `src/server/domain/flow/renovation-estimate-form.test.ts` -- EDIT. Assert `emptyForm()` step baseline; strengthen the `changeAddress` test to seed step slots and prove they reset; assert `setAddress` preserves them.
- `src/features/estimate-form/flow-form-values.ts` -- NEW. Pure UI-side mapping: `StepFormValues` type (renovationTypeId/selectedItemIds/propertyDetails) + `stepFormDefaults()` deriving the react-hook-form defaults from `emptyForm()`. No react.
- `src/features/estimate-form/flow-form-values.test.ts` -- NEW.
- `src/features/estimate-form/step-state.ts` -- NEW. Pure stepper logic: `StepId` union + `STEP_ORDER`, `isStepComplete(stepId, values)`, `nextExpanded(current, target)` (one-expanded), step metadata (id, title). No react.
- `src/features/estimate-form/step-state.test.ts` -- NEW. Exhaustive predicate + transition tests.
- `src/features/estimate-form/EstimateStepper.tsx` -- NEW. `'use client'`. MUI `Accordion` x3 driven by `useFormContext<StepFormValues>()` + local expanded state; button headers w/ `aria-expanded`; completed→summary + check icon (OI-9); SR `aria-live` step announcement; motion via theme/`useReducedMotion`. Placeholder step bodies.
- `src/features/estimate-form/EstimateStepper.test.tsx` -- NEW. Node-only structural assertions (+ seeded-complete summary) via a small test harness that wraps `FormProvider`.
- `src/features/estimate-form/EstimateFlow.tsx` -- NEW. `'use client'`. Owns `useForm<StepFormValues>({ defaultValues: stepFormDefaults() })` + address `useState`; renders controlled `AddressSection` + `FormProvider` > `EstimateStepper`; `handleConfirm` does first-set vs change (reset + toast) — MOVED here from AddressSection.
- `src/features/estimate-form/EstimateFlow.test.tsx` -- NEW. Node-only structural (address block + stepper compose; wrapped in Query/Toast/Theme providers).
- `src/features/address/AddressSection.tsx` -- EDIT. Make CONTROLLED: accept `address: ResolvedAddress | null` + `onConfirm: (address: ResolvedAddress) => void`; remove its `useState`/`useToast`/`changeAddress`/first-set logic (moved to `EstimateFlow`). Render `AddressBlock` + `AddressModal` only.
- `src/features/address/AddressSection.test.tsx` -- EDIT. Pass props; drop the ToastProvider requirement if no longer needed (keep Query provider for the modal hook).
- `src/features/estimate-form/index.ts` -- EDIT. Export `EstimateFlow` (+ types) for the page.
- `app/page.tsx` -- EDIT. Replace the standalone `<AddressSection />` + placeholder cost text with `<EstimateFlow />` (address section is now rendered inside it). Keep the page a Server Component.
- `package.json` / `package-lock.json` -- EDIT. Add `react-hook-form@^7.85.0` (AD-6).

## Tasks & Acceptance

**Execution:**
- [x] `src/server/domain/flow/renovation-estimate-form.ts` -- add Step 1–3 scope slots + answer types; extend `emptyForm()` -- canonical scope (AD-6) + proves Story 2.5 reset.
- [x] `src/server/domain/flow/renovation-estimate-form.test.ts` -- cover empty baseline, reset-on-change, preserve-on-setAddress.
- [x] `npm i react-hook-form@^7.85.0` -- AD-6 form-state owner (architecture-pinned).
- [x] `src/features/estimate-form/flow-form-values.ts` (+test) -- pure rhf defaults mapping.
- [x] `src/features/estimate-form/step-state.ts` (+test) -- pure stepper logic (one-expanded, completion).
- [x] `src/features/estimate-form/EstimateStepper.tsx` (+test) -- accordion shell (buttons/aria-expanded/summary+check/SR live/motion).
- [x] `src/features/estimate-form/EstimateFlow.tsx` (+test) -- FormProvider + address lift + change→reset+toast.
- [x] `src/features/address/AddressSection.tsx` (+test) -- refactor to controlled.
- [x] `src/features/estimate-form/index.ts` + `app/page.tsx` -- wire `EstimateFlow` into the page.

**Acceptance Criteria:**
- Given the form loads, when the stepper renders, then exactly one step is expanded and each header is a `button` with `aria-expanded` (UX-DR7, UX-DR18).
- Given a step is complete, when it collapses, then it shows a summary line with a completion indicator (check icon — OI-9 `[ASSUMPTION]`).
- Given the three steps, when input is captured, then a single react-hook-form flow aggregate owns all scope across steps (AD-6).
- Given an already-confirmed address, when it is changed, then the flow scope resets to defaults and the reset notice is shown; the first address set does neither (FR-9 / Story 2.5).
- Given the accordion, when a step expands/collapses, then it uses the ~300ms motion token and respects `prefers-reduced-motion`.
- All four gates green; layer purity + no-adhoc-hex clean; only `react-hook-form` added; Epic 2 address behaviour unregressed.

## Spec Change Log

## Review Triage Log

Two adversarial reviewers ran in parallel (Blind Hunter — general adversarial; Edge Case Hunter — branch/boundary). Orchestrator set final severity and disposition.

| # | Reviewer | Finding | Final severity | Disposition | Rationale |
|---|----------|---------|----------------|-------------|-----------|
| 1 | Blind | `nextExpanded` could collapse to ZERO expanded steps, violating the "Exactly ONE step is expanded at any time" (UX-DR7) **Always** contract | medium | **patch** | Re-toggling the open step is now a no-op (stays open); removed the `null`/"All steps collapsed" path; expanded state is now non-null `StepId`. Aligns code to the stated invariant. |
| 2 | Blind | Block content (`div`/`p`) nested inside the header `<button>` (invalid phrasing content / React DOM-nesting) | low | **patch** | Header `Box`/`Typography` now render as `component="span"` with `display:block`. |
| 3 | Blind | `useReducedMotion()` return value unused | low | **reject** | Spec sanctions it ("`useReducedMotion`/`resolveDuration` where JS-driven"); no JS-driven motion in the shell, call is a harmless forward-hook. Documented in code. |
| 4 | Blind | Domain `setAddress`/`changeAddress` are runtime dead code (address lifted to `useState`) | low | **reject** | Intentional per spec — `StepFormValues` deliberately excludes address; reset mirrored via `reset(stepFormDefaults())`; the `emptyForm()`/defaults sync is test-guarded. |
| 5 | Edge | Same-address re-confirm fires `reset()`+toast → silent scope data loss | high | **patch** | `handleConfirm` now guards with `isSameAddress` (street/suburb/state/postcode); a re-confirm of the identical address is not treated as a change. |
| 6 | Edge | Stale local `expanded` state survives an address-change `reset()` | medium | **patch** | `EstimateFlow` bumps a `stepperKey` on a real change, remounting `EstimateStepper` to the initial step-1-expanded shell. |
| 7 | Edge | `useWatch` cast to `StepFormValues` with no defensive guard | low | **patch** | `isStepComplete` now takes `Partial<StepFormValues>` and treats missing slots as empty; stepper falls back to `{}`. |
| 8 | Edge | `isStepComplete('type')` treats `''`/whitespace `renovationTypeId` as complete | medium | **patch** | Added `isMeaningfulAnswer` (blank strings don't count). |
| 9 | Edge | `isStepComplete('details')` counts a key with an empty/invalid value as complete | medium | **patch (partial) + defer** | Now counts only keys with a meaningful value (undefined/null/blank excluded). Full per-field validity (e.g. range `min<=max`) is Story 3.5's job (OI-2) — deferred, flagged in `deferred-work.md`. |
| 10 | Edge | `nextExpanded` returned an unknown target id verbatim | low | **patch** | Now guarded: unknown target keeps the current step (folded into finding #1's rewrite). |
| 11 | Edge | `stepFormDefaults`/`StepFormValues` could drift from future `emptyForm()` slots | medium | **reject** | The subset is deliberate and TS-enforced: adding a slot to `StepFormValues` forces updating `stepFormDefaults` (missing-property error); address is curated out by design, not drift. |

Patches added coverage: `nextExpanded` no-collapse + unknown-target guard, `isStepComplete` blank-string/partial-values/range-value cases (step-state.test.ts → 11 tests). All four gates green post-patch (190 tests).

## Auto Run Result

- **Story:** 3.2 — Accordion stepper shell & flow aggregate
- **Outcome:** ✅ complete
- **Gates:** typecheck ✅ · lint ✅ · test ✅ (190 passed / 33 files) · build ✅
- **Layer purity:** clean (`src/server/domain`, `src/server/adapters` — only JSDoc mentions of react/@mui, zero imports)
- **no-adhoc-hex:** pass · **Epic 2 address regression:** green (AddressModal/Block/Section)
- **New dependency:** `react-hook-form@^7.85.0` (AD-6, architecture-pinned) — the only addition
- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel). 11 findings → 8 patched, 1 partial-patch+defer, 3 rejected. No blockers.
- **Deferred:** OI-2 full per-field detail validation (Story 3.5); manual a11y check for expand/collapse focus + live-region timing (per spec interaction-testing decision).
- **Completion indicator:** inline themed SVG check (`currentColor`, `success.main`) — `@mui/icons-material` not a project dep (OI-9 `[ASSUMPTION]`).
