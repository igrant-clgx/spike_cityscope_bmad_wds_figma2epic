/**
 * Lead form microcopy (Story 5.3, FR-27/28/30, UX-DR12/20). Plain, honest,
 * low-pressure voice per EXPERIENCE.md § Voice and Tone — an offer to be
 * contacted, never a quote funnel. No "free"/"quote now" framing. Errors are
 * helpful, not scolding.
 */

export const LEAD_FORM_HEADING = 'Want us to get in touch?';

export const LEAD_FORM_DESCRIPTION =
  'Share your details and how you\u2019d like to hear from us. A coach will ' +
  'reach out to talk things through \u2014 no pressure, no obligation.';

/* Field labels — every control is programmatically labelled (UX-DR20). */
export const FIRST_NAME_LABEL = 'First name';
export const LAST_NAME_LABEL = 'Last name';
export const EMAIL_LABEL = 'Email';
export const PHONE_LABEL = 'Phone';
export const CONTACT_METHOD_LABEL = 'How should we contact you?';
export const BEST_TIME_LABEL = 'Best time to reach you';

/** Empty option for the optional best-time select (unset sentinel). */
export const BEST_TIME_PLACEHOLDER = 'No preference';

/**
 * Preferred contact method (required, FR-27). Values mirror the shared
 * `leadCaptureRequestSchema` `contactMethod` enum.
 */
export const CONTACT_METHOD_OPTIONS: ReadonlyArray<{
  value: 'phone' | 'email';
  label: string;
}> = [
  { value: 'phone', label: 'By phone' },
  { value: 'email', label: 'By email' },
];

/**
 * Optional best-time-to-reach vocabulary. Values mirror the shared
 * `leadCaptureRequestSchema` `bestTime` enum.
 */
export const BEST_TIME_OPTIONS: ReadonlyArray<{
  value: 'morning' | 'afternoon' | 'evening' | 'anytime';
  label: string;
}> = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' },
];

/** Explicit consent checkbox copy (FR-30) — clear about what is agreed to. */
export const CONSENT_LABEL =
  'I agree to be contacted about my renovation enquiry and understand my ' +
  'details will be handled per the privacy policy.';

export const SUBMIT_LABEL = 'Send my details';

/* Per-field error messages — plain and specific, never colour-only (UX-DR20). */
export const FIRST_NAME_ERROR = 'Enter your first name (at least 2 characters).';
export const LAST_NAME_ERROR = 'Enter your last name (at least 2 characters).';
export const EMAIL_ERROR = 'Enter a valid email address.';
export const PHONE_ERROR = 'Enter a valid Australian phone number.';
export const CONTACT_METHOD_ERROR = 'Choose how you\u2019d like to be contacted.';
export const BEST_TIME_ERROR = 'Choose a valid best time, or leave it unset.';
export const CONSENT_ERROR = 'Please agree to be contacted so we can reach you.';
