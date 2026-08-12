'use client';

import { useController, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useFormConfig } from './use-form-config';
import { resolveTypeStep } from './resolve-type-step';
import { RenovationTypeSelect } from './RenovationTypeSelect';
import type { StepFormValues } from './flow-form-values';

const GROUP_LABEL = 'Renovation type';
const LOADING_LABEL = 'Loading renovation types';
const ERROR_MESSAGE = "We couldn't load the renovation types. Please try again.";
const EMPTY_MESSAGE = 'No renovation types are available right now.';

/**
 * Step 1 container (FR-10/FR-11/FR-12, AD-6, UX-DR16 form slice). Reads the
 * versioned config bundle via `useFormConfig()` (TanStack Query owns async state)
 * and binds the choice to the single react-hook-form flow aggregate through
 * `useController({ name: 'renovationTypeId' })` — so the selection has one owner
 * and Story 2.5's address-change `reset()` clears it for free.
 *
 * The four view states (loading / error / empty / ready) are decided by the pure
 * `resolveTypeStep` mapper so they can be unit-tested without a live query. The
 * config request is non-throwing: a service failure surfaces as `data.ok === false`.
 */
export function Step1RenovationType() {
  const { control } = useFormContext<StepFormValues>();
  const { field } = useController({ name: 'renovationTypeId', control });
  const query = useFormConfig();
  const view = resolveTypeStep(query);

  if (view.status === 'loading') {
    return (
      <Box
        role="status"
        aria-live="polite"
        aria-busy="true"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <CircularProgress size={20} aria-hidden />
        <Typography variant="body2" color="text.secondary">
          {LOADING_LABEL}
        </Typography>
      </Box>
    );
  }

  if (view.status === 'error') {
    return <Alert severity="error">{ERROR_MESSAGE}</Alert>;
  }

  if (view.status === 'empty') {
    return (
      <Typography role="status" variant="body2" color="text.secondary">
        {EMPTY_MESSAGE}
      </Typography>
    );
  }

  return (
    <RenovationTypeSelect
      types={view.types}
      value={field.value}
      onSelect={field.onChange}
      groupLabel={GROUP_LABEL}
    />
  );
}
