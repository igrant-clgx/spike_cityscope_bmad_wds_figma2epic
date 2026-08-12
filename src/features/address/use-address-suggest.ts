'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { addressPredictionsSchema } from '@shared/schemas';

/**
 * Address autocomplete hook (AD-5). TanStack Query owns the async/loading/error
 * state; the fetch goes through `apiFetch` against the same-origin suggest route
 * (AD-1/AD-9). Disabled until the query is ≥3 chars so a short query issues no
 * request. `data` is the typed `ApiResult<{ predictions }>` envelope result.
 */
const MIN_QUERY_LENGTH = 3;

export function useAddressSuggest(query: string) {
  return useQuery({
    queryKey: ['address', 'suggest', query],
    enabled: query.trim().length >= MIN_QUERY_LENGTH,
    queryFn: () =>
      apiFetch(
        `/api/v1/address/suggest?q=${encodeURIComponent(query)}`,
        addressPredictionsSchema,
      ),
  });
}
