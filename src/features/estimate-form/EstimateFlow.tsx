'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Box from '@mui/material/Box';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { AddressSection } from '@/features/address';
import { ADDRESS_CHANGED_RESET_NOTICE } from '@/features/address/copy';
import { useToast } from '@/components/feedback';
import { EstimateStepper } from './EstimateStepper';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';

/** Structural equality of two resolved addresses (a re-confirm of the same
 * address must NOT be treated as a change — that would silently wipe scope). */
function isSameAddress(a: ResolvedAddress | null, b: ResolvedAddress): boolean {
  return (
    a !== null &&
    a.street === b.street &&
    a.suburb === b.suburb &&
    a.state === b.state &&
    a.postcode === b.postcode
  );
}

/**
 * Page-level renovation-estimate flow owner (AD-6). This is the SINGLE aggregate
 * owner: it holds the one `react-hook-form` instance for all Step 1–3 in-progress
 * scope and lifts the confirmed `address` into local React state so that a real
 * address CHANGE is observable on dependent scope.
 *
 * First address set (`address === null`): just records the address — no reset,
 * no notice. Changing an already-confirmed address (FR-9 / Story 2.5): records
 * the new address, `reset()`s the flow scope to the step defaults (making Story
 * 2.5's dependent-scope reset finally observable), and surfaces the existing
 * `ADDRESS_CHANGED_RESET_NOTICE`. The address `useState` + first-set-vs-change
 * decision were lifted here out of `AddressSection`, which is now controlled.
 */
export function EstimateFlow() {
  const methods = useForm<StepFormValues>({ defaultValues: stepFormDefaults() });
  const [address, setAddressState] = useState<ResolvedAddress | null>(null);
  const [stepperKey, setStepperKey] = useState(0);
  const toast = useToast();

  const handleConfirm = (addr: ResolvedAddress) => {
    // A re-confirm of the identical address is not a change — never reset.
    const isChange = address !== null && !isSameAddress(address, addr);
    setAddressState(addr);
    if (isChange) {
      methods.reset(stepFormDefaults());
      // Remount the stepper so its local expanded state returns to the initial
      // step-1-expanded shell (rhf `reset` only clears values, not local UI).
      setStepperKey((k) => k + 1);
      toast.show({ severity: 'info', message: ADDRESS_CHANGED_RESET_NOTICE });
    }
  };

  return (
    <Box>
      <AddressSection address={address} onConfirm={handleConfirm} />
      <FormProvider {...methods}>
        <EstimateStepper key={stepperKey} />
      </FormProvider>
    </Box>
  );
}
