# Figma → Implementation Fidelity Findings

**Date:** 2026-08-14
**Context:** Spike goal was to test the fidelity of the pipeline from Figma designs
through the BMAD/WDS process to implementation. After Epics 1–6 completed, the built
app was compared directly against the actual Figma frame
(`Q0fDj1AKMbwyPJRmPltox0`, node `9:90`) pulled live via the Figma MCP connection.

## Root cause of the fidelity gap

**The Figma was never visually ingested into the pipeline.** The
`ux-designs/.../imports/` folder is empty. The build was driven entirely by textual
artifacts (`FIGMA_ANALYSIS.md`, `HANDOVER_01_DESIGN_SYSTEM.md`,
`HANDOVER_03_PAGE_SPECS.md`) that an agent authored by *re-narrating* the design in a
polished product voice.

Consequences of building from a re-narrated text spec instead of the pixels:

1. The build faithfully implemented the **text**, so it drifted from the **design**.
   The re-narration invented a page-level H1 title, softened the disclaimer, reworded
   the step labels, and added a "See my estimate" CTA that the design never showed.
2. **The token/brand layer stayed faithful** — colors and the typography ramp in
   `src/theme/tokens.ts` match the design system doc exactly. The drift was
   structural/compositional/copy, not visual-brand.
3. **Epic 6 verification measured the build against the same drifted docs**, not the
   actual Figma, so it reported high fidelity while real divergences existed. The
   verification loop never closed against the design source.

## Divergences found and corrected

| # | Divergence (built vs Figma) | Fix |
|---|------------------------------|-----|
| 1 | Giant H1 "Reno Calculator" page title, absent from the design | Removed from `app/page.tsx` — brand lives in the header only |
| 2 | Step labels "Renovation type" / "What are you renovating?" / "Property details" | Restored the design's "Step 1: Renovation type" / "Step 2: What to renovate" / "Step 3: More questions" (`step-state.ts` + `EstimateStepper.tsx` header prefix) |
| 3 | UPPERCASE grey MUI ToggleButtons | Title-case, primary-coloured outlined buttons via a `MuiToggleButton` theme override (`textTransform: none` + primary border/text) |
| 4 | Softened, invented disclaimer copy | Restored the design's exact Cotality/Demo Channel legal disclaimer (`copy.ts`) |

Lower-priority residual differences (intentionally left):
- **Empty vs resolved address state** — the Figma frame shows a mid-flow *resolved*
  address; the home screenshot shows the empty state. Different states, not drift.
- **Header text vs logo placeholders** — the Figma header is a wireframe placeholder
  ("Your logo" / "company-logo"); text branding is a reasonable interpretation.

## Recommendation for the pipeline (the spike's key learning)

1. **Ingest the actual Figma visuals**, not a re-narrated text analysis. Use the Figma
   MCP (`get_design_context` / `get_screenshot` / `download_assets`) to pull real
   frames and assets into the `imports/` folder as the source of truth.
2. **Verify against the design, not the handover docs.** Fidelity checks must diff the
   running app against the Figma screenshots (as done here with headless Chrome), so
   the verification loop closes against the design source rather than an intermediate
   re-narration.
3. **Treat handover text as annotation, not authority.** Where the prose and the pixels
   disagree, the pixels win.
