---
title: 'Story 4.1 — EstimateEngine port, deterministic stub & estimate identity'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'd9e2c555458b15d30609e03d5232a772bc864a26'
final_revision: 'c7af96fd896e3b1eedd801f8915a5b0a86d29c54'
---

<intent-contract>

## Intent

**Problem:** Epics 2–3 capture a full renovation scope (address + Step 1–3 answers) but there is no way to turn that scope into a cost range. Epic 4's value moment — and every downstream story (4.2–4.4, Epic 5 lead linkage) — needs an estimate to exist, end-to-end, before the real pricing algorithm (OI-3) is written.

**Approach:** Wire the already-scaffolded `EstimateEngine` port (AD-2) through the proven `ConfigSource` template: a deterministic **stub** adapter, a shared Zod request/response envelope, a BFF route, an application use-case, and a TanStack Query **mutation** hook. Money is integer AUD cents end-to-end (AD-7); every result carries a stable `estimateId` (deterministic hash of the scope) as the join key for lead linkage and cache invalidation. Land the long-deferred inward-dependency boundary arch test FIRST, before the new adapter.

## Boundaries & Constraints

**Always:**
- Money is integer `AudCents` (`src/server/domain/money.ts`) throughout the domain, adapter, and envelope; a formatted AUD string is produced ONLY at the view edge via a pure helper. `costMin <= costMax`.
- The stub is fully deterministic — no `Math.random`, no `Date`, no external I/O — so the same scope always yields the same `estimateId` and range (stable cache key). Different scope ⇒ different `estimateId`.
- The EstimateEngine rides the exact AD-9 seam: BFF validates the request body with the shared schema, calls the application use-case over the port, re-validates the response payload, and returns it via `ok(...)`/`err(...)`. The client calls it through `apiFetch` (non-throwing; failure is `data.ok === false`).
- Dependency direction stays inward: `src/server/domain/**` and `src/server/adapters/**` import no `@mui`/`next`/`react`/`zod` (JSDoc mentions OK). The new boundary arch test enforces this.
- OI-3 pricing lives ENTIRELY inside the stub adapter; the port interface, envelope, use-case, route, and hook carry no pricing logic, so the real engine drops in as a single adapter substitution with no change above the port (FR-23).

**Block If:**
- A stakeholder requires real/accurate pricing numbers in this story (the stub is intentionally indicative; OI-3 remains `[OPEN]`). — Do NOT halt for the placeholder magnitudes themselves; document them as `[ASSUMPTION]`.

**Never:**
- No floating-point dollars anywhere in core/adapter/envelope. No `@mui/x` or any new dependency. No real HTTP/CMS/pricing-service call. No Results UI in this story (cards/states/actions are 4.2–4.4). No jsdom/RTL; Node-only tests.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path | POST `/api/v1/estimate` with `{configVersion, itemIds:[...]}` for a valid scope | 200 success envelope `{estimateId, costMin, costMax, confidence}`; `costMin<=costMax`; deterministic id | No error expected |
| Determinism | Same request twice | Byte-identical `estimateId` + range both times | No error expected |
| Distinct scope | Two requests differing in `itemIds` | Different `estimateId` | No error expected |
| Empty scope | `itemIds: []` | Success envelope with `confidence: 'low'` and a minimal/zero-based range (honest, not false-precise) — feeds 4.3 empty/low-confidence | No error expected |
| Invalid body | POST with missing/blank `configVersion` or non-array `itemIds` | 400 error envelope `{code:'invalid_request', message, requestId}` | Validated at the BFF; not routed to the engine |
| Client transport error | Network/5xx/non-envelope | `apiRequest` resolves to `{ok:false, error, requestId}` (retry only transient) | Non-throwing; consumer renders error state |
| Boundary violation | A `src/server/domain/**` file imports `next`/`react`/`@mui`/an adapter | The boundary arch test FAILS | Test is the guard |

</intent-contract>

## Code Map

- `src/server/domain/ports/estimate-engine.ts` -- EXISTS; extend `EstimateEngineResult` with `confidence: EstimateConfidence` (`'low'|'medium'|'high'`) and export the `EstimateConfidence` type. Keep plain-TS (no zod).
- `src/server/domain/money.ts` -- EXISTS; reuse `AudCents`/`audCents`. No change.
- `src/server/adapters/estimate/stub-estimate-engine.ts` -- NEW: `createStubEstimateEngine(): EstimateEngine`. Deterministic per-item base-cost table (placeholder `[ASSUMPTION]` magnitudes), sum → `costMin`, `costMax = costMin + spread`; `estimateId` = deterministic hash of `configVersion` + sorted `itemIds`; `confidence` derived from item count (0 → low). Server-only, pure.
- `src/shared/schemas/estimate.ts` -- NEW: `estimateRequestSchema` (`configVersion: string.min(1)`, `itemIds: string[]`), `estimateResultSchema` (`estimateId: string.min(1)`, `costMin/costMax: int().nonnegative()`, `confidence: enum`), superRefine `costMin<=costMax`. Inferred `EstimateRequest`/`EstimateResult`.
- `src/shared/schemas/index.ts` -- add `export * from "./estimate"`.
- `src/server/application/estimate.ts` -- NEW: `requestEstimate(engine, request): Promise<EstimateEngineResult>` — pure orchestration over the port (mirror `application/address.ts`).
- `app/api/v1/estimate/route.ts` -- NEW: `POST` — parse+validate body with `estimateRequestSchema` (400 `err('invalid_request', …)` on failure), call `requestEstimate(createStubEstimateEngine(), …)`, re-validate with `estimateResultSchema`, return `ok(...)`.
- `src/features/estimate-form/use-estimate.ts` -- NEW: `requestEstimate(request): Promise<ApiResult<EstimateResult>>` via `apiFetch('/api/v1/estimate', estimateResultSchema, {method:'POST', body, headers})`; `useEstimate()` = `useMutation`. Extract the fetch as a plain `global.fetch`-testable function (mirror `use-form-config.ts`).
- `src/lib/money-format.ts` -- NEW: pure `formatAud(cents: number): string` (cents→`"$32,700"`, integer, no float) + `formatAudRange(min, max): string`. View-edge helper; no domain import beyond the `AudCents` type.
- `src/server/architecture.test.ts` -- NEW: the inward-dependency boundary test (first task).
- Test files alongside each new source file (`.test.ts`), Node-only.

## Tasks & Acceptance

**Execution:**
- [x] `src/server/architecture.test.ts` -- FIRST: scan every file under `src/server/domain/**` and `src/server/adapters/**` and assert none import `next`, `react`, `@mui/*`, or a sibling adapter path; a JSDoc mention (`* ...`) is allowed, an `import`/`from` is not -- retires the manual grep carried unaddressed from Epic 1/2/3.
- [x] `src/server/domain/ports/estimate-engine.ts` -- add `EstimateConfidence` + `confidence` on the result -- gives 4.2/4.3 the Confidence indicator + empty/low-confidence signal without a later port change.
- [x] `src/shared/schemas/estimate.ts` (+ index export) -- request/response schemas with `costMin<=costMax` refine -- the AD-9 envelope contract for the estimate seam; re-used by BFF + client.
- [x] `src/server/adapters/estimate/stub-estimate-engine.ts` -- deterministic stub (hash id, per-item range, confidence) -- OI-3 lives here and nowhere else.
- [x] `src/server/application/estimate.ts` -- `requestEstimate` use-case over the port -- keeps the route thin and the pricing swappable.
- [x] `app/api/v1/estimate/route.ts` -- POST BFF route: validate body → use-case → re-validate → envelope -- the seam; 400 on invalid body.
- [x] `src/features/estimate-form/use-estimate.ts` -- `requestEstimate` fn + `useEstimate` mutation -- TanStack async ownership; node-testable via `global.fetch` stub.
- [x] `src/lib/money-format.ts` -- pure `formatAud`/`formatAudRange` -- the ONLY cents→AUD conversion; exhaustively tested (zero, boundaries, thousands separators, no float drift).
- [x] Unit tests for every I/O-matrix row (determinism, distinct-scope, empty-scope, invalid-body 400, transport error, boundary test).

**Acceptance Criteria:**
- Given a completed scope, when an estimate is requested through the BFF, then the `EstimateEngine` stub returns `{estimateId, costMin, costMax, confidence}` with `costMin<=costMax` in integer AUD cents (FR-19, AD-2, AD-7).
- Given the same scope requested twice, when the stub runs, then the `estimateId` and range are identical; given a different scope, then the `estimateId` differs (AD-6, AD-9 — stable join/cache key).
- Given an invalid request body, when it hits the route, then a 400 error envelope is returned and the engine is never called.
- Given the domain/adapter layers, when the boundary arch test runs, then any inward-dependency import fails it (Epic 1/2/3 action item).
- Given OI-3 is unresolved, when the real algorithm later replaces the stub, then only `stub-estimate-engine.ts` changes — no edit above the port (FR-23).

## Design Notes

Deterministic `estimateId` (no crypto dependency needed): fold a small FNV-1a-style hash over `configVersion + '|' + [...itemIds].sort().join(',')`, render as a short hex string prefixed `est_`. Stable for identical scope, distinct across scopes, no `Date`/`random`.

Stub pricing (`[ASSUMPTION]` — indicative only, OI-3 `[OPEN]`): a per-item base-cost map in cents (e.g. kitchen 2_500_000, bathroom 1_500_000, …), unknown items fall back to a default; `costMin = sum(base)`, `costMax = costMin + round(costMin * SPREAD)`. Empty `itemIds` ⇒ `costMin = costMax = 0`, `confidence: 'low'`. `confidence` = low (0 items) / medium (1–2) / high (3+) — a placeholder heuristic that gives 4.3 a real empty/low-confidence path. All values via `audCents(...)`.

`formatAud`: `formatAud(3270000)` ⇒ `"$32,700"` — integer dollars = `Math.round(cents/100)` then group with a thousands separator; never construct money via float math. Keep it in `src/lib` (view edge), NOT the domain.

## Verification

**Commands:**
- `npm run typecheck` -- expected: exit 0
- `npm run lint` -- expected: exit 0
- `npm test` -- expected: exit 0, all suites green incl. the new boundary + estimate + money-format tests
- `npm run build` -- expected: exit 0
- `grep -rn "@mui\|from 'next'\|from 'react'\|from 'zod'" src/server/domain src/server/adapters` -- expected: only JSDoc lines (now also asserted by `src/server/architecture.test.ts`)

## Review Triage Log

Blind Hunter + Edge Case Hunter ran in parallel against the diff since `d9e2c55`. Orchestrator set final severity. Both converged on the boundary arch test (this story's headline deliverable) being evadable.

| # | Finding | Severity | Disposition |
|---|---------|----------|-------------|
| 1 | Boundary arch test scanned line-by-line → missed ALL multiline imports (the idiomatic multi-symbol form already used in this codebase); also missed relative cross-layer paths, dynamic `import()`, `.tsx/.mts` files; false-positived on import-like string literals; flagged own-folder adapter imports; could infinite-recurse on symlinks (BH#1 HIGH + EH#1/#5/#6/#7/#11/#13) | HIGH | **patch** — full rewrite: whole-file scan over comment+string-stripped source, 5 global multiline-aware matchers (import/export-from, bare import, dynamic import, require), alias+relative→absolute layer resolution, own-subdir allowed, all TS extensions, symlink-skip walk, and a strengthened self-check asserting multiline/relative/dynamic catches + JSDoc/string/own-folder decoys. |
| 2 | 32-bit FNV-1a `estimateId` too weak for a value promoted to a durable join key (Epic 5 lead linkage + cache invalidation) — birthday collisions cross-link leads / serve stale estimates (BH#3) | MED | **patch** — widened to a 2-lane 64-bit digest `est_[0-9a-f]{16}`; still deterministic, order-independent, empty-scope-stable. |
| 3 | Duplicate `itemIds` double-counted cost + shifted the id; empty-string ids silently priced; unbounded array risked `audCents` overflow (BH#6/EH#4/EH#10/EH#12) | MED | **patch** — schema `itemIds: array(string().min(1)).max(200)`, `configVersion: trim().min(1)`; stub dedupes once (`new Set`) for cost, confidence, and id → set-like scope semantics. |
| 4 | Route re-validation used throwing `.parse` → a bad result (reachable by the future OI-3 engine) becomes a bare 500 with no envelope/requestId, breaking AD-9 (BH#4/EH#3) | MED | **patch** — `safeParse` + try/catch around the use-case → controlled `err('internal_error', …, {requestId})` 500 envelope; extracted a testable helper. |
| 5 | `formatAud` returned garbage for NaN/Infinity; `formatAudRange` rendered inverted ranges backwards; money tests asserted only "no dot" not exact rounded value (EH#8/EH#9/BH#7) | LOW | **patch** — finite-guard → `$0`, ordered range args; tests assert exact values ($32,701/$32,700/$0/NaN/Infinity, ordered range). |
| 6 | `apiFetch` retries the estimate POST (non-idempotent) — harmless today (pure computation) but unsafe once the seam gains a write in Epic 5 (BH#5) | LOW | **defer** — Epic 5 (when the seam becomes stateful); `// NOTE:` left in `use-estimate.ts`. |
| — | Money rounding honesty (`Math.round(cents/100)` half-up, no float drift, no off-by-100), Intl en-AU/AUD no trailing cents, `audCents` safe-int guard, determinism (no Date/random, sorted, empty-scope stable), `superRefine` costMin<=costMax + negative/float/blank rejections, no stub leak to client bundle, route 400 handling | — | **verified correct by both reviewers.** |

## Auto Run Result

- **Outcome:** SUCCESS
- **Story:** 4.1 — EstimateEngine port, deterministic stub & estimate identity
- **Baseline:** `d9e2c55`
- **Implementation:** SYNC subagent — landed the inward-dependency **boundary arch test FIRST** (carried unaddressed from Epic 1/2/3), then extended the `EstimateEngine` port with `confidence`, and built the deterministic stub adapter, shared request/response envelope schema, POST BFF route, application use-case, TanStack mutation hook, and a pure cents→AUD money formatter — all mirroring the proven `ConfigSource` template. Money is integer AUD cents end-to-end (AD-7); `estimateId` is a deterministic scope hash.
- **Review:** Blind Hunter + Edge Case Hunter (parallel). 6 finding-groups → 5 patched, 1 deferred (non-idempotent POST retry → Epic 5). 0 rejected. The HIGH (arch-test multiline blindness) was treated as blocking and fully rewritten.
- **Gates (post-patch):** typecheck ✅ · lint ✅ · test ✅ **342 passed (53 files)** · build ✅ (`/api/v1/estimate` generated). Layer-purity grep clean (JSDoc only) — now also machine-enforced by `src/server/architecture.test.ts`; no-adhoc-hex ✅; Epics 1–3 regressions ✅.
- **New dependencies:** none.
