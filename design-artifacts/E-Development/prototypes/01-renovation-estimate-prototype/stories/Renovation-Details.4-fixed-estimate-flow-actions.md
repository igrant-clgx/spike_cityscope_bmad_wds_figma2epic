# Renovation Details Section 4: Fixed Estimate and Flow Actions

## Purpose

Complete the supported Details path by creating the deterministic estimate and
navigating to the guarded Estimate Result route.

## Requirements

- Show `View example estimate` in Step 3 only after Internal and Kitchen are
  selected.
- Explain that the prototype uses the fixed Internal Kitchen example.
- Dispatch `CREATE_FIXED_ESTIMATE` before navigating to the Result route.
- Keep External non-progressing with its existing unavailable notice.
- Preserve the working Enter new address reset and direct-route guards.
- Prevent unsupported or duplicate estimate creation through the UI.

## Ensemble Usage

- Use the documented primary large `en-btn` for the estimate action.
- Retain Ensemble semantic spacing and content tokens around the action.
- The Result page remains a foundation placeholder until its dedicated work
  plan; this section only proves the guarded handoff.

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** Pending re-review

## Review Issue and Learning

- **Problem:** The visible `Selected` label was not part of the intended option
  treatment, and the Ensemble estimate button appeared dead in Chrome.
- **Root cause:** Selection state was over-communicated in visible copy, while
  React's synthetic `onClick` was not reliably delivered from the custom
  element's Shadow DOM interaction.
- **Solution:** Removed the visible label while retaining `aria-pressed` and the
  selected border/surface treatment. Registered a native `click` listener on
  the `en-btn` host so the supported action reliably creates the estimate and
  navigates.
- **Learned:** Verify custom-element events in the target browser rather than
  assuming React event props behave like native React controls.
