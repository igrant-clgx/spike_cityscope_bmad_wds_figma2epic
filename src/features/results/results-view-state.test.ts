import { describe, it, expect } from 'vitest';
import { toResultsView, type EstimateMutationState } from './results-view-state';
import type { ApiResult } from '@/lib/request-state';
import type { EstimateResult } from '@shared/schemas';
import {
  ERROR_ANNOUNCEMENT,
  ERROR_MESSAGE,
  LOADING_ANNOUNCEMENT,
  LOW_CONFIDENCE_ANNOUNCEMENT,
  SUCCESS_ANNOUNCEMENT,
} from './copy';

const RESULT: EstimateResult = {
  estimateId: 'est_1',
  costMin: 1_000_000,
  costMax: 1_500_000,
  confidence: 'high',
};

function okResult(result: EstimateResult): ApiResult<EstimateResult> {
  return { ok: true, data: result, requestId: 'rid-ok' };
}

function state(over: Partial<EstimateMutationState>): EstimateMutationState {
  return { status: 'idle', data: undefined, isError: false, ...over };
}

describe('toResultsView (pure state mapper)', () => {
  it('maps the untouched mutation to idle with an empty announcement', () => {
    const view = toResultsView(state({ status: 'idle' }));
    expect(view.kind).toBe('idle');
    expect(view.announce).toBe('');
  });

  it('maps pending to loading', () => {
    const view = toResultsView(state({ status: 'pending' }));
    expect(view.kind).toBe('loading');
    expect(view.announce).toBe(LOADING_ANNOUNCEMENT);
  });

  it('checks isError BEFORE pending/data-undefined (transport failure)', () => {
    // Even while pending with no data, a transport error surfaces the error view.
    const view = toResultsView(state({ status: 'pending', isError: true, data: undefined }));
    expect(view.kind).toBe('error');
    if (view.kind === 'error') {
      expect(view.message).toBe(ERROR_MESSAGE);
    }
    expect(view.announce).toBe(ERROR_ANNOUNCEMENT);
  });

  it('shows the friendly message for a service error, not raw backend text', () => {
    const data: ApiResult<EstimateResult> = {
      ok: false,
      error: { code: 'engine_failed', message: 'engine down' },
      requestId: 'rid-err',
    };
    const view = toResultsView(state({ status: 'success', data, isError: false }));
    expect(view.kind).toBe('error');
    if (view.kind === 'error') {
      // The homeowner NEVER sees the raw backend text.
      expect(view.message).toBe(ERROR_MESSAGE);
      expect(view.message).not.toBe('engine down');
      // …but the raw detail is preserved for telemetry/logging.
      expect(view.detail).toBe('engine down');
      expect(view.code).toBe('engine_failed');
      expect(view.requestId).toBe('rid-err');
    }
  });

  it('falls back to generic copy when the envelope error message is empty', () => {
    const data = {
      ok: false as const,
      error: { code: 'x', message: '' },
      requestId: 'rid',
    } as unknown as ApiResult<EstimateResult>;
    const view = toResultsView(state({ status: 'success', data }));
    expect(view.kind).toBe('error');
    if (view.kind === 'error') expect(view.message).toBe(ERROR_MESSAGE);
  });

  it('maps a normal success to success with the arrival announcement', () => {
    const view = toResultsView(state({ status: 'success', data: okResult(RESULT) }));
    expect(view.kind).toBe('success');
    if (view.kind === 'success') {
      expect(view.result).toEqual(RESULT);
      expect(view.announce).toBe(SUCCESS_ANNOUNCEMENT);
    }
  });

  it('maps a low-confidence success to lowConfidence (never false-precise)', () => {
    const low = { ...RESULT, confidence: 'low' as const };
    const view = toResultsView(state({ status: 'success', data: okResult(low) }));
    expect(view.kind).toBe('lowConfidence');
    if (view.kind === 'lowConfidence') {
      expect(view.result).toEqual(low);
      expect(view.announce).toBe(LOW_CONFIDENCE_ANNOUNCEMENT);
    }
  });

  it('treats medium confidence as a normal success', () => {
    const medium = { ...RESULT, confidence: 'medium' as const };
    const view = toResultsView(state({ status: 'success', data: okResult(medium) }));
    expect(view.kind).toBe('success');
  });
});
