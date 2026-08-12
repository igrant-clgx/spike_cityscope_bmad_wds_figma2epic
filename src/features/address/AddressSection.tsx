'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import {
  emptyForm,
  setAddress,
  changeAddress,
} from '@server/domain/flow/renovation-estimate-form';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { useToast } from '@/components/feedback';
import { AddressBlock } from './AddressBlock';
import { AddressModal } from './AddressModal';
import { ADDRESS_CHANGED_RESET_NOTICE } from './copy';

/**
 * Client container that owns the renovation-estimate flow-form React state and
 * connects the display block to the change modal (AD-6). `AddressBlock`'s change
 * control opens the modal; a confirmed resolution writes into the flow aggregate
 * and closes. Focus-return needs no manual ref: MUI `Dialog` restores focus to
 * the element focused when the dialog opened — the change control button itself
 * — on close (UX-DR9/UX-DR18).
 *
 * Address-change reset (FR-9, OI-7 `[OPEN]` assumption): the FIRST confirmation
 * uses `setAddress` (nothing to reset); changing an already-confirmed address
 * uses `changeAddress`, which resets dependent renovation scope to the defined
 * initial state, and surfaces a non-blocking notice so the reset is communicated.
 */
export function AddressSection() {
  const [form, setForm] = useState(emptyForm());
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const handleConfirm = (address: ResolvedAddress) => {
    const isChange = form.address !== null;
    setForm((current) =>
      isChange ? changeAddress(current, address) : setAddress(current, address),
    );
    setOpen(false);
    if (isChange) {
      toast.show({ severity: 'info', message: ADDRESS_CHANGED_RESET_NOTICE });
    }
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
