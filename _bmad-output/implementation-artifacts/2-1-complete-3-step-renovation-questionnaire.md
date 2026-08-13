---
baseline_commit: 128165d
---

# Story 2.1: Complete 3-Step Renovation Questionnaire

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Hannah (homeowner),
I want to answer 3 quick questions about my renovation (type, what to renovate, size/quality tier),
so that I can get through the questionnaire quickly and reach my estimate.

## Acceptance Criteria

1. **Given** I arrive on the Questionnaire page from Address Entry, **when** the page loads, **then** I see the shared Header, an Address Bar showing my confirmed address (from `EstimateFlowContext.address`) with an "Enter new address" link, Step 1 (Renovation Type) expanded, and Steps 2 & 3 locked at 46% opacity — matching UX-DR4/5/6/7 layout, spacing, and typography exactly (NFR1). [Source: epics.md#Story 2.1; 1.2-questionnaire.md#Layout Structure, #Typography, #Section: Accordion; Figma node 9:27, 9:60, 9:72]
2. **Given** the Address Bar is visible, **when** I click "Enter new address", **then** I am navigated via `react-router-dom` back to the Address Entry page (`/`). [Source: epics.md#Story 2.1; 1.2-questionnaire.md#Enter New Address Link]
3. **Given** Step 1 (Renovation Type) is expanded, **when** I select "Internal" or "External", **then** the selection is stored in `EstimateFlowContext.renovationType`, Step 1 auto-collapses showing a retained summary of my selection, and Step 2 unlocks and auto-expands (only one step expanded at a time, per AD-4). [Source: epics.md#Story 2.1, #AD-4; 1.2-questionnaire.md#Step 1]
4. **Given** Step 2 (What to Renovate) is now unlocked and expanded, **when** I select one option from Kitchen, Bathroom, Ensuite, Toilet, Paint Interior, Built in Wardrobe, Redo the floor, or Convert to Bathroom, **then** the single-select choice is stored in `EstimateFlowContext.whatToRenovate` (as a single-element array, consistent with the existing `string[]` type from Story 1.1 — AD-4 requires single-select even though the field is typed as an array), Step 2 auto-collapses showing a retained summary, and Step 3 unlocks and auto-expands. [Source: epics.md#Story 2.1, #AD-4; 1.2-questionnaire.md#Step 2]
5. **Given** Step 3 (More Questions) is now unlocked and expanded, **when** I enter a size in square meters and select a Quality Tier (Budget / Standard / Premium), **then** both values are stored in `EstimateFlowContext.sizeSqm` and `EstimateFlowContext.qualityTier`. [Source: epics.md#Story 2.1; 1.2-questionnaire.md#Step 3]
6. **Given** all 3 steps are answered, **when** Step 3 is completed, **then** I am navigated via `react-router-dom` to the Estimate Report page (`/estimate`), enabling Epic 3. [Source: epics.md#Story 2.1, #AD-1; ARCHITECTURE-SPINE.md#AD-1]
7. **Given** any accordion step, button, or link, **when** I interact with it (hover, focus, select), **then** it implements its documented Default/Selected/Hover/Locked states exactly as specified — per UX-DR14 (every interactive element must implement its documented states, not just a static visual). [Source: epics.md#UX-DR14; 1.2-questionnaire.md#Page States]
8. **Given** Steps 2 and 3 are locked, **when** I attempt to interact with them before their prior step is answered, **then** they remain non-interactive (both the card container at 46% opacity AND the header row at an additional nested 38% opacity — verified against Figma node 9:60/9:72, a detail beyond what the WDS text spec captured) and do not respond to input. [Source: epics.md#Story 2.1; Figma node 9:60, 9:72 — `opacity-[0.46]` on `div.MuiPaper-root`, `opacity-[0.38]` on the nested header row]
9. **Given** the page, **when** rendered at mobile and desktop (1128px max-width, 840px content width) breakpoints, **then** it is mobile-first responsive and uses ONLY the shared `theme.ts` tokens (Cannon Black, Jacarta, rgba text colors, Poppins/Source Sans Pro typography) established in Stories 1.1/1.2 — no new hardcoded hex/rgba values introduced. [Source: epics.md#NFR2, #UX-DR13; ARCHITECTURE-SPINE.md#AD-2]
10. **Given** the static renovation-item dataset, **when** implemented, **then** `src/data/mockRenovationOptions.ts` (new file) defines the static option sets for Step 2 ("Kitchen", "Bathroom", "Ensuite", "Toilet", "Paint Interior", "Built in Wardrobe", "Redo the floor", "Convert to Bathroom") and Step 3 Quality Tier ("Budget", "Standard", "Premium") — no live data source (AD-3). [Source: 1.2-questionnaire.md#Open Questions #1, #2; epics.md#NFR3]

## Tasks / Subtasks

- [x] Task 1: Create the static renovation-options dataset (AC: #4, #5, #10)
  - [x] Create `src/data/mockRenovationOptions.ts` exporting `whatToRenovateOptions: string[]` (8 options) and `qualityTierOptions: string[]` (3 tiers)
- [x] Task 2: Build the `AddressBar` component (AC: #1, #2)
  - [x] Create `src/components/AddressBar.tsx` — reads `address` from `useEstimateFlow()`, renders it as a Poppins 15.8px/20.48px `rgba(17,11,28,0.8)` label (h6 semantic) + an "Enter new address" underlined Jacarta `#432A6E` text-button (Source Sans Pro 14px/18.2px) that calls `useNavigate()` to `/`
  - [x] Layout: horizontal, `justify-content: space-between`, per Figma node 9:18 (label flex-grow, button shrink-0)
- [x] Task 3: Build the `QuestionnaireAccordion` / `AccordionStep` component (AC: #1, #3, #4, #5, #7, #8, #9)
  - [x] Create `src/components/AccordionStep.tsx` using MUI's `Accordion` + `AccordionSummary` + `AccordionDetails` (AD-2 — do not hand-roll expand/collapse)
  - [x] Card visual: white background, `8px` padding, `16px` border-radius, `box-shadow: 0px 2px 2px rgba(17,11,28,0.08)` (per Figma node 9:27/9:60/9:72 — more precise than the WDS spec's plain "16px (top card), 4px (locked cards)" note, which does not match the Figma export; use `16px` for ALL cards uniformly per Figma)
  - [x] Step header text: Source Sans Pro 14px/18.2px, `rgba(17,11,28,0.8)`, letter-spacing 0.5px
  - [x] Expand/collapse icon: MUI's default `ExpandMoreIcon` (from `@mui/icons-material`) — the Figma-exported chevron (node 9:38, `Vector` path, `fill="black" fill-opacity="0.54"`) is pixel-identical to MUI's stock `ExpandMoreIcon`, so re-add `@mui/icons-material` as a dependency and use the real MUI icon rather than a custom SVG asset (this is the correct choice for a MUI-based `Accordion`, unlike Story 1.2's search-icon case which was NOT a stock MUI icon)
  - [x] Locked state (Steps 2 & 3 before their prior step is answered): apply `opacity: 0.46` to the outer card AND an additional nested `opacity: 0.38` to the header row specifically (compounds visually — verified against Figma node 9:60/9:72; do not just apply a single 46% opacity to the whole card, that undershoots the Figma reference) — MUI `Accordion`'s `disabled` prop handles non-interactivity, layer the opacity via `sx`
  - [x] Only one step expanded at a time; selecting an option in the current step auto-collapses it (showing a retained summary line of the selection) and auto-expands the next unlocked step (AD-4)
- [x] Task 4: Build Step 1 content — Renovation Type (AC: #3, #7)
  - [x] Question text: Poppins 17.7px/23px, `rgba(17,11,28,0.8)` — "Is an Internal or External renovation?"
  - [x] "Internal" / "External" as MUI `ButtonBase`/`Button` outlined toggle buttons: `border: 1px solid #432a6e`, `border-radius: 4px`, `min-width: 64px`, padding `~16px/8px`, label Source Sans Pro 15.8px/23.63px color `#432a6e` (per Figma node 9:27)
  - [x] Implement Default / Selected / Hover states per UX-DR14 (Selected state should visually distinguish the chosen option, e.g. filled background using `colors.jacarta`)
- [x] Task 5: Build Step 2 content — What to Renovate (AC: #4, #7)
  - [x] Single-select list/button-group sourced from `mockRenovationOptions.whatToRenovateOptions`
  - [x] Implement Default / Selected / Hover states
- [x] Task 6: Build Step 3 content — More Questions (AC: #5, #6, #7)
  - [x] Numeric input for size in square meters (MUI `TextField type="number"`)
  - [x] Quality Tier single-select from `mockRenovationOptions.qualityTierOptions` (same button-group pattern as Step 2 for visual consistency, since no separate Figma detail is available for this control)
  - [x] On completing this step (both size and quality tier provided), call `useEstimateFlow().setSizeSqm()` / `setQualityTier()` then `useNavigate()` to `/estimate`
- [x] Task 7: Build `QuestionnairePage.tsx` (AC: #1, #6, #9)
  - [x] Replace the Story-1.1 placeholder with: `AddressBar` + 3× `AccordionStep` (Renovation Type / What to Renovate / More Questions), wired to `EstimateFlowContext`
  - [x] Content container constrained to `840px` width (centered within the `1128px` max-width shell established in Story 1.1/1.2), mobile-first responsive with `xs`/`md` breakpoints
  - [x] Header/Footer NOT re-rendered here — remain mounted globally in `App.tsx` (established convention from Stories 1.1/1.2)
- [x] Task 8: Verify build, lint, and dev server
  - [x] `npm run build` succeeds
  - [x] `npm run lint` reports 0 problems
  - [x] `npm run dev` + smoke-test the `/questionnaire` route (HTTP 200)

## Dev Notes

- **Live Figma cross-check performed during story creation** (learning applied from Story 1.2's post-review corrections): fetched `Figma-get_design_context` on node `9:90` (whole page), `9:27` (Step 1 expanded card), `9:60`/`9:72` (Step 2/3 locked cards), and `9:18` (Address Bar) — the exact styling captured in the ACs/Tasks above (card shadow, compounding locked-opacity, exact button border/radius, MUI `ExpandMoreIcon` chevron) came from this cross-check, NOT from the WDS text spec alone, which under-specifies these details (e.g. it says "16px (top card), 4px (locked cards)" border-radius, but Figma shows `16px` uniformly on all 3 cards).
- **Reuse existing shared conventions from Stories 1.1/1.2** — do NOT recreate: `theme.ts` (colors/typography tokens), `EstimateFlowContext` (already has all 5 fields needed: `renovationType`, `whatToRenovate`, `sizeSqm`, `qualityTier` plumbed since Story 1.1), `Header`/`Footer` (mounted once in `App.tsx`), the `840px`-content-within-`1128px`-shell responsive pattern from `AddressEntryPage.tsx`.
- **`@mui/icons-material` re-add is justified**: Story 1.2 removed this dependency after replacing a *non-standard* search icon with a raw Figma SVG. This story's accordion chevron IS a stock MUI icon (`ExpandMoreIcon`) — verified pixel-identical to the Figma export — so re-adding `@mui/icons-material` here is the correct AD-2-compliant choice, not a repeat of the earlier mistake.
- **`whatToRenovate` type note**: already typed as `string[]` in `EstimateFlowContext` (built ahead of need in Story 1.1). AD-4 requires Step 2 to be single-select — store the one selection as a single-element array (`[selectedOption]`), do not change the context's type shape.
- **Accordion library choice (AD-2):** Use MUI's `Accordion`/`AccordionSummary`/`AccordionDetails` components, not a hand-rolled `Collapse`+state implementation — matches the Figma export's `MuiAccordionSummary`/`MuiCollapse` class names.

### Project Structure Notes

- New files: `src/data/mockRenovationOptions.ts`, `src/components/AddressBar.tsx`, `src/components/AccordionStep.tsx`.
- Modified files: `src/pages/QuestionnairePage.tsx` (placeholder → full implementation), `package.json`/`package-lock.json` (re-add `@mui/icons-material`).
- No changes needed to `EstimateFlowContext.tsx` or `theme.ts` — both already have everything this story needs.

### References

- [Source: epics.md#Story 2.1] — Story statement + 7 Given/When/Then ACs (lines 167-210)
- [Source: epics.md#AD-1, #AD-2, #AD-3, #AD-4] — architecture decisions this story must comply with
- [Source: 1.2-questionnaire.md] — WDS UX spec (layout, spacing, typography, page states, object IDs)
- [Source: ARCHITECTURE-SPINE.md#AD-4] — single-select, single-open-accordion contract
- [Source: Figma node 9:90, 9:27, 9:60, 9:72, 9:18] — live Figma cross-check (file key `Q0fDj1AKMbwyPJRmPltox0`), performed proactively this time to close the same class of gap found in Story 1.2

## Previous Story Intelligence (Stories 1.1 & 1.2)

- Story 1.1 established `theme.ts` (colors/typography tokens), `EstimateFlowContext` (all 5 flow fields already defined), `Header`/`Footer` (mounted globally in `App.tsx`), and the `840px`-within-`1128px` responsive content-container pattern.
- Story 1.2 established the MUI `Autocomplete`/`TextField` pattern for inputs, and — critically — surfaced two Figma-parity gaps caught only via manual user review after `bmad-dev-story` completed: (1) a WDS-spec detail (hero background/overlay color) that existed in the spec text but was dropped during story-extraction, and (2) a WDS-spec gap (search icon appearance deferred to "per Figma reference" with no concrete values) that caused the dev agent to fall back to a generic icon. **This story's Dev Notes and Tasks above proactively close the same risk** by embedding the actual Figma-verified values (card shadow, compounding opacity, chevron icon, button styling) directly into the story rather than deferring to "per Figma reference."
- Story 1.2 also confirmed: `npm` works from `wds-cityscope-spike/` directory; Vite is pinned to `6.4.3` (do not let `npm install` upgrade it); no test framework is configured — validation is `npm run build` + `npm run lint` + `npm run dev` HTTP smoke test.

## Dev Agent Record

### Agent Model Used

GitHub Copilot CLI (Claude Sonnet 5)

### Debug Log References

- Re-added `@mui/icons-material` (previously removed in Story 1.2 after replacing a non-standard search icon) — justified here because the accordion chevron icon exported from Figma (node 9:38) is pixel-identical to MUI's stock `ExpandMoreIcon`, confirmed by comparing the Figma SVG path data before deciding not to download a custom asset.
- Verified `npm run build`, `npm run lint` (0 problems), and `npm run dev` + `Invoke-WebRequest` against `/questionnaire` (HTTP 200).

### Completion Notes List

- Created `src/data/mockRenovationOptions.ts` with the 8 "what to renovate" options and 3 quality tiers (AC10).
- Built `src/components/AddressBar.tsx`: reads `address` from `EstimateFlowContext`, renders the confirmed address label + "Enter new address" underlined link that navigates back to `/` (AC1, AC2).
- Built `src/components/AccordionStep.tsx` on MUI `Accordion`/`AccordionSummary`/`AccordionDetails` (AD-2). Card style (white bg, 16px radius, `0px 2px 2px rgba(17,11,28,0.08)` shadow) and locked-state compounding opacity (46% card + 38% header row) were taken directly from a live Figma cross-check (nodes 9:27, 9:60, 9:72) performed during story creation — not just the WDS text spec, which under-specified/mismatched these details (AC1, AC8, AC9).
- Rebuilt `src/pages/QuestionnairePage.tsx`: `AddressBar` + 3 `AccordionStep`s (Renovation Type / What to Renovate / More Questions), each wired to `EstimateFlowContext` (`renovationType`, `whatToRenovate`, `sizeSqm`, `qualityTier`). Single-open-accordion behavior enforced via one `expandedStep` local state value (ephemeral UI state only, per AD-1); selecting an option in the current step auto-advances `expandedStep` to the next one and shows a retained summary on the now-collapsed step (AC3, AC4, AC5, AC6).
- Shared `ToggleButton` component (inline in `QuestionnairePage.tsx`) implements the exact Figma button styling (1px solid Jacarta border, 4px radius, 64px min-width, Source Sans Pro 15.8px/23.63px label) with Default/Selected/Hover states — Selected fills the background with Jacarta and flips the label to white; Hover applies a light Jacarta tint (AC7, UX-DR14).
- Completing Step 3 (both size and quality tier provided, in either entry order) calls `setSizeSqm`/`setQualityTier` then `useNavigate()` to `/estimate` (AC5, AC6).
- Header/Footer were NOT re-rendered on this page — remain mounted globally in `App.tsx` from Story 1.1.
- Responsive layout: content constrained to `840px` within the existing `1128px` shell, mobile-first via MUI `xs`/`md` breakpoints; no new hardcoded hex/rgba values — all colors/typography reuse `theme.ts` tokens (AC9).
- Validation: `npm run build` succeeds, `npm run lint` reports 0 problems, `npm run dev` serves `/questionnaire` with HTTP 200.
- **Post-review correction:** The page-level background color was missing — the content area behind the accordion cards rendered white instead of the Figma-specified light grey `#edf2f4` ("Mystic"/Grey 94%, node `9:12`). Root cause: during story creation I fetched Figma nodes `9:27`/`9:60`/`9:72` (individual card details) and `9:18` (address bar) but never fetched the parent wrapper node (`9:11`/`9:12`) that carries the page background — an incomplete node-coverage gap on my part, compounded by the WDS text spec also never mentioning this background color anywhere in its Layout Structure or Spacing sections. Added `colors.questionnaireBackground = '#edf2f4'` to `theme.ts` and applied it as the outer page `Box`'s `backgroundColor` in `QuestionnairePage.tsx`. Re-verified `npm run build` and `npm run lint` pass after the fix.

### File List

- `wds-cityscope-spike/package.json` (modified — re-added `@mui/icons-material` dependency)
- `wds-cityscope-spike/package-lock.json` (modified)
- `wds-cityscope-spike/src/data/mockRenovationOptions.ts` (created)
- `wds-cityscope-spike/src/components/AddressBar.tsx` (created)
- `wds-cityscope-spike/src/components/AccordionStep.tsx` (created)
- `wds-cityscope-spike/src/pages/QuestionnairePage.tsx` (modified — replaced placeholder with full page implementation; corrected to add the page-level `#edf2f4` background)
- `wds-cityscope-spike/src/theme.ts` (modified — added `colors.questionnaireBackground` token)

### Change Log

- 2026-08-13: Story implementation complete. Static renovation-options dataset, AddressBar, AccordionStep, and full QuestionnairePage built; single-open-accordion + single-select behavior wired to EstimateFlowContext; navigates to /estimate on completion. Build/lint verified. Status set to "review".
- 2026-08-13: Corrected the Questionnaire page's background color to match live Figma (node 9:12) — added `#edf2f4` page background, after user flagged a Figma-parity gap. Re-verified build/lint.
