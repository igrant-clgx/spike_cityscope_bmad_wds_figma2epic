'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { AddressBlock } from './AddressBlock';
import { AddressModal } from './AddressModal';

export interface AddressSectionProps {
  /** The current confirmed property address, or `null` before one is chosen. */
  address: ResolvedAddress | null;
  /** Commit a resolved address to the flow (first-set vs change lives upstream). */
  onConfirm: (address: ResolvedAddress) => void;
}

/**
 * Controlled address container. It owns ONLY the local modal `open` boolean and
 * wires the display block to the change modal; the flow-form state, the
 * first-set-vs-change decision, and the address-change reset notice were lifted
 * up to `EstimateFlow` (the single flow aggregate owner, AD-6). `AddressBlock`'s
 * change control opens the modal; a confirmed resolution calls `onConfirm` and
 * closes. Focus-return needs no manual ref: MUI `Dialog` restores focus to the
 * element focused when the dialog opened — the change control button — on close
 * (UX-DR9/UX-DR18).
 */
export function AddressSection({ address, onConfirm }: AddressSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <AddressBlock address={address} onChangeAddress={() => setOpen(true)} />
      <AddressModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={(addr) => {
          onConfirm(addr);
          setOpen(false);
        }}
      />
    </Box>
  );
}
