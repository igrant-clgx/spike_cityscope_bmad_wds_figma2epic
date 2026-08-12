import type { ApiResult } from '@/lib/request-state';
import type { LeadReceipt } from '@shared/schemas';
import {
  LEAD_ERROR_ANNOUNCEMENT,
  LEAD_ERROR_MESSAGE,
  LEAD_SUBMITTING_ANNOUNCEMENT,
  LEAD_SUCCESS_ANNOUNCEMENT,
} from './lead-panel-copy';

/**
 * The discriminated lead-surface view model (UX-DR16 lead). Every branch carries
 * the screen-reader `announce` string the PERSISTENT live region should hold, so
 * the arrival of a confirmation/error is spoken reliably (the region never
 * remounts). Mirror of `results/results-view-state.ts`.
 */
export type LeadView =
  | { kind: 'form'; announce: '' }
  | { kind: 'submitting'; announce: string }
  | { kind: 'success'; leadId: string; announce: string }
  | { kind: 'error'; message: string; announce: string; detail?: string; code?: string; requestId?: string };

/** Minimal `useLeadCapture()` mutation shape read by the mapper (node-testable). */
export interface LeadMutationState {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: ApiResult<LeadReceipt> | undefined;
  isError: boolean;
}

/**
 * Map the lead mutation state → the lead view model — the SINGLE source of state
 * decisions, extracted pure so every branch is node-testable without RTL.
 *
 * Ordering is load-bearing and MIRRORS `toResultsView` EXACTLY (AD-9): a
 * TRANSPORT/unexpected failure (`isError`) is checked FIRST, before
 * `pending`/`data === undefined`, so it always surfaces the non-destructive
 * error surface. Then `pending` → submitting and the not-yet-submitted case →
 * form. A SERVICE error is an envelope with `data.ok === false` (the mutation
 * itself SUCCEEDS at the query level), so it is detected via the envelope, never
 * `isError` alone. Finally a successful envelope → the confirmation.
 */
export function toLeadView(state: LeadMutationState): LeadView {
  const { status, data, isError } = state;

  if (isError) {
    return { kind: 'error', message: LEAD_ERROR_MESSAGE, announce: LEAD_ERROR_ANNOUNCEMENT };
  }

  if (status === 'pending') {
    return { kind: 'submitting', announce: LEAD_SUBMITTING_ANNOUNCEMENT };
  }

  if (data === undefined) {
    return { kind: 'form', announce: '' };
  }

  if (data.ok === false) {
    return {
      kind: 'error',
      // Never surface raw backend text to the homeowner; keep it for telemetry.
      message: LEAD_ERROR_MESSAGE,
      announce: LEAD_ERROR_ANNOUNCEMENT,
      detail: data.error.message,
      code: data.error.code,
      requestId: data.requestId,
    };
  }

  return {
    kind: 'success',
    leadId: data.data.leadId,
    announce: LEAD_SUCCESS_ANNOUNCEMENT,
  };
}
