---
title: 'Story 1.4 — Shared feedback, motion & accessibility primitives'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '0789a49ffc9a82d191e969d48a7e614daade9b4b'
final_revision: 'e67ccc2a2cdfe5764695a06d5883cf3c5d4f246f'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-3-branded-shell.md'
  - '{project-root}/_bmad-output/implementation-artifacts/deferred-work.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** Epics 2–5 all need the same async-feedback, motion, and accessibility behaviours (loading/error/retry, toasts, input-error treatment, honoured motion, focus rings, 44px targets). Building them per-feature would fragment the UX. Build them ONCE as reusable primitives. (FR-32/FR-33 foundation, FR-34, UX-DR14, UX-DR15, UX-DR18/19/20 baseline)

**Approach:** (1) Harden `lib/api-client` into the single non-throwing envelope caller with pending/error state + retry, exposing a typed `RequestState`. (2) Add a `Toast`/`ToastProvider` snackbar system for form-level feedback. (3) Add a `FormTextField` input-error primitive that always pairs the error treatment with inline text. (4) Encode the motion system as theme transitions + tokens, collapsing under `prefers-reduced-motion`. (5) Establish the a11y baseline (focus ring, ≥44px targets) via theme component overrides.

## Boundaries & Constraints

**Always:**
- Read all colours/px from the theme/`tokens`; keep the `no-adhoc-hex` convention test green (any hex lives only under `src/theme/**`).
- `lib/api-client` (AD-9) is the ONLY client→BFF caller and the ONLY owner of envelope parsing + retry. It must be NON-THROWING for expected failures: network error, non-2xx status, non-JSON body, and non-envelope JSON all resolve to a typed error result that carries a `requestId` (generate one if absent). Retry policy: retry transient failures (network error / 5xx) up to a small bounded count with backoff; do NOT retry 4xx or a well-formed error envelope. Keep it framework-agnostic (no React import) so server and client both use it.
- Expose a `RequestState<T>` discriminated union (`idle` | `loading` | `success` | `error`) so consumers render loading and non-destructive-error states uniformly.
- Toast: MUI `Snackbar` + `Alert`, bottom-center, severity-coloured, white text, slide-up transition ~300ms, auto-dismiss 3–5s (default 4s). Form-level feedback ONLY — never field errors. Provider + `useToast()` enqueue API.
- Input-error: a `FormTextField` primitive wrapping MUI `TextField` that renders the DESIGN input-error treatment — 2px error border + soft focus glow (`0 0 0 3px rgba(220,53,69,0.10)`) + error helper text — and NEVER signals error by colour alone (error state requires accompanying `helperText`/message). (UX-DR15)
- Motion: encode durations micro 100–150ms (use 120ms), accordion ~300ms with `cubic-bezier(0.4,0,0.2,1)`, reveal 300–500ms (use 400ms) as theme transitions + `tokens.motion`; provide a `useReducedMotion()` helper and a global rule so ALL motion collapses under `prefers-reduced-motion` (UX-DR19, FR-34).
- A11y baseline via theme component overrides: visible focus-visible ring in `{colors.primary}` on interactive elements, minimum 44px interactive target height, keyboard operability preserved (don't remove default outlines without replacing them). (UX-DR18/20 baseline)

**Block If:**
- (none expected)

**Never:**
- Do NOT build feature surfaces (accordion stepper, address block, selection buttons, result card, contact section, lead form) — Epics 2–5. Provide only the reusable primitives.
- Do NOT wire analytics — Story 1.5.
- Do NOT add new runtime dependencies or test tooling (tests stay node-env; use `renderToStaticMarkup` + pure-logic unit tests with a stubbed `fetch`).
- Do NOT touch `src/server/domain/**` purity (primitives are UI/lib; domain imports nothing from them).
- Do NOT introduce ad-hoc hex/px outside `src/theme/**`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy call | 200 + valid success envelope | `RequestState.success` with `data` + `requestId` | N/A |
| Well-formed error envelope | 200/4xx + valid error envelope | `error` result (code/message/requestId), NOT retried | non-destructive |
| Network failure | fetch throws | `error` result (code e.g. `network_error`), retried up to N then error | generated requestId |
| 5xx status | 503 | retried up to N; final `error` result | non-destructive |
| 4xx status non-envelope | 400 + `{}` | `error` result, NOT retried | generated requestId |
| Non-JSON body | 200 + `"<html>"` | `error` result (`invalid_response`) | caught, not thrown |
| Non-envelope JSON | 200 + `{"foo":1}` | `error` result (`invalid_response`) | zod safeParse, not thrown |
| Toast enqueue | `useToast().show({severity,message})` | bottom-center snackbar, slide-up, auto-dismiss ~4s | N/A |
| Input error | `<FormTextField error helperText="...">` | 2px error border + glow + helper text shown | error w/o helperText is a type/runtime guard |
| Reduced motion | `prefers-reduced-motion: reduce` | transitions collapse to ~0ms globally | N/A |
| Focus | tab to a button/input | visible primary focus ring; target ≥44px | N/A |

## Code Map

- `src/theme/tokens.ts` (modify) -- add `motion` (durations micro/accordion/reveal, standard easing, snackbar auto-hide) and `inputErrorGlow` + `minTarget` (44) + `focusRingWidth`; the only place literals live.
- `src/theme/theme.ts` (modify) -- wire `transitions.duration`/`easing` from `tokens.motion`; add `components` overrides: `MuiCssBaseline` global `prefers-reduced-motion` collapse; focus-visible ring + 44px min-height on `MuiButtonBase`/`MuiButton`; input-error border+glow on `MuiOutlinedInput.Mui-error`; 44px min-height on inputs.
- `src/theme/theme.test.ts` (modify) -- assert transitions wired + components overrides present (reduced-motion global, focus ring colour, error glow).
- `src/lib/request-state.ts` -- `RequestState<T>` discriminated union + constructors (`idle/loading/success/error`) + `ApiResult<T>`.
- `src/lib/api-client.ts` (modify) -- non-throwing `apiFetch` with retry/backoff, status + non-JSON + non-envelope handling, returns `ApiResult<T>` carrying `requestId`.
- `src/lib/api-client.test.ts` (modify/add) -- cover the I/O matrix api rows with a stubbed `fetch`.
- `src/components/feedback/motion.ts` -- `useReducedMotion()` (via MUI `useMediaQuery`) + `resolveDuration(theme, key, reduced)` helper.
- `src/components/feedback/ToastProvider.tsx` (`'use client'`) -- context + MUI Snackbar/Alert (bottom-center, Slide up, autoHide); `useToast()` hook exposing `show(...)`.
- `src/components/feedback/FormTextField.tsx` -- MUI `TextField` wrapper enforcing error↔helperText pairing + the themed error treatment.
- `src/components/feedback/index.ts` -- barrel export.
- `src/components/feedback/FormTextField.test.tsx` -- `renderToStaticMarkup`: error renders 2px/helper text; asserts inline text present.
- `src/components/feedback/toast.test.tsx` -- `renderToStaticMarkup`: `ToastProvider` renders its children (smoke); `useToast` throws outside provider.

## Tasks & Acceptance

**Execution:**
- [x] `src/theme/tokens.ts` -- add motion + input-error-glow + min-target/focus tokens -- single source of literals.
- [x] `src/theme/theme.ts` -- wire transitions + a11y/input-error/reduced-motion component overrides -- FR-34, UX-DR15/18/19/20.
- [x] `src/lib/request-state.ts` -- `RequestState<T>`/`ApiResult<T>` union + constructors -- uniform loading/error states (FR-32/33 foundation).
- [x] `src/lib/api-client.ts` -- non-throwing envelope caller with retry/backoff + status/non-JSON/non-envelope handling -- AD-9, non-destructive errors.
- [x] `src/components/feedback/motion.ts` -- reduced-motion + duration helpers -- UX-DR19.
- [x] `src/components/feedback/ToastProvider.tsx` + `useToast` -- form-level snackbar system -- UX-DR14.
- [x] `src/components/feedback/FormTextField.tsx` -- input-error primitive (error always paired with text) -- UX-DR15.
- [x] `src/components/feedback/index.ts` -- barrel export.
- [x] Tests: `request-state`? (covered via api-client), `api-client.test.ts`, `FormTextField.test.tsx`, `toast.test.tsx`, `theme.test.ts` additions -- cover the I/O matrix.

**Acceptance Criteria:**
- Given a consumer, when it calls `lib/api-client`, then the response envelope is parsed with pending/error handling and a retry policy, exposing loading and non-destructive-error states (foundation for FR-32/FR-33) — verified by unit tests covering network/5xx retry, 4xx/error-envelope no-retry, non-JSON and non-envelope bodies, all returning typed errors carrying a requestId.
- Given a form-level event, when `useToast().show(...)` is called, then a bottom-center, severity-coloured, white-text snackbar slides up (~300ms) and auto-dismisses in 3–5s; it is never used for field errors (UX-DR14).
- Given an invalid field, when `FormTextField` renders in error, then it shows a 2px error border + soft glow + helper text, always paired with inline text (never colour alone) (UX-DR15).
- Given the motion system, when durations are read, then micro=120ms, accordion≈300ms `cubic-bezier(0.4,0,0.2,1)`, reveal=400ms, and all motion collapses under `prefers-reduced-motion` (UX-DR19, FR-34).
- Given the a11y baseline, when an interactive element is focused, then it shows a visible primary focus ring and its target is ≥44px, with keyboard operability preserved (UX-DR18/20 baseline).
- Given the project, when `npm run typecheck`, `npm run lint`, `npm run build`, `npm test` run, then all exit 0, all tests pass, and the no-adhoc-hex convention test stays green.

## Design Notes

`api-client` becomes non-throwing on purpose: features render `RequestState` uniformly rather than sprinkling try/catch. Retry only transient failures (network / 5xx) so a legitimate error envelope or 4xx returns immediately. Every error result carries a `requestId` for correlation (generated when the response had none). This directly resolves the Story 1.1 deferred api-client finding.

Motion + a11y + input-error live in the THEME (component overrides + transitions) so every MUI component inherits them for free; the `FormTextField`/`Toast`/`motion` helpers are the ergonomic wrappers. Reduced-motion is enforced globally via a `MuiCssBaseline` `@media (prefers-reduced-motion: reduce)` rule (belt-and-braces with the `useReducedMotion` hook for JS-driven animation).

Tests stay node-env (no jsdom): pure-logic unit tests for `api-client` with a stubbed global `fetch`; `renderToStaticMarkup` for `FormTextField` and the `ToastProvider` smoke. `useReducedMotion` (MUI `useMediaQuery`) returns its SSR default under static markup — acceptable for a structural test.

## Verification

**Commands:**
- `npm run typecheck` / `npm run lint` / `npm run build` -- exit 0.
- `npm test` -- api-client matrix + FormTextField + toast + theme + prior tests pass; no-adhoc-hex green.
- `npm run start` + load `/` -- app renders; focus ring visible on tabbing; no console errors.

**Manual checks:**
- Read `api-client` -- expected: no unguarded `throw`/`await response.json()`; all branches return typed results.
- Inspect theme -- expected: reduced-motion global rule, focus ring, 44px targets, input-error glow present.

## Review Triage Log

Iteration 0 — Blind Hunter + Edge Case Hunter (parallel); orchestrator sets final severity. Both converged on the api-client 5xx-envelope, toast-timer, and FormTextField-guard findings.

**Patched (5) + 3 new tests:**
- `patch` — `apiFetch` retried 5xx BEFORE reading the body, discarding a valid error envelope (and its requestId), and a non-2xx status carrying a success-shaped body could be reported as success. Restructured the state machine: always read+parse the body first; a well-formed error envelope is honoured immediately (never retried, even on 5xx); a non-2xx + success-shaped body returns `http_error` (keeps requestId); only network / non-envelope-5xx / unreadable-5xx are transient-retried. Added tests: 5xx+error-envelope (1 call), 4xx+success-envelope→http_error, non-JSON-5xx→server_error retried.
- `patch` — sanitised `maxRetries` (NaN/Infinity/negative/non-integer → clamped) so the loop bound is always valid.
- `patch` — `FormTextField` now substitutes a generic accessible message when `error` is true with empty helper text, so an error is NEVER signalled by colour alone even if the prop types are bypassed (belt-and-braces with the discriminated union).
- `patch` — `ToastProvider` bumps a monotonic `key` on each `show()` and sets it on the `Snackbar`, forcing a remount so a new message always gets a fresh auto-hide timer (rapid successive toasts no longer inherit the prior timer).
- `patch` — `resolveDuration` guards against NaN/negative/Infinite ms; the reduced-motion global rule adds `animation-iteration-count: 1 !important` so infinite animations can't loop rapidly under `prefers-reduced-motion`.

**Deferred (1):** `apiFetch` retry does not clone a `Request` with a one-shot body (no live caller does this) — recorded in `deferred-work.md`.

**Rejected:** `useReducedMotion` SSR `defaultMatches` (the global CssBaseline reduced-motion rule already covers CSS transitions pre-hydration; JS-driven motion is opt-in later).

## Auto Run Result

- Result: **done** — five reusable primitives delivered: non-throwing `apiFetch` (retry + full envelope/status/body-error handling) + `RequestState`/`ApiResult`; `ToastProvider`/`useToast` (bottom-center, slide-up, auto-dismiss ~4s, form-level only); `FormTextField` input-error primitive (2px border+glow+helper text, never colour-alone); motion tokens + `useReducedMotion`/`resolveDuration`; theme a11y baseline (primary focus ring, 44px targets, global reduced-motion collapse).
- Gates: typecheck/lint/build exit 0; **43 tests pass** (8 files; api-client matrix = 11 cases); no ad-hoc hex outside `src/theme/**`; server/domain layer imports no UI. Resolves the Story 1.1 deferred api-client error-handling item.
- `followup_review_recommended: false` — all convergent findings patched or consciously deferred.
