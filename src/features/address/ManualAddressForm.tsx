'use client';

import Box from '@mui/material/Box';
import { FormTextField } from '@/components/feedback';
import { auStateSchema } from '@shared/schemas';
import type { ManualAddressField, ManualAddressFields } from './validate-manual-address';
import {
  MANUAL_STREET_LABEL,
  MANUAL_SUBURB_LABEL,
  MANUAL_STATE_LABEL,
  MANUAL_POSTCODE_LABEL,
  MANUAL_STATE_PLACEHOLDER,
} from './copy';

/** Stable field ids so MUI wires `aria-describedby` → `${id}-helper-text` (UX-DR20). */
export const MANUAL_FIELD_IDS: Record<ManualAddressField, string> = {
  street: 'manual-address-street',
  suburb: 'manual-address-suburb',
  state: 'manual-address-state',
  postcode: 'manual-address-postcode',
};

/** AU state / territory options for the structured select. */
const AU_STATES = auStateSchema.options;

export interface ManualAddressFormProps {
  values: ManualAddressFields;
  errors: Partial<Record<ManualAddressField, string>>;
  onFieldChange: (field: ManualAddressField, value: string) => void;
}

/**
 * Presentational structured manual-entry fields (FR-8) — street, suburb, an
 * AU-state select, and postcode. Hook-free so it renders under
 * `renderToStaticMarkup` for node-only structure tests. Each field is
 * programmatically labelled and reuses `FormTextField`, which guarantees an
 * error is never signalled by colour alone (an `error` requires inline
 * `helperText`); passing an `id` makes MUI associate that message via
 * `aria-describedby` so screen readers announce it (UX-DR20).
 */
export function ManualAddressForm({
  values,
  errors,
  onFieldChange,
}: ManualAddressFormProps) {
  const streetError = errors.street;
  const suburbError = errors.suburb;
  const stateError = errors.state;
  const postcodeError = errors.postcode;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <FormTextField
        id={MANUAL_FIELD_IDS.street}
        label={MANUAL_STREET_LABEL}
        value={values.street}
        onChange={(event) => onFieldChange('street', event.target.value)}
        fullWidth
        {...(streetError
          ? { error: true, helperText: streetError }
          : { error: false })}
      />
      <FormTextField
        id={MANUAL_FIELD_IDS.suburb}
        label={MANUAL_SUBURB_LABEL}
        value={values.suburb}
        onChange={(event) => onFieldChange('suburb', event.target.value)}
        fullWidth
        {...(suburbError
          ? { error: true, helperText: suburbError }
          : { error: false })}
      />
      <FormTextField
        id={MANUAL_FIELD_IDS.state}
        label={MANUAL_STATE_LABEL}
        value={values.state}
        onChange={(event) => onFieldChange('state', event.target.value)}
        select
        fullWidth
        slotProps={{ select: { native: true } }}
        {...(stateError
          ? { error: true, helperText: stateError }
          : { error: false })}
      >
        <option value="">{MANUAL_STATE_PLACEHOLDER}</option>
        {AU_STATES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </FormTextField>
      <FormTextField
        id={MANUAL_FIELD_IDS.postcode}
        label={MANUAL_POSTCODE_LABEL}
        value={values.postcode}
        onChange={(event) => onFieldChange('postcode', event.target.value)}
        fullWidth
        inputMode="numeric"
        {...(postcodeError
          ? { error: true, helperText: postcodeError }
          : { error: false })}
      />
    </Box>
  );
}
