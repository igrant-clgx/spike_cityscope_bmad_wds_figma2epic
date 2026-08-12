/**
 * Contact Section microcopy (FR-26, UX-DR11, UX-DR17). Low-pressure, honest
 * voice — an offer to talk, never a quote funnel. The phone number is presented
 * human-readable for the label and digits-only for the `tel:` target so the
 * dialer opens cleanly on mobile.
 */

export const CONTACT_HEADING = 'Talk to a Home Loan Coach';

export const CONTACT_DESCRIPTION =
  'See how we can help finance your renovation. Our coaches are happy to talk ' +
  'it through \u2014 no pressure, no obligation.';

export const CALL_CTA_LABEL = 'Call us';

/** Human-readable phone shown in the CTA label. */
export const CONTACT_PHONE_DISPLAY = '0800 269 4663';

/** Digits-only `tel:` target (no spaces) so the dialer opens cleanly. */
export const CONTACT_PHONE_TEL = CONTACT_PHONE_DISPLAY.replace(/\s+/g, '');
