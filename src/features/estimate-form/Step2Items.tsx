'use client';

import { useEffect } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useFormConfig } from './use-form-config';
import { resolveItemsStep } from './resolve-items-step';
import { pruneSelection, toggleItem } from './item-selection';
import { ItemMultiSelect } from './ItemMultiSelect';
import type { StepFormValues } from './flow-form-values';

const GROUP_LABEL = 'Items to renovate';
const LOADING_LABEL = 'Loading items';
const ERROR_MESSAGE = "We couldn't load the items. Please try again.";
const NO_TYPE_MESSAGE = 'Choose a renovation type first to see the items you can select.';
const EMPTY_MESSAGE = 'No items are available for this renovation type.';

/**
 * Step 2 container (FR-11/FR-13/FR-14, AD-6, UX-DR16 form slice). Reads the
 * config bundle via `useFormConfig()`, watches the Step 1 `renovationTypeId`, and
 * binds `selectedItemIds` to the single flow aggregate through `useController`.
 *
 * A `useEffect` prunes selections that are no longer valid whenever the available
 * item set changes (FR-11: Step 1 drives Step 2 — a type change must not leave
 * stale cross-type selections). The four+1 view states (no-type / loading / error
 * / empty / ready) are decided by the pure `resolveItemsStep` mapper.
 */
export function Step2Items() {
  const { control } = useFormContext<StepFormValues>();
  const { field } = useController({ name: 'selectedItemIds', control });
  const renovationTypeId = useWatch({ control, name: 'renovationTypeId' });
  const query = useFormConfig();
  const view = resolveItemsStep(query, renovationTypeId);

  const availableItems = view.status === 'ready' ? view.items : [];
  const selected = field.value;
  const { onChange } = field;

  // Only prune when the option set is actually KNOWN: `ready` (the real items) or
  // `empty` (a chosen type genuinely has no items). During `loading`/`error` the
  // set is UNKNOWN, and `no-type` means Step 1 isn't done — pruning in those
  // states would destroy a valid selection on a transient refetch failure, so we
  // hold the effect off (keyed to `null`). `JSON.stringify` avoids id-delimiter
  // key collisions.
  const optionSetResolved = view.status === 'ready' || view.status === 'empty';
  const pruneKey = optionSetResolved
    ? JSON.stringify(availableItems.map((item) => item.id))
    : null;

  useEffect(() => {
    if (pruneKey === null) return;
    const pruned = pruneSelection(selected, availableItems);
    if (pruned.length !== selected.length) {
      onChange(pruned);
    }
    // `pruneKey` is the identity of the resolved option set; re-prune only when
    // it genuinely changes (e.g. a Step 1 type change), never on loading/error.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pruneKey]);

  if (view.status === 'no-type') {
    return (
      <Typography role="status" variant="body2" color="text.secondary">
        {NO_TYPE_MESSAGE}
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
    <ItemMultiSelect
      items={view.items}
      selectedIds={selected}
      onToggle={(id) => onChange(toggleItem(selected, id))}
      groupLabel={GROUP_LABEL}
    />
  );
}
