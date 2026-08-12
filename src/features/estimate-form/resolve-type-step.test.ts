import { describe, it, expect } from 'vitest';
import { resolveTypeStep } from './resolve-type-step';
import type { FormConfig } from '@shared/schemas';

const configWith = (types: FormConfig['renovationTypes']): FormConfig => ({
  configVersion: 'reno-config-v1',
  renovationTypes: types,
  items: [],
  questions: [],
});

const okResult = (config: FormConfig) =>
  ({ ok: true as const, data: config, requestId: 'req-1' });

const failResult = () =>
  ({
    ok: false as const,
    error: { code: 'UPSTREAM', message: 'boom' },
    requestId: 'req-2',
  });

describe('resolveTypeStep', () => {
  it('maps a pending query (no data) to loading', () => {
    expect(resolveTypeStep({ data: undefined })).toEqual({ status: 'loading' });
  });

  it('maps an envelope failure to error', () => {
    expect(resolveTypeStep({ data: failResult() })).toEqual({ status: 'error' });
  });

  it('maps a thrown/isError query (no envelope) to error, not a stuck spinner', () => {
    expect(resolveTypeStep({ data: undefined, isError: true })).toEqual({
      status: 'error',
    });
    // isError with a (stale) failure envelope still resolves to error.
    expect(resolveTypeStep({ data: failResult(), isError: true })).toEqual({
      status: 'error',
    });
  });

  it('maps a loaded config with no renovation types to empty', () => {
    expect(resolveTypeStep({ data: okResult(configWith([])) })).toEqual({
      status: 'empty',
    });
  });

  it('maps a loaded config with types to ready with those types', () => {
    const types = [
      { id: 'internal', label: 'Internal' },
      { id: 'external', label: 'External' },
    ];
    expect(resolveTypeStep({ data: okResult(configWith(types)) })).toEqual({
      status: 'ready',
      types,
    });
  });
});
