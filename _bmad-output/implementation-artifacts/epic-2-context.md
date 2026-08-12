# Epic 2 Context: Address Entry & Property Context

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let a homeowner set, review, change, and recoverably enter the property address that scopes the renovation estimate. This epic establishes the address seam end-to-end: BFF-only provider access, shared validation contracts, async ownership, flow-state integration, and UX states that keep the user moving even when address lookup fails.

## Stories

- Story 2.1: AddressProvider port, stub adapter & BFF route
- Story 2.2: Display current address & change control
- Story 2.3: Address autocomplete modal with structured resolution
- Story 2.4: Manual-entry fallback & non-destructive error handling
- Story 2.5: Address change resets scope to a defined state

## Requirements & Constraints

- Show the current property address above the form and provide a visible, keyboard-operable "Enter new address" control.
- Address autocomplete must be debounced by at least 300ms, with no more than one request per 300ms while typing.
- Selecting a prediction must resolve into structured AU address data: street, suburb, state, postcode, and geo coordinates.
- If lookup fails, the user must keep their typed data, see a non-destructive retryable error, and be able to manually enter structured address fields.
- Address lookup, details resolution, and error handling must use the app-wide async/loading/error primitives; duplicate or ad-hoc request state is not acceptable.
- AU-only market assumptions apply to address formats. API errors should preserve user input and expose a retry path.
- Address change reset scope remains open: OI-7 must be resolved by Product + UX before build. The current planning assumption is that a new address restarts scope from Step 1, but whether Step 1–3 answers clear or persist is undecided.

## Technical Decisions

- The browser must call only same-origin BFF route handlers for address work. External address providers, provider keys, and vendor SDKs stay server-side; client code never calls third-party address services directly. (AD-1)
- Address provider integration is behind an `AddressProvider` domain port. The initial adapter is a deterministic stub returning sample Australian predictions so stories can be built without choosing Google Places, Australia Post, or another final provider. Application and UI code must depend on the port contract, not adapter/vendor shapes. (AD-2)
- Address contracts are shared Zod schemas reused by client and server. Define schemas for autocomplete query/prediction and resolved structured address, including AU postcode/state validation and geo fields. Route handlers re-validate with the same schemas used by the client. (AD-4)
- TanStack Query owns server-derived async state for address autocomplete/details, including loading, retry, and error state. Components should consume query/mutation hooks rather than mixing fetch calls with local request state. (AD-5)
- The flow aggregate owns the selected address slot in `RenovationEstimateForm`. A resolved or manually entered structured address writes there. Changing address invalidates dependent estimate scope consistently once OI-7 is decided. (AD-6)
- Address management lives in the address feature, BFF address routes, and the AddressProvider port. Keep dependency direction inward: client → BFF → application/domain/ports → adapter.

## UX & Interaction Patterns

- The address block sits above the accordion form and uses the shared MUI theme/tokens. The change affordance is the "Enter new address" control; it must be visibly focusable and meet minimum target size.
- Re-entry opens a modal dialog with Confirm/Cancel. The dialog traps focus while open and returns focus to the trigger on close. Use MUI Dialog behavior where possible and preserve keyboard access for all fields/actions.
- Autocomplete suggestions appear after the debounce interval. Address lookup loading is shown inline in the field; service failures show a retryable alert and expose manual entry instead of blocking the flow.
- Address surface states to cover: empty/initial with a primary prompt to enter a property address; loading during lookup; service-error with retry plus manual fallback; success with the confirmed current address displayed.
- Address fields require programmatic labels. Field errors need inline text, non-color cues, and `aria-describedby` associations so screen readers announce recovery guidance.
- Manual fallback fields should collect the same structured data shape as provider resolution, so downstream form and estimate code do not branch on lookup-vs-manual origin.

## Cross-Story Dependencies

- Stories 2.2–2.4 depend on the shared schemas, BFF routes, AddressProvider port, and TanStack Query hooks from Story 2.1.
- Story 2.5 depends on the address slot in the flow aggregate and on Product + UX resolving OI-7 before implementation finalizes reset behavior.
