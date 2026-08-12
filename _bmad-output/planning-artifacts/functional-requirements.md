# Functional & Non-Functional Requirements — Spike Reno Calculator

**Author:** Sally (UX Designer, BMad Method)
**Owner:** Igrant
**Date:** 2026-08-12
**Status:** Draft for BMAD planning
**Derived from:** `HANDOVER_02_COMPONENT_SPECS.md`, `HANDOVER_03_PAGE_SPECS.md`, `HANDOVER_04_ANIMATIONS.md`, `HANDOVER_05_DATA_API.md`, `HANDOVER_06_IMPLEMENTATION_CHECKLIST.md`, `FIGMA_ANALYSIS.md`, `ANALYSIS_SUMMARY.md`

> Each requirement is written to be **testable**. Items marked **[OPEN]** depend on decisions tracked in `requirements-traceability.md`.

---

## Functional Requirements

### A. Application Shell & Navigation
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-1 | The app shall render a header with the product logo (left) and partner/company logo (right). | Both logos visible at all breakpoints; header height 68px on desktop (`HANDOVER_03`). |
| FR-2 | The app shall render a footer containing the legal disclaimer. | Disclaimer text present on every view. |
| FR-3 | Main content shall use a centred layout (840px content column on desktop) and reflow responsively. | Layout matches breakpoints in `HANDOVER_03` (desktop/tablet/mobile). |

### B. Address Management
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-4 | The app shall display the current property address above the form. | Address string renders (e.g. "400 Catherine Street, Lilyfield NSW 2040"). |
| FR-5 | The user shall be able to change the address via an "Enter new address" control. | Control opens address entry/autocomplete. |
| FR-6 | The app shall provide address autocomplete via `GET /api/v1/address/autocomplete` with input debounced ≥300ms. | Typing yields predictions; ≤1 request/300ms (`HANDOVER_05`). |
| FR-7 | The app shall resolve a selected prediction to structured components via `GET /api/v1/address/details`. | Selected place returns street/suburb/state/postcode/geo (`HANDOVER_05`). |
| FR-8 | The app shall validate the address and support manual entry fallback if the API fails. | On API error, user can still enter an address manually. |
| FR-9 | **[OPEN]** Changing the address shall reset renovation scope to a defined state. | Behavior (clear vs keep answers) defined and verified. |

### C. Step 1 — Renovation Type
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-10 | The app shall present Step 1 as an accordion asking "Is an Internal or External renovation?" with two mutually exclusive choices. | Exactly one of Internal/External selectable; selection required. |
| FR-11 | The selected type shall determine the item options available in Step 2. | Internal→internal items; External→external items (`HANDOVER_05`). |
| FR-12 | Selection state shall be visually distinct (selected vs unselected). | Selected button styled per `HANDOVER_02` §Buttons. |

### D. Step 2 — Renovation Items  *(content [OPEN] — Product)*
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-13 | The app shall load Step 2 options from `GET /api/v1/config/renovation-items?type={internal|external}`. | Items render from API, not hardcoded (`HANDOVER_05`). |
| FR-14 | The app shall allow multi-selection of ≥1 renovation item; submit blocked with zero items. | Selecting 0 items shows validation error; ≥1 allows progress. |
| FR-15 | Item options shall reflect the Step 1 type and display label (and, where used, cost metadata). | Placeholder set: kitchen/bathroom/flooring/walls/lighting/plumbing (internal); roof/windows/exterior/landscaping/decking (external) — **[OPEN] pending Product**. |

### E. Step 3 — Additional Questions  *(content [OPEN] — Product)*
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-16 | The app shall load Step 3 questions from `GET /api/v1/config/step3-questions`. | Questions render dynamically by type (radio/text/select) (`HANDOVER_05`). |
| FR-17 | The app shall capture property attributes: type, age, size, condition, target start date, budget (min/max). | Fields map to `RenovationEstimateForm.details` (`HANDOVER_05`). |
| FR-18 | The app shall enforce per-field required/optional and validation rules. | Required fields block submit; invalid input shows inline error — **[OPEN] final rules pending Product**. |

### F. Cost Estimation
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-19 | On submit, the app shall request an estimate via `POST /api/v1/estimate/calculate` with address, renovation, details. | Request matches schema; required = postcode, type, ≥1 item (`HANDOVER_05`). |
| FR-20 | The results view shall display a cost **range** (costMin–costMax) in AUD prominently. | Range renders (e.g. "$32,700 – $40,000") in large type (`HANDOVER_03`). |
| FR-21 | The results view shall show a scope summary, disclaimer, and a confidence indicator. | Disclaimer + confidence (0–100) shown (`HANDOVER_05`). |
| FR-22 | The results view shall provide an expandable "how it's calculated / additional information" section. | Section toggles open/closed. |
| FR-23 | **[OPEN]** The cost calculation logic (data source + location/age/condition multipliers) shall be defined by Engineering. | Documented algorithm; outputs reproducible for given inputs (`HANDOVER_05` pseudocode is illustrative only). |

### G. Results Actions
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-24 | The user shall be able to "Edit Estimate" and return to the form with prior state preserved. | Returning shows previously entered answers (`HANDOVER_03`). |
| FR-25 | The user shall be able to start a "New Estimate", resetting the form to Step 1 empty state. | All answers cleared; Step 1 expanded. |

### H. Lead Capture (Home Loan Coach)
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-26 | The results view shall present a "Talk to a Home Loan Coach" CTA including a phone contact. | CTA + phone number visible. |
| FR-27 | The app shall capture lead details: first name, last name, email, phone, contact method, best time, marketing consent. | Fields map to `POST /api/v1/leads/capture` (`HANDOVER_05`). |
| FR-28 | The app shall validate lead fields: valid email, valid AU phone, names ≥2 chars, valid AU postcode. | Invalid values show field-level errors (`HANDOVER_05`). |
| FR-29 | The app shall submit the lead linked to the generated estimate id, and show a success confirmation. | On success, confirmation message shown; lead references estimateId. |
| FR-30 | The app shall require explicit consent before submitting a lead. | Submit blocked until consent captured. |
| FR-31 | **[OPEN]** Lead capture placement (inline vs modal vs view) shall be decided. | UX flow defined and verified. |

### I. Feedback, States & Motion
| ID | Requirement | Testable acceptance |
|----|-------------|---------------------|
| FR-32 | The app shall show loading indicators during address lookup, estimate calculation, and lead submission. | Spinner/skeleton shown; duplicate submit prevented. |
| FR-33 | The app shall handle API errors non-destructively with a retry path. | On 429/5xx, retry with exponential backoff; user data preserved (`HANDOVER_05`). |
| FR-34 | Interactive elements shall animate within defined timing bands (micro 100–150ms, form 200–300ms, page 300–500ms) and honour `prefers-reduced-motion`. | Timings & reduced-motion verified (`HANDOVER_04`). |
| FR-35 | **[OPEN]** All screen states (empty, in-progress, validation error, loading, success, system error, empty-results) shall be designed and implemented. | Each state defined in UX and present in build. |

---

## Non-Functional Requirements

| ID | Category | Requirement | Testable acceptance |
|----|----------|-------------|---------------------|
| NFR-1 | Accessibility | Meet WCAG 2.1 AA: contrast 4.5:1 / 3:1, keyboard operable, focus-visible, SR labels, targets ≥44px. | Passes axe/keyboard/SR audit (`HANDOVER_01/02`, `HANDOVER_06` §4.2). |
| NFR-2 | Responsiveness | Function correctly across mobile 320–767 / tablet 768–1024 / desktop 1512+. | No overflow/broken layout at each breakpoint (`HANDOVER_03`). |
| NFR-3 | Performance | Actions feel instant (<200ms micro); optimise bundle; fast results. | Meets `HANDOVER_06` §4.3 performance criteria. |
| NFR-4 | Tech stack | Built with React + MUI v5+, MUI Grid2, design tokens per `HANDOVER_01`. | Codebase uses specified stack/theme. |
| NFR-5 | Security | HTTPS/TLS 1.2+, API key auth, CORS restricted to `*.demo.channel.com`/localhost dev. | Config matches `HANDOVER_05` §Security. |
| NFR-6 | Privacy | PII encrypted in transit/at rest; phone masked in logs; 24-month retention (AU Privacy Act). | Verified per `HANDOVER_05` §PII. |
| NFR-7 | Reliability | Rate limits & retry: address 100/min, estimate 50/min, lead 20/min; 30s timeout. | Enforced/observed per `HANDOVER_05`. |
| NFR-8 | Observability | Requests carry a requestId; no PII to console; support drop-off/conversion analytics. | requestId present; analytics events fire (`HANDOVER_05`, `ANALYSIS_SUMMARY.md`). |
| NFR-9 | Maintainability | Config-driven items/questions so content changes need no redeploy. | Items/questions sourced from config APIs (`HANDOVER_05`). |
| NFR-10 | Localisation/Market | AUD currency, AU address & phone formats. | Currency/format validation for AU. |
| NFR-11 | Testing | Unit tests (validation), E2E (flows), accessibility tests. | Test suites present & passing (`HANDOVER_06` §4.4). |
| NFR-12 | Browser support | Modern evergreen browsers; graceful degradation. | Verified on target browser matrix — **[OPEN] matrix TBD**. |

---

## Requirement → Delivery Phase Mapping (from `HANDOVER_06`)

| Phase (week) | Requirements covered |
|--------------|----------------------|
| Phase 1 — Foundation (Wk1) | FR-1–FR-3, NFR-4, design system |
| Phase 2 — Form (Wk2–3) | FR-4–FR-18, FR-24–25, FR-32, FR-34–35 |
| Phase 3 — Backend integration (Wk3–4) | FR-19–FR-23, FR-26–FR-31, FR-33, NFR-5–NFR-9 |
| Phase 4 — Polish & launch (Wk4) | NFR-1–NFR-3, NFR-11, FR-35 completion, error handling |
