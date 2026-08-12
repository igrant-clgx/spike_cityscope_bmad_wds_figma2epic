import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/v1/config/form", () => {
  it("returns a success envelope with the versioned form config", async () => {
    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.requestId).toBeTruthy();
    expect(body.data.configVersion).toBeTruthy();
    expect(Array.isArray(body.data.renovationTypes)).toBe(true);
    expect(Array.isArray(body.data.items)).toBe(true);
    expect(Array.isArray(body.data.questions)).toBe(true);
    expect(body.data.renovationTypes.length).toBeGreaterThan(0);
  });
});
