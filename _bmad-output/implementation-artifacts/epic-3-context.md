# Epic 3 Context: Guided 3-Step Estimate Form

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let a homeowner describe their renovation scope through a progressive-disclosure accordion: Step 1 picks Internal vs External renovation type, Step 2 multi-selects the specific items (option set driven by Step 1), and Step 3 answers dynamic property-detail questions with per-field validation. All form content — renovation types, Step 2 items, Step 3 questions — is served from the ConfigSource port (stub adapter for the spike), never hardcoded, so content can change without a redeploy. A single flow aggregate owns all captured scope across the three steps, extending the address slot established in Epic 2.

## Stories

- Story 3.1: ConfigSource port, stub adapter & versioned content schemas
- Story 3.2: Accordion stepper shell & flow aggregate
- Story 3.3: Step 1 — Renovation Type selection
- Story 3.4: Step 2 — Config-driven multi-select items
- Story 3.5: Step 3 — Dynamic Property Details with validation

## Requirements & Constraints

- Step 1 presents two mutually exclusive choices (Internal/External); a selection is required before proceeding (FR-10). The chosen type determines which option set Step 2 loads (FR-11), and selected vs unselected state must be visually distinct (FR-12).
- Step 2 loads its item options from ConfigSource based on the Step 1 type (FR-13). Items are multi-select with at least one required to proceed; zero items blocks progress with a validation error (FR-14). The label/cost metadata reflect the Step 1 type (FR-15).
- Step 3 loads its questions dynamically from ConfigSource, with the field set changing based on Step 2 selections (FR-16). It captures property attributes — type, age, size, condition, target start date, and a budget min/max pair (FR-17) — and enforces per-field required/optional and validation rules (FR-18).
- Content changes to items and questions must require no code change and no redeploy; nothing is a literal in client or handler code (NFR-9).
- **OI-1 [OPEN]:** the exact Step 2 item content/set is a placeholder pending Product confirmation. Build against the config contract, not a fixed list.
- **OI-2 [OPEN]:** the final Step 3 per-field validation rules are pending Product confirmation. Wire the validation mechanism generically; exact rules come from config/Product.
- **OI-9 [ASSUMPTION]:** the completed-step completion indicator is assumed to be a check icon; confirm the exact indicator with UX.

## Technical Decisions

- A `ConfigSource` domain port serves versioned content for renovation types, Step 2 items, and Step 3 questions via a deterministic stub adapter; application/UI code depends on the port contract, not the adapter or a future CMS shape (AD-2, AD-8).
- Item and question content is validated against shared Zod schemas reused on client and server; responses carry a stable `configVersion` and stable item/question IDs so later estimate requests can echo the version they were built from (AD-4, AD-8).
- Form content is data-driven configuration, not code branches — no renovation label, item, question, or field-type is hardcoded (AD-8, AD-11, NFR-9).
- A single `react-hook-form` flow aggregate owns all in-progress form input across steps; server-derived async state (config item/question loading, errors, retry) is owned by TanStack Query and consumed through hooks, never ad-hoc fetch + local state (AD-5, AD-6).
- The flow aggregate at `src/server/domain/flow/renovation-estimate-form.ts` must be extended with Step 1–3 scope slots alongside the existing immutable address slot. Because `changeAddress` rebuilds from `emptyForm()`, new scope slots reset for free when the address changes (Story 2.5 behavior).
- Ports live in `src/server/domain/ports/`, adapters in `src/server/adapters/`, shared schemas in `src/shared/schemas/`, config BFF routes under `app/api/v1/config/`, and the Step 1/2/3 UI under `src/features/`. Keep dependency direction inward (client → BFF → application/domain/ports → adapter); domain and adapters import no `@mui`/`next`/`react`/`zod`. Tests are Node-only (no jsdom/RTL); MUI via ThemeProvider; add no new dependencies without justification.

## UX & Interaction Patterns

- Accordion stepper: exactly one step expanded at a time; each header is a `button` exposing `aria-expanded`; a completed step collapses to a summary line with a completion indicator (OI-9). Expand/collapse uses the ~300ms motion token and honors `prefers-reduced-motion` (UX-DR7, UX-DR18).
- Selection buttons: clear unselected vs `primary-active` selected styling, minimum 44px target, keyboard toggle with Enter/Space. Step 1 is single-select; Step 2 is multi-select toggle (UX-DR6).
- Step 3 dynamic field renderer supports radio, text, numeric, date picker, slider, select, and a bounded budget min/max pair, driven by question field-type from config (UX-DR8).
- Form-slice states must render: empty/in-progress, per-field and form-level validation error, and config-loading (UX-DR16). Field errors use the input-error treatment with helpful copy; a form-level submit issue surfaces via Toast (UX-DR17).
- Form a11y: every field is programmatically labelled and `aria-describedby`-linked to its error text; step changes are announced to screen readers (UX-DR20).

## Cross-Story Dependencies

- Stories 3.3–3.5 depend on the ConfigSource port, stub adapter, shared item/question schemas, and TanStack Query hooks from Story 3.1, and on the accordion shell + extended flow aggregate from Story 3.2.
- Step 2 (3.4) depends on the Step 1 (3.3) type selection to determine its option set; Step 3 (3.5) depends on Step 2 selections to determine its question/field set.
- The flow aggregate extension builds on Epic 2's address slot and its change-reset behavior; Epic 4 consumes the captured scope this epic produces.
