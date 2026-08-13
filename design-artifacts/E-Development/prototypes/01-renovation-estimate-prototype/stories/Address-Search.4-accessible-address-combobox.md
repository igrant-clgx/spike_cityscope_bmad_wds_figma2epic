# Address Search Section 4: Accessible Address Combobox

## Purpose

Replace the visual control placeholder with a native ARIA combobox/listbox backed
by the fixed property fixture. Support keyboard, pointer, and touch selection
while storing the stable property ID and display address together in the existing
flow reducer.

## References

- Work item: `work/Address-Search-Work.yaml`, Section 4
- UX specification: `01.1-address-search.md`, Property Address Input
- Fixture: `src/prototype/fixture.ts`
- State owner: `src/state/PrototypeFlowContext.tsx`
- Object ID: `address-search-hero-property-address-input`

## Object Contract

| Property | Value |
|---|---|
| Accessible label | Property address |
| Input type | `search` |
| Role | `combobox` |
| Placeholder | Enter Address |
| Required | Yes |
| Maximum length | 200 |
| Browser autocomplete | `street-address` |
| ARIA autocomplete | `list` |
| Suggestion role | `option` inside `listbox` |
| Fixed result | 400 Catherine Street Lilyfield NSW 2040 |
| Stable ID | prototype-property-400-catherine-st |

## React Structure

Create:

```text
src/components/address-search/
  AddressCombobox.tsx
  address-combobox.css
  addressCombobox.test.tsx
```

Replace the hero's visual placeholder with `AddressCombobox`. Keep the component
inside `AddressSearchHero`; state remains owned by `PrototypeFlowContext`.

## Interaction Requirements

- Input updates a local query string.
- A non-empty case-insensitive substring of the fixed display address exposes
  the single deterministic suggestion.
- Focus reopens an available suggestion.
- Arrow Down and Arrow Up open the list and activate the available option.
- Enter selects the active option and prevents form submission.
- Escape closes the list without changing the query.
- Pointer and touch selection choose the same property.
- Selection dispatches `SELECT_PROPERTY` with the existing typed
  `prototypeProperty`, copies the full display address into the input, and closes
  the list.
- This section does not navigate; Section 5 adds one-time valid-selection
  navigation and validation.

## Accessibility Requirements

- Use a real `<label>` that is visually hidden but available to assistive technology.
- Expose `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`, and
  `aria-activedescendant` only while an option is active.
- Keep DOM focus on the input while navigating the list.
- The option has a stable DOM ID and a minimum 44px touch target.
- The listbox appears immediately after the combobox in DOM order.
- Escape closes the popup and returns the expanded state to false.
- Do not add a live region yet; Section 5 owns announcements and validation.

## Styling Requirements

- Match the Section 3 control slot dimensions: 100% width, 56px desktop height,
  white surface, 10px radius, subtle border, and shadow.
- Use Ensemble tokens for colors, borders, spacing, and focus treatment.
- Preserve the 712px hero content cap.
- Suggestion popup aligns to the input width, remains within the viewport, and
  layers above hero content.
- Focus-visible styling must not rely on color alone.

## Agent-Verifiable Acceptance Criteria

1. The combobox exposes the specified label and ARIA relationships.
2. Typing `400` exposes exactly one fixed suggestion.
3. Arrow keys activate the option without moving DOM focus from the input.
4. Enter, pointer click, and touch select the same typed property.
5. Escape closes the popup.
6. Selection stores the ID and display address together in the reducer.
7. The option's rendered height is at least 44px.
8. No selection action navigates before Section 5.
9. Existing page chrome and hero behavior remain unchanged.

## User-Evaluable Acceptance Criteria

1. The control looks like the Figma search field.
2. Typing and selecting feel immediate and predictable.
3. Keyboard focus and the active suggestion are visually obvious.
4. The popup feels anchored to the control at desktop and mobile widths.

## Out of Scope

- Empty or free-text validation
- Live announcements
- Navigation after selection
- Advanced Search behavior
- Network-backed suggestions

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User

## Implementation Summary

- Replaced the hero placeholder with a native search input using the ARIA
  combobox/listbox pattern.
- Added deterministic, case-insensitive fixture matching and one typed selection
  path through the existing reducer.
- Added keyboard, pointer, and touch-compatible selection behavior without
  introducing Section 5 navigation or validation.
- Added Ensemble-token styling for the control, focus treatment, popup, and
  active option.
- Added focused structural and fixture-filtering tests.

## Implementation Verification

- The full test suite passes with 13 tests across 6 files.
- The TypeScript check and production Vite build pass.
- Chromium interaction checks cover Arrow Up/Down activation, Enter selection,
  Escape close, and pointer selection.
- The rendered option target is 48px tall.
- Browser checks pass at 320px, 768px, 1024px, and 1512px without horizontal
  overflow, console errors, runtime errors, or premature navigation.
