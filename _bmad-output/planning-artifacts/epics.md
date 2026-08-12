---
stepsCompleted: [step-01, step-02, step-03, step-04]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-spike_cityscope_bmad_wds_figma2epic-2026-08-12/prd.md"
  - "_bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md"
  - "_bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.1-address-entry/1.1-address-entry.md"
  - "_bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.2-questionnaire/1.2-questionnaire.md"
  - "_bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.3-estimate-report/1.3-estimate-report.md"
---

# spike_cityscope_bmad_wds_figma2epic - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for spike_cityscope_bmad_wds_figma2epic, decomposing the requirements from the PRD, WDS UX Design specs, and Architecture Spine into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User can enter/select a property address and proceed to the Questionnaire (static/mock address dataset; no live lookup).
FR2: User can complete a 3-step renovation questionnaire (renovation type → what to renovate → size/quality tier) with single-open-accordion, auto-expand behavior, then proceed to the Estimate Report.
FR3: User can view a cost estimate (static/mock value) derived from their questionnaire answers, plus placeholder "how this was calculated" info.
FR4: User can edit their estimate answers, returning to the Questionnaire with all 3 previous answers retained (no reset).

### NonFunctional Requirements

NFR1: 100% Figma visual/measurement parity — exact px spacing, typography, and color tokens as documented in the WDS specs (project's #1 design objective per Trigger Map).
NFR2: Mobile-first responsive design, scaling to desktop (1128px max content width); touch-first + mouse/keyboard interaction support.
NFR3: Front-end only — no backend/API calls in this phase; all data (addresses, cost estimates) sourced from static/mock modules.
NFR4: Public visibility, no authentication — standalone tool accessed via direct URL.

### Additional Requirements

- **Tech stack (from Architecture Spine):** Vite + React 18 + TypeScript + MUI (@mui/material) + React Router — no starter template beyond this; greenfield scaffold.
- **State management (AD-1):** All flow answers (address, renovationType, whatToRenovate, sizeSqm, qualityTier) live in a single shared `EstimateFlowContext` mounted above the router — never per-page local state for flow data.
- **Component library (AD-2):** All UI primitives built on MUI components (Grid2, Accordion, FormControl, Button) to match Figma's MUI-based export.
- **No backend/API integration (AD-3):** Static data modules under `src/data/` (e.g. `mockAddresses.ts`, `mockEstimates.ts`) — no fetch/axios calls.
- **Accordion contract (AD-4):** Single-select Step 2; only one questionnaire step expanded at a time.
- **Source tree convention:** `src/pages/`, `src/components/`, `src/context/`, `src/data/`, `src/App.tsx` (router + context provider).

### UX Design Requirements

UX-DR1: Header component — Cannon Black `#1E1405` background, 68.98px fixed height, Cotality logo (links to cotality.com) + partner logo. Shared identically across all 3 pages (`addr-header` / `qst-header` / `est-header`).

UX-DR2: Footer component — Cannon Black `#1E1405` background, ~81.44-81.45px fixed height, 3-line legal disclaimer text. Shared identically across all 3 pages.

UX-DR3: Address Entry page (1.1) — Hero section (H1 "Renovation Calculator Report", intro text), Address Input field (search icon adornment, 52px height, 10px border-radius, debounced autocomplete against static dataset, Default/Focus/Filled/Error states, error message "We couldn't find that address — try Use advanced search"), "Address not showing? / USE ADVANCED SEARCH" fallback link.

UX-DR4: Address Bar component (shared, dynamic) — displays the confirmed address + "Enter new address" link; appears on Questionnaire (1.2) and Estimate Report (1.3) pages, populated from flow state.

UX-DR5: Questionnaire accordion (Step 1: Renovation Type) — question "Is an Internal or External renovation?", two toggle buttons (Internal/External, Default/Selected/Hover states). Expanded by default; on selection, auto-collapses to a retained summary and auto-expands Step 2.

UX-DR6: Questionnaire accordion (Step 2: What to Renovate) — locked/46% opacity until Step 1 answered; single-select from: Kitchen, Bathroom, Ensuite, Toilet, Paint Interior, Built in Wardrobe, Redo the floor, Convert to Bathroom. On selection, auto-collapses to summary and auto-expands Step 3.

UX-DR7: Questionnaire accordion (Step 3: More Questions) — locked/46% opacity until Step 2 answered; fields: Size (sq. meters, numeric input) and Quality Tier (single-select: Budget/Standard/Premium). Completing this triggers navigation to Estimate Report (1.3).

UX-DR8: Estimate Summary section — "ESTIMATED RENOVATION COST" heading (uppercase), dynamic renovation type/subtype text (e.g. "Internal Renovation: Kitchen"), large numeric cost range display (e.g. "$32,700 - $40,000", static/mock calculated value), disclaimer text.

UX-DR9: Additional Information accordion (collapsed by default) — header "Additional Information - How this was calculated"; expands to show placeholder disclaimer body text.

UX-DR10: Action Buttons — "Edit Estimate" (outlined button, navigates to 1.2 with all 3 answers pre-filled/retained) and "New Estimate" (filled/primary button, Jacarta bg, navigates to 1.1, clears prior answers).

UX-DR11: Home Loan Coach CTA block — heading, "Call us" label + phone icon, phone number as clickable `tel:` link, 3-line business-hours text block.

UX-DR12: Tips section — 2 static tip paragraphs (insurance, local council).

UX-DR13: Design tokens — Poppins + Source Sans Pro typefaces at exact px sizes per WDS spec tables; color tokens Cannon Black `#1E1405`, Jacarta `#432A6E`, various rgba(17,11,28, alpha) text colors; content max-width 1128px (desktop), 840px content container on Questionnaire/Estimate pages.

UX-DR14: Accessibility/interaction states — every interactive element (input, button, accordion header, link) must implement its documented Default/Hover/Selected/Focus/Error states per the WDS specs — not just a static visual, since these states are explicitly part of each page's Page States table.

### FR Coverage Map

FR1: Epic 1 - User can enter/select a property address (includes project scaffold + shared Header/Footer/Context since this is the entry screen)
FR2: Epic 2 - User can complete the 3-step renovation questionnaire (accordion, single-select, auto-expand)
FR3: Epic 3 - User can view a static/mock calculated cost estimate
FR4: Epic 3 - User can edit their estimate answers, retaining all 3 previous answers

## Epic List

### Epic 1: Address Entry & Project Foundation
Users can open the tool and enter/select a property address to begin their renovation estimate. Includes project scaffold (Vite/React/TS/MUI setup, shared `EstimateFlowContext`, shared Header/Footer) since address entry is the first screen and needs them to exist.
**FRs covered:** FR1
**NFRs:** NFR1 (Figma parity), NFR2 (responsive), NFR3 (front-end only/static data), NFR4 (no-auth)
**UX-DRs:** UX-DR1, UX-DR2, UX-DR3, UX-DR13, UX-DR14

### Epic 2: Renovation Questionnaire
Users can answer the 3-step accordion (renovation type → what to renovate → size/quality tier) and proceed to their estimate.
**FRs covered:** FR2
**UX-DRs:** UX-DR4 (address bar), UX-DR5, UX-DR6, UX-DR7

### Epic 3: Estimate Report
Users can view their calculated cost estimate, review supporting info, and either edit their answers (retained) or start a new estimate.
**FRs covered:** FR3, FR4
**UX-DRs:** UX-DR4 (shared), UX-DR8, UX-DR9, UX-DR10, UX-DR11, UX-DR12

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: Address Entry & Project Foundation

Users can open the tool and enter/select a property address to begin their renovation estimate. Establishes the project scaffold and shared shell (header, footer, flow-state context) that all subsequent pages build on.

### Story 1.1: Project Scaffold & Shared Shell

As a developer,
I want the React project scaffolded with the approved stack and shared shell components,
So that subsequent pages can be built consistently on a working foundation.

**Acceptance Criteria:**

**Given** no project exists yet
**When** the project is scaffolded
**Then** a Vite + React 18 + TypeScript project is created with `@mui/material` and `react-router-dom` installed
**And** the source tree matches the Architecture Spine's Structural Seed (`src/pages/`, `src/components/`, `src/context/`, `src/data/`, `src/App.tsx`)

**Given** the scaffolded project
**When** `EstimateFlowContext` is implemented
**Then** it exposes a single shared state object `{ address, renovationType, whatToRenovate, sizeSqm, qualityTier }` with setters
**And** it is mounted above the router in `App.tsx` so all pages share one instance (AD-1)

**Given** the scaffolded project
**When** the shared `Header` component is implemented
**Then** it renders with Cannon Black `#1E1405` background, fixed height 68.98px, Cotality logo (linking to https://www.cotality.com/ in a new tab) and a static partner logo, per UX-DR1

**Given** the scaffolded project
**When** the shared `Footer` component is implemented
**Then** it renders with Cannon Black `#1E1405` background, fixed height ~81.44-81.45px, and the 3-line legal disclaimer text, per UX-DR2

**Given** the shared shell components exist
**When** viewed on mobile and desktop breakpoints
**Then** layout is mobile-first responsive, scaling to a 1128px max content width on desktop (NFR2)
**And** Poppins and Source Sans Pro typefaces are loaded and available for use at the exact px sizes documented per page (UX-DR13)

### Story 1.2: Enter Property Address

As Hannah (homeowner),
I want to enter or select my property address,
So that I can begin the renovation cost estimation flow.

**Acceptance Criteria:**

**Given** I land on the Address Entry page via direct URL
**When** the page loads
**Then** I see the header, hero heading "Renovation Calculator Report", intro text "Please type property address below:", an empty address input (placeholder "Enter Address"), supporting text, the "Address not showing? / USE ADVANCED SEARCH" fallback link, and the footer — matching UX-DR3 layout, spacing, and typography exactly (NFR1)

**Given** the address input is empty
**When** I type into the field
**Then** a debounced autocomplete suggestion list appears, sourced from a static/mock address dataset (FR1, NFR3 — no live API)

**Given** autocomplete suggestions are showing
**When** I select a valid suggestion
**Then** the field shows the selected address (Filled state) and I am able to proceed to the Questionnaire (1.2 page)

**Given** I type an address with no matching suggestions
**When** no results are found
**Then** the input shows an Error state with the message "We couldn't find that address — try Use advanced search" (`ERR_ADDRESS_NOT_FOUND`)
**And** the "USE ADVANCED SEARCH" link remains available as a fallback

**Given** the address input field
**When** I focus, hover, or interact with it
**Then** it implements Default / Focus / Filled / Error states exactly as documented in the WDS spec (UX-DR14)

**Given** I have selected a valid address
**When** I proceed
**Then** the address is stored in `EstimateFlowContext` and I am navigated to the Questionnaire page (enables Epic 2)

## Epic 2: Renovation Questionnaire

Users can answer the 3-step accordion (renovation type → what to renovate → size/quality tier) and proceed to their estimate.

### Story 2.1: Complete 3-Step Renovation Questionnaire

As Hannah (homeowner),
I want to answer 3 quick questions about my renovation (type, what to renovate, size/quality tier),
So that I can get through the questionnaire quickly and reach my estimate.

**Acceptance Criteria:**

**Given** I arrive on the Questionnaire page from Address Entry
**When** the page loads
**Then** I see the shared header, an Address Bar showing my confirmed address with an "Enter new address" link, Step 1 (Renovation Type) expanded, and Steps 2 & 3 locked at 46% opacity — matching UX-DR4/5/6/7 layout, spacing, and typography exactly (NFR1)

**Given** the Address Bar is visible
**When** I click "Enter new address"
**Then** I am navigated back to the Address Entry page (1.1)

**Given** Step 1 (Renovation Type) is expanded
**When** I select "Internal" or "External"
**Then** the selection is stored in `EstimateFlowContext`, Step 1 auto-collapses showing a retained summary of my selection, and Step 2 unlocks and auto-expands (only one step expanded at a time, per AD-4)

**Given** Step 2 (What to Renovate) is now unlocked and expanded
**When** I select one option from Kitchen, Bathroom, Ensuite, Toilet, Paint Interior, Built in Wardrobe, Redo the floor, or Convert to Bathroom
**Then** the single-select choice is stored in `EstimateFlowContext`, Step 2 auto-collapses showing a retained summary, and Step 3 unlocks and auto-expands

**Given** Step 3 (More Questions) is now unlocked and expanded
**When** I enter a size in square meters and select a Quality Tier (Budget / Standard / Premium)
**Then** both values are stored in `EstimateFlowContext`

**Given** all 3 steps are answered
**When** Step 3 is completed
**Then** I am navigated to the Estimate Report page (1.3), enabling Epic 3

**Given** any accordion step, button, or link
**When** I interact with it (hover, focus, select)
**Then** it implements its documented Default/Selected/Hover/Locked states exactly as specified in the WDS spec (UX-DR14)

**Given** Steps 2 and 3 are locked
**When** I attempt to interact with them before their prior step is answered
**Then** they remain non-interactive at 46% opacity and do not respond to input

## Epic 3: Estimate Report

Users can view their calculated cost estimate, review supporting info, and either edit their answers (retained) or start a new estimate.

### Story 3.1: View Cost Estimate & Supporting Info

As Hannah (homeowner),
I want to see my calculated renovation cost estimate and supporting information,
So that I feel confident using the estimate in my decision-making.

**Acceptance Criteria:**

**Given** I arrive on the Estimate Report page after completing the Questionnaire
**When** the page loads
**Then** I see the shared header, an Address Bar showing my confirmed address with an "Enter new address" link, the Estimate Summary block, the Additional Information accordion (collapsed), the Home Loan Coach CTA, the Tips section, and the shared footer — matching UX-DR4/8/9/11/12 layout, spacing, and typography exactly (NFR1)

**Given** the Estimate Summary block
**When** displayed
**Then** it shows the "ESTIMATED RENOVATION COST" heading (uppercase), a dynamic renovation type/subtype line (e.g. "Internal Renovation: Kitchen") derived from my Questionnaire answers, a static/mock cost range (e.g. "$32,700 - $40,000"), and the disclaimer "These are estimates to help you plan." (FR3, NFR3 — static/mock value, no live calculation)

**Given** the Additional Information accordion is collapsed by default
**When** I click its header "Additional Information - How this was calculated"
**Then** it expands to reveal the placeholder disclaimer body text

**Given** the Home Loan Coach CTA block
**When** displayed
**Then** it shows the heading, "Call us" label with phone icon, the phone number as a clickable `tel:` link, and the 3-line business-hours text block

**Given** the Tips section
**When** displayed
**Then** it shows the 2 static tip paragraphs (insurance, local council)

**Given** any interactive element on this page (accordion header, phone link, address-bar link)
**When** I interact with it (hover, focus, click)
**Then** it implements its documented Default/Hover states exactly as specified in the WDS spec (UX-DR14)

### Story 3.2: Edit Estimate / New Estimate Actions

As Hannah (homeowner),
I want to either tweak my answers or start a completely new estimate,
So that I can adjust my renovation details without losing my previous work, or start fresh for a different property.

**Acceptance Criteria:**

**Given** I am on the Estimate Report page
**When** the Action Buttons row is displayed
**Then** I see an outlined "Edit Estimate" button and a filled/primary "New Estimate" button (Jacarta background, white text), per UX-DR10

**Given** I click "Edit Estimate"
**When** navigation occurs
**Then** I am returned to the Questionnaire page (1.2) with all 3 previous answers (renovation type, what to renovate, size/quality tier) still stored in `EstimateFlowContext` and pre-filled/visible as retained summaries — no reset (FR4)

**Given** I click "New Estimate"
**When** navigation occurs
**Then** I am navigated to the Address Entry page (1.1) and all prior answers in `EstimateFlowContext` are cleared, giving me a fresh start

**Given** the Edit Estimate and New Estimate buttons
**When** I interact with them (hover, focus)
**Then** they implement their documented Default/Hover/Pressed states exactly as specified in the WDS spec (UX-DR14)

