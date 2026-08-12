'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { tokens } from '@/theme';
import { deriveToggledId } from './item-selection';
import type { RenovationItem } from '@shared/schemas';

export interface ItemMultiSelectProps {
  /** The selectable items for the chosen renovation type. */
  items: RenovationItem[];
  /** The currently selected item ids (from the flow aggregate). */
  selectedIds: string[];
  /** Called with the single item id that was toggled on or off. */
  onToggle: (id: string) => void;
  /** Accessible group label announced to assistive tech. */
  groupLabel: string;
}

/**
 * Step 2 multi-select item control (FR-12/FR-14, UX-DR6 multi-select). Pure and
 * hook-free: the selection lives in the react-hook-form flow aggregate (AD-6),
 * passed in via `selectedIds` and mutated through `onToggle`.
 *
 * A non-exclusive MUI `ToggleButtonGroup` renders each item as a real `<button>`
 * with programmatic selected state (`aria-pressed`) and a focus ring; targets
 * are ≥44px (UX-DR20) and the selected fill uses the `primaryActive` token
 * (no ad-hoc hex). `onChange` yields the full next array; the single toggled id
 * is derived by symmetric difference and forwarded to `onToggle`.
 */
export function ItemMultiSelect({
  items,
  selectedIds,
  onToggle,
  groupLabel,
}: ItemMultiSelectProps) {
  return (
    <ToggleButtonGroup
      value={selectedIds}
      aria-label={groupLabel}
      onChange={(_event, nextIds: string[]) => {
        const toggled = deriveToggledId(selectedIds, nextIds);
        if (toggled !== undefined) onToggle(toggled);
      }}
      sx={{ flexWrap: 'wrap', gap: 1 }}
    >
      {items.map((item) => (
        <ToggleButton
          key={item.id}
          value={item.id}
          sx={{
            minHeight: tokens.minTarget,
            minWidth: tokens.minTarget,
            px: 3,
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: tokens.colors.primaryActive,
              color: tokens.colors.onPrimary,
            },
          }}
        >
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
