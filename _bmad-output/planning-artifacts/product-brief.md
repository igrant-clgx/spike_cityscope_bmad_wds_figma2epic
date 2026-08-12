# Product Brief — Spike Reno Calculator

**Author:** Sally (UX Designer, BMad Method) · translating Saga (analysis) + Freya (handover)
**Owner:** Igrant
**Date:** 2026-08-12
**Status:** Draft for BMAD planning (feeds the PRD)
**Sources:** `FIGMA_ANALYSIS.md`, `ANALYSIS_SUMMARY.md`, `COMPONENT_DIAGRAM.md`, `HANDOVER_00_GUIDE.md`–`HANDOVER_06_IMPLEMENTATION_CHECKLIST.md`

> This brief is a synthesis for planning. Concrete visual/technical detail (hex, timings, component specs, API payloads) lives in the HANDOVER_* docs and is referenced, not duplicated.

---

## 1. Problem Statement

Australian homeowners considering a renovation lack a fast, low-friction way to understand the likely cost of the work before committing. Existing paths (calling contractors, comparing quotes) are slow, intimidating, and don't connect the homeowner to financing. From the sponsoring financial institution's ("Demo Channel") perspective, there is no lightweight digital touchpoint that captures high-intent renovation prospects and routes them to a home loan coach.

**Opportunity:** A simple, guided 3-step web calculator that produces a credible cost range in under 5 minutes, then offers the homeowner a natural next step — talking to a home loan coach — thereby generating qualified financing leads.

## 2. Goals & Objectives

| # | Goal | Objective / Target |
|---|------|--------------------|
| G1 | Help homeowners estimate renovation cost quickly | Complete flow in < 5 minutes (`HANDOVER_00_GUIDE.md`) |
| G2 | Generate qualified home-loan leads for Demo Channel | Convert > 15% of finishers to lead submissions (`HANDOVER_00_GUIDE.md`) |
| G3 | Provide a credible, defensible estimate | Estimates within ~75% of actual quotes; show confidence + disclaimer |
| G4 | Deliver an accessible, on-brand experience | WCAG 2.1 AA; MUI-based design system (`HANDOVER_01_DESIGN_SYSTEM.md`) |
| G5 | Ship a demo-ready MVP on a 4-week sprint | Phased delivery per `HANDOVER_06_IMPLEMENTATION_CHECKLIST.md` |

## 3. Target Users / Personas

Derived from `FIGMA_ANALYSIS.md §1` and `ANALYSIS_SUMMARY.md`. Full persona detail lives in `ux-requirements.md`.

- **Primary — "Renovating Homeowner" (Priya).** Owns/occupies an Australian home, planning a specific renovation, basic-to-moderate digital literacy, wants a ballpark cost fast without giving away much upfront.
- **Secondary — "Property Investor / Agent" (Marcus).** Evaluates renovation potential across properties; values speed and the ability to change the address.
- **Business stakeholder — "Home Loan Coach / Demo Channel".** Consumes the leads; needs enough context (estimate, scope, contact + consent) to follow up effectively.

## 4. Value Proposition

- **For homeowners:** "Know roughly what your renovation will cost in a few clicks — then talk to someone who can help you fund it." No contractor visit required, no obligation.
- **For Demo Channel:** A branded, trust-signalling lead-generation asset that captures high-intent renovation prospects with the scope and budget context needed to convert them to home-loan conversations.

## 5. Scope

### 5.1 In Scope (MVP)
- 3-step progressive-disclosure form (accordion): **Step 1** Internal/External type → **Step 2** renovation items → **Step 3** additional property questions (`ANALYSIS_SUMMARY.md`, `HANDOVER_03_PAGE_SPECS.md`).
- Address display + "Enter new address" with autocomplete/validation (`HANDOVER_05_DATA_API.md` §Address).
- Cost estimate results view with a range (e.g. `$32,700 – $40,000`), "how it's calculated" info, Edit / New Estimate actions.
- Lead capture → "Talk to a Home Loan Coach" CTA with consent (`HANDOVER_05_DATA_API.md` §Lead Capture).
- Design system, component library, animations, and responsive layouts (desktop authoritative; tablet/mobile per `HANDOVER_03`).
- Accessibility to WCAG 2.1 AA (`HANDOVER_01`, `HANDOVER_02`).

### 5.2 Out of Scope (Deferred — agreed in `HANDOVER_00_GUIDE.md`)
- CRM integration details (Salesforce/HubSpot).
- Email/confirmation template design.
- Phone IVR for "Call us".
- A/B testing framework, advanced analytics dashboard.
- Social sharing, user accounts/login, save/bookmark estimates.

## 6. Success Metrics

| Metric | Type | Target / Definition | Source |
|--------|------|---------------------|--------|
| Form completion rate | Product | % reaching results | `ANALYSIS_SUMMARY.md` |
| Lead conversion rate | Business | > 15% of finishers submit lead | `HANDOVER_00_GUIDE.md` |
| Time to complete | Product | < 5 min average | `HANDOVER_00_GUIDE.md` |
| Drop-off by step | Product | Identify abandonment step | `ANALYSIS_SUMMARY.md` |
| Estimate accuracy | Business | within ~75% of real quotes | `HANDOVER_00_GUIDE.md` |
| Lead quality | Business | % leads → funded loans | `ANALYSIS_SUMMARY.md` |

## 7. Constraints

- **Tech stack:** React + Material-UI (MUI v5+), MUI Grid2, Roboto/Helvetica/Arial stack (`HANDOVER_01`, `ANALYSIS_SUMMARY.md`).
- **Design source of truth:** Figma design ("Spike Reno Calculator") — desktop is fully designed; mobile/tablet partially.
- **Regulatory/privacy:** PII handled per Australian Privacy Act, 24-month retention, encryption in transit/at rest (`HANDOVER_05_DATA_API.md` §PII).
- **Timeline:** 4-week sprint, phased (`HANDOVER_06`).
- **Market:** Australian addresses, AUD currency, AU phone formats.

## 8. Assumptions

- One accordion step is expanded at a time; steps progress linearly (`FIGMA_ANALYSIS.md §2`). *(To confirm — auto-advance vs manual.)*
- Step 2 items and their cost ranges are as illustrated in `HANDOVER_05_DATA_API.md` (kitchen, bathroom, flooring, walls, lighting, plumbing / roof, windows, exterior, landscaping, decking) — **placeholder pending Product sign-off.**
- Step 3 questions (property type, age, size, condition, timeline, budget) are as illustrated in `HANDOVER_05` — **placeholder pending Product sign-off.**
- Cost algorithm follows the pseudocode in `HANDOVER_05` (base range × location × age × condition multipliers) — **illustrative, not final.**
- Address/geocoding provided by Google Places or Australia Post API (`HANDOVER_05`).

## 9. Risks

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|-----------|------------|
| R1 | Step 2 items not finalised | HIGH — blocks Step 2 build | Med | Config-driven items API (`/config/renovation-items`); Product to confirm list |
| R2 | Step 3 questions not finalised | HIGH — blocks Step 3 | Med | Config-driven questions API (`/config/step3-questions`); Product to confirm |
| R3 | Cost algorithm undefined | CRITICAL — blocks results credibility | Med | Engineering to define data source + multipliers; ship with disclaimer + confidence score |
| R4 | Mobile/tablet layouts incomplete | MED — responsive quality | High | Design to deliver wireframes; devs mock from desktop initially (`HANDOVER_03`) |
| R5 | Error/empty/loading states underspecified | MED — UX gaps | Med | UX to define states (see `ux-requirements.md`); use MUI patterns |
| R6 | Lead consent / privacy compliance | HIGH — legal | Low | Explicit consent checkbox, disclaimer gate, AU Privacy Act retention |
| R7 | Address API cost/latency/failure | MED | Med | Debounce 300ms, cache 1hr, manual-entry fallback (`HANDOVER_05`) |

## 10. Recommended Next BMAD Step

Proceed to **`bmad-create-prd`** (or `bmad-prd`) using this brief plus `ux-requirements.md` and `functional-requirements.md` as inputs. Resolve the OPEN ITEMS in `requirements-traceability.md` during PRD elaboration before committing epics/stories.
