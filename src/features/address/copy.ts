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
