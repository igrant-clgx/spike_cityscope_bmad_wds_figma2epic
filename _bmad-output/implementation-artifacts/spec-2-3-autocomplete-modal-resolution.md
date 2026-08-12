---
title: 'Story 2.3 — Address autocomplete modal with structured resolution'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
baseline_revision: '577f8b458290f3ae3605d3f9d9d4f5216df72496'
final_revision: '9c14fc787378cf6f8c198341c1930d77691cb476'
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** The "Enter new address" control (Story 2.2) invokes a no-op. A homeowner has no way to search for and select their property. FR-6 (debounced autocomplete via the BFF), FR-7 (select a prediction → structured resolution written to the flow aggregate), UX-DR9/UX-DR18 (focus-trapped Confirm/Cancel modal returning focus to its trigger), and FR-32 (loading state via the Epic 1 async primitive) are unmet.

**Approach:** Add a focus-trapped MUI `Dialog` (Confirm/Cancel) opened by the block's change control. Inside, a labelled search field drives a debounced (≥300ms, ≤1 request/300ms) autocomplete through the existing `useAddressSuggest` hook (AD-5, same-origin BFF). Selecting a prediction resolves it via the `/api/v1/address/resolve` route (through `apiFetch`) into the structured `ResolvedAddress` shape; Confirm writes that resolved address into the flow aggregate (`setAddress`, AD-6) and closes the dialog. A small client container owns the flow-form React state and connects `AddressBlock` (display) to the modal (change). The dialog uses MUI's built-in focus trap + focus restoration (UX-DR9/UX-DR18). Lookup loading shows inline via the async primitive.

## Interaction-testing decision (Epic 1 retro action item #2 — RESOLVED here)

Tests stay **node-only** (no jsdom / no React Testing Library). Coverage strategy for this interaction-heavy story:
- **Debounce** is extracted into a pure `useDebouncedValue` (or equivalent) unit tested with `vi.useFakeTimers()` — asserts ≤1 emission per 300ms window and trailing-edge emission.
- **Resolution wiring** (select prediction → resolve route → structured address) is unit tested by stubbing `global.fetch` (`vi.fn`) and asserting the `apiFetch` call + the resolved shape written via `setAddress`.
- **Modal structure / a11y semantics** are asserted via `renderToStaticMarkup` of the OPEN dialog: dialog role/label, a programmatically-labelled search field, Confirm/Cancel buttons with accessible names.
- **Focus trap + focus-return** are delegated to MUI `Dialog` (native) and covered by a **documented manual a11y check** (recorded in the Auto Run Result) rather than an automated focus test — adding jsdom is explicitly rejected for the spike. This decision also settles the deferred Story 2.2 interaction-test finding.

## Boundaries & Constraints

**Always:**
- All lookups/resolutions go through the same-origin BFF via `apiFetch` + TanStack Query (AD-5/AD-9). No ad-hoc `fetch`, no direct external calls (AD-1).
- Autocomplete is debounced ≥300ms, ≤1 request/300ms while typing (FR-6). The existing `useAddressSuggest` ≥3-char gate still applies.
- A selected prediction is resolved into the exact structured `ResolvedAddress` shape (street/suburb/state/postcode/geo) and written to the flow aggregate via `setAddress` (FR-7, AD-6). No new address type.
- The dialog traps focus while open and returns focus to the trigger on close — use MUI `Dialog` defaults; do NOT set `disableRestoreFocus`/`disableEnforceFocus` (UX-DR9/UX-DR18).
- Confirm and Cancel are keyboard-operable buttons with accessible names; the search field is programmatically labelled.
- Loading during lookup uses the Epic 1 async primitive / TanStack Query's loading flag, shown inline in the field (FR-32).
- Colours from `src/theme` tokens only (no ad-hoc hex). Interactive components carry `'use client'`.

**Block If:**
- Resolving a prediction would require changing the resolve route or `ResolvedAddress` schema (would indicate a Story 2.1 defect).

**Never:**
- Do not build the manual-entry fallback, the retryable service-error alert, or the full empty/loading/error/success surface matrix — that is Story 2.4. This story handles the happy path + lookup loading only; a lookup error may fail quietly here (2.4 makes it non-destructive + adds manual entry). Do not pre-empt 2.4's error UX.
- Do not implement address-change scope reset — Story 2.5 (OI-7).
- Do not add jsdom / React Testing Library or any new runtime/test dependency.
- Do not choose or integrate a real provider — the stub adapter remains the source (OI-6 deferred).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Open modal | activate "Enter new address" | focus-trapped Dialog opens; focus moves into it; search field focused/labelled | n/a |
| Close (Cancel/Esc/backdrop) | Cancel or Esc | dialog closes; focus returns to the trigger control; flow address unchanged | n/a |
| Type < 3 chars | query length < 3 | no request issued (hook disabled); no predictions | n/a |
| Type ≥ 3 chars | query ≥ 3 chars, settled 300ms | exactly one suggest request per 300ms window; predictions list rendered | quiet on lookup failure (2.4 owns error UX) |
| Rapid typing | many keystrokes < 300ms apart | ≤ 1 request per 300ms (debounced, trailing edge) | n/a |
| Loading | request in flight | inline loading indicator shown in/near the field (FR-32) | n/a |
| Select prediction | click/Enter a prediction | resolve route called; structured address staged for confirm | quiet on resolve failure (2.4 owns error UX) |
| Confirm | a prediction resolved, Confirm pressed | resolved structured address written to flow aggregate (setAddress); dialog closes; AddressBlock shows the new formatted address | n/a |
| Confirm with nothing selected | no resolved address | Confirm disabled (or no-op); dialog stays / closes without mutating | n/a |
| Debounce util | values within 300ms | emits only the trailing value once | n/a |

</intent-contract>

## Code Map

- `src/features/address/use-debounced-value.ts` -- NEW: pure debounce hook (≥300ms) for the search input.
- `src/features/address/use-debounced-value.test.ts` -- NEW: fake-timer unit tests (≤1 emission/window, trailing edge).
- `src/features/address/use-address-resolve.ts` -- NEW: resolve wiring (apiFetch → `/api/v1/address/resolve`, returns typed `ApiResult<{ address }>`), TanStack `useMutation` or a thin query.
- `src/features/address/use-address-resolve.test.ts` -- NEW: fetch-stub unit test of the resolve call + shape.
- `src/features/address/AddressModal.tsx` -- NEW: focus-trapped MUI Dialog (search field, predictions list, inline loading, Confirm/Cancel) wiring suggest+resolve; Confirm surfaces the resolved address.
- `src/features/address/AddressModal.test.tsx` -- NEW: `renderToStaticMarkup` structural/a11y tests of the open dialog.
- `src/features/address/AddressSection.tsx` -- NEW: `'use client'` container owning the flow-form state (`emptyForm`/`setAddress`); renders `AddressBlock` + `AddressModal`; opens the modal from the block's change control; writes the resolved address; manages focus-return via the trigger ref.
- `src/features/address/AddressSection.test.tsx` -- NEW: structural test (renders block + mounts container).
- `src/features/address/copy.ts` -- extend: modal title, search-field label, confirm/cancel labels, loading text.
- `src/features/address/index.ts` -- export `AddressSection` (and modal/hooks as needed).
- `app/page.tsx` -- render `AddressSection` in place of the bare `AddressBlock`.

## Tasks

- [x] Add `useDebouncedValue` pure debounce hook + fake-timer tests (≥300ms, trailing edge, ≤1/window).
- [x] Add `use-address-resolve` wiring (apiFetch → resolve route) + fetch-stub test.
- [x] Build `AddressModal` (focus-trapped MUI Dialog, labelled debounced search via `useAddressSuggest`, predictions list, inline loading via async primitive, Confirm/Cancel). Confirm surfaces the resolved `ResolvedAddress`.
- [x] Build `AddressSection` client container: owns flow-form state, connects `AddressBlock` change control → modal, writes resolved address via `setAddress`, restores focus to the trigger on close.
- [x] Extend `copy.ts` with modal microcopy.
- [x] Add node-only tests: debounce (fake timers), resolve wiring (fetch stub), modal structure/a11y (`renderToStaticMarkup`), section structure.
- [x] Wire `AddressSection` into `app/page.tsx`.
- [x] Run all 4 gates; confirm layer purity + no ad-hoc hex; perform + record the documented manual focus-trap/focus-return a11y check.

## Review Triage Log

### 2026-08-12 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 5: (high 2, medium 2, low 1)
- defer: 0
- reject: 0
- addressed_findings:
  - `[high]` `[patch]` (both reviewers) Modal transient state (query, selection, resolved address) persisted across close/reopen, so a reopened dialog could show — and Confirm could commit — a stale address. Fixed: a `useEffect` keyed on `open` clears `query`, `selectedId`, and calls `resolve.reset()` whenever the dialog closes.
  - `[high]` `[patch]` (Edge Case Hunter) Editing the search text after selecting a prediction left the previously-resolved address staged, so Confirm could write an address that no longer matched the visible query. Fixed: `handleQueryChange` clears `selectedId` and calls `resolve.reset()` on any edit while a selection exists, so Confirm is re-disabled until a fresh resolution.
  - `[medium]` `[patch]` (Edge Case Hunter) Stale predictions for a previous query lingered during the debounce-pending window. Fixed: the pending window (`debouncedQuery !== query`) is now treated as loading; predictions are only surfaced once the debounced value settles, and the "no results" message is suppressed while loading.
  - `[medium]` `[patch]` (Blind Hunter + Edge Case Hunter) Test coverage gaps. Added node-only body tests for the matrix rows: short-query (<3 chars) shows neither predictions nor "no results"; a settled valid query with no matches shows "no results"; "no results" is suppressed while loading. (Full portal-rendered `role="dialog"` assertion remains out of reach node-only per the interaction-testing decision; the extracted `AddressModalBody` asserts the labelling target `id`, the labelled field, and Confirm/Cancel — the wired contract MUI applies natively.)
  - `[low]` `[patch]` (Edge Case Hunter) Removed the unused `triggerRef` in `AddressSection` (dead code). MUI `Dialog` restores focus to the change-control button natively on close — no manual ref needed.

## Auto Run Result

- **Summary:** Built the address autocomplete modal with structured resolution (FR-6/FR-7, UX-DR9/UX-DR18, FR-32). A focus-trapped MUI `Dialog` (Confirm/Cancel) opened by the Story 2.2 change control hosts a labelled search field whose value is debounced (≥300ms, trailing edge) into the existing `useAddressSuggest` hook; selecting a prediction resolves it via the BFF `/api/v1/address/resolve` route into the structured `ResolvedAddress`, and Confirm writes it to the flow aggregate (`setAddress`, AD-6). A client `AddressSection` container owns the flow-form state and connects display ↔ modal. Lookup loading is shown inline via the async primitive / query flag.
- **Files changed:** `src/features/address/use-debounced-value.ts` (+ `.test.ts`), `use-address-resolve.ts` (+ `.test.ts`), `AddressModal.tsx` (+ `.test.tsx`, with extracted `AddressModalBody` for node-only structure tests), `AddressSection.tsx` (+ `.test.tsx`), `copy.ts`, `index.ts`; `app/page.tsx`.
- **Review findings:** 5 patches (2 high: stale-state reset on close + on query-edit; 2 medium: debounce-window prediction gating + test-matrix coverage; 1 low: dead-ref removal), 0 deferred, 0 rejected. Both reviewers converged on the stale-state high-severity issues.
- **Verification:** `npm run typecheck`, `npm run lint`, `npm run build` exit 0; `npm test` → 23 files, 113 tests pass. Layer purity intact (no `@mui`/`next`/`react`/`zod` in `src/server/domain|adapters`); no ad-hoc hex. No new dependencies added.
- **Manual a11y check (interaction-testing decision):** confirmed `disableRestoreFocus`/`disableEnforceFocus`/`disableAutoFocus` are NOT set (MUI native focus trap + focus-return active) and `aria-labelledby` is wired to the dialog title id — satisfies UX-DR9/UX-DR18 focus-return without jsdom.
- **Residual risks:** Lookup/resolve failures currently fail quietly (no retry alert, no manual fallback) — that non-destructive error UX + manual entry is Story 2.4. Address-change scope reset is Story 2.5 (OI-7).
- `followup_review_recommended: false` — the two high-severity stale-state defects are fixed with reset-on-close and reset-on-edit and verified; remaining scope is genuinely later-story.
