# Adversarial Seams Review — Architecture Spine

**Review lens:** Construct adjacent implementation units that can each follow AD-1..AD-11 and the Consistency Conventions literally, yet still integrate incompatibly.

**Verdict:** PASS-WITH-FINDINGS

The spine is directionally sound for a lean spike, but several seams remain under-specified at the exact altitude where independent feature/BFF/adapter units would split work. These are not abstract purity issues: they are plausible integration failures around config graph shape, estimate/lead linkage, address reset semantics, error details, and analytics/deferred behavior.

## Finding 1 — ConfigSource does not define one versioned flow graph across Step 1, Step 2, Step 3, and estimate

**Severity:** High  
**Impacted ADs:** Tighten AD-8; possibly AD-4  
**Incompatible pair:** `features/step2-items` + `features/step3-details` / `app/api/v1/config`

### Pair that obeys the spine but diverges

- Unit A builds Step 2 exactly from `RenovationItem[]` returned by `ConfigSource`, validates with the shared `RenovationItem` schema, uses TanStack Query, and never hardcodes labels or costs.
- Unit B builds Step 3 exactly from `Step3Question[]` returned by `ConfigSource`, validates with the shared `Step3Question` schema, uses question field-type to render controls, and never hardcodes questions.

Both obey AD-1, AD-4, AD-5, AD-6, AD-8, and conventions. They can still be incompatible because the spine does not require a single canonical, versioned config graph or referential integrity between:

- `RenovationType` selected in Step 1;
- allowed `RenovationItem.id` values in Step 2;
- Step 3 questions that apply to a renovation type, selected item, or property detail;
- answer keys consumed by `RenovationEstimateRequest` and `EstimateEngine`.

Example failure: Step 2 emits item IDs `bathroom.demolition` and `bathroom.tiling`; Step 3 questions use `appliesToItemIds: ["demo", "tile"]` or no linkage at all; the estimate request sends answers keyed by question IDs from a different config version. Every individual payload can validate, yet the flow has no coherent graph.

### Hole to close

Tighten **AD-8**:

> **AD-8 Rule addition — versioned config graph:** `ConfigSource` publishes one canonical `FlowConfig` snapshot containing renovation types, renovation items, Step 3 questions, applicability rules, and stable IDs. All item/question applicability references must be validated for referential integrity against that same snapshot. The client includes `configVersion` in `RenovationEstimateRequest`; the estimate use-case rejects requests whose item IDs, question IDs, or applicability links are not valid for that `configVersion`. Step 2 and Step 3 may not fetch or interpret independent unversioned config fragments.

## Finding 2 — `estimateId` can link a lead to the wrong or non-existent estimate

**Severity:** High  
**Impacted ADs:** Tighten AD-6; add AD-12  
**Incompatible pair:** `app/api/v1/estimate` use-case + `app/api/v1/leads` / `LeadSink`

### Pair that obeys the spine but diverges

- Unit A implements estimate as stateless-computed, returns a server-issued UUID `estimateId` with every `EstimateResult`, uses integer cents, and does not persist estimate details because persistence is deferred.
- Unit B implements lead capture by requiring `estimateId` and consent, then stores/sends the lead via `LeadSink`; it never persists a lead without an `estimateId`.

Both obey AD-6, AD-7, AD-9, AD-10, and the Deferred persistence statement. They still diverge because the spine does not define who owns issuance, validation, or replay protection for `estimateId`, nor what a `LeadSink` must receive to reconstruct the estimate when estimates are stateless.

Concrete failure modes:

- Lead route accepts any opaque-looking UUID because there is no persisted estimate registry.
- Lead route stores only `estimateId`, but the estimate was never persisted, so CRM/email cannot know the estimated range or scope.
- Results are recalculated and a new `estimateId` is displayed, while the lead form mutation holds a stale previous `estimateId`; both IDs were server-issued and valid-looking.

### Hole to close

Add **AD-12 — Estimate identity and lead linkage are server-verifiable**:

> The estimate use-case is the only issuer of `estimateId`. A lead submission must be validated against a server-verifiable estimate record or signed estimate snapshot that binds `estimateId` to the normalized renovation scope, configVersion, cost range, and creation time. The client may carry `estimateId` but may not be the source of truth. `LeadSink` receives either a validated estimate reference plus immutable summary or an embedded signed snapshot sufficient for downstream CRM/email without recalculating from client input.

Also tighten **AD-6**:

> A lead may only be submitted for the currently displayed estimate result generated from the current flow aggregate; stale `estimateId` values are invalid after any scope mutation.

## Finding 3 — Address reset behavior is deferred but it is also a cross-feature consistency invariant

**Severity:** High  
**Impacted ADs:** Tighten AD-6; move part of Deferred UX item into architecture  
**Incompatible pair:** `features/address` + `features/results` / `features/lead`

### Pair that obeys the spine but diverges

- Unit A implements address autocomplete/details via `AddressProvider`, writes the selected `AddressDetails` into the single `RenovationEstimateForm` aggregate, and preserves form state with react-hook-form.
- Unit B implements results and lead capture using TanStack Query and the `estimateId` returned from estimate; it preserves user-entered lead data across retries.

Both obey AD-1, AD-4, AD-5, AD-6, AD-9, and AD-10. They can still integrate incorrectly because address-reset behavior is explicitly deferred to UX, yet address is part of the renovation scope and therefore part of estimate validity.

Concrete failure: the user estimates for Address A, changes to Address B, and the address feature updates only `address`. Results remains cached under a query key that omits an aggregate fingerprint, Step 2/3 selections remain valid-looking, and lead capture still submits the `estimateId` for Address A. Every unit has one state owner and all calls go through BFF, but the domain relationship is wrong.

### Hole to close

Tighten **AD-6**:

> The flow aggregate has monotonic scope invalidation. Any canonical address change, renovation type change, item set change, or Step 3 answer change invalidates downstream estimate result, `estimateId`, and lead submission eligibility. Query keys for estimate/results must include a deterministic aggregate fingerprint or equivalent invalidation key. Lead capture is disabled/rejected until the current aggregate has a fresh estimate.

Move the architectural part of the Deferred UX item:

> UX may decide the visible reset interaction and messaging, but architecture owns the invariant that stale estimates/leads cannot survive a scope-changing address reset.

## Finding 4 — Error `fields?` is named but not shaped, so handlers and client can both comply and still disagree

**Severity:** Medium  
**Impacted ADs:** Tighten AD-9; tighten Consistency Convention “Data & formats — errors/envelope”  
**Incompatible pair:** one Route Handler + `src/lib/api-client` / form error mapper

### Pair that obeys the spine but diverges

- Unit A implements `app/api/v1/estimate` errors as `{ error: { code, message, fields: { budgetMin: "Too low" } }, requestId }`.
- Unit B implements `app/api/v1/leads` validation errors as `{ error: { code, message, fields: [{ path: ["phone"], message: "Invalid AU phone" }] }, requestId }`.
- The client `api-client` expects `fields` as either a string map or Zod-like issue list depending on which feature author wrote it.

All versions use the AD-9 envelope, requestId, shared enum code, and no PII in logs. The envelope still diverges because `fields?` is unconstrained.

### Hole to close

Tighten **AD-9**:

> `error.fields`, when present, is always `Array<{ path: string[]; code: string; message: string }>` using Zod issue path semantics. Route Handlers must map validation failures into this shape; `api-client` and form mappers consume only this shape. Non-field errors omit `fields`.

Tighten the convention:

> Error `code` comes from a shared enum; field errors use the shared `ApiFieldError[]` schema, never route-specific maps or strings.

## Finding 5 — Analytics is deferred but AD-1 makes browser-vendor analytics impossible unless a first-party event seam is defined

**Severity:** Medium  
**Impacted ADs:** Add AD-13 or tighten AD-1/AD-9 Deferred text  
**Incompatible pair:** `features/results` analytics instrumentation + future analytics adapter

### Pair that obeys the spine but diverges

- Unit A follows common frontend practice and emits analytics events from client components to an analytics SDK, but this violates AD-1 if the vendor is third-party I/O from the browser.
- To obey AD-1, Unit A instead posts same-origin events to the BFF. Unit B later implements an analytics adapter, but there is no event schema, naming convention, PII rule beyond logs, consent rule, or route shape. Different features invent `estimate_viewed`, `EstimateViewed`, and `results:viewed`, with different payloads.

The Deferred section says “analytics vendor” is owned by Eng/QA and references an AD-9 analytics-event surface, but AD-9 defines API response envelopes and retry policy, not analytics events. That leaves an actual divergence point.

### Hole to close

Add **AD-13 — Analytics events use a first-party typed event surface**:

> If analytics is implemented, the browser emits only same-origin events through `src/lib/api-client` to `app/api/v1/events` or an equivalent BFF route. Event names and payloads are defined once in shared schemas, contain no PII, include `requestId`/correlation where applicable, and are forwarded server-side through an `AnalyticsSink` adapter. The vendor remains deferred; the event contract does not.

Or amend Deferred:

> Analytics vendor is deferred, but event schema, no-PII policy, and first-party BFF route are architectural invariants under AD-1/AD-9.

## Finding 6 — Port DTO ownership is under-specified between shared API schemas and domain port interfaces

**Severity:** Medium  
**Impacted ADs:** Tighten AD-2/AD-4/AD-3  
**Incompatible pair:** Route Handler mapper + `EstimateEngine` adapter

### Pair that obeys the spine but diverges

- Unit A treats shared Zod schemas as API-edge contracts only. `app/api/v1/estimate` validates `RenovationEstimateRequest`, then maps details to a domain `RenovationScope` with answer values keyed by `Step3Question.id`.
- Unit B implements `EstimateEngine` behind a domain port using domain types only, but expects property details as normalized named fields such as `propertyType`, `bedrooms`, `siteAccess`, and `targetStartDate`.

Both obey AD-2, AD-3, AD-4, and AD-7. They still clash because the spine says ports depend on domain types but does not state which layer owns canonical domain normalization from config-driven question answers into estimate inputs.

### Hole to close

Tighten **AD-4** or **AD-2**:

> Shared schemas define API contracts; application use-cases own the only mapping from API DTOs/config-driven answers into canonical domain value objects. Port interfaces accept canonical domain types only, not raw API DTOs and not vendor/config labels. The mapping must be covered by shared IDs from `FlowConfig` and reject unknown or inapplicable answers before calling a port.

## Deferred divergence check

Several Deferred items are safe because the spine has a stable port seam: cost algorithm, address provider, config content source, and lead sink vendor can vary behind ports if the contracts above are tightened.

However, the following Deferred lines currently leave divergence points open:

1. **Persistence choice:** Deferring persistence is acceptable for storage technology, but not for the semantic requirement to validate or reconstruct `estimateId` for lead capture. Close with AD-12.
2. **Analytics vendor:** Deferring vendor is acceptable, but not the event contract or first-party route implied by AD-1. Close with AD-13 or explicit AD-9 expansion.
3. **UX-owned address-reset rule:** UX can own presentation and interaction copy, but architecture must own scope invalidation because address affects estimate and lead correctness. Tighten AD-6.
4. **Config content:** Final content can be deferred, but referential shape and versioning cannot. Tighten AD-8.

## Feature-altitude silence check

The feature-altitude still leaves these owned dimensions silent or too implicit:

- **Flow state invalidation:** AD-6 names the aggregate but not stale result/lead invalidation after scope changes.
- **Config graph versioning/applicability:** AD-8 names schemas but not the cross-step graph and stable IDs.
- **Estimate identity semantics:** AD-6 names `estimateId` as join key but not who validates it or what immutable data it represents.
- **Typed field error contract:** AD-9 names `fields?` but not its structure.
- **Analytics event surface:** Deferred references it, but no AD defines it.

## Recommended gate action

Do not reject the spine wholesale; the paradigm and major boundaries are coherent. Require the spine to add/tighten ADs for:

1. Versioned `FlowConfig` with referential integrity.
2. Server-verifiable estimate identity and current-aggregate lead linkage.
3. Scope invalidation on address/type/item/detail changes.
4. Concrete `ApiFieldError[]` shape.
5. First-party analytics event contract if analytics remains in scope.
