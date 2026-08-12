import { describe, it, expect } from "vitest";
import { POST, respondWithReceipt } from "./route";

/**
 * Node-only unit tests for the lead BFF route (mirrors
 * `estimate/route.test.ts`): a POST with a valid consented body returns a 200
 * success envelope with a `leadId`; non-JSON, invalid schema (incl.
 * `consent: false`), bad `estimateId`, and invalid AU phone/email each return a
 * 400 error envelope; and the extracted `respondWithReceipt` returns a
 * controlled 500 on output-revalidation failure.
 */

const VALID_BODY = {
  estimateId: "est_0123456789abcdef",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "0412 345 678",
  contactMethod: "phone",
  bestTime: "morning",
  consent: true,
};

function postRequest(body: unknown, raw = false): Request {
  return new Request("http://localhost/api/v1/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("POST /api/v1/leads", () => {
  it("returns a success envelope with a leadId (happy path)", async () => {
    const res = await POST(postRequest(VALID_BODY));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.leadId).toMatch(/^lead_[0-9a-f]{16}$/);
    expect(body.requestId).toBeTruthy();
  });

  it("returns a 400 error envelope for a non-JSON body", async () => {
    const res = await POST(postRequest("not json{", true));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns a 400 error envelope when consent is false", async () => {
    const res = await POST(postRequest({ ...VALID_BODY, consent: false }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns a 400 error envelope for a bad estimateId format", async () => {
    const res = await POST(postRequest({ ...VALID_BODY, estimateId: "est_bad" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns a 400 error envelope for an invalid AU phone", async () => {
    const res = await POST(postRequest({ ...VALID_BODY, phone: "12345" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns a 400 error envelope for an invalid email", async () => {
    const res = await POST(postRequest({ ...VALID_BODY, email: "nope" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });
});

describe("respondWithReceipt (output re-validation failure branch)", () => {
  it("returns a controlled 500 error envelope when the receipt fails validation", async () => {
    const res = respondWithReceipt({ leadId: "" }, "req-test-123");
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("internal_error");
    expect(body.requestId).toBe("req-test-123");
  });

  it("returns a 200 success envelope for a valid receipt", async () => {
    const res = respondWithReceipt({ leadId: "lead_ok" }, "req-test-456");
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.leadId).toBe("lead_ok");
    expect(body.requestId).toBe("req-test-456");
  });
});
