import type { ApiResult } from '@/lib/request-state';
import type { FormConfig, PropertyQuestion } from '@shared/schemas';
import { filterQuestions } from './question-selection';

/**
 * The view state for the Step 3 details body, derived purely from the config
 * query and the selected Step 2 items so every branch is node-testable without a
 * live TanStack Query.
 */
export type DetailsStepView =
  | { status: 'no-items' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'ready'; questions: PropertyQuestion[] };

/** Minimal `useFormConfig()` result shape read by the mapper. */
export interface DetailsStepQuery {
  data: ApiResult<FormConfig> | undefined;
  isError?: boolean;
}

/**
 * Map the config query + selected items to the Step 3 view state (UX-DR16):
 * no items chosen → `no-items` (Step 3 has no questions without Step 2, takes
 * precedence so SSR is deterministic); thrown/`isError` → `error`; pending →
 * `loading`; envelope failure → `error`; no matching questions → `empty`;
 * otherwise `ready` with the filtered questions (FR-16).
 */
export function resolveDetailsStep(
  query: DetailsStepQuery,
  selectedItemIds: string[],
): DetailsStepView {
  if (!selectedItemIds.length) return { status: 'no-items' };
  const { data, isError } = query;
  if (isError) return { status: 'error' };
  if (data === undefined) return { status: 'loading' };
  if (data.ok === false) return { status: 'error' };
  const questions = filterQuestions(data.data.questions, selectedItemIds);
  if (questions.length === 0) return { status: 'empty' };
  return { status: 'ready', questions };
}
