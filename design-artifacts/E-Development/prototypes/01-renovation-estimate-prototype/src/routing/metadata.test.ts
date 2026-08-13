import { describe, expect, it } from "vitest";
import { DETAILS_ROUTE, RESULT_ROUTE, SEARCH_ROUTE } from "./guards";
import { getRouteMetadata } from "./metadata";

describe("route metadata", () => {
  it("indexes only the public search entry route", () => {
    expect(getRouteMetadata(SEARCH_ROUTE).robots).toBe("index, follow");
    expect(getRouteMetadata(DETAILS_ROUTE).robots).toBe("noindex, nofollow");
    expect(getRouteMetadata(RESULT_ROUTE).robots).toBe("noindex, nofollow");
    expect(getRouteMetadata("/unknown").robots).toBe("noindex, nofollow");
  });
});
