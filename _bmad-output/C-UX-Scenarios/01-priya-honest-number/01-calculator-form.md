# 01-calculator-form

**Scenario:** [01 — Priya Gets an Honest Number](./01-priya-honest-number.md)
**Figma source:** frame `9:2` — see [figma-design-observations.md](../_figma-imports/figma-design-observations.md) · render [`figma-9-2-desktop-1512w.png`](../_figma-imports/figma-9-2-desktop-1512w.png)

> Every value below is grounded in the **actual Figma pixels** (pulled via MCP `get_metadata` +
> `get_design_context`). Where the re-narrated handover docs disagree, **pixels win** — see the
> Conflicts table in the observations ledger.

---

## Page Metadata

| Property | Value |
|----------|-------|
| **Scenario** | 01 — Priya Gets an Honest Number |
| **Page Number** | 01 (form / active-input state) |
| **Platform** | Desktop web (1512w reference); responsive down to mobile |
| **Page Type** | Full Page |
| **Viewport** | Desktop-first (reference), mobile-supported |
| **Interaction** | Mouse+keyboard; touch-supported |
| **Visibility** | Public (no auth) |

---

## Overview

**Page Purpose:** Let a homeowner get a credible renovation cost estimate by answering a short,
stepped set of questions — building trust *before* any ask.

**User Situation:** Priya has landed on the calculator with a property address pre-filled. She wants
a realistic number without handing over personal details up front.

**Success Criteria:** She can complete Step 1 (renovation type) and see the flow progress through
Steps 2–3 without confusion; the surface reads as trustworthy and professional.

**Entry Points:** Direct link / embedded calculator with address context.

**Exit Points:** Result/estimate surface → optional lead CTA (offered *after* value, never a gate — see Trigger Map tension resolution).

---

## Reference Materials

**Strategic Foundation:**
- [Product Brief](../../A-Product-Brief/project-brief.md)
- [Trigger Map](../../B-Trigger-Map/trigger-map.md) — primary target: Priya
- [Scenario 01](./01-priya-honest-number.md)

**Design Truth:**
- [Figma Design Observations](../_figma-imports/figma-design-observations.md) — exact tokens/measurements

---

## Layout Structure

Dark app bar → light canvas with a **840px centered content column** (336px side margins at 1512w) →
dark footer with disclaimer. The column holds an address row and a vertical accordion of three step
cards (Step 1 expanded, Steps 2–3 collapsed).

```
+--------------------------------------------------------------+  header 68.98px (dark)
| [Your logo]                                  [company logo]  |
+--------------------------------------------------------------+
|            light blue-grey canvas (~#EDF1F3)                 |
|      +------------------ 840px column ------------------+     |
|      | 400 Catherine Street ...        [Enter new addr] |     |  address row
|      | +----------------------------------------------+ |     |
|      | | Step 1: Renovation type                  ^   | |     |  paper (expanded, r=16)
|      | | Is an Internal or External renovation?       | |     |
|      | | [ Internal ]  [ External ]                   | |     |  outlined violet buttons
|      | +----------------------------------------------+ |     |
|      | +----------------------------------------------+ |     |  ~16px gap
|      | | Step 2: What to renovate                 v   | |     |  paper (collapsed)
|      | +----------------------------------------------+ |     |
|      | +----------------------------------------------+ |     |
|      | | Step 3: More questions                   v   | |     |  paper (collapsed)
|      | +----------------------------------------------+ |     |
|      +------------------------------------------------+     |
+--------------------------------------------------------------+  footer 81.45px (dark)
| Cotality disclaimer (3 lines, small light-grey)              |
+--------------------------------------------------------------+
```

---

## Spacing (from Figma pixels)

| Property | Value (Figma) | Suggested token |
|----------|---------------|-----------------|
| Content column width | **840px**, centered | `container-md` |
| Side margins @1512w | 336px each | (derived from centering) |
| Card padding | **8px** | `space-xs` |
| Card header padding | 12px vertical, 16px horizontal | `space-sm`/`space-md` |
| Card body padding | 8px top, 16px bottom, 16px sides | `space-xs`/`space-md` |
| Gap between step cards | **≈16px** | `space-md` |
| Heading→buttons gap (in card body) | 16px | `space-md` |
| Gap between Internal/External buttons | **7.98px** | `space-xs` |
| Button padding | 7.994px × 16.002px | `space-xs` × `space-md` |

---

## Typography (from Figma pixels)

| Element | Semantic | Font | Size | Line height | Weight | Color |
|---------|----------|------|------|-------------|--------|-------|
| Step header ("Step 1: Renovation type") | H6/label | **Source Sans Pro** | 14px | 18.2px | 400 | Ebony 80% (#110B1C@80%) |
| Question ("Is an Internal or External renovation?") | H3 | **Poppins** | 17.7px | 23px | 400 | Ebony 80% |
| Button label ("Internal"/"External") | button | **Source Sans Pro** | 15.8px | 23.63px | 400 | #432A6E |
| Address text | p | Source Sans Pro | ~14–16px | — | 400 | Ebony 80% |
| Footer disclaimer | p | Source Sans Pro | ~12px, 3 lines | 18px | 400 | light grey on dark |

---

## Page Sections

### Section: Header Bar
**OBJECT ID:** `calculator-form-header`

| Property | Value |
|----------|-------|
| Purpose | App branding bar |
| Height | 68.98px, dark background |
| Contents | left "Your logo" placeholder (125×33); right company-logo (129×45) |
| Note | Figma shows wireframe logo placeholders; app's text branding is an accepted interpretation (OI-F1) |

### Section: Address Row
**OBJECT ID:** `calculator-form-address-row`

#### Address label
**OBJECT ID:** `calculator-form-address-label`

| Property | Value |
|----------|-------|
| EN | "400 Catherine Street Lilyfield NSW 2040" |
| Component | text (H6/body), Ebony 80% |

#### Change-address link
**OBJECT ID:** `calculator-form-address-change`

| Property | Value |
|----------|-------|
| EN | "Enter new address" |
| Behavior | onClick → address entry (keep-vs-reset behavior is **OI-7**, open) |
| Placement | right-aligned in the 840px column |

### Section: Step Accordion
**OBJECT ID:** `calculator-form-steps`

| Property | Value |
|----------|-------|
| Component | vertical accordion of MuiPaper cards |
| Card style | bg #FFFFFF, radius **16px**, padding 8px, shadow `0 2px 2px rgba(17,11,28,0.08)` |
| Header | min-height 48px, chevron (21px) — up when expanded, down when collapsed |

#### Step 1 — Renovation type (expanded)
**OBJECT ID:** `calculator-form-steps-1`

| Property | Value |
|----------|-------|
| Header EN | "Step 1: Renovation type" |
| Question EN | "Is an Internal or External renovation?" |
| State | expanded (default entry state) |

##### Internal button
**OBJECT ID:** `calculator-form-steps-1-internal`

| Property | Value |
|----------|-------|
| Component | **outlined** button — 1px border #432A6E, label #432A6E, radius 4px |
| EN | "Internal" (title-case, **not** uppercase) |
| Behavior | onClick → select renovation type = internal |

##### ↕ `calculator-form-steps-1-internal-external-gap` — space-xs (7.98px)

##### External button
**OBJECT ID:** `calculator-form-steps-1-external`

| Property | Value |
|----------|-------|
| Component | outlined button — 1px border #432A6E, label #432A6E, radius 4px |
| EN | "External" (title-case) |
| Behavior | onClick → select renovation type = external |

#### Step 2 — What to renovate (collapsed)
**OBJECT ID:** `calculator-form-steps-2`

| Property | Value |
|----------|-------|
| Header EN | "Step 2: What to renovate" |
| State | collapsed; title muted; chevron down |
| Progression | opens after Step 1 answered — **OI-8** (open) |

#### Step 3 — More questions (collapsed)
**OBJECT ID:** `calculator-form-steps-3`

| Property | Value |
|----------|-------|
| Header EN | "Step 3: More questions" |
| State | collapsed; title muted; chevron down |
| Contents | question set **OI-2** (open) |

### Section: Footer
**OBJECT ID:** `calculator-form-footer`

| Property | Value |
|----------|-------|
| Height | 81.45px, dark |
| Contents | Cotality disclaimer — 3 lines, ~18px line-height (exact text per `copy.ts` / Figma) |

---

## Page States

| State | When | Appearance | Actions |
|-------|------|------------|---------|
| Default | entry, address known | Step 1 expanded, Steps 2–3 collapsed | answer Step 1 |
| Step answered | a selection made | selected button emphasized (**OI-F2** fill TBD); next step opens (**OI-8**) | continue |
| No address | address missing | address row prompts entry | enter address |
| Result | all steps answered | estimate shown + optional lead CTA (after value) | view / accept CTA |

---

## Technical Notes

- **Token remap required (fidelity fix):** introduce **Poppins** (headings) + **Source Sans Pro**
  (body/buttons); set primary/accent to **#432A6E**; text to **Ebony 80%**; paper radius **16px**,
  button radius **4px**. These replace the drifted handover values (#0066CC / Roboto). See
  observations ledger Conflicts table.
- Re-verify the running app against `figma-9-2-desktop-1512w.png` after the remap.
- The captured Figma is an `html.to.design` snapshot of a live MUI app — MUI component mapping is
  intentional and preserved.

---

## Open Questions

| # | Question | Context | Status |
|---|----------|---------|--------|
| OI-2 | What are Step 3's questions? | Step 3 body undefined in Figma | 🔴 Open |
| OI-7 | On "Enter new address", keep or reset prior answers? | Affects data model + UX | 🔴 Open |
| OI-8 | Exact step-progression rule (auto-open next?) | Governs accordion behavior | 🔴 Open |
| OI-F1 | Exact header/canvas background hexes; logo treatment | Observed from render only | 🔴 Open |
| OI-F2 | Selection-button **selected** state (fill/contrast) | Not shown in this frame | 🔴 Open |
| OI-F3 | Poppins + Source Sans Pro licensing/availability | Needed before token remap | 🔴 Open |
| R3 | Cost algorithm behind the estimate | Out of UX scope; flagged | 🔴 Open |

**Status Legend:** 🔴 Open | 🟡 In Discussion | 🟢 Resolved

_All specifications derived from the ingested Figma + existing authoritative artifacts under the
autonomous-derivation pattern (owner unavailable). **Pending owner confirmation.**_

---

## Checklist

- [x] Page purpose clear
- [x] All Object IDs assigned
- [x] Values grounded in Figma pixels
- [x] Translations (EN — `product_languages: [en]`)
- [x] States documented
- [x] Open questions captured

---

_Created using Whiteport Design Studio (WDS) methodology — Figma-grounded._
