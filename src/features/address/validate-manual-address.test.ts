import { describe, it, expect } from 'vitest';
import { validateManualAddress } from './validate-manual-address';
import type { ManualAddressFields } from './validate-manual-address';
import {
  MANUAL_STREET_REQUIRED,
  MANUAL_SUBURB_REQUIRED,
  MANUAL_STATE_REQUIRED,
  MANUAL_POSTCODE_REQUIRED,
  MANUAL_POSTCODE_INVALID,
} from './copy';

const VALID_FIELDS: ManualAddressFields = {
  street: '100 George St',
  suburb: 'Sydney',
  state: 'NSW',
  postcode: '2000',
};

describe('validateManualAddress', () => {
  it('accepts a fully valid manual address and produces a ResolvedAddress WITHOUT geo', () => {
    const result = validateManualAddress(VALID_FIELDS);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.address).toEqual({
        street: '100 George St',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000',
      });
      expect('geo' in result.address).toBe(false);
    }
  });

  it('rejects a postcode that is not 4 digits', () => {
    const result = validateManualAddress({ ...VALID_FIELDS, postcode: '200' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.postcode).toBe(MANUAL_POSTCODE_INVALID);
      expect(result.errors.street).toBeUndefined();
    }
  });

  it('rejects a blank postcode with a required message', () => {
    const result = validateManualAddress({ ...VALID_FIELDS, postcode: '   ' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.postcode).toBe(MANUAL_POSTCODE_REQUIRED);
    }
  });

  it('rejects a state outside the AU enum (including unset)', () => {
    const bad = validateManualAddress({ ...VALID_FIELDS, state: 'XYZ' });
    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(bad.errors.state).toBe(MANUAL_STATE_REQUIRED);
    }
    const unset = validateManualAddress({ ...VALID_FIELDS, state: '' });
    expect(unset.ok).toBe(false);
    if (!unset.ok) {
      expect(unset.errors.state).toBe(MANUAL_STATE_REQUIRED);
    }
  });

  it('rejects blank required street/suburb', () => {
    const result = validateManualAddress({
      ...VALID_FIELDS,
      street: '   ',
      suburb: '',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.street).toBe(MANUAL_STREET_REQUIRED);
      expect(result.errors.suburb).toBe(MANUAL_SUBURB_REQUIRED);
    }
  });

  it('trims surrounding whitespace from all fields before building the address', () => {
    const result = validateManualAddress({
      street: '  12 Main Rd  ',
      suburb: '  Melbourne ',
      state: '  VIC ',
      postcode: '  3000 ',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.address).toEqual({
        street: '12 Main Rd',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
      });
    }
  });

  it('never throws for arbitrary field content', () => {
    expect(() =>
      validateManualAddress({ street: '', suburb: '', state: '', postcode: '' }),
    ).not.toThrow();
  });
});
