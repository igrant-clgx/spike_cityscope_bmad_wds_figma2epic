---
title: 'Story 2.5 — Address change resets scope to a defined state'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
baseline_revision: 'ef988fd1bd058bad21f437f6716c01111ef4fe6b'
final_revision: ''
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/epics.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md'
warnings:
  - 'OI-7 is [OPEN]: the exact reset scope (clear vs keep dependent answers) is unconfirmed by product. This story implements the documented [ASSUMPTION] (clear dependent scope) and flags OI-7 for confirmation before Epic 3 build.'
---

<intent-contract>

## Intent

**Problem:** Changing an already-confirmed property address must reset dependent renovation scope to a defined state (FR-9), otherwise a homeowner's estimate could reflect answers for the wrong property. Today `AddressSection` calls `setAddress`, which replaces only the address slot and would leave future Step 1–3 answers intact. OI-7 (clear vs keep) is `[OPEN]`; the handover documents the `[ASSUMPTION]` that changing a confirmed address clears Step 1–3 answers.

**Approach:** Add a first-class flow-aggregate transition `changeAddress(form, newAddress)` that resets ALL dependent scope to the defined initial state and then sets the new address — implemented as "start from `emptyForm()`, set the new address". This is forward-compatible: as Epic 3 adds scope slots to `emptyForm()`, `changeAddress` resets them automatically with no change here. Keep `setAddress` for the FIRST address selection (nothing to reset). `AddressSection` chooses: first confirmation (`form.address === null`) → `setAddress`; a real change (address already set) → `changeAddress` + a user-visible notice (toast) that dependent answers were reset. Because no dependent scope slots exist yet (Epic 3), the reset is currently a no-op on data but establishes the verified mechanism and the communication. OI-7 stays flagged `[OPEN]`.

## Boundaries & Constraints

**Always:**
- `changeAddress` resets dependent scope to the defined initial state (the `emptyForm()` baseline) and applies the new address, immutably, in the pure domain layer (no zod, no UI).
- The reset is applied CONSISTENTLY: any address change through the modal confirm path uses `changeAddress`; a first-time set uses `setAddress` (no spurious reset/notice).
- The reset is COMMUNICATED to the user on an actual change (a non-blocking toast/snackbar), per the AC. No notice on first set.
- The address value itself is always updated to the newly confirmed address.
- OI-7 remains `[OPEN]`: documented as the `[ASSUMPTION]` (clear dependent scope) and flagged for product confirmation before Epic 3 build (spec warning + a note in the open-questions / deferred log).

**Block If:**
- A defined dependent-scope shape already existed and had preservation requirements conflicting with the clear assumption (it does not yet — scope arrives in Epic 3).

**Never:**
- Do not build Step 1–3 scope slots — that is Epic 3. This story only establishes the reset transition + communication so Epic 3 inherits correct behaviour.
- Do not implement "New Estimate" / "Edit Estimate" (Epic 4, FR-25) — those are a different reset surface.
- Do not add jsdom / RTL / new dependencies. Domain logic is unit-tested; UI wiring uses `renderToStaticMarkup`.
- Do not regress Stories 2.1–2.4 behaviour.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| First address set | `form.address === null`, confirm an address | `setAddress` writes the slot; NO reset notice | n/a |
| Change confirmed address | `form.address` already set, confirm a different address | `changeAddress`: dependent scope reset to the `emptyForm()` baseline, new address applied; user sees a reset notice | n/a |
| `changeAddress` purity | any form + new address | returns a NEW form equal to `setAddress(emptyForm(), newAddress)`; input untouched | n/a |
| Re-confirm same address | address set, confirm identical address | treated as a change (reset + notice) — simplest defined behaviour; documented | n/a |
| Forward-compat | future scope slots in `emptyForm()` | `changeAddress` resets them automatically (covered by a test asserting it rebuilds from `emptyForm`) | n/a |

</intent-contract>

## Code Map

- `src/server/domain/flow/renovation-estimate-form.ts` -- add `changeAddress(form, address)` = reset dependent scope to `emptyForm()` baseline + set the new address. Keep `setAddress`.
- `src/server/domain/flow/renovation-estimate-form.test.ts` -- add: `changeAddress` sets the new address; resets other scope to the `emptyForm()` baseline; immutable; equals `setAddress(emptyForm(), addr)`.
- `src/features/address/AddressSection.tsx` -- choose `setAddress` (first set) vs `changeAddress` (real change); show a reset toast on a real change via `useToast`.
- `src/features/address/AddressSection.test.tsx` -- keep/extend structural coverage.
- `src/features/address/copy.ts` -- add the reset-notice message.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- record OI-7 `[OPEN]` product-confirmation flag.

## Tasks

- [x] Add `changeAddress` transition + domain unit tests (sets address, resets dependent scope to `emptyForm()` baseline, immutable, forward-compatible).
- [x] Wire `AddressSection` to use `changeAddress` on a real change and `setAddress` on first set; show a non-blocking reset toast on a real change.
- [x] Add the reset-notice microcopy.
- [x] Flag OI-7 `[OPEN]` for product confirmation (deferred-work log + spec warning).
- [x] Run all 4 gates; confirm layer purity + no ad-hoc hex; no regression of 2.1–2.4.

## Review Triage Log

Two reviewers ran (Blind Hunter + Edge Case Hunter). Blind Hunter: no material defects (verified `changeAddress` pure/immutable rebuild-from-`emptyForm()`, correct first-set vs change branch, ToastProvider present at runtime + in test, OI-7 flagged, layer purity/no-hex/no-deps clean). Edge Case Hunter raised 2:

1. **[reject] Stale change detection on rapid double-confirm (medium→rejected).** `isChange` is derived from the outer render's `form` rather than inside the `setForm` functional updater. Rejected: `handleConfirm` calls `setOpen(false)`, closing the modal, so a second `onConfirm` cannot fire through the UI before commit; `onConfirm` is only invoked by a single user confirm action. The proposed fix (deriving the toast decision inside the `setForm` updater) would place a side effect inside a React state reducer, violating updater purity — strictly worse. `isChange` computed from the current render is correct for a single confirm. No change.
2. **[defer] Interaction matrix rows untested (low).** First-confirm-no-toast / real-change-toast / same-address-reconfirm transitions are not asserted at the AddressSection level. This is the known node-only test limitation (no jsdom/RTL/events; toast firing is interaction-level) — consistent with the Story 2.3 precedent (MUI focus-trap covered by documented manual check). The underlying decision is already proven at the domain layer: `renovation-estimate-form.test.ts` asserts `changeAddress` resets to the `emptyForm()` baseline while `setAddress` does not. Deferred to `deferred-work.md`: optionally extract a pure transition/notification decision helper for node-level coverage. No behavioral gap.

## Auto Run Result

- **Story:** 2.5 — Address change resets dependent scope to a defined state (FR-9)
- **Outcome:** COMPLETE. `changeAddress(_form, address) = setAddress(emptyForm(), address)` resets all dependent scope to the defined baseline and applies the new address — purely, immutably, and forward-compatibly (a future Epic 3 scope slot added to `emptyForm()` is reset automatically with no edit to `changeAddress`). `AddressSection` uses `setAddress` on first confirmation (no reset/notice) and `changeAddress` on a real change (reset + non-blocking info toast via `ADDRESS_CHANGED_RESET_NOTICE`). OI-7 `[OPEN]` (clear-vs-keep) implemented as the documented `[ASSUMPTION]` and flagged for product confirmation.
- **Gates:** typecheck ✓ · lint ✓ · test ✓ (25 files, 137 tests) · build ✓
- **Reviews:** Blind Hunter — no material defects. Edge Case Hunter — 2 findings: 1 rejected (modal closes on confirm; fix would violate updater purity), 1 deferred (node-only interaction-test limitation; domain-level behavior already proven).
