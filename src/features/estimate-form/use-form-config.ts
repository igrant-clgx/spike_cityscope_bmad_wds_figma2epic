'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { formConfigSchema } from '@shared/schemas';
import type { ApiResult } from '@/lib/request-state';
import type { FormConfig } from '@shared/schemas';

/**
 * Load the versioned form-config bundle (AD-5). TanStack Query owns the
 * async/loading/error state; the fetch goes through the single BFF caller
 * `apiFetch` against the same-origin config route (AD-1/AD-9). `data` is the
 * typed NON-THROWING `ApiResult<FormConfig>` envelope result.
 *
 * The request wiring is extracted as a plain function so it is node-testable via
 * a `global.fetch` stub (mirrors `use-address-resolve.ts`).
 */
export function fetchFormConfig(): Promise<ApiResult<FormConfig>> {
  return apiFetch('/api/v1/config/form', formConfigSchema);
}

export function useFormConfig() {
  return useQuery({
    queryKey: ['config', 'form'],
    queryFn: fetchFormConfig,
  });
}
