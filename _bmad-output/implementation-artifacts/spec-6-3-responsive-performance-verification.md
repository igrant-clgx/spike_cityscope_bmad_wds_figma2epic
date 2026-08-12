---
title: 'Story 6.3: Responsive & performance verification'
type: 'chore'
created: '2026-08-13'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '49bd6e9'
final_revision: ''
---

<intent-contract>

## Intent

**Problem:** The assembled app has never had a whole-system responsive + performance verification (NFR-2, NFR-3, UX-DR21 completion): that desktop/tablet/mobile layouts reflow correctly with the disclaimer persistent and no horizontal scroll, and that performance budgets are met — and the mobile/tablet hi-fi mock gap (OI-4) has not been recorded against the judgement calls made.

**Approach:** Produce a verification artifact (`responsive-performance-verification.md`) that (1) statically verifies the responsive contract against the actual layout code (single-column IA, `contentMax` column, responsive padding, flex-wrap reflow, stacked-vs-inline actions, sticky footer, no fixed-width overflow at 320px), (2) confirms the disclaimer is persistent on every view, (3) measures and records the real production bundle sizes as the NFR-3 budget baseline, and (4) records OI-4 against every reflow judgement made in the absence of hi-fi mocks. Browser-rendered reflow/Lighthouse remain a documented manual pass (node-only harness).

## Boundaries & Constraints

**Always:** Cite real layout code (breakpoint `sx`, `flexWrap`, `direction`, `contentMax`, `100dvh`) and real measured bundle numbers; record OI-4 against each mobile/tablet judgement call; be explicit that browser-rendered reflow + Lighthouse/Web-Vitals are a manual pass under the node-only harness; preserve IDs (NFR-2, NFR-3, UX-DR21, OI-4).

**Block If:** A genuine overflow / broken-layout defect is found that needs a non-trivial layout refactor — HALT/blocked and log it against the owning epic.

**Never:** Add a browser/perf test runner (Lighthouse/Playwright); assert rendered pixel layout or Web Vitals numbers the harness can't produce; invent bundle numbers (measure from `.next`).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Responsive checkpoint | layout code has the reflow rule | verified `pass` (cited code) | n/a |
| Rendered reflow at a breakpoint | needs a browser | `manual-pass` with the expected behavior documented | n/a |
| Perf budget | production build | measured bundle sizes recorded as the NFR-3 baseline | n/a |
| Mobile/tablet judgement call | no hi-fi mock (OI-4) | recorded against OI-4 | n/a |
| Overflow defect | fixed width > viewport | logged as owning-epic defect | HALT if non-trivial |

</intent-contract>

## Code Map

- `src/components/shell/AppShell.tsx` -- single centred `contentMax` (840px) column, responsive `px:{xs:2,sm:3}`, `minHeight:100dvh` sticky-footer shell.
- `src/components/shell/Footer.tsx` -- the persistent disclaimer, rendered on every view via `AppShell`.
- `src/features/estimate-form/RenovationTypeSelect.tsx`, `ItemMultiSelect.tsx` -- `ToggleButtonGroup` with `flexWrap:'wrap'` (auto-reflow across breakpoints).
- `src/features/results/ResultsPanel.tsx` -- result actions `direction={{ xs:'column', sm:'row' }}` (stacked mobile / inline desktop).
- `src/features/results/ResultCostCard.tsx` (`maxWidth:600`), `AddressModal.tsx` (`maxWidth="sm"`), `Header.tsx` (brand-mark `width:125/128`) -- fixed widths audited for 320px overflow.
- `src/theme/tokens.ts` -- `contentMax:840`; motion tokens (micro-interaction feel, NFR-3).
- `.next/static/**` -- production bundle sizes (NFR-3 budget baseline).
- `_bmad-output/implementation-artifacts/responsive-performance-verification.md` (NEW).

## Tasks & Acceptance

**Execution:**
- [x] `_bmad-output/implementation-artifacts/responsive-performance-verification.md` -- CREATE: a responsive contract table (mobile 320–767 / tablet 768–1024 / desktop 1512+ × the layout invariants) each `pass`(code cited)/`manual-pass`(rendered); a disclaimer-persistence check; a no-horizontal-scroll / fixed-width audit; a measured NFR-3 bundle-budget section (real `.next` numbers); an OI-4 record of the mobile/tablet reflow judgement calls; a defects section; a verdict + harness-ceiling statement.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- (finalization) mark `6-3-responsive-performance-verification: done`.
- [x] Confirm the tree stays green (`npm run typecheck && npm run lint && npm test && npm run build`).

**Acceptance Criteria:**
- Given the assembled app, when verified across breakpoints, then desktop/tablet/mobile layouts reflow correctly (single-column IA, flex-wrap type/items, stacked-vs-inline actions), the disclaimer is persistent, and there is no horizontal scroll / fixed-width overflow at 320px (NFR-2, UX-DR21 completion) — each cited to layout code or documented as a manual-pass.
- Given performance, when the production build is measured, then the real bundle sizes are recorded as the NFR-3 budget baseline with the main driver identified (NFR-3).
- Given `[NOTE]` OI-4, when reflow judgement calls are made without hi-fi mocks, then each is recorded against OI-4.

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` -- expected: all exit 0 (no code changes expected).
- `du`/`gzip` over `.next/static/chunks/*.js` -- expected: bundle numbers recorded in the artifact.

**Manual checks:**
- Every responsive `pass` cell cites a real `sx`/layout rule; `manual-pass` cells honestly name the rendered check.
- Bundle numbers match a fresh `.next` measurement; OI-4 record is present and specific.

## Review Triage Log

Verification story — one adversarial auditor (opus-4.8) checked the artifact for **completeness, honesty, and evidence** rather than code bugs (proportionate: this story ships an audit artifact + zero code change).

**Audit result: HONEST AND COMPLETE — 0 critical, 1 minor.**

- Citation integrity (9 `pass` cells): every cited layout rule read and confirmed exact (AppShell contentMax/px/100dvh/flexGrow, Footer unconditional disclaimer, RenovationType/ItemMultiSelect `flexWrap:'wrap'`, ResultsPanel `direction={{xs:'column',sm:'row'}}`, ResultCostCard `maxWidth:600`, Header 125/128+flexShrink, AddressModal `maxWidth="sm"`). **CLEARED.**
- Fixed-width / no-grid claim: independent grep confirmed the only fixed widths are 125/128 (Header, flexShrink:1) and minTarget 44; zero `Grid`/`gridTemplateColumns`/`display:'grid'` matches. **CLEARED — true.**
- Bundle numbers: independently reproduced from fresh build — 365.0 KB gz total, 114.3 KB gz largest, 77.7/69.9 KB next, 1.25 MB uncompressed. All within rounding of the artifact's figures. **CLEARED — not invented.**
- Tree-shaking claim: zero bare `@mui/material` barrel imports in src/app. **CLEARED — true.**
- OI-4 judgement calls: all three accurate to code (flexWrap auto-wrap, sm=600 stack boundary honestly disclosed as inside the mobile band, px 16/24). **CLEARED.**
- Overclaim check: no `pass` cell requires a browser; rendered reflow + Web Vitals correctly routed to manual-pass; no real risk buried under manual-pass. **CLEARED.**

**MINOR (fixed):** auditor noted a pathological long ToggleButton label at 320px is the one place worth eyeballing — already subsumed by the rendered-reflow manual-pass, but now named explicitly in that cell's evidence.

No deferred items generated. No HALT/blocked condition.

## Auto Run Result

- **Outcome:** ✅ done — verification artifact delivered, audited HONEST AND COMPLETE, tree green.
- **Deliverable:** `responsive-performance-verification.md` — NFR-2 responsive contract (9 rows: pass statically-cited / manual-pass rendered), UX-DR21 disclaimer persistence, NFR-2 fixed-width + no-horizontal-scroll audit (no over-320 fixed widths, no multi-column grids), NFR-3 measured bundle baseline (≈365 KB gz first-load JS, MUI-dominated), OI-4 mobile/tablet judgement-call record, verdict + honest node-only-harness ceiling (rendered reflow @320/768/1512 + Core Web Vitals = documented manual-pass).
- **Code change:** none (doc-only). Tree-shaking already correct (per-component MUI imports).
- **Gates:** typecheck ✅, lint ✅, test ✅ (524), build ✅.
- **Review:** 1 adversarial auditor, 0 critical / 1 minor (fixed).
