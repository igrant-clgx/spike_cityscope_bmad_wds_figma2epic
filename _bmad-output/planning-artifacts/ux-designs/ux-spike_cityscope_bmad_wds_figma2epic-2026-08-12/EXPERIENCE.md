---
name: Spike Reno Calculator — Experience
description: Information architecture, behavior, states, interaction, accessibility, and journeys for the 3-step renovation cost calculator + lead capture. Visual identity lives in DESIGN.md.
status: final
sources:
  - './DESIGN.md'
  - '{planning_artifacts}/prds/prd-spike_cityscope_bmad_wds_figma2epic-2026-08-12/prd.md'
  - '{planning_artifacts}/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md'
  - '{planning_artifacts}/ux-requirements.md'
updated: 2026-08-12
---

# Spike Reno Calculator — EXPERIENCE.md

> How the calculator *works*. Visual identity (color, type, spacing, component looks) lives in `DESIGN.md`; tokens are referenced here as `{path.to.token}`. Both spines win on conflict with any mock, wireframe, or import.

## Foundation

- **Form factor:** responsive web, single-page application. Desktop is the authoritative surface; tablet and mobile reflow the same single column (see § Responsive). No native app.
- **UI system:** Material UI (MUI v9) on React 19 / Next.js 16, per `ARCHITECTURE-SPINE.md`. Behavior inherits MUI's accessible defaults (focus management, ARIA on `Accordion`/`Dialog`/`TextField`); this file specifies only the behavioral delta.
- **Shape of the product:** an anonymous homeowner answers three short steps, receives a renovation cost **range**, and — only then — is offered a conversation with a Home Loan Coach. Trust before ask. No account, no auth, no persistence beyond the session.
- **Core constraint:** the estimate is a guide, not a quote. Every surface that shows a number also carries the disclaimer.

## Information Architecture

A single scrolling page; the flow moves the user down one column. Surfaces:

1. **App shell / Header** — branding (product + Demo Channel). Persistent, non-interactive.
2. **Address block** — property address entry with autocomplete; the starting context for the estimate.
3. **Estimate accordion** — the guided form, one step open at a time:
   - **Step 1 — Renovation type:** Internal / External (selection buttons).
   - **Step 2 — Items:** multi-select of renovation items (≥ 1 required), driven by the Step 1 choice.
   - **Step 3 — Details:** dynamic questions per selected item/config (radio, text, select).
4. **Results view** — replaces the form on submit: a **cost-range card** (title, type/items summary, the range figure, disclaimer, and a "+ More Information" expandable "how this was calculated" note), a **Contact Section** card ("Talk to a Home Loan Coach" → **Call us: 0800 269 4663** tel: CTA), and two return actions: **Edit Estimate** (preserves answers) and **New Estimate** (resets).
5. **Footer** — legal disclaimer, always present.

**Surface closure:** every stated need has a surface (enter property → Address; describe job → Steps 1–3; see cost → Results; act on it → CTA/lead), and every surface is reached by a journey below. The results view and the form are the same page in two states, not two routes.

## Voice and Tone

Plain, honest, low-pressure Australian. We are a bank's tool that leads with usefulness, not a quote funnel. (Brand voice attributes live in `DESIGN.md § Brand & Style`; this is the microcopy delta.)

- **Headings ask a real question:** "Is this an internal or external renovation?" — not "Step 1 of 3".
- **The estimate is framed as a range with humility:** "Based on your answers, a renovation like this could cost roughly…" Never "Your quote:".
- **CTA is an offer, not a demand:** "Talk to a Home Loan Coach" / "See how we can help" — never "Get your FREE quote now".
- **Errors are helpful, not scolding:** "Enter a property address to get started" / "We couldn't find that address — try again or enter it manually".
- **Disclaimer is honest and constant:** estimate is indicative only, not financial advice, not a loan offer.

## Component Patterns

Behavioral contracts. Visual specs for each live in `DESIGN.md § Components`.

- **Accordion (guided stepper).** One step expanded at a time. Header is a `button` with `aria-expanded`; activating it collapses the current step and expands the target. A completed step collapses to a **summary line** of its answer with a completion indicator. `[ASSUMPTION]` completion indicator = check icon on the step header (OI-9). Steps below the current one are reachable but visually secondary until unlocked.
- **Selection buttons (Step 1 / Step 2).** Toggle semantics. Single-select for Step 1 (Internal/External); multi-select for Step 2 (≥ 1). Selected state per `{components.button-selection-selected}`. Keyboard: focusable, Enter/Space toggles. Changing Step 1 re-derives Step 2 options and clears downstream Step 2/3 answers.
- **Dynamic detail fields (Step 3).** Rendered from item/config type: radio group, free text, or select. Each field is labeled and independently validated. Field set changes when Step 2 selection changes.
- **Dynamic detail fields (Step 3).** Rendered from item/config type: radio group, free text, **numeric input, date picker, slider (e.g. 1–5 condition), select, and a budget min/max pair (bounded, e.g. 5,000–500,000 AUD)**. Each field is labeled and independently validated. Field set changes when Step 2 selection changes. `[NOTE]` the concrete Step 3 question set is candidate-only (HANDOVER_05: propertyType, propertyAge) and remains OI-2.
- **Address autocomplete + change modal.** Debounced (≥ 300ms) suggestions; selecting a suggestion fills the field. Manual entry is always available as a fallback if lookup fails. Re-entry via the "Enter new address" link opens a **modal** (Confirm/Cancel); on close, focus returns to the trigger. `[ASSUMPTION]` on Confirm, changing a confirmed address after answering clears Step 1–3 answers (OI-7 — handover leaves keep-vs-reset open).
- **Result cost card.** Displays: title "Estimated Renovation Cost", a type/items summary line, the **range** using `{typography.cost-display}` (centered), the indicative disclaimer, and a **"+ More Information" expandable** revealing the "how this was calculated" explainer. Only the expandable toggle is interactive.
- **Contact Section (primary conversion).** A card offering "Talk to a Home Loan Coach" with a **phone CTA** — `Call us: 0800 269 4663` as a `tel:` link (opens the dialer on mobile). This is the design-visible primary contact path.
- **Lead form (data-contract alternative).** HANDOVER_05 defines a Lead Capture API (first/last name, email, phone, contact method, best time, **explicit marketing consent**). If a captured-lead form is chosen over (or alongside) the phone CTA, it appears inline on Results with submit disabled until required fields + consent are valid. `[OPEN]` phone-CTA vs lead-form as the authoritative conversion path is **OI-10** (Product).
- **Actions.** **Edit Estimate** — secondary/outlined; returns to Step 1 with **all answers preserved**. **New Estimate** — primary/contained; returns to Step 1 with **state reset** (address cleared).

## State Patterns

Owns the state matrix (OI-5). Every surface accounts for:

- **Empty / initial** — address empty, Step 1 open, Steps 2–3 locked, no result. Primary affordance: "Enter your property address".
- **In-progress** — partial answers; completed steps show summary + indicator; the estimate action stays disabled until all required inputs are satisfied.
- **Validation error** — inline message with icon **and** text (never color alone), tied to the field via `aria-describedby`; the field border goes to an error treatment (see `DESIGN.md`); focus moves to the first invalid field on submit attempt. On a submit blocked by missing fields, **also** surface a form-level toast/snackbar ("Please complete all required fields", auto-dismiss ~5s) — the inline errors remain the field-level source of truth.
- **Loading** — three loading moments: address lookup (inline spinner in the field), estimate calculation (`CircularProgress`/`Skeleton` on the result region), lead submit (button spinner). Duplicate submits disabled while pending.
- **Success** — Results rendered; a brief success snackbar may confirm ("Estimate ready", auto-dismiss ~3s). If a lead is submitted, an inline confirmation ("A coach will be in touch") replaces the form; the estimate stays visible.
- **API / system error** — non-destructive: answers preserved, a retryable `Alert` shown; address lookup failure degrades to manual entry; estimate failure offers Retry.
- **Empty / low-confidence result** — if inputs can't produce a reliable range, show an honest message and a path forward (adjust answers or talk to a coach) rather than a misleading number.

## Interaction Primitives

- **Primary input:** click/tap. **Full keyboard operability** is a requirement, not a nicety — every interactive element is reachable and operable by keyboard with a visible focus ring (`{colors.primary}`).
- **Accordion headers** are buttons (`aria-expanded`); Enter/Space toggles. **Selection buttons** toggle on Enter/Space. **Phone CTA** is a `tel:` link (opens the device dialer). The **address-change modal** traps focus while open and returns focus to its trigger on close.
- **Progression:** `[ASSUMPTION]` explicit "Continue" per step, then auto-expand the next step (OI-8 undecided — validate in design).
- **Motion** (values in `DESIGN.md`, honor `prefers-reduced-motion`): micro-feedback 100–150ms; accordion expand/collapse ~300ms `cubic-bezier(0.4,0,0.2,1)`; result reveal 300–500ms. Motion communicates state change; it never gates interaction.

## Accessibility Floor

Target **WCAG 2.1 AA** (baseline; several color pairings reach AAA per `DESIGN.md`).

- Touch/click targets ≥ 44px (accordion step headers ≥ 48px).
- All inputs have programmatic labels; errors linked via `aria-describedby` and conveyed in text, not color.
- Screen reader announces step transitions and the arrival of the result (live region on the result card).
- Visible focus indicator on every interactive element; logical tab order follows the visual top-to-bottom flow.
- `prefers-reduced-motion` disables non-essential animation.
- Contrast ratios are owned and validated in `DESIGN.md`.

## Responsive & Platform

One column at every breakpoint; layout adapts, IA does not.

- **Desktop (≥ 1200px, authoritative):** centered column ≤ `{spacing.content-max}`; Step 1 buttons side-by-side; Step 2 items in 2 columns; result actions inline.
- **Tablet (768–1199px):** same column, reduced side margins; Step 1 side-by-side; Step 2 items 2-col or stacked by width.
- **Mobile (≤ 767px):** full-width column; Step 1 buttons stacked; Step 2 items stacked; result actions stacked full-width; disclaimer remains visible.
- `[NOTE FOR UX]` mobile/tablet high-fidelity visual references are a known gap (OI-4) — reflow rules above are the behavioral contract until mocks exist.

## Key Flows

Named-protagonist journeys; mirror the PRD user journeys (UJ-1/2/3).

### Priya gets an honest number (UJ-1) — primary
Priya, a homeowner planning a kitchen-and-bathroom refresh, lands on the calculator one evening.
1. She types her street address; a suggestion appears and she selects it.
2. Step 1 opens — she taps **Internal**; the button fills blue.
3. Step 2 offers internal items; she multi-selects **Kitchen** and **Bathroom**, then Continue.
4. Step 3 asks a couple of quick detail questions per item; she answers and submits.
5. A short calculating moment, then the result reveals. **← climax beat:** a clear cost *range* in the 56px figure, with a calm "this is a guide" note. Priya feels she got a straight answer.
6. Below it, a Contact Section: "Want help paying for it? Talk to a Home Loan Coach." Because she wasn't pushed, she's willing — she taps **Call us: 0800 269 4663** and the dialer opens. (If the build uses the lead-capture form instead, she fills her details, ticks consent, and submits — confirmation appears; the estimate stays on screen. Which path ships is OI-10.)

### Priya adjusts one answer (Edit Estimate)
Looking at the range, Priya wonders what dropping the bathroom would do.
1. She taps **Edit Estimate** (secondary). The form returns to Step 1 with **every answer preserved**.
2. She reopens Step 2, deselects Bathroom, and taps Get Estimate.
3. A revised range appears — same page, updated figure. She never re-enters her address or Step 1 choice.

### Marcus estimates several properties (UJ-2) — secondary
Marcus, an investor comparing renovations across two properties, finishes one estimate.
1. He reads the range, then taps **New Estimate** (primary — full reset, distinct from Edit Estimate).
2. The form returns to its empty/initial state; he enters the second property address (or uses the "Enter new address" modal).
3. `[ASSUMPTION]` a fresh estimate starts clean (OI-7); he runs Steps 1–3 again and compares the two ranges.

### The coach receives a qualified lead (UJ-3) — stakeholder
A Home Loan Coach at the Demo Channel receives Priya's submission.
1. The lead arrives only because Priya reached a result and explicitly consented.
2. It carries her contact details and estimate context, so the coach opens the conversation already knowing roughly what she's planning — a warm, non-cold-call start.

## Open UX items (triaged to design)

Non-blocking for the spine; resolve during visual design / first build:
- **OI-1 / OI-2** — Step 2 items and Step 3 questions are candidate-only (HANDOVER_05 proposes lists; Figma marked them "to be defined"). Product must confirm before build.
- **OI-4** — tablet/mobile hi-fi visual references (reflow contract defined above).
- **OI-5** — full state matrix (defined in § State Patterns; confirm against build).
- **OI-7** — address-change reset behavior `[ASSUMPTION]` clears answers (handover leaves keep-vs-reset open).
- **OI-8** — step progression model `[ASSUMPTION]` explicit Continue + auto-advance (handover shows per-step submit → "Get Estimate").
- **OI-9** — completed-step indicator `[ASSUMPTION]` check icon + summary line.
- **OI-10** — conversion path: phone CTA (design-visible) vs lead-capture form (data contract) — Product to confirm which is authoritative.
