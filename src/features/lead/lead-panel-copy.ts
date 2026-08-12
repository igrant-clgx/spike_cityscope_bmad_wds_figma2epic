/**
 * Lead-panel microcopy (Story 5.4, FR-29/30/32/33, UX-DR16 lead). Plain, honest,
 * low-pressure voice per EXPERIENCE.md § Voice and Tone — an offer to be
 * contacted, never a quote funnel. Each async state carries a screen-reader
 * `announce` string for the PERSISTENT live region (mirror of the Results
 * live-region pattern), so the arrival of a confirmation/error is spoken
 * reliably (the region never remounts).
 */

/** Submitting state — calm, honest about the wait; duplicate submit prevented. */
export const LEAD_SUBMITTING_MESSAGE = 'Sending your details\u2026';
export const LEAD_SUBMITTING_ANNOUNCEMENT = 'Sending your details\u2026';

/**
 * Success confirmation (FR-29). Replaces the form; the estimate stays visible
 * above. Warm, no-pressure — a coach will reach out.
 */
export const LEAD_SUCCESS_TITLE = 'Thanks \u2014 your details are on their way';
export const LEAD_SUCCESS_MESSAGE =
  'A coach will be in touch to talk things through. There\u2019s nothing more ' +
  'you need to do \u2014 your estimate stays right here if you\u2019d like to keep looking.';
export const LEAD_SUCCESS_ANNOUNCEMENT =
  'Your details were sent. A coach will be in touch.';

/**
 * Non-destructive, retryable error (FR-30/FR-32/FR-33). Reassures the homeowner
 * their entered details are safe and offers a plain retry that re-fires the SAME
 * idempotent request.
 */
export const LEAD_ERROR_TITLE = 'We couldn\u2019t send your details';
export const LEAD_ERROR_MESSAGE =
  'Something went wrong on our side. Your details are safe \u2014 nothing was ' +
  'lost, and you can try again.';
export const LEAD_ERROR_ANNOUNCEMENT =
  'We couldn\u2019t send your details. Please try again.';
export const LEAD_RETRY_LABEL = 'Try again';

/**
 * Disabled-submit helper (resolves the Story 5.3 EH#3 deferral). Explains WHY
 * the send button is disabled so it is never an unexplained dead control.
 */
export const LEAD_DISABLED_SUBMIT_HELP =
  'Fill in your name, a valid email and Australian phone number, choose how ' +
  'we should contact you, and agree to be contacted \u2014 then this button turns on.';
