import { describe, it, expect } from 'vitest';
import { resolveDetailsStep } from './resolve-details-step';
import type { FormConfig, PropertyQuestion } from '@shared/schemas';

const QUESTIONS: PropertyQuestion[] = [
  { id: 'q-always', label: 'Always', required: false, kind: 'text' },
  {
    id: 'q-kitchen',
    label: 'Kitchen',
    required: false,
    kind: 'text',
    appliesToItemIds: ['kitchen'],
  },
];

const config = (questions: PropertyQuestion[]): FormConfig => ({
  configVersion: 'reno-config-v1',
  renovationTypes: [{ id: 'internal', label: 'Internal' }],
  items: [{ id: 'kitchen', typeId: 'internal', label: 'Kitchen' }],
  questions,
});

const ok = (cfg: FormConfig) => ({ ok: true as const, data: cfg, requestId: 'r1' });
const fail = () => ({
  ok: false as const,
  error: { code: 'UPSTREAM', message: 'boom' },
  requestId: 'r2',
});

describe('resolveDetailsStep', () => {
  it('returns no-items when nothing is selected (even while pending)', () => {
    expect(resolveDetailsStep({ data: undefined }, [])).toEqual({
      status: 'no-items',
    });
    expect(resolveDetailsStep({ data: ok(config(QUESTIONS)) }, [])).toEqual({
      status: 'no-items',
    });
  });

  it('returns error for a thrown/isError query before pending', () => {
    expect(
      resolveDetailsStep({ data: undefined, isError: true }, ['kitchen']),
    ).toEqual({ status: 'error' });
  });

  it('returns loading while pending with items chosen', () => {
    expect(resolveDetailsStep({ data: undefined }, ['kitchen'])).toEqual({
      status: 'loading',
    });
  });

  it('returns error on an envelope failure', () => {
    expect(resolveDetailsStep({ data: fail() }, ['kitchen'])).toEqual({
      status: 'error',
    });
  });

  it('returns empty when no question applies to the selection', () => {
    expect(
      resolveDetailsStep({ data: ok(config([QUESTIONS[1]])) }, ['bathroom']),
    ).toEqual({ status: 'empty' });
  });

  it('returns ready with the filtered questions', () => {
    const view = resolveDetailsStep({ data: ok(config(QUESTIONS)) }, ['kitchen']);
    expect(view.status).toBe('ready');
    expect(view.status === 'ready' && view.questions.map((q) => q.id)).toEqual([
      'q-always',
      'q-kitchen',
    ]);
  });
});
