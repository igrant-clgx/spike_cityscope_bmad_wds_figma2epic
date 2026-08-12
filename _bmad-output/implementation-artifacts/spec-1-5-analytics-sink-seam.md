---
story: '1.5'
title: 'Typed AnalyticsSink event seam'
status: 'done'
baseline_revision: 'ac2fc72'
final_revision: '21404931e016a50ec8fae4a09a82898530a9f765'
---

# Story 1.5 — Typed AnalyticsSink event seam

## Source
- Epic 1, Story 1.5 (`_bmad-output/planning-artifacts/epics.md`)
- Architecture decisions: AD-12 (first-party typed analytics seam, no PII), NFR-8 foundation (privacy)

## Acceptance Criteria (verbatim)
- **Given** the app shell **When** the AnalyticsSink is wired **Then** a typed `AnalyticsSink` port exists with a no-op/stub adapter and event types `step_viewed`, `step_completed`, `estimate_generated`, `lead_submitted`, `drop_off` (AD-12)
- **And** event payloads are type-checked to never carry PII (AD-12, NFR-8 foundation)
- **And** emitting an event from the client routes through the seam without throwing when the stub adapter is active.

## Design intent
The `AnalyticsSink` port interface already exists (Story 1.1 scaffold) with the five
event names. Story 1.5 turns it into a usable, privacy-safe seam:

1. **Typed event union (PII-safe).** Replace the loose `AnalyticsEvent` shape with a
   discriminated union keyed by `name`, carrying only non-PII fields (step ids/indexes,
   `estimateId`, coarse cents ranges, categorical `contactMethod`, `requestId`).
   Add a compile-time `AssertNoPII` guard: a forbidden-key list (`name`, `firstName`,
   `lastName`, `email`, `phone`, `address`, `fullAddress`, `postcode`, `ssn`, `dob`) and
   a mapped type that fails to compile if any event variant carries such a key. A
   type-level test locks this in.
2. **No-op/stub adapter.** `createNoopAnalyticsSink(): AnalyticsSink` in
   `src/server/adapters/analytics/` — a pure module (no external I/O, no server-only
   deps) whose `track` resolves without side effects. Belt-and-braces runtime PII guard:
   in dev it scans event keys for forbidden PII keys and `console.error`s (never throws),
   so a caller who bypasses the types still cannot leak PII silently.
3. **Client emission seam.** `AnalyticsProvider` + `useAnalytics()` in
   `src/components/analytics/`. Default sink = the no-op adapter. `track(event)` is
   wrapped so a failing sink NEVER throws into the UI (fire-and-forget, errors swallowed
   in prod / logged in dev). Mounted in `app/providers.tsx`. `useAnalytics()` outside a
   provider falls back to a safe no-op so emission never throws.

## Tasks
- [x] Expand `src/server/domain/ports/analytics-sink.ts`: discriminated `AnalyticsEvent`
      union (5 variants, non-PII fields only) + `ForbiddenPIIKey` + `AssertNoPII` guard.
- [x] Add `src/server/adapters/analytics/noop-analytics-sink.ts`:
      `createNoopAnalyticsSink()` returning `AnalyticsSink`, with dev-only non-throwing
      PII key scan.
- [x] Add `src/components/analytics/AnalyticsProvider.tsx` (`'use client'`) with context,
      `useAnalytics()` hook, non-throwing `track`, no-op fallback outside provider.
- [x] Add `src/components/analytics/index.ts` barrel.
- [x] Wire `<AnalyticsProvider>` into `app/providers.tsx`.
- [x] Tests: no-op adapter resolves + non-throwing PII guard; type-level `AssertNoPII`
      via `expectTypeOf`; provider smoke (`renderToStaticMarkup`) + `track` never throws.

## Constraints / guardrails
- Domain + adapter modules import NO UI (`@mui/*`, `next`, `react`). Type-only imports
  of the port from the client are erased at compile time.
- No new runtime deps. React tests use `renderToStaticMarkup`; type tests use vitest's
  built-in `expectTypeOf`.
- No ad-hoc hex (n/a here — no styling literals).
- Preserve the five requirement event-name IDs verbatim.

## Review Triage Log

Iteration 0 — Blind Hunter + Edge Case Hunter (parallel); orchestrator sets final severity. Both converged on the runtime PII-scan blindness (arrays / deep nesting) and the provider's non-throwing edge cases.

**Patched (3) + 4 new tests:**
- `patch` — `noop-analytics-sink` PII scan rewritten as a fully recursive walk (`walk(value, path, isTopLevel)`) with a `WeakSet` cycle guard. Now flags forbidden keys at ANY depth and inside arrays / arrays-of-objects (previously only one nested level, and arrays produced numeric-index keys that hid PII). Still never throws. Added tests: array-of-objects PII, deep-nested PII, cyclic event object.
- `patch` — `AnalyticsProvider.track` now normalises the sink result via `Promise.resolve(...).catch(...)`, so a custom thenable lacking `.catch` that rejects can no longer escape as an unhandled rejection. Sink resolution moved out of render-time ref mutation: a stable default no-op ref + `activeSink = sink ?? default` deterministically reverts to the no-op when the `sink` prop is removed. Added test: thenable-without-`.catch` rejection is swallowed.
- `patch` — `FORBIDDEN_PII_KEYS` now `as const satisfies readonly ForbiddenPIIKey[]`, so the runtime list can no longer drift to include a key absent from the `ForbiddenPIIKey` type.

**Rejected (by-design, documented):**
- Top-level `name` exemption in both the compile-time `AssertNoPII` guard and the runtime scan — `name` is the reserved event discriminant (a fixed event-name literal), which cannot carry a person's name. Nested `name` values ARE still scanned. Not a real leak vector.
- Allow-list breadth (`emailAddress`, `phoneNumber`, `street`, … evade the 10-key list) — intentional for the spike; the guarantee is "cannot carry these known PII keys," a foundation for NFR-8, not exhaustive PII inference.
- Value import of the pure `createNoopAnalyticsSink` from `@server/adapters/**` into the `'use client'` provider — the adapter is pure (no server-only deps) and safe in the client bundle today; hardening this boundary is out of scope for the seam.

## Auto Run Result

- Result: **done** — typed `AnalyticsEvent` discriminated union (5 non-PII variants), compile-time `AssertNoPII` guard + type-level test, `createNoopAnalyticsSink` stub adapter with a recursive non-throwing dev PII scan, and a client `AnalyticsProvider`/`useAnalytics` seam that emits fire-and-forget and never throws (sync throws, rejected promises, and non-`.catch` thenables all swallowed). Wired into `app/providers.tsx`.
- Gates: typecheck/lint/build exit 0; **56 tests pass** (11 files); no ad-hoc hex; domain + adapter layers import no UI.
- `followup_review_recommended: false` — all convergent findings patched or consciously deferred.
