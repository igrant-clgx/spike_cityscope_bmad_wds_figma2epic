---
title: 'Story 5.1 — LeadSink port, stub store & shared lead schema'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'c6b4ddf'
final_revision: '603cc06'
---

<intent-contract>

## Intent

**Problem:** Epic 5 needs a server-side seam to capture a consented lead linked to the current `estimateId` without a real CRM — a `LeadSink` port with a stub store, a shared Zod lead schema (AD-4), BFF-only PII (AD-1/NFR-6), and a consent gate + encryption-at-rest marking (AD-10). None of the capture path exists yet (only the port interface stub).

**Approach:** Build the lead seam by copying the proven EstimateEngine template verbatim: extend the `LeadSink` port with the full lead payload (plain TS mirror), add a `src/shared/schemas/lead.ts` shared request/receipt schema (AU phone/email formats, consent-must-be-true, `est_[0-9a-f]{16}` estimateId format) exported from the schemas barrel, a consent-gated **stub store adapter** that marks each stored record for encryption-at-rest + 24-month retention, a thin application use-case, a same-origin BFF `POST /api/v1/leads` route (re-validate input AND output → AD-9 envelope), and a client `useLeadCapture()` mutation hook under a new `src/features/lead/` slice. The client touches only the BFF; the stub store is instantiated server-side and never exposed.

## Boundaries & Constraints

**Always:** Copy the estimate seam shape exactly (stub adapter → application use-case → BFF route re-validating input+output → non-throwing `apiFetch` → `useMutation`). PII crosses the BFF only (AD-1/NFR-6): the browser calls only `/api/v1/leads`; NO PII in any `NEXT_PUBLIC_*`/query string/log; mask phone in any log line; propagate `requestId` (AD-9). The `LeadSink` adapter REJECTS any capture lacking a truthy `consent` (AD-10, defense-in-depth behind the future UI gate) and marks the stored record for encryption-at-rest + retention. The shared schema is the single source of the lead contract (AD-4), reused client + server; AU phone/email validation lives in the schema (FR-28) — extract the AU-format checks as PURE, exhaustively-tested helpers. Keep the domain port zod-free (plain TS mirror) so `src/server/architecture.test.ts` stays green (domain/adapters import no `next`/`react`/`@mui`/`zod`; no adapter imports another). Money/PII: no floats involved here. Node-only tests; no new dependencies. Preserve requirement IDs verbatim.

**Block If:** Capturing a lead would require a field or a validation rule not derivable from FR-27/FR-28 and the UX lead-form spec (would need a Product decision). Do NOT invent CRM behaviour (OI-11).

**Never:** Do NOT build the Contact Section/phone CTA (Story 5.2), the lead FORM UI (Story 5.3 — gated on OI-10), or the submit-states surface (Story 5.4). Do NOT integrate a real CRM (OI-11 — stub store only). Do NOT expose the stub store or any PII to the client bundle. Do NOT add zod to the domain/adapter layers.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Valid consented lead | well-formed body, `consent: true`, valid AU email/phone, valid `estimateId` | 200 AD-9 success envelope `{ leadId }`; record stored (encryption+retention marked) | none |
| Missing consent | `consent: false`/absent | 400 `invalid_request` (schema rejects); sink also rejects if reached | Schema `consent: literal(true)`; sink throws → controlled 400/500 |
| Invalid AU phone/email | bad phone or email | 400 `invalid_request`; engine/store never called | inline via schema |
| Bad `estimateId` format | not `est_[0-9a-f]{16}` | 400 `invalid_request` | schema regex |
| Non-JSON body | not JSON | 400 `invalid_request`, store never called | try/catch on `request.json()` |
| Output re-validation fails | adapter returns malformed receipt | 500 controlled error envelope (never bare throw) | `safeParse` on output |
| Client submit | `useLeadCapture().mutate(req)` | resolves `ApiResult<LeadReceipt>` (`data.ok===false` on failure, non-throwing) | apiFetch envelope |

## Code Map

- `src/server/domain/ports/lead-sink.ts` -- extend `LeadCapture` to the full plain-TS lead payload (estimateId, firstName, lastName, email, phone, contactMethod, bestTime?, consent); keep `LeadReceipt { leadId }`; zod-free.
- `src/shared/schemas/lead.ts` -- NEW. `leadCaptureRequestSchema` (AU email/phone via pure helpers, `consent: z.literal(true)`, `estimateId` regex, name min-length, `contactMethod` enum, optional `bestTime` enum) + `leadReceiptSchema` (`leadId`); inferred `LeadCaptureRequest`/`LeadReceipt`.
- `src/shared/schemas/au-formats.ts` -- NEW (or co-located). Pure `isAuPhone`/`isAuEmail` (or `normalizeAuPhone`) helpers, exhaustively unit-tested; consumed by the schema.
- `src/shared/schemas/index.ts` -- export `./lead` (and `./au-formats` if separate).
- `src/server/adapters/lead/stub-lead-sink.ts` -- NEW. `createStubLeadSink()`: consent-gated (reject `!consent`), deterministic `leadId` (FNV-style, no Date/random), in-memory store, each stored record MARKED `encryptAtRest: true` + retention; server-only; no PII in logs (mask phone).
- `src/server/application/lead.ts` -- NEW. Thin `captureLead(sink, lead)` orchestration (mirror `application/estimate.ts`).
- `app/api/v1/leads/route.ts` -- NEW. `POST`: parse JSON → `leadCaptureRequestSchema.safeParse` (400 on fail) → `captureLead(createStubLeadSink(), data)` → re-validate receipt with `leadReceiptSchema` → AD-9 `ok`/`err` envelope; `respondWithReceipt` extracted + unit-testable.
- `src/features/lead/use-lead-capture.ts` -- NEW. `requestLeadCapture(req): Promise<ApiResult<LeadReceipt>>` via `apiFetch` POST + `useLeadCapture()` mutation (mirror `use-estimate.ts`).
- `src/features/lead/index.ts` -- NEW barrel.
- Tests: `au-formats.test.ts`, `lead.schema` cases in `lead.test.ts`, `stub-lead-sink.test.ts` (consent gate, encryption/retention marking, deterministic id), `application/lead.test.ts`, `app/api/v1/leads/route.test.ts` (happy + each 400/500), `use-lead-capture.test.ts` (global.fetch stub). Extend `architecture.test.ts` coverage is automatic (it walks the new adapter).

## Tasks & Acceptance

**Execution:**
- [x] `src/server/domain/ports/lead-sink.ts` -- extend `LeadCapture` to the full plain-TS lead payload; zod-free mirror of the schema.
- [x] `src/shared/schemas/au-formats.ts` + `au-formats.test.ts` -- pure AU email/phone validators, exhaustively tested (mobile/landline/+61/spaces/invalid).
- [x] `src/shared/schemas/lead.ts` + `lead.test.ts` -- shared `leadCaptureRequestSchema` (consent literal-true, AU formats, estimateId regex, enums) + `leadReceiptSchema`; barrel export.
- [x] `src/server/adapters/lead/stub-lead-sink.ts` + test -- consent-gated stub store; encryption-at-rest + retention marking; deterministic `leadId`; phone masked in any log.
- [x] `src/server/application/lead.ts` + test -- thin `captureLead` use-case.
- [x] `app/api/v1/leads/route.ts` + `route.test.ts` -- BFF POST re-validating input AND output; AD-9 envelopes for every branch.
- [x] `src/features/lead/use-lead-capture.ts` + `index.ts` + test -- client mutation via `apiFetch`, node-tested with a `global.fetch` stub.

**Acceptance Criteria:**
- Given the Epic 1 foundation, when the lead seam is built, then a `LeadSink` port exists with a stub store adapter (AD-2 style seam) and the boundary arch test stays green.
- Given a lead submission, when it flows to storage, then all PII crosses the BFF only (client → `/api/v1/leads` → server) and never client-to-external (AD-1, NFR-6).
- Given the lead payload, when it is validated, then a shared Zod lead schema validates it on BOTH client and server with AU phone/email formats (AD-4, FR-28).
- Given a capture request, when consent is absent/false, then it is rejected (schema + sink, AD-10) and no record is stored; when stored, the record is marked for encryption at rest.
- Given the client hook, when `useLeadCapture().mutate` runs, then it resolves a non-throwing `ApiResult<LeadReceipt>` (`data.ok===false` on failure).

## Spec Change Log

## Review Triage Log

Two adversarial reviewers ran in parallel against the full diff (Blind Hunter + Edge Case Hunter, model opus-4.8). Orchestrator set final severities. 11 finding-groups → 5 patched, 4 documented deferrals, 2 cleared-as-by-design.

**Patched (final severity):**
- **MED — `leadId` collision across separate requests** (BH#1 / EH#5). The disambiguation counter was per-sink-instance, but the route builds a fresh sink per POST, so two identical resubmits both hashed with `seq=1` and produced the SAME `leadId` — a real defect once the OI-11 CRM keys on `leadId`. Fix: hoisted the counter to module scope (`leadSeq`), corrected the docstring, and FLIPPED the misleading "identical across fresh sinks" test to assert DISTINCT ids across per-request sinks.
- **MED — `isAuEmail` false-accepts malformed dot placement** (EH#1): `.jane@…`, `a..b@…`, `jane@example..com`, `jane@example.com.`, `jane@.example.com` all passed. Fix: tightened regex to a dot-labelled local + domain (`^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)*\.[a-zA-Z]{2,}$`); added 6 reject cases.
- **MED — `isAuPhone` false-rejects common separators** (BH#3 / EH#2): `0412-345-678`, `(02) 9876 5432`, `0412.345.678` were rejected — formats a user will type into the Story 5.3 form. Fix: allow + strip `-` `(` `)` `.` before the digit match; added 3 accept cases.
- **LOW — no max length on `firstName`/`lastName`** (EH#4): unbounded PII stored/echoed. Fix: `.trim().min(2).max(100)` on both.
- **LOW — `maskPhone` reveals short/degenerate numbers** (EH#6): a 1–3 digit value leaked in full. Fix: fully mask (`***`) when digit count < 4; added tests.

**Documented deferrals (not fixed this story):**
- **LOW — non-idempotent lead POST retried by `apiFetch`** (BH#2): the reused `apiFetch` retries 5xx/network up to 2×; a lead is a stateful mutation. Deferred to Story 5.4 (disable retry / idempotency key for the mutation) — recorded in `deferred-work.md`.
- **LOW — `estimateId` existence not verified** (BH#5): format-only check; no registry in the spike. Deferred to OI-11 CRM connector (already flagged `OI-11 [OPEN]` in-code).
- **LOW — all-zeros / sentinel phone accepted** (EH#3): format-valid but semantically impossible. Deferred — semantic-plausibility validation is out of spike scope; recorded in `deferred-work.md`.
- **LOW — `maskPhone` not yet invoked on any production log path** (BH#4): it is the NFR-6 safety-net seam; no lead-slice code logs today (verified zero `console.*`). Kept as a ready seam; not a defect.

**Cleared as by-design (verified by both reviewers):** PII containment (no `console.*`, no `NEXT_PUBLIC`/query-string PII, error envelopes carry only static literals); stub store server-only; consent gate enforced at schema (`z.literal(true)`) AND sink; every route branch returns an AD-9 envelope (non-JSON/null/array body → 400, output-revalidation/sink-throw → controlled 500, no bare throws); zod strips unknown extra fields; layer purity (arch test green); `use-lead-capture` asserts `data.ok===false` non-throwing path; no hollow/always-true tests.

## Auto Run Result

- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel, opus-4.8). Findings: 11 groups → 5 patched (2 MED collision/email, 1 MED phone, 2 LOW name-max/mask), 4 deferred (documented), 2 cleared.
- **Gates:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (65 files, 464 tests) · `build` ✓ (route `ƒ /api/v1/leads` emitted).
- **Arch boundary test** green (new lead adapter auto-walked, imports no next/react/@mui/zod, no cross-adapter import).
- **Outcome:** Story 5.1 COMPLETE. Lead seam (port → stub sink → use-case → BFF route → client hook) + shared AU-validated lead schema landed; PII crosses the BFF only; consent gate at schema + sink; deterministic non-colliding `leadId` as the estimate join key.
