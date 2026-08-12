import { describe, it, expect, vi, afterEach } from "vitest";
import { z } from "zod";
import { apiFetch } from "./api-client";

/**
 * Pure-logic unit tests (node-env, no jsdom) covering EVERY I/O-matrix row for
 * the non-throwing envelope caller. `global.fetch` is stubbed with a `vi.fn`
 * and `backoffMs: 0` is injected so retries run instantly.
 */

const dataSchema = z.object({ value: z.number() });
const FAST = { backoffMs: 0 };

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response;
}

function textResponse(body: string, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiFetch", () => {
  it("happy path: 200 + valid success envelope → success result", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ ok: true, data: { value: 42 }, requestId: "rid-1" }),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.value).toBe(42);
      expect(result.requestId).toBe("rid-1");
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("well-formed error envelope → error result, NOT retried", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        ok: false,
        error: { code: "bad_input", message: "nope" },
        requestId: "rid-2",
      }),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("bad_input");
      expect(result.requestId).toBe("rid-2");
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("network error → retried then error result with a requestId", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("boom"));
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("network_error");
      expect(result.requestId).toBeTruthy();
    }
    // 1 initial + 2 retries = 3 attempts.
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("network error that recovers on retry → success result", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("boom"))
      .mockResolvedValueOnce(
        jsonResponse({ ok: true, data: { value: 7 }, requestId: "rid-3" }),
      );
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("5xx status → retried then error result", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 503));
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("server_error");
      expect(result.requestId).toBeTruthy();
    }
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("4xx non-envelope → error result, NOT retried", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 400));
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_response");
      expect(result.requestId).toBeTruthy();
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("non-JSON body → invalid_response, not thrown, NOT retried", async () => {
    const fetchMock = vi.fn().mockResolvedValue(textResponse("<html>oops</html>", 200));
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_response");
      expect(result.requestId).toBeTruthy();
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("non-envelope JSON → invalid_response via safeParse, NOT retried", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ foo: 1 }, 200));
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_response");
      expect(result.requestId).toBeTruthy();
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("5xx carrying a valid error envelope → returns it, NOT retried", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        { ok: false, error: { code: "upstream_down", message: "later" }, requestId: "rid-5xx" },
        503,
      ),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("upstream_down");
      expect(result.requestId).toBe("rid-5xx");
    }
    // Honoured immediately — the server's error envelope is not a transient failure.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("non-2xx carrying a success-shaped envelope → http_error, not reported as success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ ok: true, data: { value: 1 }, requestId: "rid-4xx" }, 404),
    );
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("http_error");
      expect(result.requestId).toBe("rid-4xx");
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("non-JSON 5xx body → server_error, retried (transient)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(textResponse("<html>502</html>", 502));
    global.fetch = fetchMock as typeof fetch;

    const result = await apiFetch("/x", dataSchema, undefined, FAST);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("server_error");
    }
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
