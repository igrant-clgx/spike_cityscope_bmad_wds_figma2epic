---
title: 'Story 5.2: Contact Section & Coach CTA'
type: 'feature'
created: '2026-08-14'
status: 'in-review'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
baseline_revision: '98a62a9'
final_revision: ''
---

<intent-contract>

## Intent

**Problem:** After an honest estimate is delivered, the homeowner has no design-visible path to act on financing. FR-26/UX-DR11 require a low-pressure "Talk to a Home Loan Coach" Contact Section with a phone CTA below the result actions.

**Approach:** Add a pure, static `ContactSection` — a canvas-fill card (distinct from the white result card) holding the coach heading, a short honest description, and a full-width `tel:` phone CTA with a left phone icon. Render it inside the Results success/low-confidence surface, below the Edit/New Estimate actions. No data flow, no PII, no lead form (OI-10 gates the form to Story 5.3).

## Boundaries & Constraints

**Always:** low-pressure, honest voice (UX-DR17) — "Talk to a Home Loan Coach" / "See how we can help", never "Get your FREE quote"; the phone CTA is a real `tel:` link (opens the dialer on mobile) with an inline `<svg>` phone icon (no `@mui/icons-material` — not installed); canvas-fill card visually distinct from the white result card; ≥44px touch target; theme tokens only (no ad-hoc hex); node-testable via `renderToStaticMarkup`.

**Block If:** a decision would require choosing the authoritative conversion path (phone CTA vs inline lead form) — that is OI-10 and belongs to Story 5.3. This story ships the phone CTA ONLY, which is unblocked; do NOT build a form here.

**Never:** no lead form, no PII, no submit, no analytics wiring (Story 5.3/5.4); no new dependencies; no `@mui/icons-material`; the Contact Section shows only when an estimate is present (success/low-confidence), never in idle/loading/error.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Estimate present | Results view `success` or `lowConfidence` | Contact Section renders below actions: heading, description, full-width `tel:` CTA with phone icon | n/a |
| No estimate | Results view `idle`/`loading`/`error` | Contact Section NOT rendered | n/a |
| Phone CTA href | static coach number | `href="tel:<digits>"` (no spaces in href), visible label formatted for humans | n/a |
| Icon a11y | phone icon | `aria-hidden`/`role="presentation"` — decorative, CTA label carries the meaning | n/a |

</intent-contract>

## Code Map

- `src/features/lead/contact-copy.ts` -- NEW. Contact Section microcopy: heading, description, CTA label, human phone + `tel:` digits.
- `src/features/lead/ContactSection.tsx` -- NEW. Pure canvas-fill card + full-width `tel:` CTA + inline phone `<svg>`.
- `src/features/lead/ContactSection.test.tsx` -- NEW. Node tests (renderToStaticMarkup): renders in success/low-confidence, `tel:` href, decorative icon, honest copy.
- `src/features/lead/index.ts` -- CHANGED. Export `ContactSection`.
- `src/features/results/ResultsPanel.tsx` -- CHANGED. Render `<ContactSection />` in the success/lowConfidence block, below the Edit/New Estimate actions.
- `src/features/results/ResultsPanel.test.tsx` -- CHANGED. Assert the Contact CTA appears in success and is absent in idle/error.

## Tasks & Acceptance

**Execution:**
- [x] `src/features/lead/contact-copy.ts` -- coach heading, low-pressure description (UX-DR17), CTA label (`Call us`), human-readable phone + digits-only `tel:` target.
- [x] `src/features/lead/ContactSection.tsx` -- pure canvas-fill `Card`/`Box` (background distinct from white result card), heading, description, full-width `Button` `component="a"` `href="tel:..."` with a left inline-svg phone icon (`aria-hidden`), ≥44px target.
- [x] `src/features/lead/ContactSection.test.tsx` -- node tests: `tel:` href has no spaces; label present; icon decorative; honest copy (no "free"/"quote now").
- [x] `src/features/lead/index.ts` -- export `ContactSection`.
- [x] `src/features/results/ResultsPanel.tsx` -- render `<ContactSection />` after the actions Stack in the success/lowConfidence block only.
- [x] `src/features/results/ResultsPanel.test.tsx` -- Contact CTA present in success, absent in idle/error.

**Acceptance Criteria:**
- Given I am viewing my estimate, when the Results success/low-confidence surface renders, then a canvas-fill Contact Section presents "Talk to a Home Loan Coach" with a full-width `tel:` phone CTA and a phone icon (FR-26, UX-DR11).
- Given the Contact Section copy, then it is low-pressure and honest (UX-DR17) — no "free"/"quote now" framing.
- Given the OI-10 [OPEN] conversion-path decision, then this story ships the phone CTA only and does NOT build a lead form (FR-31, deferred to Story 5.3).
- Given no estimate (idle/loading/error), then the Contact Section is not rendered.

## Spec Change Log

## Review Triage Log

Blind Hunter + Edge Case Hunter (parallel, opus-4.8). Orchestrator set final severities. **No high/medium bugs** — a small, contained pure-UI story matching spec tightly. 5 finding-groups → 2 patched (both LOW), 2 noted-as-upstream/by-design, 1 accepted-spike-scope.

**Patched (LOW):**
- **BH#1 — barrel import pulled the lead-capture client hook into the Results module graph.** `ResultsPanel` imported `ContactSection` via the `@/features/lead` barrel, which re-exports the `'use client'` `use-lead-capture` mutation hook — unnecessary coupling (verified NOT a cycle: no `lead → results` edge). Fix: import `ContactSection` directly from its module.
- **EH#1 — empty/whitespace display number would yield a dead `tel:` link.** The `not.toMatch(/\s/)` guard passes trivially for `''`. Fix: added `expect(CONTACT_PHONE_TEL).toMatch(/^\d{6,}$/)` so an accidentally-emptied number fails the suite.

**Noted / not fixed:**
- **BH#2 — `0800` toll-free prefix on an AUD product** (AU toll-free is `1800`; `0800` is NZ/UK). NOT a story defect — the number is prescribed verbatim by `epic-5-context.md`. Flag to the epic-copy owner; out of scope to change here.
- **EH#2 — `tel:` derivation strips only whitespace**, not dashes/parens. Correct and robust for the documented space-separated format (`08002694663`, verified spaceless/non-empty). RFC 3966 dialers tolerate visual separators anyway. No change needed for the current copy.
- **EH#3 — voice negative-assertion scans full rendered markup** (incl. emotion class hashes), so it's narrow/slightly brittle. Copy today satisfies it ("no pressure, no obligation"; no "free"/"quote now"). Accepted as spike scope.

**Cleared (both reviewers):** conditional render — Contact Section shows in EXACTLY success + lowConfidence, absent in idle/loading/error, both presence AND absence asserted; SSR emits a real `<a href="tel:08002694663">` + one inline `<svg>` (empirically probed); decorative icon (`aria-hidden` + `focusable="false"`); ≥44px target (`minHeight:48`, `fullWidth`); canvas-fill card `background.default` visually distinct from the white result `Paper`; no ad-hoc hex; heading order h2→h3 valid; no scope creep (no form/PII/submit/analytics/new deps/`@mui/icons-material`); tests assert real markup, not mocks.

## Auto Run Result

- **Reviewers:** Blind Hunter + Edge Case Hunter (parallel, opus-4.8). 5 finding-groups → 2 patched (LOW), 2 noted-upstream/by-design, 1 accepted. No high/medium.
- **Gates:** `typecheck` ✓ · `lint` ✓ · `test` ✓ (66 files, 470 tests) · `build` ✓.
- **Outcome:** Story 5.2 COMPLETE. Design-visible primary conversion path landed: a canvas-fill "Talk to a Home Loan Coach" Contact Section with a low-pressure honest description and a full-width `tel:` phone CTA (inline-svg phone icon), rendered on the Results success/low-confidence surface below the post-result actions. Phone-CTA-only — the inline lead form stays OI-10-gated to Story 5.3.
