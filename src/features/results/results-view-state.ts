import type { ApiResult } from '@/lib/request-state';
import type { EstimateResult } from '@shared/schemas';
import {
  ERROR_ANNOUNCEMENT,
  ERROR_MESSAGE,
  LOADING_ANNOUNCEMENT,
  LOW_CONFIDENCE_ANNOUNCEMENT,
  SUCCESS_ANNOUNCEMENT,
} from './copy';

/**
 * The discriminated Results view model (UX-DR16). Every branch carries the
 * screen-reader `announce` string the PERSISTENT live region should hold, so the
 * arrival of a result/error is spoken reliably (the region never remounts).
 */
export type ResultsView =
  | { kind: 'idle'; announce: '' }
  | { kind: 'loading'; announce: string }
  | { kind: 'success'; result: EstimateResult; announce: string }
  | { kind: 'lowConfidence'; result: EstimateResult; announce: string }
  | { kind: 'error'; message: string; announce: string; detail?: string; code?: string; requestId?: string };

/** Minimal `useEstimate()` mutation shape read by the mapper (node-testable). */
export interface EstimateMutationState {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: ApiResult<EstimateResult> | undefined;
  isError: boolean;
}

/**
 * Map the estimate mutation state → the Results view model — the SINGLE source
 * of state decisions, extracted pure so every branch is node-testable without
 * RTL.
 *
 * Ordering is load-bearing (AD-9): a TRANSPORT/unexpected failure (`isError`) is
 * checked FIRST, before `pending`/`data === undefined`, so it always surfaces
 * the non-destructive error surface. Then `pending` → loading and the not-yet-
 * requested case → idle. A SERVICE error is an envelope with `data.ok === false`
 * (the mutation itself SUCCEEDS at the query level), so it is detected via the
 * envelope, never `isError` alone. Finally a low-confidence success is framed
 * humbly rather than as a false-precise number.
 */
export function toResultsView(state: EstimateMutationState): ResultsView {
  const { status, data, isError } = state;

  if (isError) {
    return { kind: 'error', message: ERROR_MESSAGE, announce: ERROR_ANNOUNCEMENT };
  }

  if (status === 'pending') {
    return { kind: 'loading', announce: LOADING_ANNOUNCEMENT };
  }

  if (data === undefined) {
    return { kind: 'idle', announce: '' };
  }

  if (data.ok === false) {
    return {
      kind: 'error',
      // Never surface raw backend text to the homeowner; keep it for telemetry.
      message: ERROR_MESSAGE,
      announce: ERROR_ANNOUNCEMENT,
      detail: data.error.message,
      code: data.error.code,
      requestId: data.requestId,
    };
  }

  if (data.data.confidence === 'low') {
    return {
      kind: 'lowConfidence',
      result: data.data,
      announce: LOW_CONFIDENCE_ANNOUNCEMENT,
    };
  }

  return {
    kind: 'success',
    result: data.data,
    announce: SUCCESS_ANNOUNCEMENT,
  };
}
