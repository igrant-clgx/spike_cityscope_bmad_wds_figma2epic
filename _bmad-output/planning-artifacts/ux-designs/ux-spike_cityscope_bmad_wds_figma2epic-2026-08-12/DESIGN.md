---
name: Spike Reno Calculator
description: Trustworthy 3-step renovation cost calculator + lead capture for AU homeowners. Material UI (MUI v9) on React/Next.js; this DESIGN.md specifies the brand-layer delta over MUI defaults.
status: final
sources:
  - '{planning_artifacts}/prds/prd-spike_cityscope_bmad_wds_figma2epic-2026-08-12/prd.md'
  - '{planning_artifacts}/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md'
  - 'HANDOVER_01_DESIGN_SYSTEM.md'
  - 'FIGMA_ANALYSIS.md'
updated: 2026-08-12
colors:
  # Brand + semantic tokens applied to the MUI theme. Unlisted tokens inherit MUI defaults.
  header-bg: '#2C2C2C'
  canvas: '#F5F5F5'
  surface: '#FFFFFF'
  text-primary: '#333333'
  text-secondary: '#666666'
  text-hint: '#999999'
  primary: '#0066CC'
  primary-hover: '#0052A3'
  primary-active: '#003D7A'
  on-primary: '#FFFFFF'
  success: '#28A745'
  error: '#DC3545'
  warning: '#FFC107'
  info: '#17A2B8'
  border: '#E0E0E0'
  disabled: '#CCCCCC'
typography:
  # Roboto stack (MUI default family). Ramp overrides the MUI default sizes to match the design.
  h1: { fontFamily: '"Roboto","Helvetica","Arial",sans-serif', fontSize: 48px, fontWeight: '700', lineHeight: '1.167', letterSpacing: -0.5px }
  h2: { fontSize: 40px, fontWeight: '700', lineHeight: '1.2', letterSpacing: -0.3px }
  h3: { fontSize: 28px, fontWeight: '700', lineHeight: '1.4' }
  h4: { fontSize: 22px, fontWeight: '600', lineHeight: '1.45' }
  h5: { fontSize: 18px, fontWeight: '600', lineHeight: '1.5' }
  h6: { fontSize: 16px, fontWeight: '600', lineHeight: '1.5', letterSpacing: 0.5px }
  body: { fontSize: 14px, fontWeight: '400', lineHeight: '1.5', letterSpacing: 0.25px }
  caption: { fontSize: 12px, fontWeight: '400', lineHeight: '1.33', letterSpacing: 0.4px }
  button: { fontSize: 14px, fontWeight: '500', lineHeight: '1.75', letterSpacing: 0.4px }
  cost-display: { fontSize: 56px, fontWeight: '700', lineHeight: '1.2', letterSpacing: -1px }
rounded:
  sm: 4px      # buttons, inputs
  md: 8px      # cards, containers, accordion
  full: 9999px # avatars, badges
spacing:
  # 8px base (MUI spacing(1) = 8px). Named tokens for the recurring layout gaps.
  base: 8px
  step-gap: 24px
  card-pad: 24px
  content-max: 840px
  header-h: 68px
components:
  header:
    background: '{colors.header-bg}'
    foreground: '{colors.on-primary}'
    height: '{spacing.header-h}'
  button-selection-selected:
    background: '{colors.primary-active}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.sm}'
    minHeight: 44px
  button-selection-unselected:
    background: '{colors.canvas}'
    foreground: '{colors.text-primary}'
    border: '1px solid {colors.border}'
    radius: '{rounded.sm}'
    minHeight: 44px
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.on-primary}'
    hover: '{colors.primary-hover}'
    radius: '{rounded.sm}'
    minHeight: 44px
  button-secondary:
    background: '{colors.surface}'
    foreground: '{colors.primary}'
    border: '1px solid {colors.primary}'
    radius: '{rounded.sm}'
    minHeight: 44px
  button-phone-cta:
    background: '{colors.primary}'
    foreground: '{colors.on-primary}'
    icon: phone-left
    fullWidth: true
    radius: '{rounded.sm}'
  contact-section:
    background: '{colors.canvas}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    padding: 32px
    maxWidth: 600px
  snackbar:
    foreground: '{colors.on-primary}'
    radius: '{rounded.sm}'
    shadow: '0px 2px 8px rgba(0,0,0,0.15)'
    position: bottom-center
    # background varies by severity: {colors.success} / {colors.error} / {colors.warning}
  input-error:
    border: '2px solid {colors.error}'
    focusGlow: '0 0 0 3px rgba(220,53,69,0.10)'
    helperText: '{colors.error}'
  card-accordion:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    shadow: '0px 2px 4px rgba(0,0,0,0.08)'
  card-result:
    background: '{colors.surface}'
    border: '1px solid {colors.border}'
    radius: '{rounded.md}'
    shadow: '0px 4px 8px rgba(0,0,0,0.10)'
    padding: 32px
    maxWidth: 600px
  cost-figure:
    typography: '{typography.cost-display}'
    foreground: '{colors.text-primary}'
---

# Spike Reno Calculator — DESIGN.md

> Visual identity for a 3-step renovation cost calculator that also captures home-loan leads for a financial institution ("Demo Channel"). Inherits Material UI (MUI v9); this file specifies only the brand-layer delta. Behavioral contract lives in `EXPERIENCE.md`. Both spines win on conflict with any mock or import.

## Brand & Style

The Reno Calculator is a **calm, trustworthy financial tool**, not a lead-grabbing funnel. Its job is to make a homeowner feel they got an honest answer before they're ever asked for anything. The visual posture follows: a sober dark-charcoal header that reads "established institution," a quiet light-gray canvas, white cards that hold one clear task at a time, and a single blue accent that carries every interactive moment. Restraint is the brand — nothing decorative competes with the two things that matter: the current question and, at the end, the cost.

It inherits MUI wholesale. The 90% of surface that ships from MUI (`AppBar`, `Accordion`, `Paper`, `Button`, `TextField`, `Checkbox`, `CircularProgress`, `Alert`) uses MUI's visual specs as themed by the tokens above. This DESIGN.md overrides only the palette, the type ramp, corner radii, and a handful of brand-specific component treatments (the charcoal header, the selection buttons, the oversized cost figure).

## Colors

A near-neutral system plus one working blue.

- **Header Charcoal (`{colors.header-bg}`)** — the header/footer bar only. It is the trust anchor; white logos and text sit on it at high contrast. Never a content background.
- **Canvas (`{colors.canvas}`)** and **Surface White (`{colors.surface}`)** — the page sits on canvas; every card, accordion, and the result panel is surface white with a `{colors.border}` hairline. Depth comes from the border first, a soft shadow second.
- **Primary Blue (`{colors.primary}`, hover `{colors.primary-hover}`, active `{colors.primary-active}`)** — every link, primary CTA, focus ring, and *selected* choice. `primary-active` fills a selected Internal/External or item button (white text). This is the only chromatic color in the interface; if an element isn't interactive or selected, it isn't blue.
- **Text `{colors.text-primary}` / `{colors.text-secondary}` / `{colors.text-hint}`** — questions and the cost figure in primary; descriptions and helper copy in secondary; placeholder/disabled in hint.
- **Semantic `{colors.success}` / `{colors.error}` / `{colors.warning}` / `{colors.info}`** — validation and system feedback only, always paired with an icon or text (never color alone).

Avoid: gradients, more than one brand hue, colored card backgrounds, using blue for anything non-interactive, semantic colors as decoration.

## Typography

Roboto/Helvetica/Arial (MUI's default family). The ramp is tuned so hierarchy comes from size and weight, not color:

- **`{typography.h6}` — accordion step headers** ("Step 1: Renovation type"), 16/600.
- **`{typography.h3}`–`{typography.h5}` — form questions** ("Is this an Internal or External renovation?"), large and calm.
- **`{typography.body}` — descriptions, options, helper text**, 14/400.
- **`{typography.caption}` — the legal disclaimer** and field hints.
- **`{typography.cost-display}` — the estimate figure only.** 56px/700 with tight tracking. This is the emotional peak of the flow; nothing else in the product uses this role.

## Layout & Spacing

8px base (MUI `spacing(1)`). Content is a single centered column, max `{spacing.content-max}` (840px) on desktop with generous side margins; the header is `{spacing.header-h}` (68px). Steps are `{spacing.step-gap}` (24px) apart; card interiors pad 24px; the address block sits 32px above the accordion. One column at every breakpoint — this is a guided form, never a multi-column layout. Full breakpoint behavior lives in `EXPERIENCE.md § Responsive`.

## Elevation & Depth

Material-Design-lite. A card is a white surface with a `{colors.border}` hairline and a soft shadow — accordion cards at `0px 2px 4px rgba(0,0,0,0.08)`, the result card one step up at `0px 4px 8px rgba(0,0,0,0.10)`, inputs barely lifted. Borders do the primary work; shadow is a supporting cue and never exceeds 0.15 opacity. Elevation is not used to rank content — everything lives on one calm plane except the result, which earns its slightly deeper shadow.

## Shapes

- `{rounded.sm}` (4px) — buttons and inputs.
- `{rounded.md}` (8px) — cards, accordion containers, the result panel. A collapsed accordion header rounds its top two corners only (`8px 8px 0 0`); expanded, the whole card is 8px.
- `{rounded.full}` — avatars, status/confidence badges.

The slightly-rounder cards against sharper buttons keep the surface professional, not playful.

## Components

MUI components used as themed (no bespoke visuals): `AppBar`, `Paper`, `Accordion`, `TextField`, `Select`, `Checkbox`, `Radio`, `Slider`, `CircularProgress`, `Skeleton`, `Alert`, `Snackbar`, `Dialog` (address-change modal).

Brand-layer treatments:

- **Header** — full-width `{colors.header-bg}` bar, `{spacing.header-h}` tall, product logo left (~125px) and Demo Channel logo right (~128px).
- **Selection button (Internal/External, renovation items)** — a toggle. Unselected: `{components.button-selection-unselected}` (canvas fill, hairline border, primary text). Selected: `{components.button-selection-selected}` (`primary-active` fill, white text). 44px min height. The single clearest "you chose this" signal in the flow.
- **Primary CTA** ("Continue", "Get Estimate") — `{components.button-primary}`, blue fill, white text, hover `primary-hover`.
- **Secondary CTA** ("Edit Estimate") — `{components.button-secondary}`, outlined (blue border + blue text on white). Pairs beside the primary New Estimate button below the result card.
- **Phone CTA** ("Call us: 0800 269 4663") — `{components.button-phone-cta}`, full-width blue button with a left phone icon; wraps a `tel:` link. Lives in the Contact Section.
- **Contact Section card** — `{components.contact-section}`, canvas-fill (`{colors.canvas}`) card below the result actions holding the "Talk to a Home Loan Coach" heading, description, and Phone CTA. Its canvas fill deliberately distinguishes it from the white result card.
- **Accordion card** — `{components.card-accordion}`. **Result card** — `{components.card-result}` (600px, 32px padding, deeper shadow); contents: title, type/items summary, the cost figure, disclaimer, and a `+ More Information` link (`{colors.primary}`, 500 weight) that expands the calculation explainer.
- **Cost figure** — `{components.cost-figure}`, the 56px range on the result card, centered (e.g. `$32,700 - $40,000`).
- **Toast / Snackbar** — `{components.snackbar}`, bottom-center, background by severity, white text, slide-up ~300ms, auto-dismiss 3–5s. Used for form-level submit feedback, not field errors.
- **Input error state** — `{components.input-error}`, 2px error border + soft error glow + error helper text; always accompanied by the inline text message (never border color alone).

## Do's and Don'ts

| Do | Don't |
| --- | --- |
| Inherit MUI defaults for everything outside the brand layer | Restyle MUI components that the tokens already theme |
| Use `{colors.primary}` for interactive + selected only | Paint non-interactive elements blue |
| Let the `{typography.cost-display}` role be the visual peak | Reuse 56px type anywhere but the estimate |
| Define depth with `{colors.border}` first, soft shadow second | Use heavy shadows (>0.15 opacity) or elevation to rank content |
| Keep one calm centered column ≤ 840px | Introduce multi-column or wide-table layouts |
| Pair every semantic color with an icon or text | Signal validation/state with color alone |
