import { describe, it, expect } from 'vitest';
import { filterQuestions } from './question-selection';
import type { PropertyQuestion } from '@shared/schemas';

const text = (
  id: string,
  appliesToItemIds?: string[],
): PropertyQuestion => ({
  id,
  label: id,
  required: false,
  kind: 'text',
  ...(appliesToItemIds ? { appliesToItemIds } : {}),
});

describe('filterQuestions', () => {
  it('always shows a question with no appliesToItemIds', () => {
    const q = text('q1');
    expect(filterQuestions([q], [])).toEqual([q]);
    expect(filterQuestions([q], ['kitchen'])).toEqual([q]);
  });

  it('always shows a question with an empty appliesToItemIds array', () => {
    const q = text('q1', []);
    expect(filterQuestions([q], [])).toEqual([q]);
  });

  it('shows a question whose appliesToItemIds intersects the selection', () => {
    const q = text('q1', ['kitchen', 'bathroom']);
    expect(filterQuestions([q], ['bathroom'])).toEqual([q]);
  });

  it('hides a question whose appliesToItemIds is disjoint from the selection', () => {
    const q = text('q1', ['kitchen']);
    expect(filterQuestions([q], ['roofing'])).toEqual([]);
  });

  it('hides a scoped question when nothing is selected', () => {
    const q = text('q1', ['kitchen']);
    expect(filterQuestions([q], [])).toEqual([]);
  });

  it('filters a mixed set, preserving order', () => {
    const always = text('always');
    const kitchen = text('kitchen-q', ['kitchen']);
    const roof = text('roof-q', ['roofing']);
    expect(filterQuestions([always, kitchen, roof], ['kitchen'])).toEqual([
      always,
      kitchen,
    ]);
  });
});
