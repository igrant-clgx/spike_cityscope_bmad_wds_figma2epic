# Rubric Review — ARCHITECTURE-SPINE.md

Review target: `_bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md`  
Cross-check target: `_bmad-output/planning-artifacts/prds/prd-spike_cityscope_bmad_wds_figma2epic-2026-08-12/prd.md`  
Review date: 2026-08-12

## Verdict

**PASS-WITH-FINDINGS**

This is a strong lean/spike spine. The paradigm is clear, the seed is appropriately small, and most high-risk divergence points are fixed: BFF boundary, ports/adapters for unknown externals, inward dependencies, shared schemas, form/server state ownership, config-driven dynamic content, monetary representation, API envelope, PII/consent, and UI accessibility/token invariants.

It is not a clean pass because several PRD requirements have no enforceable architectural home, especially performance, testing, browser support, analytics/observability details, and some UX-open behavioral seams that could let different story teams diverge. The operational/environmental envelope is present but too thin for the rubric's “feature altitude owns the dimension” standard.

## Checklist Assessment

### 1. Real divergence points for epics/stories

**Mostly passes.** The spine fixes the main seams likely to split implementation:

- Third-party access is server-only through the BFF (AD-1).
- External unknowns are ported (`EstimateEngine`, `AddressProvider`, `ConfigSource`, `LeadSink`) (AD-2).
- Dependency direction is explicit and load-bearing (AD-3).
- Contracts are shared Zod schemas (AD-4).
- Client form state vs server state ownership is explicit (AD-5/AD-6).
- Config-driven items/questions prevent hardcoded content divergence (AD-8).
- API envelope, requestId, retry, and PII logging rules are centralized (AD-9/AD-10).
- Accessibility/motion/design tokens are centralized (AD-11).

**Gaps:**

- Performance (NFR-3) has no architectural rule: no bundle/rendering/data-fetching boundary, no response-time/timeout ownership beyond partial retry language.
- Testing (NFR-11) has no architectural home: no required test layers, contract tests for ports/adapters, accessibility tests, or E2E ownership.
- Browser support (NFR-12) is deferred to Eng/QA, but no minimum compatibility rule or graceful-degradation invariant exists.
- Observability (NFR-8) is only partially covered by requestId/no PII logs; drop-off/conversion analytics have no architecture rule.
- Several open behavioral UX items (FR-9, FR-31, FR-35/OI-5/7/10) are deferred without a binding contract for stories to avoid inconsistent assumptions.

### 2. AD Rule enforceability and Binds/Prevents/Rule coherence

**Mostly passes.** Most ADs are coherent and enforceable:

- AD-1 coherently prevents browser-side provider/secret/PII leakage.
- AD-2 coherently prevents vendor shape leakage and unknown external blocking.
- AD-3 gives a concrete dependency graph.
- AD-4 gives a concrete schema-location rule.
- AD-5 gives a concrete ownership rule for form/server state.
- AD-6 gives a concrete aggregate and `estimateId` join key.
- AD-7 gives a concrete integer-cents money rule.
- AD-8 gives a concrete “no literals in client/handler code” content rule.
- AD-9 gives a concrete envelope/requestId/retry/logging rule.
- AD-10 gives a concrete consent/PII boundary rule.
- AD-11 gives concrete theme/focus/target/motion requirements.

**Findings:**

- AD-9 binds NFR-7 and NFR-8 but does not enforce NFR-7 rate limits (`address 100/min`, `estimate 50/min`, `lead 20/min`) or 30s timeout, nor NFR-8 analytics events. It enforces only envelope, requestId, retry policy, and no-PII logs.
- AD-11 binds NFR-2 only indirectly. It enforces tokens, focus, target size, accordion ARIA, and motion, but not responsive breakpoints/layout behavior.
- AD-10 claims PII never leaves the server unencrypted and retention follows sink policy, but no at-rest encryption mechanism or sink contract field is specified. For a spike this is acceptable if sink selection remains simple, but it is not fully enforceable as written.

### 3. Deferred items cannot let two units diverge

**Partial pass.** Deferred external provider choices are safely contained:

- Cost algorithm behind `EstimateEngine` is safe.
- Address provider behind `AddressProvider` is safe.
- Config content behind `ConfigSource` is safe.
- Lead sink behind `LeadSink` is safe.
- Persistence choice is mostly safe if estimates are stateless and lead storage remains encapsulated by `LeadSink`.

**Findings:**

- UX-owned open items include progression model, state matrix, address-reset rule, and lead placement. These can absolutely cause story-level divergence unless UX outputs a binding decision before dependent stories are split or unless the spine names an interim architectural default.
- Browser support matrix is deferred with no interim architectural floor. Different units could choose incompatible APIs/polyfills/testing targets.
- Analytics vendor is deferred, but event surface is mentioned only in passing and not fixed. Different units could emit incompatible event names/payloads.
- Persistence choice is deferred; acceptable for spike, but `LeadSink` should still define whether lead submission is idempotent and what success semantics are returned, or story teams may diverge on duplicate-submit handling.

### 4. Named tech verified-current and pinned

**Pass with one exception.** NPM verification on 2026-08-12 returned:

- `next`: 16.3.0 — matches pinned table.
- `react`: 19.2.8 — matches pinned table.
- `@mui/material`: 9.3.1 — matches pinned table.
- `@tanstack/react-query`: 5.101.4 — matches pinned table.
- `react-hook-form`: 7.85.0 — matches pinned table.
- `zod`: 4.4.3 — matches pinned table.
- `typescript`: latest is 7.0.2, but the Stack table says `current (strict)` rather than a pinned version.

**Finding:** TypeScript is not pinned, so the stack table does not fully satisfy the checklist.

### 5. PRD capability coverage and architectural home

#### Feature / FR coverage

| PRD area | Coverage in Capability Map | AD home | Assessment |
| --- | --- | --- | --- |
| 4.1 Shell & Navigation, FR-1..3 | Yes | AD-11 | Covered, though FR-2 footer disclaimer is more UI/content than architectural. |
| 4.2 Address Management, FR-4..9 | Yes | AD-1, AD-2, AD-4, AD-6 | Mostly covered. FR-4/5 UI controls are mapped but not directly bound by ADs; FR-9 reset behavior remains open and could diverge. |
| 4.3 Guided 3-Step Form, FR-10..18 | Yes | AD-4, AD-5, AD-6, AD-8, AD-11 | Covered. Progression model remains UX-open but state/config/schema boundaries are fixed. |
| 4.4 Cost Estimation & Results, FR-19..23 | Yes | AD-2, AD-6, AD-7, AD-9 | Covered for request/port/money/envelope. FR-22 expander UI has no direct AD but likely not architecture-critical. FR-23 safely behind `EstimateEngine`. |
| 4.5 Results Actions, FR-24..25 | Yes | AD-5, AD-6 | Covered for state preservation/reset ownership. |
| 4.6 Lead Capture, FR-26..31 | Yes | AD-1, AD-4, AD-10 | Partially covered. FR-26 CTA and FR-31 placement have no direct AD; FR-31 remains open and can affect story shape. |
| 4.7 Feedback, States & Motion, FR-32..35 | Yes | AD-5, AD-9, AD-11 | Partially covered. Loading/error/motion covered; FR-35 state matrix remains open and can cause divergence. |

#### FRs with weak or no architectural home

- **FR-2** footer disclaimer: mapped to AD-11, but no content/disclaimer placement invariant beyond “renders footer” from PRD. Low severity; likely UI story-owned.
- **FR-4/FR-5** current/change address UI: mapped, but ADs mainly govern provider/BFF/schema/aggregate, not UI placement/control semantics. Low severity.
- **FR-9** address change reset: mapped to AD-6 but the actual clear-vs-persist behavior remains explicitly undecided. Medium severity because it affects flow state and test expectations.
- **FR-22** “How it’s calculated” expander: mapped only through results feature, not governed by an AD. Low severity unless algorithm transparency content becomes regulated/business-critical.
- **FR-26** Coach CTA: included in 4.6 map but not bound by any AD. Low severity; UI/content story can cover it.
- **FR-31** lead capture placement: mapped but no AD binds it; deferred UX decision could change routing/component ownership. Medium severity.
- **FR-35** all screen states defined: mapped to AD-5/AD-9/AD-11 but the state matrix is deferred; no interim required state taxonomy exists. Medium severity.

#### NFR coverage

| NFR | Architectural home | Assessment |
| --- | --- | --- |
| NFR-1 Accessibility | AD-11 | Covered. |
| NFR-2 Responsiveness | Cross-cutting map + AD-11 | Partially covered; breakpoints are in PRD/platform but no enforceable responsive-layout rule in AD-11. |
| NFR-3 Performance | None explicit | **No architectural home.** |
| NFR-4 Tech stack | Stack + AD-11/theme | Covered, except TypeScript not pinned. |
| NFR-5 Security | AD-1 + deployment line | Mostly covered. HTTPS/TLS and CORS are mentioned; API-key auth boundary is clear. |
| NFR-6 Privacy | AD-1, AD-9, AD-10 | Mostly covered; at-rest encryption/retention are not fully enforceable until sink is chosen. |
| NFR-7 Reliability | AD-9 | Partial; retries covered, rate limits and 30s timeout not enforced. |
| NFR-8 Observability | AD-9 | Partial; requestId/no PII logs covered, analytics events not governed. |
| NFR-9 Maintainability | AD-8 | Covered. |
| NFR-10 Localisation | AD-4, AD-7 | Covered. |
| NFR-11 Testing | None explicit | **No architectural home.** |
| NFR-12 Browser support | Deferred | Partial/open; no interim floor. |

**NFRs with no/insufficient home:** NFR-3, NFR-7, NFR-8, NFR-11, NFR-12; NFR-2 is weakly governed.

### 6. Feature-altitude dimensions decided, deferred, or open

**Partial pass.** Major application architecture dimensions are covered:

- Client/BFF/application/domain/ports/adapters layering is decided.
- Contract/schema ownership is decided.
- State ownership is decided.
- External integrations are ported/deferred safely.
- Data formats for money/ids/dates/errors are decided.
- Basic deployment/environment shape is named: one Next.js app, Node-compatible host, `dev/staging/prod`, server env vars, CORS restrictions.

**Finding: operational/environmental envelope is too thin.** The spine has one deployment paragraph, but does not decide/defer/open-question enough of the operational dimension:

- Hosting/provider strategy is left as “e.g. Vercel or a Node container” with no decision or explicit open question.
- Runtime mode is not fully pinned beyond “Node-compatible”; Next.js platform differences may matter for route handlers, secrets, logs, and adapters.
- CI/CD, build/runtime configuration, health checks, monitoring/log sinks, analytics event contract, rate-limit enforcement location, timeout handling, and rollback/deployment promotion are silent.

For a spike, this does not require a full production ops design, but the spine should at least name these as out-of-scope/open or bind the minimal envelope needed for epics/stories.

### 7. Paradigm named and load-bearing; seed minimal

**Pass.** The paradigm is explicitly named: “Ports & Adapters (Hexagonal) domain core, wrapped by a Next.js BFF, consumed by a feature-sliced layered React client.” It is load-bearing because the ADs, namespace map, dependency graph, ports, and deferred external decisions all rely on it.

The structural seed is appropriately minimal for a lean spine: one container diagram, core entities, source tree, and a short deployment/environment paragraph. It avoids over-designing the internal implementation while fixing the interfaces and ownership boundaries that stories need.

## Prioritized Findings

1. **High — NFR architectural coverage gaps.** NFR-3 Performance and NFR-11 Testing have no architectural home; NFR-7 rate limits/timeouts, NFR-8 analytics, NFR-12 browser support, and NFR-2 responsiveness are only partially governed.
2. **Medium — Deferred UX/behavioral items can still cause story divergence.** FR-9 address reset, FR-31 lead placement, FR-35 state matrix, progression model, and analytics event surface are deferred without interim contracts/defaults.
3. **Medium — Operational/environmental envelope is under-specified.** Deployment/environments are named, but provider/runtime strategy, CI/CD, health/monitoring/logging, rate-limit enforcement, timeout handling, analytics, and rollback are silent or implicit.
4. **Low — Stack table is not fully pinned.** NPM versions verify as current for named packages, but TypeScript is listed as `current (strict)` instead of pinned (`7.0.2` verified latest on review date).
5. **Low — Some mapped FRs are not directly governed by ADs.** FR-2, FR-4/5, FR-22, and FR-26 rely on feature/story implementation rather than an architectural rule. This is acceptable for a lean spine unless those items become cross-team divergence points.

## Recommended Minimal Corrections

- Add a small “Operational Envelope” AD or convention covering Node runtime target, timeout/rate-limit enforcement location, health/logging/requestId propagation, analytics event contract ownership, and minimal deployment promotion expectations; or explicitly list these as open questions.
- Add NFR homes in the Capability Map for Performance and Testing, with minimal rules such as route-handler timeout policy, query caching/debounce budget, required unit/contract/E2E/a11y test layers, and browser matrix default.
- Convert UX-deferred items that affect engineering split into explicit open questions with blocking notes for story creation, or name interim defaults.
- Pin TypeScript in the Stack table.
