---
title: 'Story 3.1 — ConfigSource port, stub adapter & versioned content schemas'
type: 'feature'
created: '2026-08-13'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '2c3c676a8911c0b2631201d6b05ffc6ca8ba86ca'
final_revision: '776106fb0ebde2588718e675a8318b812d69c976'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** The guided 3-step estimate form (Epic 3) must render its renovation types, Step 2 items, and Step 3 questions from data, never hardcoded (AD-8/AD-11/NFR-9), but no config seam exists yet — only scaffold port stubs (`ConfigSource.getRenovationItems`). Without a versioned content contract Stories 3.3–3.5 would hardcode content and Epic 4's estimate could not echo the config version it was built from.

**Approach:** Build the ConfigSource seam end-to-end, mirroring the proven Epic 2 AddressProvider seam: shared Zod schemas for the form content (renovation types, items, and a discriminated dynamic-question model covering all UX-DR8 field kinds), a plain-TS domain port with a type-drift guard, a deterministic stub adapter serving one versioned bundle of placeholder AU-renovation content, a single same-origin BFF route (`GET /api/v1/config/form`) that re-validates input-free output through the AD-9 envelope, and a TanStack Query hook (AD-5) the Epic 3 UI will consume. No UI is built here — this is the data seam only.

## Boundaries & Constraints

**Always:**
- Content is DATA, not code: the stub adapter holds the sample bundle; no renovation label, item, question, or field-kind is a literal in route/handler/UI code (AD-8/AD-11/NFR-9).
- The bundle carries a stable `configVersion` and every renovation type, item, and question carries a stable string `id`, so a later estimate request (Epic 4) can echo the exact version + item ids it was built from (AD-8).
- The SAME shared Zod schemas validate content on server (adapter output re-validated at the BFF before it leaves the seam) and are importable by the client (AD-4). The domain port declares plain-TS mirrors ONLY — no `zod` in the domain layer — kept structurally identical to the schemas by a type-level drift guard (`expectTypeOf`), exactly like `address.test.ts`.
- Layer purity: `src/server/domain/**` and `src/server/adapters/**` import no `@mui`/`next`/`react`/`zod`. The BFF route uses the shared schemas + envelope helpers (`ok`/`err`/`generateRequestId`) and returns the AD-9 envelope.
- The stub adapter is deterministic (no `Math.random`, no `Date`, no external I/O) and server-only.
- The dynamic-question model covers every UX-DR8 field kind: `radio`, `text`, `numeric`, `date`, `slider`, `select`, and a bounded `budget` min/max pair — as a discriminated union on a `kind` tag, so Story 3.5's renderer can switch exhaustively.
- Step 2 items are tagged with the renovation `typeId` they belong to so Step 1's choice can drive the Step 2 option set (FR-11/FR-13) without a code branch.

**Block If:**
- A real config backend / CMS choice is demanded (out of scope — stub only, like OI-6 was for address).

**Never:**
- Do NOT build any Step 1/2/3 UI, accordion, field renderer, or selection buttons (Stories 3.2–3.5).
- Do NOT commit to the FINAL Step 2 item content (OI-1 `[OPEN]`) or the FINAL Step 3 per-field validation rules (OI-2 `[OPEN]`). The stub content and the schema's validation-metadata fields are placeholders; carry generic required/bounds metadata only and flag OI-1/OI-2 in `deferred-work.md`.
- Do NOT add new runtime dependencies.
- Do NOT call the config route from the browser directly to any third party — same-origin BFF only (AD-1).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Adapter serves bundle | `createStubConfigSource().getFormConfig()` | Resolves the versioned bundle: `configVersion`, ≥2 renovation types, items tagged by `typeId`, questions covering all 7 field kinds | No error expected |
| BFF success | `GET /api/v1/config/form` | 200 success envelope; `data` re-validated with `formConfigSchema` before returning | No error expected |
| Schema round-trips content | Parse the stub bundle with `formConfigSchema` | Parses clean; each question's kind-specific fields validate (e.g. `select`/`radio` need `options`; `slider`/`budget` need `min`/`max`) | Malformed content → schema throws (guards adapter drift) |
| Question kind discriminates | A `budget` question | Validated with min/max pair; a `text` question rejects `options` requirement | Wrong-shape-for-kind → parse error |
| Client hook | `useFormConfig()` | TanStack Query issues one request via `apiFetch` against the route; returns typed `ApiResult<FormConfig>` envelope | Service error surfaces as `ok:false` envelope (non-throwing), not `isError` |
| Type-drift guard | Port types vs schema-inferred types | `expectTypeOf` asserts structural equivalence both directions | Compile fails if port and schema drift |

</intent-contract>

## Code Map

- `src/shared/schemas/config.ts` -- NEW. Shared Zod schemas: `renovationTypeSchema`, `renovationItemSchema` (with `typeId`), the discriminated `propertyQuestionSchema` (union over `kind`), and `formConfigSchema` (`configVersion` + `renovationTypes` + `items` + `questions`). Export inferred types.
- `src/shared/schemas/config.test.ts` -- NEW. Parses valid stub-shaped content; asserts each field kind's constraints; asserts bad-shape-for-kind rejects. Type-drift guard (`expectTypeOf`) between schema-inferred types and the domain port mirrors.
- `src/shared/schemas/index.ts` -- EDIT. Re-export `./config`.
- `src/server/domain/ports/config-source.ts` -- EDIT (evolve the scaffold). Replace `getRenovationItems`/`ConfigBundle` with `getFormConfig(): Promise<FormConfig>` and plain-TS mirrors `RenovationType`, `RenovationItem`, `PropertyQuestion` (discriminated union on `kind`), `FormConfig`. No zod.
- `src/server/adapters/config/stub-config-source.ts` -- NEW. `createStubConfigSource(): ConfigSource` returning a deterministic versioned bundle of placeholder AU-renovation content: Internal/External types, a handful of items per type, and questions exercising all 7 field kinds. Comment-flag OI-1/OI-2 placeholders.
- `src/server/adapters/config/stub-config-source.test.ts` -- NEW. Asserts determinism, version presence, items tagged by valid typeIds, all field kinds present, and that the served bundle parses through `formConfigSchema`.
- `app/api/v1/config/form/route.ts` -- NEW. `GET` handler: instantiate stub, get bundle, re-validate with `formConfigSchema`, return `ok(data, requestId)` envelope (AD-1/AD-9). No input to validate (no query params).
- `app/api/v1/config/form/route.test.ts` -- NEW. Asserts 200 + success envelope + payload parses; requestId present.
- `src/features/estimate-form/use-form-config.ts` -- NEW. `'use client'` `useFormConfig()` TanStack Query hook calling `apiFetch('/api/v1/config/form', formConfigSchema)` (AD-5). Mirrors `use-address-suggest.ts`.
- `src/features/estimate-form/index.ts` -- NEW. Barrel export for the hook (feature seam for Epic 3).
- `src/features/estimate-form/use-form-config.test.ts` -- NEW. Stubs `global.fetch`; asserts the hook queryFn hits the route and returns the typed envelope result.

## Tasks & Acceptance

**Execution:**
- [x] `src/shared/schemas/config.ts` -- author the shared content schemas incl. the discriminated question union over all 7 UX-DR8 field kinds -- data contract reused client+server (AD-4).
- [x] `src/server/domain/ports/config-source.ts` -- evolve the scaffold to `getFormConfig` + plain-TS mirrors -- domain port without zod (AD-2).
- [x] `src/server/adapters/config/stub-config-source.ts` -- deterministic versioned placeholder bundle -- config-as-data stub (AD-8/OI-1/OI-2).
- [x] `app/api/v1/config/form/route.ts` -- same-origin BFF route re-validating output through the envelope -- AD-1/AD-9.
- [x] `src/features/estimate-form/use-form-config.ts` (+ `index.ts`) -- TanStack Query hook -- async ownership (AD-5).
- [x] `src/shared/schemas/index.ts` -- re-export config schemas -- discoverability.
- [x] Tests for schema (incl. per-kind edge cases + type-drift guard), adapter, route, and hook -- cover the I/O matrix.
- [x] Append OI-1 + OI-2 `[OPEN]` product-confirmation flags to `deferred-work.md`.

**Acceptance Criteria:**
- Given the Epic 1/2 foundation, when the config seam is built, then a `ConfigSource` port exists with a stub adapter returning versioned content for renovation types, Step 2 items, and Step 3 questions (AD-2, AD-8).
- Given the served content, when it is validated, then it parses against shared Zod schemas reused client and server, and the domain-port mirrors are proven structurally identical by a type-drift guard (AD-4, AD-5).
- Given form content, when content changes, then it is data-driven configuration (in the adapter bundle), not code branches, so content changes need no route/UI edit (AD-11, NFR-9).
- Given the BFF route, when called, then it returns a 200 AD-9 success envelope whose payload re-validates against `formConfigSchema` before leaving the seam.
- Given the dynamic-question model, when a question is defined, then its `kind` is one of radio/text/numeric/date/slider/select/budget and its kind-specific fields validate (UX-DR8 field-renderer contract), with exact validation rules left generic pending OI-2.
- All four gates (typecheck, lint, test, build) exit 0; layer purity + no-adhoc-hex clean; no new dependencies.

## Spec Change Log

## Review Triage Log

## Auto Run Result

## Review Triage Log

Two reviewers ran (Blind Hunter + Edge Case Hunter). Blind Hunter: no material defects (verified config-as-data, output re-validation through the AD-9 envelope, layer purity, deterministic stub with valid typeId refs, all 7 kinds present, drift guard covers all 4 types both directions, no new deps).

Edge Case Hunter raised 11 boundary findings. Orchestrator triage (I set final severity):

**Patched (9)** — the seam's own Always-rule requires re-validating output "before it leaves the seam", so structural + referential integrity belongs IN the schema, not only the stub test:
1. **[patch] numeric `step` non-positive** — added `.positive()` (was missing vs slider/budget).
2. **[patch] numeric `min > max`** — added cross-field refinement (guarded only when both bounds present).
3. **[patch] slider `min > max`** — cross-field refinement.
4. **[patch] budget `min > max`** — cross-field refinement.
5. **[patch] date bounds non-ISO / inverted** — `minIso`/`maxIso` now `z.iso.date()` (honors the `Iso` field name) + inverted-pair refinement.
6. **[patch] duplicate ids within a collection** — `formConfigSchema` refinement asserts unique `renovationTypes`/`items`/`questions` ids (stable-id join-key contract for Epic 4, AD-8).
7. **[patch] item.typeId → missing renovation type** — referential-integrity refinement (Step 1→Step 2 drive, FR-11/FR-13, previously only stub-test-enforced).
8. **[patch] `appliesToItemIds` empty-string entries** — element `.min(1)`.
9. **[patch] `appliesToItemIds` → missing item + duplicate radio/select option values** — referential + option-uniqueness refinements (protect Story 3.5 reachability + answer→label mapping).

**Rejected (2)** — intentional per spec:
10. **[reject] empty `items` array** — the schema comment + spec explicitly permit empty `items`/`questions` in principle; the stub populates both. A flat `items` array spans all types; the per-type "≥1 selectable" concern is Story 3.4 (FR-14), not the seam. Requiring `.min(1)` would forbid legitimate partial configs.
11. **[reject] empty `questions` array** — same rationale; a config with no Step 3 questions is a valid (if minimal) bundle. Not a seam defect.

10 integrity tests added to `config.test.ts` covering the patched refinements. Tests: 156 → 166.

## Auto Run Result

- **Story:** 3.1 — ConfigSource port, stub adapter & versioned content schemas (FR-13/FR-15/FR-16; AD-2/AD-4/AD-5/AD-8/AD-11; NFR-9; UX-DR8 field model)
- **Outcome:** COMPLETE. Built the Epic 3 config seam end-to-end, mirroring the Epic 2 AddressProvider pattern: shared Zod `formConfigSchema` (renovation types, `typeId`-tagged items, and a discriminated `propertyQuestionSchema` over all 7 UX-DR8 field kinds — radio/select/text/numeric/date/slider/budget); a plain-TS domain `ConfigSource` port (`getFormConfig`) with an `expectTypeOf` drift guard (all 4 types, both directions); a deterministic stub adapter serving one versioned (`reno-config-v1`) placeholder AU-renovation bundle; a same-origin BFF `GET /api/v1/config/form` route that re-validates adapter output through the AD-9 envelope; and a TanStack Query `useFormConfig` hook (AD-5) with an extracted node-testable `fetchFormConfig`. The schema now self-guards structural + referential integrity (unique ids, valid typeId/item refs, bounded ranges, ISO dates) so the seam — not just the stub test — enforces the content contract. OI-1 (Step 2 content) + OI-2 (Step 3 validation rules) implemented as documented placeholders and flagged for product confirmation.
- **Files:** `src/shared/schemas/config.ts` (+`.test.ts`, index re-export); `src/server/domain/ports/config-source.ts` (evolved to `getFormConfig` + plain-TS mirrors); `src/server/adapters/config/stub-config-source.ts` (+`.test.ts`); `app/api/v1/config/form/route.ts` (+`.test.ts`); `src/features/estimate-form/use-form-config.ts` (+`.test.ts`, `index.ts`).
- **Gates:** typecheck ✓ · lint ✓ · test ✓ (29 files, 166 tests) · build ✓ (`/api/v1/config/form` registered).
- **Reviews:** Blind Hunter — no material defects. Edge Case Hunter — 11 findings: 9 patched (structural + referential integrity now enforced in-schema), 2 rejected (empty items/questions are intentional per spec). Layer purity clean (no `@mui`/`next`/`react`/`zod` in domain/adapter source); no new deps.
- **Residual risks:** OI-1/OI-2 content/rules unconfirmed (stub placeholders, flagged). Real config backend (CMS) deferred behind the port. No UI yet — Stories 3.2–3.5.
- `followup_review_recommended: false` — all patches are localized schema refinements with tests; rejections are spec-justified.
