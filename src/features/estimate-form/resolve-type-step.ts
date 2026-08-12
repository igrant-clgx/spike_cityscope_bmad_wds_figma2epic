import type { ApiResult } from '@/lib/request-state';
import type { FormConfig, RenovationType } from '@shared/schemas';

/**
 * The view state for the Step 1 renovation-type body, derived purely from the
 * config query so the loading/error/empty/ready branches are node-testable
 * without a live TanStack Query (which cannot resolve during SSR).
 */
export type TypeStepView =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'ready'; types: RenovationType[] };

/**
 * Minimal shape of the `useFormConfig()` result this mapper reads. `data` is the
 * NON-THROWING `ApiResult<FormConfig>` envelope (a service failure resolves as
 * `data.ok === false`, NOT a thrown/`isError` query), so `isError` is folded in
 * defensively but the envelope is the primary error signal.
 */
export interface TypeStepQuery {
  data: ApiResult<FormConfig> | undefined;
  isError?: boolean;
}

/**
 * Map the config query to the Step 1 view state (UX-DR16 form slice):
 * pending/no-data → loading; envelope failure (or `isError`) → error;
 * loaded with no renovation types → empty (schema forbids it, but defend);
 * otherwise → ready with the types.
 */
export function resolveTypeStep(query: TypeStepQuery): TypeStepView {
  const { data, isError } = query;
  // Check the error signals BEFORE the pending check: a thrown/rejected query
  // leaves `data` undefined but `isError` true, and must surface the error
  // treatment (not a perpetual spinner). `apiFetch` is non-throwing, so the
  // primary error path is the `data.ok === false` envelope.
  if (isError) return { status: 'error' };
  if (data === undefined) return { status: 'loading' };
  if (data.ok === false) return { status: 'error' };
  if (data.data.renovationTypes.length === 0) return { status: 'empty' };
  return { status: 'ready', types: data.data.renovationTypes };
}
