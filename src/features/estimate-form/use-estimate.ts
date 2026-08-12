'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { estimateResultSchema } from '@shared/schemas';
import type { ApiResult } from '@/lib/request-state';
import type { EstimateRequest, EstimateResult } from '@shared/schemas';

/**
 * Request an estimate for a completed scope (AD-5). TanStack Query owns the
 * async/loading/error state via a MUTATION (POST); the fetch goes through the
 * single BFF caller `apiFetch` against the same-origin estimate route
 * (AD-1/AD-9). The result is the typed NON-THROWING `ApiResult<EstimateResult>`
 * envelope result (`data.ok === false` on failure).
 *
 * The request wiring is extracted as a plain function so it is node-testable via
 * a `global.fetch` stub (mirrors `use-form-config.ts`).
 *
 * NOTE: `apiFetch` retry semantics are intentionally unchanged here. The
 * non-idempotent-POST-retry concern is DEFERRED to Epic 5, when this seam
 * becomes stateful (lead linkage / cache invalidation) and a safe retry/idempotency
 * key can be designed.
 */
export function requestEstimate(
  request: EstimateRequest,
): Promise<ApiResult<EstimateResult>> {
  return apiFetch('/api/v1/estimate', estimateResultSchema, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function useEstimate() {
  return useMutation({
    mutationFn: requestEstimate,
  });
}
