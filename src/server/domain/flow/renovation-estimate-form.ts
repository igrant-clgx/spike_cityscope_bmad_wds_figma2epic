import type { ResolvedAddress } from "@server/domain/ports/address-provider";

/**
 * A single Step 3 property-detail answer. The concrete input widgets arrive in
 * Story 3.5; the shell only needs the value shape so the aggregate and the
 * react-hook-form defaults can be typed today.
 */
export type PropertyAnswerValue =
  | string
  | number
  | boolean
  | { min: number; max: number };

/** Map of Step 3 question id → answer value (FR-forward, filled in Story 3.5). */
export type PropertyDetailAnswers = Record<string, PropertyAnswerValue>;

/**
 * Renovation estimate flow aggregate (AD-6). The flow owns the selected address
 * slot plus the Step 1–3 in-progress scope:
 * - `address`: the confirmed structured property address (or `null`).
 * - `renovationTypeId`: Step 1 selection (Story 3.3), `null` until chosen.
 * - `selectedItemIds`: Step 2 selected renovation items (Story 3.4).
 * - `propertyDetails`: Step 3 property-detail answers (Story 3.5).
 *
 * Pure domain: no zod, no UI, immutable transitions.
 */
export interface RenovationEstimateForm {
  address: ResolvedAddress | null;
  renovationTypeId: string | null;
  selectedItemIds: string[];
  propertyDetails: PropertyDetailAnswers;
}

export function emptyForm(): RenovationEstimateForm {
  return {
    address: null,
    renovationTypeId: null,
    selectedItemIds: [],
    propertyDetails: {},
  };
}

/**
 * Write the confirmed property address, preserving all dependent Step 1–3 scope.
 * The spread keeps `renovationTypeId`/`selectedItemIds`/`propertyDetails`
 * untouched, so this is used for the FIRST address selection (nothing to reset).
 */
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
 * transition. Story 3.2 added the Step 1–3 slots
 * (`renovationTypeId`/`selectedItemIds`/`propertyDetails`) and they reset here
 * for free — proving Story 2.5's forward-compatibility design.
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
