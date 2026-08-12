/**
 * Pure single-select transition (FR-10, UX-DR6). Given the currently selected
 * id and the id the UI just toggled, return the id to store.
 *
 * MUI `ToggleButtonGroup exclusive` emits `null` when the active button is
 * re-activated; that must NOT clear a required selection (FR-10). So a `null`
 * toggle keeps the current selection; any real id replaces it. Choosing from an
 * empty selection stores the chosen id.
 */
export function nextSelection(current: string | null, next: string | null): string | null {
  return next ?? current;
}
