import { auStateSchema } from '@shared/schemas';
import type { AuState } from '@shared/schemas';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import {
  MANUAL_STREET_REQUIRED,
  MANUAL_SUBURB_REQUIRED,
  MANUAL_STATE_REQUIRED,
  MANUAL_POSTCODE_REQUIRED,
  MANUAL_POSTCODE_INVALID,
} from './copy';

/**
 * The raw manual-entry field record. `state` is a free string (the select may be
 * unset — an empty string) so validation, not the type, owns the AU-enum rule.
 */
export interface ManualAddressFields {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}

/** Which fields a manual-entry validation error can attach to. */
export type ManualAddressField = keyof ManualAddressFields;

export type ManualAddressValidation =
  | { ok: true; address: ResolvedAddress }
  | { ok: false; errors: Partial<Record<ManualAddressField, string>> };

const POSTCODE_RE = /^\d{4}$/;

/**
 * Pure, throw-free validator for the manual-entry fallback (FR-8). Applies the
 * SAME shared address rules used by provider resolution — `state` ∈ the AU enum,
 * `postcode` matches `^\d{4}$`, `street`/`suburb` non-empty after trim — and, on
 * success, builds a `ResolvedAddress` with NO `geo` (manual entry cannot supply
 * coordinates). The produced shape is identical to a provider-resolved address
 * so downstream code never branches on origin.
 */
export function validateManualAddress(
  fields: ManualAddressFields,
): ManualAddressValidation {
  const errors: Partial<Record<ManualAddressField, string>> = {};

  const street = fields.street.trim();
  const suburb = fields.suburb.trim();
  const state = fields.state.trim();
  const postcode = fields.postcode.trim();

  if (street.length === 0) {
    errors.street = MANUAL_STREET_REQUIRED;
  }
  if (suburb.length === 0) {
    errors.suburb = MANUAL_SUBURB_REQUIRED;
  }

  const stateResult = auStateSchema.safeParse(state);
  if (!stateResult.success) {
    errors.state = MANUAL_STATE_REQUIRED;
  }

  if (postcode.length === 0) {
    errors.postcode = MANUAL_POSTCODE_REQUIRED;
  } else if (!POSTCODE_RE.test(postcode)) {
    errors.postcode = MANUAL_POSTCODE_INVALID;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const address: ResolvedAddress = {
    street,
    suburb,
    state: stateResult.success ? stateResult.data : (state as AuState),
    postcode,
  };

  return { ok: true, address };
}
