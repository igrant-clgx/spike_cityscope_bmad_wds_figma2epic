# Renovation Details Section 2: Questionnaire Accordion Structure

## Purpose

Build the three-step Figma disclosure composition as a progressive fixed
prototype flow.

## Requirements

- Use native heading buttons with `aria-expanded` and `aria-controls`.
- Step 1 can be collapsed and reopened without losing future state.
- Step 2 unlocks after Internal is selected and offers the fixed Kitchen item.
- Step 3 unlocks after Kitchen is selected and confirms the two answers.
- Selecting an answer advances to and expands the next step.
- Preserve the 840px content cap, 16px step rhythm, card hierarchy, and mobile
  containment from the Figma frame.

## Ensemble Assessment and Exceptions

- `en-accordion` was assessed but does not expose the prerequisite helper
  relationship or explicit controlled-panel IDs required by this staged form's
  locked-step contract, so native heading buttons are retained.
- Spacing, colors, focus, disabled content, and shadow stops use Ensemble
  semantic tokens.
- The 16px card radius and pale blue page surface are deliberate Figma-specific
  values not represented by Ensemble CSS variables.

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** Pending re-review

## Scope Revision

- **Problem:** Steps 2 and 3 were visible but intentionally locked because the
  Figma frame did not contain their expanded content.
- **Decision:** The user approved a fixed prototype flow rather than waiting for
  additional frames.
- **Implementation:** Step 2 now selects Kitchen and Step 3 confirms Internal
  plus Kitchen before estimate creation.
