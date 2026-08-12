import { describe, it, expect } from "vitest";
import { POST, respondWithEstimate } from "./route";

/**
 * Node-only unit tests for the estimate BFF route (mirrors
 * `address/resolve/route.test.ts`): a POST with a valid body returns a 200
 * success envelope; an invalid or non-JSON body returns a 400 error envelope
 * with `code: 'invalid_request'` and the engine is never called.
 */

function postRequest(body: unknown, raw = false): Request {
  return new Request("http://localhost/api/v1/estimate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("POST /api/v1/estimate", () => {
  it("returns a success envelope with the estimate fields (happy path)", async () => {
    const res = await POST(
      postRequest({ configVersion: "reno-config-v1", itemIds: ["kitchen", "bathroom"] }),
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.estimateId).toMatch(/^est_[0-9a-f]{16}$/);
    expect(body.data.costMin).toBeLessThanOrEqual(body.data.costMax);
    expect(body.data.confidence).toBe("medium");
    expect(body.requestId).toBeTruthy();
  });

  it("returns a 400 error envelope when configVersion is missing", async () => {
    const res = await POST(postRequest({ itemIds: ["kitchen"] }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns a 400 error envelope when itemIds is not an array", async () => {
    const res = await POST(
      postRequest({ configVersion: "v1", itemIds: "kitchen" }),
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns a 400 error envelope for a non-JSON body", async () => {
    const res = await POST(postRequest("not json{", true));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("invalid_request");
  });
});

describe("respondWithEstimate (output re-validation failure branch)", () => {
  it("returns a controlled 500 error envelope when the result fails validation", async () => {
    // A result that violates the output contract (costMin > costMax).
    const res = respondWithEstimate(
      { estimateId: "est_bad", costMin: 5, costMax: 1, confidence: "low" },
      "req-test-123",
    );
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("internal_error");
    expect(body.requestId).toBe("req-test-123");
  });

  it("returns a 200 success envelope for a valid result", async () => {
    const res = respondWithEstimate(
      { estimateId: "est_ok", costMin: 1, costMax: 5, confidence: "high" },
      "req-test-456",
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.estimateId).toBe("est_ok");
    expect(body.requestId).toBe("req-test-456");
  });
});
