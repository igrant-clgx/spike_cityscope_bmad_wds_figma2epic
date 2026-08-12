# Requirements Traceability Matrix — Spike Reno Calculator

**Author:** Sally (UX Designer, BMad Method)
**Owner:** Igrant
**Date:** 2026-08-12
**Status:** Draft for BMAD planning
**Purpose:** Map each key requirement **back** to its source (Figma / Saga analysis / Freya handover) and **forward** to the screen/component it affects, and flag OPEN ITEMS with recommended owners for resolution during planning.

Requirement IDs reference `functional-requirements.md`. UX references `ux-requirements.md`.

---

## 1. Traceability Matrix (backward + forward)

| Req ID | Requirement (short) | Source (backward) | Screen / Component (forward) |
|--------|---------------------|-------------------|------------------------------|
| FR-1 | Header w/ product + partner logos | `FIGMA_ANALYSIS.md §3` (header-logo ~125px, company-logo ~128px); `HANDOVER_03` §Header | Header / Grid2 logos |
| FR-2 | Footer disclaimer | `ANALYSIS_SUMMARY.md`; `HANDOVER_03` §Footer | Footer / Box+Typography |
| FR-3 | Centred responsive layout (840px) | `FIGMA_ANALYSIS.md §` (336/840/336); `HANDOVER_03` | App shell / Container, Grid2 |
| FR-4/5 | Address display + change | `ANALYSIS_SUMMARY.md`; `FIGMA_ANALYSIS.md §3` | Address block / Typography+Button |
| FR-6/7/8 | Address autocomplete/details/fallback | `HANDOVER_05` §Address Validation API | Address block / MUI Autocomplete |
| FR-9 | Address change → scope reset **[OPEN]** | Gap in `ANALYSIS_SUMMARY.md` §Key Gaps Q4 | Address block ↔ Steps 1–3 |
| FR-10/11/12 | Step 1 Internal/External | `FIGMA_ANALYSIS.md §3` (button pair); `HANDOVER_03` §Step 1 | Step 1 / Accordion + selection buttons |
| FR-13/14/15 | Step 2 items (multi-select) **[OPEN content]** | `HANDOVER_05` §Renovation Items; `HANDOVER_03` §Step 2 (CONTENT TO BE DEFINED) | Step 2 / Accordion + toggle grid |
| FR-16/17/18 | Step 3 questions **[OPEN content]** | `HANDOVER_05` §Step3 Questions; `HANDOVER_03` §Step 3 (CONTENT TO BE DEFINED) | Step 3 / Radio/TextField/Select |
| FR-19 | Estimate request | `HANDOVER_05` §Cost Estimation API | Submit → results |
| FR-20/21/22 | Cost range + confidence + info | `ANALYSIS_SUMMARY.md` §Results; `HANDOVER_03` §Results | Results / Paper + large Typography |
| FR-23 | Cost algorithm **[OPEN]** | `HANDOVER_05` §Calculation Logic (illustrative); `ANALYSIS_SUMMARY.md` §Gaps Q3 | Backend estimate service |
| FR-24/25 | Edit / New Estimate | `HANDOVER_03` §Action Buttons | Results / Button pair |
| FR-26 | Home Loan Coach CTA | `ANALYSIS_SUMMARY.md` §Contact; `FIGMA_ANALYSIS.md §2` (CTA pattern) | Results / Contact section |
| FR-27–31 | Lead capture + consent **[OPEN placement]** | `HANDOVER_05` §Lead Capture API | Lead form / TextField+Checkbox |
| FR-32/33 | Loading + error handling | `HANDOVER_04`; `HANDOVER_05` §Error Handling | All async views |
| FR-34 | Motion timings + reduced motion | `HANDOVER_04` §Timing & Easing, §prefers-reduced-motion | All interactive components |
| FR-35 | All screen states **[OPEN]** | Gap; `HANDOVER_03` states; `ANALYSIS_SUMMARY.md` §Gaps Q6 | Every screen/state |
| NFR-1 | WCAG 2.1 AA | `HANDOVER_01` §Contrast; `HANDOVER_02` §Accessibility; `HANDOVER_06` §4.2 | Global |
| NFR-2 | Responsive breakpoints | `HANDOVER_03` §Breakpoints | Global |
| NFR-4 | React + MUI stack | `ANALYSIS_SUMMARY.md` §MUI deps; `HANDOVER_01` theme | Global |
| NFR-5/6/7 | Security / PII / rate limits | `HANDOVER_05` §Auth, §PII, §Rate Limiting | Backend/API layer |
| NFR-9 | Config-driven content | `HANDOVER_05` §Configuration APIs | Steps 2 & 3 |

---

## 2. OPEN ITEMS (must be resolved during BMAD planning)

Each is a blocker or gap flagged by Saga (`ANALYSIS_SUMMARY.md` §Key Gaps) and/or Freya (`HANDOVER_00_GUIDE.md` §What's Ready vs Missing).

| OI # | Open item | Source flag | Blocks | Impact | Recommended owner | Suggested resolution |
|------|-----------|-------------|--------|--------|-------------------|----------------------|
| OI-1 | **Step 2 renovation items** — final list, labels, cost ranges | `HANDOVER_00` §Awaiting Details; `HANDOVER_06` §2.3 BLOCKER; `HANDOVER_05` (placeholder) | FR-13/14/15 | HIGH | **Product** | Confirm item set; expose via `/config/renovation-items` |
| OI-2 | **Step 3 questions** — question list, field types, validation | `HANDOVER_00`; `HANDOVER_06` §2.4 BLOCKER; `HANDOVER_05` | FR-16/17/18 | HIGH | **Product** | Confirm questions; expose via `/config/step3-questions` |
| OI-3 | **Cost algorithm** — data source, multipliers, confidence model | `HANDOVER_00` §CRITICAL; `ANALYSIS_SUMMARY.md` §Gaps Q3; `HANDOVER_05` pseudocode | FR-19/23, G3 | CRITICAL | **Engineering** (+ Data/Product) | Define pricing data + multiplier logic; validate accuracy target |
| OI-4 | **Mobile & tablet layouts** — wireframes for all screens/states | `HANDOVER_00` §Awaiting Details; `HANDOVER_03` (desktop authoritative) | NFR-2; FR-1–35 mobile | MEDIUM | **Design (Sally/Freya)** | Deliver responsive wireframes; devs adapt desktop meanwhile |
| OI-5 | **Screen states** — empty, error, loading, success, empty-results | `ANALYSIS_SUMMARY.md` §Gaps Q6; `HANDOVER_03` states | FR-35, FR-32/33 | MEDIUM | **UX (Sally)** | Define state matrix (see `ux-requirements.md` §6.1) |
| OI-6 | **API contracts not finalised** — payloads illustrative, endpoints unconfirmed | `HANDOVER_05` (Status "Ready for Handover" but sample data); `HANDOVER_00` | FR-6/7/19/27 | HIGH | **Engineering (BE)** | Lock endpoint contracts, auth, error codes with FE |
| OI-7 | **Address change behaviour** — clear vs preserve answers | `ANALYSIS_SUMMARY.md` §Gaps Q4 | FR-9 | LOW-MED | **UX + Product** | Decide reset rule; document in PRD |
| OI-8 | **Step progression model** — auto-advance vs manual Continue | `ANALYSIS_SUMMARY.md` §Gaps Q5 | FR-10–18 UX | MED | **UX (Sally)** | Choose model; specify in `ux-requirements.md` |
| OI-9 | **Completed-step indicator** — visual treatment | `ANALYSIS_SUMMARY.md` §Gaps Q7; `HANDOVER_02` states | FR (accordion) | LOW | **UX (Sally)** | Define completed state styling |
| OI-10 | **Lead capture placement** — inline / modal / view | `ux-requirements.md` §9 | FR-31 | MED | **UX + Product** | Decide flow; confirm consent gating |
| OI-11 | **CRM / email / IVR integration** (deferred) | `HANDOVER_00` §Not in Scope | Post-MVP | LOW (deferred) | **Product/Eng (later)** | Track as post-MVP backlog |
| OI-12 | **Browser support matrix** | `functional-requirements.md` NFR-12 | NFR-12 | LOW | **Eng/QA** | Define target browsers |

**Legend — Impact:** CRITICAL (blocks core value) · HIGH (blocks a step/build) · MEDIUM (quality/coverage) · LOW (polish/deferred).

---

## 3. Coverage Notes

- **Fully specified & buildable now** (per `HANDOVER_00` §Immediately Buildable): FR-1, FR-2, FR-3, FR-10–12, FR-20–22, FR-24–26, design system (NFR-4), animations (FR-34), accessibility spec (NFR-1).
- **Specified-but-content-pending:** FR-13–18 (OI-1, OI-2).
- **Backend-dependent / contract-pending:** FR-6–8, FR-19, FR-23, FR-27–30 (OI-3, OI-6).
- **UX to define:** FR-9, FR-31, FR-35, and OI-5/7/8/9/10.

All CRITICAL/HIGH open items (OI-1, OI-2, OI-3, OI-6) should be closed before their corresponding epics enter a sprint.
