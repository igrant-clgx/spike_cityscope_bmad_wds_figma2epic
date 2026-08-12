# Design Log: spike_cityscope_bmad_wds_figma2epic

## Progress

### 2026-08-12 — Phase 1: Product Brief Complete

**Agent:** Saga (Simplified Brief)
**Artifacts Created:**
- `A-Product-Brief/project-brief.md` — Simplified Product Brief (scope, challenge, design goals, constraints)

**Summary:** Captured the essential context for the ReactJS front-end rebuild of the Renovation Calculator Report — a standalone tool serving homeowners and real estate agents with a static-data estimate flow.

**Next:** Phase 2 — Trigger Mapping

---

### 2026-08-12 — Phase 2: Trigger Map Complete

**Agent:** Saga (Suggest mode)
**Artifacts Created:**
- `B-Trigger-Map/trigger-map.md` — Trigger Map hub document (vision, objectives, prioritized target groups, Mermaid diagram, design focus statement, cross-group patterns)
- `B-Trigger-Map/personas/hannah-the-homeowner.md` — Primary persona
- `B-Trigger-Map/personas/aiden-the-agent.md` — Secondary persona

**Summary:** Defined vision and 4 SMART objectives (3-month launch, 100% Figma parity, real user testing, ≤3-step flow), identified Hannah the Homeowner (primary) and Aiden the Agent (secondary) as target groups, mapped their driving forces, and prioritized Hannah's confidence/anxiety/overpaying fears as the design focus.

**Next:** Phase 3 — UX Scenarios

---

### 2026-08-12 — Phase 3: UX Scenarios Complete

**Agent:** Saga (Scenario Outline)
**Scenarios:** 1 scenario covering 3 pages
**Quality:** Excellent

**Artifacts Created:**
- `C-UX-Scenarios/00-ux-scenarios.md` — Scenario index
- `C-UX-Scenarios/01-hannahs-renovation-estimate/01-hannahs-renovation-estimate.md` — Hannah's Renovation Estimate
- `C-UX-Scenarios/01-hannahs-renovation-estimate/1.1-address-entry/1.1-address-entry.md` — Address Entry page spec
- `C-UX-Scenarios/01-hannahs-renovation-estimate/1.2-questionnaire/1.2-questionnaire.md` — Questionnaire page spec
- `C-UX-Scenarios/01-hannahs-renovation-estimate/1.3-estimate-report/1.3-estimate-report.md` — Estimate/Report Display page spec

**Summary:** Created a single linear scenario (Hannah's Renovation Estimate) covering all 3 core pages of the rebuild — address entry, 3-step questionnaire, and estimate display. Determined Aiden's usage shares the same flow rather than a separate scenario, since it's a standalone single-flow tool. All quality dimensions scored maximum (7/7, 7/7, 6/6, 4/4).

**Next:** Phase 4 — UX Design

---

### 2026-08-12 — Phase 4: Page 1.1 Address Entry Specified

**Agent:** Freya (Suggest mode, Figma reference)

**Design Loop Status:**

| Scenario | Page | Page Name | Status | Date |
|----------|------|-----------|--------|------|
| 01-hannahs-renovation-estimate | 1.1 | Address Entry | specified | 2026-08-12 |

**Artifacts Updated:**
- `C-UX-Scenarios/01-hannahs-renovation-estimate/1.1-address-entry/1.1-address-entry.md` — full page specification (layout, components/Object IDs, content, interactions, states, validation, spacing/typography tokens, tech notes, open questions)

**Summary:** Completed the full Phase 4 Specify workflow for Page 1.1 using the Figma reference (node 2:3) as ground truth. Pulled exact copy and measurements from Figma via Dev Mode MCP. Documented all components with Object IDs, exact px values alongside spacing/typography tokens (for 100% Figma parity), interaction behaviors, states, and validation rules. Noted MUI as the likely component library (Figma markup uses MUI class names) as a non-binding Tech Note for Phase 5.

**Next:** Specify Page 1.2 Questionnaire, or Page 1.3 Estimate/Report Display

---

### 2026-08-12 — Phase 4: Page 1.2 Questionnaire Specified

**Agent:** Freya (Suggest mode, Figma reference)

**Design Loop Status:**

| Scenario | Page | Page Name | Status | Date |
|----------|------|-----------|--------|------|
| 01-hannahs-renovation-estimate | 1.1 | Address Entry | specified | 2026-08-12 |
| 01-hannahs-renovation-estimate | 1.2 | Questionnaire | specified | 2026-08-12 |

**Artifacts Updated:**
- `C-UX-Scenarios/01-hannahs-renovation-estimate/1.2-questionnaire/1.2-questionnaire.md` — full page specification (layout, components/Object IDs, content, interactions, states, spacing/typography tokens, tech notes, open questions)

**Summary:** Completed the full Phase 4 Specify workflow for Page 1.2 using the Figma reference (node 9:90) as ground truth. Documented the 3-step accordion structure (Renovation Type expanded, What to Renovate + More Questions locked/46% opacity until prior step answered), address confirmation bar with "Enter new address" link back to 1.1, and exact px measurements alongside tokens. Flagged 4 open questions — notably that Step 2 and Step 3 content isn't visible in the Figma frame (collapsed state) and needs definition before development.

**Next:** Specify Page 1.3 Estimate/Report Display, or resolve open questions for Steps 2 & 3 content

---

### 2026-08-12 — Phase 4: Page 1.3 Estimate/Report Display Specified — Scenario 100% Specified

**Agent:** Freya (Suggest mode, Figma reference)

**Design Loop Status:**

| Scenario | Page | Page Name | Status | Date |
|----------|------|-----------|--------|------|
| 01-hannahs-renovation-estimate | 1.1 | Address Entry | specified | 2026-08-12 |
| 01-hannahs-renovation-estimate | 1.2 | Questionnaire | specified | 2026-08-12 |
| 01-hannahs-renovation-estimate | 1.3 | Estimate/Report Display | specified | 2026-08-12 |

**Artifacts Updated:**
- `C-UX-Scenarios/01-hannahs-renovation-estimate/1.3-estimate-report/1.3-estimate-report.md` — full page specification (layout, components/Object IDs, content, interactions, states, spacing/typography tokens, tech notes, open questions)

**Summary:** Completed the full Phase 4 Specify workflow for Page 1.3, the scenario's final page, using the Figma reference (node 9:172 — the full result page, found after node 2:94 turned out to be an incomplete/empty frame). Documented the Estimate Summary (cost range, renovation subtype), Additional Information accordion, Edit/New Estimate actions, Home Loan Coach CTA, and 2 renovation tips, with exact px measurements alongside tokens. Flagged 3 open questions, notably the underlying static calculation logic for the cost range and the collapsed accordion's content. **All 3 pages in "Hannah's Renovation Estimate" are now fully specified — Phase 4 UX Design is complete for this scenario.**

**Next:** Resolve open questions (7 total across all 3 pages) before/during Phase 5 implementation, or proceed to [P] Write Specifications review / [H] Design Delivery for developer handoff

---

### 2026-08-12 — Phase 4: Open Questions Resolved (4 of 7)

**Agent:** Freya

**Resolved:**
- Questionnaire Step 2 "What to renovate": single-select — Kitchen, Bathroom, Ensuite, Toilet, Paint Interior, Built in Wardrobe, Redo the floor, Convert to Bathroom
- Questionnaire Step 3 "More questions": Size (sq meters, numeric) + Quality tier (single-select: Budget/Standard/Premium)
- Estimate page "Additional Information" accordion: placeholder disclaimer text added (to be refined later)
- Estimate page "Edit Estimate" button: resets to Questionnaire Step 1 (does not preserve prior answers)

**Still Open (3):**
- Auto-expand behavior for Step 2/3 accordions on selection
- Whether answered accordion steps stay expanded or auto-collapse
- The static calculation/lookup logic behind the displayed cost range

**Artifacts Updated:**
- `1.2-questionnaire.md` — Step 2 & 3 content, Open Questions table
- `1.3-estimate-report.md` — Additional Information body content, Edit Estimate behavior, Open Questions table

---

### 2026-08-12 — Phase 4: All Open Questions Resolved (7 of 7) — Scenario Design Complete

**Agent:** Freya

**Resolved (final round):**
- Accordion behavior: single-expand pattern — answering a step auto-collapses it (retaining a visible selection summary) and auto-expands the next unlocked step; only one accordion step expanded at a time
- "Edit Estimate" button: **updated decision** — retains all 3 previous Questionnaire answers (supersedes earlier "resets to Step 1" decision)
- Cost calculation logic: deferred — static/mock values only for this iteration, no live calculation engine needed yet

**Artifacts Updated:**
- `1.2-questionnaire.md` — accordion interaction behavior (Step 1/2/3 buttons, section note, page states), Open Questions table fully resolved
- `1.3-estimate-report.md` — Edit Estimate behavior corrected to retain answers, Open Questions table fully resolved

**Summary:** All 7 open questions across the 3-page scenario are now resolved. "Hannah's Renovation Estimate" scenario is fully specified and development-ready, pending future refinement of the actual cost calculation logic (intentionally deferred — static values only for now).

**Next:** Proceed to Phase 5 (implementation) or [H] Design Delivery for developer handoff

## Key Decisions

| Date | Decision | Phase | By |
|------|----------|-------|-----|
| 2026-08-12 | Use Simplified Brief instead of Complete Brief, given scoped front-end rebuild | Phase 1: Product Brief | Saga + Igrant |
| 2026-08-12 | Treat Aiden's usage as sharing Hannah's scenario rather than a separate scenario chain | Phase 3: Scenarios | Saga + Igrant |
| 2026-08-12 | No variants for Address Entry page (single version) | Phase 4: UX Design | Freya + Igrant |
| 2026-08-12 | English only — no multilingual content needed | Phase 4: UX Design | Freya + Igrant |
| 2026-08-12 | Note MUI as likely component library (from Figma markup) as informational Tech Note, not binding design decision | Phase 4: UX Design | Freya + Igrant |
| 2026-08-12 | Questionnaire accordion uses single-expand pattern (one step open at a time, auto-collapse/expand on answer) | Phase 4: UX Design | Freya + Igrant |
| 2026-08-12 | "Edit Estimate" retains all prior Questionnaire answers (not a reset) | Phase 4: UX Design | Freya + Igrant |
| 2026-08-12 | Cost calculation logic deferred — static/mock values only for this iteration | Phase 4: UX Design | Freya + Igrant |
