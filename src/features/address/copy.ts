/**
 * Address feature microcopy — plain, low-pressure voice per EXPERIENCE.md
 * § Voice and Tone. The empty prompt matches the empty/initial state affordance
 * ("Enter your property address"); errors are helpful, not scolding.
 */

export const ADDRESS_BLOCK_HEADING = 'Property address';

export const ADDRESS_EMPTY_PROMPT = 'Enter your property address to get started.';

/** Control label when an address is already set (change flow). */
export const CHANGE_ADDRESS_LABEL = 'Enter new address';

/** Control label when no address is set yet (initial flow). */
export const ADD_ADDRESS_LABEL = 'Enter your property address';

/* Autocomplete modal microcopy (Story 2.3) — plain, low-pressure voice. */

/** Modal title / accessible dialog name. */
export const ADDRESS_MODAL_TITLE = 'Find your property';

/** Label for the debounced search field (programmatic + visible). */
export const ADDRESS_SEARCH_LABEL = 'Search for an address';

/** Placeholder nudging the ≥3-char search. */
export const ADDRESS_SEARCH_PLACEHOLDER = 'Start typing your address…';

/** Inline lookup-loading text (FR-32). */
export const ADDRESS_LOOKUP_LOADING = 'Looking up addresses…';

/** Shown once ≥3 chars are typed but nothing matched (quiet, non-error). */
export const ADDRESS_NO_RESULTS = 'No matches yet — keep typing.';

/** Confirm button label — writes the resolved address to the flow. */
export const ADDRESS_CONFIRM_LABEL = 'Use this address';

/** Cancel button label — closes without changing the address. */
export const ADDRESS_CANCEL_LABEL = 'Cancel';

/* Error handling + manual-entry fallback microcopy (Story 2.4) — plain, helpful,
 * NEVER scolding. A lookup/resolve failure preserves what the user typed. */

/** Non-destructive service-error message (FR-33). Offers retry + manual entry. */
export const ADDRESS_ERROR_MESSAGE =
  "We couldn't find that address — try again or enter it manually.";

/** Retry affordance — re-runs the failed lookup/resolve without clearing input. */
export const ADDRESS_RETRY_LABEL = 'Try again';

/** Toggle into the structured manual-entry fallback. */
export const ADDRESS_ENTER_MANUALLY_LABEL = 'Enter address manually';

/** Control label to leave manual entry and return to autocomplete search. */
export const ADDRESS_BACK_TO_SEARCH_LABEL = 'Search instead';

/* Manual-entry field labels (programmatic + visible, UX-DR20). */
export const MANUAL_STREET_LABEL = 'Street address';
export const MANUAL_SUBURB_LABEL = 'Suburb';
export const MANUAL_STATE_LABEL = 'State or territory';
export const MANUAL_POSTCODE_LABEL = 'Postcode';

/** Placeholder/prompt option for the state select. */
export const MANUAL_STATE_PLACEHOLDER = 'Select a state or territory';

/* Manual-entry validation messages — inline, announced, non-scolding. */
export const MANUAL_STREET_REQUIRED = 'Enter a street address.';
export const MANUAL_SUBURB_REQUIRED = 'Enter a suburb.';
export const MANUAL_STATE_REQUIRED = 'Select a state or territory.';
export const MANUAL_POSTCODE_REQUIRED = 'Enter a postcode.';
export const MANUAL_POSTCODE_INVALID = 'Enter a 4-digit postcode.';
