'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { resolvedAddressEnvelopeDataSchema } from '@shared/schemas';
import type { ApiResult } from '@/lib/request-state';
import type { ResolvedAddressEnvelopeData } from '@shared/schemas';

/**
 * Resolve a selected prediction into the structured `ResolvedAddress` (FR-7).
 * Goes through the single BFF caller `apiFetch` against the same-origin resolve
 * route (AD-1/AD-5/AD-9); returns the NON-THROWING `ApiResult` envelope so a
 * lookup failure stays quiet here (Story 2.4 owns the error surface). Extracted
 * as a plain function so the wiring is unit-testable via a `global.fetch` stub.
 */
export function resolveAddressRequest(
  addressId: string,
): Promise<ApiResult<ResolvedAddressEnvelopeData>> {
  return apiFetch(
    `/api/v1/address/resolve?addressId=${encodeURIComponent(addressId)}`,
    resolvedAddressEnvelopeDataSchema,
  );
}

/**
 * TanStack mutation wrapper: selecting a prediction triggers a resolve. The
 * mutation owns the in-flight/settled state; `data` is the typed `ApiResult`.
 */
export function useAddressResolve() {
  return useMutation({
    mutationFn: (addressId: string) => resolveAddressRequest(addressId),
  });
}
