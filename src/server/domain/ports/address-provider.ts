/**
 * AddressProvider port (AD-2). Address autocomplete + details lookup.
 *
 * Interface only at scaffold time — the concrete adapter (Google Places /
 * Australia Post, OI-6) is wired in a later story. No external I/O here.
 */
export interface AddressProvider {
  suggest(query: string): Promise<AddressSuggestion[]>;
  details(addressId: string): Promise<AddressDetails>;
}

export interface AddressSuggestion {
  addressId: string;
  label: string;
}

export interface AddressDetails {
  addressId: string;
  formatted: string;
  postcode: string;
}
