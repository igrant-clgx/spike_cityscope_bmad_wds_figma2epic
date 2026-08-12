---
title: 'Story 5.4: Submit lead linked to estimate with confirmation & states'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '7c1a86d'
final_revision: '6bcfec4'
---

<intent-contract>

## Intent

**Problem:** The Story 5.3 lead form is built but not wired: it does not submit, is not linked to the current `estimateId`, has no submit/success/error states, no duplicate-submission prevention, no safe retry, no `lead_submitted` analytics, and is not mounted on the Results surface. FR-29/30/32/33 + UX-DR16(lead) require the full stateful submit path.

**Approach:** Add a `LeadPanel` (mirror of `ResultsPanel`) that owns the `useLeadCapture()` mutation + `useAnalytics()`, joins the current `estimateId` into the `LeadForm`'s emitted fields, and maps the mutation state through a PURE `toLeadView` mapper (mirror of `toResultsView`) into: form → submitting (duplicate prevented) → success confirmation (replaces the form, estimate stays visible) → non-destructive retryable error (entered data preserved). Mount `LeadPanel` on the Results success/low-confidence surface alongside the existing phone-CTA `ContactSection` (OI-10: both ship). Make the stateful POST safe: disable transport auto-retry for the lead mutation AND send a stable per-submission `Idempotency-Key` header the stub sink dedups on (closes the Epic 4 / Story 5.1 non-idempotent-POST deferral). Emit `lead_submitted` (leadId + contactMethod category, NEVER PII) on success. Resolve the Story 5.3 EH#3 deferral (explain the disabled submit).

## Boundaries & Constraints

**Always:** the lead links to the CURRENT `estimateId` from the estimate result (`view.result.estimateId`) — a lead can only submit when an estimate is on screen; ALL state decisions live in a PURE node-testable `toLeadView` mapper (mirror `toResultsView`, transport `isError` checked BEFORE pending/undefined, service error = `data.ok === false`); ONE persistent `role="status" aria-live="polite"` live region mounted in EVERY lead state carrying the state's announcement (mirror the Results live-region pattern); duplicate submission prevented (submit disabled while pending; on success the form is REPLACED by the confirmation so no second submit is possible); the stateful POST is NEVER silently transport-retried (`apiFetch` `maxRetries: 0` for the lead mutation) AND carries a stable `Idempotency-Key` (generated once per panel instance, constant across manual retries) the stub sink dedups on (same key → same `leadId`, no duplicate record); a submit ERROR is non-destructive and retryable — entered data preserved (rhf state intact), a plain "Try again" re-fires the SAME idempotent request; `lead_submitted` analytics carries ONLY `leadId` + `contactMethod` (category), never name/email/phone; no PII in logs/analytics/query-strings/`NEXT_PUBLIC`; theme tokens only (no ad-hoc hex); node-testable via `renderToStaticMarkup`; the boundary arch test stays green.

**Block If:** the idempotency/dedup approach would require a real persistence layer or CRM (OI-11) beyond the in-memory stub — keep the stub seam and document.

**Never:** no real CRM (OI-11 stays a stub); no PII on any analytics event or log; do not change the shared `leadCaptureRequestSchema` request BODY to carry the idempotency key (it is transport metadata via header, not user data); do not re-implement AU validation or the form (reuse Story 5.3); no new dependencies; do not break the estimate flow or the phone-CTA Contact Section.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Idle (estimate on screen) | mutation idle | `form` state: LeadForm shown, submit disabled until valid+consent | n/a |
| Valid submit fires | valid form + `estimateId` | `submitting`: submit shows loading, form disabled, duplicate prevented; POST carries `Idempotency-Key`, no auto-retry | n/a |
| Submit success | envelope `ok`, `{leadId}` | `success` confirmation ("A coach will be in touch") REPLACES the form; estimate stays visible; `lead_submitted` emitted (leadId + contactMethod, no PII); live region announces success | n/a |
| Submit service error | envelope `ok:false` | `error`: non-destructive message + "Try again"; entered data preserved; NO analytics with PII | mapper `data.ok===false` → error |
| Submit transport failure | fetch throws / 5xx | `error` (NOT auto-retried); "Try again" re-fires the SAME idempotency key | `isError` → error surface |
| Manual retry after error | click "Try again" | re-POST with the SAME `Idempotency-Key`; if the prior attempt actually stored, the sink returns the SAME `leadId` (no duplicate) | idempotent dedup |
| Disabled-submit explanation | form incomplete/untouched | a helper explains what's required (resolves Story 5.3 EH#3) so the disabled button isn't unexplained | n/a |

</intent-contract>

## Code Map

- `src/features/lead/lead-view-state.ts` -- NEW. Pure `toLeadView(state)` → discriminated `LeadView` (`form`/`submitting`/`success`/`error`) + `announce`; mirror `results/results-view-state.ts`.
- `src/features/lead/lead-panel-copy.ts` -- NEW. Confirmation/submitting/error copy + announcements (honest voice) + the disabled-submit helper.
- `src/features/lead/LeadPanel.tsx` -- NEW. `'use client'`. Presentational `LeadPanelView` (pure over `LeadView`, persistent live region) + wired `LeadPanel({ estimateId })` owning `useLeadCapture()` + `useAnalytics()` + a stable `Idempotency-Key` ref; builds the request via `toLeadRequestFields(values)` + `estimateId`; emits `lead_submitted` on success.
- `src/features/lead/use-lead-capture.ts` -- CHANGED. `requestLeadCapture(request, idempotencyKey)` sends the `Idempotency-Key` header and passes `{ maxRetries: 0 }` to `apiFetch` (no silent retry of a stateful POST).
- `src/server/domain/ports/lead-sink.ts` -- CHANGED. `capture(lead, idempotencyKey?)` — optional transport-metadata param (NOT added to `LeadCapture` PII).
- `src/server/adapters/lead/stub-lead-sink.ts` -- CHANGED. Module-level `Map<idempotencyKey, leadId>` dedup: a repeat key returns the SAME `leadId` and does NOT store a second record.
- `src/server/application/lead.ts` -- CHANGED. Thread `idempotencyKey` through `captureLead`.
- `app/api/v1/leads/route.ts` -- CHANGED. Read the `Idempotency-Key` header, pass to `captureLead`; still AD-9 envelopes, no PII logged.
- `src/features/lead/LeadForm.tsx` -- CHANGED. Add the disabled-submit helper (Story 5.3 EH#3); keep the pure gate + `toLeadRequestFields` emit.
- `src/features/results/ResultsPanel.tsx` -- CHANGED. Mount `<LeadPanel estimateId={view.result.estimateId} />` in the success/lowConfidence block (alongside the phone-CTA `ContactSection`).
- `src/features/lead/index.ts` -- CHANGED. Export `LeadPanel`, `toLeadView`, `LeadView`.
- Tests for every new/changed unit (pure mapper matrix; sink dedup; route header; hook header+no-retry; LeadPanel SSR states; analytics no-PII; ResultsPanel mount).

## Tasks & Acceptance

**Execution:**
- [x] `src/features/lead/lead-view-state.ts` + test -- pure `toLeadView` over the mutation state; exhaustive matrix (idle→form, pending→submitting, ok→success, ok:false→error, isError→error). Mirror `toResultsView` ordering.
- [x] `src/features/lead/lead-panel-copy.ts` -- copy + announcements + disabled-submit helper.
- [x] `src/features/lead/LeadPanel.tsx` + test -- `LeadPanelView` (pure, persistent live region, node-tested per state) + wired `LeadPanel`; builds request with `estimateId`; emits `lead_submitted` (no PII) on success.
- [x] `src/features/lead/use-lead-capture.ts` + test -- `Idempotency-Key` header + `maxRetries: 0`; node-tested via `global.fetch` stub (assert header sent, assert no retry on 5xx).
- [x] `src/server/domain/ports/lead-sink.ts` + `src/server/application/lead.ts` + `src/server/adapters/lead/stub-lead-sink.ts` + tests -- thread `idempotencyKey`; module-level dedup Map (repeat key → same leadId, no second record; consent gate unchanged).
- [x] `app/api/v1/leads/route.ts` + test -- read + forward the header; envelopes + no-PII unchanged; a repeat key returns the same receipt.
- [x] `src/features/lead/LeadForm.tsx` -- disabled-submit helper (resolves Story 5.3 EH#3).
- [x] `src/features/results/ResultsPanel.tsx` + test -- mount `LeadPanel` in success/lowConfidence with the result's `estimateId`; absent in idle/loading/error.
- [x] `src/features/lead/index.ts` -- exports.

**Acceptance Criteria:**
- Given a valid, consented lead, when I submit, then the lead is stored via `LeadSink` linked to the current `estimateId` and a success confirmation is shown (FR-29).
- Given submission in flight, then submit shows a loading state and duplicate submission is prevented; the success confirmation replaces the form while the estimate stays visible (UX-DR16 lead).
- Given a submit error, then a non-destructive, retryable error preserves entered data; consent remains required for storage (FR-30, NFR-6); the stateful POST is never silently retried and a manual retry is idempotent (same `Idempotency-Key` → same `leadId`, no duplicate) (FR-32/FR-33).
- Given a successful submission, then `lead_submitted` is emitted carrying only `leadId` + contact-method category — never PII (AD-12).
- Given the boundary invariant, then `src/server/architecture.test.ts` stays green and no PII appears in logs/analytics/query-strings.

## Spec Change Log

## Review Triage Log

Two parallel adversarial reviewers (Blind Hunter, Edge Case Hunter, both opus-4.8)
traced `/tmp/story54.diff` (2132 lines). Both converged on the idempotency-key
entropy defect. Orchestrator set final severities.

### FIXED
- **BH#1 — HIGH: cross-user idempotency-key collision → silent lead drop.**
  The key was `lead-${estimateId}-${panelSeq}`. `estimateId` is a deterministic
  FNV-1a content hash (two users picking the same items share it) and `panelSeq`
  is a client-bundle module counter that resets to `1` in every browser tab. Two
  different users submitting their first lead against the same estimate produced
  the identical key; the process-wide dedup ledger keys on the string regardless
  of payload, so User B received User A's `leadId` and User B's lead was silently
  dropped (FR-29 data loss shown as "success"). **Fix:** seed the per-mount key
  with real entropy — `lead-${crypto.randomUUID()}` — generated ONCE per mount via
  the existing ref (still constant across manual retries, so FR-32/FR-33 idempotent
  retry is preserved). `estimateId` remains the durable join key on the request body.
- **EH#1 — LOW (public-endpoint hardening): empty/whitespace `Idempotency-Key`
  header treated as a real key**, colliding all such leads to one `leadId`. Not
  reachable from this client, but the route is a public POST. **Fix:** in
  `route.ts`, `rawKey && rawKey.trim() ? rawKey : undefined`. Added a route test
  asserting two empty-key submits get DISTINCT `leadId`s.
- **EH#4 — LOW (race): retry button double-click fires two concurrent same-key
  POSTs** before the re-render into `submitting` unmounts the button (ledger
  check-then-set is not atomic). **Fix:** guard `handleRetry` with
  `if (mutation.isPending) return;`.

### DEFERRED (documented)
- **EH#2 — LOW: two `role="status"` live regions on the success screen**
  (ResultsPanel's + LeadPanel's). LeadPanel's region is empty at rest
  (`announce: ''`), so both reviewers rated it tolerable/acceptable-by-design.
  Deferred — folds into the Epic 6 a11y audit (Story 6.2).
- **BH#2 / EH#3 — LOW: `idempotencyLedger` Map is unbounded** (no TTL/eviction)
  for the process lifetime. By design for the stub sink; the real CRM sink
  (OI-11) will own a bounded/TTL store. Deferred to OI-11.
- **EH#5 — INFO: edited-then-resubmit after a transport error reuses the key**
  and returns the original `leadId`, discarding edits (ledger keys on key, not
  payload). Narrow (transport-loss + user edit); the intended tradeoff for
  identical idempotent retries. No change.

## Auto Run Result

- **Implementation:** SYNC opus-4.8 subagent (large integrative story), then
  3 orchestrator patches from adversarial review.
- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel, opus-4.8). Converged
  on BH#1 (idempotency entropy). PII, consent-before-dedup, `maxRetries:0`,
  analytics emit-once, state-mapper ordering, estimateId linkage all verified clean.
- **Final severities (orchestrator):** BH#1 HIGH (fixed), EH#1 LOW (fixed),
  EH#4 LOW (fixed), EH#2/BH#2/EH#3/EH#5 LOW-INFO (deferred, documented).
- **Gates:** typecheck ✓ · lint ✓ · test ✓ (522) · build ✓ · architecture.test ✓ (3).
- **Deferrals** appended to `deferred-work.md`.
