---
title: 'Story 2.1 — AddressProvider port, stub adapter & BFF route'
type: 'feature'
created: '2026-08-12'
status: 'in-review'
review_loop_iteration: 0
baseline_revision: '499a93f7de8419ada67225620ca0a64cde010382'
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** The app has no way to query AU addresses: the `AddressProvider` port is a placeholder, there is no adapter, no BFF route, no shared address contracts, and the flow has nowhere to store a resolved address. Every later Epic 2 story depends on this seam.

**Approach:** Build the address seam end-to-end — shared Zod address schemas (prediction + resolved structured AU address) reused client and server; a deterministic stub `AddressProvider` adapter returning sample AU predictions; BFF route handlers (`/api/v1/address/suggest`, `/api/v1/address/resolve`) that validate with the shared schemas and return the standard envelope; a domain flow aggregate exposing an address slot; and the TanStack Query async-ownership layer (provider + a typed suggest hook) demonstrating the client → BFF → application → port → adapter flow.

## Boundaries & Constraints

**Always:**
- All address I/O flows through same-origin BFF route handlers (AD-1). The browser NEVER calls an external address service; the stub adapter is server-only.
- Request AND response are validated with the SAME shared Zod schemas on client and server (AD-4). Route handlers re-validate input and output.
- The domain layer (`src/server/domain/**`) and adapters (`src/server/adapters/**`) import no UI (`@mui/*`, `next`, `react`). Domain stays free of vendor SDKs; keep the port as plain TS types.
- Client fetches go through the existing `apiFetch` (AD-9 envelope caller) and TanStack Query (AD-5) — no ad-hoc `fetch` + local request state.
- Colours (if any) come from `src/theme/tokens.ts` only (no ad-hoc hex).
- Resolved structured address shape is exactly: `street`, `suburb`, `state` (AU state/territory enum), `postcode` (4-digit AU), `geo` (`{ lat, lng }`). Manual entry (Story 2.4) must reuse this same shape.

**Block If:**
- The shared envelope contract or `apiFetch` signature would need a breaking change to integrate (would indicate a foundation defect, not a story task).

**Never:**
- Do not choose or integrate a real provider (Google Places / Australia Post) — stub only (AD-2, OI-6 deferred).
- Do not build the address UI block, the change-address modal, manual-entry fallback, or scope-reset — those are Stories 2.2–2.5.
- Do not add jsdom / React Testing Library. Tests stay node-only (`renderToStaticMarkup` for any React, `vi.fn` fetch stubs for logic).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Suggest happy path | `GET /api/v1/address/suggest?q=100 George` | Success envelope, `data.predictions` = array of `{ addressId, label }` sample AU matches | No error |
| Suggest short query | `q` length < 3 (or empty/missing) | Success envelope with `data.predictions = []` (no adapter call) | No error — not an error state |
| Suggest invalid query type | `q` absent | 400-ish error envelope `code: "invalid_request"` | Zod parse failure → error envelope |
| Resolve happy path | `GET /api/v1/address/resolve?addressId=au-addr-1` | Success envelope, `data.address` = full resolved structured AU address | No error |
| Resolve unknown id | `addressId` not in stub set | Error envelope `code: "not_found"` | Adapter returns null → error envelope |
| Resolve missing id | `addressId` absent | Error envelope `code: "invalid_request"` | Zod parse failure → error envelope |
| Aggregate set address | empty aggregate + resolved address | new aggregate with `address` slot populated (immutably) | n/a |

</intent-contract>

## Code Map

- `src/shared/schemas/address.ts` -- NEW: shared Zod address schemas (query, prediction, resolved structured AU address) + inferred types + AU state enum + postcode rule.
- `src/shared/schemas/index.ts` -- export the new address schemas.
- `src/shared/schemas/address.test.ts` -- NEW: schema validation tests (postcode, state enum, geo).
- `src/server/domain/ports/address-provider.ts` -- EVOLVE the port to `suggest(query): AddressPrediction[]` and `resolve(addressId): ResolvedAddress | null`, plain TS types structurally matching the shared inferred types.
- `src/server/adapters/address/stub-address-provider.ts` -- NEW: `createStubAddressProvider()` returning deterministic sample AU predictions + resolved details; unknown id → null.
- `src/server/adapters/address/stub-address-provider.test.ts` -- NEW: adapter determinism + unknown-id tests.
- `src/server/application/address.ts` -- NEW: use-cases `suggestAddresses(provider, query)` and `resolveAddress(provider, addressId)` (pure application layer, depends on the port).
- `src/server/application/address.test.ts` -- NEW: application tests with a fake provider.
- `app/api/v1/address/suggest/route.ts` -- NEW: BFF GET handler; validate `q`, call use-case, return envelope.
- `app/api/v1/address/resolve/route.ts` -- NEW: BFF GET handler; validate `addressId`, return envelope (not_found on null).
- `src/server/domain/flow/renovation-estimate-form.ts` -- NEW: flow aggregate type with an `address` slot + pure `emptyForm()` / `setAddress()` (AD-6).
- `src/server/domain/flow/renovation-estimate-form.test.ts` -- NEW: aggregate slot tests.
- `src/lib/query-client.ts` -- NEW: `makeQueryClient()` factory (sane defaults; no window-only code).
- `app/providers.tsx` -- wire `QueryClientProvider` (inside the existing provider stack).
- `src/features/address/use-address-suggest.ts` -- NEW: `useAddressSuggest(query)` TanStack Query hook calling the suggest route via `apiFetch` (demonstrates the seam; consumed by Story 2.3).
- `src/features/address/index.ts` -- NEW barrel.

## Tasks & Acceptance

**Execution:**
- [x] `src/shared/schemas/address.ts` -- define `addressQuerySchema`, `addressPredictionSchema`, `auStateSchema`, `resolvedAddressSchema` (street/suburb/state/postcode/geo), `addressPredictionsSchema`; export inferred types. Postcode = 4-digit string; state = AU enum (NSW/VIC/QLD/WA/SA/TAS/ACT/NT); geo = `{ lat: number, lng: number }`.
- [x] `src/shared/schemas/index.ts` -- re-export `./address`.
- [x] `src/shared/schemas/address.test.ts` -- valid/invalid postcode, invalid state, missing geo, prediction shape.
- [x] `src/server/domain/ports/address-provider.ts` -- evolve port to `suggest`/`resolve` with plain TS `AddressPrediction`/`ResolvedAddress` types; add a type-level check that they match the shared inferred types (`satisfies`/type test in the schema test).
- [x] `src/server/adapters/address/stub-address-provider.ts` -- deterministic stub: 3–5 sample AU addresses; `suggest` filters by case-insensitive substring on label, returns `[]` for <3 chars; `resolve` returns the structured address or null.
- [x] `src/server/adapters/address/stub-address-provider.test.ts` -- determinism, substring filter, short-query empty, unknown-id null.
- [x] `src/server/application/address.ts` -- `suggestAddresses`/`resolveAddress` delegating to the port; short-query guard returns `[]` without calling the provider.
- [x] `src/server/application/address.test.ts` -- use-cases with a fake provider (happy + short-query + unknown-id).
- [x] `app/api/v1/address/suggest/route.ts` -- parse `q` via schema; on invalid → `err("invalid_request", …)`; else `ok({ predictions })`. Instantiate the stub adapter server-side.
- [x] `app/api/v1/address/resolve/route.ts` -- parse `addressId`; invalid → `err("invalid_request")`; null → `err("not_found")`; else `ok({ address })`.
- [x] `src/server/domain/flow/renovation-estimate-form.ts` -- `RenovationEstimateForm` type with `address: ResolvedAddress | null`; `emptyForm()`, `setAddress(form, address)` returning a new immutable form.
- [x] `src/server/domain/flow/renovation-estimate-form.test.ts` -- empty form has null address; `setAddress` writes the slot immutably.
- [x] `src/lib/query-client.ts` -- `makeQueryClient()` with modest retry/staleTime defaults.
- [x] `app/providers.tsx` -- mount `QueryClientProvider` with a per-app client (stable via ref/module singleton pattern safe for SSR).
- [x] `src/features/address/use-address-suggest.ts` -- `useAddressSuggest(query)` using `useQuery`; `enabled` only when query length ≥ 3; queryFn calls `apiFetch('/api/v1/address/suggest?q=…', addressPredictionsSchema)`; returns the typed `ApiResult`/query state.
- [x] `src/features/address/index.ts` -- barrel export.

**Acceptance Criteria:**
- Given the Epic 1 foundation, when the address seam is built, then an `AddressProvider` port exists in domain with a deterministic stub adapter returning sample AU predictions, and no UI/vendor imports leak into domain/adapter layers.
- Given a client call, when it queries addresses, then it goes through a same-origin BFF route (never an external service directly) and both request and response use the shared Zod address schemas.
- Given a resolved address, when it is applied, then the flow aggregate exposes an `address` slot the resolved structured address writes into immutably.
- Given the async-ownership layer, when `useAddressSuggest` runs with a ≥3-char query, then it fetches through `apiFetch` under TanStack Query and yields typed predictions; a <3-char query issues no request.

## Design Notes

- **Port stays vendor-free:** domain declares plain `AddressPrediction`/`ResolvedAddress` interfaces; the shared zod schemas (which import zod) live in `src/shared` and the adapter/route/client use them. A `satisfies`-style type test guarantees the plain port types and the zod-inferred types stay structurally identical (no drift), without pulling zod into `src/server/domain`.
- **Two GET routes** keep suggest (cheap, debounced later) separate from resolve (id → full details), mirroring the port's two methods. Both return the AD-9 envelope so `apiFetch` handles them uniformly.
- **QueryClient SSR-safety:** create the client per request on the server and once on the browser (module-level singleton guarded by `typeof window`), the standard Next App Router TanStack pattern, to avoid cross-request state bleed.
- Sample AU data example (stub): `{ addressId: 'au-addr-1', label: '100 George St, Sydney NSW 2000', address: { street: '100 George St', suburb: 'Sydney', state: 'NSW', postcode: '2000', geo: { lat: -33.8615, lng: 151.2055 } } }`.

## Verification

**Commands:**
- `npm run typecheck` -- expected: exit 0
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: exit 0, new schema/adapter/application/aggregate/route tests green
- `npm run build` -- expected: exit 0 (routes compile, providers wire QueryClient)

**Manual checks:**
- `grep` confirms no `@mui|next|react` import under `src/server/domain` or `src/server/adapters`.
- no-adhoc-hex test stays green.

### 2026-08-12 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 4: (high 0, medium 3, low 1)
- defer: 0
- reject: 0
- addressed_findings:
  - `[medium]` `[patch]` Both routes now re-validate the RESPONSE payload with the shared schema (`addressPredictionsSchema` / `resolvedAddressEnvelopeDataSchema`) before wrapping in `ok()` — closes the AD-4 "validate input AND output" gap and removes the dead-code schemas.
  - `[medium]` `[patch]` Route INPUT is now validated with the shared `addressQuerySchema` / new `addressResolveQuerySchema` (trim+min(1)) instead of hand-rolled null checks — AD-4 input validation on the server.
  - `[medium]` `[patch]` Error envelopes now carry a real HTTP status: `invalid_request` → 400, `not_found` → 404 (success stays 200). `apiFetch` still honours the envelope; monitoring/tooling now see correct status.
  - `[low]` `[patch]` A blank/whitespace `addressId` (`?addressId=` or `%20%20`) now returns `invalid_request` (400) rather than falling through to `not_found`, via the trimmed resolve schema. Added tests for 400/404 statuses and the blank-id case.

## Auto Run Result

- **Summary:** Built the Epic 2 address seam end-to-end — shared Zod AU address schemas (query, prediction, resolved structured address with AU state enum + 4-digit postcode + geo), a deterministic stub `AddressProvider` adapter (4 sample AU addresses), BFF GET routes `/api/v1/address/suggest` + `/resolve` returning the AD-9 envelope with input+output schema re-validation and correct HTTP statuses, a domain flow aggregate (`RenovationEstimateForm`) exposing an immutable `address` slot (AD-6), and the TanStack Query async-ownership layer (SSR-safe `getQueryClient()` + `QueryClientProvider` + `useAddressSuggest` hook consuming the suggest route via `apiFetch`, AD-5). Establishes the retrospective's committed TanStack Query prerequisite.
- **Files changed:** `src/shared/schemas/address.ts` (+ `.test.ts`, index re-export); `src/server/domain/ports/address-provider.ts` (evolved to plain-TS suggest/resolve port); `src/server/adapters/address/stub-address-provider.ts` (+ `.test.ts`); `src/server/application/address.ts` (+ `.test.ts`); `app/api/v1/address/suggest/route.ts` + `resolve/route.ts` (+ `.test.ts` each); `src/server/domain/flow/renovation-estimate-form.ts` (+ `.test.ts`); `src/lib/query-client.ts`; `app/providers.tsx` (QueryClientProvider); `src/features/address/use-address-suggest.ts` + `index.ts`; `package.json`/`package-lock.json` (@tanstack/react-query).
- **Review findings:** 4 patches applied (3 medium: response re-validation, input schema validation, HTTP error statuses; 1 low: blank-id → invalid_request), 0 deferred, 0 rejected. Both reviewers (Blind + Edge Case Hunter) converged; layer purity, port↔schema type equivalence, QueryClient SSR-safety, and short-query guard were verified clean by both.
- **Verification:** `npm run typecheck`, `npm run lint`, `npm run build` all exit 0; `npm test` → 17 files, 85 tests pass. Layer purity confirmed (no `@mui`/`next`/`react`/`zod` in `src/server/domain/**` or `src/server/adapters/**`); no ad-hoc hex.
- **Residual risks:** Real provider (OI-6) still deferred — stub only. `useAddressSuggest` is wired but not yet consumed by UI until Story 2.3.
- `followup_review_recommended: false` — all convergent findings patched; fixes were localized and verified.
