import type { PropertyQuestion } from '@shared/schemas';

/**
 * Pure Step 3 question-selection helper (FR-16). No react, no MUI.
 *
 * A question shows when its `appliesToItemIds` is absent or empty (always shown)
 * OR intersects the currently selected Step 2 item ids. Config-driven — never a
 * hardcoded field list (AD-8/AD-11).
 */
export function filterQuestions(
  questions: PropertyQuestion[],
  selectedItemIds: string[],
): PropertyQuestion[] {
  const selected = new Set(selectedItemIds);
  return questions.filter((question) => {
    const applies = question.appliesToItemIds;
    if (applies === undefined || applies.length === 0) return true;
    return applies.some((id) => selected.has(id));
  });
}
