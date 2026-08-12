---
title: Renovation Calculator (React Rebuild)
created: 2026-08-12
updated: 2026-08-12
status: final
---

# PRD: Renovation Calculator (React Rebuild)
*Working title — confirm.*

## 0. Document Purpose

This PRD is scoped for a hobby/spike-level rebuild: a front-end-only ReactJS re-platform of an existing "Renovation Calculator Report" tool. It is written for downstream workflow owners (`bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-create-story`, `bmad-dev-story`). **UX is already fully specified** in the WDS (Whiteport Design Studio) design package — this PRD does not restate screen-level behavior, layout, or interaction detail. It references those specs as the authoritative UX source:
- `_bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.1-address-entry/1.1-address-entry.md`
- `_bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.2-questionnaire/1.2-questionnaire.md`
- `_bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.3-estimate-report/1.3-estimate-report.md`

## 1. Vision

Rebuild the legacy Renovation Calculator Report as a modern ReactJS front-end. The tool lets a user enter a property address, answer a short questionnaire about the renovation they're considering, and see a cost estimate — all in one self-contained flow, accessed via direct URL, with no login. This spike validates that the WDS-authored design package (pixel-accurate Figma specs) can flow cleanly through the BMAD epics/stories/dev pipeline. **v1 uses static/mock data** — no real cost-calculation logic or backend integration.

## 2. Target User

### 2.1 Jobs To Be Done
- As a homeowner (Hannah), I want a fast, trustworthy renovation cost estimate so I can decide whether to renovate or avoid a "money pit" property.
- As a real estate agent (Aiden), I want a shareable estimate report to support a property listing conversation.

### 2.3 Key User Journeys

- **UJ-1. Hannah gets a renovation estimate.**
  Hannah, considering a property, opens the tool via a direct link on her phone. She enters the property address, works through a 3-step questionnaire (renovation type → what to renovate → size/quality tier), and lands on a report showing a static cost estimate she can review or edit. **Realizes:** the full flow is detailed page-by-page in the WDS specs referenced above (§0).

*[ASSUMPTION: Aiden's journey is structurally identical to Hannah's for v1 — no separate agent-specific UI branch exists in the current Figma/WDS specs. Confirm before architecture/epics if agent-specific views are actually needed.]*

## 3. Glossary

- **Address Entry** — Page 1.1; the entry point where the user provides a property address.
- **Questionnaire** — Page 1.2; a 3-step accordion (Renovation Type → What to Renovate → Size/Quality Tier) capturing renovation scope.
- **Estimate Report** — Page 1.3; displays the resulting cost estimate, plus an "Edit Estimate" action that retains prior answers.
- **Renovation Type** — Step 1 selection: Internal or External.
- **What to Renovate** — Step 2 single-select option (Kitchen, Bathroom, Ensuite, Toilet, Paint Interior, Built-in Wardrobe, Redo the Floor, Convert to Bathroom).
- **Quality Tier** — Step 3 selection: Budget, Standard, or Premium, paired with a size (sq. meters) input.

## 4. Features

### 4.1 Address Entry
**Description:** User provides a property address to begin the flow. No backend lookup in v1 — see WDS spec `1.1-address-entry.md` for full layout, states, and validation. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Enter property address
User can enter/select a property address and proceed to the Questionnaire.

**Consequences (testable):**
- Submitting a non-empty address navigates the user to Page 1.2 (Questionnaire).
- An "Address not showing?" / advanced search path exists for addresses not found. *[ASSUMPTION: exact advanced-search behavior deferred to WDS spec + open items noted there.]*

**Out of Scope:** Real address lookup/geocoding API — static/mock dataset only.

### 4.2 Questionnaire
**Description:** A 3-step accordion capturing renovation type, what to renovate, and size/quality tier. Only one step is expanded at a time; completed steps collapse to a summary. See WDS spec `1.2-questionnaire.md` for full interaction/accordion behavior. Realizes UJ-1.

**Functional Requirements:**

#### FR-2: Complete 3-step renovation questionnaire
User can select a renovation type (Step 1), a single "what to renovate" option (Step 2), and a size + quality tier (Step 3), then proceed to the Estimate Report.

**Consequences (testable):**
- Each step auto-expands the next upon completion of the prior step; only one step is expanded at a time.
- All 3 steps must be completed before the user can proceed to Page 1.3.

**Out of Scope:** Multi-select in Step 2 (single-select only, per WDS spec).

### 4.3 Estimate Report
**Description:** Displays the resulting cost estimate using static/mock values, plus supporting info and an edit path. See WDS spec `1.3-estimate-report.md` for full layout, accordion, and CTA detail. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: View cost estimate
User can view a cost estimate generated from their questionnaire answers.

**Consequences (testable):**
- Page displays a cost estimate value sourced from static/mock data (no live calculation in v1).
- An "Additional Information" accordion displays placeholder disclaimer content.

**Out of Scope:** Real cost-calculation/lookup logic — explicitly deferred (static values only for this spike).

#### FR-4: Edit estimate answers
User can return to the questionnaire to change answers, with prior answers retained.

**Consequences (testable):**
- Selecting "Edit Estimate" returns the user to the Questionnaire with all previously selected answers pre-filled — no reset.

## 5. Non-Goals (Explicit)

- No backend/API integration in this phase — front-end only, static/mock data throughout.
- No real cost-calculation engine — deferred to a future phase.
- No authentication, user accounts, or saved history.
- No lead-capture, contact-request, or quote-follow-up flow — success is simply displaying the estimate.

## 6. MVP Scope

### 6.1 In Scope
- 3-page flow: Address Entry → Questionnaire → Estimate Report, matching the WDS Figma-accurate specs exactly.
- Static/mock data for address validation and cost estimate values.
- Edit Estimate retains prior answers.

### 6.2 Out of Scope for MVP
- Real address lookup (deferred — reason: no backend in this phase).
- Real cost-calculation logic (deferred — reason: explicitly out of scope per project brief; static values only).
- Agent-specific (Aiden) UI variant, if one turns out to be needed (deferred pending confirmation — see UJ-1 assumption).

## 7. Success Metrics

**Primary**
- **SM-1**: User can complete the 3-page flow end-to-end and see a cost estimate. Validates FR-1, FR-2, FR-3.

**Secondary**
- **SM-2**: Editing an estimate retains all previously entered answers (no data loss). Validates FR-4.

**Counter-metrics (do not optimize)**
- **SM-C1**: Do not over-invest in address-lookup or calculation-engine accuracy in this phase — both are intentionally static/deferred. Counterbalances SM-1.

## 8. Open Questions

1. Is Aiden's (real estate agent) journey truly identical to Hannah's, or does it need a distinct view/report format? *(carried from UJ-1 assumption)*
2. When (future phase) will real cost-calculation logic replace static values, and what's the data source?
3. Will a formal address-lookup API be integrated later, or does static/mock data remain permanent for this tool?

## 9. Assumptions Index

- §2.3 — Aiden's journey assumed structurally identical to Hannah's for v1; no separate agent UI exists in current specs.
- §4.1 — "Address not showing?" advanced search behavior deferred to WDS spec + its own open items.
