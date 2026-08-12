---
title: 'Story 3.3 — Step 1: Renovation Type selection'
type: 'feature'
created: '2026-08-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '7a266110c0e400ce1e7a6bc87938fe7c0875dae9'
final_revision: '098d08f78a2f1c3a746bb5094f7f9acd22014e76'
context:
  - '_bmad-output/implementation-artifacts/epic-3-context.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** Step 1 of the guided estimate needs a real single-select renovation-type control fed by the ConfigSource seam (Story 3.1) and written into the react-hook-form flow aggregate (Story 3.2), replacing the `'Coming in Story 3.3'` placeholder. Today the `type` accordion body is an inert placeholder and no renovation type can actually be chosen, so Step 2's option set (Story 3.4) has nothing to key off.

**Approach:** Add a pure, hook-free `RenovationTypeSelect` presentational control (single-select toggle buttons over the config's `renovationTypes`) and a `Step1RenovationType` client container that reads the bundle via `useFormConfig()` (TanStack Query), binds the choice to the form's `renovationTypeId` via react-hook-form `useController`, and renders the config-loading / error / empty states (UX-DR16 form slice). Wire the container into the stepper's `type` body. Selection is required (FR-10); the stored `renovationTypeId` is what Step 2 will filter items by (FR-11).

## Boundaries & Constraints

**Always:**
- Single-select semantics (UX-DR6 single-select): exactly one type may be active; choosing a different type replaces the selection; a required selection is NEVER cleared to empty by re-activating the current choice (FR-10 — required before proceeding). Deselect-to-null is suppressed.
- Selection buttons: unselected vs `primary-active` selected state visibly distinct, targets ≥44px, operable with Enter/Space, keyboard-focusable, each exposing pressed/selected state programmatically (`aria-pressed` or the MUI `ToggleButton` selected semantics) (FR-12, UX-DR6, UX-DR20, NFR-1).
- The chosen type id is the SINGLE source of truth in the react-hook-form aggregate (`renovationTypeId`) via `useController` (AD-6). No second copy of the selection is held in component state.
- Renovation types are CONFIG, not code — labels/ids come only from `useFormConfig()` output; no renovation label or id is a literal in component/UI code (AD-8/AD-11).
- Config-loading, error, and empty (`renovationTypes` present but nothing chosen yet) states each render an explicit, accessible treatment (UX-DR16 form slice). `apiFetch` is non-throwing: a service failure surfaces as `data.ok === false`, NOT a thrown/`isError` query.
- Node-only tests (no jsdom/RTL). Presentational control fully unit-tested via `renderToStaticMarkup`; the container's state branches tested via a hook-free extracted view where a live query can't be driven in SSR.

**Block If:**
- The final Step 1 type taxonomy is disputed by product — the stub already serves Internal/External; build generically against whatever `renovationTypes` the config returns. (Not expected to trigger.)

**Never:**
- No Step 2 item rendering, no Step 3 fields — this story only captures the Step 1 choice (the stepper `items`/`details` bodies stay placeholders).
- No new dependency (react-hook-form + TanStack Query + MUI already present). No jsdom/RTL. No ad-hoc hex (theme tokens / MUI palette / `primary-active`-equivalent props only).
- Do NOT change the ConfigSource seam, schema, or stub content. Do NOT alter address behaviour or the one-expanded stepper invariant.
- Do NOT gate/disable the accordion progression on completion in this story (Step-to-step advance affordance is Story 3.4/3.5 concern); completion state already drives the summary indicator from Story 3.2.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Loading | `useFormConfig` pending (no data) | Config-loading treatment (accessible busy indicator / skeleton) in the Step 1 body | No error expected |
| Loaded, none chosen | `data.ok === true`, `renovationTypeId === null` | One button per `renovationTypes` entry, none selected; Step 1 incomplete | No error expected |
| Choose a type | click/Enter/Space on a type button | `renovationTypeId` set to that id via `useController`; that button reflects selected state; Step 1 now complete | No error expected |
| Switch type | a type already chosen, activate a different one | selection replaced with the new id (still exactly one active) | No error expected |
| Re-activate current | current chosen type re-activated | selection unchanged (stays chosen — required, no deselect-to-null) | No error expected |
| Service failure | `data.ok === false` | Accessible error treatment (cannot load renovation types); no buttons rendered; no crash | Read `error` from the envelope; surface copy, do not throw |
| Empty types | `data.ok === true`, `renovationTypes` empty | (Schema forbids empty `renovationTypes`, but defend) empty-state copy, no crash | No error expected |

</intent-contract>

## Code Map

- `src/features/estimate-form/RenovationTypeSelect.tsx` -- NEW. Pure, hook-free presentational single-select. Props `{ types: RenovationType[]; value: string | null; onSelect: (id: string) => void; groupLabel: string }`. MUI `ToggleButtonGroup` (exclusive) of `ToggleButton`s (≥44px, selected = `primary-active`-equivalent), `aria-label` on the group, one active max, no deselect-to-null (drop `null` change). No react-query, no rhf.
- `src/features/estimate-form/RenovationTypeSelect.test.tsx` -- NEW. Node-only structural: one button per type, labels rendered, selected type reflects selected/pressed state, exactly one selected when a value is given, none selected when `value` is null, group `aria-label` present.
- `src/features/estimate-form/Step1RenovationType.tsx` -- NEW. `'use client'`. Container: `useFormConfig()` + `useController({ name: 'renovationTypeId' })`; maps query envelope → `{status: 'loading'|'error'|'empty'|'ready', types}` via an extracted PURE `resolveTypeStep(query)` helper; renders loading/error/empty/ready (UX-DR16). On ready, renders `RenovationTypeSelect` bound to the controller.
- `src/features/estimate-form/resolve-type-step.ts` -- NEW. Pure helper mapping `UseQueryResult<ApiResult<FormConfig>>`-shaped input → a discriminated view state (`loading`/`error`/`empty`/`ready` + `types`). Node-testable exhaustively (mirrors the `apiFetch` non-throwing envelope contract).
- `src/features/estimate-form/resolve-type-step.test.ts` -- NEW. Node-only: pending→loading; `ok:false`→error; `ok:true` empty types→empty; `ok:true` with types→ready.
- `src/features/estimate-form/EstimateStepper.tsx` -- EDIT. Replace the `type` step's placeholder body with `<Step1RenovationType />`. Items/details keep placeholders. Keep completion/one-expanded logic intact.
- `src/features/estimate-form/Step1RenovationType.test.tsx` -- NEW. Node-only structural render inside Theme+Query+FormProvider: in SSR the query is pending, so assert the loading treatment renders (accessible busy semantics).
- `src/features/estimate-form/index.ts` -- EDIT. Export `Step1RenovationType`, `RenovationTypeSelect`, `resolveTypeStep`.

## Tasks & Acceptance

**Execution:**
- [x] `src/features/estimate-form/RenovationTypeSelect.tsx` -- pure single-select toggle-button control -- UX-DR6 single-select, ≥44px, selected state, keyboard.
- [x] `src/features/estimate-form/resolve-type-step.ts` -- pure query-envelope → view-state mapper -- isolates loading/error/empty/ready for node testing (UX-DR16).
- [x] `src/features/estimate-form/Step1RenovationType.tsx` -- container binding config + rhf controller, rendering all view states -- FR-10/FR-11/FR-12, AD-6.
- [x] `src/features/estimate-form/EstimateStepper.tsx` -- mount `Step1RenovationType` in the `type` body -- replace placeholder.
- [x] `src/features/estimate-form/index.ts` -- barrel exports.
- [x] `RenovationTypeSelect.test.tsx`, `resolve-type-step.test.ts`, `Step1RenovationType.test.tsx` -- cover the I/O matrix (selection, switch, re-activate no-deselect, loading/error/empty).

**Acceptance Criteria:**
- Given Step 1 is active, when a renovation type is chosen, then it is required before proceeding — the choice is stored in the form's `renovationTypeId` and cannot be cleared to empty by re-activating it (FR-10).
- Given the type buttons render, when displayed, then each shows a clear unselected vs `primary-active` selected state, is ≥44px, and toggles with Enter/Space (FR-12, UX-DR6).
- Given a renovation type is chosen, when Step 2 later reads the aggregate, then the stored `renovationTypeId` is the key that determines the Step 2 option set (FR-11) — verified here by the value landing in the shared flow aggregate.
- Given the config request is loading or fails, when Step 1 renders, then an accessible loading / error treatment shows instead of buttons, with no crash (UX-DR16, non-throwing envelope).

## Spec Change Log

## Review Triage Log

Two adversarial reviewers ran in parallel (Blind Hunter — general adversarial; Edge Case Hunter — branch/boundary). Orchestrator set final severity and disposition.

| # | Reviewer(s) | Finding | Final severity | Disposition | Rationale |
|---|-------------|---------|----------------|-------------|-----------|
| A | Blind #2 + Edge #2 | `resolveTypeStep` checked `data === undefined` before `isError`, so a thrown/rejected query (`data` undefined, `isError` true) resolved to a perpetual loading spinner instead of the error treatment; the test even codified the wrong behaviour | medium | **patch** | Reordered: `isError` is now checked first; test corrected to assert `error`. `apiFetch` is non-throwing so reachability is low, but the defense is now real. |
| B | Blind #1 | The FR-10 deselect-suppression (the story's central AC) lived inline in JSX and had ZERO test coverage — node-only tests can't fire `onChange` | high | **patch** | Extracted a pure `nextSelection(current, next)` helper (`single-select.ts`), unit-tested exhaustively (choose-from-null / switch / re-activate-no-deselect), and wired the component through it. FR-10 is now locked down. |
| C | Edge #1 | Phantom selection: if a config refetch returns a taxonomy WITHOUT the chosen `renovationTypeId`, no button renders pressed yet `isStepComplete` still reports the step complete and Step 2 would filter by a stale id | high | **defer** | Not reachable in the spike: the stub serves a single immutable `configVersion`, and a refetch returns identical data (no taxonomy change). Reconciling a stale selection against a changed config version is config-invalidation policy owned by Epic 4 (AD-6: changing renovationType invalidates prior EstimateResult). Flagged in `deferred-work.md`. |
| D | Blind #3 | Empty-state treatment lacked the explicit accessible role that loading (`role=status`) and error (`Alert role=alert`) have (UX-DR16 parity) | low | **patch** | Added `role="status"` to the empty-state message. Defensive-only branch (schema enforces `renovationTypes.min(1)`). |
| E | Edge #4 | `RenovationTypeSelect` given a `value` not present in `types` shows nothing pressed with no indication | low | **defer (folded into C)** | Presentational face of the phantom-selection case; addressed when C's reconciliation lands. |
| F | Edge #5, #6 | `RenovationTypeSelect` empty `types` / duplicate ids | low | **reject** | Guarded upstream: `resolveTypeStep` maps empty types → `empty` (buttons never render); `formConfigSchema.superRefine` enforces id uniqueness. The component is never fed these through the real seam. |

Patches added coverage: `single-select.test.ts` (3 FR-10 cases), corrected `resolve-type-step.test.ts` error-ordering case. All four gates green post-patch (203 tests).

## Auto Run Result

- **Story:** 3.3 — Step 1 renovation-type selection
- **Outcome:** ✅ complete
- **Gates:** typecheck ✅ · lint ✅ · test ✅ (203 passed / 37 files) · build ✅
- **Layer purity:** clean (domain/adapters import no react/@mui — only JSDoc mentions)
- **no-adhoc-hex:** pass (selected fill uses `tokens.colors.primaryActive`/`onPrimary`, target `tokens.minTarget`)
- **New dependency:** none
- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel). 6 finding-groups → 3 patched (isError ordering, FR-10 pure-helper extraction+tests, empty-state role), 2 deferred (phantom-selection reconciliation on config-version change — Epic 4/AD-6), 1 rejected (schema/resolveTypeStep guard upstream). No blockers.
- **Deferred:** phantom-selection reconciliation when a refetched config drops the chosen type (`deferred-work.md`); manual a11y keyboard/focus check (node-only test policy).

## Design Notes

Single-select via MUI `ToggleButtonGroup exclusive`: its `onChange(_, next)` yields `null` when the active button is re-clicked — suppress that (`if (next !== null) onSelect(next)`) to honour FR-10's required-selection (no deselect). `ToggleButton` renders a real `<button>` and carries selected semantics + focus ring; enforce `minHeight: 44, minWidth: 44` via `sx`. Selected fill uses the theme palette (`primary.main`/`primary` selected styles), never a hex.

The container keeps NO local selection copy: `useController({ name: 'renovationTypeId', control })` provides `field.value`/`field.onChange`, so the react-hook-form aggregate remains the single owner (AD-6) and Story 2.5's address-change `reset()` clears the Step 1 choice for free.

`resolveTypeStep` exists so the four view states are unit-tested without a live query (SSR can't resolve TanStack Query): `{ data: undefined }`/pending → `loading`; `data.ok === false` → `error`; `data.ok === true && types.length === 0` → `empty`; else → `ready` with `types`.

## Verification

**Commands:**
- `npm run typecheck` -- expected: exit 0
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: exit 0, new tests pass, no regressions, `no-adhoc-hex` green
- `npm run build` -- expected: exit 0

**Manual checks:**
- Keyboard: Tab to the type group, arrow/Enter/Space select a type, focus ring visible, targets ≥44px (documented manual a11y check, per the node-only test policy).
