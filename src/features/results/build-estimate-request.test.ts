import { describe, it, expect } from 'vitest';
import { buildEstimateRequest } from './build-estimate-request';
import type { FormConfig } from '@shared/schemas';
import type { StepFormValues } from '@/features/estimate-form/flow-form-values';

const CONFIG: FormConfig = {
  configVersion: 'reno-config-v1',
  renovationTypes: [{ id: 'internal', label: 'Internal' }],
  items: [
    { id: 'kitchen', typeId: 'internal', label: 'Kitchen' },
    { id: 'bathroom', typeId: 'internal', label: 'Bathroom' },
  ],
  questions: [
    { id: 'q_general', kind: 'text', label: 'Anything else?', required: false },
    {
      id: 'q_kitchen',
      kind: 'text',
      label: 'Kitchen size',
      required: false,
      appliesToItemIds: ['kitchen'],
    },
    {
      id: 'q_bathroom',
      kind: 'text',
      label: 'Bathroom size',
      required: false,
      appliesToItemIds: ['bathroom'],
    },
  ],
};

function values(over: Partial<StepFormValues> = {}): StepFormValues {
  return {
    renovationTypeId: 'internal',
    selectedItemIds: ['kitchen'],
    propertyDetails: {},
    ...over,
  };
}

describe('buildEstimateRequest (pure)', () => {
  it('echoes the config version', () => {
    const req = buildEstimateRequest(CONFIG, values());
    expect(req.configVersion).toBe('reno-config-v1');
  });

  it('carries the selected item ids', () => {
    const req = buildEstimateRequest(CONFIG, values({ selectedItemIds: ['kitchen', 'bathroom'] }));
    expect(req.itemIds).toEqual(['kitchen', 'bathroom']);
  });

  it('dedupes repeated item ids', () => {
    const req = buildEstimateRequest(
      CONFIG,
      values({ selectedItemIds: ['kitchen', 'kitchen', 'bathroom', 'bathroom'] }),
    );
    expect(req.itemIds).toEqual(['kitchen', 'bathroom']);
  });

  it('returns only {configVersion, itemIds} even with hidden-question answers', () => {
    const req = buildEstimateRequest(
      CONFIG,
      values({
        selectedItemIds: ['kitchen'],
        // q_bathroom belongs to a now-hidden question (bathroom not selected).
        propertyDetails: { q_general: 'hi', q_kitchen: 'big', q_bathroom: 'stale' },
      }),
    );
    expect(Object.keys(req).sort()).toEqual(['configVersion', 'itemIds']);
    expect(req).toEqual({ configVersion: 'reno-config-v1', itemIds: ['kitchen'] });
  });

  it('still returns a valid request for an empty scope', () => {
    const req = buildEstimateRequest(CONFIG, values({ selectedItemIds: [], propertyDetails: {} }));
    expect(req).toEqual({ configVersion: 'reno-config-v1', itemIds: [] });
  });

  it('drops item ids that are not present in the current config', () => {
    const req = buildEstimateRequest(
      CONFIG,
      values({ selectedItemIds: ['kitchen', 'phantom', 'bathroom'] }),
    );
    expect(req.itemIds).toEqual(['kitchen', 'bathroom']);
  });

  it('filters out items from a different renovation type / removed items', () => {
    const req = buildEstimateRequest(
      CONFIG,
      // `roof` belongs to another type and `garage` was removed from the config.
      values({ selectedItemIds: ['roof', 'kitchen', 'garage'] }),
    );
    expect(req.itemIds).toEqual(['kitchen']);
  });

  it('dedupes AND prunes together', () => {
    const req = buildEstimateRequest(
      CONFIG,
      values({ selectedItemIds: ['kitchen', 'kitchen', 'ghost', 'ghost', 'bathroom'] }),
    );
    expect(req.itemIds).toEqual(['kitchen', 'bathroom']);
  });
});
