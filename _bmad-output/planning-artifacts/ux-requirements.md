# UX Requirements — Spike Reno Calculator

**Author:** Sally (UX Designer, BMad Method)
**Owner:** Igrant
**Date:** 2026-08-12
**Status:** Draft for BMAD planning (core UX deliverable)
**Design source of truth:** Figma "Spike Reno Calculator"
**Detail references:** `HANDOVER_01_DESIGN_SYSTEM.md`, `HANDOVER_02_COMPONENT_SPECS.md`, `HANDOVER_03_PAGE_SPECS.md`, `HANDOVER_04_ANIMATIONS.md`, `FIGMA_ANALYSIS.md`

> This document defines **what** the experience must do and **why**. Pixel/hex/timing specifics stay in the HANDOVER_* docs and are cited inline.

---

## 1. UX Goals & Design Principles

1. **Guided simplicity** — progressive disclosure via a 3-step accordion; only ask what's needed, when it's needed (`FIGMA_ANALYSIS.md §2`).
2. **Trust by design** — professional dark header + partner branding, clear disclaimers, and an honest cost *range* with a confidence signal.
3. **Speed to value** — a credible estimate in < 5 minutes; minimal typing, mostly choices.
4. **Low-commitment lead capture** — earn the contact details by delivering value first (the estimate), then invite the home-loan conversation.
5. **Accessible & responsive** — WCAG 2.1 AA, keyboard-first, works from 320px mobile to wide desktop.

## 2. Personas

### 2.1 Primary — Priya, the Renovating Homeowner
- **Context:** Owns a 1990s house in metro Sydney; planning a kitchen + bathroom refresh. Moderate digital literacy; on a laptop or phone.
- **Goals:** Get a realistic ballpark cost; understand if it's fundable; avoid pushy sales.
- **Frustrations:** Slow contractor quotes; forms that demand personal details before giving anything back.
- **Needs from us:** Fast, clear steps; a defensible number; control over when she shares contact info.

### 2.2 Secondary — Marcus, the Investor / Agent
- **Context:** Evaluates renovation upside across several properties.
- **Goals:** Quickly run multiple addresses; compare scope/cost.
- **Needs from us:** Easy "Enter new address" reset; fast New Estimate; no forced account.

### 2.3 Stakeholder — Home Loan Coach (Demo Channel)
- **Goals:** Receive qualified leads with estimate, scope, budget, contact + consent.
- **Needs from us:** Structured lead payload (`HANDOVER_05_DATA_API.md` §Lead Capture), contact preference & best time.

## 3. Primary User Journey

```
Land (address prefilled/known)
   ↓
Step 1 · Renovation type  →  Internal | External   (required, single choice)
   ↓
Step 2 · What to renovate →  multi-select items (options depend on Step 1)  (≥1 required)
   ↓
Step 3 · More questions   →  property type/age/size/condition/timeline/budget
   ↓
[Submit] → loading → Results
   ↓
Cost range ($X – $Y) + "how it's calculated" + confidence
   ↓
Branch:
   • Edit Estimate  → back to accordion, state preserved
   • New Estimate   → reset to Step 1, empty state
   • Talk to a Home Loan Coach → lead capture (name, email, phone, consent) → confirmation
```

### 3.1 Alternate / edge flows
- **Change address** → "Enter new address" opens autocomplete; selecting a new address restarts scope from Step 1 (confirm whether prior answers clear — **OPEN**).
- **Validation failure** on a step → inline error, block progression (see §6 states).
- **API failure** (address/estimate/lead) → non-blocking error with retry; manual-entry fallback for address (`HANDOVER_05`).
- **Reduced motion** → animations collapse to ~0ms (`HANDOVER_04` §prefers-reduced-motion).

## 4. Information Architecture

```
App Shell
├── Header (68px): product logo (left, ~125px) · partner logo (right, ~128px)   [FIGMA_ANALYSIS.md §3]
├── Main (centred, 840px content column on desktop; 336px side margins)
│   ├── Address block: current address + "Enter new address" link
│   ├── Accordion
│   │   ├── Step 1 · Renovation type
│   │   ├── Step 2 · What to renovate
│   │   └── Step 3 · More questions
│   └── Results view (replaces/augments form on submit)
│       ├── Cost card (range, scope summary, disclaimer)
│       ├── "Additional information / how calculated" (expandable)
│       ├── Actions: Edit Estimate · New Estimate
│       └── Contact CTA: "Talk to a Home Loan Coach" + phone
└── Footer: legal disclaimer (dark bar)
```
Reference layouts: `HANDOVER_03_PAGE_SPECS.md`; component hierarchy: `COMPONENT_DIAGRAM.md`.

## 5. Key Screens & Components

| Screen / Region | Purpose | Key components (MUI) | Detail ref |
|-----------------|---------|----------------------|-----------|
| Header | Branding & trust | Grid2, logos | `HANDOVER_03` §Header |
| Address block | Show/change property | Typography + text Button, Autocomplete | `HANDOVER_02`, `HANDOVER_05` |
| Step 1 | Internal/External | Accordion, ButtonBase pair (selection buttons) | `HANDOVER_02` §Buttons |
| Step 2 | Choose items | Accordion, multi-select toggle/checkbox grid (2-col desktop) | `HANDOVER_03` §Step 2 |
| Step 3 | Property questions | Accordion, Radio/TextField/Select | `HANDOVER_03` §Step 3 |
| Submit/validation | Advance & validate | Button, helper/error text | `HANDOVER_02`, `HANDOVER_04` |
| Results — cost card | Show estimate | Paper, large Typography (~58px) | `HANDOVER_03` §Results |
| Results — actions | Edit / New | Button pair (secondary/primary) | `HANDOVER_03` |
| Lead capture | Capture contact | TextField, Checkbox (consent), Select | `HANDOVER_05` §Lead |
| Contact CTA | Phone option | Box + icon + Typography | `ANALYSIS_SUMMARY.md` |
| Footer | Disclaimer | Box + Typography | `HANDOVER_03` §Footer |

## 6. Interaction & State Requirements

**Component states** (each interactive element must define): default, hover, focus-visible, active/selected, disabled, error, completed. (`HANDOVER_02` §Accessibility, `ANALYSIS_SUMMARY.md` component table.)

- **Accordion:** one step expanded at a time; header shows expand/collapse icon (rotates 180°, 300ms); completed step visually flagged (**OPEN**: exact completed indicator TBD). Expand/collapse timing & easing per `HANDOVER_04` (300ms, `cubic-bezier(0.4,0,0.2,1)`).
- **Selection buttons (Step 1/2):** clear selected vs unselected styling; keyboard-operable; selection can drive downstream options (Internal→internal items, External→external items).
- **Progression:** confirm auto-advance vs explicit "Continue" (**OPEN**). Whichever, next step must be reachable by keyboard and screen reader.
- **Validation:** required steps block submit; show inline error text + non-color cue; error animation subtle per `HANDOVER_04`.
- **Loading:** submit shows loading (CircularProgress/skeleton) while estimate calculates; disable duplicate submits.
- **Micro-interactions:** hover/focus 100–150ms; form interactions 200–300ms; page transitions 300–500ms (`HANDOVER_04` §Timing).

### 6.1 Required screen states to design (currently under-specified — UX to own)
| State | Where | Note |
|-------|-------|------|
| Empty / initial | Steps, address | Before any input |
| In-progress / partially complete | Accordion | Show which steps done |
| Validation error | Each field/step | Message + recovery |
| Loading | Submit → results, address autocomplete | Spinner/skeleton |
| Success | Results, lead confirmation | Confirmation message |
| API/system error | Address, estimate, lead | Retry + fallback |
| Empty results / no estimate | Results | If calc can't produce a range |

## 7. Accessibility Requirements (WCAG 2.1 AA)

- **Contrast:** all text ≥ 4.5:1 (normal) / 3:1 (large) — palette already validated (`HANDOVER_01` §Color Contrast).
- **Touch/click targets:** ≥ 44px min height (`HANDOVER_01`: buttons 44px, step headers 48px).
- **Keyboard:** full operation without a mouse; logical tab order; visible focus indicator on every interactive element.
- **Screen readers:** accordion headers as buttons with `aria-expanded`; selection buttons expose selected state; form fields have programmatic labels and error associations (`aria-describedby`).
- **Motion:** honour `prefers-reduced-motion` (collapse to ~0ms) — `HANDOVER_04`.
- **Forms:** errors identified in text (not color alone), with clear recovery guidance.
- **Testing:** keyboard nav pass, screen-reader pass, high-contrast mode check (`HANDOVER_01`, `HANDOVER_06` §4.2 Accessibility Review).

## 8. Responsive Requirements

Breakpoints (`HANDOVER_03_PAGE_SPECS.md`): **Desktop 1512px+**, **Tablet 768–1024px**, **Mobile 320–767px**.

| Region | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Main padding | 24px v / 48px h | 24 / 32 | 16 / 16 |
| Content column | 840px centred (336px margins) | fluid | full-width |
| Step 1 buttons | side-by-side | side-by-side | stacked |
| Step 2 items | 2-col grid | stacked | stacked |
| Results actions | inline pair | inline | stacked full-width |

- Desktop is authoritative; **tablet & mobile wireframes are a KNOWN GAP** — Design to deliver, devs may adapt from desktop initially (`HANDOVER_00_GUIDE.md`, `HANDOVER_03`).

## 9. Open UX Questions (carry into PRD/architecture)

1. Auto-advance between steps, or explicit Continue?
2. Exact "completed step" visual indicator?
3. Does changing the address clear prior Step 1–3 answers?
4. Final Step 2 item set & labels (vs `HANDOVER_05` placeholders)?
5. Final Step 3 question set, field types, validation rules?
6. Empty-results / low-confidence presentation?
7. Where does lead capture live — inline on results, modal, or separate view?
8. Mobile/tablet layouts for all screens & states.

See `requirements-traceability.md` for owners and status of these gaps.
