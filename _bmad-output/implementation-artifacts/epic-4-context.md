# Epic 4 Context: Cost Estimate & Results

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

The value moment: turn the completed scope captured across Epics 2–3 into an honest, indicative cost range and present it with integrity. An `EstimateEngine` port (deterministic stub for the spike) computes a range from the flow aggregate's address/type/items/details; the Results view reveals it as a single centered range with a confidence indicator, humble range framing, an indicative disclaimer, and a "how it's calculated" expander — never a false-precise number. A stable `estimateId` accompanies every result as the join key for later lead linkage and cache invalidation, and revise/restart actions let the homeowner refine or cleanly start over.

## Stories

- Story 4.1: EstimateEngine port, deterministic stub & estimate identity
- Story 4.2: Result cost card
- Story 4.3: Results states — loading, error, empty/low-confidence
- Story 4.4: Edit Estimate & New Estimate actions

## Requirements & Constraints

- Requesting an estimate routes the completed scope through the BFF to the `EstimateEngine` port, which returns a cost range for that scope (FR-19).
- The cost range is displayed prominently in AUD with a scope summary line, an indicative disclaimer, and a Confidence indicator (FR-20, FR-21).
- A "how it's calculated" explanation is available via an expandable "+ More Information" section (FR-22).
- "Edit Estimate" returns to the form with all captured answers preserved; "New Estimate" resets the flow to a clean state and invalidates the prior estimateId (FR-24, FR-25).
- Results must cover four states: loading/skeleton during calculation, animated success reveal, non-destructive estimate-service error with a retry that preserves all answers, and empty/low-confidence with an honest message and a path forward rather than a false number.
- **OI-3 [OPEN] CRITICAL (real cost algorithm):** ships as a deterministic stub behind the `EstimateEngine` port; the real algorithm must drop in as a single adapter substitution with **no UI change** (FR-23). The UI must branch on none of the pricing logic.
- **OI-7 [OPEN]:** the address/scope-change reset semantics shipped in Epic 3 as an assumed clear-all; because Edit vs New Estimate makes reset user-visible, reconcile to a signed product decision before wiring Story 4.4.
- Deferred from Epic 3 and due here: prune hidden-question answers from `propertyDetails` to the visible question set before building the estimate request; surface a form-level submit issue via the Toast primitive.

## Technical Decisions

- The `EstimateEngine` port already exists at `src/server/domain/ports/estimate-engine.ts` (`estimate(request): Promise<EstimateEngineResult>`, returning `estimateId`, `costMin`, `costMax`). Build the deterministic stub adapter, BFF route, shared request/response envelope schema, and TanStack Query hook by copying the proven `AddressProvider`/`ConfigSource` template verbatim: stub adapter → BFF route → AD-9 envelope → non-throwing `apiFetch` (`data.ok === false`) → TanStack Query ownership. Mirror `use-form-config.ts` — extract the wiring as a plain `global.fetch`-testable function consumed by a `useQuery`/mutation hook (AD-2, AD-5, AD-9).
- Money is integer AUD cents throughout the core and the envelope, formatted to an AUD string only at the view edge (AD-7, NFR-10). Use the existing branded `AudCents` type / `audCents()` guard in `src/server/domain/money.ts`; extract the cents→AUD display formatter as a pure, exhaustively-tested helper (boundaries, rounding, off-by-100) and add money-unit correctness to the reviewer checklist.
- The estimate request is built from the completed scope in the `RenovationEstimateForm` flow aggregate (`address`/`renovationTypeId`/`selectedItemIds`/`propertyDetails`); the request echoes the `configVersion` the scope was built from. "New Estimate" reset rebuilds from `emptyForm()` — the reset baseline that already clears every slot for free (AD-6).
- `estimateId` is the stable join key for later lead linkage and for cache invalidation; "New Estimate" must invalidate the prior estimateId's cached result per the cache-invalidation rule (AD-6, AD-9).
- The estimate request/response envelope schema extends the shared Zod v4 precedent in `src/shared/schemas/` (address + config schemas) and rides the discriminated success/error `envelopeSchema`. Keep dependency direction inward (client → BFF → application/domain/ports → adapter); domain and adapters import no `@mui`/`next`/`react`/`zod`. Tests are Node-only; add no new dependencies without justification.
- **First task of the epic:** land the inward-dependency boundary arch test (carried unaddressed from Epic 1 / Epic 2 / Epic 3) *before* the EstimateEngine adapter — an import of `next`/`react`/an adapter into `src/server/domain` must fail a test, retiring the manual grep that has held across four adapters on borrowed time.

## UX & Interaction Patterns

- Result card: titled "Estimated Renovation Cost", a centered range in cost-display type, a type/items summary line, a Confidence indicator, and the indicative disclaimer; max-width 600px with 32px padding; a "+ More Information" expander reveals the "how it's calculated" explanation. Copy uses humble range-framing, not false precision (UX-DR10, UX-DR17).
- Results states render per the UX-DR16 results matrix: loading/skeleton via the Epic 1 async primitive; a success reveal that animates within the motion band (honoring `prefers-reduced-motion`); a non-destructive, retryable estimate-service error that preserves all answers; and an empty/low-confidence honest message with a forward path.
- Actions below the card: "Edit Estimate" is secondary/outlined (state preserved), "New Estimate" is primary/contained (clean reset) (UX-DR13).
- The arrival of a result is announced to screen readers via a live region; plan the manual a11y check for the reveal and announcement up front, since the node-only harness cannot assert reveal timing or SR announcement (UX-DR20 results).

## Cross-Story Dependencies

- Stories 4.2–4.4 depend on the `EstimateEngine` port, stub adapter, envelope schema, `estimateId`, and TanStack Query hook delivered by Story 4.1.
- Epic 4 consumes the completed scope produced by Epics 2–3 (the flow aggregate's address + Step 1–3 slots) and reuses the async/error/Toast primitives from Epic 1.
- Story 4.4's reset/invalidation semantics depend on OI-7 being confirmed and set up the `estimateId` linkage that Epic 5 lead capture consumes.
