import type { EstimateRequest, FormConfig } from '@shared/schemas';
import type { StepFormValues } from '@/features/estimate-form/flow-form-values';

/**
 * Pure estimate-request builder (Epic 3 stale-selection-pruning defer, due here).
 * Turns the completed flow scope into the wire `EstimateRequest`:
 *
 * - prunes `selectedItemIds` to ids that ACTUALLY exist in the current
 *   `config.items` so phantom/stale/wrong-renovation-type selections (e.g. an
 *   item removed from the config, or left over from a previous type) can never
 *   leak into the request — an honest scope only;
 * - dedupes the surviving ids (a `Set`) so a repeated id is sent once;
 * - echoes the exact `configVersion` the scope was built from (AD-8).
 *
 * No react/MUI — node-testable. The `EstimateRequest` envelope carries ONLY
 * `{configVersion, itemIds}`, so stale *answer* (`propertyDetails`) pruning is
 * moot at this seam — answers are never sent. The meaningful staleness guard is
 * pruning `itemIds` to the current config's items (done above). An empty scope
 * still yields a valid request.
 */
export function buildEstimateRequest(
  config: FormConfig,
  values: StepFormValues,
): EstimateRequest {
  const valid = new Set(config.items.map((i) => i.id));
  const itemIds = [...new Set(values.selectedItemIds)].filter((id) =>
    valid.has(id),
  );

  return {
    configVersion: config.configVersion,
    itemIds,
  };
}
