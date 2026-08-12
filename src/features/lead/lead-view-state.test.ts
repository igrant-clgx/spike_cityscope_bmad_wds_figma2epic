import { describe, it, expect } from 'vitest';
import { toLeadView } from './lead-view-state';
import type { LeadMutationState } from './lead-view-state';
import type { ApiResult } from '@/lib/request-state';
import type { LeadReceipt } from '@shared/schemas';
import {
  LEAD_ERROR_ANNOUNCEMENT,
  LEAD_ERROR_MESSAGE,
  LEAD_SUBMITTING_ANNOUNCEMENT,
  LEAD_SUCCESS_ANNOUNCEMENT,
} from './lead-panel-copy';

/**
 * Node-only unit test of the pure `toLeadView` mapper — the SINGLE source of the
 * lead surface's state decisions. Exhaustive I/O matrix; ordering MIRRORS
 * `toResultsView` (transport `isError` FIRST, then pending, then undefined→form,
 * then envelope `ok === false`→error, else success).
 */

const okReceipt: ApiResult<LeadReceipt> = {
  ok: true,
  data: { leadId: 'lead_abc' },
  requestId: 'rid-ok',
};

function state(overrides: Partial<LeadMutationState>): LeadMutationState {
  return { status: 'idle', data: undefined, isError: false, ...overrides };
}

describe('toLeadView', () => {
  it('idle (not yet submitted) → form', () => {
    const view = toLeadView(state({ status: 'idle', data: undefined }));
    expect(view).toEqual({ kind: 'form', announce: '' });
  });

  it('pending → submitting with the submitting announcement', () => {
    const view = toLeadView(state({ status: 'pending' }));
    expect(view.kind).toBe('submitting');
    if (view.kind === 'submitting') {
      expect(view.announce).toBe(LEAD_SUBMITTING_ANNOUNCEMENT);
    }
  });

  it('success envelope → success carrying the leadId', () => {
    const view = toLeadView(state({ status: 'success', data: okReceipt }));
    expect(view.kind).toBe('success');
    if (view.kind === 'success') {
      expect(view.leadId).toBe('lead_abc');
      expect(view.announce).toBe(LEAD_SUCCESS_ANNOUNCEMENT);
    }
  });

  it('service error envelope (ok:false) → error (never surfaces raw text)', () => {
    const errEnvelope: ApiResult<LeadReceipt> = {
      ok: false,
      error: { code: 'internal_error', message: 'raw backend text' },
      requestId: 'rid-err',
    };
    const view = toLeadView(state({ status: 'success', data: errEnvelope }));
    expect(view.kind).toBe('error');
    if (view.kind === 'error') {
      expect(view.message).toBe(LEAD_ERROR_MESSAGE);
      expect(view.announce).toBe(LEAD_ERROR_ANNOUNCEMENT);
      expect(view.detail).toBe('raw backend text');
      expect(view.code).toBe('internal_error');
      expect(view.requestId).toBe('rid-err');
    }
  });

  it('transport failure (isError) → error, checked BEFORE pending/undefined', () => {
    // Even with status pending + no data, isError wins (ordering is load-bearing).
    const view = toLeadView(state({ status: 'pending', data: undefined, isError: true }));
    expect(view.kind).toBe('error');
    if (view.kind === 'error') {
      expect(view.message).toBe(LEAD_ERROR_MESSAGE);
      expect(view.announce).toBe(LEAD_ERROR_ANNOUNCEMENT);
      expect(view.detail).toBeUndefined();
    }
  });
});
