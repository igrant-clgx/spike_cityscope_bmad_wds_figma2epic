---
title: 'Story 6.4: Security, privacy, reliability & observability verification'
type: 'chore'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: 'd5d7c82'
final_revision: '40ff3a4'
---

<intent-contract>

## Intent

**Problem:** The assembled app has never had a whole-system audit of its cross-cutting invariants (NFR-5, NFR-6, NFR-7, NFR-8, AD-10, AD-12): that no PII crosses the client→external boundary, that lead data is consent-gated and marked encrypted-at-rest with a defined retention, that rate-limiting/reliability behaviour is defined per NFR-7, and that the AnalyticsSink emits the defined taxonomy carrying no PII. Several of these are already machine-enforced (boundary arch test, `AssertNoPII`/`FORBIDDEN_PII_KEYS`, consent gate) but nowhere is the whole picture verified and the real-sink hardening gaps (OI-11) recorded.

**Approach:** Produce a verification artifact (`security-privacy-reliability-observability-verification.md`) that audits each invariant with a `pass` (statically verified against enforcement code + tests, cited), `manual-pass` (an infra/deploy control the node-only harness cannot assert, documented), or `deferred` (a real-sink concern routed to OI-11) verdict. This is the strongest in-harness verification story: the PII boundary, no-PII analytics, and consent gate are all already enforced by compiling code and passing tests, so the audit is largely citation of existing machine enforcement plus honest recording of what only a real backend/deploy provides (TLS/CORS/API-key config NFR-5, actual at-rest encryption + real rate-limiting NFR-7). No code change expected unless a genuine gap surfaces.

## Boundaries & Constraints

**Always:** Cite real enforcement (the boundary arch test, `AssertNoPII<T>` compile assertions, `FORBIDDEN_PII_KEYS` runtime scan, the consent gate ordered before dedup, `maskPhone`, `StoredLeadRecord.encryptAtRest`/`retentionMonths`, `generateRequestId`, the `LeadCapture`-not-in-analytics separation, idempotency-key-as-transport-metadata) with file + test names; preserve IDs (NFR-5, NFR-6, NFR-7, NFR-8, AD-10, AD-12, OI-11, FR-30, FR-32/FR-33); frame NFR-7 rate-limiting against the seam (none exists in the spike — record the requirement + where it lands); write the OI-11 real-sink hardening requirements (bounded/TTL idempotency + lead-seq ledger, real at-rest encryption, real CRM connector, real rate-limiter).

**Block If:** A genuine PII leak across the client→external boundary is found (a forbidden key on an analytics event path, PII in a `NEXT_PUBLIC_*`/query string/unmasked log, PII returned to the client) — HALT/blocked and log it against the owning epic.

**Never:** Add a security scanner / real crypto / a real rate-limiter (out of spike scope); assert TLS/CORS/API-key config the harness can't exercise as automated `pass` (they are `manual-pass`/deploy controls); claim the unbounded in-memory ledger is production-safe (it is an OI-11 `deferred`).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| PII boundary | domain/adapter imports + payload shapes | `pass` — boundary arch test + PII-free analytics union cited | HALT if a real leak found |
| No-PII analytics | event union + runtime scan | `pass` — `AssertNoPII` compile assertions + `FORBIDDEN_PII_KEYS` recursive scan + tests cited | n/a |
| Consent gate | consent-less capture | `pass` — gate throws BEFORE dedup, adapter test cited (AD-10, FR-30) | n/a |
| Encryption at rest | stored lead record | `pass` (marking present) + `deferred` (real crypto → OI-11) | n/a |
| Rate-limiting (NFR-7) | no limiter in spike | `manual-pass`/`deferred` — requirement recorded against the seam it lands in | n/a |
| TLS/CORS/API-key (NFR-5) | infra/deploy config | `manual-pass` — deploy control, not harness-assertable | n/a |
| Observability (NFR-8) | requestId + analytics | `pass` — `generateRequestId` on every route + no-PII-to-console cited | n/a |
| Real PII leak | forbidden key on egress path | logged as owning-epic defect | HALT if non-trivial |

</intent-contract>

## Code Map

- `src/server/architecture.test.ts` -- inward-dependency boundary arch test; auto-walks every adapter, forbids `next`/`react`/`@mui`/`zod` in `domain`/`adapters` and cross-adapter imports (the structural half of "PII never reaches the client bundle").
- `src/server/domain/ports/analytics-sink.ts` -- `AnalyticsEvent` union (5 events, non-PII fields only), `AssertNoPII<T>` compile-time assertions (`_PIIChecks`), `FORBIDDEN_PII_KEYS` runtime list (AD-12, NFR-8).
- `src/server/adapters/analytics/noop-analytics-sink.ts` -- non-prod recursive `scanForPII` walk (nested + arrays), `console.error` never throws; `noop-analytics-sink.test.ts` proves top-level/nested/array detection + `name`-discriminant exemption.
- `src/server/adapters/lead/stub-lead-sink.ts` -- consent gate (rejects consent-less, ordered BEFORE the idempotency ledger), `StoredLeadRecord.encryptAtRest:true` + `retentionMonths:24` (AD-10, NFR-6), `maskPhone` (last-3 only), process-level `idempotencyLedger`/`leadSeq` (FR-32/FR-33); `peek()` server/test-only.
- `src/server/domain/ports/lead-sink.ts` -- `idempotencyKey` a DELIBERATELY separate transport param (never a `LeadCapture` field → never PII on the payload/schema).
- `app/api/v1/leads/route.ts` -- same-origin BFF seam: schema-validates in, re-validates receipt out, empty/whitespace `Idempotency-Key` guard, controlled 500 envelope on the consent-gate throw, no PII logged; `generateRequestId` on every request (NFR-8).
- `app/api/v1/*/route.ts` -- every route carries a `requestId` (NFR-8 observability).
- `_bmad-output/planning-artifacts/functional-requirements.md` -- NFR-5..NFR-8 definitions.
- `_bmad-output/implementation-artifacts/deferred-work.md` -- OI-11 real-sink items appended here.
- `_bmad-output/implementation-artifacts/security-privacy-reliability-observability-verification.md` (NEW).

## Tasks & Acceptance

**Execution:**
- [x] `_bmad-output/implementation-artifacts/security-privacy-reliability-observability-verification.md` -- CREATE: an invariant table (PII boundary, no-PII analytics, consent gate, encryption-at-rest marking, retention, phone masking, idempotency-as-transport, rate-limiting/reliability NFR-7, TLS/CORS/API-key NFR-5, requestId/observability NFR-8) each `pass`(enforcement cited)/`manual-pass`(deploy/infra control)/`deferred`(OI-11 real-sink); an OI-11 real-sink hardening requirements section (bounded/TTL ledgers, real at-rest encryption, real rate-limiter, real CRM connector); a defects section; a verdict + honest node-only-harness ceiling.
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- APPEND the OI-11 real-sink hardening requirements surfaced by this audit.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- (finalization) mark `6-4-security-privacy-reliability-observability-verification: done`.
- [x] Confirm the tree stays green (`npm run typecheck && npm run lint && npm test && npm run build`), plus `npx vitest run src/server/architecture.test.ts`.

**Acceptance Criteria:**
- Given the assembled app, when the invariants are audited, then no PII crosses the client-to-external boundary and lead data is consent-gated and marked encrypted-at-rest with 24-month retention (NFR-5, NFR-6, AD-10) — each cited to enforcement code + tests, with real at-rest encryption recorded as an OI-11 `deferred`.
- Given reliability, when NFR-7 is audited, then rate-limiting/reliability behaviour is defined and recorded against the seam it lands in (no limiter exists in the spike — recorded as `deferred`/`manual-pass`, not faked).
- Given observability, when the AnalyticsSink is audited, then it emits the defined 5-event taxonomy carrying no PII (NFR-8, AD-12) — cited to `AssertNoPII` compile assertions + the `FORBIDDEN_PII_KEYS` runtime scan + tests — and every route carries a `requestId`.

## Verification

**Commands:**
- `npm run typecheck && npm run lint && npm test && npm run build` -- expected: all exit 0 (no code changes expected).
- `npx vitest run src/server/architecture.test.ts` -- expected: green (boundary enforcement intact).
- `grep -rni "rate.limit\|throttle" src app` -- expected: no limiter (confirms NFR-7 is a seam, recorded honestly).

**Manual checks:**
- Every `pass` cell cites real enforcement code + a passing test; every `manual-pass` names the deploy/infra control; every `deferred` routes to OI-11.
- No forbidden PII key sits on any analytics-event egress path; no PII in `NEXT_PUBLIC_*`/query strings/unmasked logs; the OI-11 real-sink requirements are written to deferred-work.md.

## Review Triage Log

Verification story — one adversarial auditor (opus-4.8) checked the artifact for **completeness, honesty, and evidence** rather than code bugs (proportionate: this story ships an audit artifact + zero code change).

**Audit result: HONEST AND COMPLETE — 0 critical, 2 minor (both fixed).**

- Citation integrity (all `pass` cells): every cited enforcement read and confirmed exact — `AssertNoPII<T>`/`_PIIChecks` (all 5 variants)/`FORBIDDEN_PII_KEYS`, recursive `scanForPII` (nested + arrays-of-objects + cycle guard, never throws), consent gate ordered before the ledger, `encryptAtRest:true`/`RETENTION_MONTHS=24`, `maskPhone`, `idempotencyKey` as a separate `capture()` param, `route.ts` `consent:z.literal(true)` 400 + empty-key guard + controlled 500 + receipt re-validation, boundary arch test, `generateRequestId` in all 6 routes. **CLEARED.**
- Hidden-leak check: independent grep confirmed NO `firstName/lastName/email/phone` on any analytics event, `NEXT_PUBLIC_*` var, or query string — "no PII crosses the boundary" is TRUE. **CLEARED.**
- NFR-7 honesty: independent grep confirmed ZERO rate-limiter/throttle in src+app; recorded `deferred → OI-11`, explicitly not faked, never claimed `pass`. **CLEARED.**
- Overclaim check: at-rest encryption honestly split (marking = `pass`, real crypto = `deferred`); TLS/CORS/API-key correctly `manual-pass`; unbounded ledger correctly `deferred` (not called production-safe). **CLEARED.**
- OI-11: all 6 real-sink hardening requirements accurate and appended to `deferred-work.md`. **CLEARED.**

**MINOR #1 (fixed):** consent gate described as "throws" — it returns `Promise.reject(...)`; reworded to "rejects with" (functionally identical behind `await`, but precise).
**MINOR #2 (fixed):** "name-exemption proven by the test" overstated — the exemption is implemented + indirectly exercised (five-event-names test) but has no dedicated assertion; reworded to reflect that (proven items = top-level/nested/array PII detection + no-throw).

No CRITICAL issues, no false `pass`, no missed leak. No HALT/blocked condition.

## Auto Run Result

- **Outcome:** ✅ done — verification artifact delivered, audited HONEST AND COMPLETE, tree green.
- **Deliverable:** `security-privacy-reliability-observability-verification.md` — 5 invariant sections (privacy/PII boundary NFR-6/AD-10; consent+encryption-marking+retention AD-10/NFR-6/FR-30; observability no-PII-analytics+requestId NFR-8/AD-12; reliability/rate-limiting NFR-7; security config NFR-5) each `pass`(enforcement+test cited)/`manual-pass`(deploy control)/`deferred`(OI-11 real-sink), + an OI-11 real-sink hardening section (6 requirements), verdict + honest node-only-stub-harness ceiling.
- **Code change:** none (doc-only). Rate-limiter confirmed absent (NFR-7 recorded against seam, not faked); real crypto/retention/TLS/CORS/API-key recorded as OI-11 `deferred` / infra `manual-pass`.
- **Gates:** typecheck ✅, lint ✅, test ✅ (524), build ✅, boundary arch test ✅ (3/3).
- **Review:** 1 adversarial auditor, 0 critical / 2 minor (both fixed).
- **Deferred:** OI-11 real-sink hardening requirements appended to `deferred-work.md`.
