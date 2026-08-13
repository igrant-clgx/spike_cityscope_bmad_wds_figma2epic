# Address Search Section 2: Shared Header and Disclaimer Footer

## Purpose

Build the reusable page chrome for Address Search: a dual-brand header and the
legal disclaimer footer. Preserve the Figma proportions at the 1512px reference
viewport while allowing both regions to reflow without distortion or horizontal
overflow down to 320px.

## References

- Work item: `work/Address-Search-Work.yaml`, Section 2
- UX specification: `01.1-address-search.md`, Header and Footer / Disclaimer
- Figma frame: `2:3` (`1512w default`)
- Figma header: `2:6`, 1512x68.98
- Figma service-brand source: `2:16` (`header-logo`), 125.39x32.98
- Figma partner-brand source: `2:20` (`company-logo`), 128.56x44.98
- Figma footer: `2:81`, 1512x81.45
- Test scenario: `TS-001-renovation-estimate-visual-prototype.yaml`

The Figma artwork contains placeholder branding. Use the exported placeholder
where it is visually useful and provide clear `Demo Channel` and `Cotality`
text-name fallbacks. Do not invent final production logos.

## Objects

| Object ID | Type | Content / label | Behavior and states |
|---|---|---|---|
| `address-search-header` | Semantic header | Service and partner branding | Full-width horizontal row; brands occupy opposing edges; no navigation behavior |
| `address-search-header-brand-image` | Image or named fallback | `Demo Channel` | Eager load, intrinsic ratio preserved, maximum desktop size 125x33 |
| `address-search-header-partner-brand-image` | Image or named fallback | `Cotality` | Eager load, intrinsic ratio preserved, maximum desktop size 129x45 |
| `address-search-footer-disclaimer` | Ensemble footer landmark | Accessible label `Renovation calculator disclaimer` | Full-width footer; height grows with wrapped copy |
| `address-search-footer-disclaimer-copy` | Paragraph | Approved disclaimer copy below | Static legal text; readable at every supported viewport |

## Approved Disclaimer

> Disclaimer: The Renovation Calculator Report is available to customers who
> provide their contact details for Demo Channel to contact them about products
> and services. Renovation Calculator Report are prepared by Cotality. The
> statements, information and opinions contained in those reports are those of
> Cotality only, and Demo Channel AU does not endorse or accept any liability for
> them.

## React Structure

Create reusable, presentational components:

```text
src/components/page-chrome/
  BrandHeader.tsx
  DisclaimerFooter.tsx
  PageChrome.tsx
  page-chrome.css
```

`PageChrome` owns document order only:

```text
BrandHeader
main content slot
DisclaimerFooter
```

Wire `SearchPlaceholder` through `PageChrome`. Keep the existing semantic
placeholder main content until the hero section is implemented. Do not move
route or flow state into page chrome.

## Ensemble Integration

- Import `@ensemble/lib/components/footer` once from the application entry point.
- Render `en-footer` with an accessible label for the disclaimer landmark.
- Use Ensemble design tokens or CSS custom properties for color, typography, and
  spacing when a matching token exists.
- Keep the header page-specific rather than forcing it into `en-navbar`; the
  Figma header contains branding but no navigation.
- Add only the TypeScript custom-element typing required for `en-footer`; do not
  weaken JSX typing globally.

## Styling Requirements

- Do not add Tailwind; use scoped CSS for this React prototype.
- Header desktop reference height: 68.98px; use a 69px minimum rather than a
  fixed height so fallback names remain usable.
- Header desktop horizontal inset: 12px around each brand region.
- Header uses a two-column flex layout with `justify-content: space-between`.
- Images use `display: block`, `max-width: 100%`, `height: auto`, and
  `object-fit: contain`.
- Footer content reference width: 1080px inside a centered 1128px container.
- Disclaimer uses `text-xs` equivalent typography, normal weight, and a readable
  line height.
- Header-to-main and main-to-footer spacing is zero.
- At 320px, both brand regions remain readable without overlap. The partner
  fallback may wrap below the service brand only if it cannot fit; neither brand
  may be stretched, clipped, or visually distorted.
- Footer height is content-driven at narrow widths and must not clip the copy.
- No region may create horizontal scrolling from 320px through 1512px.

## TypeScript and State Requirements

- Components are stateless and accept only content/asset props needed for reuse.
- No reducer action, persistence, route behavior, network call, or timer is added.
- Missing or failed image assets expose the visible text-name fallback rather
  than an empty box.
- The disclaimer remains static and is not dismissible.

## Demo Asset Requirements

- Export the available Figma placeholder for `header-logo` into a local asset.
- Treat `company-logo` as a placeholder source; if the export is visually empty,
  render the approved `Cotality` named fallback instead.
- Store assets under `src/assets/brands/`.
- Do not reference temporary Figma URLs at runtime.

## Agent-Verifiable Acceptance Criteria

1. `address-search-header` precedes the page main content and
   `address-search-footer-disclaimer` follows it.
2. Both brand objects are present with accessible organization names or visible
   named fallbacks.
3. The footer is registered from Ensemble and exposes the accessible label
   `Renovation calculator disclaimer`.
4. The disclaimer text exactly matches the approved copy.
5. Header images preserve aspect ratio and never exceed their reference sizes.
6. The 1512px rendering preserves the approximately 69px header, centered
   1080px disclaimer content, and opposing brand alignment.
7. The 320px, 768px, 1024px, and 1512px renderings have no horizontal overflow,
   overlap, clipped text, or distorted branding.
8. Existing route, reducer, fixture, and guard behavior remains unchanged.

## User-Evaluable Acceptance Criteria

1. The header reads as a quiet secondary brand region rather than the primary
   page content.
2. The page chrome feels visually continuous with the Figma reference.
3. The disclaimer is legible without competing with the primary task.
4. The placeholder treatment is honest and does not imply production branding.

## Verification

1. Run the focused test suite and production build.
2. Open `/renocalc/ceshllg/search`.
3. Inspect 320px, 768px, 1024px, and 1512px viewport widths.
4. Confirm document order, object IDs, accessible labels, exact disclaimer text,
   aspect ratios, wrapping, and absence of horizontal overflow.
5. Present the browser rendering for qualitative approval.

## Out of Scope

- Hero artwork and hero/search composition
- Address combobox behavior
- Validation or navigation behavior
- Final production logos or legal approval
- Page chrome for Renovation Details or Estimate Result

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User

## Implementation Summary

- Added reusable `BrandHeader`, `DisclaimerFooter`, and `PageChrome` components.
- Added the local Figma service-brand placeholder and a named Cotality fallback.
- Registered and used the Ensemble footer component with its accessible label.
- Added responsive page-chrome styling and focused structural coverage.
- Corrected the Ensemble footer's narrow-grid intrinsic sizing behavior.
- Actual implementation time was not tracked.

## Implementation Verification

- The dual-brand header, local Figma placeholder, Cotality named fallback,
  Ensemble footer, and exact disclaimer copy are implemented.
- Browser checks passed at 320px, 768px, 1024px, and 1512px.
- All objects remain within the viewport with no overlap or horizontal overflow.
- The service artwork remains at or below 126x33 and preserves its aspect ratio.
- The desktop header measures 69px and the disclaimer content measures 1080px.
- The Ensemble footer is registered and exposes the specified accessible label.
- No browser console or runtime errors were observed.
