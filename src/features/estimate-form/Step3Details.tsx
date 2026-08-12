'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFormConfig } from './use-form-config';
import { resolveDetailsStep } from './resolve-details-step';
import { DynamicField } from './DynamicField';
import type { StepFormValues } from './flow-form-values';

const LOADING_LABEL = 'Loading questions';
const ERROR_MESSAGE = "We couldn't load the questions. Please try again.";
const NO_ITEMS_MESSAGE = "Select what you're renovating first to see the property details.";
const EMPTY_MESSAGE = 'No further details are needed for the selected items.';

/**
 * Step 3 container (FR-16/FR-17, AD-6, UX-DR16 form slice). Reads the config
 * bundle via `useFormConfig()`, watches the Step 2 `selectedItemIds`, and derives
 * the view state with the pure `resolveDetailsStep` mapper. On `ready` it renders
 * one `DynamicField` per filtered question, each binding its answer into the
 * single flow aggregate under `propertyDetails.<id>`.
 *
 * No prune effect: answers are keyed by question id, so stale answers for
 * now-hidden questions are harmless and out of scope.
 */
export function Step3Details() {
  const { control } = useFormContext<StepFormValues>();
  const selectedItemIds = useWatch({ control, name: 'selectedItemIds' });
  const query = useFormConfig();
  const view = resolveDetailsStep(query, selectedItemIds);

  if (view.status === 'no-items') {
    return (
      <Typography role="status" variant="body2" color="text.secondary">
        {NO_ITEMS_MESSAGE}
      </Typography>
    );
  }

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
    <Stack spacing={3}>
      {view.questions.map((question) => (
        <DynamicField key={question.id} question={question} control={control} />
      ))}
    </Stack>
  );
}
