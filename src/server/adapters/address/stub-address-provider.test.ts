import { describe, it, expect } from "vitest";
import { createStubAddressProvider } from "./stub-address-provider";

describe("stub address provider", () => {
  it("is deterministic across calls", async () => {
    const a = createStubAddressProvider();
    const b = createStubAddressProvider();
    const first = await a.suggest("George");
    const second = await b.suggest("George");
    expect(first).toEqual(second);
    expect(await a.resolve("au-addr-1")).toEqual(await b.resolve("au-addr-1"));
  });

  it("returns [] for queries under 3 characters (incl. whitespace-only)", async () => {
    const provider = createStubAddressProvider();
    expect(await provider.suggest("")).toEqual([]);
    expect(await provider.suggest("ge")).toEqual([]);
    expect(await provider.suggest("  a ")).toEqual([]);
  });

  it("filters predictions by case-insensitive substring on the label", async () => {
    const provider = createStubAddressProvider();
    const results = await provider.suggest("melbourne");
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      addressId: "au-addr-2",
      label: "200 Collins St, Melbourne VIC 3000",
    });

    const stMatches = await provider.suggest("St,");
    expect(stMatches.length).toBeGreaterThan(1);
  });

  it("resolves a known id to the structured address", async () => {
    const provider = createStubAddressProvider();
    const address = await provider.resolve("au-addr-1");
    expect(address).toEqual({
      street: "100 George St",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
      geo: { lat: -33.8615, lng: 151.2055 },
    });
  });

  it("resolves an unknown id to null", async () => {
    const provider = createStubAddressProvider();
    expect(await provider.resolve("does-not-exist")).toBeNull();
  });
});
