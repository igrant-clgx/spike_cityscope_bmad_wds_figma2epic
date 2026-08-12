import { describe, it, expect } from 'vitest';
import { leadCaptureRequestSchema } from '@shared/schemas';
import {
  type LeadFormValues,
  leadFormDefaults,
  leadFormFieldErrors,
  isLeadFormSubmittable,
  toLeadRequestFields,
} from './lead-form-values';
import {
  FIRST_NAME_ERROR,
  LAST_NAME_ERROR,
  EMAIL_ERROR,
  PHONE_ERROR,
  CONTACT_METHOD_ERROR,
  BEST_TIME_ERROR,
  CONSENT_ERROR,
} from './lead-form-copy';

/** A fully-valid baseline; individual cases mutate one field to exercise a rule. */
function validValues(overrides: Partial<LeadFormValues> = {}): LeadFormValues {
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '0412 345 678',
    contactMethod: 'phone',
    bestTime: 'morning',
    consent: true,
    ...overrides,
  };
}

describe('leadFormDefaults', () => {
  it('starts every field empty/unset and consent false', () => {
    expect(leadFormDefaults()).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      contactMethod: '',
      bestTime: '',
      consent: false,
    });
  });
});

describe('leadFormFieldErrors (pure)', () => {
  it('reports errors on a pristine form regardless of touched-state', () => {
    const errors = leadFormFieldErrors(leadFormDefaults());
    expect(errors.firstName).toBe(FIRST_NAME_ERROR);
    expect(errors.lastName).toBe(LAST_NAME_ERROR);
    expect(errors.email).toBe(EMAIL_ERROR);
    expect(errors.phone).toBe(PHONE_ERROR);
    expect(errors.contactMethod).toBe(CONTACT_METHOD_ERROR);
    expect(errors.consent).toBe(CONSENT_ERROR);
    // bestTime empty is optional → no error.
    expect(errors.bestTime).toBeUndefined();
  });

  it('returns an empty object when all rules pass', () => {
    expect(leadFormFieldErrors(validValues())).toEqual({});
  });

  it('flags a too-short first name and only that field', () => {
    const errors = leadFormFieldErrors(validValues({ firstName: 'J' }));
    expect(errors).toEqual({ firstName: FIRST_NAME_ERROR });
  });

  it('flags a too-short last name', () => {
    const errors = leadFormFieldErrors(validValues({ lastName: 'D' }));
    expect(errors).toEqual({ lastName: LAST_NAME_ERROR });
  });

  it('flags an over-length name (>100 chars)', () => {
    const long = 'a'.repeat(101);
    expect(leadFormFieldErrors(validValues({ firstName: long }))).toEqual({
      firstName: FIRST_NAME_ERROR,
    });
  });

  it('trims whitespace-only names to an error', () => {
    expect(leadFormFieldErrors(validValues({ firstName: '   ' }))).toEqual({
      firstName: FIRST_NAME_ERROR,
    });
  });

  it('flags an invalid email', () => {
    expect(leadFormFieldErrors(validValues({ email: 'nope' }))).toEqual({
      email: EMAIL_ERROR,
    });
  });

  it('flags an invalid AU phone', () => {
    expect(leadFormFieldErrors(validValues({ phone: '12345' }))).toEqual({
      phone: PHONE_ERROR,
    });
  });

  it('accepts +61 and spaced AU phone forms', () => {
    expect(leadFormFieldErrors(validValues({ phone: '+61 412 345 678' }))).toEqual(
      {},
    );
    expect(leadFormFieldErrors(validValues({ phone: '02 9876 5432' }))).toEqual({});
  });

  it('requires a contact method', () => {
    expect(leadFormFieldErrors(validValues({ contactMethod: '' }))).toEqual({
      contactMethod: CONTACT_METHOD_ERROR,
    });
  });

  it('accepts an empty (unset) bestTime as valid/optional', () => {
    expect(leadFormFieldErrors(validValues({ bestTime: '' }))).toEqual({});
  });

  it('rejects a non-empty invalid bestTime', () => {
    const errors = leadFormFieldErrors(
      validValues({ bestTime: 'midnight' as LeadFormValues['bestTime'] }),
    );
    expect(errors).toEqual({ bestTime: BEST_TIME_ERROR });
  });

  it('flags consent when false', () => {
    expect(leadFormFieldErrors(validValues({ consent: false }))).toEqual({
      consent: CONSENT_ERROR,
    });
  });
});

describe('isLeadFormSubmittable (pure gate)', () => {
  it('is false on a pristine form', () => {
    expect(isLeadFormSubmittable(leadFormDefaults())).toBe(false);
  });

  it('is false when all fields valid but consent unchecked', () => {
    expect(isLeadFormSubmittable(validValues({ consent: false }))).toBe(false);
  });

  it('is true when all required fields valid AND consent checked', () => {
    expect(isLeadFormSubmittable(validValues())).toBe(true);
  });

  it('is true with bestTime omitted (optional)', () => {
    expect(isLeadFormSubmittable(validValues({ bestTime: '' }))).toBe(true);
  });

  it('is false when any single required field is invalid', () => {
    expect(isLeadFormSubmittable(validValues({ email: 'nope' }))).toBe(false);
    expect(isLeadFormSubmittable(validValues({ phone: '12345' }))).toBe(false);
    expect(isLeadFormSubmittable(validValues({ firstName: 'J' }))).toBe(false);
    expect(isLeadFormSubmittable(validValues({ contactMethod: '' }))).toBe(false);
  });
});

describe('toLeadRequestFields (schema-ready adapter)', () => {
  const STUB_ESTIMATE_ID = 'est_0123456789abcdef';

  it('returns null when the form is not submittable', () => {
    expect(toLeadRequestFields(leadFormDefaults())).toBeNull();
    expect(toLeadRequestFields(validValues({ consent: false }))).toBeNull();
  });

  it('OMITS bestTime (never emits the empty-string sentinel) when unset', () => {
    const fields = toLeadRequestFields(validValues({ bestTime: '' }));
    expect(fields).not.toBeNull();
    expect(fields && 'bestTime' in fields).toBe(false);
  });

  it('includes a chosen bestTime', () => {
    const fields = toLeadRequestFields(validValues({ bestTime: 'evening' }));
    expect(fields?.bestTime).toBe('evening');
  });

  it('emits fields that satisfy leadCaptureRequestSchema once estimateId is joined (no client/server drift)', () => {
    for (const bestTime of ['', 'morning', 'anytime'] as const) {
      const fields = toLeadRequestFields(validValues({ bestTime }));
      expect(fields).not.toBeNull();
      const parsed = leadCaptureRequestSchema.safeParse({
        ...fields,
        estimateId: STUB_ESTIMATE_ID,
      });
      expect(parsed.success).toBe(true);
    }
  });
});
