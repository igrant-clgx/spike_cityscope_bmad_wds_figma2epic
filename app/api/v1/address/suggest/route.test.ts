import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/v1/address/suggest", () => {
  it("returns a success envelope with matching predictions (happy path)", async () => {
    const res = await GET(new Request("http://localhost/api/v1/address/suggest?q=Sydney"));
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.requestId).toBeTruthy();
    expect(body.data.predictions).toEqual([
      { addressId: "au-addr-1", label: "100 George St, Sydney NSW 2000" },
    ]);
  });

  it("returns an empty prediction list for a short query (no error)", async () => {
    const res = await GET(new Request("http://localhost/api/v1/address/suggest?q=ge"));
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.predictions).toEqual([]);
  });

  it("returns an invalid_request error (HTTP 400) when q is missing", async () => {
    const res = await GET(new Request("http://localhost/api/v1/address/suggest"));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("invalid_request");
    expect(body.requestId).toBeTruthy();
  });
});
