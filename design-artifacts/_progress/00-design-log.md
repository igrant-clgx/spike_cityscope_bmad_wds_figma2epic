# Design Log

**Project:** spike_cityscope_bmad_wds_figma2epic
**Started:** 2026-04-13
**Method:** Whiteport Design Studio (WDS v6)

---

## Backlog

- [ ] Complete product brief - Phase 1
- [ ] Define trigger map - Phase 2
- [ ] Create user scenarios - Phase 3
- [ ] Resolve content hidden by the supplied Figma captures
- [ ] Restore access to the configured npm Artifactory registry; `react` currently returns HTTP 403

---

## Current

| Task | Started | Agent |
|------|---------|-------|
| Complete manual TS-001 acceptance and sign-off | 2026-08-13 | Product owner / WDS designer |

**Rules:** Mark what you start. Complete it when done (move to Log). One task at a time per agent.

---

## Design Loop Status

| Scenario | Step | Page | Status | Updated |
|----------|------|------|--------|---------|
| renovation-estimate | 01.1 | Address Search | approved | 2026-08-13 |
| renovation-estimate | 01.2 | Renovation Details | built | 2026-08-13 |
| renovation-estimate | 01.3 | Estimate Result | built | 2026-08-13 |

**Status values:** `discussed` -> `wireframed` -> `specified` -> `explored` -> `building` -> `built` -> `approved` | `removed`

---

## Log

### 2026-08-13 - Design Delivery: renovation estimate visual prototype

- Packaged the three-screen fixed prototype as `DD-001`.
- Created acceptance contract `TS-001` with a 100% pass threshold for critical and high-priority tests.
- Agreed React + TypeScript + Ensemble, deterministic local fixtures, one in-memory reducer/context, and no backend.
- Completed the structured architecture handoff with Winston and recorded nine work packages totaling 6.5 person-days including validation.
- Officially handed the delivery to BMad with status `in_development`.
- Completed WDS prototype initiation and created the Scenario 01 roadmap, deterministic demo data, and working folder structure.
- Confirmed three logical views and approved the six-section Address Search work plan.
- Blocked Application Foundation before scaffold creation because the configured Artifactory registry returned HTTP 403 for `react`; registry policy remains unchanged.
- Completed the local React + TypeScript + Ensemble application foundation using cached React tooling and the existing local `@ensemble/lib@6.1.9`; all nine focused tests and the production build pass.
- User approved Address Search Section 1; Section 2 requirements and implementation story now cover the Figma-aligned shared header and disclaimer footer.
- Implemented and browser-verified Address Search Section 2 at 320px, 768px, 1024px, and 1512px; it is awaiting qualitative approval.
- User approved Address Search Section 2; the shared header and disclaimer footer are complete.
- Address Search Section 3 requirements and story are ready for the responsive Figma hero composition.
- Implemented and browser-verified Address Search Section 3 at all target viewports; it is awaiting qualitative approval.
- User approved Address Search Section 3; the responsive hero composition is complete.
- Address Search Section 4 requirements and story are ready for the deterministic accessible address combobox.
- Implemented and browser-verified Address Search Section 4 at all target viewports; it is awaiting qualitative approval.
- User approved Address Search Section 4; the accessible deterministic address combobox is complete.
- Address Search Section 5 requirements and story are ready for validation, notices, and navigation.
- Implemented and browser-verified Address Search Section 5; it is awaiting qualitative approval.
- User approved Address Search Section 5; validation, notices, stale-selection clearing, and one-time navigation are complete.
- Address Search Section 6 hardening story is ready against TS-001 and the verified Ensemble foundations.
- Completed TS-001 Address Search hardening at target widths and 200% zoom; Section 6 is awaiting qualitative approval.
- User approved Section 6; Address Search is complete across all six sections and the design-loop status is `approved`.
- User approved the five-section Renovation Details plan; Section 1 implementation has started.
- Renovation Details Section 1 is implemented and browser-verified; it is awaiting qualitative approval.
- User approved Renovation Details Section 1; Section 2 accordion structure is in implementation.
- Renovation Details Section 2 is implemented and browser-verified; the
  native disclosure exception is documented against the assessed
  `en-accordion` API and the section is awaiting qualitative approval.
- User approved Renovation Details Section 2; Section 3 renovation type
  selection is in implementation with documented `en-radio` assessment.
- Renovation Details Section 3 is implemented and browser-verified; Internal
  persists the supported Kitchen answer, while External remains selected with
  an honest unavailable notice.
- User approved Renovation Details Section 3; Section 4 fixed-estimate flow
  actions are in implementation using Ensemble's primary `en-btn`.
- Renovation Details Section 4 is implemented and browser-verified; the
  Ensemble estimate action creates the fixed result, External cannot progress,
  and browser history retains the Internal answer.
- User approved Renovation Details Section 4; Section 5 responsive,
  accessibility, Ensemble, and Figma hardening is in progress.
- Renovation Details Section 5 hardening is browser-verified and ready for
  review; it also fixed the direct-route listener race and invalid
  `--en-space-075` focus references.
- Estimate Result now replaces the foundation placeholder with the complete
  Figma-backed result, disclosure, edit/new/reset actions, phone contacts, tips,
  guarded recovery, and responsive/accessibility hardening; it is ready for
  qualitative review.
- Completed the adversarial BMad quality pass across all three pages. The fix-up
  tightened route/state invariants, history recovery, private-route metadata,
  combobox validation and editing, progressive focus, persistent ARIA targets,
  live result announcements, canonical fixture notices, and Ensemble SVG usage.
- All 22 focused tests, the production build, and automated browser checks pass
  at 320px, 768px, 1024px, and 1512px, including 200% zoom, reduced motion,
  keyboard progression, state reset/edit paths, route recovery, unresolved
  Ensemble token checks, duplicate-ID checks, and console-error checks.
- Manual VoiceOver and multi-browser qualitative comparison remain before
  product-owner and WDS approval; the built pages are not marked approved yet.
- Clean dependency installation remains blocked until access to the configured open-source Artifactory repository is restored.
- Pre-build gate: verify existing package installation and approve exported Figma assets or named placeholders.

### 2026-04-13 - Renovation estimate flow specified

- Source: [Spike Reno Calculator](https://www.figma.com/design/Q0fDj1AKMbwyPJRmPltox0/Spike-Reno-Calculator?node-id=0-1&p=f&m=dev)
- Scope: Address Search, Renovation Details, and Estimate Result.
- Captured: page basics, layout, Object IDs, English content, interactions, states, validation, spacing, and typography.
- Known gaps: expanded Step 2, expanded Step 3, and expanded calculation-explanation content are absent from the supplied Figma frames.

---

## About This Folder

- **This file** - Single source of truth for project progress.
- **C-UX-Scenarios/** - Page-level UX specifications grouped by scenario.
- **E-Development/** - Design deliveries, handoff logs, and acceptance-test scenarios.
