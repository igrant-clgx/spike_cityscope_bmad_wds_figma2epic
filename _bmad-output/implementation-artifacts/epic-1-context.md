# Epic 1 Context: Application Foundation & Branded Shell

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Epic 1 establishes the greenfield walking skeleton for the renovation calculator: a running Next.js App Router application with a Ports & Adapters architecture, shared Zod contracts, a single MUI design-system theme, and a branded, accessible, responsive shell. It matters because every later feature depends on the same BFF boundary, dependency rules, feedback conventions, motion/a11y primitives, analytics seam, and brand foundation rather than re-inventing them story by story.

## Stories

- Story 1.1: Greenfield scaffold & Ports-and-Adapters skeleton
- Story 1.2: Design-system theme & tokens
- Story 1.3: Branded shell — header, responsive layout, footer disclaimer
- Story 1.4: Shared feedback, motion & accessibility primitives
- Story 1.5: Typed AnalyticsSink event seam

## Requirements & Constraints

- Build from an empty greenfield scaffold; do not use an external starter template. The result must build, typecheck, lint, and serve a placeholder home route.
- Use Next.js 16 App Router, React 19, TypeScript 7 strict, Node ≥20 with target Node 24 LTS, MUI v9, TanStack Query v5, react-hook-form v7, and Zod v4.
- The browser must call only same-origin BFF route handlers. Third-party/provider calls, API keys, PII handling, and adapter selection belong server-side.
- The app shell is persistent on every view: full-width branded header, centered responsive content column, and legal disclaimer footer.
- Header branding must show the product logo on the left and Demo Channel partner logo on the right at all breakpoints; desktop header height is 68px.
- Main content uses a calm single-column layout: max 840px on desktop, responsive reflow for tablet/mobile, no horizontal scroll, no multi-column page layout.
- Apply one MUI theme as the design-system source of truth. No ad-hoc hex values, spacing, focus styles, motion timing, or bespoke MUI restyling outside the theme/tokens.
- Accessibility baseline is WCAG 2.1 AA: contrast-safe theme usage, visible focus indicators, keyboard operability, logical tab order, programmatic labels, text-backed error states, and interactive targets at least 44px.
- Shared feedback primitives must preserve user-entered data during loading/errors, prevent duplicate submits while pending, and provide retry affordances for retryable failures.
- Motion must communicate state changes without gating interaction and must collapse under `prefers-reduced-motion`.
- Analytics must be available as a typed first-party seam from the foundation and must never carry PII.

## Technical Decisions

- Architecture is Ports & Adapters with a domain core behind a Next.js BFF. Dependency direction points inward: client → BFF route handlers → application use cases → domain/ports; domain imports no framework, UI, adapter, or vendor code.
- Seed the source tree around `app/`, `app/api/v1/**`, `src/features/**`, `src/components/**`, `src/lib/api-client.ts`, `src/theme/**`, `src/shared/schemas/**`, and `src/server/{application,domain,ports,adapters}/**`.
- External unknowns are ports with stub adapters at scaffold time: `EstimateEngine`, `AddressProvider`, `ConfigSource`, `LeadSink`, and `AnalyticsSink`. Concrete adapters are selected by server-side configuration.
- Define one shared Zod schema per request/response/form contract in `src/shared/schemas/**`; client and server import the same schemas, and route handlers re-validate inputs before application use cases run.
- Define a single API envelope for all BFF responses: successful responses carry data plus requestId; errors carry code/message/field errors plus requestId. `src/lib/api-client` is the only client-to-BFF caller and owns envelope parsing, pending/error state, and retry policy.
- Retry only idempotent GETs and retryable 429/5xx failures with exponential backoff. Preserve form state across retries.
- Money values are integer AUD cents in domain and API payloads; formatting to AUD strings happens only at the view edge.
- Theme tokens must cover palette, typography, spacing, shape, elevation, focus, semantic colors, and component treatments. Required token intent includes charcoal header, light-gray canvas, white surfaces, primary blue interactive states, neutral text scale, semantic feedback colors, 8px spacing base, 840px content max, 68px header height, 4px/8px/full radii, and soft shadows with opacity not exceeding 0.15.
- Typography uses the Roboto/Helvetica/Arial stack. Reserve the large `cost-display` role for the eventual estimate figure only.
- Analytics events flow only through `AnalyticsSink`, with typed events for `step_viewed`, `step_completed`, `estimate_generated`, `lead_submitted`, and `drop_off`. Payloads may include identifiers such as requestId/estimateId where appropriate, but no name, email, phone, or full address.

## UX & Interaction Patterns

- Visual posture is calm, trustworthy, and low-pressure: charcoal institutional header, quiet canvas, white task cards, and one blue accent reserved for interactive or selected states.
- Shell microcopy should be plain, honest Australian English. The product presents indicative guidance, not a quote funnel; legal disclaimer language remains visible and consistent.
- Prefer inherited MUI behavior and accessibility defaults, themed through tokens. Use MUI primitives such as AppBar, Paper, Accordion, TextField, Select, Checkbox, Radio, Slider, CircularProgress, Skeleton, Alert, Snackbar, and Dialog as the base component set.
- Toast/Snackbar is for form-level feedback only: bottom-center, severity-colored, white text, slide-up around 300ms, auto-dismiss after roughly 3–5 seconds. Field errors remain inline.
- Input error treatment is a 2px error border plus soft glow and helper text; never communicate validation using color alone.
- Interaction primitives must support click/tap and full keyboard use. Accordion headers are buttons with `aria-expanded`; selection buttons toggle on Enter/Space; dialogs trap focus and return it to the trigger.
- Responsive behavior keeps the same information architecture: desktop centered column, tablet reduced margins, mobile full-width stacked controls and actions.

## Cross-Story Dependencies

- Story 1.1 must land first because the theme, shell, primitives, and analytics seam need the app scaffold, source layout, BFF boundary, schema package, and dependency rules.
- Story 1.2 should precede shell and primitive styling so all UI consumes the same tokens rather than temporary styles.
- Story 1.4 depends on the scaffold and theme, and later epics depend on its `api-client`, feedback states, motion rules, and accessibility primitives.
- Story 1.5 depends on the ports/adapters skeleton and provides a no-op analytics adapter for later journey events.
