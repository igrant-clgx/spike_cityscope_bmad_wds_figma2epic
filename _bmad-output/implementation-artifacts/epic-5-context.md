# Epic 5 Context: Lead Capture — Talk to a Home Loan Coach

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

The monetizing moment: after an honest estimate is delivered (Epic 4), convert that trust into a consented financing lead for the Demo Channel — "trust before ask", never a quote funnel. A `LeadSink` port (stub store for the spike) captures a lead linked to the current `estimateId`, so a Home Loan Coach receives contact details already anchored to scope and budget context. All lead PII crosses the BFF only (never client-to-external), is submitted solely with explicit consent, and is marked for encryption at rest — a legal (AU Privacy Act) invariant, not a UI preference. A low-pressure phone CTA is the design-visible primary path; whether an inline lead form is the authoritative conversion path is the OI-10 [OPEN] decision that gates Story 5.3.

## Stories

- Story 5.1: LeadSink port, stub store & shared lead schema
- Story 5.2: Contact Section & Coach CTA
- Story 5.3: Lead form with AU validation & consent gate
- Story 5.4: Submit lead linked to estimate with confirmation & states

## Requirements & Constraints

- The Results View presents a "Talk to a Home Loan Coach" CTA that includes a phone contact (FR-26).
- A lead captures first name, last name, email, phone, contact method, best time, and marketing consent (FR-27); fields validate against AU formats — valid email, valid AU phone, names ≥2 chars, valid AU postcode — with inline errors (FR-28, NFR-10).
- The lead is submitted linked to the generated `estimateId` and a success confirmation is shown (FR-29); explicit consent is required before submitting, so submit stays blocked until all required fields and consent are valid (FR-30).
- **PII / privacy (NFR-6, AD-1, AD-10):** PII is encrypted in transit and at rest, phone masked in logs, 24-month retention; the stored lead record is consent-gated and marked for encryption at rest. `LeadSink` rejects any consent-less request as defense in depth behind the UI gate.
- **OI-10 [OPEN] (FR-31):** lead capture placement/conversion path — phone CTA (design-visible) vs inline lead-capture form (data contract) vs modal/view — is undecided (Product + UX). Story 5.2's phone CTA ships regardless; Story 5.3's form is built "per OI-10 resolution" and must be reconciled to a signed decision before wiring. If a form ships, it appears inline on Results.
- **Deferred / stub:** no CRM integration in the spike (OI-11) — leads write to the stub store only; the adapter leaves a seam for the downstream connector. E2E runs against the stub.

## Technical Decisions

- The `LeadSink` port already exists at `src/server/domain/ports/lead-sink.ts` (`capture(lead): Promise<LeadReceipt>`, `LeadCapture { estimateId, consent }`, returning `leadId`). Build the stub store adapter, BFF route (`app/api/v1/leads`), shared request/response envelope schema, and TanStack Query **mutation** by copying the proven EstimateEngine template verbatim: stub adapter (`src/server/adapters/estimate/stub-estimate-engine.ts`) → thin application use-case (`src/server/application/estimate.ts`) → BFF route that re-validates input AND output with the shared schema and returns the AD-9 envelope (`app/api/v1/estimate/route.ts`) → non-throwing `apiFetch` (`data.ok === false`) → `useMutation` hook (`src/features/estimate-form/use-estimate.ts`). New feature slice lives under `src/features/lead` (AD-2, AD-5, AD-9).
- **AD-1 / NFR-6 (BFF-only PII):** the browser calls only same-origin `app/api/v1/leads`; the stub store is instantiated server-side and never exposed. No PII in any `NEXT_PUBLIC_*` var, query string, or log line; phone masked in logs; `requestId` propagated per AD-9.
- **AD-10 (consent gate + encryption-at-rest):** the `LeadSink` adapter rejects any `LeadCaptureRequest` lacking a truthy consent flag; the stored record is explicitly marked for encryption at rest and the 24-month retention policy. Enforce at the sink even though the UI also gates — defense in depth.
- **AD-4 (shared Zod lead schema):** define one `LeadCaptureRequest` schema in `src/shared/schemas/` (add `lead.ts`, export from `index.ts`), reused client + server, extending the discriminated success/error `envelopeSchema` precedent (`src/shared/schemas/estimate.ts`, `envelope.ts`). AU phone/email/postcode formats live in the schema (FR-28); the client validates with it and the route re-parses input before the application layer runs. The domain port keeps plain TS mirrors (no zod) to preserve layer purity.
- **`estimateId` linkage (FR-29, AD-6):** the lead must carry a current, server-recognised `estimateId` (opaque `est_[0-9a-f]{16}` join key issued by the estimate seam; deterministic hash of scope). `LeadSink` rejects a lead whose `estimateId` is unknown/expired; changing address/type invalidates the prior estimate and disables lead capture until re-estimated. See how `estimateId` flows in `src/features/results/build-estimate-request.ts` / the estimate result envelope.
- **Boundary invariant:** `src/server/architecture.test.ts` now guards `LeadSink` too — domain/adapters import no `next`/`react`/`@mui/*`/`zod`, and no adapter imports another. Keep dependency direction inward (client → BFF → application/domain/ports → adapter). Tests are Node-only; add no new dependencies without justification.
- **POST retry:** the estimate seam deferred non-idempotent-POST retry to this epic (see `use-estimate.ts` note) — design a safe retry/idempotency approach now that the lead submit is stateful, so a retry preserves entered data without duplicating a stored lead (FR-32/33).

## UX & Interaction Patterns

- **Contact Section (UX-DR11, primary conversion):** a canvas-fill card (distinct from the white result card) below the result actions holding "Talk to a Home Loan Coach", a short description, and a full-width blue **phone CTA** — `Call us: 0800 269 4663` as a `tel:` link with a left phone icon (opens the dialer on mobile).
- **Voice/tone (UX-DR17):** the CTA is a low-pressure, honest offer — "Talk to a Home Loan Coach" / "See how we can help", never "Get your FREE quote now".
- **Lead form (UX-DR12):** if chosen per OI-10, an inline form capturing first/last name, email, phone, contact method, best time, and an explicit consent checkbox; submit disabled until required fields + consent are valid; inline field errors (2px error border + soft glow + helper text, never colour alone).
- **Lead-surface states (UX-DR16 lead):** model the lead surface with a discriminated view state and a pure mapper, reusing the `toResultsView` template (`src/features/results/results-view-state.ts` → `ResultsPanel.tsx`): idle/form → submitting (button spinner, duplicate-submit prevented) → success confirmation ("A coach will be in touch") that replaces the form while the estimate stays visible → non-destructive, retryable submit error that preserves entered data. Keep the mapper node-testable (no RTL).
- **Accessibility & consent semantics (UX-DR20 lead):** fields programmatically labelled with `aria-describedby` errors, logical tab order, ≥44px targets, text-not-colour error signalling; the consent checkbox carries correct semantics; announce submission outcome via a persistent live region. Plan a manual a11y check for the confirmation announcement up front — the node-only harness can't assert SR announcement.

## Cross-Story Dependencies

- Stories 5.2–5.4 depend on the `LeadSink` port, stub store, shared lead schema, envelope, and mutation hook delivered by Story 5.1.
- Story 5.3 (lead form) is gated by the OI-10 [OPEN] conversion-path decision (phone CTA vs lead form); Story 5.2's phone CTA is unblocked. Resolve OI-10 to a signed product decision before wiring 5.3/5.4.
- Epic 5 consumes the `estimateId` and invalidation semantics established by Epic 4 (the join key the lead links to) and reuses the Epic 1 async/error/Toast/live-region primitives and the Epic 4 Results view state template.
- The OI-10 conversion path is the tracked path for OI-10 conversion analytics — emit `lead_submitted` via the typed `AnalyticsSink` seam (AD-12) carrying `estimateId`/`requestId` but never PII.
