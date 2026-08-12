'use client';

import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { FormTextField } from '@/components/feedback';
import type { AddressPrediction } from '@shared/schemas';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { useAddressSuggest } from './use-address-suggest';
import { useDebouncedValue } from './use-debounced-value';
import { useAddressResolve } from './use-address-resolve';
import { ManualAddressForm } from './ManualAddressForm';
import { validateManualAddress } from './validate-manual-address';
import type {
  ManualAddressField,
  ManualAddressFields,
} from './validate-manual-address';
import {
  ADDRESS_MODAL_TITLE,
  ADDRESS_SEARCH_LABEL,
  ADDRESS_SEARCH_PLACEHOLDER,
  ADDRESS_LOOKUP_LOADING,
  ADDRESS_NO_RESULTS,
  ADDRESS_CONFIRM_LABEL,
  ADDRESS_CANCEL_LABEL,
  ADDRESS_ERROR_MESSAGE,
  ADDRESS_RETRY_LABEL,
  ADDRESS_ENTER_MANUALLY_LABEL,
  ADDRESS_BACK_TO_SEARCH_LABEL,
} from './copy';

const MIN_QUERY_LENGTH = 3;
const DIALOG_TITLE_ID = 'address-modal-title';

const EMPTY_MANUAL_FIELDS: ManualAddressFields = {
  street: '',
  suburb: '',
  state: '',
  postcode: '',
};

export interface AddressModalProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Close without changing the flow address (Cancel / Esc / backdrop). */
  onCancel: () => void;
  /** Commit the resolved structured address to the flow aggregate. */
  onConfirm: (address: ResolvedAddress) => void;
}

export interface AddressModalBodyProps {
  titleId: string;
  query: string;
  onQueryChange: (value: string) => void;
  predictions: AddressPrediction[];
  isLookupLoading: boolean;
  selectedId: string | null;
  onSelectPrediction: (addressId: string) => void;
  resolvedAddress: ResolvedAddress | null;
  isResolving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  /** Non-null when the last suggest/resolve returned a service error (FR-33). */
  errorMessage: string | null;
  /** Re-run the failed operation without clearing entered data. */
  onRetry: () => void;
  /** Whether the structured manual-entry fallback is active (FR-8). */
  isManualMode: boolean;
  /** Switch into manual entry from the error affordance. */
  onEnterManual: () => void;
  /** Leave manual entry and return to autocomplete search. */
  onExitManual: () => void;
  manualValues: ManualAddressFields;
  manualErrors: Partial<Record<ManualAddressField, string>>;
  onManualFieldChange: (field: ManualAddressField, value: string) => void;
}

/**
 * Presentational dialog body (title, labelled search field, predictions list,
 * inline lookup loading, Confirm/Cancel). Kept free of hooks so it renders under
 * `renderToStaticMarkup` for node-only a11y/structure tests — MUI `Dialog` mounts
 * it through a Portal, which SSR does not emit.
 */
export function AddressModalBody({
  titleId,
  query,
  onQueryChange,
  predictions,
  isLookupLoading,
  selectedId,
  onSelectPrediction,
  resolvedAddress,
  isResolving,
  onConfirm,
  onCancel,
  errorMessage,
  onRetry,
  isManualMode,
  onEnterManual,
  onExitManual,
  manualValues,
  manualErrors,
  onManualFieldChange,
}: AddressModalBodyProps) {
  const showNoResults =
    !isManualMode &&
    !errorMessage &&
    !isLookupLoading &&
    query.trim().length >= MIN_QUERY_LENGTH &&
    predictions.length === 0;

  const showPredictions = !isManualMode && !errorMessage && predictions.length > 0;

  const confirmDisabled = isManualMode
    ? false
    : resolvedAddress === null || isResolving;

  return (
    <>
      <DialogTitle id={titleId}>{ADDRESS_MODAL_TITLE}</DialogTitle>
      <DialogContent>
        <FormTextField
          label={ADDRESS_SEARCH_LABEL}
          placeholder={ADDRESS_SEARCH_PLACEHOLDER}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          fullWidth
          autoFocus
          type="search"
          slotProps={{ htmlInput: { 'aria-label': ADDRESS_SEARCH_LABEL } }}
        />

        {isLookupLoading && !isManualMode ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <CircularProgress size={16} aria-hidden />
            <Typography variant="body2" color="text.secondary">
              {ADDRESS_LOOKUP_LOADING}
            </Typography>
          </Box>
        ) : null}

        {errorMessage && !isManualMode ? (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  type="button"
                  color="inherit"
                  size="small"
                  onClick={onRetry}
                >
                  {ADDRESS_RETRY_LABEL}
                </Button>
                <Button
                  type="button"
                  color="inherit"
                  size="small"
                  onClick={onEnterManual}
                >
                  {ADDRESS_ENTER_MANUALLY_LABEL}
                </Button>
              </Box>
            }
          >
            {ADDRESS_ERROR_MESSAGE}
          </Alert>
        ) : null}

        {showNoResults ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {ADDRESS_NO_RESULTS}
          </Typography>
        ) : null}

        {showPredictions ? (
          <List aria-label={ADDRESS_MODAL_TITLE} sx={{ mt: 1 }}>
            {predictions.map((prediction) => (
              <ListItem key={prediction.addressId} disablePadding>
                <ListItemButton
                  selected={selectedId === prediction.addressId}
                  onClick={() => onSelectPrediction(prediction.addressId)}
                >
                  <ListItemText primary={prediction.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : null}

        {isManualMode ? (
          <>
            <ManualAddressForm
              values={manualValues}
              errors={manualErrors}
              onFieldChange={onManualFieldChange}
            />
            <Button
              type="button"
              variant="text"
              onClick={onExitManual}
              sx={{ px: 0, mt: 1 }}
            >
              {ADDRESS_BACK_TO_SEARCH_LABEL}
            </Button>
          </>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button type="button" variant="text" onClick={onCancel}>
          {ADDRESS_CANCEL_LABEL}
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          {ADDRESS_CONFIRM_LABEL}
        </Button>
      </DialogActions>
    </>
  );
}

/**
 * Focus-trapped autocomplete modal (FR-6/FR-7, UX-DR9/UX-DR18). Owns the search
 * query, debounces it (≥300ms) into the existing `useAddressSuggest` hook, lists
 * predictions, resolves a selection into the structured `ResolvedAddress`, and
 * surfaces it on Confirm. Uses MUI `Dialog` defaults for focus trap + focus
 * restoration — `disableRestoreFocus`/`disableEnforceFocus` are intentionally
 * NOT set.
 */
export function AddressModal({ open, onCancel, onConfirm }: AddressModalProps) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualValues, setManualValues] =
    useState<ManualAddressFields>(EMPTY_MANUAL_FIELDS);
  const [manualErrors, setManualErrors] = useState<
    Partial<Record<ManualAddressField, string>>
  >({});

  const debouncedQuery = useDebouncedValue(query);
  const suggest = useAddressSuggest(debouncedQuery);
  const resolve = useAddressResolve();

  // Reset all transient state whenever the dialog closes so a reopen starts
  // clean — no stale query text, selection, predictions, resolved address,
  // manual-mode toggle, or manual field values/errors can carry over.
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedId(null);
      setIsManualMode(false);
      setManualValues(EMPTY_MANUAL_FIELDS);
      setManualErrors({});
      resolve.reset();
    }
    // `resolve` identity is stable per TanStack Query; guard on `open` only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // The debounce-pending window (input changed but not yet settled) is treated
  // as "loading": predictions are only shown once `debouncedQuery` catches up to
  // `query`, so a stale prediction list never lingers under a changed query.
  const settled = debouncedQuery === query;
  const hasValidQuery = query.trim().length >= MIN_QUERY_LENGTH;
  const isLookupLoading =
    suggest.isFetching || (!settled && hasValidQuery);

  const predictions: AddressPrediction[] =
    settled && suggest.data?.ok ? suggest.data.data.predictions : [];
  const resolvedAddress: ResolvedAddress | null =
    resolve.data?.ok ? resolve.data.data.address : null;

  // `apiFetch` is NON-throwing: a service failure resolves to `ok: false`, so a
  // suggest query / resolve mutation still SUCCEEDS at the query level. Detect
  // the service error via the result envelope (`data.ok === false`), NOT
  // `isError`. Errors are non-destructive — the typed query and any selection
  // are preserved (FR-33).
  const suggestError = settled && suggest.data?.ok === false;
  const resolveError = resolve.data?.ok === false;
  const hasServiceError = suggestError || resolveError;
  const errorMessage =
    hasServiceError && !isManualMode ? ADDRESS_ERROR_MESSAGE : null;

  const handleQueryChange = (value: string) => {
    // Editing the query invalidates any staged selection/resolution so Confirm
    // can never write an address that no longer matches what the user sees.
    if (selectedId !== null) {
      setSelectedId(null);
      resolve.reset();
    }
    setQuery(value);
  };

  const handleSelect = (addressId: string) => {
    setSelectedId(addressId);
    resolve.mutate(addressId);
  };

  // Retry re-runs the failed operation without clearing entered data: a resolve
  // failure re-mutates the same selection; otherwise the suggest query refetches.
  const handleRetry = () => {
    if (resolveError && selectedId !== null) {
      resolve.mutate(selectedId);
      return;
    }
    void suggest.refetch();
  };

  const handleEnterManual = () => {
    setIsManualMode(true);
  };

  // Return to autocomplete search from manual entry, discarding the manual
  // field values/errors while preserving the typed search query (non-destructive
  // to the search path the user is going back to).
  const handleExitManual = () => {
    setIsManualMode(false);
    setManualValues(EMPTY_MANUAL_FIELDS);
    setManualErrors({});
  };

  const handleManualFieldChange = (
    field: ManualAddressField,
    value: string,
  ) => {
    setManualValues((current) => ({ ...current, [field]: value }));
    setManualErrors((current) => {
      if (current[field] === undefined) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleConfirm = () => {
    if (isManualMode) {
      const result = validateManualAddress(manualValues);
      if (result.ok) {
        onConfirm(result.address);
      } else {
        setManualErrors(result.errors);
      }
      return;
    }
    if (resolvedAddress !== null) {
      onConfirm(resolvedAddress);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby={DIALOG_TITLE_ID}
      fullWidth
      maxWidth="sm"
    >
      <AddressModalBody
        titleId={DIALOG_TITLE_ID}
        query={query}
        onQueryChange={handleQueryChange}
        predictions={predictions}
        isLookupLoading={isLookupLoading}
        selectedId={selectedId}
        onSelectPrediction={handleSelect}
        resolvedAddress={resolvedAddress}
        isResolving={resolve.isPending}
        onConfirm={handleConfirm}
        onCancel={onCancel}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        isManualMode={isManualMode}
        onEnterManual={handleEnterManual}
        onExitManual={handleExitManual}
        manualValues={manualValues}
        manualErrors={manualErrors}
        onManualFieldChange={handleManualFieldChange}
      />
    </Dialog>
  );
}
