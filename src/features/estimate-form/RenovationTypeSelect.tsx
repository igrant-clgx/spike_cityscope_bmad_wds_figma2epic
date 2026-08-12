'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { tokens } from '@/theme';
import { nextSelection } from './single-select';
import type { RenovationType } from '@shared/schemas';

export interface RenovationTypeSelectProps {
  /** The renovation types to choose from (from the config bundle). */
  types: RenovationType[];
  /** The currently selected type id, or `null` when nothing is chosen yet. */
  value: string | null;
  /** Called with the chosen type id. Never called with an empty selection. */
  onSelect: (id: string) => void;
  /** Accessible group label announced to assistive tech. */
  groupLabel: string;
}

/**
 * Step 1 single-select renovation-type control (FR-12, UX-DR6 single-select).
 * Pure and hook-free: it owns no state — the selection lives in the react-hook-form
 * flow aggregate (AD-6) and is passed in via `value`/`onSelect`.
 *
 * Uses an exclusive MUI `ToggleButtonGroup` so exactly one type is active and
 * each option is a real `<button>` with programmatic selected state + focus ring.
 * `ToggleButtonGroup` emits `null` when the active button is re-activated; that is
 * suppressed here to honour FR-10 (a required selection is never cleared to empty).
 * Targets are ≥44px (UX-DR20); the selected fill uses the `primaryActive` design
 * token (no ad-hoc hex).
 */
export function RenovationTypeSelect({
  types,
  value,
  onSelect,
  groupLabel,
}: RenovationTypeSelectProps) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      aria-label={groupLabel}
      onChange={(_event, next: string | null) => {
        const chosen = nextSelection(value, next);
        if (chosen !== null) onSelect(chosen);
      }}
      sx={{ flexWrap: 'wrap', gap: 1 }}
    >
      {types.map((type) => (
        <ToggleButton
          key={type.id}
          value={type.id}
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
          {type.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
