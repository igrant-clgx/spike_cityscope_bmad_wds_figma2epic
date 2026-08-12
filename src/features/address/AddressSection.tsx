'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import { emptyForm, setAddress } from '@server/domain/flow/renovation-estimate-form';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { AddressBlock } from './AddressBlock';
import { AddressModal } from './AddressModal';

/**
 * Client container that owns the renovation-estimate flow-form React state and
 * connects the display block to the change modal (AD-6). `AddressBlock`'s change
 * control opens the modal; a confirmed resolution writes into the flow aggregate
 * via `setAddress` and closes. Focus-return needs no manual ref: MUI `Dialog`
 * restores focus to the element focused when the dialog opened — the change
 * control button itself — on close (UX-DR9/UX-DR18).
 */
export function AddressSection() {
  const [form, setForm] = useState(emptyForm());
  const [open, setOpen] = useState(false);

  const handleConfirm = (address: ResolvedAddress) => {
    setForm((current) => setAddress(current, address));
    setOpen(false);
  };

  return (
    <Box>
      <AddressBlock address={form.address} onChangeAddress={() => setOpen(true)} />
      <AddressModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}
