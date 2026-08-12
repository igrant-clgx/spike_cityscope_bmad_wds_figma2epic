import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/v1/address/resolve", () => {
  it("returns a success envelope with the structured address (happy path)", async () => {
    const res = await GET(
      new Request("http://localhost/api/v1/address/resolve?addressId=au-addr-1"),
    );
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.address).toEqual({
      street: "100 George St",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
      geo: { lat: -33.8615, lng: 151.2055 },
    });
  });

  it("returns a not_found error for an unknown id", async () => {
    const res = await GET(
      new Request("http://localhost/api/v1/address/resolve?addressId=nope"),
    );
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("not_found");
  });

  it("returns an invalid_request error (HTTP 400) when addressId is missing", async () => {
    const res = await GET(new Request("http://localhost/api/v1/address/resolve"));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("invalid_request");
  });

  it("treats a blank addressId as invalid_request, not not_found", async () => {
    const res = await GET(
      new Request("http://localhost/api/v1/address/resolve?addressId=%20%20"),
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("invalid_request");
  });

  it("returns HTTP 404 for an unknown id", async () => {
    const res = await GET(
      new Request("http://localhost/api/v1/address/resolve?addressId=nope-2"),
    );
    expect(res.status).toBe(404);
  });
});
