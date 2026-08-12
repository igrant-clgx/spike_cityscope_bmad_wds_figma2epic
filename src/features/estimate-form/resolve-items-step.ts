import type { ApiResult } from '@/lib/request-state';
import type { FormConfig, RenovationItem } from '@shared/schemas';
import { filterItemsForType } from './item-selection';

/**
 * The view state for the Step 2 items body, derived purely from the config query
 * and the chosen renovation type so every branch is node-testable without a live
 * TanStack Query.
 */
export type ItemsStepView =
  | { status: 'no-type' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'ready'; items: RenovationItem[] };

/** Minimal `useFormConfig()` result shape read by the mapper. */
export interface ItemsStepQuery {
  data: ApiResult<FormConfig> | undefined;
  isError?: boolean;
}

/**
 * Map the config query + chosen type to the Step 2 view state (UX-DR16):
 * no type chosen → `no-type` (Step 2 has no options without Step 1, takes
 * precedence so SSR is deterministic); thrown/`isError` → `error`; pending →
 * `loading`; envelope failure → `error`; no matching items → `empty`; otherwise
 * `ready` with the type's items (FR-11/FR-13).
 */
export function resolveItemsStep(
  query: ItemsStepQuery,
  typeId: string | null,
): ItemsStepView {
  if (!typeId) return { status: 'no-type' };
  const { data, isError } = query;
  if (isError) return { status: 'error' };
  if (data === undefined) return { status: 'loading' };
  if (data.ok === false) return { status: 'error' };
  const items = filterItemsForType(data.data.items, typeId);
  if (items.length === 0) return { status: 'empty' };
  return { status: 'ready', items };
}
