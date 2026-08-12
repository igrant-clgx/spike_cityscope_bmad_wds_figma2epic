# Feature Impact Analysis: Spike Reno Calculator

> ⚠️ Derived from `product-brief.md §5`, `EXPERIENCE.md`, and the Figma design — **pending owner confirmation.**
> Scores are strategic estimates from documentation synthesis, not user-tested.

## Scoring

**Primary Persona — Priya ⭐:** High = 5 | Medium = 3 | Low = 1
**Other Personas — Marcus 💼, Coach 🏠:** High = 3 | Medium = 1 | Low = 0

**Max Possible Score:** 11 (Priya 5 + Marcus 3 + Coach 3)
**Must-Have Threshold:** score ≥ 9 **OR** Primary High (Priya = 5)

Per-feature ratings (P = Priya, M = Marcus, C = Coach):

| Feature | P | M | C | Score |
| ------- | - | - | - | ----- |
| Cost estimate + range card + constant disclaimer | H(5) | H(3) | H(3) | 11 |
| Step 1 renovation type (single-select) | H(5) | H(3) | M(1) | 9 |
| Step 2 items (multi-select, derived from Step 1) | H(5) | H(3) | M(1) | 9 |
| Address entry + autocomplete + manual fallback | H(5) | H(3) | L(0) | 8 |
| Accessibility (WCAG 2.1 AA) | H(5) | M(1) | M(1) | 7 |
| Figma-faithful visual fidelity (this run's goal) | H(5) | M(1) | M(1) | 7 |
| Plain, honest, low-pressure voice/microcopy | H(5) | L(0) | M(1) | 6 |
| "How this was calculated" explainer | H(5) | M(1) | L(0) | 6 |
| Step 3 dynamic per-item questions | M(3) | M(1) | M(1) | 5 |
| Contact Section / coach CTA (phone, after value) | M(3) | L(0) | H(3) | 6 |
| Lead form + explicit consent gate | L(1) | L(0) | H(3) | 4 |
| Address change modal + dependent-scope reset | M(3) | H(3) | L(0) | 6 |
| Edit / New Estimate actions | M(3) | H(3) | L(0) | 6 |
| Responsive layouts (tablet/mobile reflow) | M(3) | M(1) | L(0) | 4 |
| Completion indicators / progress affordance | M(3) | M(1) | L(0) | 4 |

---

## Prioritized Features

| Rank | Feature | Score | Decision |
| ---- | ------- | ----- | -------- |
| 1 | Cost estimate + range card + constant disclaimer | 11 | Must Have |
| 2 | Step 1 renovation type (single-select) | 9 | Must Have |
| 3 | Step 2 items (multi-select, derived) | 9 | Must Have |
| 4 | Address entry + autocomplete + manual fallback | 8 | Must Have (Primary High) |
| 5 | Accessibility (WCAG 2.1 AA) | 7 | Must Have (Primary High) |
| 6 | Figma-faithful visual fidelity | 7 | Must Have (Primary High) |
| 7 | Plain, honest, low-pressure voice | 6 | Must Have (Primary High) |
| 8 | "How this was calculated" explainer | 6 | Must Have (Primary High) |
| 9 | Contact Section / coach CTA (phone) | 6 | Consider |
| 10 | Address change modal + scope reset | 6 | Consider |
| 11 | Edit / New Estimate actions | 6 | Consider |
| 12 | Step 3 dynamic per-item questions | 5 | Consider |
| 13 | Lead form + explicit consent gate | 4 | Consider (compliance-gated if lead path chosen) |
| 14 | Responsive layouts (tablet/mobile) | 4 | Consider |
| 15 | Completion indicators / progress | 4 | Consider |

> Note: features 5–8 clear the "Primary High (5)" rule even though their numeric total is 6–7,
> because Priya rates them High — they are experiential must-haves, not nice-to-haves.

---

## Decisions

**Must Have MVP (Primary High OR top-tier score):**
- Cost estimate + range card + disclaimer (11)
- Step 1 renovation type (9)
- Step 2 items (9)
- Address entry + autocomplete + manual fallback (8)
- Accessibility WCAG 2.1 AA (7)
- Figma-faithful visual fidelity (7)
- Plain, honest, low-pressure voice (6)
- "How this was calculated" explainer (6)

**Consider for MVP:**
- Contact Section / coach CTA (6) — required for Objective 2, but path (phone vs form) is OI-10
- Address change modal + scope reset (6) — Marcus-critical; OI-7 keep-vs-reset to confirm
- Edit / New Estimate actions (6)
- Step 3 dynamic questions (5) — question set is OI-2, still `[OPEN]`
- Lead form + consent gate (4) — include if lead-form chosen over phone CTA (OI-10)

**Defer (Nice-to-Have or Low Strategic Value):**
- (none flagged for outright deferral at MVP; responsive + progress indicators are low-score but
  expected baseline — treat as quality bars, not features)

---

## Open Items Affecting Prioritization
- **OI-2** — final Step 3 question set (blocks full Step 3 scoring)
- **OI-7** — address-change keep-vs-reset behavior
- **OI-10** — phone-CTA vs lead-form as authoritative conversion path
- **R3** — cost algorithm definition (underpins the #1 feature's credibility)

---

_Generated with Whiteport Design Studio framework_
_Strategic input for Phase 3: UX Scenarios and downstream development_
