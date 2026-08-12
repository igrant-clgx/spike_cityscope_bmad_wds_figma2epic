import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolveAddressRequest } from './use-address-resolve';

/**
 * Node-only unit test (no jsdom/RTL) of the resolve wiring. `global.fetch` is
 * stubbed with a `vi.fn` returning a well-formed success envelope; asserts the
 * resolve route URL (with the encoded addressId) and the structured
 * `ResolvedAddress` shape returned through `apiFetch`.
 */
const sampleAddress = {
  street: '100 George St',
  suburb: 'Sydney',
  state: 'NSW' as const,
  postcode: '2000',
  geo: { lat: -33.8615, lng: 151.2055 },
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

describe('resolveAddressRequest', () => {
  it('calls the same-origin resolve route with the encoded addressId', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({
        ok: true,
        data: { address: sampleAddress },
        requestId: 'rid-resolve',
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    await resolveAddressRequest('abc 123');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/v1/address/resolve?addressId=abc%20123');
  });

  it('returns the structured resolved address on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse({
        ok: true,
        data: { address: sampleAddress },
        requestId: 'rid-resolve',
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await resolveAddressRequest('addr-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.address).toEqual(sampleAddress);
      expect(result.requestId).toBe('rid-resolve');
    }
  });

  it('stays non-throwing and reports failure on an error envelope', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      envelopeResponse(
        {
          ok: false,
          error: { code: 'not_found', message: 'address not found' },
          requestId: 'rid-404',
        },
        404,
      ),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await resolveAddressRequest('missing');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('not_found');
    }
  });
});
