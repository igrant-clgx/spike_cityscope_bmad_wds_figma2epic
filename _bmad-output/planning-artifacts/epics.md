---
stepsCompleted: ["step-01", "step-02"]
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-spike_cityscope_bmad_wds_figma2epic-2026-08-12/prd.md"
  - "_bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md"
---

# spike_cityscope_bmad_wds_figma2epic - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for spike_cityscope_bmad_wds_figma2epic, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories. IDs (FR-*, NFR-*, AD-*, UX-DR*, OI-*) are preserved verbatim for traceability.

## Requirements Inventory

### Functional Requirements

**Application Shell & Navigation**
- FR-1: Header with product (left) + Demo Channel partner (right) branding, visible at all breakpoints; desktop header height 68px.
- FR-2: Footer legal disclaimer rendered on every view (form and Results View).
- FR-3: Centred responsive layout (840px content column on desktop) that reflows across breakpoints.

**Address Management**
- FR-4: Display the current property address above the form.
- FR-5: Change address via an "Enter new address" control.
- FR-6: Address autocomplete via the address service, input debounced ≥300ms (≤1 request/300ms).
- FR-7: Resolve a selected prediction to structured components (street/suburb/state/postcode/geo).
- FR-8: Manual-entry fallback if the address service fails.
- FR-9: `[OPEN]` Changing the address resets renovation scope to a defined state (clear-vs-keep undecided — OI-7).

**Guided 3-Step Form**
- FR-10: Step 1 — Renovation Type, two mutually exclusive choices (Internal/External); selection required to proceed.
- FR-11: Selected Renovation Type determines the Renovation Items available in Step 2.
- FR-12: Selection state visually distinct (selected vs unselected) and keyboard-operable.
- FR-13: Step 2 Renovation Items are config-driven (loaded from a configuration API by type).
- FR-14: Step 2 multi-select with minimum ≥1 item; submit blocked with zero items.
- FR-15: `[OPEN]` Step 2 item content/labels/cost metadata (placeholder set pending Product — OI-1).
- FR-16: Step 3 questions are config-driven, rendered dynamically by field type.
- FR-17: Step 3 captures Property Details: type, age, size, condition, target start date, budget (min/max).
- FR-18: `[OPEN]` Step 3 per-field required/optional and validation rules (final set pending Product — OI-2).

**Cost Estimation & Results**
- FR-19: On submit, request an Estimate from the estimate service with address, scope, and Property Details (required: postcode, type, ≥1 item).
- FR-20: Results View displays a cost range (costMin–costMax) in AUD, prominently (large type).
- FR-21: Results View shows scope summary, disclaimer, and a Confidence indicator (0–100).
- FR-22: Results View provides an expandable "how it's calculated / additional information" section.
- FR-23: `[OPEN]` Cost algorithm (data source + location/age/condition multipliers + confidence model) defined by Engineering (OI-3, CRITICAL).

**Results Actions**
- FR-24: "Edit Estimate" returns to the form with prior state preserved.
- FR-25: "New Estimate" resets the form to the Step 1 empty state.

**Lead Capture (Home Loan Coach)**
- FR-26: Results View presents a "Talk to a Home Loan Coach" CTA including a phone contact.
- FR-27: Capture Lead details: first name, last name, email, phone, contact method, best time, marketing consent.
- FR-28: Validate Lead fields: valid email, valid AU phone, names ≥2 chars, valid AU postcode.
- FR-29: Submit the Lead linked to the generated Estimate id; show a success confirmation.
- FR-30: Explicit consent required before submitting a Lead.
- FR-31: `[OPEN]` Lead capture placement (inline vs modal vs view) decided (OI-10).

**Feedback, States & Motion**
- FR-32: Loading indicators during address lookup, estimate calculation, and lead submission; prevent duplicate submits.
- FR-33: Non-destructive error handling with a retry path (429/5xx retry with backoff; user data preserved).
- FR-34: Motion within timing bands (micro 100–150ms, form 200–300ms, page 300–500ms); honour `prefers-reduced-motion`.
- FR-35: `[OPEN]` All screen states (empty, in-progress, validation error, loading, success, system error, empty-results) designed and implemented (OI-5).

### NonFunctional Requirements

- NFR-1: Accessibility — WCAG 2.1 AA: contrast 4.5:1 / 3:1, keyboard operable, focus-visible, SR labels, targets ≥44px.
- NFR-2: Responsiveness — function correctly across mobile 320–767 / tablet 768–1024 / desktop 1512+.
- NFR-3: Performance — micro-interactions <200ms; optimised bundle; fast results.
- NFR-4: Tech stack — React + MUI v5+ (project pins MUI v9), MUI Grid2, design tokens per HANDOVER_01.
- NFR-5: Security — HTTPS/TLS 1.2+, API-key auth, CORS restricted to `*.demo.channel.com`/localhost dev.
- NFR-6: Privacy — PII encrypted in transit/at rest; phone masked in logs; 24-month retention (AU Privacy Act).
- NFR-7: Reliability — rate limits & retry: address 100/min, estimate 50/min, lead 20/min; 30s timeout.
- NFR-8: Observability — requests carry a requestId; no PII to console; drop-off/conversion analytics fire.
- NFR-9: Maintainability — config-driven items/questions so content changes need no redeploy.
- NFR-10: Localisation — AUD currency, AU address & phone formats.
- NFR-11: Testing — unit (validation), E2E (flows), accessibility tests.
- NFR-12: `[OPEN]` Browser support — modern evergreen browsers; graceful degradation (matrix TBD — OI-12).

### Additional Requirements

*Technical/architectural requirements (from ARCHITECTURE-SPINE.md, AD-1…AD-12) that shape implementation. No external starter template is specified — this is a greenfield single Next.js (App Router) app scaffolded per the Structural Seed.*

- **Greenfield scaffold (Epic 1, Story 1):** single Next.js 16 App-Router + TypeScript 7 (strict) app; source tree per the spine (`app/(calculator)`, `app/api/v1/*`, `src/features/*`, `src/server/{application,domain,ports,adapters}`, `src/shared/schemas`, `src/theme`). Stack pinned: React/React-DOM 19.2.8, @mui/material 9.3.1, @emotion 11.14.x, @tanstack/react-query 5.101.4, react-hook-form 7.85.0, zod 4.4.3; Node ≥20.9 (target 24 LTS).
- **AD-1:** All third-party I/O crosses the BFF, never the browser; provider keys server-only (never `NEXT_PUBLIC_*`). (FR-6/7/8/19/27/29; NFR-5/6)
- **AD-2:** External dependencies sit behind domain ports — `EstimateEngine`, `AddressProvider`, `ConfigSource`, `LeadSink`, `AnalyticsSink`; one adapter each, selected by config. (FR-13/16/19/23/6/7/27/29; OI-1/2/3/6/11)
- **AD-3:** Dependency direction points inward (domain depends on nothing outward; client → BFF only via `src/lib/api-client`).
- **AD-4:** One shared Zod schema per contract, reused client + server (`AddressQuery`, `AddressDetails`, `RenovationEstimateRequest`, `EstimateResult`, `LeadCaptureRequest`, `RenovationItem`, `Step3Question`); AU formats live in schemas. (FR-14/18/19/28; NFR-9/10)
- **AD-5:** Form state via a single react-hook-form aggregate; all server-derived async state via TanStack Query (no ad-hoc fetch). (FR-10..18/24/25/32/33)
- **AD-6:** The flow aggregate `RenovationEstimateForm` is the single owner of scope; `estimateId` is the join key; changing address/type invalidates prior estimate and disables lead capture until re-estimated. (FR-9/11/19/24/25/29)
- **AD-7:** Money is integer AUD cents in domain and across the API; format only at the view edge. (FR-19/20/21; NFR-10)
- **AD-8:** Step 2 items & Step 3 questions are versioned data from `ConfigSource` (never code); `configVersion` echoed in estimate request and validated by `EstimateEngine`. (FR-13/15/16/18/19; NFR-9; OI-1/2)
- **AD-9:** Uniform API envelope (`{data,requestId}` / `{error:{code,message,fields?},requestId}`), correlation id propagated, retry only idempotent GETs + 429/5xx with backoff. (FR-32/33; NFR-7/8)
- **AD-10:** A Lead is submitted only with explicit consent and never leaves the server unencrypted; `LeadSink` rejects consent-less requests (defense in depth). (FR-27/28/30; NFR-6)
- **AD-11:** Accessibility, motion, and design tokens are build invariants — single MUI theme from HANDOVER_01 tokens; keyboard + focus ring + ≥44px targets; accordion headers are `aria-expanded` buttons; motion collapses under reduced-motion. (FR-1/3/12/34/35; NFR-1/2/4)
- **AD-12:** Analytics is a first-party typed `AnalyticsSink` event seam (`step_viewed`, `step_completed`, `estimate_generated`, `lead_submitted`, `drop_off`) that never carries PII. (FR-32; NFR-8; SM-1/2/5)
- **Deferred (ship as stub adapters):** cost algorithm (OI-3), address provider (OI-6), config content (OI-1/2), lead sink/CRM (OI-11); dev uses stub adapters with no real keys; E2E runs against stubs.

### UX Design Requirements

*First-class UX work items extracted from DESIGN.md (visual identity) and EXPERIENCE.md (behaviour). Each is scoped for story generation.*

**Design system / tokens (DESIGN.md)**
- UX-DR1: Build a single MUI v9 theme expressing the brand-layer delta over MUI defaults — color tokens (header-bg #2C2C2C, canvas #F5F5F5, surface #FFFFFF, text #333/#666/#999, primary #0066CC / hover #0052A3 / active #003D7A, semantic success/error/warning/info, border #E0E0E0, disabled #CCCCCC). No ad-hoc hex anywhere (AD-11).
- UX-DR2: Implement the typography ramp as theme overrides (Roboto stack; h1–h6, body, caption, button sizes/weights) plus a dedicated **cost-display** role (56px/700/-1px) used only for the estimate figure.
- UX-DR3: Implement shape + spacing tokens: radii sm 4px (buttons/inputs), md 8px (cards/accordion), full; 8px spacing base with named gaps (step-gap 24px, card-pad 24px, content-max 840px, header-h 68px).
- UX-DR4: Implement elevation tokens — accordion card shadow `0 2px 4px rgba(0,0,0,.08)`, result card `0 4px 8px rgba(0,0,0,.10)`; borders do primary depth work (shadow ≤0.15 opacity, never used to rank content).

**Reusable components (behavioural contract in EXPERIENCE.md, visual in DESIGN.md)**
- UX-DR5: Header component — full-width charcoal bar, product logo left (~125px) + Demo Channel logo right (~128px), 68px tall.
- UX-DR6: Selection button component (Step 1 single-select, Step 2 multi-select) — toggle semantics; unselected (canvas fill + hairline border) vs selected (`primary-active` fill / white); ≥44px; Enter/Space toggles; keyboard operable.
- UX-DR7: Accordion stepper component — one step expanded at a time; header is a `button` with `aria-expanded`; completed step collapses to a summary line with a completion indicator (`[ASSUMPTION]` check icon — OI-9).
- UX-DR8: Dynamic Step 3 field renderer — supports radio, text, numeric, date picker, slider (e.g. 1–5), select, and a bounded budget min/max pair; each field labelled and independently validated; field set changes with Step 2 selection.
- UX-DR9: Address block + change **modal** — debounced (≥300ms) autocomplete, manual-entry fallback; "Enter new address" opens a focus-trapped modal (Confirm/Cancel) that returns focus to its trigger on close.
- UX-DR10: Result cost card — title "Estimated Renovation Cost", type/items summary line, centered range in cost-display type, indicative disclaimer, and a "+ More Information" expandable "how it's calculated" section; max-width 600px / 32px padding.
- UX-DR11: Contact Section card (primary conversion) — canvas-fill card with "Talk to a Home Loan Coach" + phone CTA (`Call us` `tel:` link, full-width, phone icon). `[OPEN]` phone-CTA vs lead-capture form is OI-10.
- UX-DR12: Lead form component (data-contract alternative / OI-10) — first/last name, email, phone, contact method, best time, explicit consent checkbox; submit disabled until required fields + consent valid; inline field errors.
- UX-DR13: Results actions — secondary/outlined **Edit Estimate** (preserves answers) and primary/contained **New Estimate** (resets); paired below the result card.
- UX-DR14: Toast/Snackbar component — bottom-center, severity-coloured, white text, slide-up ~300ms, auto-dismiss 3–5s; form-level submit feedback only (not field errors).
- UX-DR15: Input error treatment — 2px error border + soft error glow + error helper text, always paired with inline text (never colour alone).

**States, interaction, accessibility, responsive (EXPERIENCE.md)**
- UX-DR16: Implement the full state matrix (OI-5) across surfaces: empty/initial, in-progress, validation error, loading (3 moments: address lookup, estimate calc, lead submit — with duplicate-submit prevention), success (incl. optional success snackbar + lead confirmation), API/system error (non-destructive + retry; address → manual fallback), empty/low-confidence result (honest message + path forward).
- UX-DR17: Voice & tone / microcopy — question-style step headings, humble range framing, low-pressure CTA, helpful error copy, constant honest disclaimer.
- UX-DR18: Interaction primitives — full keyboard operability with visible focus ring on every interactive element; accordion headers `aria-expanded`; Enter/Space toggles selection; phone CTA `tel:`; modal focus trap + return. `[ASSUMPTION]` progression = explicit "Continue" per step then auto-advance (OI-8).
- UX-DR19: Motion system — micro 100–150ms, accordion ~300ms cubic-bezier(0.4,0,0.2,1), result reveal 300–500ms; all non-essential motion collapses under `prefers-reduced-motion`.
- UX-DR20: Accessibility floor (WCAG 2.1 AA) — targets ≥44px (step headers ≥48px), programmatic labels + `aria-describedby` errors, SR announcement of step change and result arrival (live region), logical tab order, text-not-colour error signalling.
- UX-DR21: Responsive reflow (one column, IA constant) — desktop authoritative (Step 1 side-by-side, Step 2 2-col, actions inline) → tablet → mobile (Step 1 stacked, Step 2 stacked, actions full-width stacked, disclaimer persistent). `[NOTE]` mobile/tablet hi-fi mocks are a known gap (OI-4).

### FR Coverage Map

- FR-1: Epic 1 — Branded header renders at all breakpoints.
- FR-2: Epic 1 — Footer disclaimer on every view.
- FR-3: Epic 1 — Centred responsive layout / content column.
- FR-4: Epic 2 — Display current property address.
- FR-5: Epic 2 — "Enter new address" control.
- FR-6: Epic 2 — Debounced address autocomplete (via BFF/AddressProvider).
- FR-7: Epic 2 — Resolve selected prediction to structured components.
- FR-8: Epic 2 — Manual-entry fallback on address-service failure.
- FR-9: Epic 2 — `[OPEN]` Address change resets scope to defined state (OI-7).
- FR-10: Epic 3 — Step 1 Renovation Type (Internal/External), required.
- FR-11: Epic 3 — Type drives Step 2 option set.
- FR-12: Epic 3 — Visible, keyboard-operable selection state.
- FR-13: Epic 3 — Config-driven Step 2 items (ConfigSource).
- FR-14: Epic 3 — Step 2 multi-select, minimum ≥1.
- FR-15: Epic 3 — `[OPEN]` Step 2 item content (OI-1).
- FR-16: Epic 3 — Config-driven Step 3 questions rendered by type.
- FR-17: Epic 3 — Step 3 captures Property Details.
- FR-18: Epic 3 — `[OPEN]` Step 3 validation rules (OI-2).
- FR-19: Epic 4 — Request estimate (EstimateEngine).
- FR-20: Epic 4 — Display cost range (AUD) prominently.
- FR-21: Epic 4 — Scope summary, disclaimer, Confidence.
- FR-22: Epic 4 — "How it's calculated" expander.
- FR-23: Epic 4 — `[OPEN]` Cost algorithm defined (OI-3, CRITICAL; ships as stub).
- FR-24: Epic 4 — Edit Estimate (state preserved).
- FR-25: Epic 4 — New Estimate (reset).
- FR-26: Epic 5 — Coach CTA + phone contact.
- FR-27: Epic 5 — Capture Lead details.
- FR-28: Epic 5 — Validate Lead fields (AU formats).
- FR-29: Epic 5 — Submit Lead linked to estimateId + confirmation.
- FR-30: Epic 5 — Explicit consent required.
- FR-31: Epic 5 — `[OPEN]` Lead capture placement (OI-10).
- FR-32: Epic 2 — Loading indicators + duplicate-submit prevention (reusable primitives/api-client pending-state established as Epic 1 foundation; first applied here, reused in Epics 4/5).
- FR-33: Epic 2 — Non-destructive error handling + retry (shared api-client envelope/retry pattern is Epic 1 foundation; first applied here, reused in Epics 4/5).
- FR-34: Epic 1 — Motion timing bands + `prefers-reduced-motion` (design-system/theme).
- FR-35: Epic 6 — `[OPEN]` Full screen-state matrix **verified** across all surfaces (per-surface states are built in Epics 2–5; Epic 6 signs off completeness) (OI-5).

## Epic List

### Epic 1: Application Foundation & Branded Shell
Stand up the greenfield Next.js (App Router) app with the Ports & Adapters skeleton, shared Zod contract layer, MUI design-system theme, and the branded, accessible, responsive app shell — so a visitor can load a trustworthy, on-brand page (header, centred content, disclaimer footer) and every later feature builds on a consistent foundation.
**FRs covered:** FR-1, FR-2, FR-3, FR-34
**Also delivers:** Greenfield scaffold + source tree; AD-1/AD-3/AD-4/AD-9/AD-12 seams (BFF boundary, inward deps, shared schemas, uniform envelope, AnalyticsSink); AD-11 & NFR-4 design-system theme (UX-DR1–5); **reusable async/feedback primitives built once here and consumed by every later epic** — `src/lib/api-client` pending/error handling, retry policy, Toast (UX-DR14), input-error treatment (UX-DR15); accessibility foundations (focus ring, ≥44px targets, keyboard model — UX-DR20 baseline) and the motion system (UX-DR19).
**Standalone:** Delivers a running, branded, accessible shell — a walking skeleton. Does not require any later epic.

### Epic 2: Address Entry & Property Context
Let a homeowner set and confirm the property their estimate is for — current-address display, "Enter new address" modal with debounced autocomplete, structured resolution, and a manual-entry fallback — all routed through the BFF's AddressProvider port (stub adapter for the spike). This is the first async feature, so it **applies** (does not re-build) the Epic 1 loading + non-destructive-error/retry primitives.
**FRs covered:** FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-32, FR-33
**Also delivers:** AD-1/AD-2/AD-4/AD-5/AD-6 (BFF-only I/O, AddressProvider port + stub, shared address schemas, TanStack Query async ownership, flow-aggregate address slot); UX-DR9 (address block + change modal); **address-surface states** (empty, loading, service-error → manual fallback — UX-DR16 address slice) and **address a11y** (labelled fields, modal focus-trap/return, SR error announcement — UX-DR20 address slice).
**Standalone:** Delivers full address capability on top of the shell, states and a11y included. Does not require the form/estimate/lead epics.

### Epic 3: Guided 3-Step Estimate Form
Let a homeowner describe their renovation scope through the progressive-disclosure accordion — Step 1 Renovation Type (drives Step 2), Step 2 config-driven multi-select items (≥1), Step 3 config-driven dynamic Property Details — with per-field validation, all content served by the ConfigSource port (stub adapter). The single flow aggregate owns scope.
**FRs covered:** FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16, FR-17, FR-18
**Also delivers:** AD-2/AD-4/AD-5/AD-6/AD-8/AD-11 (ConfigSource port + versioned content, shared item/question schemas, react-hook-form flow aggregate, config-not-code); UX-DR6 (selection buttons), UX-DR7 (accordion stepper), UX-DR8 (Step 3 field renderer); **form-surface states** (empty/in-progress, per-field + form-level validation error incl. toast, config-loading — UX-DR16 form slice), UX-DR18 interaction/progression, and **form a11y** (aria-expanded headers, programmatic labels, SR step-change announcement — UX-DR20 form slice).
**Standalone:** A user can complete the guided form and see captured scope, with its own states and a11y. Does not require the estimate epic to function.

### Epic 4: Cost Estimate & Results
The value moment — on submit, request an Estimate via the EstimateEngine port and present an honest cost **range** with Confidence, scope summary, disclaimer, and a "how it's calculated" expander, plus Edit Estimate (preserve) and New Estimate (reset) actions. *For the spike this runs the full request→envelope→range→AUD-formatting pipeline against a deterministic **stub** EstimateEngine; the real algorithm (OI-3, CRITICAL) drops in behind the port with no UI change.*
**FRs covered:** FR-19, FR-20, FR-21, FR-22, FR-23, FR-24, FR-25
**Also delivers:** AD-2/AD-6/AD-7/AD-9 (EstimateEngine port + stub, estimateId join key + invalidation, integer AUD cents, envelope); UX-DR10 (result cost card), UX-DR13 (results actions); **results-surface states** (estimate loading/skeleton, success reveal, estimate-service error + retry with preserved answers, empty/low-confidence honest message — UX-DR16 results slice) and **results a11y** (live-region announcement of the result — UX-DR20 results slice).
**Standalone:** Turns captured scope into a displayed estimate with revise/restart, states included. Does not require the lead epic.

### Epic 5: Lead Capture — Talk to a Home Loan Coach
Convert delivered value into a consented financing lead — the "Talk to a Home Loan Coach" CTA + phone contact, a validated lead form (AU formats), an explicit consent gate, and submission linked to the current estimateId via the LeadSink port (stub store for the spike) with a success confirmation.
**FRs covered:** FR-26, FR-27, FR-28, FR-29, FR-30, FR-31
**Also delivers:** AD-1/AD-4/AD-10 (BFF-only PII, shared lead schema, consent-gated + encrypted lead), NFR-6 privacy; UX-DR11 (contact section / phone CTA), UX-DR12 (lead form); **lead-surface states** (submit loading + duplicate-submit prevention, validation errors, success confirmation, submit error + retry — UX-DR16 lead slice) and **lead a11y** (labelled fields, consent semantics — UX-DR20 lead slice). `[OPEN]` OI-10 conversion-path decision.
**Standalone:** Delivers lead capture on top of a generated estimate. Final feature in the user journey.

### Epic 6: Release Readiness & Verification
Prove the assembled product is trustworthy and shippable — a **whole-system verification pass**, not new feature build. Per-surface states and accessibility are already built in Epics 1–5; here we confirm completeness and run the checks that can only exist once the full system does: sign off the complete screen-state matrix (FR-35), run the WCAG 2.1 AA accessibility **audit** across the whole app (axe/keyboard/screen-reader), verify responsive behaviour and performance across all breakpoints, verify security/privacy/reliability/observability invariants, and land the cross-journey test suites and browser-support matrix.
**FRs covered:** FR-35
**Also delivers (verification):** NFR-1 (a11y audit), NFR-2 (responsive verification), NFR-3 (performance), NFR-5 (security), NFR-6 (privacy audit), NFR-7 (reliability/rate-limits), NFR-8 (observability/analytics events), NFR-11 (unit/E2E/a11y suites), NFR-12 (browser matrix); UX-DR16 final sign-off, UX-DR21 responsive completion; verification of AD-9/AD-10/AD-12.
**Standalone:** Elevates the assembled product to release quality by verifying — not rebuilding — Epics 1–5. Does not require any future epic.
