'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useReducedMotion, resolveDuration } from '@/components/feedback';
import { formatAudRange } from '@/lib/money-format';
import type { FormConfig } from '@shared/schemas';
import type { StepFormValues } from '@/features/estimate-form/flow-form-values';
import { useEstimate } from '@/features/estimate-form/use-estimate';
import { ResultCostCard } from './ResultCostCard';
import { buildEstimateRequest } from './build-estimate-request';
import { toResultsView, type ResultsView } from './results-view-state';
import {
  CALCULATE_CTA_LABEL,
  ERROR_TITLE,
  IDLE_PROMPT,
  LOADING_MESSAGE,
  LOW_CONFIDENCE_MESSAGE,
  RETRY_LABEL,
} from './copy';

/** Motion band for the success reveal; collapses to 0 under reduced motion. */
export const REVEAL_MS = 240;

export interface ResultsPanelViewProps {
  view: ResultsView;
  typeLabel: string;
  itemLabels: string[];
  ctaDisabled: boolean;
  onCalculate: () => void;
  onRetry: () => void;
  /** Reveal duration in ms (0 under `prefers-reduced-motion`). */
  revealMs?: number;
}

/**
 * Presentational Results surface — pure over a `ResultsView`, so every UX-DR16
 * state is node-testable via `renderToStaticMarkup`. Owns NO async state.
 *
 * A PERSISTENT `role="status"` live region is mounted in EVERY state (never
 * conditionally unmounted) and carries the view's announcement text, so a screen
 * reader reliably announces the estimate's arrival/error (the BH#2 defer carried
 * from Story 4.2). For the success/low-confidence states the announcement also
 * includes the formatted dollar range, so the figure itself is spoken by the
 * single reliable region (the card carries no live region of its own). During
 * loading it also carries `aria-busy`.
 */
export function ResultsPanelView({
  view,
  typeLabel,
  itemLabels,
  ctaDisabled,
  onCalculate,
  onRetry,
  revealMs = REVEAL_MS,
}: ResultsPanelViewProps) {
  const announce =
    view.kind === 'success' || view.kind === 'lowConfidence'
      ? `${view.announce} ${formatAudRange(view.result.costMin, view.result.costMax)}.`
      : view.announce;

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        role="status"
        aria-live="polite"
        aria-busy={view.kind === 'loading'}
        sx={{ minHeight: 0 }}
      >
        {announce}
      </Box>

      {view.kind === 'idle' && (
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {IDLE_PROMPT}
          </Typography>
          <Button
            variant="contained"
            onClick={onCalculate}
            disabled={ctaDisabled}
          >
            {CALCULATE_CTA_LABEL}
          </Button>
        </Stack>
      )}

      {view.kind === 'loading' && (
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', textAlign: 'center', py: 4 }}
        >
          <CircularProgress aria-hidden />
          <Typography variant="body2" color="text.secondary">
            {LOADING_MESSAGE}
          </Typography>
        </Stack>
      )}

      {(view.kind === 'success' || view.kind === 'lowConfidence') && (
        <Collapse in appear timeout={revealMs}>
          <Stack spacing={2}>
            {view.kind === 'lowConfidence' && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                {LOW_CONFIDENCE_MESSAGE}
              </Typography>
            )}
            <ResultCostCard
              result={view.result}
              typeLabel={typeLabel}
              itemLabels={itemLabels}
            />
          </Stack>
        </Collapse>
      )}

      {view.kind === 'error' && (
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', textAlign: 'center', py: 2 }}
        >
          <Typography variant="h6" component="p" color="error.main">
            {ERROR_TITLE}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {view.message}
          </Typography>
          <Button variant="contained" color="primary" onClick={onRetry}>
            {RETRY_LABEL}
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export interface ResultsPanelProps {
  /** The loaded form config, or `undefined` while it loads (CTA disabled). */
  config: FormConfig | undefined;
  /** Reads the CURRENT flow scope at click time (never auto-fires). */
  getScope: () => StepFormValues;
}

/**
 * Persistent Results surface (UX-DR16). Owns the `useEstimate()` mutation and
 * maps its state via the pure `toResultsView` mapper; the estimate fires only on
 * the deliberate CTA / retry action (`mutate(buildEstimateRequest(...))`), never
 * on a keystroke. Answers live in the form aggregate and are untouched by a
 * failed request, so retry re-fires the same request non-destructively.
 */
export function ResultsPanel({ config, getScope }: ResultsPanelProps) {
  const mutation = useEstimate();
  const reduced = useReducedMotion();
  const view = toResultsView({
    status: mutation.status,
    data: mutation.data,
    isError: mutation.isError,
  });

  const scope = getScope();

  // Labels are SNAPSHOTTED at fire() time so editing the stepper after
  // calculating never desyncs the card's labels from its displayed numbers.
  const [labels, setLabels] = useState<{ typeLabel: string; itemLabels: string[] }>(
    { typeLabel: '', itemLabels: [] },
  );

  const deriveLabels = (values: StepFormValues) => {
    const typeLabel =
      config?.renovationTypes.find((t) => t.id === values.renovationTypeId)
        ?.label ?? '';
    const selected = new Set(values.selectedItemIds);
    const itemLabels = config
      ? config.items.filter((i) => selected.has(i.id)).map((i) => i.label)
      : [];
    return { typeLabel, itemLabels };
  };

  const fire = () => {
    if (!config) return;
    if (mutation.status === 'pending') return;
    const values = getScope();
    setLabels(deriveLabels(values));
    mutation.mutate(buildEstimateRequest(config, values));
  };

  return (
    <ResultsPanelView
      view={view}
      typeLabel={labels.typeLabel}
      itemLabels={labels.itemLabels}
      ctaDisabled={config === undefined || scope.selectedItemIds.length === 0}
      onCalculate={fire}
      onRetry={fire}
      revealMs={resolveDuration(REVEAL_MS, reduced)}
    />
  );
}
