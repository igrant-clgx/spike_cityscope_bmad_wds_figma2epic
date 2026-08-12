---
title: 'Story 2.2 — Display current address & change control'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
baseline_revision: 'deff8018747a00bb4aa4facc3c6ba14fe10876da'
final_revision: 'bf02e496e9562d800a99ef85755be1fb7be76813'
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** Story 2.1 built the address seam (schemas, stub adapter, BFF routes, flow aggregate slot) but nothing renders it. A homeowner cannot yet see which property the estimate is for, nor is there a control to change it. FR-4 (display current address above the form) and FR-5/UX-DR9 (keyboard-operable "Enter new address" control) are unmet.

**Approach:** Add a presentational `AddressBlock` feature component that renders the current property address (formatted from the `ResolvedAddress` flow slot) 32px above the form, plus a keyboard-operable "Enter new address" control. When no address is set yet, render the empty/initial prompt from EXPERIENCE.md ("Enter your property address"). The control invokes an injected `onChangeAddress` callback so Story 2.3 can wire the autocomplete modal into the same seam without touching this component. Wire the block into the page above the (future) accordion form.

## Boundaries & Constraints

**Always:**
- Reuse the `ResolvedAddress` shape from `@shared/schemas` / the flow aggregate (AD-4/AD-6). Do not invent a new address type.
- The "Enter new address" control is a real `<button>` (or MUI `Button`/`Link` rendering a button) — keyboard-operable, focusable, with an accessible name (FR-5, UX-DR9).
- All colours come from `src/theme` tokens (no ad-hoc hex). Spacing uses MUI theme spacing; the block sits 32px above the form region (DESIGN.md § Layout).
- Microcopy lives in one copy module in the feature (voice per EXPERIENCE.md § Voice and Tone — plain, low-pressure).
- Component is presentational: it receives `address` (`ResolvedAddress | null`) and `onChangeAddress` as props. No data fetching, no flow mutation here.

**Block If:**
- Rendering the current address would require changing the `ResolvedAddress` schema (would indicate a Story 2.1 defect).

**Never:**
- Do not build the autocomplete modal, debounced lookup, resolution, or manual-entry fallback — Stories 2.3/2.4. The control only needs to be present, labelled, and invoke the injected callback.
- Do not implement scope-reset on change — Story 2.5.
- Do not add jsdom / React Testing Library. React tests use `renderToStaticMarkup` (node-only).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Current address present | `address` = resolved AU address | Formatted single-line address rendered above the form; "Enter new address" control visible | n/a |
| No address yet (empty/initial) | `address` = null | Empty-state prompt ("Enter your property address") + the same control (labelled to add, e.g. "Enter your property address") | n/a |
| Keyboard operation | control focused, Enter/Space | invokes `onChangeAddress` | n/a |
| Formatting | resolved address → label | `street, suburb STATE postcode` (e.g. `100 George St, Sydney NSW 2000`) | n/a |
| No callback wired | `onChangeAddress` omitted | control still renders and is operable; a no-op default is safe | n/a |

</intent-contract>

## Code Map

- `src/features/address/format-address.ts` -- NEW: pure `formatResolvedAddress(address)` → single-line label reused by block/modal/summary.
- `src/features/address/format-address.test.ts` -- NEW: formatter unit tests.
- `src/features/address/AddressBlock.tsx` -- NEW: presentational block (current address / empty prompt + "Enter new address" control).
- `src/features/address/AddressBlock.test.tsx` -- NEW: `renderToStaticMarkup` structural tests (present, empty, accessible control name).
- `src/features/address/copy.ts` -- NEW: address feature microcopy.
- `src/features/address/index.ts` -- export `AddressBlock`, `formatResolvedAddress`.
- `app/page.tsx` -- render `AddressBlock` above the placeholder form region.

## Tasks

- [x] Add `formatResolvedAddress` pure formatter + tests.
- [x] Add address feature `copy.ts` (heading, empty prompt, change-control label, add-control label).
- [x] Build `AddressBlock` presentational component (current address line / empty prompt + keyboard-operable "Enter new address" control invoking `onChangeAddress`).
- [x] Add `renderToStaticMarkup` structural tests (address present, empty state, control has accessible name / is a button).
- [x] Export from `src/features/address/index.ts`.
- [x] Wire `AddressBlock` into `app/page.tsx` above the form region (seed a demonstrative current address for the walking skeleton).
- [x] Run all 4 gates; confirm layer purity + no ad-hoc hex.

## Review Triage Log

### 2026-08-12 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 0, medium 1, low 1)
- defer: 2
- reject: 0
- addressed_findings:
  - `[medium]` `[patch]` (Blind Hunter) `app/page.tsx` seeded a hard-coded fake "current" address, so the running skeleton falsely showed a selected property and never exercised the empty/initial state. Fixed: the page now renders the honest `address={null}` empty/initial prompt (no flow state is wired yet); the populated render remains covered by `AddressBlock.test.tsx`.
  - `[low]` `[patch]` (Blind Hunter) The block label was an `<h2>` rendered before the page `<h1>`, an invalid heading sequence. Fixed: the "Property address" label is now a non-heading `overline` paragraph; the block is still a labelled `<section aria-label="Property address">`, so assistive-tech region navigation is preserved without a stray heading.
- deferred_findings (see deferred-work.md):
  - `[low]` (Edge Case Hunter) `ResolvedAddress` schema allows whitespace-only `street`/`suburb`. No live trigger (stub never emits blanks); tighten with `.trim().min(1)` when manual entry lands (Story 2.4).
  - `[low]` (Edge Case Hunter) Control interaction (Enter/Space → `onChangeAddress`) not directly event-tested. Node-only tests assert a real `<button type="button">` with an accessible name in both states; behavioural coverage is blocked on the Story 2.3 interaction-testing decision.

## Auto Run Result

- **Summary:** Added the presentational address block (FR-4/FR-5, UX-DR9): a pure `formatResolvedAddress` formatter (`street, suburb STATE postcode`), an `AddressBlock` client component that renders the current property address or the empty/initial prompt plus a keyboard-operable "Enter new address" control (real `<button>`, invokes an injected `onChangeAddress` so Story 2.3 can wire the modal), address feature microcopy, and page wiring above the form region. The block reuses the `ResolvedAddress` shape (AD-4/AD-6) and owns no data or flow state.
- **Files changed:** `src/features/address/format-address.ts` (+ `.test.ts`), `AddressBlock.tsx` (+ `.test.ts`), `copy.ts`, `index.ts`; `app/page.tsx`.
- **Review findings:** 2 patches applied (1 medium: honest empty-state instead of a fake seeded address; 1 low: heading-order fix), 2 deferred (both low), 0 rejected. Both reviewers converged on the page/heading issues.
- **Verification:** `npm run typecheck`, `npm run lint`, `npm run build` exit 0; `npm test` → 19 files, 91 tests pass. Layer purity intact (no `@mui`/`next`/`react` in `src/server/domain|adapters`); no ad-hoc hex.
- **Residual risks:** Control is present and operable but not yet connected to the modal (Story 2.3). Schema whitespace-hardening deferred to Story 2.4.
- `followup_review_recommended: false` — both patches were localized and verified; deferrals are genuinely later-story scoped.
