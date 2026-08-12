import type { ResolvedAddress } from "@server/domain/ports/address-provider";

/**
 * Renovation estimate flow aggregate (AD-6). The flow owns the selected address
 * slot; a resolved (or later, manually entered) structured address writes into
 * it. Pure domain: no zod, no UI, immutable transitions.
 */
export interface RenovationEstimateForm {
  address: ResolvedAddress | null;
}

export function emptyForm(): RenovationEstimateForm {
  return { address: null };
}

export function setAddress(
  form: RenovationEstimateForm,
  address: ResolvedAddress,
): RenovationEstimateForm {
  return { ...form, address };
}
