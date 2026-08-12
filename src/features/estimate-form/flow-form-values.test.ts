import { describe, it, expect } from 'vitest';
import { emptyForm } from '@server/domain/flow/renovation-estimate-form';
import { stepFormDefaults } from './flow-form-values';

describe('stepFormDefaults', () => {
  it('derives the Step 1–3 defaults from the domain emptyForm baseline', () => {
    expect(stepFormDefaults()).toEqual({
      renovationTypeId: null,
      selectedItemIds: [],
      propertyDetails: {},
    });
  });

  it('excludes the address slot (address is lifted into EstimateFlow state)', () => {
    expect(stepFormDefaults()).not.toHaveProperty('address');
  });

  it('stays in sync with emptyForm (same values for the shared slots)', () => {
    const empty = emptyForm();
    const defaults = stepFormDefaults();
    expect(defaults.renovationTypeId).toBe(empty.renovationTypeId);
    expect(defaults.selectedItemIds).toEqual(empty.selectedItemIds);
    expect(defaults.propertyDetails).toEqual(empty.propertyDetails);
  });

  it('returns fresh collections each call (no shared mutable references)', () => {
    const a = stepFormDefaults();
    const b = stepFormDefaults();
    expect(a.selectedItemIds).not.toBe(b.selectedItemIds);
    expect(a.propertyDetails).not.toBe(b.propertyDetails);
  });
});
