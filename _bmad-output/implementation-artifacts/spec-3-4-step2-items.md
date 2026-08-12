---
title: 'Story 3.4 — Step 2: Config-driven multi-select items'
type: 'feature'
created: '2026-08-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '04c1c48681cf5260b00e9ec0f68b662224e8815b'
final_revision: '146c875ee6489f1008dc3c017ee375e56ae21093'
context:
  - '_bmad-output/implementation-artifacts/epic-3-context.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** Step 2 needs to let a homeowner multi-select the specific items they are renovating, from an option set served by ConfigSource and driven by the Step 1 renovation type (FR-11/FR-13). Today the `items` accordion body is an inert `'Coming in Story 3.4'` placeholder; nothing reads `renovationTypeId`, nothing writes `selectedItemIds`, and a Step-1 type change would strand cross-type selections.

**Approach:** Add a pure `filterItemsForType` (items whose `typeId` matches the chosen type) and `pruneSelection` (drop selected ids no longer available), a pure `resolveItemsStep` mapper (no-type / loading / error / empty / ready view states), a pure multi-select transition helper, a hook-free `ItemMultiSelect` presentational control (non-exclusive toggle buttons, ≥44px, `primary-active` selected), and a `Step2Items` container that reads the bundle via `useFormConfig()`, watches `renovationTypeId`, binds `selectedItemIds` via `useController`, prunes stale cross-type selections when the type changes, and renders the view states (UX-DR16). Minimum ≥1 item is required (reflected in `isStepComplete('items')`, Story 3.2). Wire it into the stepper `items` body. OI-1 (exact item content) stays `[OPEN]` — build generically against config.

## Boundaries & Constraints

**Always:**
- The Step 2 option set is exactly the config `items` whose `typeId === renovationTypeId` (FR-11/FR-13) — a config-driven filter, never a code branch over hardcoded labels (AD-8/AD-11).
- Multi-select semantics (UX-DR6 multi-select): any subset may be toggled independently; ≥1 required to be complete (FR-14, reflected via `isStepComplete('items')`). Buttons: unselected vs `primary-active` selected, ≥44px, Enter/Space toggle, keyboard-operable, programmatic selected state (`aria-pressed`) (FR-12/UX-DR6/UX-DR20).
- `selectedItemIds` in the react-hook-form aggregate is the SINGLE source of truth (AD-6) via `useController`; no second copy in component state.
- When `renovationTypeId` changes, any selected ids not in the new type's item set are pruned (FR-11) — a stale cross-type selection must never survive a type change. Pruning is a PURE function; the effect that applies it is the only imperative glue.
- No renovation type chosen yet → an explicit "choose a renovation type first" treatment (Step 2 has no options without Step 1). Config-loading / error / empty (type chosen but no items) each render an explicit accessible treatment (UX-DR16). `apiFetch` is non-throwing: failure surfaces as `data.ok === false`, and the mapper checks `isError` before pending.
- Node-only tests (no jsdom/RTL): every decision (filter, prune, view-state, multi-select toggle) extracted to a pure function unit-tested exhaustively; presentational control asserted via `renderToStaticMarkup`.

**Block If:**
- The final Step 2 item taxonomy is disputed by product — OI-1 is `[OPEN]`; build against whatever config `items` are served (Internal→kitchen/bathroom/flooring, External→roofing/painting/landscaping in the stub). (Not expected to trigger.)

**Never:**
- No Step 3 fields (the `details` body stays a placeholder). No proceed/advance gating (deferred to Story 3.5 / Epic 4) — completion state already drives the summary indicator from Story 3.2.
- No new dependency. No jsdom/RTL. No ad-hoc hex (tokens / MUI props only).
- Do NOT change the ConfigSource seam, schema, or stub content. Do NOT alter Step 1, the stepper one-expanded invariant, or address behaviour.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No type chosen | `renovationTypeId === null` | "Choose a renovation type first" treatment; no item buttons | No error expected |
| Loading | query pending | Config-loading treatment (busy) | No error expected |
| Service failure | `data.ok === false` or `isError` | Accessible error treatment; no buttons; no crash | Read envelope error; no throw |
| Ready, none chosen | type chosen, items exist, `selectedItemIds === []` | One button per matching item, none selected; Step 2 incomplete | No error expected |
| Toggle item on/off | click/Enter/Space an item | id added/removed in `selectedItemIds`; ≥1 selected ⇒ complete | No error expected |
| Type has no items | type chosen but no config items match | Empty treatment ("no items for this type"); no crash | No error expected |
| Type changed w/ stale selection | `selectedItemIds` had ids from the old type | stale ids pruned; only ids valid for the new type remain | No error expected |

</intent-contract>

## Code Map

- `src/features/estimate-form/item-selection.ts` -- NEW. Pure: `filterItemsForType(items, typeId): RenovationItem[]`, `pruneSelection(selectedIds, availableItems): string[]`, `toggleItem(selectedIds, id): string[]` (add if absent, remove if present). No react.
- `src/features/estimate-form/item-selection.test.ts` -- NEW. Node-only: filter by typeId (incl. null → []), prune (drop absent, keep present, order stable), toggle add/remove/idempotent-shape.
- `src/features/estimate-form/resolve-items-step.ts` -- NEW. Pure mapper `resolveItemsStep(query, typeId): ItemsStepView` (`no-type` | `loading` | `error` | `empty` | `ready` + items). `isError` before pending; `typeId === null` → `no-type`; matched items empty → `empty`.
- `src/features/estimate-form/resolve-items-step.test.ts` -- NEW. Node-only: all branches incl. no-type-before-loading precedence sanity, error precedence.
- `src/features/estimate-form/ItemMultiSelect.tsx` -- NEW. Pure, hook-free. Props `{ items, selectedIds, onToggle, groupLabel }`. Non-exclusive MUI `ToggleButtonGroup` (`value={selectedIds}`), `ToggleButton`s (≥44px, `primaryActive` selected), `onChange` diffs to a single toggled id → `onToggle(id)`.
- `src/features/estimate-form/ItemMultiSelect.test.tsx` -- NEW. Node-only structural: one button per item, labels, selected ids reflect `aria-pressed="true"`, group `aria-label`.
- `src/features/estimate-form/Step2Items.tsx` -- NEW. `'use client'`. `useFormConfig()` + `useWatch({name:'renovationTypeId'})` + `useController({name:'selectedItemIds'})`; `resolveItemsStep`; a `useEffect` prunes `selectedItemIds` via `pruneSelection` when the available set changes (FR-11); renders view states + `ItemMultiSelect`.
- `src/features/estimate-form/Step2Items.test.tsx` -- NEW. Node-only structural: with `renovationTypeId: null`, asserts the "choose a type first" treatment renders (SSR query pending is masked by the no-type branch taking precedence).
- `src/features/estimate-form/EstimateStepper.tsx` -- EDIT. Mount `<Step2Items />` in the `items` body (mirror the `type` wiring). `details` keeps placeholder.
- `src/features/estimate-form/index.ts` -- EDIT. Export the new pure helpers + components.

## Tasks & Acceptance

**Execution:**
- [x] `src/features/estimate-form/item-selection.ts` -- pure filter/prune/toggle helpers -- FR-11/FR-13/FR-14, multi-select.
- [x] `src/features/estimate-form/resolve-items-step.ts` -- pure query+type → view-state mapper -- UX-DR16, non-throwing envelope.
- [x] `src/features/estimate-form/ItemMultiSelect.tsx` -- pure multi-select toggle-button control -- UX-DR6 multi-select, ≥44px, keyboard.
- [x] `src/features/estimate-form/Step2Items.tsx` -- container: config + type watch + controller + prune effect + view states -- FR-11/FR-13/FR-14, AD-6.
- [x] `src/features/estimate-form/EstimateStepper.tsx` -- mount `Step2Items` in the `items` body.
- [x] `src/features/estimate-form/index.ts` -- barrel exports.
- [x] `item-selection.test.ts`, `resolve-items-step.test.ts`, `ItemMultiSelect.test.tsx`, `Step2Items.test.tsx` -- cover the I/O matrix.

**Acceptance Criteria:**
- Given Step 2 is active with a chosen type, when items render, then the set is the config items served for that Step 1 type (FR-11/FR-13).
- Given items render, when I toggle them, then selection is multi-select with ≥1 required to be complete, and buttons follow the UX-DR6 multi-select toggle spec (≥44px, Enter/Space, selected state) (FR-14, FR-12).
- Given I change the Step 1 type, when Step 2 re-renders, then selections that are not valid for the new type are pruned (FR-11) — no stale cross-type items remain.
- Given no type is chosen, or config is loading/failed/empty, when Step 2 renders, then the corresponding accessible treatment shows instead of buttons, with no crash (UX-DR16).
- Given the exact Step 2 item content, then it is `[OPEN]` (OI-1) — implemented generically against config, flagged in `deferred-work.md`.

## Spec Change Log

## Review Triage Log

Two adversarial reviewers ran in parallel (Blind Hunter — general adversarial; Edge Case Hunter — branch/boundary). Orchestrator set final severity and disposition. Both independently surfaced the same HIGH prune-effect defect.

| # | Reviewer(s) | Finding | Final severity | Disposition | Rationale |
|---|-------------|---------|----------------|-------------|-----------|
| 1 | Blind #1 + Edge #1/#2 | Prune `useEffect` wiped a valid selection on any `ready → error`/loading transient: `availableItems` was `[]` in EVERY non-ready state, so a background refetch returning a failure envelope (reachable — 60s staleTime, non-throwing `apiFetch`) collapsed `availableKey` to `''` and pruned the selection to `[]` permanently | high | **patch** | The effect now prunes ONLY when the option set is genuinely KNOWN (`ready` or `empty`); `loading`/`error`/`no-type` hold the effect off (keyed to `null`). A transient error no longer destroys the selection. |
| 2 | Blind #3 + Edge #5 | `availableKey = ids.join('|')` was collision-prone (ids containing `|`, same-id-set ambiguity) | low | **patch** | Folded into #1: key is now `JSON.stringify(ids)` (or `null` when unresolved). |
| 3 | Edge #3 + Blind #4 | `ItemMultiSelect` `onChange` derived the toggled id inline and applied only the first differing id on a bulk change; untested (SSR structural tests never fire `onChange`) | medium | **patch** | Extracted pure `deriveToggledId(before, next)` + unit-tested (add / remove / clear-last / no-op / bulk-first-added). MUI only ever emits a single toggle, but the logic is now locked down node-only. |
| 4 | Edge #6 | Empty-string `renovationTypeId` wasn't treated as "no type" (would show "empty" instead of "choose a type first") | low | **patch** | `filterItemsForType` and `resolveItemsStep` now treat any falsy typeId as no-type; test added. |
| 5 | Edge #4 | Duplicate item ids → React key clash / shared value | low | **reject** | `formConfigSchema.superRefine` enforces item-id uniqueness at the seam; unreachable through the real config. |
| 6 | Edge #7 | `data.data.items` assumed to be an array | low | **reject** | `apiFetch` validates against `formConfigSchema` (which requires an `items` array) before returning `ok: true`; `.filter` can't hit `undefined`. |
| 7 | Edge #8 | `pruneSelection` doesn't dedupe duplicate selected ids | low | **reject** | `toggleItem` only adds an id when absent, so `selectedItemIds` never accrues duplicates; seeding is internal. |
| 8 | Blind #2 / Edge #9 | `isError` discards good cached data; completion indicator flickers | medium/low | **resolved by #1** | The prune gating neutralizes the data-loss; surfacing stale items under an error banner is a UX enhancement out of spike scope. |

Patches added coverage: `deriveToggledId` (5 cases), empty-string typeId filter case. All four gates green post-patch (229 tests).

## Auto Run Result

- **Story:** 3.4 — Step 2 config-driven multi-select items
- **Outcome:** ✅ complete
- **Gates:** typecheck ✅ · lint ✅ · test ✅ (229 passed / 41 files) · build ✅
- **Layer purity:** clean · **no-adhoc-hex:** pass (tokens only) · **new dependency:** none
- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel). 8 finding-groups → 4 patched (prune-effect gating [HIGH, both], JSON.stringify key, extracted+tested `deriveToggledId`, falsy-typeId no-type), 3 rejected (schema/invariant guards upstream), 1 resolved-by-gating. No blockers.
- **Deferred:** OI-1 (exact Step 2 item content) — `[OPEN]`, built generically against config (`deferred-work.md`); manual a11y/behaviour check for keyboard toggle + type-change prune (node-only test policy).

## Design Notes

Multi-select via non-exclusive `ToggleButtonGroup value={selectedIds}`: its `onChange(_, nextArray)` yields the full next array. To keep a single pure transition, diff is unnecessary — but to reuse `toggleItem` (and keep the aggregate authoritative), the control computes the symmetric difference of one id. Simpler and robust: derive the toggled id by comparing `nextArray` to `selectedIds` (exactly one differs) and call `onToggle(thatId)`; the container applies `toggleItem`. Equivalent: pass `nextArray` straight through. Chosen approach: `onChange` passes the toggled id to `onToggle`, container does `field.onChange(toggleItem(field.value, id))` — one code path, fully unit-tested.

Pruning: a `useEffect` recomputes `pruneSelection(field.value, availableItems)` whenever the available id set changes; if it differs from `field.value`, it writes back via `field.onChange`. Pure `pruneSelection` is exhaustively tested; the effect is the thin imperative glue (documented manual check). This directly satisfies FR-11 (Step 1 drives Step 2) and closes the cross-type-stale gap.

`no-type` precedence: `resolveItemsStep` returns `no-type` when `typeId === null` regardless of query state, so SSR (pending query) with the default `renovationTypeId: null` deterministically renders the "choose a type first" prompt — node-testable without a live query.

## Verification

**Commands:**
- `npm run typecheck` -- expected: exit 0
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: exit 0, new tests pass, no regressions, `no-adhoc-hex` green
- `npm run build` -- expected: exit 0

**Manual checks:**
- Keyboard: Tab to the item group, Enter/Space toggles items independently, focus ring visible, ≥44px targets. Change the Step 1 type and confirm stale selections clear (documented manual a11y/behaviour check, per the node-only test policy).
