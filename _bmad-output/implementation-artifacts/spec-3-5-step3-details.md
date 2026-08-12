---
title: 'Story 3.5 — Step 3: Dynamic property details with validation'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'd8a76a5391b6ed5f105369a183ef47205f0dbec8'
final_revision: '760188e8774e2f5c39f5fc3772bc692914254892'
context:
  - '_bmad-output/implementation-artifacts/epic-3-context.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** Step 3 must render property-detail questions tailored to the Step 2 selections, using a dynamic field renderer over all 7 config field kinds (radio, select, text, numeric, date, slider, budget min/max pair), each independently validated and accessibly labelled, writing answers into the flow aggregate's `propertyDetails`. Today the `details` accordion body is an inert `'Coming in Story 3.5'` placeholder.

**Approach:** Add pure helpers — `filterQuestions` (questions whose `appliesToItemIds` is absent or intersects the selected items — FR-16), `validateAnswer(question, value)` (generic OI-2 rules per kind), and `resolveDetailsStep` (no-items / loading / error / empty / ready view states) — plus a `DynamicField` renderer that switches on `question.kind` and binds each field to `propertyDetails.<id>` via react-hook-form `Controller` with per-field validation, programmatic labels, and `aria-describedby`-linked error text (FR-17, UX-DR15/16/20). A `Step3Details` container reads config via `useFormConfig()`, watches `selectedItemIds`, filters questions, and renders the view states. Wire into the stepper `details` body. OI-2 (exact validation rules) stays `[OPEN]` — implement generic required/bounds validation against the config metadata.

## Boundaries & Constraints

**Always:**
- The Step 3 question set is the config `questions` filtered by `selectedItemIds` (FR-16): a question shows when its `appliesToItemIds` is absent (always shown) OR intersects the selected item ids. Config-driven, never a hardcoded field list (AD-8/AD-11).
- The renderer supports ALL 7 kinds exhaustively (radio, select, text, numeric, date, slider, budget) via a `kind` switch that is type-exhaustive over the discriminated union (a `never` default) so a new kind fails to compile rather than silently no-render (UX-DR8).
- Each answer is the single source of truth in the flow aggregate under `propertyDetails.<question.id>` via `Controller` (AD-6). Answer value types: radio/select/text → `string`; numeric/slider → `number`; date → ISO `string`; budget → `{ min: number; max: number }`.
- Each field is programmatically labelled and, on error, its message is linked via `aria-describedby`; the error treatment is text-not-colour (reuse `FormTextField`/UX-DR15 for text-like inputs; equivalent labelled error text for radio/select/slider/budget) (FR-17, UX-DR16, UX-DR20).
- Validation is per-field and independent (FR-17): `required` fields must have a non-empty answer; numeric/slider/budget must respect `min`/`max`; text respects `maxLength`; date respects `minIso`/`maxIso`; budget requires `min <= max` and both within bounds. Validation logic is a PURE function unit-tested exhaustively (OI-2 generic — the exact rules are `[OPEN]`).
- No-items (Step 2 has no selection yet), config-loading, error, and empty (items chosen but no matching questions) each render an explicit accessible treatment (UX-DR16 form slice). `apiFetch` is non-throwing (`data.ok === false`); mapper checks `isError` before pending.
- Node-only tests (no jsdom/RTL): every decision (filter, validate, view-state, exhaustive kind switch) extracted to pure functions and unit-tested; fields rendered via `renderToStaticMarkup` for structural/label/aria assertions. Reuse the `envelopeResponse`/`global.fetch` stub pattern only if a hook needs it.

**Block If:**
- The exact per-field validation rules or error copy are disputed — OI-2 is `[OPEN]`; implement the generic required/bounds rules from config metadata and flag. (Not expected to trigger.)

**Never:**
- No estimate submit / results (Epic 4). The AC's "form-level submit issue uses the Toast" is deferred to the Epic 4 submit action — Step 3 implements PER-FIELD validation display now; note the form-level-submit toast as deferred.
- No new dependency (no date-picker lib — use a native `type="date"` input via MUI `TextField`; no `@mui/x`). No jsdom/RTL. No ad-hoc hex.
- Do NOT change the ConfigSource seam, schema, or stub content. Do NOT alter Steps 1–2, the stepper one-expanded invariant, or address behaviour.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No items chosen | `selectedItemIds === []` | "Select what you're renovating first" treatment; no fields | No error expected |
| Loading | query pending, items chosen | Config-loading treatment (busy) | No error expected |
| Service failure | `data.ok === false` / `isError` | Accessible error treatment; no fields; no crash | Read envelope; no throw |
| Ready | items chosen, questions match | One field per filtered question, each labelled; kind-appropriate control | No error expected |
| No matching questions | items chosen but no question applies | Empty treatment; no crash | No error expected |
| Answer a field | edit a control | value written to `propertyDetails.<id>` (kind-typed) | No error expected |
| Required empty | required field left blank, validated | field-level error message, `aria-describedby`-linked, text-not-colour | Field marked invalid |
| Out of bounds | numeric/slider/budget outside min/max, or budget min>max, or text over maxLength, or date outside minIso/maxIso | field-level error message | Field marked invalid |

</intent-contract>

## Code Map

- `src/features/estimate-form/question-selection.ts` -- NEW. Pure `filterQuestions(questions, selectedItemIds): PropertyQuestion[]` (absent `appliesToItemIds` ⇒ always; else intersect). No react.
- `src/features/estimate-form/validate-answer.ts` -- NEW. Pure `validateAnswer(question, value): string | null` — exhaustive `kind` switch (`never` default), generic required/bounds/maxLength/date/budget rules (OI-2). Returns an error message or `null`. No react.
- `src/features/estimate-form/resolve-details-step.ts` -- NEW. Pure mapper `resolveDetailsStep(query, selectedItemIds): DetailsStepView` (`no-items` | `loading` | `error` | `empty` | `ready` + questions). `no-items` when selection empty (precedence); `isError` before pending; filtered-questions empty ⇒ `empty`.
- `src/features/estimate-form/DynamicField.tsx` -- NEW. `'use client'`. Given a `PropertyQuestion` + rhf `control`, renders a `Controller` bound to `propertyDetails.<id>` with `rules.validate = (v) => validateAnswer(q, v) ?? true`, the kind-appropriate MUI control (radio→`RadioGroup`, select→`Select`+`InputLabel`, text→`FormTextField`, numeric→`FormTextField type=number`, date→`FormTextField type=date`, slider→`Slider`+label+value, budget→two numeric `FormTextField`s min/max), a programmatic label, and error text linked via `aria-describedby`. Exhaustive `never` default.
- `src/features/estimate-form/Step3Details.tsx` -- NEW. `'use client'`. `useFormConfig()` + `useWatch({name:'selectedItemIds'})` + `useFormContext` control; `resolveDetailsStep`; renders view states; on `ready` maps filtered questions → `<DynamicField>`.
- `src/features/estimate-form/EstimateStepper.tsx` -- EDIT. Mount `<Step3Details />` in the `details` body (drop the placeholder; the `STEP_PLACEHOLDER` map can be removed once all 3 bodies are real).
- `src/features/estimate-form/index.ts` -- EDIT. Export the new pure helpers + components.
- Tests (NEW, node-only): `question-selection.test.ts`, `validate-answer.test.ts` (all 7 kinds × required/bounds/valid), `resolve-details-step.test.ts`, `DynamicField.test.tsx` (each kind renders its control + label + aria wiring; a seeded invalid value shows linked error text via a small harness), `Step3Details.test.tsx` (no-items prompt with default empty selection).

## Tasks & Acceptance

**Execution:**
- [x] `src/features/estimate-form/question-selection.ts` -- pure question filter by selected items -- FR-16.
- [x] `src/features/estimate-form/validate-answer.ts` -- pure exhaustive per-kind validator -- FR-17, OI-2 generic.
- [x] `src/features/estimate-form/resolve-details-step.ts` -- pure view-state mapper -- UX-DR16.
- [x] `src/features/estimate-form/DynamicField.tsx` -- dynamic 7-kind field renderer with Controller + validation + a11y -- UX-DR8, FR-17, UX-DR15/16/20.
- [x] `src/features/estimate-form/Step3Details.tsx` -- container: config + items watch + filter + view states -- FR-16, AD-6.
- [x] `src/features/estimate-form/EstimateStepper.tsx` -- mount `Step3Details` in the `details` body.
- [x] `src/features/estimate-form/index.ts` -- barrel exports.
- [x] Test files -- cover the I/O matrix (filter, validate all kinds, view states, per-field render + error wiring).

**Acceptance Criteria:**
- Given Step 3 is active, when questions render, then the dynamic renderer supports radio/text/numeric/date/slider/select/budget min-max, and the field set changes with the Step 2 selections (FR-16, UX-DR8).
- Given a field renders, then it is labelled and its error message is `aria-describedby`-linked and independently validated (FR-17, UX-DR20).
- Given a validation error, then it uses the input-error treatment (text-not-colour) with helpful copy (UX-DR16, UX-DR17). The form-level submit toast is deferred to the Epic 4 submit action.
- Given empty/in-progress, validation-error, and config-loading states, then each renders per UX-DR16 (form slice).
- Given the exact Step 3 validation rules, then they are `[OPEN]` (OI-2) — implemented generically from config metadata, flagged in `deferred-work.md`.

## Spec Change Log

## Review Triage Log

## Auto Run Result

## Design Notes

`validateAnswer` is the crux: one pure function, `switch (question.kind)` with a `const _exhaustive: never = question` default, returning a human message or `null`. Generic rules (OI-2): `required` + empty (`''`/`undefined`/`null`, or budget with missing min/max) → "This field is required."; numeric/slider/budget below `min`/above `max` → bounds message; budget `min > max` → "Minimum must be at most the maximum."; text over `maxLength`; date before `minIso`/after `maxIso`. Wire into rhf via `Controller rules={{ validate: (v) => validateAnswer(q, v) ?? true }}` so react-hook-form owns error state; render `fieldState.error?.message` in the linked error node.

`DynamicField` keeps each control's error text in an element whose `id` is `${question.id}-error`, and sets `aria-describedby` to it when invalid. Reuse `FormTextField` (UX-DR15) for text/numeric/date/budget inputs so the colour-plus-text invariant holds; for radio/select/slider render an explicit labelled error `Typography role="alert"` linked by `aria-describedby`.

MUI note: `RadioGroup`, `Slider`, and `Select` (base) render inline (SSR-visible); `Select`'s dropdown menu is a portal but the collapsed control + hidden input render, so structural label/aria assertions work under `renderToStaticMarkup`. Prefer a native `type="date"` input (no date-picker dependency).

`no-items` precedence makes SSR deterministic (default `selectedItemIds: []` → the "select items first" prompt) so `Step3Details` is node-testable without a live query.

## Verification

**Commands:**
- `npm run typecheck` -- expected: exit 0
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: exit 0, new tests pass, no regressions, `no-adhoc-hex` green
- `npm run build` -- expected: exit 0

**Manual checks:**
- Keyboard/SR: Tab through each field type, labels announced, invalid fields announce their linked error, focus ring visible, ≥44px targets (documented manual a11y check, per the node-only test policy).

## Review Triage Log

Two adversarial reviewers (Blind Hunter + Edge Case Hunter) ran in parallel against the diff since `d8a76a5`. Orchestrator set final severity.

| # | Finding | Severity | Disposition |
|---|---------|----------|-------------|
| 1 | `aria-describedby` on text/numeric/date FormTextField pointed at a non-existent `${id}-error` node AND clobbered MUI's native `-helper-text` wiring → SRs announced no error for 3 of 7 kinds (BH#1, confirmed empirically) | HIGH | **patch** — removed manual `aria-describedby` from FormTextField branches; MUI wires helperText natively. Kept manual wiring only where `errorNode` renders (radio/select/slider/budget). |
| 2 | Budget partial fill `{min:n, max:undefined}` passed optional validation and leaked a half-object violating domain `{min:number;max:number}` (BH#3/EH#4); budget inputs hardcoded `error={false}` (BH#4) | MED | **patch** — `validateAnswer` rejects exactly-one-side budgets with "Enter both a minimum and a maximum." regardless of required; budget inputs now `error={invalid}` + aria-describedby→real `errorNode`. |
| 3 | Slider showed `question.min` while storing `undefined` (phantom answer; required slider unsatisfiable at min) (BH#2/EH#6) | MED | **patch** — Controller `defaultValue` seeds slider to `min` (write-through: displayed==stored). Other kinds keep `undefined`. |
| 4 | Whitespace-only string satisfied required text/radio/select (EH#1); radio/select accepted values not in `options` (EH#2); malformed date accepted when no bounds (EH#3) | MED | **patch** — `isEmpty` trims strings; option-membership check → "Choose a valid option."; date ISO-format + `Date.parse` guard → "Enter a valid date." |
| 5 | Select rendered out-of-range stored value → MUI warning + blank (EH#7) | LOW | **patch** — coerce unknown select value to `''` for display. |
| 6 | Test-honesty: `DynamicField.test.tsx` had zero error-path cases (why #1 shipped); `Step3Details.test.tsx` covered only `no-items` (BH#5/BH#6) | MED | **patch** — added error-path suite (aria-describedby resolves to a real node containing the message per kind), whitespace/option/date/budget-partial validateAnswer cases, and Step3Details `ready`+`error` component states. |
| 7 | `step` alignment never validated for numeric/slider/budget (EH#5) | LOW | **defer** — OI-2 final rules marked [OPEN]; step-alignment intentionally out of scope for this story. |
| 8 | Stale answers for now-hidden questions persist into `propertyDetails` (EH#8/BH via Step3Details docstring) | MED | **defer** — pruning belongs to the Epic 4 submission path; no submit in this story. |
| — | `resolveDetailsStep` precedence, `filterQuestions` FR-16, `validateAnswer` numeric/date/budget boundaries, exhaustive `never` defaults, no Step 1–2/stepper regression | — | **verified correct by both reviewers** (prior-story isError-before-pending defect class NOT reproduced). |

## Auto Run Result

- **Outcome:** SUCCESS
- **Story:** 3.5 — Step 3 dynamic property-details field renderer + validation
- **Baseline:** `d8a76a5`
- **Implementation:** SYNC subagent — 5 source files (`question-selection.ts`, `validate-answer.ts`, `resolve-details-step.ts`, `DynamicField.tsx`, `Step3Details.tsx`) + 5 node-only test files; wired `<Step3Details/>` into `EstimateStepper` `details` body (removed unused `STEP_PLACEHOLDER`); barrel exports added.
- **Review:** Blind Hunter + Edge Case Hunter (parallel). 8 distinct finding-groups → 6 patched, 2 deferred (OI-2 step-alignment, stale-answer pruning → Epic 4). 0 rejected.
- **Gates (post-patch):** typecheck ✅ · lint ✅ · test ✅ **293 passed (46 files)** · build ✅. Layer-purity grep clean (JSDoc only); no-adhoc-hex ✅; Steps 1–2 + address regressions ✅.
- **New dependencies:** none (native `type="date"`; no `@mui/x`).
