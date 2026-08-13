# Address Search Section 5: Validation, Notices, and Navigation

## Purpose

Complete the Address Search interaction by validating unselected input, announcing
deterministic lookup status, clearing stale selections, navigating once after a
valid selection, and keeping Advanced Search visible without inventing an
unsupported route.

## References

- Work item: `work/Address-Search-Work.yaml`, Section 5
- UX specification: `01.1-address-search.md`
- Delivery decision: Advanced Search shows an inline prototype-unavailable notice
- Details route: `/renocalc/ceshllg/search/details`

## Interaction Requirements

- Empty input after interaction reports `Enter a property address.`
- Free text without a selected suggestion reports
  `Select an address from the suggestions.`
- Input validation runs on Enter when no suggestion is active and on blur after
  the user has interacted with the field.
- Suggestion availability is announced through a polite live region.
- Editing a previously selected address dispatches `RESET_ADDRESS` before a new
  selection can be accepted.
- Selecting the deterministic property dispatches `SELECT_PROPERTY` and navigates
  once to Renovation Details.
- `USE ADVANCED SEARCH` remains keyboard operable and displays
  `Advanced Search is visible but unavailable in this prototype.` inline without
  changing routes.

## Accessibility Requirements

- Invalid input exposes `aria-invalid` and references the visible error using
  `aria-describedby`.
- Dynamic suggestion and selection status uses `role="status"` with
  `aria-live="polite"`.
- Validation errors are visible and announced without removing the user query.
- The Advanced Search control is a native button because this prototype does not
  have a valid destination.
- Focus order remains input, Advanced Search control, then footer content.

## Agent-Verifiable Acceptance Criteria

1. Empty and unselected-text validation use the approved messages.
2. Editing a selected value clears stale reducer state.
3. Selection stores the typed fixture and navigates exactly once.
4. Direct Details access remains protected by the existing route guard.
5. Advanced Search displays the approved inline notice and never navigates.
6. Live, error, and control relationships are exposed to assistive technology.
7. Existing keyboard and pointer combobox behavior remains intact.

## User-Evaluable Acceptance Criteria

1. Errors are clear, close to the address field, and easy to recover from.
2. Selecting the known address moves immediately to Renovation Details.
3. Advanced Search remains discoverable and honestly explains prototype scope.

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User

## Implementation Summary

- Added approved empty and unselected-text validation with visible and programmatic
  error relationships.
- Added polite deterministic suggestion and selection announcements.
- Clears stale reducer state whenever a selected address is edited.
- Extracted the History API navigation helper and added one-time Details navigation
  after valid selection.
- Added a keyboard-operable Advanced Search control with the approved inline
  prototype-unavailable notice.

## Implementation Verification

- The full suite passes with 15 tests across 7 files.
- The TypeScript check and production Vite build pass.
- Chromium checks cover both validation messages, the unavailable notice,
  one-time selection navigation, stale-selection clearing, and direct-route
  guarding.
- Advanced Search does not change the route.
- No browser console or runtime errors were observed.
