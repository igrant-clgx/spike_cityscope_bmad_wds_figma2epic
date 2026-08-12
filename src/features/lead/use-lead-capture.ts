'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { leadReceiptSchema } from '@shared/schemas';
import type { ApiResult } from '@/lib/request-state';
import type { LeadCaptureRequest, LeadReceipt } from '@shared/schemas';

/**
 * Submit a consented lead linked to the current estimate (AD-5, FR-29). TanStack
 * Query owns the async/loading/error state via a MUTATION (POST); the fetch goes
 * through the single BFF caller `apiFetch` against the same-origin lead route
 * (AD-1/AD-9) — all PII crosses the BFF only (NFR-6), never client-to-external.
 * The result is the typed NON-THROWING `ApiResult<LeadReceipt>` envelope result
 * (`data.ok === false` on failure).
 *
 * The request wiring is extracted as a plain function so it is node-testable via
 * a `global.fetch` stub (mirrors `use-estimate.ts`).
 *
 * NOTE: this is a STATEFUL POST, so it is NEVER silently transport-retried
 * (`apiFetch` `maxRetries: 0`) and it carries a stable per-submission
 * `Idempotency-Key` header (FR-32/FR-33) the stub sink dedups on — a manual
 * retry re-fires the SAME key and returns the SAME `leadId`, no duplicate.
 */
export function requestLeadCapture(
  request: LeadCaptureRequest,
  idempotencyKey: string,
): Promise<ApiResult<LeadReceipt>> {
  return apiFetch(
    '/api/v1/leads',
    leadReceiptSchema,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(request),
    },
    { maxRetries: 0 },
  );
}

export function useLeadCapture() {
  return useMutation({
    mutationFn: ({
      request,
      idempotencyKey,
    }: {
      request: LeadCaptureRequest;
      idempotencyKey: string;
    }) => requestLeadCapture(request, idempotencyKey),
  });
}
