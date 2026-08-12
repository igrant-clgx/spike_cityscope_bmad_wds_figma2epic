import type { StepFormValues } from './flow-form-values';

/**
 * The three guided-form steps (UX-DR7). Ordered progressive disclosure:
 * type → items → details. Pure module: no react, no MUI.
 */
export type StepId = 'type' | 'items' | 'details';

export const STEP_ORDER: readonly StepId[] = ['type', 'items', 'details'];

/**
 * Shell step metadata (id, title, 0-based order index). Titles are reasonable
 * shell copy; the step stories (3.3–3.5) own their final headings/content.
 */
export const STEP_META: Record<StepId, { id: StepId; title: string; index: number }> = {
  type: { id: 'type', title: 'Renovation type', index: 0 },
  items: { id: 'items', title: 'What to renovate', index: 1 },
  details: { id: 'details', title: 'More questions', index: 2 },
};

/**
 * Whether an answer value is a meaningful (non-blank) response. `undefined`,
 * `null`, and blank/whitespace-only strings do not count; numbers, booleans,
 * and range objects do. This keeps a placeholder/cleared key from marking a
 * step complete. Full per-field validity (e.g. range `min <= max`) is Story
 * 3.5's job (OI-2); this is only the shell's non-empty heuristic.
 */
function isMeaningfulAnswer(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Whether a step has enough captured input to be considered complete. Tolerates
 * a partial/undefined values object (react-hook-form `useWatch` can transiently
 * yield a subset), treating missing slots as empty.
 *
 * PROVISIONAL shell heuristic (pending Story 3.5's real validation): a step is
 * complete once its scope slot holds a meaningful answer. Unknown step ids
 * return `false`.
 */
export function isStepComplete(stepId: StepId, values: Partial<StepFormValues>): boolean {
  switch (stepId) {
    case 'type':
      return isMeaningfulAnswer(values.renovationTypeId);
    case 'items':
      return (values.selectedItemIds?.length ?? 0) >= 1;
    case 'details':
      return Object.values(values.propertyDetails ?? {}).some(isMeaningfulAnswer);
    default:
      return false;
  }
}

/**
 * Compute the next expanded step given the current one and the toggled target,
 * enforcing the exactly-ONE-expanded invariant (UX-DR7): exactly one step is
 * expanded at all times. Activating a different step replaces the expansion;
 * re-activating the already-open step is a no-op (it stays open — the shell
 * never collapses to zero steps). An unknown target id is ignored (keeps the
 * current step). Never unions.
 */
export function nextExpanded(current: StepId, target: StepId): StepId {
  return STEP_ORDER.includes(target) ? target : current;
}
