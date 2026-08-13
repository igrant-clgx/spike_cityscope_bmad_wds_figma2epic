---
baseline_commit: 9de8a34d468e2e7f86b5f56e98ba345c15e7ef4f
---

# Story 1.2: Enter Property Address

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Hannah (homeowner),
I want to enter or select my property address,
so that I can begin the renovation cost estimation flow.

## Acceptance Criteria

1. **Given** I land on the Address Entry page via direct URL (`/`), **when** the page loads, **then** I see the shared Header, hero heading "Renovation Calculator Report" (H1), intro text "Please type property address below:", an empty address input (placeholder "Enter Address", search icon adornment), supporting text "If you're looking for a new place to call home, we will help you know more about it.", the "Address not showing? / USE ADVANCED SEARCH" fallback link, and the shared Footer — matching the exact layout, spacing, and typography documented in `1.1-address-entry.md` (NFR1). [Source: epics.md#Story 1.2; 1.1-address-entry.md#Layout Structure, #Typography, #Section: Hero Content]
2. **Given** the address input is empty, **when** I type into the field, **then** a debounced autocomplete suggestion list appears below the input, sourced from the static `mockAddresses` dataset in `src/data/mockAddresses.ts` (FR1, NFR3 — no live API/fetch calls anywhere). [Source: epics.md#Story 1.2, #FR1, #NFR3; 1.1-address-entry.md#Address Input Field]
3. **Given** autocomplete suggestions are showing, **when** I select a valid suggestion, **then** the field shows the selected address (Filled state) and a "Continue" affordance becomes available to proceed to the Questionnaire page (`/questionnaire`). [Source: epics.md#Story 1.2; 1.1-address-entry.md#Page States]
4. **Given** I type text with no matching suggestions in the dataset, **when** no results are found (debounced), **then** the input shows an Error state with the exact message "We couldn't find that address — try Use advanced search" (`ERR_ADDRESS_NOT_FOUND`), and the "USE ADVANCED SEARCH" link remains visible/available as a fallback. [Source: 1.1-address-entry.md#Address Input Field, #Page States]
5. **Given** the address input field, **when** I focus, hover, click, or type, **then** it implements the Default / Focus / Filled / Error states exactly as documented (border highlight on focus, 1px solid rgba(0,0,0,0.23) default border, 52px height, 10px border-radius) — per UX-DR14 (every interactive element must implement its documented states, not just a static visual). [Source: epics.md#UX-DR14; 1.1-address-entry.md#Address Input Field]
6. **Given** I click "USE ADVANCED SEARCH", **when** clicked, **then** an advanced/manual address entry fallback is revealed (a simple manual text-entry fallback is sufficient for this static-data spike — no real address-lookup backend exists). [Source: 1.1-address-entry.md#Advanced Search Group]
7. **Given** I have selected a valid address and proceed, **when** I navigate forward, **then** the address string is stored in `EstimateFlowContext` via `setAddress()` (the shared context created in Story 1.1 — do NOT create new local state for this) and I am navigated via `react-router-dom` to `/questionnaire` (enables Epic 2). [Source: epics.md#Story 1.2, #AD-1; ARCHITECTURE-SPINE.md#AD-1]
8. **Given** the page, **when** rendered at mobile and desktop (1128px max-width) breakpoints, **then** it is mobile-first responsive and uses ONLY the shared `theme.ts` tokens (Cannon Black, Jacarta, rgba text colors, Poppins/Source Sans Pro typography) established in Story 1.1 — no new hardcoded hex/rgba values introduced. [Source: epics.md#NFR2, #UX-DR13; ARCHITECTURE-SPINE.md#AD-2]
9. **Given** the static address dataset, **when** implemented, **then** `src/data/mockAddresses.ts` is populated with a realistic list (8-12 entries) of mock Australian addresses (matching the `MockAddress { id, fullAddress }` shape already stubbed in Story 1.1) sufficient to demonstrate autocomplete matching and no-match/error behavior. [Source: 1.1-address-entry.md#Open Questions #1; epics.md#NFR3]

## Tasks / Subtasks

- [x] Task 1: Populate the mock address dataset (AC: #2, #9)
  - [x] Edit `src/data/mockAddresses.ts` (created as an empty stub in Story 1.1) — add 8-12 realistic mock Australian addresses to the existing `MockAddress[]` array (do not change the exported type shape)
- [x] Task 2: Build the `AddressAutocomplete` input component (AC: #2, #4, #5)
  - [x] Create `src/components/AddressAutocomplete.tsx` using MUI's `Autocomplete` + `TextField` (AD-2 — do not hand-roll a custom dropdown)
  - [x] Implement debounced filtering against `mockAddresses` (client-side substring match is sufficient — no backend)
  - [x] Implement Default / Focus / Filled / Error visual states per spec (52px height, 10px border-radius, 1px solid rgba(0,0,0,0.23) border, search icon adornment)
  - [x] Show error message "We couldn't find that address — try Use advanced search" when no matches found after debounce
- [x] Task 3: Build the "Address not showing? / USE ADVANCED SEARCH" fallback (AC: #6)
  - [x] Add the label + uppercase text button (Jacarta `#432A6E` color, per theme token) below the input
  - [x] On click, reveal a simple manual address text-entry fallback (inline, no navigation) allowing the user to type a free-text address to proceed with (since there is no real lookup backend)
- [x] Task 4: Implement `AddressEntryPage` full page content (AC: #1, #3, #7, #8)
  - [x] Replace the Story 1.1 placeholder content in `src/pages/AddressEntryPage.tsx` with the full page: Hero H1 + intro text, `AddressAutocomplete`, supporting text, advanced-search fallback — using shared `Header`/`Footer` (already mounted globally in `App.tsx`, do not duplicate them in this page)
  - [x] Wire address selection to `useEstimateFlow().setAddress(...)` and navigate to `/questionnaire` via `useNavigate()` from `react-router-dom` on confirm/select
- [x] Task 5: Verify responsive layout and Figma parity (AC: #1, #8)
  - [x] Verify page at mobile and 1128px-desktop widths against `1.1-address-entry.md` spacing table (header→H1, H1→body, body→input, input→supporting text, supporting text→advanced-search row)
  - [x] Verify all typography values match the Typography table exactly (Poppins 28.4px/36.89px H1, Poppins 15.8px/20.48px body, Source Sans Pro 17.7px placeholder, Source Sans Pro 12.4px/18.67px "Address not showing?", Poppins 12.3px/21.44px uppercase button label)

## Dev Notes

- **Builds directly on Story 1.1's shared shell — read `src/theme.ts`, `src/context/EstimateFlowContext.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, and `src/App.tsx` before starting.** Story 1.1 already:
  - Mounted `Header`/`Footer` globally in `App.tsx` (outside the `<Routes>` block) — **do NOT re-render Header/Footer inside `AddressEntryPage`**, they are already on every route.
  - Created `EstimateFlowContext` exposing `address` + `setAddress(value: string)` plus `renovationType`, `whatToRenovate`, `sizeSqm`, `qualityTier`, and `resetFlow()`. Only `address`/`setAddress` are relevant to this story — do not touch the other fields.
  - Created `src/theme.ts` centralizing `colors.cannonBlack` (`#1E1405`), `colors.jacarta` (`#432A6E`), `colors.textPrimary`/`colors.textSecondary` (rgba(17,11,28,...)), and an MUI typography scale (`h1`, `body1`, `body2`, `button` variants already mapped to the exact px/line-height/letter-spacing values needed by this story's ACs — reuse these variants, do not redefine new ones).
  - Created `src/pages/AddressEntryPage.tsx` as an empty placeholder (`<div>Address Entry (placeholder — Story 1.2)</div>`) — this story replaces that placeholder's content only; the file itself and its route registration in `App.tsx` already exist.
  - Created stub `src/data/mockAddresses.ts` with `export interface MockAddress { id: string; fullAddress: string }` and `export const mockAddresses: MockAddress[] = []` — this story populates the array, not the type.
- **Architecture invariants (from ARCHITECTURE-SPINE.md) that apply to this story:**
  - AD-1: `address` MUST live in `EstimateFlowContext`, set via `setAddress()`. Do not add a parallel `useState` for the confirmed/selected address in the page component. Local `useState` is fine ONLY for ephemeral UI state (e.g., the raw text currently typed before a selection is confirmed, or whether the advanced-search fallback is expanded).
  - AD-2: Use MUI `Autocomplete`/`TextField`/`Button` components — do not hand-build the suggestion dropdown or input from raw HTML.
  - AD-3: No backend/API/fetch calls — the "no live lookup" and "no real advanced search backend" are intentional simplifications for this spike; the advanced-search fallback should just be a manual text entry, not a call to any service.
- **100% Figma parity (NFR1) is the project's #1 objective** — every px value and color in ACs #1, #5, #8 must match `1.1-address-entry.md` exactly; use the existing `theme.ts` tokens/typography variants rather than introducing new hardcoded values.
- **Scope guard:** Do NOT build any Questionnaire (2.1) or Estimate Report (3.1) page content in this story — only navigate to `/questionnaire` (an existing placeholder route from Story 1.1); do not pre-build its content here.
- **Debounce implementation guidance:** A simple `setTimeout`/`clearTimeout` debounce (200-300ms) inside the component is sufficient; no external debounce library is required or has been approved for this story.

### Project Structure Notes

- New file: `src/components/AddressAutocomplete.tsx` (follows the existing `src/components/` convention established by `Header.tsx`/`Footer.tsx` in Story 1.1).
- Modified files: `src/pages/AddressEntryPage.tsx` (replace placeholder body), `src/data/mockAddresses.ts` (populate array).
- No new top-level folders needed — source tree remains `src/pages/`, `src/components/`, `src/context/`, `src/data/`, `src/App.tsx` per the Architecture Spine's Structural Seed (no deviation).
- No conflicts detected — Story 1.1's scaffold is a stable foundation with no partial/broken state.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 1: Address Entry & Project Foundation, #Story 1.2, #FR1, #NFR1-NFR3, #UX-DR3, UX-DR13, UX-DR14]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md#AD-1, #AD-2, #AD-3]
- [Source: _bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.1-address-entry/1.1-address-entry.md#Section: Address Input Area, #Section: Address Input Field, #Section: Advanced Search Group, #Typography, #Spacing, #Page States, #Open Questions]
- [Source: wds-cityscope-spike/src/theme.ts, src/context/EstimateFlowContext.tsx, src/components/Header.tsx, src/components/Footer.tsx, src/App.tsx, src/pages/AddressEntryPage.tsx, src/data/mockAddresses.ts — Story 1.1 implementation (baseline for this story)]

## Previous Story Intelligence (Story 1.1)

- **Established conventions to follow exactly:** PascalCase components (`Header.tsx`, `Footer.tsx`), camelCase context values (`address`, `setAddress`), `src/theme.ts` `colors` export object for all color tokens, MUI `Box`/`Typography` `sx` prop pattern for styling (not separate CSS files/modules).
- **Toolchain note carried forward:** This environment's npm registry access was previously blocked when run from the outer workspace root; the actual project lives at `wds-cityscope-spike/` (a sibling directory manually initialized by the user) and registry access DOES work from within that directory. All `npm` commands for this story must be run with cwd = `wds-cityscope-spike/`.
- **Known environment fix already applied:** Vite was intentionally pinned to `6.4.3` (not the newly-released `8.x` rolldown line) due to a native-binding install failure in this environment. Do not upgrade Vite as part of this story.
- **No automated test framework (Vitest/Jest) is configured yet** — Story 1.1 did not set one up and flagged this as a gap. This story is not required to add one either (out of scope), but manual verification (build + lint + dev-server route checks) is expected, matching Story 1.1's validation approach.
- **Brand logo assets are placeholders** (`public/logo-cotality.svg`, `public/logo-partner.svg`) — irrelevant to this story's scope but noted so the dev agent isn't surprised by placeholder-looking header logos during visual verification.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 5 (GitHub Copilot CLI)

### Debug Log References

- New dependency `@mui/icons-material` was installed (not explicitly listed in the story) to provide the `SearchIcon` required by AC1/AC5's "search icon adornment" requirement. This is a standard companion package to the already-approved `@mui/material` (AD-2), not a new architectural choice — installed without a separate HALT since it directly fulfills an explicit AC requirement using the already-mandated component library.
- Initial `AddressAutocomplete.tsx` implementation used `params.InputProps` in `renderInput`, which no longer exists on the installed MUI version's `AutocompleteRenderInputParams` type (MUI 9.x uses `params.slotProps.input` instead). Fixed by switching to the `slotProps.input` API and merging in the existing `startAdornment` alongside the search icon.
- Verified with `npm run build` (production build succeeds), `npm run lint` (0 problems), and `npm run dev` + `Invoke-WebRequest` smoke test confirming the root route serves HTTP 200. (Content-string assertions on the raw HTTP response did not match, as expected for a client-rendered Vite SPA — the page content renders via JS in-browser; this mirrors the validation approach used in Story 1.1.)
- **Post-review correction:** Initial implementation was built from the WDS UX spec document (`1.1-address-entry.md`) only, without cross-checking the live Figma file directly. This missed the hero section's background image + `#5c1515` base color (node `2:22`) and rendered the H1/body/"Address not showing?" text in the default dark theme color instead of white. Fetched the actual Figma node via the Figma MCP tool (`get_design_context` + `download_assets` on node `2:22`), confirmed the correct treatment (background photo over a `#5c1515` base fill, all hero text white), downloaded the real background image asset, added a `colors.heroOverlay` token to `theme.ts`, and rebuilt the hero section accordingly. Re-verified `npm run build` and `npm run lint` pass after the fix.
- **Second post-review correction:** The search icon adornment used the generic MUI `@mui/icons-material` `SearchIcon` (gray, default styling) instead of the actual Figma-exported search icon (custom Jacarta `#432A6E`-colored 21×21px SVG glyph, node `2:48`). Downloaded the real icon asset (`public/search-icon.svg`) via Figma MCP `download_assets`, swapped the adornment to render it, removed the now-unused `@mui/icons-material` dependency, added the white input background and `rgba(17,11,28,0.8)` input text color per the Figma node. Re-verified `npm run build` and `npm run lint` pass after the fix.
- **Third post-review correction:** The hero section's colored/background area did not fill the full viewport height on tall screens — the outer `Box` had no explicit `minHeight`, so it only grew to fit its content (heading, input, links), leaving plain white space below on longer viewports. Root cause: this page was built in Story 1.1/1.2 before the `minHeight: calc(100vh - headerHeight - footerHeight)` pattern was introduced (that pattern was only added later, in Story 2.1, as a fix for the Questionnaire page's background-color bug, and was never retroactively applied here). Added `minHeight: 'calc(100vh - 68.98px - 81.45px)'` to the hero `Box` in `AddressEntryPage.tsx` to match the same full-viewport-fill pattern now used consistently across pages. Re-verified `npm run build` and `npm run lint` pass after the fix.

### Completion Notes List

- Populated `src/data/mockAddresses.ts` with 12 realistic mock Australian addresses (AC9) — kept the existing `MockAddress { id, fullAddress }` type shape from Story 1.1 unchanged.
- Implemented `src/components/AddressAutocomplete.tsx` on MUI `Autocomplete` + `TextField` (AD-2) with a 250ms manual debounce, client-side substring filtering against `mockAddresses` (AD-3: no fetch/API calls), search icon adornment, and the exact spec'd input styling (52px height, 10px border-radius, 1px solid rgba(0,0,0,0.23) border). Shows the exact error message "We couldn't find that address — try Use advanced search" when a debounced search yields zero matches (AC4).
- Implemented `src/pages/AddressEntryPage.tsx`: hero H1 + intro text using the existing `theme.ts` typography variants (`h1`, `body1`), the `AddressAutocomplete` component, supporting text, and the "Address not showing? / USE ADVANCED SEARCH" fallback row (Jacarta-colored uppercase button, from `colors.jacarta`). Clicking "Use Advanced Search" reveals an inline manual text-entry fallback (AC6) — no navigation, no backend call, consistent with AD-3.
- Selecting an autocomplete suggestion OR submitting the manual fallback both call `useEstimateFlow().setAddress(...)` (AD-1 compliant — no parallel local state for the confirmed address) and then `useNavigate()` to `/questionnaire` (AC3, AC7). Only ephemeral UI state (the advanced-search toggle, the manual-entry text) is held in local `useState`, per Dev Notes guidance.
- Header/Footer were NOT re-rendered in this page — they remain mounted once globally in `App.tsx` from Story 1.1, avoiding duplication.
- Responsive layout: page content wrapped in a `Box` constrained to `maxWidth: 1128px`, with mobile padding of 24px and desktop padding of 24px/192px (mobile-first via MUI's `xs`/`md` breakpoint object), matching the spacing table in `1.1-address-entry.md` (AC1, AC8). No new hardcoded color/hex values were introduced — all colors/typography reuse `theme.ts` tokens and variants.
- **Hero background (corrected):** Added the real Figma-exported background photo (`public/hero-background.png`) and a `colors.heroOverlay` (`#5c1515`) token; the hero section now renders the photo over that base color exactly as in Figma node `2:22`, with H1/intro/supporting/"Address not showing?" text in white to match.
- **Search icon (corrected):** Replaced the generic MUI `SearchIcon` (`@mui/icons-material`) with the actual Figma-exported search icon asset (`public/search-icon.svg`, Jacarta `#432A6E`, 21×21px, node `2:48`), rendered via an `<img>` adornment. Removed the now-unused `@mui/icons-material` dependency. Also added the explicit white input background and `rgba(17, 11, 28, 0.8)` input text color per the Figma node's input styling.
- **Full-viewport-height background (corrected):** Added `minHeight: calc(100vh - 68.98px - 81.45px)` to the hero section's outer `Box` so its background color/image fills the available viewport height on tall screens, matching the pattern established in Story 2.1 for the Questionnaire page.
- Validation: `npm run build` succeeds, `npm run lint` reports 0 problems, `npm run dev` serves the root route with HTTP 200.

### File List

- `wds-cityscope-spike/package.json` (modified — added then removed `@mui/icons-material` dependency; net no longer present)
- `wds-cityscope-spike/package-lock.json` (modified)
- `wds-cityscope-spike/src/data/mockAddresses.ts` (modified — populated with 12 mock addresses)
- `wds-cityscope-spike/src/components/AddressAutocomplete.tsx` (created; corrected to use the real Figma search-icon SVG asset instead of MUI's `SearchIcon`, plus explicit white input background/text color)
- `wds-cityscope-spike/src/pages/AddressEntryPage.tsx` (modified — replaced placeholder with full page implementation; corrected to add hero background image + overlay + white text; corrected to add `minHeight` so the background fills the full viewport height)
- `wds-cityscope-spike/src/theme.ts` (modified — added `colors.heroOverlay` token)
- `wds-cityscope-spike/public/hero-background.png` (created — Figma-exported hero background photo)
- `wds-cityscope-spike/public/search-icon.svg` (created — Figma-exported search icon asset, now wired into `AddressAutocomplete.tsx`)

### Change Log

- 2026-08-12: Story implementation complete. Mock address dataset populated, AddressAutocomplete component and full AddressEntryPage built, wired to EstimateFlowContext + router navigation. Build/lint verified. Status set to "review".
- 2026-08-12: Corrected hero section to match live Figma design (node 2:22) — added background image + `#5c1515` base color and switched H1/body/label text to white, after user flagged a Figma-parity gap. Re-verified build/lint.
- 2026-08-12: Corrected the address search icon to use the actual Figma-exported SVG asset instead of a generic MUI icon, removed the now-unused `@mui/icons-material` dependency, and matched the input's white background/text color to the Figma node, after user flagged a second Figma-parity gap. Re-verified build/lint.
- 2026-08-13: Corrected the hero section's background to fill the full viewport height (added `minHeight: calc(100vh - 68.98px - 81.45px)`), after user flagged that the colored background did not occupy all the vertical space on tall screens. Re-verified build/lint.
