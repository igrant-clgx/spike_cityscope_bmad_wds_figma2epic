import {
  emptyForm,
  type PropertyDetailAnswers,
} from '@server/domain/flow/renovation-estimate-form';

/**
 * The react-hook-form flow scope for Step 1–3 (AD-6). This is the UI-side view
 * of the pure domain aggregate's dependent scope — it deliberately excludes the
 * `address` slot, which is lifted into `EstimateFlow` React state (a confirmed
 * address change triggers `reset(stepFormDefaults())`). Pure module: no react.
 */
export interface StepFormValues {
  renovationTypeId: string | null;
  selectedItemIds: string[];
  propertyDetails: PropertyDetailAnswers;
}

/**
 * The default react-hook-form values, derived from the canonical domain
 * `emptyForm()` baseline so the form and the aggregate never drift apart.
 */
export function stepFormDefaults(): StepFormValues {
  const { renovationTypeId, selectedItemIds, propertyDetails } = emptyForm();
  return { renovationTypeId, selectedItemIds, propertyDetails };
}
