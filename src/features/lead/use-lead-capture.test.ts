import { describe, it, expect, vi, afterEach } from 'vitest';
import { requestLeadCapture } from './use-lead-capture';
import type { LeadCaptureRequest } from '@shared/schemas';

/**
 * Node-only unit test (no jsdom/RTL) of the lead-capture wiring. `global.fetch`
 * is stubbed with a `vi.fn`; asserts the lead route URL + POST method and the
 * typed `LeadReceipt` payload returned through `apiFetch`, and non-throwing
 * failure on an error envelope (mirror of `use-estimate.test.ts`).
 */

const sampleRequest: LeadCaptureRequest = {
  estimateId: 'est_0123456789abcdef',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '0412345678',
  contactMethod: 'phone',
  consent: true,
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

describe('requestLeadCapture (client)', () => {
  it('POSTs to the same-origin lead route with the Idempotency-Key header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({ ok: true, data: { leadId: 'lead_abc' }, requestId: 'rid-lead' }),
    );
    global.fetch = fetchMock as typeof fetch;

    await requestLeadCapture(sampleRequest, 'idem-key-1');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/v1/leads');
    expect(init.method).toBe('POST');
    expect(init.headers['Idempotency-Key']).toBe('idem-key-1');
    expect(JSON.parse(init.body)).toEqual(sampleRequest);
  });

  it('does NOT auto-retry a 5xx (stateful POST, maxRetries: 0)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse('upstream boom', 503),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await requestLeadCapture(sampleRequest, 'idem-key-2');

    // Called exactly once — a transient 5xx must NOT be silently retried.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(false);
  });

  it('returns the typed lead receipt on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({ ok: true, data: { leadId: 'lead_abc' }, requestId: 'rid-lead' }),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await requestLeadCapture(sampleRequest, 'idem-key-3');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.leadId).toBe('lead_abc');
      expect(result.requestId).toBe('rid-lead');
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

    const result = await requestLeadCapture(sampleRequest, 'idem-key-4');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_request');
    }
  });
});
