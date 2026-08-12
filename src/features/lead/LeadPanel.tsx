'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';
import { LeadForm } from './LeadForm';
import { useLeadCapture } from './use-lead-capture';
import { type LeadRequestFields } from './lead-form-values';
import { toLeadView, type LeadView } from './lead-view-state';
import type { LeadCaptureRequest } from '@shared/schemas';
import type { LeadSubmittedEvent } from '@server/domain/ports/analytics-sink';
import {
  LEAD_ERROR_TITLE,
  LEAD_RETRY_LABEL,
  LEAD_SUCCESS_MESSAGE,
  LEAD_SUCCESS_TITLE,
} from './lead-panel-copy';

export interface LeadPanelViewProps {
  view: LeadView;
  /** Fires with the schema-ready fields on a valid form submit. */
  onSubmit: (fields: LeadRequestFields) => void;
  /** Re-fires the SAME idempotent request after an error (entered data preserved). */
  onRetry: () => void;
}

/**
 * Presentational lead surface — pure over a `LeadView`, so every UX-DR16 lead
 * state is node-testable via `renderToStaticMarkup`. Owns NO async state.
 *
 * A PERSISTENT `role="status"` live region is mounted in EVERY state (never
 * conditionally unmounted) and carries the view's announcement text, so a screen
 * reader reliably announces the submit's confirmation/error (mirror of the
 * Results live-region pattern). During submitting it also carries `aria-busy`.
 *
 * `LeadForm` stays MOUNTED across form↔submitting↔error (disabled while
 * submitting) so its react-hook-form state — the entered data — is preserved on
 * a non-destructive error (FR-30/FR-32). ONLY the success state REPLACES the
 * form with the confirmation; the estimate above stays visible.
 */
export function LeadPanelView({ view, onSubmit, onRetry }: LeadPanelViewProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box
        role="status"
        aria-live="polite"
        aria-busy={view.kind === 'submitting'}
        sx={{ minHeight: 0 }}
      >
        {view.announce}
      </Box>

      {view.kind === 'success' ? (
        <Stack spacing={2}>
          <Typography variant="h6" component="p" color="success.main">
            {LEAD_SUCCESS_TITLE}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {LEAD_SUCCESS_MESSAGE}
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {view.kind === 'error' && (
            <Stack spacing={1}>
              <Typography variant="h6" component="p" color="error.main">
                {LEAD_ERROR_TITLE}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {view.message}
              </Typography>
              <Box>
                <Button variant="contained" color="primary" onClick={onRetry}>
                  {LEAD_RETRY_LABEL}
                </Button>
              </Box>
            </Stack>
          )}
          <LeadForm onSubmit={onSubmit} submitting={view.kind === 'submitting'} />
        </Stack>
      )}
    </Box>
  );
}

/**
 * PURE `lead_submitted` event builder (AD-12). Carries ONLY the opaque `leadId`
 * and the contact-method CATEGORY — NEVER name/email/phone. Extracted so the
 * no-PII guarantee is node-testable without driving the async mutation.
 */
export function leadSubmittedEvent(
  request: Pick<LeadCaptureRequest, 'contactMethod'>,
  leadId: string,
): LeadSubmittedEvent {
  return {
    name: 'lead_submitted',
    leadId,
    contactMethod: request.contactMethod,
  };
}

export interface LeadPanelProps {
  /** The CURRENT estimate the lead links to (`view.result.estimateId`). */
  estimateId: string;
}

/**
 * Wired lead surface (UX-DR16 lead). Owns the `useLeadCapture()` mutation and
 * maps its state via the pure `toLeadView` mapper; the submit fires only on the
 * deliberate form submit (never on a keystroke). The current `estimateId` is
 * joined into the schema-ready fields at submit time so the lead links to the
 * estimate on screen.
 *
 * A stable `Idempotency-Key` is generated ONCE per mount and reused for the
 * initial submit AND every manual retry (FR-32/FR-33), so the stateful POST —
 * which never auto-retries (`maxRetries: 0`) — dedups to the SAME `leadId` on a
 * retry rather than storing a duplicate. On success `lead_submitted` is emitted
 * ONCE carrying ONLY `leadId` + `contactMethod` (category) — never PII (AD-12).
 */
export function LeadPanel({ estimateId }: LeadPanelProps) {
  const mutation = useLeadCapture();
  const analytics = useAnalytics();

  // Globally-unique idempotency key seeded with real entropy (`randomUUID`),
  // generated ONCE per mount (via a ref) and held constant across manual retries
  // of that panel instance (FR-32/FR-33), so a retry dedups to the SAME `leadId`.
  // NOTE: `estimateId` is a deterministic content hash and cannot be the sole
  // uniqueness source — two users on the same estimate would otherwise collide
  // against the process-wide dedup ledger (silent cross-user lead drop).
  const idempotencyKeyRef = useRef<string | null>(null);
  if (idempotencyKeyRef.current === null) {
    idempotencyKeyRef.current = `lead-${crypto.randomUUID()}`;
  }
  const idempotencyKey = idempotencyKeyRef.current;

  // The last submitted request, so a manual retry re-fires it unchanged.
  const lastRequestRef = useRef<LeadCaptureRequest | null>(null);
  // Guard so `lead_submitted` is emitted at most once per panel instance.
  const emittedRef = useRef(false);

  const view = toLeadView({
    status: mutation.status,
    data: mutation.data,
    isError: mutation.isError,
  });

  const fire = (request: LeadCaptureRequest) => {
    lastRequestRef.current = request;
    mutation.mutate(
      { request, idempotencyKey },
      {
        onSuccess: (result) => {
          // `apiFetch` never throws for an error envelope, so onSuccess also
          // fires on `ok === false`; only emit for a genuine success, once.
          if (result.ok && !emittedRef.current) {
            emittedRef.current = true;
            analytics.track(leadSubmittedEvent(request, result.data.leadId));
          }
        },
      },
    );
  };

  const handleSubmit = (fields: LeadRequestFields) => {
    fire({ ...fields, estimateId });
  };

  const handleRetry = () => {
    // Guard against a synchronous double-click firing two concurrent POSTs
    // before the re-render into `submitting` unmounts the retry button.
    if (mutation.isPending) return;
    const last = lastRequestRef.current;
    if (last) fire(last);
  };

  return (
    <LeadPanelView view={view} onSubmit={handleSubmit} onRetry={handleRetry} />
  );
}
