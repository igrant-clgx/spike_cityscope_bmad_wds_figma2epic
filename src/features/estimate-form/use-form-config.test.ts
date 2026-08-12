import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchFormConfig } from './use-form-config';

/**
 * Node-only unit test (no jsdom/RTL) of the config-fetch wiring. `global.fetch`
 * is stubbed with a `vi.fn` returning a well-formed success envelope; asserts
 * the config route URL and the typed `FormConfig` payload returned through
 * `apiFetch`.
 */
const sampleConfig = {
  configVersion: 'reno-config-v1',
  renovationTypes: [{ id: 'internal', label: 'Internal' }],
  items: [{ id: 'kitchen', typeId: 'internal', label: 'Kitchen' }],
  questions: [
    {
      id: 'property-type',
      kind: 'radio' as const,
      label: 'Property type',
      required: true,
      options: [{ value: 'house', label: 'House' }],
    },
  ],
};

function envelopeResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchFormConfig', () => {
  it('calls the same-origin config route', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({
        ok: true,
        data: sampleConfig,
        requestId: 'rid-config',
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    await fetchFormConfig();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/v1/config/form');
  });

  it('returns the typed form-config envelope on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({
        ok: true,
        data: sampleConfig,
        requestId: 'rid-config',
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await fetchFormConfig();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.configVersion).toBe('reno-config-v1');
      expect(result.data.renovationTypes).toEqual([
        { id: 'internal', label: 'Internal' },
      ]);
      expect(result.requestId).toBe('rid-config');
    }
  });

  it('stays non-throwing and reports failure on an error envelope', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse(
        {
          ok: false,
          error: { code: 'server_error', message: 'boom' },
          requestId: 'rid-err',
        },
        500,
      ),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await fetchFormConfig();

    expect(result.ok).toBe(false);
  });
});
