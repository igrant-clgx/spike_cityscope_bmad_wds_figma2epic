# Address Search Section 3: Responsive Hero Composition

## Purpose

Replace the foundation placeholder with the full-bleed Address Search hero:
the exported family photograph, contrast treatment, primary message, supporting
copy, and a reserved visual slot for the Section 4 combobox.

## References

- Work item: `work/Address-Search-Work.yaml`, Section 3
- UX specification: `01.1-address-search.md`, Hero Search
- Figma frame: `2:3`
- Figma hero: `2:22`, 1512x654.13
- Exported source artwork: 1182x537 PNG from Figma node `2:22`
- Figma desktop screenshot: 1512x804

## Objects

| Object ID | Type | Content | Behavior |
|---|---|---|---|
| `address-search-hero-search` | Main hero region | Hero composition | Full-bleed, responsive, positioned between header and footer |
| `address-search-hero-family-image` | Decorative image | Exported family photograph | Empty alt, eager load, cover crop, explicit dimensions |
| `address-search-hero-primary-headline` | `h1` | Renovation Calculator Report | Primary page heading |
| `address-search-hero-address-instruction` | Paragraph | Please type property address below: | Static instruction |
| `address-search-hero-value-supporting-copy` | Paragraph | If you're looking for a new place to call home, we will help you know more about it. | Static supporting copy |
| `address-search-hero-address-recovery-prompt` | Inline text | Address not showing? | Static prompt; Section 5 adds the action |

## React Structure

Create `src/components/address-search/AddressSearchHero.tsx` and
`address-search-hero.css`. The component is stateless and contains:

```text
main#address-search-hero-search
  decorative image
  contrast overlay
  centered content container
    h1
    instruction
    visual combobox placeholder for Section 4
    supporting copy
    recovery prompt
```

Replace the temporary Search placeholder main content with
`AddressSearchHero`. Keep `PageChrome` as the document-order owner.

## Styling Requirements

- Use the exported local image; never use a temporary Figma URL.
- Desktop reference hero height is 654px.
- Image uses `object-fit: cover`; retain the family as the crop focal point.
- Use `--en-transparent-scrim` for contrast rather than a hardcoded overlay.
- Use Ensemble content and spacing tokens where available.
- Content is centered and capped near the Figma search-control width of 712px.
- Desktop headline approximates the Figma 32px treatment; scale down on mobile.
- Keep the content order and vertical rhythm from the Figma frame.
- The temporary combobox slot is a non-interactive white rounded rectangle,
  approximately 712x56 at desktop. It has no final combobox Object ID.
- From 320px through 1512px, text must wrap within the viewport and the image
  crop must retain a recognizable family focal point.
- Do not add motion. Reduced-motion users receive the same static composition.

## State and Behavior

- This section is presentational and stateless.
- Do not add reducer actions, form behavior, validation, navigation, timers, or
  network calls.
- The recovery prompt remains static until Section 5.
- The temporary control slot is `aria-hidden`; it must not enter the focus order.

## Agent-Verifiable Acceptance Criteria

1. All six Section 3 Object IDs are present once.
2. The image is local, decorative, eager, and has explicit 1182x537 dimensions.
3. The desktop hero measures approximately 654px at the 1512x804 reference.
4. The content container remains within its target width.
5. Text contrast passes WCAG AA over the supported crops.
6. At 320px, 768px, 1024px, and 1512px there is no horizontal overflow,
   clipped text, or overlapping content.
7. The visual combobox placeholder is non-interactive and absent from the
   accessibility tree.
8. Existing page chrome and flow behavior remain unchanged.

## User-Evaluable Acceptance Criteria

1. The family image and centered copy immediately communicate a renovation
   calculator landing page.
2. The eye reaches the headline, address instruction, and control area in that
   order.
3. The crop feels intentional at desktop and mobile widths.
4. The contrast overlay improves readability without making the image muddy.

## Out of Scope

- Functional combobox and suggestion list
- Advanced Search interaction
- Validation and navigation behavior
- Final production branding

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User

## Implementation Summary

- Added the responsive Figma hero image and presentational Address Search content.
- Added the non-interactive Section 4 control slot without introducing form state.
- Added responsive image cropping, semantic scrim, and conservative contrast handling.
- Added focused structural coverage and browser checks at all required viewports.
- Actual implementation time was not tracked.

## Implementation Verification

- Added the local 1182x537 Figma family image and all six Section 3 objects.
- The 1512px reference hero measures 654px and the content is capped at 712px.
- Browser checks passed at 320px, 768px, 1024px, and 1512px.
- The temporary combobox slot is hidden from assistive technology and cannot receive focus.
- The supported viewports have no horizontal overflow, clipped text, duplicate IDs,
  browser console errors, or runtime errors.
- The Ensemble scrim and image brightness treatment provide a conservative
  light-text contrast floor over the image.
