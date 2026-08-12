/**
 * Money representation for the domain and API (AD-7).
 *
 * CONVENTION: All monetary values (costMin, costMax, budget min/max, …) are
 * INTEGER AUD CENTS everywhere in the domain and across every API payload.
 * Never use floating-point dollars. Conversion to a formatted AUD string
 * (e.g. "$32,700") happens ONLY at the view edge, never in the domain.
 *
 * `AudCents` is a branded integer type so a raw `number` cannot be passed
 * where cents are expected without going through {@link audCents}.
 */

declare const audCentsBrand: unique symbol;

/** A non-fractional amount of Australian dollars expressed in integer cents. */
export type AudCents = number & { readonly [audCentsBrand]: "AudCents" };

/** Construct an {@link AudCents} value, asserting it is a safe integer. */
export function audCents(value: number): AudCents {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`AudCents must be a safe integer number of cents, received: ${value}`);
  }
  return value as AudCents;
}
