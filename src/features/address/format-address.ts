import type { ResolvedAddress } from '@server/domain/ports/address-provider';

/**
 * Format a resolved structured AU address into a single human-readable line:
 * `street, suburb STATE postcode` (e.g. `100 George St, Sydney NSW 2000`).
 *
 * Pure and presentation-agnostic — reused by the address block, the change
 * modal (Story 2.3), and any later summary surfaces so the rendered address
 * is consistent everywhere.
 */
export function formatResolvedAddress(address: ResolvedAddress): string {
  return `${address.street}, ${address.suburb} ${address.state} ${address.postcode}`;
}
