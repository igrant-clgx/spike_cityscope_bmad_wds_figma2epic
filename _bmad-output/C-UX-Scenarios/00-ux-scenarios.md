# UX Scenarios: Spike Reno Calculator

> Scenario outlines connecting Trigger Map personas to concrete user journeys

**Created:** 2026-08-13
**Author:** Igrant with Saga (WDS Strategic Analyst)
**Method:** Whiteport Design Studio (WDS)
**Branch:** ig-figma-to-bmad-ux

> ⚠️ Derived from `EXPERIENCE.md § Key Flows (UJ-1/2/3)`, the Trigger Map, and the Figma
> (node `9:90`). Owner unavailable at authoring — **pending owner confirmation.**

---

## Scenario Summary

| ID | Scenario | Persona | Pages | Priority | Status |
|----|----------|---------|-------|----------|--------|
| 01 | Priya's honest renovation number | Priya (Homeowner) | 6 steps / 1 page (2 states) | ⭐ P1 | ✅ Outlined |
| 02 | Priya adjusts one answer (Edit Estimate) | Priya (Homeowner) | 3 steps / 1 page | ⭐ P1 | ✅ Outlined |
| 03 | Marcus compares several properties | Marcus (Investor) | 3 steps / 1 page | P2 | ✅ Outlined |

> **Note on "pages":** the product is a single scrolling page with two states (form / results).
> "Steps" are the sunshine-path beats through that page, not separate routes
> (`EXPERIENCE.md § IA`: "the results view and the form are the same page in two states").

> **Stakeholder journey (UJ-3 — the Coach receives a qualified lead)** has **no product UI** —
> it's the business outcome of Scenario 01's conversion step. It is captured as the *Business
> Success* of Scenario 01 rather than as its own page-bearing scenario.

---

## Scenarios

### [01: Priya's honest renovation number](01-priya-honest-number/01-priya-honest-number.md)
**Persona:** Priya — wants a credible range fast without a sales trap
**Pages:** address empty-state → Step 1 → Step 2 → Step 3 → results range card → contact section
**User Value:** A believable cost range in under five minutes, no obligation.
**Business Value:** A voluntary, well-contextualised lead reaches the Home Loan Coach (Objective 2).

---

### [02: Priya adjusts one answer (Edit Estimate)](02-priya-edit-estimate/02-priya-edit-estimate.md)
**Persona:** Priya — wants to tweak one answer without starting over
**Pages:** results (edit action) → Step 2 (deselect) → results (revised range)
**User Value:** Instant "what-if" with all other answers preserved.
**Business Value:** Higher trust and dwell time; fewer abandonments.

---

### [03: Marcus compares several properties](03-marcus-compare-properties/03-marcus-compare-properties.md)
**Persona:** Marcus — wants fast, clean repeat estimates across addresses
**Pages:** results (new estimate) → address (second property) → re-run Steps 1–3 → results
**User Value:** A clean second estimate to compare, without corrupted state.
**Business Value:** Repeat usage; proves the address-change + reset paths are robust.

---

## Page Coverage Matrix

| Surface / State | Scenario(s) | Purpose in Flow |
|-----------------|-------------|-----------------|
| Address block — empty/initial | 01, 03 | Enter property address to start |
| Step 1 — Renovation type | 01, 03 | Single-select Internal/External |
| Step 2 — What to renovate | 01, 02, 03 | Multi-select items (≥1) |
| Step 3 — More questions | 01, 03 | Dynamic per-item detail questions |
| Results — cost range card | 01, 02, 03 | Reveal credible range + disclaimer + explainer |
| Results — contact section | 01 | Offer coach conversation after value (CTA / lead form) |
| Address change modal | 03 | Safe re-entry with dependent-scope reset (OI-7) |
| Results — Edit / New Estimate actions | 02, 03 | Preserve (Edit) vs reset (New) |

**Coverage:** all authoritative surfaces from `EXPERIENCE.md § IA` are assigned to at least one scenario.

---

## Open Items Carried Into Design
- **OI-1/OI-2** — final Step 2 item list and Step 3 question set (candidate-only).
- **OI-7** — address-change keep-vs-reset behavior.
- **OI-8** — step progression (explicit Continue vs auto-advance).
- **OI-10** — phone-CTA vs consent-gated lead form as the conversion path (affects Scenario 01 step 6).

---

## Next Phase

These scenario outlines feed into **Phase 4: UX Design**, where each step/surface gets:
- Detailed page specifications (Figma-grounded — pixels are source of truth)
- Wireframe/visual references pulled from the actual Figma
- Component definitions and interaction details

---

_Generated with Whiteport Design Studio framework_
