# Addendum — Spike Reno Calculator PRD

*Downstream depth that belongs in architecture / solution design / UX spec rather than the PRD itself. The PRD stays capability-focused (what/why); the technical-how is indexed here and lives in full in the WDS handover docs. Nothing in this addendum is authoritative over the PRD — it is a pointer map plus options-considered rationale for the architect.*

**Owner:** Igrant · **Date:** 2026-08-12 · **Companion to:** `prd.md`

---

## 1. Where the technical-how lives (index for the architect)

| Concern | Detail source | PRD refs |
|---------|---------------|----------|
| Design tokens — colors (hex), typography, spacing, shadows, radius | `HANDOVER_01_DESIGN_SYSTEM.md` | NFR-4, FR-1/3 |
| Component specs — all states, props, a11y per component | `HANDOVER_02_COMPONENT_SPECS.md` | FR-10/12/14, NFR-1 |
| Page/screen layouts — desktop/tablet/mobile, measurements | `HANDOVER_03_PAGE_SPECS.md` | FR-1/3/20, NFR-2 |
| Motion — timing bands, easing (`cubic-bezier(0.4,0,0.2,1)`), reduced-motion | `HANDOVER_04_ANIMATIONS.md` | FR-34 |
| API contracts — endpoint shapes, payloads, error codes, rate limits, PII/security | `HANDOVER_05_DATA_API.md` | FR-6/7/19/27, NFR-5/6/7 |
| Cost algorithm pseudocode (illustrative) | `HANDOVER_05_DATA_API.md` §Calculation Logic | FR-23 (OI-3) |
| Implementation checklist / phasing / test strategy | `HANDOVER_06_IMPLEMENTATION_CHECKLIST.md` | Delivery Phasing |
| Upstream analysis & component hierarchy | `FIGMA_ANALYSIS.md`, `ANALYSIS_SUMMARY.md`, `COMPONENT_DIAGRAM.md` | throughout |

## 2. Mechanism / transport decisions deferred to architecture

- **Address provider** — Google Places vs Australia Post API. Trade-off: coverage/cost/AU-address quality. Decide at architecture (OI-6). Contract in `HANDOVER_05`.
- **Config delivery** — Renovation Items and Step 3 questions served from config APIs (`/config/*`) so content changes need no redeploy (NFR-9). Caching/TTL strategy is an architecture decision.
- **Estimate service** — the cost algorithm, pricing data source, and confidence model are undefined (OI-3, CRITICAL). Options to weigh: static rules table vs data-backed regional pricing vs third-party estimate feed. Must produce reproducible outputs meeting SM-4.
- **Lead pipeline** — MVP writes to the lead API only; CRM (Salesforce/HubSpot), email confirmation, and IVR are deferred (OI-11). Architecture should leave a seam for the downstream connector.

## 3. Options considered (rationale preserved)

- **Progression model (OI-8):** auto-advance on selection vs explicit "Continue". Auto-advance is faster (supports SM-3 <5 min) but riskier for accidental progression and a11y; explicit Continue is more predictable. Deferred to UX.
- **Lead capture placement (OI-10):** inline-on-Results (lowest friction, supports SM-2) vs modal (focus, but interrupts) vs separate view (clear consent moment). Deferred to UX + Product.
- **Address change reset (OI-7):** clear prior answers (correctness — scope may not apply to a new property) vs preserve (speed for Marcus's UJ-2 comparison). Deferred to UX + Product.

## 4. Non-functional detail beyond PRD summary

Rate limits (address 100/min, estimate 50/min, lead 20/min), 30s timeouts, TLS 1.2+, API-key auth, CORS allow-list, requestId propagation, phone masking in logs, 24-month PII retention — all specified in `HANDOVER_05_DATA_API.md` and summarized in PRD NFR-5/6/7/8. The architect should treat `HANDOVER_05` as the contract baseline, pending the OI-6 lock.
