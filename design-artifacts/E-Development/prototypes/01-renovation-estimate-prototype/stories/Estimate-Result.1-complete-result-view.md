# Estimate Result: Complete Fixed Result View

## Purpose

Replace the Page 3 foundation placeholder with the complete responsive Figma
result experience and all approved fixed-prototype actions.

## Requirements

- Guard the result route and never display a stale estimate.
- Display the selected address, `Internal Renovation: Kitchen`, the fixed
  `$32,700 - $40,000` range, and planning caveat.
- Provide a native accessible calculation disclosure whose expanded content
  honestly states that calculation details are unavailable.
- Use Ensemble primary and secondary buttons for New Estimate and Edit Estimate.
- Edit retains answers; New Estimate retains only the property; Enter new
  address clears all flow state.
- Provide normalized domestic and international telephone links.
- Preserve the Figma contact and renovation-tip content.
- Remain usable without horizontal overflow from 320px through 1512px.

## Ensemble Usage and Exceptions

- `en-btn` supplies the action buttons; native host listeners are used because
  React synthetic custom-element click handling was unreliable in target Chrome.
- `MapPin` and `PhoneCall` use Ensemble's exported SVG factories rather than
  duplicated icon artwork or the font stylesheet, which cannot load through the
  local symlinked package in Vite development mode.
- Spacing, surfaces, borders, focus, content, and elevation use Ensemble tokens.
- `#432c78` is retained as a deliberate Page 3 Figma accent because Ensemble's
  brand-primary token is bright magenta and materially changes the reference
  hierarchy.
- The 16px disclosure radius is a Figma-specific value.

## Verification

- Fixed content, disclosure, Edit, New Estimate, address reset, direct-route
  recovery, phone links, unique IDs, one-h1 structure, and browser errors pass.
- No horizontal overflow occurs at 320px, 768px, 1024px, or 1512px.
- All Ensemble variables used by Page 3 resolve at runtime.

## Status Tracking

**Status:** Ready for review
**Started:** 2026-08-13
**Approved By:** Pending
