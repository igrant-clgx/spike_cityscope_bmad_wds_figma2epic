# Renovation Details Section 3: Renovation Type Selection

## Purpose

Make the Figma Internal and External options operable while preserving the
approved deterministic Internal Kitchen path.

## Requirements

- Use native pressed buttons grouped under the renovation-type question.
- Expose selection with `aria-pressed`, selected styling, and a visible
  checkmark so the state does not rely on color.
- Selecting Internal dispatches `SELECT_INTERNAL` and advances to Step 2.
- Selecting External clears a stale supported answer, remains visibly selected,
  and announces that the External example is unavailable.
- Preserve the current answer when Step 1 is collapsed and reopened.
- Keep each option at least 44px high and wrapping safely at 320px.

## Ensemble Assessment and Exceptions

- `en-radio` was assessed, but its Shadow DOM radio treatment cannot reproduce
  the   Figma select-card shape. Native pressed buttons preserve the stronger visual
  and accessibility contract.
- Interaction, focus, selected, surface, border, spacing, and informational
  notice styling use Ensemble semantic tokens.

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** Pending re-review
