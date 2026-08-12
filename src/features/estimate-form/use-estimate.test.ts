import { describe, it, expect, vi, afterEach } from 'vitest';
import { requestEstimate } from './use-estimate';

/**
 * Node-only unit test (no jsdom/RTL) of the estimate-request wiring. `global.fetch`
 * is stubbed with a `vi.fn`; asserts the estimate route URL + POST method and the
 * typed `EstimateResult` payload returned through `apiFetch`, and non-throwing
 * failure on an error envelope.
 */

const sampleResult = {
  estimateId: 'est_abc123',
  costMin: 1_000_000,
  costMax: 1_300_000,
  confidence: 'medium' as const,
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

describe('requestEstimate (client)', () => {
  it('POSTs to the same-origin estimate route', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({ ok: true, data: sampleResult, requestId: 'rid-est' }),
    );
    global.fetch = fetchMock as typeof fetch;

    await requestEstimate({ configVersion: 'reno-config-v1', itemIds: ['kitchen'] });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/v1/estimate');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({
      configVersion: 'reno-config-v1',
      itemIds: ['kitchen'],
    });
  });

  it('returns the typed estimate envelope on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({ ok: true, data: sampleResult, requestId: 'rid-est' }),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await requestEstimate({ configVersion: 'v1', itemIds: ['kitchen'] });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.estimateId).toBe('est_abc123');
      expect(result.data.confidence).toBe('medium');
      expect(result.requestId).toBe('rid-est');
    }
  });

  it('stays non-throwing and reports failure on an error envelope', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse(
        { ok: false, error: { code: 'invalid_request', message: 'boom' }, requestId: 'rid-err' },
        400,
      ),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await requestEstimate({ configVersion: 'v1', itemIds: [] });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_request');
    }
  });
});
