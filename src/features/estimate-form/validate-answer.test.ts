import { describe, it, expect } from 'vitest';
import { validateAnswer } from './validate-answer';
import type { PropertyQuestion } from '@shared/schemas';

const base = { label: 'Q', appliesToItemIds: undefined } as const;

describe('validateAnswer', () => {
  describe('radio', () => {
    const required: PropertyQuestion = {
      ...base,
      id: 'r',
      required: true,
      kind: 'radio',
      options: [{ value: 'a', label: 'A' }],
    };
    const optional: PropertyQuestion = { ...required, required: false };

    it('flags a required empty value', () => {
      expect(validateAnswer(required, '')).toBe('This field is required.');
      expect(validateAnswer(required, undefined)).toBe('This field is required.');
    });
    it('accepts a chosen option', () => {
      expect(validateAnswer(required, 'a')).toBeNull();
    });
    it('allows an optional empty value', () => {
      expect(validateAnswer(optional, '')).toBeNull();
    });
    it('flags a value that is not one of the options', () => {
      expect(validateAnswer(required, 'zzz')).toBe('Choose a valid option.');
      expect(validateAnswer(optional, 'zzz')).toBe('Choose a valid option.');
    });
  });

  describe('select', () => {
    const q: PropertyQuestion = {
      ...base,
      id: 's',
      required: true,
      kind: 'select',
      options: [{ value: 'a', label: 'A' }],
    };
    it('flags required empty', () => {
      expect(validateAnswer(q, null)).toBe('This field is required.');
    });
    it('accepts a value', () => {
      expect(validateAnswer(q, 'a')).toBeNull();
    });
    it('flags a value not among the options', () => {
      expect(validateAnswer(q, 'nope')).toBe('Choose a valid option.');
    });
  });

  describe('text', () => {
    const q: PropertyQuestion = {
      ...base,
      id: 't',
      required: true,
      kind: 'text',
      maxLength: 5,
    };
    it('flags required empty', () => {
      expect(validateAnswer(q, '')).toBe('This field is required.');
    });
    it('flags a whitespace-only required value as empty', () => {
      expect(validateAnswer(q, '   ')).toBe('This field is required.');
    });
    it('flags over maxLength', () => {
      expect(validateAnswer(q, 'abcdef')).toBe('Use 5 characters or fewer.');
    });
    it('accepts within maxLength', () => {
      expect(validateAnswer(q, 'abc')).toBeNull();
    });
    it('allows optional empty when not required', () => {
      expect(validateAnswer({ ...q, required: false }, '')).toBeNull();
    });
  });

  describe('numeric', () => {
    const q: PropertyQuestion = {
      ...base,
      id: 'n',
      required: true,
      kind: 'numeric',
      min: 1,
      max: 10,
    };
    it('flags required empty', () => {
      expect(validateAnswer(q, undefined)).toBe('This field is required.');
    });
    it('flags below min', () => {
      expect(validateAnswer(q, 0)).toBe('Enter 1 or more.');
    });
    it('flags above max', () => {
      expect(validateAnswer(q, 11)).toBe('Enter 10 or less.');
    });
    it('accepts within bounds', () => {
      expect(validateAnswer(q, 5)).toBeNull();
    });
  });

  describe('slider', () => {
    const q: PropertyQuestion = {
      ...base,
      id: 'sl',
      required: true,
      kind: 'slider',
      min: 0,
      max: 100,
    };
    it('flags required empty', () => {
      expect(validateAnswer(q, undefined)).toBe('This field is required.');
    });
    it('flags below min', () => {
      expect(validateAnswer(q, -5)).toBe('Enter 0 or more.');
    });
    it('flags above max', () => {
      expect(validateAnswer(q, 150)).toBe('Enter 100 or less.');
    });
    it('accepts within bounds', () => {
      expect(validateAnswer(q, 50)).toBeNull();
    });
  });

  describe('date', () => {
    const q: PropertyQuestion = {
      ...base,
      id: 'd',
      required: true,
      kind: 'date',
      minIso: '2026-01-01',
      maxIso: '2026-12-31',
    };
    it('flags required empty', () => {
      expect(validateAnswer(q, '')).toBe('This field is required.');
    });
    it('flags before minIso', () => {
      expect(validateAnswer(q, '2025-12-31')).toBe(
        'Enter a date on or after 2026-01-01.',
      );
    });
    it('flags after maxIso', () => {
      expect(validateAnswer(q, '2027-01-01')).toBe(
        'Enter a date on or before 2026-12-31.',
      );
    });
    it('accepts within bounds', () => {
      expect(validateAnswer(q, '2026-06-15')).toBeNull();
    });
    it('flags a malformed date (no bounds) before checking range', () => {
      const noBounds: PropertyQuestion = {
        ...base,
        id: 'd2',
        required: true,
        kind: 'date',
      };
      expect(validateAnswer(noBounds, 'not-a-date')).toBe('Enter a valid date.');
      expect(validateAnswer(noBounds, '2026-13-40')).toBe('Enter a valid date.');
    });
  });

  describe('budget', () => {
    const q: PropertyQuestion = {
      ...base,
      id: 'b',
      required: true,
      kind: 'budget',
      min: 0,
      max: 1000,
    };
    it('flags required missing value', () => {
      expect(validateAnswer(q, undefined)).toBe('This field is required.');
    });
    it('flags below bounds', () => {
      expect(validateAnswer(q, { min: -5, max: 500 })).toBe('Enter 0 or more.');
    });
    it('flags above bounds', () => {
      expect(validateAnswer(q, { min: 100, max: 2000 })).toBe(
        'Enter 1000 or less.',
      );
    });
    it('flags min greater than max', () => {
      expect(validateAnswer(q, { min: 800, max: 200 })).toBe(
        'Minimum must be at most the maximum.',
      );
    });
    it('accepts a valid range', () => {
      expect(validateAnswer(q, { min: 100, max: 500 })).toBeNull();
    });
    it('allows optional missing value', () => {
      expect(validateAnswer({ ...q, required: false }, undefined)).toBeNull();
    });
    it('flags a partial fill (only min) regardless of required', () => {
      expect(validateAnswer(q, { min: 100, max: undefined })).toBe(
        'Enter both a minimum and a maximum.',
      );
      expect(
        validateAnswer({ ...q, required: false }, { min: 100, max: undefined }),
      ).toBe('Enter both a minimum and a maximum.');
    });
    it('flags a partial fill (only max) regardless of required', () => {
      expect(validateAnswer(q, { min: undefined, max: 500 })).toBe(
        'Enter both a minimum and a maximum.',
      );
      expect(
        validateAnswer({ ...q, required: false }, { min: undefined, max: 500 }),
      ).toBe('Enter both a minimum and a maximum.');
    });
    it('treats an all-empty budget by the required/optional rule', () => {
      expect(validateAnswer(q, { min: undefined, max: undefined })).toBe(
        'This field is required.',
      );
      expect(
        validateAnswer(
          { ...q, required: false },
          { min: undefined, max: undefined },
        ),
      ).toBeNull();
    });
  });
});
