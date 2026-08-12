---
design_intent: S
design_status: not-started
---

# 01: Hannah's Renovation Estimate

**Project:** spike_cityscope_bmad_wds_figma2epic
**Created:** 2026-08-12
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)

**What this scenario covers:**
Getting a trustworthy renovation cost estimate for a specific property before making a buy/reno decision.

---

## Business Goal (Q2)

**Goal:** Achieve 100% visual/UX parity with the existing Figma design, keeping the estimate journey to ≤3 steps.
**Objective:** Launch the rebuilt React front-end within 3 months and validate it with real user testing.

---

## User & Situation (Q3)

**Persona:** Hannah the Homeowner (Primary)
**Situation:** Mid-30s to 50s, browsing on her phone or laptop in spare moments — either considering renovating her current home or eyeing a new property before purchase.

---

## Driving Forces (Q4)

**Hope:** Get a fast, clear cost estimate she can trust without chasing contractors.

**Worry:** Discovering the property is a "money pit" with hidden renovation costs after she's already committed.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile (primary), also usable on desktop
**Entry:** Opens the direct URL for the Renovation Calculator (shared link or bookmarked tool) on her phone while thinking about a property she's interested in.

---

## Best Outcome (Q7)

**User Success:**
Hannah sees a clear renovation cost estimate for her property and feels confident using it to inform her buy/reno decision.

**Business Success:**
A completed end-to-end flow session, contributing to the real-user-testing validation goal within the 3-month window.

---

## Shortest Path (Q8)

1. **Address Entry** — Hannah types in the property address to start.
2. **Questionnaire** — She answers 3 quick questions (renovation type: internal/external → what to renovate → more questions).
3. **Estimate/Report Display** — She sees her renovation cost estimate. ✓

---

## Trigger Map Connections

**Persona:** Hannah the Homeowner (Primary)

**Driving Forces Addressed:**
- ✅ **Want:** Confidence before a big decision / an effortless answer
- ❌ **Fear:** Vague quotes anxiety / buying a "money pit"

**Business Goal:** 100% Figma parity + ≤3-step flow (Objective 2 & 4), supporting the 3-month launch and real user testing (Objective 1 & 3).

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 1.1 | `1.1-address-entry/` | Enter property address to start | Submits/selects address, proceeds to questionnaire |
| 1.2 | `1.2-questionnaire/` | Answer 3-step renovation questionnaire | Completes final question, proceeds to estimate |
| 1.3 | `1.3-estimate-report/` | View renovation cost estimate | Final — scenario success ✓ |

**First step** (1.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
