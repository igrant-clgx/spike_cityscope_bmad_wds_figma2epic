import type { RenovationItem } from '@shared/schemas';

/**
 * Pure Step 2 item-selection helpers (FR-11/FR-13/FR-14). No react, no MUI.
 */

/**
 * The Step 2 option set for a chosen renovation type: the config items whose
 * `typeId` matches (FR-11/FR-13). A `null` type yields no options.
 */
export function filterItemsForType(
  items: RenovationItem[],
  typeId: string | null,
): RenovationItem[] {
  if (!typeId) return [];
  return items.filter((item) => item.typeId === typeId);
}

/**
 * Drop any selected id that is no longer an available option (e.g. after a
 * Step 1 type change), preserving the order of the surviving ids. This closes
 * the cross-type stale-selection gap (FR-11).
 */
export function pruneSelection(
  selectedIds: string[],
  availableItems: RenovationItem[],
): string[] {
  const availableIds = new Set(availableItems.map((item) => item.id));
  return selectedIds.filter((id) => availableIds.has(id));
}

/**
 * Toggle an item id in the multi-select set: add it if absent, remove it if
 * present (UX-DR6 multi-select). Order of the remaining ids is preserved; a
 * newly added id is appended.
 */
export function toggleItem(selectedIds: string[], id: string): string[] {
  return selectedIds.includes(id)
    ? selectedIds.filter((existing) => existing !== id)
    : [...selectedIds, id];
}

/**
 * Given the selection before and after a multi-select toggle event, return the
 * single id that was toggled (added or removed), or `undefined` if the arrays
 * are equal. MUI's non-exclusive `ToggleButtonGroup` toggles exactly one id per
 * interaction; for a hypothetical bulk change this returns the first added id
 * (else the first removed id) so the caller still applies a well-defined toggle.
 */
export function deriveToggledId(
  before: string[],
  next: string[],
): string | undefined {
  const beforeSet = new Set(before);
  const afterSet = new Set(next);
  return next.find((id) => !beforeSet.has(id)) ?? before.find((id) => !afterSet.has(id));
}
