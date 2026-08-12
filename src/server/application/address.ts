import type {
  AddressPrediction,
  AddressProvider,
  ResolvedAddress,
} from "@server/domain/ports/address-provider";

/**
 * Address use-cases (application layer). Pure orchestration over the
 * `AddressProvider` port — no vendor SDK, no UI, no zod. The ≥3-char short-query
 * guard lives here (and in the adapter) so no provider call happens for a query
 * that cannot yield useful predictions.
 */

const MIN_QUERY_LENGTH = 3;

export async function suggestAddresses(
  provider: AddressProvider,
  query: string,
): Promise<AddressPrediction[]> {
  if (query.trim().length < MIN_QUERY_LENGTH) {
    return [];
  }
  return provider.suggest(query);
}

export async function resolveAddress(
  provider: AddressProvider,
  addressId: string,
): Promise<ResolvedAddress | null> {
  return provider.resolve(addressId);
}
