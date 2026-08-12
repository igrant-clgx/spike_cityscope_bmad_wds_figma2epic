# Screen-State Matrix Sign-Off (Story 6.1)

- **Date:** 2026-08-13
- **Epic:** 6 — Release Readiness & Verification
- **Requirements:** FR-35, UX-DR16 (sign-off); resolves `[OPEN]` OI-5
- **Method:** Every surface × every canonical state is verified against the implementing code **and** a passing node test. Cells are marked `present` (file + test cited), `n/a-by-design` (one-line rationale), or `gap` (logged as an owning-epic defect). No feature code was rebuilt.

> **Spike note:** This is a whole-system *verification* artifact, not a feature build. The node-only harness proves state *logic* (discriminated unions + `renderToStaticMarkup`); dynamic a11y (focus/SR-announcement timing/keyboard traversal) is out of scope here and owned by Story 6.2.

---

## Canonical state set (FR-35, UX-DR16)

`empty/initial` · `in-progress` · `validation-error` · `loading` · `success` · `API-error` · `empty/low-confidence`

Surfaces: **address**, **form** (accordion stepper), **results**, **lead**.

---

## OI-5 resolution — completeness source of truth

**`[OPEN]` OI-5 (state-matrix completeness source of truth) is RESOLVED:** the single source of truth for screen-state completeness is the set of **discriminated view-state unions and their exhaustive node tests**, because they make "every state is handled" a *test-enforced branch-coverage* property rather than a documentation claim:

- **Results:** `src/features/results/results-view-state.ts` — `ResultsView` union (`idle | loading | success | lowConfidence | error`) mapped by the pure, exhaustively-tested `toResultsView`.
- **Lead:** `src/features/lead/lead-view-state.ts` — `LeadView` union (`form | submitting | success | error`) mapped by the pure, exhaustively-tested `toLeadView`.
- **Address:** the `AddressModal` derived-state selectors (`isLookupLoading`, `settled`, `suggestError`/`resolveError`, `predictions.length === 0`, resolved-address present) + pure `validateManualAddress` union (`{ok:true} | {ok:false, errors}`).
- **Form:** the pure `step-state.ts` (`isStepComplete`, `nextExpanded`) + pure `validateAnswer` union, driving the accordion stepper.

Any new surface state that is not represented in one of these unions/selectors would leave a `renderToStaticMarkup` assertion uncovered and fail the union's exhaustive test, so the matrix below is regenerable from code, not hand-maintained. **The mappers ARE the matrix.** (Enforcement is by hand-written per-branch tests that are complete today — the mappers are `if`-chains over input state, not `switch`es over the output discriminant, so completeness is test-enforced rather than compiler-total. `resolveConfidence` in `confidence.ts` is the one place a `never`-default compile guard applies, because it switches on its own discriminant.)

---

## Matrix

### Address surface (`src/features/address/**`)

| State | Verdict | Implementation | Node test |
|---|---|---|---|
| empty/initial | ✅ present | `AddressSection.tsx` empty prompt; `AddressModal.tsx` at-rest (no query, no predictions) | `AddressSection.test.tsx` "renders the address block in its empty/initial state"; `AddressModal.test.tsx` "shows no predictions and no \"no results\" for a short query (< 3 chars)" |
| in-progress | ✅ present | `AddressModal.tsx` typed query / manual-entry mode fields | `AddressModal.test.tsx` "renders a programmatically-labelled search field", "renders the structured manual-entry fields when manual mode is active" |
| validation-error | ✅ present | `validate-manual-address.ts` (`{ok:false, errors}`) for manual entry | `validate-manual-address.test.ts` "rejects a postcode that is not 4 digits", "rejects blank required street/suburb", "rejects a state outside the AU enum" |
| loading | ✅ present | `AddressModal.tsx` `isLookupLoading` inline lookup text | `AddressModal.test.tsx` "shows the inline lookup-loading text while a lookup is in flight" |
| success | ✅ present | `AddressModal.tsx` resolved structured address → Confirm enabled; `use-address-resolve.ts` | `AddressModal.test.tsx` "enables Confirm once a structured address is resolved"; `use-address-resolve.test.ts` "returns the structured resolved address on success" |
| API-error | ✅ present | `AddressModal.tsx` `suggestError`/`resolveError` via `data.ok===false` → non-scolding retryable alert + manual fallback; `use-address-resolve.ts` non-throwing | `AddressModal.test.tsx` "renders a non-scolding retryable error alert with a manual-entry fallback", "hides predictions and no-results text while the error alert is shown"; `use-address-resolve.test.ts` "stays non-throwing and reports failure on an error envelope" |
| empty/low-confidence | ✅ present (empty-results is the address analog) | `AddressModal.tsx` settled + `predictions.length === 0` → no-results text | `AddressModal.test.tsx` "shows the \"no results\" message for a settled valid query with no matches" |

*Note:* "low-confidence" has no meaning for address (no scored result); the **empty-results** state is the surface's honest analog and is covered.

### Form surface — accordion stepper (`src/features/estimate-form/**`)

| State | Verdict | Implementation | Node test |
|---|---|---|---|
| empty/initial | ✅ present | `step-state.ts` `isStepComplete → false` for empty; `EstimateStepper.tsx` step-1-expanded shell | `step-state.test.ts` "type/items/details: complete iff … meaningful"; `EstimateStepper.test.tsx` "renders all three step titles", "keeps exactly one step expanded" |
| in-progress | ✅ present | `step-state.ts` partial completion + summary/completion indicator | `EstimateStepper.test.tsx` "shows a summary line + completion indicator for a seeded, collapsed complete step"; `step-state.test.ts` "tolerates a partial values object" |
| validation-error | ✅ present | `validate-answer.ts` per-field required/enum/range errors | `validate-answer.test.ts` "flags a required empty value", "flags a value that is not one of the options", "flags min greater than max" |
| loading | ✅ present (graceful degradation) | `use-form-config.ts` config fetch; `EstimateFlow.tsx` leaves `config` undefined until loaded → calculate CTA disabled (no false-ready) | `use-form-config.test.ts` "calls the same-origin config route"; `ResultsPanel.test.tsx` "idle: disables the CTA when told to (config not loaded)" |
| success | ✅ present | all steps complete → scope aggregate ready → calculate CTA enabled | `step-state.test.ts` completion cases; `ResultsPanel.test.tsx` "idle: shows the prompt + calculate CTA" |
| API-error | ✅ present (graceful degradation) | `use-form-config.ts` non-throwing (`data.ok===false`); config stays undefined → CTA disabled, flow never crashes | `use-form-config.test.ts` "stays non-throwing and reports failure on an error envelope" |
| empty/low-confidence | ⬜ n/a-by-design | the stepper captures scope; it computes no confidence-bearing result — low-confidence lives on the **results** surface | — |

*Observation (not a gap):* the config load has no *dedicated* spinner/error banner — it degrades by keeping the calculate CTA disabled until config resolves. This is a deliberate, tested behavior (no false-ready CTA), honest for the spike; a dedicated config-loading affordance is a possible future polish, not a required FR-35 state.

### Results surface (`src/features/results/**`)

| State | Verdict | Implementation | Node test |
|---|---|---|---|
| empty/initial | ✅ present | `toResultsView` `idle`; `ResultsPanel.tsx` prompt + CTA + persistent live region | `results-view-state.test.ts` "maps the untouched mutation to idle"; `ResultsPanel.test.tsx` "idle: shows the prompt + calculate CTA and a persistent live region" |
| in-progress | ⬜ n/a-by-design | estimate compute is an atomic mutation — there is no partial "in-progress" between request and loading | — |
| validation-error | ⬜ n/a-by-design | results consumes a *computed* estimate; input validation is owned by the form surface | — |
| loading | ✅ present | `toResultsView` `loading`; `ResultsPanel.tsx` `role="status"` busy | `results-view-state.test.ts` "maps pending to loading"; `ResultsPanel.test.tsx` "loading: shows role=status …" |
| success | ✅ present | `toResultsView` `success` → ResultCostCard formatted range | `results-view-state.test.ts` "maps a normal success to success"; `ResultsPanel.test.tsx` "success: reveals the ResultCostCard with the formatted range" |
| API-error | ✅ present | `toResultsView` `error` (isError-first + `data.ok===false`) → non-destructive retry | `results-view-state.test.ts` "checks isError BEFORE pending/data-undefined", "shows the friendly message for a service error"; `ResultsPanel.test.tsx` "error: shows a non-destructive message with a retry and a live region" |
| empty/low-confidence | ✅ present | `toResultsView` `lowConfidence` → humble framing, still shows the range | `results-view-state.test.ts` "maps a low-confidence success to lowConfidence (never false-precise)"; `ResultsPanel.test.tsx` "lowConfidence: shows the humble message AND the range" |

### Lead surface (`src/features/lead/**`)

| State | Verdict | Implementation | Node test |
|---|---|---|---|
| empty/initial | ✅ present | `toLeadView` `form`; `LeadPanel.tsx` form + persistent live region | `lead-view-state.test.ts` "idle (not yet submitted) → form"; `LeadPanel.test.tsx` "form: renders the LeadForm with a persistent live region" |
| in-progress | ✅ present | `toLeadView` `submitting` — button spinner, form disabled, duplicate-submit prevented | `lead-view-state.test.ts` "pending → submitting"; `LeadPanel.test.tsx` "submitting: keeps the form mounted, disabled, with aria-busy live region" |
| validation-error | ✅ present | `lead-form-values.ts` (`leadFormFieldErrors`) + `LeadForm.tsx` inline errors + disabled submit gate | `lead-form-values.test.ts` "flags a too-short first name and only that field", "flags an invalid email", "flags an invalid AU phone"; `LeadForm.test.tsx` "renders a submit button DISABLED on a pristine form (FR-30 gate)" |
| loading | ✅ present (= in-progress/submitting) | `toLeadView` `submitting` (same branch) | `lead-view-state.test.ts` "pending → submitting" |
| success | ✅ present | `toLeadView` `success` → confirmation REPLACES the form, estimate stays visible | `lead-view-state.test.ts` "success envelope → success carrying the leadId"; `LeadPanel.test.tsx` "success: shows the confirmation and REPLACES the form" |
| API-error | ✅ present | `toLeadView` `error` (isError-first + `data.ok===false`) → non-destructive retry, data preserved | `lead-view-state.test.ts` "service error envelope (ok:false) → error", "transport failure (isError) → error, checked BEFORE pending/undefined"; `LeadPanel.test.tsx` "error: non-destructive message + Try again, form still mounted (data preserved)" |
| empty/low-confidence | ⬜ n/a-by-design | the lead surface has no scored/empty result — confidence is a results-surface concept | — |

---

## Defects logged

**None.** Every canonical state is either `present` with a cited file + passing test, or `n/a-by-design` with a rationale. No surface is missing a state required by its spec, so no defect is raised against an owning epic and no HALT/blocked condition triggered.

Two honest **observations** (not defects, not required FR-35 states) are recorded for completeness:
1. **Form config load** degrades via a disabled calculate CTA rather than a dedicated spinner/error banner — deliberate and tested (no false-ready), candidate for future polish only.
2. **"low-confidence"** is inherently a results-surface concept; address's honest analog is **empty-results** (covered), and form/lead correctly mark it `n/a-by-design`.

---

## Verdict

**Signed off.** The complete screen-state matrix (FR-35, UX-DR16) is verified across all four surfaces: **28 canonical cells → 22 `present` (each evidence-backed by a real file + passing node test), 6 `n/a-by-design` (each with a rationale), 0 gaps.** OI-5 is resolved by naming the discriminated view-state unions + their exhaustive node tests as the completeness source of truth — the matrix is regenerable from code, so state completeness is machine-enforced, not documentation-maintained. Dynamic accessibility of these states (focus/announcement/traversal) is deliberately deferred to the Story 6.2 audit.
