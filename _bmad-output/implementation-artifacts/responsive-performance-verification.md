# Responsive & Performance Verification (Story 6.3)

- **Date:** 2026-08-13
- **Epic:** 6 — Release Readiness & Verification
- **Requirements:** NFR-2 (responsiveness), NFR-3 (performance), UX-DR21 (responsive completion); records `[NOTE]` OI-4
- **Breakpoints (per `ux-requirements.md` / `HANDOVER_03`):** Mobile **320–767px**, Tablet **768–1024px**, Desktop **1512px+**
- **Method:** Each responsive checkpoint is `pass` (statically verified against the actual layout code, cited) or `manual-pass` (a browser-rendered check the node-only harness cannot run — documented with the expected behaviour). Performance is measured from the real production build.

> **Harness ceiling:** no browser, no layout engine, no Lighthouse/Web-Vitals runner. So **rendered reflow at each breakpoint and Core Web Vitals are a documented manual pass**, not asserted numbers. What CAN be verified statically — the layout *rules* (breakpoint `sx`, `flexWrap`, `direction`, `contentMax`, sticky footer, absence of fixed widths that exceed 320px) and the real **bundle sizes** — is verified and cited.

---

## 1. Responsive contract (NFR-2, UX-DR21)

**Design invariant (`EXPERIENCE.md §Responsive`): one column at every breakpoint — layout adapts, IA does not.** This is a guided single-column form, never a multi-column layout, which makes the responsive surface inherently low-risk.

| Invariant | Verdict | Evidence |
|---|---|---|
| Single centred content column, capped width | ✅ pass | `AppShell.tsx` `Container` `maxWidth={false}` + `sx.maxWidth = theme.layout.contentMax` (840px) + `mx:'auto'` + `width:'100%'`; `tokens.ts` `contentMax:840`. |
| Responsive side margins (reduce on mobile) | ✅ pass | `AppShell.tsx` `px:{ xs:2, sm:3 }`; `Footer.tsx` same. Tablet/desktop keep the wider gutter, mobile tightens — matches "reduced side margins" contract. |
| Sticky footer / full-height shell | ✅ pass | `AppShell.tsx` `display:flex; flexDirection:column; minHeight:100dvh`; `Container` `flexGrow:1` → footer sits at the bottom on short content, `100dvh` avoids the iOS URL-bar jump. |
| Step 1 (renovation type) reflow: side-by-side ↔ stacked | ✅ pass (auto-reflow) | `RenovationTypeSelect.tsx` `ToggleButtonGroup` `sx={{ flexWrap:'wrap', gap:1 }}` — buttons wrap to fewer-per-row as width shrinks; no fixed columns to overflow. |
| Step 2 (items) reflow: 2-col ↔ stacked | ✅ pass (auto-reflow) | `ItemMultiSelect.tsx` `ToggleButtonGroup` `flexWrap:'wrap'` — same auto-wrap; adapts by available width rather than a hard breakpoint. |
| Result actions: inline (desktop) ↔ stacked full-width (mobile) | ✅ pass | `ResultsPanel.tsx` `Stack direction={{ xs:'column', sm:'row' }}` — Edit/New stack on mobile, inline from `sm`. |
| Cost card does not force overflow | ✅ pass | `ResultCostCard.tsx` `maxWidth:600` (a *max*, not a fixed width) inside the 840px column — shrinks below 600 on narrow viewports. |
| Address modal fits mobile | ✅ pass | `AddressModal.tsx` `maxWidth="sm"` MUI Dialog — full-width-minus-margins on mobile per MUI defaults. |
| Rendered reflow at 320 / 768 / 1512 (no broken layout) | ⚠ manual-pass | Load each breakpoint in a browser and confirm no clipped/overlapping content and the one-column IA holds. Static rules above make a break unlikely, but pixel confirmation needs a browser. **Eyeball spot:** a pathological long ToggleButton label (`minWidth:44` + `px:3`, MUI buttons don't wrap label text) at 320px — content-dependent, low risk with current option labels. |

## 2. Disclaimer persistence (UX-DR21)

| Check | Verdict | Evidence |
|---|---|---|
| Disclaimer rendered on **every** view | ✅ pass | `Footer.tsx` renders `DISCLAIMER` unconditionally; `AppShell.tsx` mounts `<Footer/>` once around all routes; `AppShell.test.tsx` "renders the constant disclaimer". |
| Disclaimer visible across breakpoints | ✅ pass (static) / ⚠ manual-pass (rendered) | The footer uses the same responsive `px` and is never conditionally hidden; visual confirmation at each breakpoint is a manual-pass. |

## 3. No horizontal scroll / fixed-width audit (NFR-2)

Scanned `src` + `app` for fixed `width`/`minWidth` ≥ 3 digits that could exceed a 320px viewport:

| Element | Fixed width | 320px-safe? | Note |
|---|---|---|---|
| `Header.tsx` brand-mark | `width:125`, `width:128`, `minWidth:0`, `flexShrink:1` | ✅ yes | 125/128px ≪ 320; `flexShrink:1` + `minWidth:0` let it compress. |
| `ResultCostCard.tsx` | `maxWidth:600` | ✅ yes | a *max*, not a fixed width — shrinks on narrow screens. |
| `AddressModal.tsx` | `maxWidth="sm"` | ✅ yes | MUI Dialog responsive default. |

**No fixed-width element exceeds the 320px mobile viewport, and there are no multi-column grids** — the two horizontal-scroll causes are structurally absent. Rendered confirmation of zero horizontal scrollbar at 320px is a manual-pass.

## 4. Performance budget (NFR-3)

NFR-3 has no hard numeric target in the requirements ("actions feel instant <200ms micro; optimise bundle; fast results"); this records the **measured production baseline** as the budget to hold.

**Measured from a fresh production build (`.next/static/chunks/*.js`):**

| Metric | Measured | Note |
|---|---|---|
| Total first-load JS (all chunks, gzipped) | **≈ 365 KB gz** (≈ 1.28 MB uncompressed) | Realistic transfer weight. |
| Largest single chunk (gzipped) | ≈ 114 KB gz | The MUI/emotion + React runtime vendor chunk. |
| Next 2 chunks (gzipped) | ≈ 78 KB gz, ≈ 70 KB gz | Framework + app. |
| Total `.next/static` | ≈ 1.5 MB (pre-compression, incl. non-JS) | — |

- **Main driver:** MUI v9 + emotion is the dominant weight, as expected for a component-library UI. This is the single largest optimisation lever if a hard budget is later imposed (tree-shaking already applies via per-component `@mui/material/X` imports — verified: the codebase imports `@mui/material/Button` etc., not the barrel).
- **Micro-interaction feel (<200ms):** motion durations come from theme tokens and collapse under `prefers-reduced-motion` (`theme.test.ts` "wires motion durations…", "collapses motion under prefers-reduced-motion"); interactions are local state updates (no network) so they are frame-fast. Rendered <200ms confirmation is a manual-pass.
- **Fast results:** the estimate + lead are deterministic in-process stubs (no real network/DB) — results return within a request round-trip. Real-backend latency is an OI-3/OI-11 concern, not a spike measurement.
- **Core Web Vitals (LCP/CLS/INP):** ⚠ manual-pass — require a browser + Lighthouse; not installed (no-new-deps). Recorded as the required manual measurement, with the ≈365 KB gz baseline as the starting budget.

## 5. OI-4 record — mobile/tablet judgement calls (no hi-fi mocks)

`[NOTE]` **OI-4: mobile & tablet high-fidelity mocks do not exist; desktop (1512, 840px column) is authoritative and devs adapted.** The reflow decisions made without mocks, recorded for the eventual design reconciliation:

1. **Step 1 / Step 2 reflow uses `flexWrap:'wrap'` (auto-wrap by available width) rather than explicit per-breakpoint column counts.** The `EXPERIENCE.md` contract says "Step 1 side-by-side / Step 2 2-col on tablet, stacked on mobile" — auto-wrap satisfies this behaviourally (wide → multiple per row, narrow → stacked) but the exact column count at tablet is emergent, not pixel-specified. Reconcile against tablet mocks when they exist.
2. **Result actions** stack at `< sm` (600px) — the MUI `sm` boundary, which sits inside the 320–767 mobile band, not exactly at the 768 tablet boundary. Judgement: MUI's `sm` is the pragmatic stack point; revisit if mocks demand the 768 line.
3. **Side-margin tightening** uses MUI `px:{xs:2, sm:3}` (16px / 24px) rather than a mock-specified mobile gutter.

None of these are defects against the behavioural contract; they are the documented desktop-authoritative adaptations OI-4 anticipates.

---

## Defects logged

**None.** The single-column IA, flex-wrap reflow, responsive padding, sticky `100dvh` footer, and absence of over-320 fixed widths / multi-column grids mean no overflow or broken-layout defect was found in the static audit. No HALT/blocked condition.

---

## Verdict

**Conditionally signed off — responsive contract and bundle budget verified statically; rendered reflow + Web Vitals routed to a documented manual pass.** The layout is a single-column, flex-wrap, capped-width column with responsive gutters and a persistent sticky-footer disclaimer, and contains no fixed-width element that can overflow a 320px viewport or any multi-column grid — so the NFR-2 "no overflow/broken layout at each breakpoint" invariant is structurally satisfied and cited to code. The NFR-3 budget baseline is measured (≈365 KB gz first-load JS, MUI-dominated) and recorded. OI-4's mobile/tablet judgement calls are recorded for design reconciliation. The honest ceiling: pixel-level reflow at 320/768/1512 and Core Web Vitals require a browser and are a documented manual pass, not asserted under the node-only harness. Tree green (no code changes).
