import { describe, it, expect } from 'vitest';
import { resolveItemsStep } from './resolve-items-step';
import type { FormConfig, RenovationItem } from '@shared/schemas';

const ITEMS: RenovationItem[] = [
  { id: 'kitchen', typeId: 'internal', label: 'Kitchen' },
  { id: 'roofing', typeId: 'external', label: 'Roofing' },
];

const config = (items: RenovationItem[]): FormConfig => ({
  configVersion: 'reno-config-v1',
  renovationTypes: [
    { id: 'internal', label: 'Internal' },
    { id: 'external', label: 'External' },
  ],
  items,
  questions: [],
});

const ok = (cfg: FormConfig) => ({ ok: true as const, data: cfg, requestId: 'r1' });
const fail = () => ({
  ok: false as const,
  error: { code: 'UPSTREAM', message: 'boom' },
  requestId: 'r2',
});

describe('resolveItemsStep', () => {
  it('returns no-type when no renovation type is chosen (even while pending)', () => {
    expect(resolveItemsStep({ data: undefined }, null)).toEqual({ status: 'no-type' });
    expect(resolveItemsStep({ data: ok(config(ITEMS)) }, null)).toEqual({
      status: 'no-type',
    });
  });

  it('returns error for a thrown/isError query before pending', () => {
    expect(resolveItemsStep({ data: undefined, isError: true }, 'internal')).toEqual({
      status: 'error',
    });
  });

  it('returns loading while the query is pending with a type chosen', () => {
    expect(resolveItemsStep({ data: undefined }, 'internal')).toEqual({
      status: 'loading',
    });
  });

  it('returns error on an envelope failure', () => {
    expect(resolveItemsStep({ data: fail() }, 'internal')).toEqual({ status: 'error' });
  });

  it('returns empty when no config items match the chosen type', () => {
    expect(resolveItemsStep({ data: ok(config([])) }, 'internal')).toEqual({
      status: 'empty',
    });
  });

  it('returns ready with only the matching items', () => {
    const view = resolveItemsStep({ data: ok(config(ITEMS)) }, 'internal');
    expect(view.status).toBe('ready');
    expect(view.status === 'ready' && view.items.map((i) => i.id)).toEqual(['kitchen']);
  });
});
