# Figma Design Observations — Ingested Source of Truth

> **This is the artifact the pipeline was missing.** In the prior spike the `imports/` folder was
> empty — the Figma was never visually ingested, so the build drifted from the pixels. This file
> records the **exact** design values pulled live from the Figma via MCP (`get_metadata` +
> `get_design_context`), so downstream specs and code are grounded in pixels, not re-narrated prose.

**Source:** Figma "Spike Reno Calculator" — fileKey `Q0fDj1AKMbwyPJRmPltox0`, frame `9:2` ("1512w default"), page node `9:90`.
**Captured:** 2026-08-13 via Figma MCP.
**Reference render:** `figma-9-2-desktop-1512w.png` (this folder).

---

## Layout (desktop, 1512×799)

| Region | Node | Position / Size |
|--------|------|-----------------|
| Frame | 9:2 | 1512 × 799 |
| Header bar | 9:3 | full width × **68.98px** |
| — "Your logo" placeholder (left) | 9:7 | 125.39 × 32.98, at x≈12, y≈12 |
| — company-logo placeholder (right) | 9:10 | 128.56 × 44.98, right-aligned |
| Content region | 9:11 | y=68.98, height 648.57 |
| **Content column** | 9:16 | **840px wide, centered** (x=336 → left/right margins = 336px each), y-offset 32px |
| Address row | 9:18/9:20 | address text left; "Enter new address" link right (x≈724 within column) |
| Step 1 paper (expanded) | 9:27 | 840 × 169.8 |
| Step 2 paper (collapsed) | 9:60 | 840 × 64.8 |
| Step 3 paper (collapsed) | 9:72 | 840 × 64.8 |
| Gap between papers | — | ≈16px |
| Footer bar | 9:82 | full width × **81.45px** |

---

## Colors (exact, from Figma variables)

| Role | Figma name | Value | Notes |
|------|-----------|-------|-------|
| Text primary | Ebony 80% | **rgba(17, 11, 28, 0.8)** (#110B1C @ 80%) | Step headers + question headings |
| Primary / accent (outlined buttons) | Jacarta / `color/violet/30` | **#432A6E** | Internal/External border **and** label |
| Card / paper background | White | **#FFFFFF** | Accordion papers |
| Secondary text/icon | Black 54% | rgba(0,0,0,0.54) | referenced (muted/expand icon) |
| Header bar background | — (render) | near-black (~#1A1206 observed) | dark app bar |
| Canvas background | — (render) | light blue-grey (~#EDF1F3 observed) | page behind cards |

---

## Typography (exact, from Figma variables)

| Element | Font (Figma) | Size | Line height | Letter-spacing | Color |
|---------|--------------|------|-------------|----------------|-------|
| Step header ("Step 1: Renovation type") | **Source Sans Pro** (font-2) Regular 400 | **14px** | 18.2px | 0.5px | Ebony 80% |
| Question heading ("Is an Internal or External renovation?") | **Poppins** (font-1) Regular 400 | **17.7px** | 23px | 0.5px | Ebony 80% |
| Button label ("Internal"/"External") | **Source Sans Pro** (font-2) Regular 400 | **15.8px** | 23.63px | 0 | #432A6E |
| Address / body | Source Sans Pro (font-2) | ~14–16px | — | — | Ebony 80% |

**Type system:** headings = **Poppins**; body, labels, buttons = **Source Sans Pro**.

---

## Component tokens (exact)

**Accordion paper (Step card)** — node 9:27
- background `#FFFFFF`, padding `8px`, **border-radius `16px`** (`corner-radius/16`)
- shadow `0px 2px 2px 0px rgba(17,11,28,0.08)`
- header row: `min-height 48px`, `padding 0 16px`, content `padding 12px 0`
- expand icon: 21×21, rotates 180° when expanded (chevron up)
- collapsed step title rendered muted/secondary

**Selection buttons (Internal / External)** — nodes 9:51 / 9:57
- **outlined**: `border 1px #432A6E`, label `#432A6E`, **title-case** (NOT uppercase)
- padding `7.994px 16.002px`, **border-radius `4px`** (`corner-radius/4`), `min-width 64px`
- gap between buttons `7.98px`
- (selected state not shown in this frame — confirm fill treatment, OI)

---

## ⚠️ Pixels-vs-Doc CONFLICTS (the fidelity findings)

The prior build followed the re-narrated `HANDOVER_01_DESIGN_SYSTEM.md`, which **disagrees with the
actual Figma** on the most visible tokens. Pixels win:

| Token | Handover doc / build used | **Actual Figma** | Impact |
|-------|---------------------------|------------------|--------|
| Primary/accent color | `#0066CC` blue | **#432A6E violet (Jacarta)** | Buttons/accents are the wrong hue |
| Heading font | Roboto/Helvetica/Arial | **Poppins** | Wrong heading typeface |
| Body/label font | Roboto/Helvetica/Arial | **Source Sans Pro** | Wrong body typeface |
| Text color | generic dark grey (#2C2C2C-ish) | **Ebony 80% #110B1C@80%** | Slightly off text tone |
| Card radius | ~4–8px | **16px** (paper) / **4px** (buttons) | Card corners too tight |
| Button case | UPPERCASE (MUI default) | **Title-case** | Wrong casing (fixed earlier) |

**Recommendation:** re-map the design tokens (`src/theme/tokens.ts`) to these observed values —
introduce Poppins + Source Sans Pro, set primary to `#432A6E`, text to Ebony 80%, and paper radius
to 16px — then re-verify the running app against `figma-9-2-desktop-1512w.png`.

---

## New Open Items surfaced by ingestion
- **OI-F1** — confirm exact canvas + header-bar background hexes (observed from render; pull exact via a full-frame `get_design_context` or `download_assets`).
- **OI-F2** — selection-button **selected** state (fill/contrast) is not shown in this frame.
- **OI-F3** — whether Poppins + Source Sans Pro are licensed/available for the build (else nearest web-safe/Google Fonts equivalents).
