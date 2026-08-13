# Address Search Section 6: Responsive, Accessibility, and Visual Hardening

## Purpose

Complete the Address Search view by validating the assembled implementation
against the Figma reference, the Ensemble design foundations, and the critical
and high-priority Address Search checks in TS-001.

## References

- Work item: `work/Address-Search-Work.yaml`, Section 6
- Figma frame: `2:3`, 1512x804
- Acceptance scenario: `TS-001`
- Relevant checks: `EC-004`, `DS-001`, `DS-002`, `A11Y-001`,
  `A11Y-002`, `A11Y-003`
- Installed design system: `@ensemble/lib@6.1.9`

## Hardening Requirements

- Preserve the approved 1512px composition and intentional Figma crop.
- Confirm no horizontal page scrolling at 320 CSS px or 200% browser zoom.
- Confirm responsive behavior at 320px, 768px, 1024px, and 1512px.
- Confirm input and Advanced Search remain at least 44x44 CSS px.
- Confirm Tab order follows input then Advanced Search and Shift+Tab reverses it.
- Confirm Arrow keys, Enter, Space, and Escape remain operable.
- Move focus to the Renovation Details heading after automatic navigation.
- Use Ensemble semantic tokens and global foundations where they satisfy the
  requirements; document intentional Figma-specific radius and typography values.
- Resolve serious accessibility, overflow, duplicate-ID, console, and runtime
  defects before review.

## Agent-Verifiable Acceptance Criteria

1. `EC-004` passes for Address Search at 320 CSS px and 200% zoom.
2. `DS-001` and `DS-002` have no unresolved Address Search violations.
3. `A11Y-001` keyboard operation and focus order pass.
4. `A11Y-002` names, roles, states, labels, errors, and announcements are present.
5. `A11Y-003` targets, zoom, reduced-motion behavior, and conservative contrast
   checks pass.
6. Automatic selection navigation focuses the Details heading.
7. The full unit suite and production build pass.

## User-Evaluable Acceptance Criteria

1. The completed Address Search view still matches the approved Figma hierarchy.
2. The page remains readable and operable at desktop, tablet, mobile, and zoom.
3. Focus, validation, suggestions, and navigation feel coherent as one flow.

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User

## Implementation Summary

- Restored the Ensemble global TWK Everett typography foundation by removing a
  nonexistent project CSS variable that forced an Arial fallback.
- Removed an unused Ensemble button registration while retaining the native
  inverse-styled Advanced Search action required by the hero composition.
- Added programmatic focus transfer to the Details heading after automatic
  address-selection navigation.
- Revalidated the assembled view against the relevant TS-001 design-system,
  responsive, keyboard, screen-reader-semantic, target-size, zoom, and
  reduced-motion requirements.

## Implementation Verification

- The full suite passes with 15 tests across 7 files.
- The TypeScript check and production Vite build pass.
- Browser checks pass at 320px, 768px, 1024px, and 1512px with no horizontal
  overflow, duplicate IDs, runtime errors, or console errors.
- At 200% page scale and the 756px reflow equivalent of the 1512px desktop
  reference, there is no horizontal overflow.
- The input and Advanced Search control remain at least 44x44 CSS px.
- Tab and Shift+Tab follow the visual order; Arrow keys, Enter, and Escape retain
  the approved combobox behavior.
- Automatic navigation focuses the `Renovation details` heading.
- Reduced-motion mode introduces no content or behavior loss.
