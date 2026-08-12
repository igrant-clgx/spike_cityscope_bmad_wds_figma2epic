# 03: Marcus Compares Several Properties (New Estimate)

**Project:** spike_cityscope_bmad_wds_figma2epic
**Created:** 2026-08-13
**Method:** Whiteport Design Studio (WDS)

> ⚠️ Derived from `EXPERIENCE.md § Key Flows (UJ-2)` + the Figma — **pending owner confirmation.**
> Note: address-change keep-vs-reset behavior is carried open item **OI-7**.

---

## Transaction (Q1)

Marcus runs a clean second estimate for a different property so he can compare two renovation ranges side by side in his decision-making.

---

## Business Goal (Q2)

**Goal:** Support fast, reliable repeat use so the tool becomes a trusted first-pass filter.
**Objective:** Objective 1 (speed) + Objective 3 (consistent, defensible method across runs).

---

## User & Situation (Q3)

**Persona:** Marcus (SECONDARY 💼)
**Situation:** An investor comparing renovations across two properties has just finished the first estimate.

---

## Driving Forces (Q4)

**Hope:** To start a fresh, clean estimate for the next address quickly.
**Worry:** That switching properties silently corrupts or carries over prior answers.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Desktop (likely) / Mobile.
**Entry:** On the Results view of his first property's estimate.

---

## Best Outcome (Q7)

**User Success:** Runs a second estimate from a clean slate and compares the two ranges confidently.
**Business Success:** Repeat usage; the address-change + reset paths prove robust (reliability signal).

---

## Shortest Path (Q8)

1. **Results view** — taps **New Estimate** (primary — full reset, distinct from Edit).
2. **Calculator page (empty state)** — enters the second property address (or uses the "Enter new address" modal).
3. **Steps 1–3 → Results** — runs the flow again from a clean state and reads the second range to compare. ✓

---

## Trigger Map Connections

**Persona:** Marcus (SECONDARY 💼)

**Driving Forces Addressed:**
- ✅ **Want:** Fast re-runs; easy, safe address change.
- ❌ **Fear:** Address change corrupting prior answers — answered by an explicit reset via New Estimate / change modal (OI-7 to confirm).

**Business Goal:** Objective 1 (speed) + Objective 3 (consistent method).

---

## Scenario Steps

**First step** (03.1) includes full entry context (Q3 + Q4 + Q5 + Q6).

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 03.1 | `03.1-results-new-estimate/` | Reset to a clean estimate | Tap New Estimate → empty state |
| 03.2 | `03.2-address-second-property/` | Enter the next property address | Confirm address → Step 1 opens |
| 03.3 | `03.3-rerun-and-compare/` | Re-run Steps 1–3, read second range | View range to compare ✓ |

_Back to [Scenario Index](../00-ux-scenarios.md)_
