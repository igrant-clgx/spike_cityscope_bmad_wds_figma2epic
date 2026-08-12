---
stepsCompleted: ["step-01", "step-02", "step-03", "step-04"]
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

---

## Epic Details

*Story-level breakdown. Every story is sized for a single dev-agent session and depends only on prior stories (never a future one). Requirement IDs (FR-*, NFR-*, AD-*, UX-DR*, OI-*) are carried verbatim into acceptance criteria for pipeline traceability.*

### Epic 1: Application Foundation & Branded Shell

**Goal:** Stand up the greenfield app, the Ports & Adapters skeleton, the shared contract layer, the design-system theme, and the branded accessible shell — the walking skeleton every later epic builds on.
**FRs:** FR-1, FR-2, FR-3, FR-34 · **NFR:** NFR-4 · **AD:** AD-1, AD-3, AD-4, AD-9, AD-11, AD-12 · **UX-DR:** 1, 2, 3, 4, 5, 14, 15, 17, 18(baseline), 19, 20(baseline), 21(baseline)

#### Story 1.1: Greenfield scaffold & Ports-and-Adapters skeleton

As a developer,
I want a running Next.js (App Router) project with the hexagonal core, BFF boundary, and shared Zod contract layer scaffolded,
So that every later feature plugs into a consistent, dependency-correct structure.

**Acceptance Criteria:**

**Given** an empty repository
**When** the scaffold story is complete
**Then** a Next.js (App Router, TypeScript) app builds and serves a placeholder home route
**And** the source tree matches the ARCHITECTURE-SPINE layout: `core/` (domain + ports), `adapters/`, `app/` (BFF routes + client), `lib/`, and a shared `schemas/` package (AD-3)
**And** all module dependencies point inward — client → BFF → core; core imports no framework or adapter code (AD-1, AD-3)
**And** a shared Zod schema package is importable by both client and server, and a single response-envelope type is defined and exported (AD-4, AD-9)
**And** `npm run build`, typecheck, and lint pass clean on the scaffold.

#### Story 1.2: Design-system theme & tokens

As a developer,
I want a single MUI v9 theme expressing the brand delta as tokens,
So that every component renders on-brand with no ad-hoc styling.

**Acceptance Criteria:**

**Given** the scaffolded app
**When** the theme is applied at the app root
**Then** colour tokens are defined exactly per DESIGN.md (header-bg #2C2C2C, canvas #F5F5F5, surface #FFFFFF, text #333/#666/#999, primary #0066CC / hover #0052A3 / active #003D7A, semantic success/error/warning/info, border #E0E0E0, disabled #CCCCCC) (UX-DR1)
**And** the typography ramp (Roboto stack, h1–h6/body/caption/button) plus a dedicated `cost-display` role (56px/700/-1px) is registered as theme overrides (UX-DR2)
**And** shape + spacing tokens exist: radii sm 4px / md 8px / full, 8px spacing base, named gaps (step-gap 24px, card-pad 24px, content-max 840px, header-h 68px) (UX-DR3)
**And** elevation tokens exist (accordion `0 2px 4px rgba(0,0,0,.08)`, result card `0 4px 8px rgba(0,0,0,.10)`; shadow opacity ≤0.15) (UX-DR4)
**And** a lint/convention check confirms no ad-hoc hex values appear outside the theme (AD-11, NFR-4).

#### Story 1.3: Branded shell — header, responsive layout, footer disclaimer

As a homeowner,
I want to load a trustworthy, on-brand page with clear branding and a legal disclaimer,
So that I trust the tool before I start.

**Acceptance Criteria:**

**Given** the themed app
**When** I load any page
**Then** a full-width charcoal header (68px desktop) shows the product logo left (~125px) and the Demo Channel partner logo right (~128px), visible at all breakpoints (FR-1, UX-DR5)
**And** the content renders in a centred 840px column on desktop that reflows to tablet and mobile without horizontal scroll (FR-3, UX-DR21 baseline)
**And** a legal disclaimer footer renders on every view, form and Results (FR-2)
**And** shell microcopy follows the established voice & tone — humble, honest, low-pressure (UX-DR17).

#### Story 1.4: Shared feedback, motion & accessibility primitives

As a developer,
I want reusable async-feedback, motion, and accessibility primitives built once,
So that Epics 2–5 apply them instead of re-inventing states.

**Acceptance Criteria:**

**Given** the themed shell
**When** the primitives story is complete
**Then** a `lib/api-client` wraps the response envelope with pending/error handling and a retry policy, exposing loading and non-destructive-error states for consumers (foundation for FR-32/FR-33)
**And** a Toast/Snackbar component exists — bottom-center, severity-coloured, white text, slide-up ~300ms, auto-dismiss 3–5s, for form-level feedback only (UX-DR14)
**And** an input-error treatment exists — 2px error border + soft glow + helper text, always paired with inline text, never colour alone (UX-DR15)
**And** the motion system defines micro 100–150ms, accordion ~300ms cubic-bezier(0.4,0,0.2,1), reveal 300–500ms, all collapsing under `prefers-reduced-motion` (UX-DR19, FR-34)
**And** the accessibility baseline is in place — visible focus ring on all interactive elements, ≥44px targets, logical tab order, keyboard operability (UX-DR18 baseline, UX-DR20 baseline).

#### Story 1.5: Typed AnalyticsSink event seam

As a product analyst,
I want a first-party typed analytics seam,
So that journey events can be captured later without leaking PII or coupling to a vendor.

**Acceptance Criteria:**

**Given** the app shell
**When** the AnalyticsSink is wired
**Then** a typed `AnalyticsSink` port exists with a no-op/stub adapter and event types `step_viewed`, `step_completed`, `estimate_generated`, `lead_submitted`, `drop_off` (AD-12)
**And** event payloads are type-checked to never carry PII (AD-12, NFR-8 foundation)
**And** emitting an event from the client routes through the seam without throwing when the stub adapter is active.

### Epic 2: Address Entry & Property Context

**Goal:** Let a homeowner set and confirm the property their estimate is for, via the AddressProvider port (stub adapter), applying the Epic 1 async primitives.
**FRs:** FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-32, FR-33 · **AD:** AD-1, AD-2, AD-4, AD-5, AD-6 · **UX-DR:** 9, 16(address), 18(modal), 20(address)

#### Story 2.1: AddressProvider port, stub adapter & BFF route

As a developer,
I want an AddressProvider port with a stub adapter behind a BFF route and shared address schemas,
So that the client can query addresses without direct external I/O.

**Acceptance Criteria:**

**Given** the Epic 1 foundation
**When** the address seam is built
**Then** an `AddressProvider` port is defined in core with a deterministic stub adapter returning sample AU predictions (AD-2)
**And** all address I/O flows through a BFF route — the client never calls an external service directly (AD-1)
**And** request/response use shared Zod address schemas (prediction + resolved structured address: street/suburb/state/postcode/geo) reused client and server (AD-4, AD-5)
**And** the flow aggregate exposes an address slot the resolved address writes into (AD-6).

#### Story 2.2: Display current address & change control

As a homeowner,
I want to see the current property address and a way to change it,
So that I know which property the estimate is for.

**Acceptance Criteria:**

**Given** the app has a current address
**When** I view the form
**Then** the current property address is displayed above the form (FR-4)
**And** an "Enter new address" control is visible and keyboard-operable (FR-5, UX-DR9)
**And** the address block renders per the DESIGN.md address-block spec.

#### Story 2.3: Address autocomplete modal with structured resolution

As a homeowner,
I want to search for and select my address in a focused dialog,
So that I can set an accurate property quickly.

**Acceptance Criteria:**

**Given** I activate "Enter new address"
**When** the address modal opens
**Then** it is a focus-trapped modal (Confirm/Cancel) that returns focus to its trigger on close (UX-DR9, UX-DR18 modal)
**And** typing queries the autocomplete debounced ≥300ms (≤1 request/300ms) via the BFF (FR-6)
**And** selecting a prediction resolves it to structured components (street/suburb/state/postcode/geo) written to the flow aggregate (FR-7)
**And** loading state during lookup uses the Epic 1 async primitive (FR-32).

#### Story 2.4: Manual-entry fallback & non-destructive error handling

As a homeowner,
I want to still enter my address if the lookup service fails,
So that a service outage never blocks me.

**Acceptance Criteria:**

**Given** the address service returns an error
**When** the failure is detected
**Then** a non-destructive error is shown with a retry, preserving any entered data (FR-33, UX-DR16 address slice)
**And** a manual-entry fallback lets me type structured address fields directly (FR-8)
**And** the empty, loading, service-error, and success states for the address surface all render per UX-DR16 (address slice)
**And** address fields are programmatically labelled and errors are announced to screen readers (UX-DR20 address slice).

#### Story 2.5: Address change resets scope to a defined state

As a homeowner,
I want changing my address to reset dependent scope predictably,
So that my estimate always reflects the current property.

**Acceptance Criteria:**

**Given** I have progressed into the form
**When** I change the property address
**Then** dependent scope is reset to the defined state per OI-7 resolution `[OPEN]` (FR-9)
**And** the reset behaviour is applied consistently and communicated to the user
**And** `[OPEN]` OI-7 (exact reset scope) is flagged for product confirmation before build.

### Epic 3: Guided 3-Step Estimate Form

**Goal:** Let a homeowner describe their renovation scope through the progressive-disclosure accordion, all content served by the ConfigSource port (stub adapter), with the single flow aggregate owning scope.
**FRs:** FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16, FR-17, FR-18 · **AD:** AD-2, AD-4, AD-5, AD-6, AD-8, AD-11 · **UX-DR:** 6, 7, 8, 16(form), 17(error copy), 18(accordion), 20(form)

#### Story 3.1: ConfigSource port, stub adapter & versioned content schemas

As a developer,
I want a ConfigSource port serving versioned form content via stub adapter,
So that Step 2 items and Step 3 questions are config-driven, not hardcoded.

**Acceptance Criteria:**

**Given** the Epic 1 foundation
**When** the config seam is built
**Then** a `ConfigSource` port exists with a stub adapter returning versioned content for renovation types, Step 2 items, and Step 3 questions (AD-2, AD-8)
**And** content is validated against shared Zod schemas (item + question) reused client and server (AD-4, AD-5)
**And** form content is data-driven configuration, not code branches, so content changes need no redeploy (AD-11, NFR-9).

#### Story 3.2: Accordion stepper shell & flow aggregate

As a homeowner,
I want a clear one-step-at-a-time stepper,
So that I am never overwhelmed by the whole form at once.

**Acceptance Criteria:**

**Given** the form loads
**When** the stepper renders
**Then** exactly one step is expanded at a time; each header is a `button` with `aria-expanded` (UX-DR7, UX-DR18 accordion)
**And** a completed step collapses to a summary line with a completion indicator (`[ASSUMPTION]` check icon — OI-9)
**And** a single react-hook-form flow aggregate owns all captured scope across steps (AD-6)
**And** the accordion transition uses the ~300ms motion token and respects `prefers-reduced-motion`.

#### Story 3.3: Step 1 — Renovation Type selection

As a homeowner,
I want to pick my renovation type first,
So that the following questions are relevant to my project.

**Acceptance Criteria:**

**Given** Step 1 is active
**When** I choose a renovation type (e.g. Internal/External)
**Then** selection is required before proceeding (FR-10)
**And** selection buttons show clear unselected vs `primary-active` selected state, are ≥44px, and toggle with Enter/Space (FR-12, UX-DR6 single-select)
**And** my Step 1 choice determines the Step 2 option set (FR-11).

#### Story 3.4: Step 2 — Config-driven multi-select items

As a homeowner,
I want to select the specific items I'm renovating,
So that my scope is captured accurately.

**Acceptance Criteria:**

**Given** Step 2 is active
**When** items render
**Then** the item set is served by ConfigSource based on the Step 1 type (FR-13)
**And** items are multi-select with a minimum of ≥1 required to proceed (FR-14)
**And** selection buttons follow the multi-select toggle spec (UX-DR6 multi-select)
**And** `[OPEN]` the exact Step 2 item content is flagged as OI-1 for product confirmation (FR-15).

#### Story 3.5: Step 3 — Dynamic Property Details with validation

As a homeowner,
I want to answer property-detail questions tailored to my selections,
So that the estimate reflects my specifics.

**Acceptance Criteria:**

**Given** Step 3 is active
**When** questions render
**Then** the dynamic field renderer supports radio, text, numeric, date picker, slider, select, and a bounded budget min/max pair; the field set changes with Step 2 selections (FR-16, UX-DR8)
**And** each field is labelled, `aria-describedby`-linked to errors, and independently validated (FR-17, UX-DR20 form)
**And** validation errors use the input-error treatment and helpful copy; a form-level submit issue uses the Toast (UX-DR16 form, UX-DR17 error copy)
**And** empty/in-progress, validation-error, and config-loading states render per UX-DR16 (form slice)
**And** `[OPEN]` exact Step 3 validation rules are flagged as OI-2 for product confirmation (FR-18).

### Epic 4: Cost Estimate & Results

**Goal:** The value moment — turn captured scope into an honest cost range via the EstimateEngine port (deterministic stub for the spike), with revise/restart actions.
**FRs:** FR-19, FR-20, FR-21, FR-22, FR-23, FR-24, FR-25 · **AD:** AD-2, AD-6, AD-7, AD-9 · **UX-DR:** 10, 13, 16(results), 17(range framing), 20(results)

#### Story 4.1: EstimateEngine port, deterministic stub & estimate identity

As a developer,
I want an EstimateEngine port with a deterministic stub and a stable estimateId,
So that the full estimate pipeline runs end-to-end before the real algorithm exists.

**Acceptance Criteria:**

**Given** a completed scope in the flow aggregate
**When** an estimate is requested
**Then** the request routes through the BFF to an `EstimateEngine` port whose deterministic **stub** adapter returns a range for the given scope (FR-19, AD-2)
**And** money is represented as integer AUD cents throughout the core and envelope, formatted as AUD on display (AD-7, NFR-10)
**And** the response carries a stable `estimateId` used as the join key for later lead linkage and cache invalidation (AD-6, AD-9)
**And** `[OPEN]` the real cost algorithm is flagged OI-3 (CRITICAL, Engineering); it must drop in behind this port with no UI change (FR-23).

#### Story 4.2: Result cost card

As a homeowner,
I want to see an honest cost range with context,
So that I can gauge affordability without being misled.

**Acceptance Criteria:**

**Given** an estimate has been returned
**When** the Results view renders
**Then** a result card titled "Estimated Renovation Cost" shows a centered range in cost-display type, a type/items summary line, a Confidence indicator, and the indicative disclaimer (FR-20, FR-21, UX-DR10)
**And** a "+ More Information" section expands the "how it's calculated" explanation (FR-22)
**And** the card is max-width 600px / 32px padding and uses humble range-framing copy (UX-DR10, UX-DR17)
**And** the arrival of the result is announced via a live region to screen readers (UX-DR20 results).

#### Story 4.3: Results states — loading, error, empty/low-confidence

As a homeowner,
I want clear feedback while my estimate is calculated and if something goes wrong,
So that I always know what's happening.

**Acceptance Criteria:**

**Given** an estimate request is in flight
**When** states change
**Then** a loading/skeleton state shows during calculation using the Epic 1 async primitive
**And** a success reveal animates within the motion band on arrival
**And** an estimate-service error shows a non-destructive message with retry that preserves all captured answers (UX-DR16 results)
**And** an empty/low-confidence result shows an honest message and a path forward rather than a false precise number (UX-DR16 results).

#### Story 4.4: Edit Estimate & New Estimate actions

As a homeowner,
I want to revise my answers or start over,
So that I can refine or reset my estimate easily.

**Acceptance Criteria:**

**Given** I am viewing a result
**When** the actions render below the card
**Then** a secondary/outlined "Edit Estimate" returns me to the form with all answers preserved (FR-24, UX-DR13)
**And** a primary/contained "New Estimate" resets the flow to a clean state (FR-25, UX-DR13)
**And** resetting invalidates the prior estimateId per the cache-invalidation rule (AD-9).

### Epic 5: Lead Capture — Talk to a Home Loan Coach

**Goal:** Convert delivered value into a consented financing lead linked to the estimateId via the LeadSink port (stub store for the spike).
**FRs:** FR-26, FR-27, FR-28, FR-29, FR-30, FR-31 · **NFR:** NFR-6 · **AD:** AD-1, AD-4, AD-10 · **UX-DR:** 11, 12, 16(lead), 17(low-pressure CTA), 20(lead)

#### Story 5.1: LeadSink port, stub store & shared lead schema

As a developer,
I want a LeadSink port with a stub store and a shared lead schema,
So that leads can be captured and linked to an estimate without a real CRM.

**Acceptance Criteria:**

**Given** the Epic 1 foundation
**When** the lead seam is built
**Then** a `LeadSink` port exists with a stub store adapter (AD-2 style seam)
**And** all lead PII flows only through the BFF — never client-to-external directly (AD-1, NFR-6)
**And** the lead payload uses a shared Zod lead schema, and the stored record is consent-gated and marked for encryption at rest (AD-4, AD-10).

#### Story 5.2: Contact Section & Coach CTA

As a homeowner who has an estimate,
I want an easy way to talk to a home loan coach,
So that I can act on financing my renovation.

**Acceptance Criteria:**

**Given** I am viewing my estimate
**When** the Contact Section renders
**Then** a canvas-fill card presents "Talk to a Home Loan Coach" with a full-width phone CTA (`Call us`, `tel:` link, phone icon) (FR-26, UX-DR11)
**And** the CTA copy is low-pressure and honest (UX-DR17)
**And** `[OPEN]` the phone-CTA vs lead-form conversion path is flagged OI-10 (FR-31).

#### Story 5.3: Lead form with AU validation & consent gate

As a homeowner,
I want a simple, validated form with a clear consent choice,
So that I can request contact confidently.

**Acceptance Criteria:**

**Given** the lead form renders (per OI-10 resolution)
**When** I fill it in
**Then** it captures first/last name, email, phone, contact method, best time, and an explicit consent checkbox (FR-27, UX-DR12)
**And** fields validate against AU formats (phone, email) with inline errors (FR-28, UX-DR20 lead, NFR-10)
**And** submit stays disabled until all required fields and consent are valid (FR-30)
**And** fields are programmatically labelled and consent has correct semantics (UX-DR20 lead).

#### Story 5.4: Submit lead linked to estimate with confirmation & states

As a homeowner,
I want confirmation that my request was received,
So that I trust a coach will follow up.

**Acceptance Criteria:**

**Given** a valid, consented lead form
**When** I submit
**Then** the lead is stored via LeadSink linked to the current `estimateId` (FR-29)
**And** a success confirmation is shown (FR-29)
**And** submit shows a loading state and prevents duplicate submission (UX-DR16 lead)
**And** a submit error shows a non-destructive retry preserving entered data, and consent is required for storage (FR-30, NFR-6, UX-DR16 lead).

### Epic 6: Release Readiness & Verification

**Goal:** Prove the assembled product (Epics 1–5) is trustworthy and shippable through a whole-system verification pass — no new feature build.
**FRs:** FR-35 · **NFR:** NFR-1, NFR-2, NFR-3, NFR-5, NFR-6, NFR-7, NFR-8, NFR-11, NFR-12 · **UX-DR:** 16(sign-off), 21(completion) · **AD:** verify AD-9, AD-10, AD-12

#### Story 6.1: Screen-state matrix sign-off

As a product owner,
I want the full screen-state matrix verified across all surfaces,
So that no state was missed during feature build.

**Acceptance Criteria:**

**Given** Epics 2–5 are complete
**When** the state matrix is reviewed
**Then** every surface (address, form, results, lead) is confirmed to implement empty/initial, in-progress, validation-error, loading, success, API-error, and empty/low-confidence states (FR-35, UX-DR16 sign-off)
**And** any gap is logged as a defect against the owning epic
**And** `[OPEN]` OI-5 (state-matrix completeness source of truth) is resolved.

#### Story 6.2: Accessibility audit (WCAG 2.1 AA)

As an accessibility-dependent user,
I want the whole app to pass an accessibility audit,
So that I can complete the journey with assistive technology.

**Acceptance Criteria:**

**Given** the assembled app
**When** the accessibility audit runs
**Then** automated axe checks pass with zero critical violations across all routes (NFR-1)
**And** full keyboard-only traversal of the journey succeeds with visible focus at every step (UX-DR20)
**And** a screen-reader pass confirms step-change and result-arrival announcements and correct labelling.

#### Story 6.3: Responsive & performance verification

As a mobile user,
I want the app to work and feel fast on my device,
So that I get a good experience regardless of screen size.

**Acceptance Criteria:**

**Given** the assembled app
**When** verified across breakpoints
**Then** desktop/tablet/mobile layouts reflow correctly with the disclaimer persistent and no horizontal scroll (NFR-2, UX-DR21 completion)
**And** performance budgets are met per NFR-3
**And** `[NOTE]` the mobile/tablet hi-fi mock gap (OI-4) is recorded against any judgement calls made.

#### Story 6.4: Security, privacy, reliability & observability verification

As a security/compliance reviewer,
I want the cross-cutting invariants verified,
So that the product is safe to ship.

**Acceptance Criteria:**

**Given** the assembled app
**When** the invariants are audited
**Then** no PII crosses the client-to-external boundary and lead data is consent-gated and encrypted at rest (NFR-5, NFR-6, AD-10)
**And** rate-limiting/reliability behaviour is verified per NFR-7
**And** the AnalyticsSink emits the defined events with no PII, confirming observability per NFR-8 and AD-12.

#### Story 6.5: Test suites & browser support matrix

As a developer,
I want the automated test suites and browser matrix in place,
So that regressions are caught and support is defined.

**Acceptance Criteria:**

**Given** the assembled app
**When** the test suites run
**Then** unit, E2E (journey against stubs), and automated a11y suites exist and pass (NFR-11)
**And** the E2E journey runs green against the stub adapters end-to-end
**And** the supported browser matrix is documented and verified (NFR-12).
