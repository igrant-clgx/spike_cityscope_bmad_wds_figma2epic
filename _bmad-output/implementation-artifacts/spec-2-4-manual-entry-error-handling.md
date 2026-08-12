---
title: 'Story 2.4 — Manual-entry fallback & non-destructive error handling'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
baseline_revision: '6a0b7cfc65a33b90ddb8dfcaf7041bf8073c8f2f'
final_revision: 'b12c52fa015bbba5254f3ee57ac5c3fe4165ec26'
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** The Story 2.3 modal only handles the happy path — a lookup or resolve failure fails quietly, and there is no way to enter an address if the service is down. FR-8 (manual-entry fallback with structured fields), FR-33 (non-destructive, retryable errors that preserve entered data), UX-DR16 (the address surface must render empty / loading / service-error / success states), and UX-DR20 (fields programmatically labelled, errors announced to screen readers) are unmet.

**Approach:** Make address-service failures non-destructive: when the suggest query or the resolve mutation returns an error result (the non-throwing `apiFetch` surfaces `ok: false`), show a retryable, non-scolding `Alert` inside the modal WITHOUT clearing the user's typed query, and expose a manual-entry fallback. Manual entry collects the SAME structured shape as provider resolution (street/suburb/state/postcode) through a pure, unit-testable validator and produces a `ResolvedAddress` — so downstream form/estimate code never branches on lookup-vs-manual origin. Because manual entry cannot supply coordinates, evolve the shared `ResolvedAddress` schema so `geo` is OPTIONAL (provider resolution still includes it; manual entry omits it). Fields are programmatically labelled and field errors use inline text + `aria-describedby` (colour is never the sole cue — reuse the `FormTextField` primitive). Render the four address-surface states per UX-DR16.

This story also discharges the deferred Story 2.2 item: tighten the display-bearing `street`/`suburb` schema fields with `.trim()` now that manual entry is the input source.

## Boundaries & Constraints

**Always:**
- Failures are NON-DESTRUCTIVE (FR-33): the typed query and any manual-entry field values are preserved when an error is shown; a Retry re-runs the failed operation.
- Manual entry produces the SAME `ResolvedAddress` structured shape as provider resolution (street/suburb/state/postcode; `geo` omitted). Downstream code must not branch on origin.
- The shared `resolvedAddressSchema` is evolved so `geo` is optional; the domain port `ResolvedAddress` mirror and the type-drift guard test stay in sync (still no zod in the domain layer).
- Manual-entry fields are validated with the shared address rules: `state` ∈ the AU enum, `postcode` matches `^\d{4}$`, `street`/`suburb` non-empty (trimmed). Validation is a pure function, unit tested node-only.
- Every field is programmatically labelled; every field error shows inline text and is associated via `aria-describedby` so screen readers announce it (UX-DR20). Reuse `FormTextField` (enforces error-never-by-colour-alone).
- The address surface renders all four UX-DR16 states: empty/initial, loading (lookup in flight), service-error (retry + manual fallback), success (confirmed address shown by the Story 2.2 block).
- All I/O stays same-origin via `apiFetch` + TanStack Query (AD-1/AD-5/AD-9). Colours from theme tokens only. `'use client'` on interactive components.

**Block If:**
- Making `geo` optional would break the estimate engine contract (Epic 4) — it must not; the stub engine is deterministic and origin-agnostic. If a hard dependency on `geo` surfaces, HALT.

**Never:**
- Do not implement address-change scope reset — Story 2.5 (OI-7).
- Do not add jsdom / React Testing Library or any new dependency. Manual-entry validation and error-state rendering are tested node-only (pure validator unit tests + `renderToStaticMarkup` structure tests).
- Do not integrate a real provider (OI-6 deferred). The stub adapter remains the source; the "service error" path is exercised by an error result from `apiFetch`, tested with a `vi.fn` fetch stub.
- Do not regress the Story 2.3 happy path (debounce, resolution, focus trap).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Empty/initial | modal open, no query | prompt to search; no error, no manual form shown by default | n/a |
| Loading | lookup in flight | inline loading (Story 2.3); no error | n/a |
| Suggest error | suggest result `ok:false` | non-scolding retryable `Alert`; typed query preserved; manual-entry fallback offered | Retry re-runs the suggest |
| Resolve error | resolve result `ok:false` | retryable `Alert`; selection preserved; manual-entry fallback offered | Retry re-runs the resolve |
| Enter manual mode | activate "Enter address manually" | structured fields (street, suburb, state, postcode) shown, labelled | n/a |
| Manual valid | all fields valid | builds a `ResolvedAddress` (no geo); Confirm writes it via `setAddress` | n/a |
| Manual invalid postcode | postcode not 4 digits | inline error on the postcode field, announced (`aria-describedby`); Confirm blocked | field-level validation error |
| Manual missing required | street/suburb blank / state unset | inline errors on the offending fields; Confirm blocked | field-level validation errors |
| Success | provider or manual address confirmed | dialog closes; block shows the formatted address; no origin branch downstream | n/a |
| Validator (pure) | field record | `{ ok: true, address }` or `{ ok: false, errors }` | returns errors, never throws |
| geo optional | resolved address without geo | schema accepts; formatter/label unaffected (geo not displayed) | n/a |

</intent-contract>

## Code Map

- `src/shared/schemas/address.ts` -- evolve `resolvedAddressSchema`: `geo` optional; `street`/`suburb` `.trim()`. Keep inferred types exported.
- `src/shared/schemas/address.test.ts` -- add cases: address without geo valid; whitespace-only street/suburb rejected.
- `src/server/domain/ports/address-provider.ts` -- mirror `geo?` optional on the plain-TS `ResolvedAddress` so the drift guard stays green.
- `src/features/address/validate-manual-address.ts` -- NEW: pure `validateManualAddress(fields)` → `{ ok: true, address } | { ok: false, errors }` using the shared rules.
- `src/features/address/validate-manual-address.test.ts` -- NEW: valid, bad postcode, bad state, blank required, trims.
- `src/features/address/ManualAddressForm.tsx` -- NEW: presentational labelled structured fields (reusing `FormTextField` + a state `Select`) with inline announced errors; hook-free where feasible for node tests.
- `src/features/address/ManualAddressForm.test.tsx` -- NEW: `renderToStaticMarkup` — labels, error `aria-describedby`, state options.
- `src/features/address/AddressModal.tsx` -- extend: detect suggest/resolve error results → retryable error state + manual-mode toggle; Retry handler; manual confirm path. Keep `AddressModalBody` presentational (new props: `errorMessage`, `onRetry`, `isManualMode`, `onEnterManual`, manual field props/handlers).
- `src/features/address/AddressModal.test.tsx` -- add: error alert + retry affordance rendered on error; manual-mode fields rendered when toggled.
- `src/features/address/copy.ts` -- extend: error message ("We couldn't find that address — try again or enter it manually"), retry label, "enter manually" label, manual field labels, manual validation messages.
- `src/features/address/index.ts` -- export new pieces as needed.

## Tasks

- [x] Evolve `resolvedAddressSchema` (`geo` optional; `street`/`suburb` trimmed) + domain port mirror + drift-guard/schema tests.
- [x] Add pure `validateManualAddress` + unit tests (valid, bad postcode, bad state, blank required, trimming).
- [x] Build `ManualAddressForm` (labelled structured fields via `FormTextField` + AU state `Select`, inline announced errors) + node-only structure tests.
- [x] Extend `AddressModal`/`AddressModalBody`: non-destructive retryable error `Alert` on suggest/resolve error (preserve typed data), manual-mode toggle, Retry, manual confirm path. Cover all four UX-DR16 states.
- [x] Extend microcopy; keep voice plain and helpful (not scolding).
- [x] Add tests: error+retry rendering, manual-mode fields, validator matrix.
- [x] Run all 4 gates; confirm layer purity + no ad-hoc hex; confirm Story 2.3 happy path still green; record manual a11y check for the announced field errors.

## Review Triage Log

### 2026-08-12 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 0, medium 0, low 2)
- defer: 0
- reject: 3
- addressed_findings:
  - `[low]` `[patch]` (Edge Case Hunter) Once in manual-entry mode there was no way back to autocomplete search without closing the dialog. Added a "Search instead" control that leaves manual mode, discards the manual field values/errors, and preserves the typed search query. New presentational test asserts the control renders.
  - `[low]` `[patch]` (Edge Case Hunter) The error-recovery lifecycle (alert clears after a successful retry) lacked a test. Added a presentational test that no service-error alert/retry renders when `errorMessage` is null (the state Confirm/retry-success derive). Full stateful query-lifecycle interaction remains within the node-only interaction-testing boundary (no jsdom).
- rejected_findings:
  - `[low]` (Edge Case Hunter) "Validator throws on missing/non-string field." Rejected: `validateManualAddress` takes a fully-typed all-string `ManualAddressFields`; a non-string field is type-impossible, so defensive `String(... ?? '')` coercion is gold-plating against an input the type system forbids.
  - `[low]` (Edge Case Hunter) "Reject street/suburb with newlines or extreme length." Rejected: out of spec (the rule is non-empty-after-trim) with no real trigger from a single-line text field; adding length/newline rules would invent requirements.
  - `[low]` (Edge Case Hunter) "Manual Confirm write/block untested." Rejected as redundant: the block/write logic is covered by the `validateManualAddress` unit matrix (valid → address, invalid → per-field errors) plus the presentational "enables Confirm in manual mode" test; the `handleConfirm` manual branch is a thin call over the tested validator.

## Auto Run Result

- **Summary:** Made address-service failures non-destructive and added a manual-entry fallback (FR-8/FR-33, UX-DR16/UX-DR20). On a suggest/resolve error (read from the non-throwing `apiFetch` envelope `ok === false`, not `isError`) the modal shows a non-scolding retryable `Alert` without clearing the typed query, and offers manual entry. Manual entry collects the same structured shape via labelled fields (street/suburb/AU-state Select/postcode) with inline `aria-describedby`-announced errors, validated by a pure `validateManualAddress`, and produces a `ResolvedAddress` (no `geo`) written via `setAddress` — so downstream never branches on origin. The shared `resolvedAddressSchema` was evolved (`geo` optional; `street`/`suburb` trimmed, discharging the deferred Story 2.2 item) with the domain-port mirror + type-drift guard kept in lockstep. All four UX-DR16 states render.
- **Files changed:** `src/shared/schemas/address.ts` (+ `.test.ts`), `src/server/domain/ports/address-provider.ts`, `src/features/address/validate-manual-address.ts` (+ `.test.ts`), `ManualAddressForm.tsx` (+ `.test.tsx`), `AddressModal.tsx` (+ `.test.tsx`), `copy.ts`, `index.ts`.
- **Review findings:** 2 patches (both low: back-to-search control, error-cleared test), 3 rejected (type-impossible defensive coding, out-of-spec string hardening, redundant test), 0 deferred. Blind Hunter found no material defects.
- **Verification:** `npm run typecheck`, `npm run lint`, `npm run build` exit 0; `npm test` → 25 files, 134 tests pass. Layer purity intact; no ad-hoc hex; type-drift guard green (schema `geo?` ≡ port `geo?`). No new dependencies.
- **Manual a11y check:** manual field errors use `FormTextField` (error ⇒ non-empty helper text, never colour-alone) and are associated via `aria-describedby` so screen readers announce them (UX-DR20) — asserted in `ManualAddressForm.test.tsx` and the modal error test.
- **Residual risks:** Address-change scope reset (OI-7) is Story 2.5. Real provider integration (OI-6) still deferred.
- `followup_review_recommended: false` — only two low-severity patches applied, both verified; rejections are justified in the log.
