---
title: 'Story 4.2 — Result cost card'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '3328c13a7e08905fcfe536f16d9df90d8f0e874f'
final_revision: 'c5e61a7'
---

<intent-contract>

## Intent

**Problem:** Story 4.1 produces an `EstimateResult` (range in AUD cents + confidence + estimateId) but there is no way to present it. The value moment of the whole product — an honest cost range shown with integrity — has no UI.

**Approach:** Build the presentational **Result cost card** (`card-result`: white surface, 600px max-width, 32px padding, deeper `result` shadow) that renders the estimate as a single centered range in the `cost-display` type, a type/items summary line, a Confidence indicator, the constant indicative disclaimer, and a "+ More Information" expander revealing the "how this was calculated" explainer. Its arrival is announced to screen readers via a live region (UX-DR20 results). Formatting is derived by pure helpers; the card is display-only — request/loading/error wiring is Story 4.3 and the Edit/New actions are Story 4.4. New feature dir `src/features/results/` (mirrors the `src/features/address/` split).

## Boundaries & Constraints

**Always:**
- Money is formatted ONLY via `formatAudRange`/`formatAud` from `src/lib/money-format.ts` (AD-7). The card never does arithmetic on cents.
- The range uses the `cost-display` Typography variant (`<Typography variant="cost-display">`) and is centered — this variant is used NOWHERE else (it is the emotional peak). Card = MUI `Paper`, `maxWidth: 600`, `padding: 32px` (`spacing(4)`), shadow from `tokens.shadows.result`.
- Humble range framing (UX-DR10/17): a lead-in like "Based on your answers, a renovation like this could cost roughly" — never "Your quote". The constant indicative `DISCLAIMER` (reuse `src/components/shell/copy.ts`) is always present.
- The only interactive element on the card is the "+ More Information" expander. When expanded it reveals the "how this was calculated" explainer.
- The result's arrival is announced via a live region (`role="status"` / `aria-live="polite"`) wrapping the range/summary, so a screen reader hears the estimate when the card mounts (UX-DR20 results).
- No ad-hoc hex — colours/shadows/type come from theme tokens, MUI palette props, or the registered variant. Layer/purity + Node-only test rules from Epics 1–3 hold.

**Block If:**
- A stakeholder requires the confidence indicator to drive a hard gate (e.g. hide the number below a threshold) in THIS story — the empty/low-confidence *state* is Story 4.3; here the card just shows a confidence label. Do NOT block on the placeholder confidence copy; document as `[ASSUMPTION]`.

**Never:**
- No request/fetch/loading/error/skeleton logic (Story 4.3). No Edit/New Estimate actions or reset (Story 4.4). No Contact/lead section (Epic 5). No new dependency. No `cost-display` reuse outside this card. No jsdom/RTL — Node-only tests.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path | `result={costMin,costMax,confidence:'high',estimateId}`, `typeLabel='Internal'`, `itemLabels=['Kitchen','Bathroom']` | Card renders: title "Estimated Renovation Cost", summary "Internal · Kitchen, Bathroom", centered `cost-display` range via `formatAudRange`, "High confidence" indicator, disclaimer, collapsed "+ More Information" | n/a (pure display) |
| Single item | `itemLabels=['Kitchen']` | Summary "Internal · Kitchen" (no trailing separator) | n/a |
| Zero-width range | `costMin===costMax` | `formatAudRange` renders a single-looking value / equal bounds; no crash | n/a |
| Low confidence | `confidence:'low'` | "Low confidence" indicator with the humble helper copy (the honest-message empty state itself is 4.3) | n/a |
| Expander toggle | user activates "+ More Information" | The "how this was calculated" explainer becomes visible (SSR: the explainer markup is present in the Collapse body) | n/a |
| SR announcement | card mounts | The range/summary sit inside a `role="status"`/`aria-live="polite"` region | n/a |

</intent-contract>

## Code Map

- `src/features/results/copy.ts` -- NEW: `RESULT_CARD_TITLE = 'Estimated Renovation Cost'`, `RANGE_FRAMING_LEAD` (humble lead-in), `MORE_INFO_LABEL = '+ More Information'`, `HOW_CALCULATED_EXPLAINER` (`[ASSUMPTION]` indicative explainer text), confidence label/help copy map. Reuse `DISCLAIMER` from `@/components/shell` (do not duplicate).
- `src/features/results/result-summary.ts` -- NEW: pure `buildSummaryLine(typeLabel: string, itemLabels: string[]): string` (`"<type> · <items joined by ', '>"`; omit the separator when no items). No react.
- `src/features/results/confidence.ts` -- NEW: pure `resolveConfidence(level: EstimateConfidence): { label: string; help: string }` — maps `'low'|'medium'|'high'` to display label + humble helper copy. Exhaustive `never` default.
- `src/features/results/ResultCostCard.tsx` -- NEW (`'use client'`): `export function ResultCostCard({ result, typeLabel, itemLabels }: ResultCostCardProps)`. MUI `Paper` (maxWidth 600, p:4, boxShadow: `tokens.shadows.result`, centered mx:auto); a `role="status" aria-live="polite"` region wrapping the title/summary/range; `<Typography variant="cost-display" align="center">{formatAudRange(result.costMin, result.costMax)}</Typography>`; the Confidence indicator (label from `resolveConfidence`); the `DISCLAIMER` in `caption` type; and a "+ More Information" MUI expander (`Accordion`/`Collapse` + toggle button) whose body is `HOW_CALCULATED_EXPLAINER`.
- `src/features/results/index.ts` -- NEW barrel: export `ResultCostCard`, `buildSummaryLine`, `resolveConfidence`, and the copy constants + `ResultCostCardProps`.
- `src/lib/money-format.ts` -- REUSE `formatAudRange`/`formatAud` (no change).
- `src/components/shell/copy.ts` -- REUSE `DISCLAIMER` (no change).
- Test files alongside each new source file (Node-only, `renderToStaticMarkup` + `ThemeProvider`).

## Tasks & Acceptance

**Execution:**
- [x] `src/features/results/copy.ts` -- results microcopy (title, humble lead, More-Info label, explainer, confidence copy) -- single voice source; reuse shell `DISCLAIMER`.
- [x] `src/features/results/result-summary.ts` -- pure `buildSummaryLine` -- deterministic, unit-testable summary independent of MUI.
- [x] `src/features/results/confidence.ts` -- pure `resolveConfidence` exhaustive over the 3 levels -- decouples confidence display from the card; `never` default.
- [x] `src/features/results/ResultCostCard.tsx` -- the presentational card (Paper 600/32/result-shadow, cost-display centered range, confidence, disclaimer, More-Info expander, live region) -- the value-moment surface.
- [x] `src/features/results/index.ts` -- barrel exports.
- [x] Unit/SSR tests for every I/O-matrix row (summary line incl. single/zero items, confidence map incl. all 3 levels, card structure: title + formatted range + disclaimer + expander body + `aria-live` region).

**Acceptance Criteria:**
- Given an `EstimateResult` + scope labels, when the card renders, then it shows the title, a type/items summary line, the centered `cost-display` range (via `formatAudRange`), a Confidence indicator, and the indicative disclaimer (FR-20, FR-21, UX-DR10).
- Given the card, when "+ More Information" is present, then the "how this was calculated" explainer is contained in its expandable body (FR-22).
- Given the card is max-width 600px / 32px padding and uses the `result` shadow and humble range framing (UX-DR10, UX-DR17).
- Given the card mounts, when a screen reader is active, then the estimate sits within a polite live region so its arrival is announced (UX-DR20 results).
- Given `cost-display`, when grep-checked, then it is used only in this card.

## Design Notes

Feature split: results get their own dir `src/features/results/` (like `src/features/address/`), so Story 4.3 (states) and 4.4 (actions) extend a cohesive surface without bloating `estimate-form`. The card is PURELY presentational — it takes a ready `EstimateResult` + `typeLabel`/`itemLabels` as props; the parent (4.3) will derive those from `useEstimate()` + the flow aggregate/config labels and own all async/error state.

Summary line example: `buildSummaryLine('Internal', ['Kitchen','Bathroom'])` → `"Internal · Kitchen, Bathroom"`; `buildSummaryLine('External', [])` → `"External"` (no dangling separator).

Expander SSR note: use MUI `Accordion`/`Collapse` — under `renderToStaticMarkup` the collapsed body still renders in the markup (only visually hidden), so tests can assert the explainer text is present. The toggle is the sole interactive element; keep it keyboard-accessible (MUI default) with an accessible name.

Confidence copy (`[ASSUMPTION]`, humble): low → "Low confidence" + "Add more detail for a tighter range."; medium → "Medium confidence"; high → "High confidence". The hard empty/low-confidence *path* (honest message + forward action) is Story 4.3, not here.

## Verification

**Commands:**
- `npm run typecheck` -- expected: exit 0
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: exit 0, all green incl. new results tests
- `npm run build` -- expected: exit 0
- `grep -rn "variant=\"cost-display\"\|'cost-display'" src app` -- expected: only `ResultCostCard.tsx` (+ theme registration) uses the variant
- `npm test -- no-adhoc-hex` (or full run) -- expected: no hex added

## Review Triage Log

Blind Hunter + Edge Case Hunter ran in parallel against the diff since `3328c13`. Orchestrator set final severity. Both empirically confirmed the collapsed MUI Accordion body IS emitted under `renderToStaticMarkup` — the explainer-in-expander test is genuinely true-green.

| # | Finding | Severity | Disposition |
|---|---------|----------|-------------|
| 1 | `AccordionDetails` hand-set `id="how-calculated-content"` duplicated the id MUI v9 auto-generates on the region wrapper from the summary's `aria-controls` → invalid HTML + ambiguous disclosure target (BH#1, confirmed in SSR) | HIGH | **patch** — removed the manual `id` from `AccordionDetails`; MUI now owns the single region id wired from `aria-controls`. Added a test asserting the id appears ≤ once. |
| 2 | Live region populated in the SAME commit it's inserted often isn't announced by SRs — the exact UX-DR20 arrival AC (BH#2) | MED | **defer → Story 4.3** — 4.2 is display-only and can't control mount timing; documented the contract in the component header (4.3 must keep a PERSISTENT `role="status"` region across calculating→result, not remount it). Added as a 4.3 task. |
| 3 | Disclosure had no `expandIcon` and a static "+" label → no visual open/closed affordance (BH#3) | LOW | **patch** — added an inline-SVG chevron `expandIcon` (codebase convention; no icons dep) that MUI rotates on toggle. |
| 4 | Range en-dash read as nothing by some SRs → range semantics lost on the emotional-peak figure (BH#4/EH) | LOW | **patch** — added `aria-label="$min to $max"` on the `cost-display` element (visual unchanged); test asserts it. |
| 5 | `buildSummaryLine` degenerated on blank `typeLabel` (leading separator) and empty-string item labels (dangling comma) (BH#5/EH#1/EH#2) | LOW | **patch** — trim + filter blank items, and render items-only when the type is blank; added edge-case tests. |
| 6 | `resolveConfidence` returned a bare string (not `{label,help}`) if an out-of-union value slipped a JSON boundary (EH#3) | LOW | **patch** — kept the `never` compile guard but return `CONFIDENCE_COPY.low` as a safe runtime fallback. (Practically unreachable — confidence is Zod-enum-validated at the envelope.) |
| 7 | Comma-containing labels are ambiguous under comma-join (EH#4) | LOW | **reject** — controlled label vocabulary; not a crash. |
| — | Accordion SSR body real (tests not hollow), `cost-display` used only here, no cents arithmetic in the card, no ad-hoc hex (shadow token + palette props + `divider`), exhaustive confidence, React-escaped labels (no XSS), h2→h3 heading order, no 4.3/4.4 scope leak | — | **verified correct by both reviewers.** |

## Auto Run Result

- **Outcome:** SUCCESS
- **Story:** 4.2 — Result cost card
- **Baseline:** `3328c13`
- **Implementation:** DIRECT (contained presentational story). New `src/features/results/` feature: pure `buildSummaryLine` + `resolveConfidence`, results `copy.ts` (reusing shell `DISCLAIMER`), and `ResultCostCard.tsx` — MUI `Paper` (600px / 32px / `tokens.shadows.result`), centered `cost-display` range via `formatAudRange`, Confidence chip, indicative disclaimer, "+ More Information" Accordion expander, and a polite live region. Barrel added.
- **Review:** Blind Hunter + Edge Case Hunter (parallel). 7 finding-groups → 5 patched, 1 deferred (persistent live region → Story 4.3), 1 rejected (comma ambiguity). The HIGH (duplicate id) was fixed.
- **Gates (post-patch):** typecheck ✅ · lint ✅ · test ✅ **357 passed (56 files)** · build ✅. `cost-display` used only in `ResultCostCard.tsx` (verified); no ad-hoc hex; Epics 1–3 + Story 4.1 regressions ✅.
- **New dependencies:** none.
