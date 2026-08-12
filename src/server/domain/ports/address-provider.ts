/**
 * AddressProvider port (AD-2). Address autocomplete + structured details lookup.
 *
 * Plain TS types ONLY — the domain layer imports no vendor SDK (no `zod`, no
 * `@mui/*`, no `next`, no `react`). The shared zod schemas in `src/shared` mirror
 * these shapes; a type-level test (`src/shared/schemas/address.test.ts`) asserts
 * structural equivalence so the two never drift. The concrete provider (Google
 * Places / Australia Post, OI-6) is deferred — Story 2.1 ships a stub adapter.
 */
export interface AddressPrediction {
  addressId: string;
  label: string;
}

export type AuState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export interface ResolvedAddress {
  street: string;
  suburb: string;
  state: AuState;
  postcode: string;
  geo?: { lat: number; lng: number };
}

export interface AddressProvider {
  suggest(query: string): Promise<AddressPrediction[]>;
  resolve(addressId: string): Promise<ResolvedAddress | null>;
}
