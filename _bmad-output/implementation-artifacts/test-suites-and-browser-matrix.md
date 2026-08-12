# Test Suites & Browser Support Matrix (Story 6.5)

- **Date:** 2026-08-14
- **Epic:** 6 — Release Readiness & Verification
- **Requirements:** NFR-11 (unit + E2E-journey + a11y suites present & passing), NFR-12 (documented + verified browser support matrix — resolves the prior `[OPEN] matrix TBD`)
- **Method:** Inventory the existing suites by category with **measured** counts + pass evidence; add the one missing piece (a node-level **E2E journey** over the concrete stub adapters) as small remediation; document + reason the NFR-12 browser matrix. Cross-browser rendering is honestly a documented **manual-pass** — the harness is node-only (no Playwright/Cypress/axe/BrowserStack).

> **Harness ceiling:** node-only (Vitest + `renderToStaticMarkup`) — no jsdom/RTL/browser, no axe/Lighthouse, no Playwright/Cypress/BrowserStack. So component tests assert **rendered static markup + structure**, not live DOM/interaction, and cross-browser rendering is a **documented manual-pass**, not automated. What CAN be verified — the full **server-side journey** through the stubs, and static markup/structure/a11y attributes — is verified and cited.

---

## 1. Test suite inventory (NFR-11)

**Totals (measured): 71 test files, 528 tests, all passing.** (`find src app -name '*.test.ts*' | wc -l` = 71; `npm test` → 528 passed.)

| Category | Files | What it covers | Evidence / examples |
|---|---|---|---|
| **Unit — pure logic** | 45 `*.test.ts` under `src` (incl. server) | validation, mappers, money, view-state resolvers, stubs, use-cases, ports, arch boundary | `src/shared/schemas/*.test.ts` (6, zod contracts), `src/server/application/*.test.ts` (use-cases over fakes), `src/server/adapters/*/*.test.ts` (deterministic stubs), `src/server/architecture.test.ts` (boundary), `confidence`/`money`/`step-state` logic tests. |
| **Component — structural** | 21 `*.test.tsx` | `renderToStaticMarkup` output: presence, structure, no-`undefined`-leak, a11y attributes | `EstimateFlow.test.tsx`, `EstimateStepper.test.tsx`, `ResultsPanel.test.tsx`, `LeadPanel.test.tsx`, `AddressModal.test.tsx`, `AppShell.test.tsx`. |
| **Route — BFF contract** | 5 `app/api/v1/**/route.test.ts` | request/response envelopes, schema-in/out, error status codes, idempotency-key guard | `leads/route.test.ts`, `estimate/route.test.ts`, `address/{suggest,resolve}/route.test.ts`, `config/form/route.test.ts`. |
| **E2E — journey (stubs)** | 1 `src/server/journey.e2e.test.ts` (NEW) | full address→estimate→lead flow over the CONCRETE stubs; id threading, idempotency, consent gate, no-PII observability | 4 tests, green — see §2. |
| **A11y — static** | 16 of the `*.test.tsx` files | SR-only `visuallyHidden`/`clip:rect`, `aria-*`, `role=`, label association, disabled/announcement states | `ResultsPanel.test.tsx`/`LeadPanel.test.tsx` (SR-only live regions, 6.2), `LeadForm.test.tsx`/`ContactSection.test.tsx`, `DynamicField.test.tsx`, `RenovationTypeSelect.test.tsx`. |

*(Categories overlap: the 16 a11y-asserting files are a subset of the 21 component `*.test.tsx`; the E2E journey is one of the 45 `src` `.test.ts`.)*

## 2. E2E journey against stubs (NFR-11 — the added piece)

`src/server/journey.e2e.test.ts` (**NEW**, 4 tests green) is the journey-level complement to the per-use-case unit tests: those use fakes, this composes the **concrete** stub adapters through the real use-cases (the same seams the BFF routes wire), so it proves the pipeline actually assembles.

| Journey assertion | Verdict | What it proves |
|---|---|---|
| Happy path address→estimate→lead threads ids | ✅ pass | `suggestAddresses`→`resolveAddress`→`requestEstimate`→`captureLead` run green; the stored lead carries the step-2 `estimateId`; `estimateId`/`leadId` match their hex-id contracts; record has AD-10 `encryptAtRest:true` + `retentionMonths:24`. |
| Idempotent retry | ✅ pass | Same `Idempotency-Key` → same `leadId`, exactly one stored record (FR-32/FR-33). |
| Consent gate at journey end | ✅ pass | A consent-less lead rejects and stores no record (AD-10). |
| No-PII observability taxonomy | ✅ pass | The typed events tracked across the journey (`step_completed`/`estimate_generated`/`lead_submitted`, in order) serialize with none of the raw PII values (name/email/phone) present — validating the AD-12 event-contract discipline + serialization. (Events are hand-tracked in the test, since the spike use-cases don't auto-wire analytics; this proves the typed no-PII contract, not pipeline auto-emission.) NFR-8, AD-12. |

**The E2E journey runs green against the stub adapters end-to-end** — the NFR-11 acceptance criterion is met in-harness. (A browser-driven UI E2E, e.g. Playwright, is out of spike scope; the server pipeline is the fidelity-relevant path.)

## 3. Browser support matrix (NFR-12 — resolves `[OPEN] matrix TBD`)

**Support policy:** modern **evergreen** browsers on the latest two stable versions, with **graceful degradation** (the app is a server-rendered Next.js form — core capture works without JS-heavy features).

| Browser | Target versions | Support tier | Basis / rationale |
|---|---|---|---|
| **Chrome / Chromium (Edge, Brave, Opera)** | latest 2 stable | ✅ full | Primary evergreen target; Next 16 + React 19 baseline; dominant AU market share. |
| **Safari (macOS)** | latest 2 stable | ✅ full | Key desktop target; verify `100dvh` sticky footer + MUI emotion styling render correctly. |
| **Safari (iOS) / Mobile Safari** | latest 2 stable | ✅ full | Primary mobile target; `100dvh` chosen specifically to avoid the iOS URL-bar viewport jump (see responsive verification). |
| **Firefox** | latest 2 stable | ✅ full | Evergreen; standards-based MUI/emotion output, no vendor-specific code. |
| **Legacy / non-evergreen (IE11, old Android WebView)** | — | ⚪ graceful degradation only | Not supported; SSR HTML + native form controls keep the core capture reachable, but layout/interactions not guaranteed. |

**Rendering-risk spots to eyeball across the matrix (manual-pass):** `100dvh` sticky footer (iOS Safari), `visuallyHidden` `clip:rect(0 0 0 0)` SR-only regions (all), `ToggleButtonGroup` `flexWrap` reflow at 320px (all), `prefers-reduced-motion` collapse (all), focus-ring visibility (all). None use vendor-prefixed or non-standard CSS, so risk is low; MUI v9 + emotion normalize cross-browser output.

**Verification method:** ⚠ **manual-pass** — cross-browser rendering + interaction requires real browsers (or BrowserStack/Playwright), none installed in the node-only harness (no-new-deps). The matrix above is the documented + reasoned support definition (resolving `[OPEN] matrix TBD`); actual per-browser verification is a documented manual pass to run on a browser-capable machine, using the risk-spot list as the checklist.

## 4. What the node-only harness cannot automate (honest ceiling)

- **Live DOM / interaction** (click-through, keyboard traversal, focus movement) — component tests assert static markup only; interaction is a manual/browser-E2E concern (see also 6.2 focus-order manual-pass).
- **Automated a11y (axe/pa11y)** — not installed; a11y is asserted via static attribute checks (`aria-*`, `role`, `visuallyHidden`), not a full WCAG scanner (see `accessibility-audit.md`).
- **Cross-browser rendering** — §3 manual-pass.
- **Browser-driven UI E2E** (Playwright/Cypress) — out of scope; the node-level journey (§2) covers the server pipeline instead.

---

## Defects logged

**None.** The E2E journey composes the concrete stubs green end-to-end (ids thread, idempotency dedups, consent gate blocks, no PII leaks to analytics); the unit/component/route/a11y suites (71 files, 528 tests) all pass; the NFR-12 matrix is documented + reasoned. No seam-composition defect surfaced. No HALT/blocked condition.

---

## Verdict

**Conditionally signed off — NFR-11 suites are present + passing and the E2E journey runs green against the stubs; the NFR-12 browser matrix is documented + reasoned, with cross-browser verification routed to a documented manual-pass.** The suite inventory is real and measured (71 files / 528 tests across unit, component-structural, route, E2E-journey, and a11y-static categories); the added `journey.e2e.test.ts` proves the address→estimate→lead pipeline assembles through the concrete stub adapters with correct id threading, idempotency, consent enforcement, and no-PII observability. The `[OPEN] matrix TBD` is resolved with an evergreen + graceful-degradation policy and a per-browser rationale + risk-spot checklist. The honest ceiling: live DOM/interaction, automated a11y scanning, and cross-browser rendering require real browsers and are documented manual-passes, not asserted under the node-only harness. Tree green (528 tests, +4 for the journey).
