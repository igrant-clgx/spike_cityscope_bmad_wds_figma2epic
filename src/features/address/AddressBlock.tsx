'use client';

import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { formatResolvedAddress } from './format-address';
import {
  ADDRESS_BLOCK_HEADING,
  ADDRESS_EMPTY_PROMPT,
  ADD_ADDRESS_LABEL,
  CHANGE_ADDRESS_LABEL,
} from './copy';

export interface AddressBlockProps {
  /** The current resolved property address, or `null` before one is chosen. */
  address: ResolvedAddress | null;
  /**
   * Invoked when the user activates the change / add control. Story 2.3 wires
   * the autocomplete modal here; defaults to a no-op so the control is always
   * operable in isolation.
   */
  onChangeAddress?: () => void;
}

/**
 * Presentational address block (FR-4/FR-5, UX-DR9). Renders the current
 * property address above the form, or the empty/initial prompt when none is
 * set, together with a keyboard-operable "Enter new address" control. It owns
 * no data and mutates no flow state — it takes the address and a callback.
 *
 * Sits 32px above the form region (DESIGN.md § Layout & Spacing).
 */
export function AddressBlock({ address, onChangeAddress }: AddressBlockProps) {
  const handleChange = onChangeAddress ?? (() => {});
  const controlLabel = address === null ? ADD_ADDRESS_LABEL : CHANGE_ADDRESS_LABEL;

  return (
    <Box
      component="section"
      aria-label={ADDRESS_BLOCK_HEADING}
      sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Typography variant="overline" component="p" color="text.secondary">
        {ADDRESS_BLOCK_HEADING}
      </Typography>

      {address === null ? (
        <Typography variant="body1" color="text.secondary">
          {ADDRESS_EMPTY_PROMPT}
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {formatResolvedAddress(address)}
        </Typography>
      )}

      <Box>
        <Button
          type="button"
          variant="text"
          onClick={handleChange}
          sx={{ px: 0, alignSelf: 'flex-start' }}
        >
          {controlLabel}
        </Button>
      </Box>
    </Box>
  );
}
