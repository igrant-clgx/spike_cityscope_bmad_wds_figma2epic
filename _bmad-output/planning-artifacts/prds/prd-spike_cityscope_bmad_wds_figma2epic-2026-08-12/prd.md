---
title: Spike Reno Calculator
status: final
created: 2026-08-12
updated: 2026-08-12
---

# PRD: Spike Reno Calculator
*Working title — confirm.*

## 0. Document Purpose

This PRD is for the PM (Igrant), the sponsoring stakeholder ("Demo Channel"), and the downstream BMAD workflow owners (architecture, epics & stories). It is a **lean, spike-level PRD**: enough to plan and build a demo-ready MVP, not a launch-grade specification.

It is Glossary-anchored: features are grouped with Functional Requirements (FR-N) nested under them, cross-cutting NFRs live in their own section, and inferred decisions are tagged inline `[ASSUMPTION: ...]` and indexed in §9. It **builds on** existing upstream work rather than duplicating it:

- **UX** — `_bmad-output/planning-artifacts/ux-requirements.md` (personas, journeys, IA, states, accessibility, responsive). This PRD mirrors its journey/persona framing.
- **Requirements source** — `_bmad-output/planning-artifacts/functional-requirements.md` (FR-1…FR-35, NFR-1…NFR-12) and `requirements-traceability.md` (open items). **FR/NFR IDs are preserved verbatim** so downstream artifacts have stable references.
- **Analysis** — `FIGMA_ANALYSIS.md`, `ANALYSIS_SUMMARY.md`, `COMPONENT_DIAGRAM.md` (Saga).
- **Implementation detail** — `HANDOVER_00`–`HANDOVER_06` (Freya). All pixel/hex/timing/API-payload specifics live there and are referenced, not restated.

## 1. Vision

**Spike Reno Calculator** is a guided, 3-step web tool that gives an Australian homeowner a credible renovation cost *range* in under five minutes — without a contractor visit, an account, or handing over personal details upfront. The homeowner picks whether the job is internal or external, chooses what they want to renovate, answers a few property questions, and gets an honest estimate with a confidence signal and a plain-language disclaimer.

Having delivered value first, the tool then offers a natural next step: *talk to a Home Loan Coach*. For the sponsoring financial institution ("Demo Channel"), this turns an otherwise anonymous moment of renovation intent into a qualified, consented financing lead — complete with the scope and budget context a coach needs to follow up well.

It matters because the current path to understanding renovation cost is slow and intimidating (chasing quotes), and there is no lightweight digital touchpoint that connects that intent to funding. This spike proves the concept end-to-end: fast estimate → warm lead.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** "Tell me roughly what my renovation will cost, fast, before I commit to anything."
- **Functional:** "Help me understand whether this is fundable and who I'd talk to about a loan."
- **Emotional:** "Let me explore without feeling pressured or judged, and without a salesperson calling before I'm ready."
- **Contextual:** "I'm on my laptop or phone at home in the evening; I want to poke at numbers, not fill in a long form."
- **(Business stakeholder) Functional:** "Give me qualified renovation leads with enough scope, budget, and consent context to convert them to a home-loan conversation."

### 2.2 Non-Users (v1)

- Tradespeople / contractors seeking a quoting tool.
- Users outside Australia (AU addresses, AUD, AU phone formats only).
- Users wanting a binding, quote-grade cost (this is an indicative *range*, not a quote).

### 2.3 Key User Journeys

*Named-persona narratives the product enables. Numbered UJ-1…UJ-3. FRs reference journeys by ID inline. Mirrors `ux-requirements.md` §2–3.*

- **UJ-1. Priya gets a ballpark for her kitchen-and-bathroom refresh — and books a chat.**
  - **Persona + context:** Priya owns a 1990s house in metro Sydney, planning an internal kitchen + bathroom refresh. Moderate digital literacy, on a laptop in the evening. She wants a defensible number and control over when she shares her details.
  - **Entry state:** Unauthenticated. Lands on the calculator with her property address shown (prefilled/known).
  - **Path:** (1) Step 1 — selects **Internal**. (2) Step 2 — multi-selects *kitchen* and *bathroom*. (3) Step 3 — answers property type/age/size/condition/timeline/budget. (4) Submits.
  - **Climax:** After a brief loading state, a results card shows a cost **range** (e.g. "$32,700 – $40,000"), a confidence indicator, an expandable "how it's calculated", and a disclaimer. She now has a number she trusts.
  - **Resolution:** She taps **Talk to a Home Loan Coach**, enters name/email/phone, ticks consent, and gets a confirmation. Left with a next step and no obligation.
  - **Edge case:** If the estimate service fails, she sees a non-destructive error with **Retry**; her answers are preserved.

- **UJ-2. Marcus runs three investment properties in a row.**
  - **Persona + context:** Marcus evaluates renovation upside across several properties; values speed and comparison, no account.
  - **Entry state:** Unauthenticated, on a results view for property A.
  - **Path:** Reviews the range for A → taps **New Estimate** (form resets to Step 1) → uses **Enter new address** to switch to property B → completes the three steps again.
  - **Climax:** A second range for property B in under a minute of typing.
  - **Resolution:** Repeats for property C; compares ranges. No forced lead capture.
  - **Edge case:** Changing the address may clear prior scope answers — reset behaviour is **[ASSUMPTION]**, see OI-7.

- **UJ-3. A Home Loan Coach receives a qualified lead.** *(Lighter — stakeholder outcome, not an on-screen flow.)*
  - Demo Channel's coach receives a structured lead payload — estimate id + range, renovation scope, budget, contact details, preferred contact method/time, and marketing consent — enough context to follow up effectively. Realized by UJ-1's resolution.

## 3. Glossary

*Downstream workflows and readers must use these terms exactly.*

- **Estimate** — An indicative renovation cost **range** (costMin–costMax, AUD) produced by the calculator, with an associated **Confidence** value and disclaimer. Not a quote.
- **Confidence** — A 0–100 indicator of how reliable an Estimate is, shown alongside it.
- **Renovation Type** — One of exactly two mutually exclusive values: **Internal** or **External**. Selected in Step 1; determines available **Renovation Items**.
- **Renovation Item** — A selectable scope element (e.g. kitchen, bathroom, roof). Multi-select in Step 2; the option set depends on Renovation Type. Item list is **config-driven**.
- **Property Details** — The Step 3 attributes about the property: type, age, size, condition, target start date, budget (min/max).
- **Step** — One of three sequential accordion sections: **Step 1** (Renovation Type), **Step 2** (Renovation Items), **Step 3** (Property Details).
- **Results View** — The screen (replacing/augmenting the form on submit) showing the Estimate, scope summary, disclaimer, "how it's calculated", and actions.
- **Lead** — A consented capture of a homeowner's contact details linked to a generated Estimate, submitted to Demo Channel for home-loan follow-up.
- **Home Loan Coach** — The Demo Channel representative who consumes Leads and follows up.
- **Demo Channel** — The sponsoring financial institution; owner of the Leads and the brand partner in the header.
- **Config-driven** — Content (Renovation Items, Step 3 questions) sourced at runtime from configuration APIs so changes need no redeploy.

## 4. Features

*FRs numbered globally (FR-1…FR-35), preserved from `functional-requirements.md`. `[ASSUMPTION]` tags mark inferences; `[OPEN]` marks items whose resolution owner is tracked in §8 and `requirements-traceability.md`.*

### 4.1 Application Shell & Navigation

**Description:** The persistent frame around every view — branded header (trust signal), centred responsive content area, and a legal disclaimer footer. Realizes the trust and speed-to-value principles that underpin all journeys.

**Functional Requirements:**

#### FR-1: Header with product + partner branding
The app renders a header with the product logo (left) and Demo Channel partner logo (right).
**Consequences (testable):**
- Both logos visible at all breakpoints; header height 68px on desktop (`HANDOVER_03`).

#### FR-2: Footer disclaimer
The app renders a footer containing the legal disclaimer on every view.
**Consequences (testable):**
- Disclaimer text present on every screen (form and Results View).

#### FR-3: Centred responsive layout
Main content uses a centred layout (840px content column on desktop) and reflows responsively.
**Consequences (testable):**
- Layout matches the breakpoints defined in `HANDOVER_03` (desktop/tablet/mobile).

### 4.2 Address Management

**Description:** Shows the current property address above the form and lets the user change it via autocomplete, with a manual fallback if the address service is unavailable. Enables Marcus's multi-property flow (UJ-2).

**Functional Requirements:**

#### FR-4: Display current address
The app displays the current property address above the form. Realizes UJ-1, UJ-2.
**Consequences (testable):** Address string renders (e.g. "400 Catherine Street, Lilyfield NSW 2040").

#### FR-5: Change address
The user can change the address via an "Enter new address" control. Realizes UJ-2.
**Consequences (testable):** Control opens address entry/autocomplete.

#### FR-6: Address autocomplete
The app provides address autocomplete via the address service with input debounced ≥300ms.
**Consequences (testable):** Typing yields predictions; ≤1 request per 300ms (`HANDOVER_05`).

#### FR-7: Resolve selected address
The app resolves a selected prediction to structured components (street/suburb/state/postcode/geo).
**Consequences (testable):** Selected place returns the structured fields (`HANDOVER_05`).

#### FR-8: Manual-entry fallback
The app validates the address and supports manual entry if the address service fails.
**Consequences (testable):** On service error, the user can still enter an address manually.

#### FR-9: Address change resets scope `[OPEN]`
Changing the address resets renovation scope to a defined state. `[ASSUMPTION: new address restarts scope from Step 1; whether prior Step 1–3 answers clear vs persist is undecided — see OI-7.]`
**Consequences (testable):** The chosen behaviour (clear vs keep answers) is defined and verified.

### 4.3 Guided 3-Step Form

**Description:** The heart of the product — a progressive-disclosure accordion. One Step is expanded at a time; Step 1's Renovation Type drives Step 2's Renovation Items. Realizes UJ-1, UJ-2. `[ASSUMPTION: progression model — auto-advance vs an explicit "Continue" — is undecided; see OI-8. Completed-step visual indicator is undecided; see OI-9.]`

**Functional Requirements:**

#### FR-10: Step 1 — Renovation Type
Step 1 presents an accordion asking "Is an Internal or External renovation?" with two mutually exclusive choices. Realizes UJ-1.
**Consequences (testable):** Exactly one of Internal/External is selectable; selection is required to proceed.

#### FR-11: Type drives Step 2 options
The selected Renovation Type determines the Renovation Items available in Step 2.
**Consequences (testable):** Internal → internal items; External → external items (`HANDOVER_05`).

#### FR-12: Selection state is visible
Selection state is visually distinct (selected vs unselected) and keyboard-operable.
**Consequences (testable):** Selected button styled per `HANDOVER_02` §Buttons; operable without a mouse.

#### FR-13: Step 2 items are config-driven
The app loads Step 2 Renovation Items from a configuration API by type. Realizes UJ-1.
**Consequences (testable):** Items render from config, not hardcoded (`HANDOVER_05`).

#### FR-14: Step 2 multi-select with minimum
The app allows multi-selection of ≥1 Renovation Item; submit is blocked with zero items.
**Consequences (testable):** Selecting 0 items shows a validation error; ≥1 allows progress.

#### FR-15: Step 2 item content `[OPEN]`
Item options reflect the Step 1 type and display label (and any cost metadata).
`[ASSUMPTION: placeholder set — internal: kitchen/bathroom/flooring/walls/lighting/plumbing; external: roof/windows/exterior/landscaping/decking — pending Product sign-off (OI-1).]`
**Consequences (testable):** Rendered set matches the confirmed Product list.

#### FR-16: Step 3 questions are config-driven
The app loads Step 3 questions from a configuration API, rendering field types dynamically.
**Consequences (testable):** Questions render by type (radio/text/select) (`HANDOVER_05`).

#### FR-17: Step 3 captures Property Details
The app captures Property Details: type, age, size, condition, target start date, budget (min/max).
**Consequences (testable):** Fields map to the estimate request's details object (`HANDOVER_05`).

#### FR-18: Step 3 validation `[OPEN]`
The app enforces per-field required/optional and validation rules.
`[ASSUMPTION: final field set and rules pending Product sign-off (OI-2).]`
**Consequences (testable):** Required fields block submit; invalid input shows inline error.

### 4.4 Cost Estimation & Results

**Description:** On submit, the app requests an Estimate and presents an honest cost range with a confidence signal, scope summary, disclaimer, and a "how it's calculated" expander. This is the value moment of UJ-1. `[ASSUMPTION: the cost calculation logic in HANDOVER_05 is illustrative pseudocode only; the real algorithm and data source are undefined — see OI-3, a CRITICAL open item.]`

**Functional Requirements:**

#### FR-19: Request estimate
On submit, the app requests an Estimate from the estimate service with address, renovation scope, and Property Details. Realizes UJ-1.
**Consequences (testable):** Request matches schema; required = postcode, type, ≥1 item (`HANDOVER_05`).

#### FR-20: Display cost range
The Results View displays a cost **range** (costMin–costMax) in AUD prominently.
**Consequences (testable):** Range renders (e.g. "$32,700 – $40,000") in large type (`HANDOVER_03`).

#### FR-21: Scope summary, disclaimer, confidence
The Results View shows a scope summary, disclaimer, and a Confidence indicator.
**Consequences (testable):** Disclaimer + Confidence (0–100) shown (`HANDOVER_05`).

#### FR-22: "How it's calculated" expander
The Results View provides an expandable "how it's calculated / additional information" section.
**Consequences (testable):** Section toggles open/closed.

#### FR-23: Cost algorithm defined `[OPEN]`
The cost calculation logic (data source + location/age/condition multipliers + confidence model) is defined by Engineering.
`[ASSUMPTION: HANDOVER_05 pseudocode (base range × location × age × condition) is illustrative, not final (OI-3).]`
**Consequences (testable):** Documented algorithm; outputs reproducible for given inputs; meets the accuracy target (SM-4).

### 4.5 Results Actions

**Description:** From the Results View the user can revise or restart. Enables Marcus's rapid multi-property comparison (UJ-2).

**Functional Requirements:**

#### FR-24: Edit Estimate
The user can "Edit Estimate" and return to the form with prior state preserved. Realizes UJ-1.
**Consequences (testable):** Returning shows previously entered answers (`HANDOVER_03`).

#### FR-25: New Estimate
The user can start a "New Estimate", resetting the form to the Step 1 empty state. Realizes UJ-2.
**Consequences (testable):** All answers cleared; Step 1 expanded.

### 4.6 Lead Capture (Home Loan Coach)

**Description:** The monetizing moment — after value is delivered, invite the home-loan conversation and capture a consented Lead linked to the Estimate. Realizes UJ-1's resolution and UJ-3. `[ASSUMPTION: lead capture placement — inline on Results, modal, or separate view — is undecided; see OI-10.]`

**Functional Requirements:**

#### FR-26: Coach CTA
The Results View presents a "Talk to a Home Loan Coach" CTA including a phone contact. Realizes UJ-1.
**Consequences (testable):** CTA + phone number visible.

#### FR-27: Capture lead details
The app captures Lead details: first name, last name, email, phone, contact method, best time, marketing consent.
**Consequences (testable):** Fields map to the lead capture request (`HANDOVER_05`).

#### FR-28: Validate lead fields
The app validates Lead fields: valid email, valid AU phone, names ≥2 chars, valid AU postcode.
**Consequences (testable):** Invalid values show field-level errors (`HANDOVER_05`).

#### FR-29: Submit lead linked to estimate
The app submits the Lead linked to the generated Estimate id and shows a success confirmation. Realizes UJ-3.
**Consequences (testable):** On success, a confirmation is shown; the Lead references the estimateId.

#### FR-30: Explicit consent required
The app requires explicit consent before submitting a Lead.
**Consequences (testable):** Submit is blocked until consent is captured.

#### FR-31: Lead capture placement `[OPEN]`
Lead capture placement (inline vs modal vs view) is decided.
**Consequences (testable):** The UX flow is defined and verified (OI-10).

### 4.7 Feedback, States & Motion

**Description:** The cross-feature behaviours that make the product feel responsive and trustworthy — loading indicators, non-destructive error handling, and motion that respects user preferences. `[ASSUMPTION: the full set of screen states is under-specified and owned by UX — see OI-5.]`

**Functional Requirements:**

#### FR-32: Loading indicators
The app shows loading indicators during address lookup, estimate calculation, and lead submission, and prevents duplicate submits.
**Consequences (testable):** Spinner/skeleton shown; duplicate submit prevented.

#### FR-33: Non-destructive error handling
The app handles service errors non-destructively with a retry path. Realizes UJ-1 edge case.
**Consequences (testable):** On 429/5xx, retry with backoff; user data preserved (`HANDOVER_05`).

#### FR-34: Motion timings & reduced motion
Interactive elements animate within defined timing bands (micro 100–150ms, form 200–300ms, page 300–500ms) and honour `prefers-reduced-motion`.
**Consequences (testable):** Timings and reduced-motion behaviour verified (`HANDOVER_04`).

#### FR-35: All screen states defined `[OPEN]`
All screen states (empty, in-progress, validation error, loading, success, system error, empty-results) are designed and implemented.
**Consequences (testable):** Each state defined in UX and present in the build (OI-5).

## 5. Non-Goals (Explicit)

- **Not a quoting tool** — produces an indicative range, never a binding quote, and is not for tradespeople.
- **No user accounts** — no login, no saved/bookmarked estimates, no history.
- **No CRM integration build** in this spike (Salesforce/HubSpot wiring is deferred) — Leads are captured to the lead API only.
- **No email/confirmation template design**, no phone IVR for "Call us".
- **No A/B testing framework or advanced analytics dashboard** — basic drop-off/conversion events only.
- **No social sharing.**
- **Not multi-market** — Australia only (AUD, AU addresses/phone).

## 6. MVP Scope

### 6.1 In Scope

- 3-step progressive-disclosure accordion form (Type → Items → Property Details).
- Address display + "Enter new address" with autocomplete and manual fallback.
- Estimate request → Results View with cost range, confidence, disclaimer, and "how it's calculated".
- Edit / New Estimate actions.
- Consented Lead capture linked to the Estimate, with "Talk to a Home Loan Coach" CTA.
- Design system, component library, animations, responsive layouts (desktop authoritative).
- Accessibility to WCAG 2.1 AA.

### 6.2 Out of Scope for MVP

- CRM/email/IVR integration (deferred; OI-11). *Reason: spike proves the capture, not the downstream pipeline.*
- Finalised tablet/mobile visual designs — desktop is authoritative; responsive is adapted from it (OI-4). `[NOTE FOR PM: mobile is emotionally load-bearing given evening at-home usage — revisit if timeline permits.]`
- Advanced analytics dashboard, A/B framework.
- Accounts, save/share.

## 7. Success Metrics

*Each SM cross-references the FR(s) it validates. Targets are spike-level and should be treated as hypotheses.*

**Primary**
- **SM-1: Form completion rate** — % of starters who reach the Results View. Target directionally high; establish a baseline this spike. Validates FR-10…FR-23.
- **SM-2: Lead conversion rate** — % of finishers who submit a Lead. Target > 15%. Validates FR-26…FR-30.

**Secondary**
- **SM-3: Time to complete** — median time from land to Results View. Target < 5 minutes. Validates FR-10…FR-20.
- **SM-4: Estimate accuracy** — Estimate range within ~75% of comparable real quotes (sampled). Validates FR-19, FR-23.
- **SM-5: Drop-off by step** — abandonment distribution across Steps 1–3 (diagnostic, no target). Validates FR-10…FR-18.

**Counter-metrics (do not optimize)**
- **SM-C1: Lead quality** — % of Leads that a coach deems contactable/qualified. Counterbalances SM-2: do not inflate lead volume by pressuring capture before value is delivered.
- **SM-C2: Completion by shortcutting** — do not raise SM-1/SM-3 by dropping required validation (FR-14, FR-18) or weakening the disclaimer/confidence honesty (FR-21). Counterbalances SM-1 and SM-3.

## 8. Open Questions

*Owners and full status tracked in `requirements-traceability.md` §2 (OI-1…OI-12).*

1. **Step 2 Renovation Item set, labels, cost metadata** — final list? (OI-1, **Product**, HIGH, blocks FR-13/14/15.)
2. **Step 3 question set, field types, validation rules** — final? (OI-2, **Product**, HIGH, blocks FR-16/17/18.)
3. **Cost algorithm** — data source, multipliers, confidence model? (OI-3, **Engineering**, CRITICAL, blocks FR-19/23 and SM-4.)
4. **API contracts** — endpoints/payloads are illustrative; lock contracts, auth, error codes. (OI-6, **Backend Eng**, HIGH.)
5. **Address change behaviour** — clear vs preserve prior answers? (OI-7, **UX + Product**, FR-9.)
6. **Step progression model** — auto-advance vs explicit Continue? (OI-8, **UX**, FR-10…FR-18.)
7. **Completed-step indicator** — visual treatment? (OI-9, **UX**.)
8. **Lead capture placement** — inline / modal / view? (OI-10, **UX + Product**, FR-31.)
9. **Screen states** — empty, error, loading, success, empty-results definitions. (OI-5, **UX**, FR-35.)
10. **Mobile/tablet layouts** — wireframes for all screens/states. (OI-4, **Design**, NFR-2.)
11. **Browser support matrix.** (OI-12, **Eng/QA**, NFR-12.)
12. **Empty-results / low-confidence presentation** — what does the user see if no range can be produced? (**UX**, FR-35.)

## 9. Assumptions Index

*Every `[ASSUMPTION]` surfaced for explicit confirmation:*

- **§2.3 / §4.2 (FR-9):** A new address restarts scope from Step 1; clear-vs-persist of prior answers is undecided (OI-7).
- **§4.3 (FR-15):** Step 2 placeholder item set (internal: kitchen/bathroom/flooring/walls/lighting/plumbing; external: roof/windows/exterior/landscaping/decking) pending Product (OI-1).
- **§4.3 (FR-18):** Step 3 final field set and validation rules pending Product (OI-2).
- **§4.3:** Step progression model (auto-advance vs Continue) undecided (OI-8); completed-step indicator undecided (OI-9).
- **§4.4 (FR-23):** Cost algorithm and data source undefined; HANDOVER_05 pseudocode is illustrative (OI-3, CRITICAL).
- **§4.6 (FR-31):** Lead capture placement (inline/modal/view) undecided (OI-10).
- **§4.7 (FR-35):** Full screen-state matrix under-specified, owned by UX (OI-5).
- **§6.2 / NFR-2:** Address/geocoding provider assumed (Google Places or Australia Post); tablet/mobile layouts adapted from desktop pending design (OI-4).

---

## Cross-Cutting NFRs

*System-wide, preserved from `functional-requirements.md` (NFR-1…NFR-12). Fine detail lives in the cited HANDOVER docs.*

| ID | Category | Requirement | Testable acceptance |
|----|----------|-------------|---------------------|
| NFR-1 | Accessibility | WCAG 2.1 AA: contrast 4.5:1 / 3:1, keyboard operable, focus-visible, SR labels, targets ≥44px. | Passes axe / keyboard / SR audit (`HANDOVER_01/02`, `HANDOVER_06` §4.2). |
| NFR-2 | Responsiveness | Function correctly across mobile 320–767 / tablet 768–1024 / desktop 1512+. | No overflow/broken layout at each breakpoint (`HANDOVER_03`). |
| NFR-3 | Performance | Micro-interactions <200ms; optimised bundle; fast results. | Meets `HANDOVER_06` §4.3 criteria. |
| NFR-4 | Tech stack | React + MUI v5+, MUI Grid2, design tokens per `HANDOVER_01`. | Codebase uses specified stack/theme. |
| NFR-5 | Security | HTTPS/TLS 1.2+, API-key auth, CORS restricted to `*.demo.channel.com`/localhost dev. | Config matches `HANDOVER_05` §Security. |
| NFR-6 | Privacy | PII encrypted in transit/at rest; phone masked in logs; 24-month retention (AU Privacy Act). | Verified per `HANDOVER_05` §PII. |
| NFR-7 | Reliability | Rate limits & retry: address 100/min, estimate 50/min, lead 20/min; 30s timeout. | Enforced/observed per `HANDOVER_05`. |
| NFR-8 | Observability | Requests carry a requestId; no PII to console; drop-off/conversion analytics fire. | requestId present; analytics events fire. |
| NFR-9 | Maintainability | Config-driven items/questions so content changes need no redeploy. | Items/questions sourced from config APIs. |
| NFR-10 | Localisation | AUD currency, AU address & phone formats. | Currency/format validation for AU. |
| NFR-11 | Testing | Unit (validation), E2E (flows), accessibility tests. | Suites present & passing (`HANDOVER_06` §4.4). |
| NFR-12 | Browser support `[OPEN]` | Modern evergreen browsers; graceful degradation. | Matrix TBD (OI-12). |

## Constraints & Guardrails

**Privacy (AU Privacy Act).** Leads contain PII (name, email, phone, address). Explicit consent is required before submission (FR-30); PII is encrypted in transit and at rest, masked in logs, and retained 24 months (NFR-6). No PII to console/analytics (NFR-8).

**Cost.** The address service is a metered third-party dependency; debounce (≥300ms), caching, and rate limits (NFR-7) contain per-session cost. `[ASSUMPTION: provider is Google Places or Australia Post — OI-6.]`

**Trust/Honesty.** The Estimate is presented as a *range* with a Confidence signal and a disclaimer (FR-20/21); the disclaimer appears on every view (FR-2). Honesty is protected by counter-metric SM-C2.

## Compliance

- **Accessibility:** WCAG 2.1 AA (NFR-1) — non-negotiable for this spike.
- **Data protection:** Australian Privacy Act — consent, encryption, retention (NFR-6, FR-30).

## Information Architecture

*Mirrors `ux-requirements.md` §4. Detail in `HANDOVER_03` / `COMPONENT_DIAGRAM.md`.*

```
App Shell
├── Header (68px): product logo (left) · Demo Channel logo (right)
├── Main (centred, 840px content column on desktop)
│   ├── Address block: current address + "Enter new address"
│   ├── Accordion: Step 1 Type · Step 2 Items · Step 3 Property Details
│   └── Results View: cost card (range/confidence/disclaimer) ·
│       "how it's calculated" · actions (Edit · New) · Coach CTA + Lead capture
└── Footer: legal disclaimer
```

## Platform

Responsive web (React + MUI). Breakpoints: desktop 1512+ (authoritative), tablet 768–1024, mobile 320–767. Mobile/tablet visual design is a known gap (OI-4). No native apps in scope.

## Integration & Dependencies

*Contracts are illustrative and must be locked (OI-6). Detail in `HANDOVER_05_DATA_API.md`.*

| Dependency | Purpose | FRs | Notes / open items |
|------------|---------|-----|--------------------|
| Address service (autocomplete + details) | Address entry/validation | FR-6/7/8 | Provider TBD (Google Places / Australia Post); debounce, cache, manual fallback. OI-6. |
| Config APIs (renovation-items, step3-questions) | Config-driven content | FR-13/16 | Enables no-redeploy content changes (NFR-9). Content pending OI-1/OI-2. |
| Estimate service | Produce cost range + confidence | FR-19/23 | **Algorithm undefined — OI-3 (CRITICAL).** |
| Lead capture API | Submit consented Lead | FR-27/29/30 | Links to estimateId; CRM downstream deferred (OI-11). |

## Risk & Mitigations

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|-----------|------------|
| R1 | Step 2 items not finalised (OI-1) | HIGH — blocks Step 2 build | Med | Config-driven items API; Product to confirm list. |
| R2 | Step 3 questions not finalised (OI-2) | HIGH — blocks Step 3 | Med | Config-driven questions API; Product to confirm. |
| R3 | Cost algorithm undefined (OI-3) | CRITICAL — blocks estimate credibility | Med | Engineering to define data source + multipliers; ship with disclaimer + confidence. |
| R4 | Mobile/tablet layouts incomplete (OI-4) | MED — responsive quality | High | Design to deliver wireframes; devs adapt from desktop initially. |
| R5 | Screen states under-specified (OI-5) | MED — UX gaps | Med | UX to define state matrix (`ux-requirements.md` §6.1). |
| R6 | Lead consent / privacy compliance | HIGH — legal | Low | Explicit consent (FR-30), disclaimer, AU Privacy Act retention (NFR-6). |
| R7 | Address API cost/latency/failure | MED | Med | Debounce, cache, manual-entry fallback (FR-8). |
| R8 | API contracts unlocked (OI-6) | HIGH — integration rework | Med | FE/BE lock endpoints, auth, error codes before Phase 3. |

## Delivery Phasing (from `HANDOVER_06`)

| Phase (week) | Requirements |
|--------------|-------------|
| Phase 1 — Foundation (Wk1) | FR-1–FR-3, NFR-4, design system. |
| Phase 2 — Form (Wk2–3) | FR-4–FR-18, FR-24–25, FR-32, FR-34–35. |
| Phase 3 — Backend integration (Wk3–4) | FR-19–FR-23, FR-26–FR-31, FR-33, NFR-5–NFR-9. |
| Phase 4 — Polish & launch (Wk4) | NFR-1–NFR-3, NFR-11, FR-35 completion, error handling. |

> **Sequencing note:** CRITICAL/HIGH open items (OI-1, OI-2, OI-3, OI-6) must be closed before their corresponding epics enter a sprint.
