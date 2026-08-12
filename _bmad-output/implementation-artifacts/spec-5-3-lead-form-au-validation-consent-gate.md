---
title: 'Story 5.3: Lead form with AU validation & consent gate'
type: 'feature'
created: '2026-08-14'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '2b78d79'
final_revision: '6657d35'
---

## OI-10 resolution (signed for this spike)

OI-10 (lead-capture conversion path — phone CTA vs inline lead form) is resolved for the spike as **both ship, inline on Results**: the phone CTA (Story 5.2) is the design-authoritative PRIMARY affordance, and an inline lead-capture form is ALSO provided as the consented data-contract path, appearing inline on the Results surface (per `EXPERIENCE.md`: "it appears inline on Results with submit disabled until required fields + consent are valid"). Because the spike's whole purpose is to test pipeline fidelity Figma → BMAD → code, building the full lead form exercises the complete FR-27/28/30 data contract. Documented here as the decision of record for the spike; a production build should re-confirm with Product which path is authoritative. This story builds the form + validation + consent gate; Story 5.4 wires submit → `LeadSink`, the `estimateId` link, and the submit/success/error states, and mounts it on the Results surface.

<intent-contract>

## Intent

**Problem:** There is no consented lead-capture form. FR-27/28/30 + UX-DR12/20 require an inline, AU-validated form (name/email/phone/contact-method/best-time + explicit consent) whose submit stays disabled until every required field AND consent are valid, with inline (never colour-only) field errors and correct consent semantics.

**Approach:** Build a presentational `LeadForm` (its own `react-hook-form` instance, separate from the estimate flow) whose per-field errors and submit-enabled decision come from PURE, node-testable functions reusing the Story 5.1 `isAuEmail`/`isAuPhone` validators and the shared `leadCaptureRequestSchema` field rules. Errors render via `FormTextField` (colour + text) and a labelled consent checkbox. NO submit wiring, no `estimateId`, no network, no states — those are Story 5.4. Expose an `onSubmit(values)` prop the parent (5.4) supplies.

## Boundaries & Constraints

**Always:** one `react-hook-form` instance owned by `LeadForm` (NOT the estimate flow's form); ALL validation/enable decisions live in pure functions (`lead-form-values.ts`) reusing `isAuEmail`/`isAuPhone` and mirroring `leadCaptureRequestSchema` (names trim≥2 ≤100, email/phone AU formats, contactMethod required, bestTime optional, consent literal-true); every field programmatically labelled with `aria-describedby` → its error node; consent is a real checkbox with correct semantics and its own error wiring; submit `disabled` until pure `isLeadFormSubmittable(values)` is true; errors shown only after a field is touched (no errors on a pristine form); ≥44px targets; theme tokens only (no ad-hoc hex — `no-adhoc-hex.test.ts` scans src/+app/); node-testable via `renderToStaticMarkup`.

**Block If:** OI-10 would need to be re-decided AGAINST shipping the inline form (would require Product sign-off beyond this spike's documented OI-10 resolution above).

**Never:** no submit-to-network, no `LeadSink`/`estimateId` linkage, no submit/success/error view-states, no analytics — all Story 5.4; no new dependencies (no `@hookform/resolvers`/zodResolver — mirror the estimate form's `Controller` + pure-`validate` pattern); no PII in logs; do not mutate the estimate flow's form aggregate.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Pristine form | all fields empty, untouched | submit DISABLED; NO field errors shown yet | n/a |
| Invalid email typed & blurred | `email = "nope"` | inline email error (text+colour) via `FormTextField`; submit stays disabled | `leadFormFieldErrors.email` set |
| Invalid AU phone | `phone = "12345"` | inline phone error; submit disabled | `leadFormFieldErrors.phone` set |
| Short name | `firstName = "J"` | inline name error (≥2 chars); submit disabled | error set |
| All valid, consent unchecked | valid name/email/phone/method, `consent=false` | submit STILL DISABLED; consent error/semantics correct | consent gate |
| All valid + consent checked | all required valid, `consent=true` | submit ENABLED; `onSubmit(values)` fires the typed payload on submit | none |
| bestTime omitted | valid form, `bestTime` unset | valid (optional) — submit enabled | none |

</intent-contract>

## Code Map

- `src/shared/schemas/lead.ts` -- REUSE `leadCaptureRequestSchema` field rules + `isAuEmail`/`isAuPhone` as the single validation source (Story 5.1).
- `src/features/lead/lead-form-values.ts` -- NEW. `LeadFormValues` type + `leadFormDefaults()` + PURE `leadFormFieldErrors(values)` (per-field messages) + `isLeadFormSubmittable(values)`.
- `src/features/lead/lead-form-copy.ts` -- NEW. Field labels, contactMethod/bestTime option vocab, consent copy, error messages (honest, plain voice).
- `src/features/lead/LeadForm.tsx` -- NEW. `'use client'` presentational form: own `useForm<LeadFormValues>`, `Controller` per field → `FormTextField`/select/consent checkbox, errors only after touched, submit `disabled` via `isLeadFormSubmittable`, `onSubmit` prop.
- `src/features/lead/index.ts` -- CHANGED. Export `LeadForm`, `LeadFormValues`.
- `src/components/feedback` -- REUSE `FormTextField` (enforces error-with-helperText, never colour-only).
- `src/features/estimate-form/DynamicField.tsx` -- REFERENCE pattern (Controller + pure validate + `aria-describedby` error node).
- `src/features/address/ManualAddressForm.tsx` -- REFERENCE pattern (FormTextField + programmatic labels).

## Tasks & Acceptance

**Execution:**
- [x] `src/features/lead/lead-form-values.ts` + test -- `LeadFormValues`, `leadFormDefaults()`, PURE `leadFormFieldErrors` + `isLeadFormSubmittable`; exhaustive unit tests over the I/O matrix (pristine, each invalid field, consent-unchecked-blocks, all-valid-enables, bestTime-optional).
- [x] `src/features/lead/lead-form-copy.ts` -- labels, options, consent + error copy (plain honest voice; no "free"/"quote now").
- [x] `src/features/lead/LeadForm.tsx` + test -- rhf form; per-field `Controller` → `FormTextField`/select + consent checkbox with correct semantics + `aria-describedby` error wiring; submit disabled until submittable; errors only after touched; node structure tests via `renderToStaticMarkup` (labels present, consent checkbox present, submit disabled on pristine, `aria-describedby` linkage).
- [x] `src/features/lead/index.ts` -- export `LeadForm` + `LeadFormValues`.

**Acceptance Criteria:**
- Given the lead form renders (OI-10 resolved), when I fill it in, then it captures first/last name, email, phone, contact method, best time, and an explicit consent checkbox (FR-27, UX-DR12).
- Given AU formats, when email/phone/name are invalid, then inline errors show (text + colour, never colour alone) via the shared `isAuEmail`/`isAuPhone` rules (FR-28, NFR-10, UX-DR20).
- Given the consent gate, when any required field is invalid OR consent is unchecked, then submit stays disabled (FR-30); when all required fields are valid AND consent is checked, submit enables.
- Given accessibility (UX-DR20 lead), then every field is programmatically labelled, errors are linked via `aria-describedby`, and the consent checkbox carries correct semantics; targets ≥44px.

## Spec Change Log

## Review Triage Log

Blind Hunter + Edge Case Hunter (parallel, opus-4.8). Orchestrator set final severities. 6 finding-groups → 3 patched (1 HIGH, 1 MED, 1 LOW-test), 1 deferred (documented), 2 cleared-as-coverage-notes.

**Patched:**
- **HIGH — `bestTime: ''` client/server contract drift** (BH#1 / EH#1). Both reviewers empirically confirmed: `isLeadFormSubmittable` accepted `bestTime: ''` (the form's default/"no preference" happy path), but `leadCaptureRequestSchema.bestTime` is `z.enum(...).optional()` — it accepts `undefined`/absent, NOT `''`. So `safeParse({...,bestTime:''})` → **false**. Story 5.4 forwarding the raw value would 400 the most common submit. Fix: added a PURE `toLeadRequestFields(values)` adapter that returns the schema-ready `LeadRequestFields` (= `LeadCaptureRequest` minus `estimateId`) with the `''` sentinel OMITTED, or `null` when not submittable. Added a cross-check test asserting the adapter's output satisfies `leadCaptureRequestSchema.safeParse` (with a stub estimateId) for `bestTime` ∈ {'', 'morning', 'anytime'}. Corrected the "mirrors exactly" docstring to state the sentinel-normalization contract. `LeadForm.onSubmit` now emits `LeadRequestFields` (schema-ready), so Story 5.4 only joins the `estimateId`.
- **MED — `handleSubmit` did not re-guard the submit gate** (EH#2). rhf had no resolver/rules, so `handleSubmit` always invoked the callback; the ONLY guard was the disabled button (bypassable via forced/implicit submit). Fix: the submit callback now runs `toLeadRequestFields` and only calls `onSubmit` when it returns non-null — the pure gate is enforced in the submit PATH (defense in depth) AND normalizes in one step.
- **LOW (test completeness) — bestTime Select untested beyond its label** (EH#4). Added an assertion that the labelled `role="combobox"` control renders in SSR (MUI v9 emits option labels only on menu-open, which is client-only — documented in the test).

**Deferred (documented):**
- **LOW — no error-reveal / explanation on a submit-ATTEMPT with an untouched invalid field** (EH#3 / BH coverage note). FR-30 mandates submit stays DISABLED until valid, so there is no submit event to hang an "all-errors reveal" on; a user with one untouched required field sees a disabled button and per-field errors only appear on blur as they progress. Recorded in `deferred-work.md` — Story 5.4 (which owns the submit/states surface) should add a submit-attempt or `submitCount`-driven reveal / an aria-live error summary. Not fixed here to avoid pre-empting 5.4's state model.

**Cleared (both reviewers, verified):** name trim [2,100] EXACTLY matches `z.string().trim().min(2).max(100)`; email/phone use the SAME shared `isAuEmail`/`isAuPhone` (Story 5.1 dot-placement/separator fixes apply transitively); `contactMethod` Set ≡ `z.enum(['phone','email'])`; consent `!== true` guard + Checkbox `onChange={checked}` (always boolean, `checked={value===true}`) — no truthy-but-not-true path; touched-gating shows zero errors on a pristine form yet keeps submit disabled, and a corrected field clears its error (errors recomputed from `watch()` each render); every shown error node has an id its control references via `aria-describedby`, `undefined` (not dangling) otherwise; consent is a real `<input type="checkbox">` with its own error wiring; no resolver/rules → no double-validation conflict; disabled button also blocks Enter-key implicit submit; NO scope creep (no network/`estimateId`/mutation/analytics, not mounted into Results, no new deps, no `zodResolver`, no ad-hoc hex); no hollow/always-true tests.

**Coverage note (accepted for the node-only harness):** the `aria-describedby → error node` wiring and the submit-enable transition are asserted by the PURE-function tests + code inspection, not by an interactive render (the harness is Node-only, no jsdom/RTL). A manual/interactive a11y check of the touched-error announcement is planned with Story 5.4's states.

## Auto Run Result

- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel, opus-4.8). 6 finding-groups → 3 patched (HIGH bestTime drift, MED submit re-guard, LOW test), 1 deferred (submit-attempt reveal → 5.4), 2 cleared.
- **Gates:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (68 files, 500 tests) · `build` ✓.
- **Outcome:** Story 5.3 COMPLETE. Inline lead-capture form (OI-10 resolved: form ships inline on Results alongside the phone CTA) with AU-validated name/email/phone, contact-method + optional best-time, and an explicit consent checkbox. Every error/enable decision lives in PURE node-tested functions reusing the shared validators; a schema-ready `toLeadRequestFields` adapter closes the client/server contract so Story 5.4 need only join the `estimateId`. Submit disabled until all required valid AND consent true (FR-30); errors inline (text + colour) and shown only after touch; consent gate enforced in the submit path (defense in depth). No submit/network/state wiring — that is Story 5.4.
