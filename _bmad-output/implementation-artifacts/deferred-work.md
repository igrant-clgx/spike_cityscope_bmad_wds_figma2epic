- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md`
  summary: No automated enforcement of the inward dependency rule (domain must not import framework/UI/adapter/vendor code).
  evidence: The rule is documented in README and satisfied by the current code (verified by grep), but nothing prevents a future dev from importing `next`/`react`/an adapter into `src/server/domain/**`. Add an ESLint `no-restricted-imports`/`import/no-restricted-paths` boundary rule or an architecture test.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md`
  summary: `src/lib/api-client.ts` `apiFetch` has no error handling — throws raw errors on network failure, non-JSON/empty bodies, or non-envelope responses, and ignores HTTP status.
  evidence: Two reviewers independently flagged this. The spec deliberately scopes api-client error/pending/retry handling to Story 1.4 (Shared feedback primitives); the helper is currently unused by any user path. Story 1.4 must add: try/catch around fetch, `safeParse` for the envelope, response.ok/status handling, and typed errors carrying requestId for correlation.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md`
  summary: tsconfig enables `strict` but omits `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
  evidence: For a money/domain foundation using `readonly string[]` index access and many optional envelope/port fields, these two flags add meaningful safety. Consider enabling `noUncheckedIndexedAccess` (low-risk) in a later hardening pass; `exactOptionalPropertyTypes` may require code adjustments.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-system-theme.md`
  summary: The no-ad-hoc-hex convention test only catches hex literals (not `rgb()`/`hsl()`/CSS named colours) and has no fs-error/symlink handling.
  evidence: Edge Case Hunter flagged that a dev could bypass token enforcement with non-hex colour formats, and that an unreadable file/symlink would crash the walk rather than report. The AC is hex-specific and the spike repo has no symlinks; acceptable for now. If brand-layer enforcement becomes CI-critical, broaden the regex to all colour formats and wrap fs reads in try/catch.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-system-theme.md`
  summary: `header-bg` (#2C2C2C) and `disabled` (#CCCCCC) palette tokens live only in `src/theme/tokens.ts`, not mapped into MUI palette slots.
  evidence: Blind Hunter noted these two brand colours aren't exposed on the MUI theme. MUI has no natural slot for a header background, and the charcoal header is built in Story 1.3; disabled-control states arrive with the form controls (Epics 2–5). Consumers read them from `tokens.ts` today. Wire into the theme (custom palette augmentation or component overrides) when the header and disabled states are implemented.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-feedback-motion-a11y.md`
  summary: `apiFetch` retries reuse the same `RequestInfo`/`RequestInit`; a `Request` with a one-shot body would fail on retry (consumed stream).
  evidence: Blind Hunter flagged that retrying a `Request` whose body was already read fails. All current callers pass a URL string + plain `init` (health check has no body), so no live defect. If a future caller passes a `Request` with a streamed body, clone it per attempt (or read the body once and rebuild `init`) before retrying.

## Story 2.2 (2026-08-12)

- **[low] ResolvedAddress schema allows whitespace-only parts.** `resolvedAddressSchema` (`src/shared/schemas/address.ts`) uses plain `z.string()` for `street`/`suburb`, so a whitespace-only value would format to a blank-looking line. The stub adapter (Story 2.1) never emits such values, so there is no live trigger. When manual entry lands (Story 2.4), tighten the display-bearing string fields with `.trim().min(1)` — that is the natural place to harden the input contract. Deferred from Story 2.2 (Edge Case Hunter).
- **[low] AddressBlock control interaction (Enter/Space → onChangeAddress) is not directly exercised.** Node-only tests (`renderToStaticMarkup`) cannot dispatch DOM events; the tests instead assert the control is a real `<button type="button">` (native keyboard operability) with an accessible name in both states. A behavioural interaction test is blocked on the Epic 1 retrospective action item "interaction-testing decision before Story 2.3" — the modal in 2.3 is the first surface that genuinely needs event-level testing, and that decision (node-only + MUI focus-trap + documented manual a11y vs. adding jsdom) will settle how this control is covered too. Deferred from Story 2.2 (Edge Case Hunter).

## Story 2.5 (2026-08-12) — OI-7 [OPEN] product confirmation required

- **[product] OI-7 — exact address-change reset scope is UNCONFIRMED.** FR-9 requires that changing the address resets dependent renovation scope to "a defined state", but the clear-vs-keep decision is `[OPEN]` (handover left it undecided). Story 2.5 implements the documented `[ASSUMPTION]`: changing an already-confirmed address CLEARS dependent Step 1–3 answers (via `changeAddress`, which rebuilds from `emptyForm()`), and communicates the reset with a non-blocking toast. **Before Epic 3 build, product must confirm** whether the reset should clear ALL answers (current assumption), keep answers that are still valid for the new property, or prompt the user. If the decision changes, only `changeAddress` (domain) + the notice copy need to change — the seam is isolated. Flagged from Story 2.5.

## Story 2.5 (2026-08-12) — node-only interaction-test gap (low)

- **[test] AddressSection first-set-vs-change transition not asserted at container level.** The choice between `setAddress` (first confirm, no notice) and `changeAddress` (real change, reset + toast), and the toast firing, are interaction-level and not exercised by the node-only test harness (no jsdom/RTL/events) — consistent with the Story 2.3 MUI focus-trap precedent. The domain-layer behavior IS proven (`renovation-estimate-form.test.ts`: `changeAddress` resets to `emptyForm()` baseline, `setAddress` does not). Optional future hardening: extract a pure transition/notification decision helper so the branch + notice decision is unit-testable in node. No behavioral gap. Flagged from Story 2.5.

## Story 3.1 (2026-08-13) — OI-1 & OI-2 [OPEN] product confirmation required

- **[product] OI-1 — final Step 2 item content is UNCONFIRMED.** The ConfigSource stub adapter serves a PLACEHOLDER item set (kitchen/bathroom/flooring for Internal; roofing/painting/landscaping for External). Product must confirm the real Step 2 item taxonomy before Story 3.4 wires the multi-select. Because content is served purely as data behind the `ConfigSource` port, confirming OI-1 changes ONLY the stub bundle (and later the real adapter) — no route/UI/schema edit. Flagged from Story 3.1.
- **[product] OI-2 — final Step 3 per-field validation rules are UNCONFIRMED.** The `propertyQuestionSchema` carries GENERIC field metadata only (required flag; kind-specific bounds like min/max/step/options). Structural integrity is enforced (min ≤ max, positive step, unique option values, ISO date bounds, referential integrity of ids), but the actual per-field validation RULES a user's answer must satisfy (e.g. required ranges, conditional requirements) are OI-2 and pending Product. Story 3.5 wires the validation mechanism generically; the exact rules drop in via config once confirmed. Flagged from Story 3.1.

## Story 3.2 — Accordion stepper shell & flow aggregate

- **OI-2 (full per-field detail validation) — `[DEFER → Story 3.5]`** — `isStepComplete('details')` currently uses the shell heuristic "at least one property detail holds a meaningful (non-blank) value". Full per-field validity (required fields, numeric ranges `min <= max`, date bounds, option membership) is Story 3.5's dynamic-field-renderer + validation job. Edge Case Hunter finding #9 (partial-patched: blank/undefined values already excluded).
- **Interaction-test gap (manual a11y check) — `[DEFER / DOCUMENTED]`** — expand/collapse focus movement and `aria-live` announcement *timing* are covered by the spec's documented manual a11y check (node-only test policy, Story 2.3 focus-trap precedent). Structural invariants (one-expanded, `aria-expanded`, live region present, seeded-completed summary) ARE node-tested.

## Story 3.3 — Step 1 renovation-type selection

- **Phantom selection on config-version change — `[DEFER → Epic 4 / AD-6]`** — If a config refetch returns a `renovationTypes` taxonomy that no longer contains the chosen `renovationTypeId`, no button renders pressed yet `isStepComplete('type')` still reports complete and Step 2 (FR-11) would filter items by a stale id. Not reachable in the spike (single immutable `configVersion`; refetch returns identical data). Proper fix — reconcile a stale selection against the active config version — is config-invalidation policy owned by Epic 4 (AD-6: changing renovationType/config invalidates prior EstimateResult). Reviewers: Edge Case Hunter #1 (high, not-reachable-in-spike) + Blind Hunter cleared; Edge #4 (value-not-in-types presentational) folds in here.

## Story 3.4 — Step 2 config-driven multi-select items

- **OI-1 (exact Step 2 item content) — `[OPEN]`** — The precise item taxonomy per renovation type is pending product confirmation (FR-15). Implemented generically: items are served by ConfigSource and filtered by the Step 1 `typeId` (stub: Internal→kitchen/bathroom/flooring, External→roofing/painting/landscaping). No item label/id is a literal in UI code. Confirming the final list is a config-content change only (no code).
- **Config-error non-destructive fallback — `[DEFER / minor]`** — When a background config refetch returns a failure envelope, Step 2 shows the error treatment and (now, post-review) preserves the existing selection rather than pruning it. Surfacing the last-known items alongside the error banner (instead of replacing them) is a possible UX enhancement, out of spike scope. Reviewers: Blind #2 / Edge #9 (resolved by the prune-gating patch).

## Story 3.5 — Step 3 dynamic property-details

- **OI-2 step-alignment validation (deferred):** `validateAnswer` enforces required/bounds/maxLength/date-format/budget rules but does NOT validate `step` alignment for numeric/slider/budget (off-step programmatic/stale values pass). OI-2's final validation rule-set is marked [OPEN]; land step-alignment when OI-2 is closed (likely Epic 4/6).
- **Stale-answer pruning on deselect (deferred → Epic 4 submit path):** answering a question then deselecting its scoping item leaves the answer in `propertyDetails` (Controller unmounts, rhf retains the value). Harmless until submission. The Epic 4 submit story must prune `propertyDetails` to currently-visible question ids (via `filterQuestions`) before dispatch, or set `shouldUnregister`.
- **Form-level submit toast (deferred → Epic 4):** no submit action exists in this story; the form-level validation/success toast lands with the Estimate submission flow.

## Story 4.1 — EstimateEngine port & stub

- **Non-idempotent POST retry (deferred → Epic 5):** `apiFetch` retries transient failures (network/5xx) up to 2×, and `use-estimate` issues a POST. Harmless now — the estimate route is a pure, side-effect-free computation — but once Epic 5 makes this seam stateful (lead linkage / persistence), a 5xx-then-success retry could double-create. Before adding a write to this POST path, gate retries by idempotency (retry only idempotent verbs, or require an idempotency key). A `// NOTE:` marker is in `use-estimate.ts`.
- **OI-3 real cost algorithm (still [OPEN], CRITICAL):** the stub's per-item base-cost magnitudes are `[ASSUMPTION]` placeholders. The real pricing model drops in behind `EstimateEngine` as a single adapter substitution (`stub-estimate-engine.ts`) with no change above the port. `estimateId` is currently a 64-bit non-crypto scope hash; if it becomes the authoritative persistence key, assign a durable id at persistence time instead.

## Story 4.2 — Result cost card

- **Persistent live-region announcement (deferred → Story 4.3):** the result arrival announcement (UX-DR20 results) is only reliable if the PERSISTENT results parent keeps an always-present `role="status"` region in the tree and lets the card content populate it. A live region inserted in the same commit as its text is frequently NOT announced by screen readers. Story 4.3 must render the live region in the persistent results shell (not remount it between calculating→result states). The card documents this contract in its header.

## Story 4.4 — Edit/New Estimate actions

- **Post-action focus management (deferred → manual a11y check):** clicking "Edit Estimate" or "New Estimate" unmounts the focused button (view returns to idle), so keyboard/screen-reader focus falls to `<body>`. The fix is to relocate focus to the form's first control (Edit) or the Calculate CTA (New) after the reset. Deferred to the epic's already-planned manual a11y pass because the node-only test harness cannot assert focus movement, reveal timing, or SR announcement (per epic-4-context UX-DR20 note).

## Story 5.1 — non-idempotent lead POST retry (BH#2)
`src/features/lead/use-lead-capture.ts` reuses the shared non-throwing `apiFetch`, which retries 5xx/network up to `DEFAULT_MAX_RETRIES=2`. Safe for the idempotent estimate compute, but a lead capture is a stateful mutation — a transient 5xx AFTER the sink stored the lead → client re-POST → duplicate lead once a real CRM (OI-11) is wired. **Resolve in Story 5.4:** disable retry for this mutation or attach an idempotency key.

## Story 5.1 — sentinel / all-zeros phone accepted (EH#3)
`isAuPhone` accepts format-valid but semantically impossible numbers (e.g. `0400000000`, `0200000000`). Semantic-plausibility validation is out of spike scope; revisit if real telephony validation is required downstream.

## Story 5.3 — no error-reveal on a submit-attempt with an untouched invalid field (EH#3)
FR-30 keeps the submit button DISABLED until the form is valid, so there is no submit event to trigger an "all-errors reveal"; a user with one still-untouched required field sees a disabled button with no explanation, and per-field errors surface only on blur. **Resolve in Story 5.4** (owns the submit/states surface): on a submit-attempt or `submitCount>0`, treat all fields as touched (reveal every error) and/or add an aria-live error summary so the blocked state is explained.
