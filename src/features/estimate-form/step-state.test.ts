import { describe, it, expect } from 'vitest';
import {
  STEP_ORDER,
  STEP_META,
  isStepComplete,
  nextExpanded,
  type StepId,
} from './step-state';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';

describe('STEP_ORDER / STEP_META', () => {
  it('orders the three steps type → items → details', () => {
    expect(STEP_ORDER).toEqual(['type', 'items', 'details']);
  });

  it('assigns a title and sequential index to every step', () => {
    STEP_ORDER.forEach((id, index) => {
      expect(STEP_META[id].id).toBe(id);
      expect(STEP_META[id].index).toBe(index);
      expect(STEP_META[id].title.length).toBeGreaterThan(0);
    });
  });
});

describe('isStepComplete', () => {
  const base = stepFormDefaults();

  it('type: complete iff renovationTypeId is a meaningful (non-blank) value', () => {
    expect(isStepComplete('type', base)).toBe(false);
    expect(isStepComplete('type', { ...base, renovationTypeId: 'internal' })).toBe(true);
    // Blank / whitespace-only ids are not a real selection.
    expect(isStepComplete('type', { ...base, renovationTypeId: '' })).toBe(false);
    expect(isStepComplete('type', { ...base, renovationTypeId: '   ' })).toBe(false);
  });

  it('items: complete iff at least one item selected', () => {
    expect(isStepComplete('items', base)).toBe(false);
    expect(isStepComplete('items', { ...base, selectedItemIds: [] })).toBe(false);
    expect(isStepComplete('items', { ...base, selectedItemIds: ['kitchen'] })).toBe(true);
  });

  it('details: complete iff at least one property detail holds a meaningful answer', () => {
    expect(isStepComplete('details', base)).toBe(false);
    expect(isStepComplete('details', { ...base, propertyDetails: {} })).toBe(false);
    expect(isStepComplete('details', { ...base, propertyDetails: { bedrooms: 3 } })).toBe(true);
    expect(isStepComplete('details', { ...base, propertyDetails: { area: { min: 0, max: 5 } } })).toBe(true);
    // A key with a blank value does not count as answered.
    expect(isStepComplete('details', { ...base, propertyDetails: { notes: '' } })).toBe(false);
  });

  it('tolerates a partial values object (missing slots read as empty)', () => {
    expect(isStepComplete('items', {})).toBe(false);
    expect(isStepComplete('details', {})).toBe(false);
    expect(isStepComplete('type', {})).toBe(false);
  });

  it('unknown step id returns false', () => {
    expect(isStepComplete('nope' as StepId, base)).toBe(false);
  });
});

describe('nextExpanded (exactly-one-expanded invariant)', () => {
  it('keeps the step open when the currently open step is re-toggled (never collapses to zero)', () => {
    expect(nextExpanded('type', 'type')).toBe('type');
    expect(nextExpanded('items', 'items')).toBe('items');
  });

  it('switches to the target when a different step is toggled', () => {
    expect(nextExpanded('type', 'items')).toBe('items');
    expect(nextExpanded('items', 'details')).toBe('details');
  });

  it('ignores an unknown target id (keeps the current step)', () => {
    expect(nextExpanded('type', 'nope' as StepId)).toBe('type');
  });

  it('always yields exactly one valid step (no null, no union)', () => {
    STEP_ORDER.forEach((current) => {
      STEP_ORDER.forEach((target) => {
        const result = nextExpanded(current, target);
        expect(STEP_ORDER.includes(result)).toBe(true);
      });
    });
  });
});

// Type-only smoke: StepFormValues shape used by the predicate.
const _typeCheck: StepFormValues = stepFormDefaults();
void _typeCheck;
