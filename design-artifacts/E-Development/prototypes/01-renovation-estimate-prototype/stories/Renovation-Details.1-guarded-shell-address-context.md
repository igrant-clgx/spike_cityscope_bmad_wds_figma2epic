# Renovation Details Section 1: Guarded Shell and Address Context

## Purpose

Replace the route placeholder with the reusable page chrome, guarded selected
property context, semantic page heading, and working Enter new address action.

## Requirements

- Reuse the shared dual-brand header and disclaimer footer with Renovation
  Details Object IDs.
- Keep the existing selected-property route guard.
- Render the selected display address from the flow state.
- Expose one visually hidden `h1` named `Renovation details` and focus it after
  automatic entry from Address Search.
- `Enter new address` dispatches `RESET_ADDRESS` and routes to Address Search.
- Use the Figma pale content surface and centered 840px content column.
- Remain usable from 320px through 1512px without horizontal overflow.

## Object IDs

- `renovation-details-header`
- `renovation-details-header-brand-image`
- `renovation-details-header-partner-brand-image`
- `renovation-details-address-context`
- `renovation-details-address-selected-property`
- `renovation-details-address-enter-new-link`
- `renovation-details-questionnaire-page-heading`
- `renovation-details-footer-disclaimer`
- `renovation-details-footer-disclaimer-copy`

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User

## Implementation Summary

- Generalized the shared page chrome so each logical view receives its approved
  header and footer Object IDs without duplicating components.
- Replaced the Details route placeholder with the guarded selected-property shell.
- Added semantic page-entry focus and a working Enter new address reset.
- Added the responsive Figma content surface and centered address context.

## Implementation Verification

- All 16 tests across 8 files and the production build pass.
- Browser checks pass at 320px, 768px, 1024px, and 1512px.
- Selected-address rendering, entry focus, reset navigation, and missing-state
  guarding pass without overflow or browser errors.
