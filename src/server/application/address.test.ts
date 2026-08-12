import { describe, it, expect, vi } from "vitest";
import { suggestAddresses, resolveAddress } from "./address";
import type {
  AddressPrediction,
  AddressProvider,
  ResolvedAddress,
} from "@server/domain/ports/address-provider";

const SAMPLE_PREDICTION: AddressPrediction = {
  addressId: "au-addr-1",
  label: "100 George St, Sydney NSW 2000",
};

const SAMPLE_ADDRESS: ResolvedAddress = {
  street: "100 George St",
  suburb: "Sydney",
  state: "NSW",
  postcode: "2000",
  geo: { lat: -33.8615, lng: 151.2055 },
};

function fakeProvider(overrides: Partial<AddressProvider> = {}): AddressProvider {
  return {
    suggest: vi.fn().mockResolvedValue([SAMPLE_PREDICTION]),
    resolve: vi.fn().mockResolvedValue(SAMPLE_ADDRESS),
    ...overrides,
  };
}

describe("suggestAddresses", () => {
  it("delegates to the provider for a ≥3-char query (happy path)", async () => {
    const provider = fakeProvider();
    const result = await suggestAddresses(provider, "George");
    expect(result).toEqual([SAMPLE_PREDICTION]);
    expect(provider.suggest).toHaveBeenCalledWith("George");
  });

  it("short-circuits to [] without calling the provider for a <3-char query", async () => {
    const provider = fakeProvider();
    const result = await suggestAddresses(provider, "ge");
    expect(result).toEqual([]);
    expect(provider.suggest).not.toHaveBeenCalled();
  });

  it("treats whitespace-only queries as short", async () => {
    const provider = fakeProvider();
    expect(await suggestAddresses(provider, "  a ")).toEqual([]);
    expect(provider.suggest).not.toHaveBeenCalled();
  });
});

describe("resolveAddress", () => {
  it("delegates to the provider and returns the resolved address", async () => {
    const provider = fakeProvider();
    const result = await resolveAddress(provider, "au-addr-1");
    expect(result).toEqual(SAMPLE_ADDRESS);
    expect(provider.resolve).toHaveBeenCalledWith("au-addr-1");
  });

  it("returns null when the provider cannot resolve the id", async () => {
    const provider = fakeProvider({ resolve: vi.fn().mockResolvedValue(null) });
    expect(await resolveAddress(provider, "unknown")).toBeNull();
  });
});
