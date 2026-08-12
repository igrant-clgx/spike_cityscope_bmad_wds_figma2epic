import type {
  AddressPrediction,
  AddressProvider,
  ResolvedAddress,
} from "@server/domain/ports/address-provider";

/**
 * Deterministic stub `AddressProvider` (AD-2). Server-only: the browser never
 * touches it. Returns a fixed set of sample AU addresses so Epic 2 stories can be
 * built without choosing a real provider (Google Places / Australia Post, OI-6).
 *
 * Fully deterministic — no `Math.random`, no `Date`, no external I/O — so tests
 * and later stories get stable predictions.
 */

interface StubEntry {
  prediction: AddressPrediction;
  address: ResolvedAddress;
}

const SAMPLE_ADDRESSES: readonly StubEntry[] = [
  {
    prediction: { addressId: "au-addr-1", label: "100 George St, Sydney NSW 2000" },
    address: {
      street: "100 George St",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
      geo: { lat: -33.8615, lng: 151.2055 },
    },
  },
  {
    prediction: { addressId: "au-addr-2", label: "200 Collins St, Melbourne VIC 3000" },
    address: {
      street: "200 Collins St",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
      geo: { lat: -37.8156, lng: 144.9662 },
    },
  },
  {
    prediction: { addressId: "au-addr-3", label: "150 Queen St, Brisbane QLD 4000" },
    address: {
      street: "150 Queen St",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
      geo: { lat: -27.4699, lng: 153.0251 },
    },
  },
  {
    prediction: { addressId: "au-addr-4", label: "50 St Georges Tce, Perth WA 6000" },
    address: {
      street: "50 St Georges Tce",
      suburb: "Perth",
      state: "WA",
      postcode: "6000",
      geo: { lat: -31.9552, lng: 115.8605 },
    },
  },
];

const MIN_QUERY_LENGTH = 3;

export function createStubAddressProvider(): AddressProvider {
  return {
    suggest(query: string): Promise<AddressPrediction[]> {
      const trimmed = query.trim();
      if (trimmed.length < MIN_QUERY_LENGTH) {
        return Promise.resolve([]);
      }
      const needle = trimmed.toLowerCase();
      const matches = SAMPLE_ADDRESSES.filter((entry) =>
        entry.prediction.label.toLowerCase().includes(needle),
      ).map((entry) => entry.prediction);
      return Promise.resolve(matches);
    },
    resolve(addressId: string): Promise<ResolvedAddress | null> {
      const entry = SAMPLE_ADDRESSES.find(
        (candidate) => candidate.prediction.addressId === addressId,
      );
      return Promise.resolve(entry ? entry.address : null);
    },
  };
}
