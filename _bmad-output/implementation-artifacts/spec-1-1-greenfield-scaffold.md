---
title: 'Story 1.1 — Greenfield scaffold & Ports-and-Adapters skeleton'
type: 'feature'
created: '2026-08-12'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '28df17311d87c101fe0940585cef3c0147ecba6b'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** The renovation calculator has no codebase yet. Every later story (theme, shell, address, form, estimate, lead) needs a running app with a fixed Ports & Adapters structure, a shared Zod contract layer, a single BFF response envelope, and green build/typecheck/lint — otherwise each feature re-invents structure and drifts.

**Approach:** Scaffold a greenfield Next.js 16 App Router + TypeScript app, impose the hexagonal source tree (domain/ports/adapters behind a BFF, feature-sliced client), add a shared Zod schema package with one exported response-envelope type, wire one trivial BFF health route + placeholder home page that exercise the envelope, and make `build`, `typecheck`, and `lint` pass clean.

## Boundaries & Constraints

**Always:**
- Use Next.js 16 (App Router), React 19, TypeScript (strict) via the public npm registry; commit a project-level `.npmrc` with `registry=https://registry.npmjs.org/` because the machine's global npmrc points at an unusable Artifactory base URL.
- Enforce inward dependency direction: client (`app/`, `src/features`, `src/components`) → BFF route handlers (`app/api/**`) → application/use-cases → domain + ports. The domain/ports layer imports NO framework, React, MUI, Next, adapter, or vendor code.
- Define exactly one shared response envelope type (success = `{ ok: true, data, requestId }`, error = `{ ok: false, error: { code, message, fieldErrors? }, requestId }`) in the shared schemas package, exported and importable by both client and server.
- Ports are TypeScript interfaces in the domain/ports layer; each of EstimateEngine, AddressProvider, ConfigSource, LeadSink, AnalyticsSink gets a port interface stub file (interface only, or interface + trivially-empty stub adapter). No real external I/O.
- Money is represented as integer AUD cents in any domain/contract type introduced (none required to have amounts yet, but the convention must be documented in code where a money type is defined).
- `.gitignore` must exclude `node_modules/`, `.next/`, build output, and `.DS_Store`.
- Keep the scaffold lean and spike-calibrated: no feature logic beyond a health endpoint and placeholder home page.

**Block If:**
- The public npm registry is unreachable even after setting the project `.npmrc` (cannot install dependencies).
- `create-next-app` / equivalent cannot produce a Next.js 16 App Router TypeScript baseline.

**Never:**
- Do NOT implement any Epic 2–6 feature (address, form, estimate, lead, analytics emission, full theme/tokens, shell branding). Those are later stories. A placeholder home page and health route only.
- Do NOT add MUI theme tokens, header/footer branding, or feedback/motion/a11y primitives here (Stories 1.2–1.5).
- Do NOT call any real external service or embed API keys.
- Do NOT use the Pages Router.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Health check happy path | `GET /api/v1/health` | 200 with success envelope `{ ok: true, data: { status: "ok" }, requestId }` (requestId non-empty) | No error expected |
| Envelope helper — error | Application code builds an error envelope for code `X` | Returns `{ ok: false, error: { code: "X", message }, requestId }` | Message required; requestId always present |
| Home page load | `GET /` | 200, renders placeholder page (app title + "walking skeleton" copy), no console errors | No error expected |

</intent-contract>

## Code Map

- `package.json` -- deps/scripts (`dev`, `build`, `start`, `lint`, `typecheck`); Next 16 / React 19 / TS strict.
- `.npmrc` -- pin public npm registry so installs work despite global Artifactory config.
- `.gitignore` -- ignore `node_modules/`, `.next/`, build output, `.DS_Store`.
- `tsconfig.json` -- strict TS; path aliases (`@/*`, `@shared/*`, `@server/*`).
- `next.config.*` / `eslint` config -- Next 16 defaults + lint.
- `app/layout.tsx`, `app/page.tsx` -- root layout + placeholder home page (walking skeleton).
- `app/api/v1/health/route.ts` -- trivial BFF route returning the success envelope.
- `src/shared/schemas/envelope.ts` -- Zod schemas + exported TS types for success/error envelope + a `requestId` helper.
- `src/shared/schemas/index.ts` -- barrel export for shared schemas.
- `src/lib/api-client.ts` -- minimal client caller that parses the envelope (thin; full retry/pending logic is Story 1.4). Kept intentionally small.
- `src/server/domain/ports/*.ts` -- port interfaces: `estimate-engine.ts`, `address-provider.ts`, `config-source.ts`, `lead-sink.ts`, `analytics-sink.ts`.
- `src/server/domain/money.ts` -- `AudCents` branded type + doc comment (integer AUD cents convention).
- `src/server/application/health.ts` -- trivial use-case returning `{ status: "ok" }`, called by the health route (demonstrates client→BFF→application inward flow).
- `README.md` (project root or app) -- how to run (`npm install`, `npm run dev`), source-tree/dependency-rule note.

## Tasks & Acceptance

**Execution:**
- [x] `.npmrc` -- create with `registry=https://registry.npmjs.org/` -- installs must not hit the global Artifactory base URL.
- [x] `package.json` + Next.js scaffold -- initialize Next 16 App Router TS app (create-next-app or equivalent), add `typecheck` script (`tsc --noEmit`) -- provides the runnable baseline.
- [x] `tsconfig.json` -- enable strict mode and path aliases `@/*`, `@shared/*`, `@server/*` -- supports clean imports and the layering.
- [x] `src/shared/schemas/envelope.ts` + `index.ts` -- define Zod success/error envelope schemas, exported types, and a `requestId` generator -- single contract used by client and server.
- [x] `src/server/domain/ports/*.ts` (5 files) -- declare port interfaces for EstimateEngine, AddressProvider, ConfigSource, LeadSink, AnalyticsSink (method signatures may be minimal/placeholder but named per architecture) -- establishes the hexagonal seams.
- [x] `src/server/domain/money.ts` -- define `AudCents` branded integer type with convention doc comment -- locks the money representation early.
- [x] `src/server/application/health.ts` + `app/api/v1/health/route.ts` -- use-case + BFF route returning the success envelope -- proves the inward flow and envelope end-to-end.
- [x] `src/lib/api-client.ts` -- minimal envelope-parsing fetch helper (no retry yet; note that Story 1.4 extends it) -- single client→BFF caller seam.
- [x] `app/layout.tsx` + `app/page.tsx` -- root layout + placeholder home page -- the visible walking skeleton.
- [x] `.gitignore` -- ignore build artifacts, `node_modules/`, `.DS_Store` -- keep the tree clean.
- [x] `README.md` -- run instructions + dependency-rule note -- orient future stories.
- [x] Unit test the envelope helpers (success + error shape, requestId presence) -- covers the I/O matrix envelope rows.

**Acceptance Criteria:**
- Given a fresh clone, when `npm install` runs, then it resolves from the public registry and completes without registry 404s.
- Given the installed app, when `npm run build`, `npm run typecheck`, and `npm run lint` run, then all three exit 0 with no errors.
- Given the dev/prod server, when `GET /api/v1/health` is requested, then it returns HTTP 200 and a body matching the success envelope schema with a non-empty `requestId`.
- Given the source tree, when the domain/ports layer is inspected, then no file under `src/server/domain/**` imports React, Next, MUI, an adapter, or a vendor SDK (inward dependency rule holds).
- Given the shared schemas package, when both a client module and a server module import the envelope type, then both compile against the same exported definition.
- Given `GET /`, when the home page loads, then it renders placeholder walking-skeleton content with no runtime/console errors.

## Review Triage Log

### 2026-08-12 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 4 (medium 2, low 2)
- defer: 3
- reject: 6
- addressed_findings:
  - `[medium]` `[patch]` `src/server/domain/money.ts` — `audCents` used `Number.isInteger` while JSDoc claimed "safe integer"; switched to `Number.isSafeInteger` so values above 2^53 are rejected (matches the stated convention).
  - `[medium]` `[patch]` `src/server/domain/money.test.ts` — added missing unit tests for the money convention (safe/negative integers accepted; fractional, non-safe, NaN, Infinity rejected).
  - `[low]` `[patch]` `package.json` — removed unused devDeps `@eslint/eslintrc` and `eslint-config-next` (the flat config imports neither).
  - `[low]` `[patch]` `src/server/domain/ports/config-source.ts` — JSDoc overpromised "Step 3 questions"; reworded to match the interface (renovation items now, questions in a later story).
- notes: Rejected as info-asymmetry false positives (disproved by running the checks): "npm run lint is broken" (lint exits 0), "version pins unresolvable" (install/build/test green), "tsc ≠ tsgo typecheck mismatch" (typecheck exits 0). Rejected as non-issues: requestId fallback collision (dead path — Node 26 always has crypto.randomUUID), redundant type assertion (cosmetic), committed `.npmrc` public-registry pin (intentional and spec-mandated). Deferred to Story 1.4 / hardening: automated inward-dependency boundary lint rule, api-client error handling, extra strict tsconfig flags (see deferred-work.md).

## Design Notes

Envelope is the load-bearing contract for the whole app; get its shape right now so Story 1.4's `api-client` and every later feature build on it. Keep it minimal:

```ts
// src/shared/schemas/envelope.ts (shape illustration, ~lines)
export const SuccessEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ ok: z.literal(true), data, requestId: z.string().min(1) });
export const ErrorEnvelope = z.object({
  ok: z.literal(false),
  error: z.object({ code: z.string(), message: z.string(), fieldErrors: z.record(z.string()).optional() }),
  requestId: z.string().min(1),
});
```

Ports are interfaces only at this stage — do not wire concrete adapters. This is a walking skeleton: prioritise correct structure + green checks over surface area.

## Verification

**Commands:**
- `npm install` -- expected: completes, no 404, lockfile written.
- `npm run typecheck` -- expected: exit 0, no type errors.
- `npm run lint` -- expected: exit 0, no lint errors.
- `npm run build` -- expected: exit 0, Next build succeeds.
- `npm test` (or the configured unit test runner) -- expected: envelope helper tests pass.
- `curl -s localhost:3000/api/v1/health` (against `npm run dev`) -- expected: JSON success envelope with `requestId`.

**Manual checks:**
- Grep `src/server/domain/**` for `react|next|@mui|adapter` imports -- expected: none (inward dependency rule).

## Auto Run Result

Status: done

**Implemented change:** Greenfield Next.js 16 App Router + TypeScript (strict) walking skeleton with a Ports & Adapters source tree, one shared Zod response-envelope contract, five port interfaces (stubs), the `AudCents` money convention, a trivial BFF health route, a minimal envelope-parsing api-client seam, and a placeholder home page. Build/typecheck/lint/tests all green.

**Files changed (new unless noted):**
- `.npmrc` — pin public npm registry (works around global Artifactory config).
- `.gitignore` — ignore node_modules/.next/build output/.DS_Store.
- `package.json` / `package-lock.json` — Next 16 / React 19 / TS 7 / Zod 4 / vitest 4; scripts dev/build/start/lint/typecheck/test.
- `tsconfig.json` — strict + path aliases `@/*`,`@shared/*`,`@server/*`.
- `next.config.ts`, `eslint.config.mjs` — Next 16 config + flat ESLint (Next core-web-vitals).
- `app/layout.tsx`, `app/page.tsx` — root layout + placeholder walking-skeleton home.
- `app/api/v1/health/route.ts` — BFF health route returning the success envelope.
- `src/shared/schemas/envelope.ts` (+ `index.ts`, `envelope.test.ts`) — Zod envelope schemas, types, requestId + `ok()`/`err()` builders.
- `src/lib/api-client.ts` — minimal envelope-parsing fetch (Story 1.4 extends).
- `src/server/application/health.ts` — health use-case.
- `src/server/domain/money.ts` (+ `money.test.ts`) — `AudCents` branded integer type.
- `src/server/domain/ports/{estimate-engine,address-provider,config-source,lead-sink,analytics-sink}.ts` — port interfaces.
- `README.md` (modified) — run instructions, source tree, inward dependency rule.

**Review findings breakdown:** 4 patches applied (money safe-integer + JSDoc, money tests, remove 2 unused devDeps, ConfigSource doc), 3 items deferred to Story 1.4 / hardening (see `deferred-work.md`), 6 rejected (3 disproved by running checks; 3 non-issues).

**Follow-up review recommended:** false — patches were few, localized, and low-consequence.

**Verification performed:**
- `npm install` → exit 0, public registry, no 404.
- `npm run typecheck` (`tsc --noEmit`) → exit 0.
- `npm run lint` (`eslint .`) → exit 0.
- `npm run build` (`next build`) → exit 0; routes `/`, `/_not-found`, `ƒ /api/v1/health`.
- `npm test` (vitest run) → 12 tests passed (envelope 6, money 6).
- `npm run start` + `curl /api/v1/health` → `{"ok":true,"data":{"status":"ok"},"requestId":"…"}`; home renders "Reno Calculator / Walking Skeleton".
- Grep `src/server/domain/**` for react/next/@mui/adapter imports → none (inward rule holds).

**Residual risks:** api-client has no error handling yet (deferred to Story 1.4); inward dependency rule is convention-enforced only until a lint boundary rule is added (deferred). Both recorded in `deferred-work.md`.
