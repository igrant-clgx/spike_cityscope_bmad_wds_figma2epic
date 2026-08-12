# 01: Priya's Honest Renovation Number

**Project:** spike_cityscope_bmad_wds_figma2epic
**Created:** 2026-08-13
**Method:** Whiteport Design Studio (WDS)

> ⚠️ Derived from `EXPERIENCE.md § Key Flows (UJ-1)` + the Figma (node `9:90`) — **pending owner confirmation.**

---

## Transaction (Q1)

Priya gets a credible, obligation-free renovation cost **range** for her own home, and — because she wasn't pushed — chooses to reach out about financing.

---

## Business Goal (Q2)

**Goal:** Fast, credible cost clarity that converts genuine intent into a qualified lead.
**Objective:** Trigger Map Objective 1 (< 5 min flow) + Objective 2 (> 15% finishers → lead).

---

## User & Situation (Q3)

**Persona:** Priya (PRIMARY ⭐)
**Situation:** A homeowner planning a kitchen-and-bathroom refresh lands on the calculator one evening, phone or laptop in hand, wanting a ballpark before she commits to anything.

---

## Driving Forces (Q4)

**Hope:** To get a believable number fast, without handing over her details upfront.
**Worry:** That it's a sales trap or the figure is made-up.

---

## Device & Starting Point (Q5 + Q6)

**Device:** Desktop (authoritative) / Mobile (reflows the same single column).
**Entry:** Arrives on the calculator page directly (Demo Channel link or search); no account.

---

## Best Outcome (Q7)

**User Success:** Sees a credible cost *range* in under five minutes and feels she got a straight answer.
**Business Success:** Priya voluntarily opts in — a qualified lead reaches the Home Loan Coach carrying her scope + estimate context (satisfies the Coach persona's need).

---

## Shortest Path (Q8)

1. **Calculator page (empty state)** — enters her property address; selects the autocomplete suggestion.
2. **Step 1 — Renovation type** — taps **Internal**; the button fills.
3. **Step 2 — What to renovate** — multi-selects **Kitchen** and **Bathroom**; continues.
4. **Step 3 — More questions** — answers a couple of quick per-item details; submits.
5. **Results view** — a brief calculating moment, then the cost **range** reveals (large centered figure + calm "this is a guide" disclaimer + "how this was calculated" explainer). ✓
6. **Contact Section** — "Talk to a Home Loan Coach"; unpressured, she taps **Call us: 0800 269 4663** (or completes the consent-gated lead form if that path ships — OI-10). ✓

---

## Trigger Map Connections

**Persona:** Priya (PRIMARY ⭐)

**Driving Forces Addressed:**
- ✅ **Want:** A credible range fast, with almost no effort; stays anonymous until she chooses to engage.
- ❌ **Fear:** The sales-funnel trap / a made-up number — answered by "trust before ask" + range + disclaimer.

**Business Goal:** Objective 1 (< 5 min) + Objective 2 (> 15% lead conversion).

---

## Scenario Steps

**First step** (01.1) includes full entry context (Q3 + Q4 + Q5 + Q6).

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 01.1 | `01.1-address-empty-state/` | Enter property address (empty/initial state) | Select autocomplete suggestion → Step 1 opens |
| 01.2 | `01.2-step1-renovation-type/` | Choose Internal/External (single-select) | Tap Internal → Step 2 opens |
| 01.3 | `01.3-step2-items/` | Multi-select renovation items (≥1) | Continue → Step 3 opens |
| 01.4 | `01.4-step3-details/` | Answer dynamic per-item questions | Submit → calculating |
| 01.5 | `01.5-results-range-card/` | Reveal credible cost range + disclaimer + explainer | View range ✓ |
| 01.6 | `01.6-contact-section/` | Offer coach conversation after value | Tap Call us (or submit consent-gated lead) ✓ |

_Back to [Scenario Index](../00-ux-scenarios.md)_
