# Security, Privacy, Reliability & Observability Verification (Story 6.4)

- **Date:** 2026-08-14
- **Epic:** 6 — Release Readiness & Verification
- **Requirements:** NFR-5 (security), NFR-6 (privacy), NFR-7 (reliability), NFR-8 (observability), AD-10 (lead consent/encryption/retention), AD-12 (typed analytics seam); records OI-11 (real CRM sink)
- **Method:** Each cross-cutting invariant gets a `pass` (statically verified against enforcement code + passing tests, cited), `manual-pass` (an infra/deploy control the node-only harness cannot exercise, documented), or `deferred` (a real-backend concern routed to OI-11). This is the **strongest in-harness verification story**: the PII boundary, no-PII analytics, and consent gate are enforced by compiling code and passing tests, so most of the audit is citing existing machine enforcement.

> **Harness ceiling:** the spike ships **stub adapters only** — no real CRM, no real crypto, no real rate-limiter, no deployed TLS/CORS/API-key config. So NFR-5 transport/config controls and the *real* at-rest encryption + rate-limiting are **`manual-pass` (deploy control) or `deferred` (OI-11)**, not asserted. What CAN be verified in-harness — the PII *boundary architecture*, the no-PII *event contract*, the consent *gate*, the encryption/retention *markings*, phone *masking*, and *requestId* propagation — is verified and cited.

---

## 1. Privacy / PII boundary (NFR-6, AD-1, AD-10)

| Invariant | Verdict | Evidence |
|---|---|---|
| PII never reaches the client bundle (server-only sink) | ✅ pass | `stub-lead-sink.ts` is instantiated **inside the route** (`app/api/v1/leads/route.ts` `createStubLeadSink()` per-POST) and never imported by client code; `peek()` is documented server/test-only. The inward-dependency boundary arch test (`src/server/architecture.test.ts`) structurally forbids `next`/`react`/`@mui` in `domain`/`adapters`, keeping the sink server-pure. |
| PII is a DELIBERATELY separate transport concern from analytics | ✅ pass | `LeadCapture` (PII: firstName/lastName/email/phone) lives in `lead-sink.ts`; the analytics `AnalyticsEvent` union carries only ids/categories. `idempotencyKey` is a **separate param on `capture()`**, never a `LeadCapture` field or zod-body field → never becomes PII on the payload (`lead-sink.ts` doc + `route.ts`). |
| Phone masked in any log line | ✅ pass | `maskPhone()` returns `***` + last-3 only (`***` fully when <4 digits); documented "no raw PII is ever logged". Route explicitly logs no PII. |
| No PII in `NEXT_PUBLIC_*` / query strings / URLs | ✅ pass (static) | Lead PII crosses only the same-origin BFF POST body; grep confirms no lead field on any `NEXT_PUBLIC_*` var or query string. |
| PII encrypted **in transit** (TLS 1.2+) | ⚠ manual-pass | A deploy/infra control (NFR-5) — the harness cannot exercise TLS. Recorded: same-origin HTTPS required in the deployed environment. |
| PII encrypted **at rest** (real crypto) | 🔻 deferred → OI-11 | The stored record is **marked** `encryptAtRest:true` + `retentionMonths:24` (see §2), but real encryption is applied by the CRM connector (OI-11), not the stub store. |

## 2. Consent gate, encryption marking & retention (AD-10, NFR-6, FR-30)

| Invariant | Verdict | Evidence |
|---|---|---|
| Consent-less capture is REJECTED | ✅ pass | `stub-lead-sink.ts` `capture()` rejects with `"Lead capture requires explicit consent."` when `!lead.consent` — **defense in depth** behind the UI gate (FR-30). Route turns the throw into a controlled 500 envelope (no PII). |
| Consent gate ordered BEFORE dedup | ✅ pass | The consent check runs **first**, before the `idempotencyLedger` lookup — documented + coded — so a consent-less retry can never be short-circuited into a spurious success. |
| Consent enforced by the shared schema too | ✅ pass | `route.ts` rejects `consent !== true` at `leadCaptureRequestSchema.safeParse` (HTTP 400, sink never called) — a second, earlier gate. |
| Stored lead marked for encryption at rest | ✅ pass (marking) | `StoredLeadRecord.encryptAtRest: true` (literal type) on every pushed record; the seam the real connector honours. Real crypto = OI-11 (§1). |
| 24-month retention policy marked | ✅ pass | `RETENTION_MONTHS = 24` → `retentionMonths` on every record (AU Privacy Act, NFR-6). Real retention/expiry enforcement = OI-11. |

## 3. Observability — no-PII analytics + requestId (NFR-8, AD-12)

| Invariant | Verdict | Evidence |
|---|---|---|
| Analytics events carry NO PII (compile-time) | ✅ pass | `analytics-sink.ts` `AssertNoPII<T>` collapses to `never` if any `ForbiddenPIIKey` appears; `_PIIChecks` asserts all 5 event variants are PII-free — **the build fails the moment a PII key is added**. `LeadSubmittedEvent.contactMethod` is a category union (`phone`/`email`/`callback`), never a PII value. |
| Analytics events carry NO PII (runtime, belt-and-braces) | ✅ pass | `noop-analytics-sink.ts` `scanForPII` recursively walks keys at any depth + arrays-of-objects, `console.error`s a forbidden key (never throws), exempts the top-level `name` discriminant (implemented + exercised via the "accepts each of the five event names" test). Proven by `noop-analytics-sink.test.ts`: top-level, nested, and array-of-objects PII detection + no-throw. |
| Defined event taxonomy present | ✅ pass | 5-event union: `step_viewed`, `step_completed`, `estimate_generated`, `lead_submitted`, `drop_off` — supports drop-off/conversion analytics (NFR-8). |
| No PII to console | ✅ pass | Routes log no PII; `maskPhone` masks the only PII the sink might log; the analytics guard only logs the offending **key name + path**, never the value. |
| Every request carries a requestId | ✅ pass | `generateRequestId()` invoked at the top of every `POST`/route (`leads`, `estimate`, `address/*`, `config/form`, `health`); the id rides in every `ok`/`err` envelope (AD-9), including the failure branches. |

## 4. Reliability / rate-limiting (NFR-7)

NFR-7 requires per-endpoint rate limits (address 100/min, estimate 50/min, lead 20/min) + 30s timeout + retry.

| Invariant | Verdict | Evidence |
|---|---|---|
| Rate limiting (100/50/20 per min) | 🔻 deferred → OI-11 / infra | `grep -rni "rate.limit\|throttle" src app` → **no limiter exists in the spike** (confirmed). Rate limiting is an edge/gateway or middleware concern applied at deploy; recorded as the requirement + the seam it lands in (BFF route middleware / API gateway), **not faked in code**. |
| Safe retry for the stateful lead POST | ✅ pass | Idempotency is the reliability control that makes lead-POST retry safe: a stable `Idempotency-Key` → `idempotencyLedger` dedups a manual retry to the SAME `leadId` with no second record (FR-32/FR-33). Empty/whitespace key guarded in `route.ts`. This is the in-harness half of NFR-7 and it is enforced + tested. |
| Controlled failure envelope (no bare throw) | ✅ pass | `route.ts` wraps the sink call: a thrown adapter error (incl. the consent gate) → controlled 500 error envelope with `requestId`, never an unhandled throw or PII leak. Receipt re-validated with `leadReceiptSchema` before it leaves the seam. |
| 30s request timeout | ⚠ manual-pass | A deploy/runtime control (platform/edge timeout), not harness-assertable. Recorded. |

## 5. Security config (NFR-5)

| Invariant | Verdict | Evidence |
|---|---|---|
| HTTPS / TLS 1.2+ | ⚠ manual-pass | Deploy/infra control (`HANDOVER_05` §Security). Not harness-assertable. |
| API key auth | ⚠ manual-pass | Deploy/gateway control; the spike's BFF is same-origin only (no external API surface to key). Recorded against the seam. |
| CORS restricted to `*.demo.channel.com`/localhost | ⚠ manual-pass | Deploy/middleware control; the spike routes are same-origin (no cross-origin CORS headers emitted in-app). Recorded. |
| Same-origin BFF (no direct client→external) | ✅ pass | All PII and external calls route through the app's own `/api/v1/*` BFF (AD-1/AD-9); the client never calls an external service directly. Enforced structurally by the adapter boundary + route-only sink instantiation. |

## 6. OI-11 real-sink hardening requirements (surfaced by this audit)

`[NOTE]` **OI-11: the spike has no real CRM/backend.** For production, the following must be honoured by the real sink/connector (also appended to `deferred-work.md`):

1. **Real at-rest encryption** — the `encryptAtRest:true` marking must be backed by actual field-level or storage encryption in the CRM connector (currently a marking only).
2. **Enforced 24-month retention** — the `retentionMonths:24` marking must be backed by a real expiry/purge job.
3. **Bounded/TTL idempotency ledger** — `idempotencyLedger` (and the `leadSeq` counter) are process-lifetime in-memory Maps that never evict; the real sink needs LRU/TTL eviction and a shared store (multi-instance safe). (Carried from Story 5.4 BH#2/EH#3.)
4. **Real rate-limiter** — NFR-7's 100/50/20-per-min limits + 30s timeout must be applied at the gateway/middleware seam.
5. **Real transport security** — NFR-5 TLS/API-key/CORS config wired at deploy (`HANDOVER_05`).
6. **Payload-aware idempotency (optional)** — the edited-resubmit key-reuse edge (Story 5.4 EH#5) if payload-aware dedup is required downstream.

---

## Defects logged

**None.** No PII crosses the client→external boundary; no forbidden key sits on any analytics-event egress path; the consent gate is enforced twice (schema + adapter) and ordered before dedup; encryption/retention are marked; every request carries a requestId. The unbounded ledger, real crypto, real rate-limiter, and TLS/CORS/API-key config are honestly recorded as OI-11 `deferred` / deploy `manual-pass` — **not defects in the spike**, but requirements for the real sink. No HALT/blocked condition.

---

## Verdict

**Conditionally signed off — every in-harness invariant is verified and cited to machine enforcement; the real-backend/deploy controls are honestly routed to OI-11 `deferred` or infra `manual-pass`.** The PII boundary (server-only sink + adapter arch test + PII/analytics separation), the no-PII analytics contract (`AssertNoPII` compile assertions + `FORBIDDEN_PII_KEYS` recursive runtime scan, both tested), the consent gate (schema + adapter, ordered before dedup), the encryption/retention markings, phone masking, safe-retry idempotency, and requestId propagation are all enforced by compiling code and passing tests — so NFR-6/NFR-8/AD-10/AD-12 are structurally satisfied and cited. The honest ceiling: real at-rest encryption, enforced retention, a bounded ledger, a real rate-limiter (NFR-7), and TLS/CORS/API-key config (NFR-5) require a real backend/deploy and are recorded as OI-11 `deferred` / `manual-pass`, not asserted under the node-only stub harness. Tree green (no code changes).
