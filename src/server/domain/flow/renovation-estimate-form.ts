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

/**
 * Change the confirmed property address (FR-9, OI-7 `[OPEN]`).
 *
 * Changing the address resets ALL dependent renovation scope to the defined
 * initial state and then applies the new address. Implemented as "start from
 * `emptyForm()`, set the new address" so that as later epics add scope slots to
 * `emptyForm()`, they are reset automatically here with no change to this
 * transition.
 *
 * OI-7 (clear vs keep dependent answers) is unconfirmed by product; this
 * implements the documented `[ASSUMPTION]` — clear dependent scope. Use
 * `setAddress` for the FIRST address selection (nothing to reset); use
 * `changeAddress` when replacing an already-confirmed address.
 */
export function changeAddress(
  _form: RenovationEstimateForm,
  address: ResolvedAddress,
): RenovationEstimateForm {
  return setAddress(emptyForm(), address);
}
