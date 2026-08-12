# Project Brief: spike_cityscope_bmad_wds_figma2epic (Spike Reno Calculator)

> Simplified Brief - Essential context for design work

**Created:** 2026-08-13
**Author:** Igrant (facilitated by Saga, WDS Strategic Business Analyst)
**Brief Type:** Simplified
**Branch:** ig-figma-to-bmad-ux

> ⚠️ **Provenance note:** This simplified brief was *derived from existing authoritative
> artifacts* (the prior BMad `product-brief.md`, `prd.md`, and UX `EXPERIENCE.md` on branch
> `planning/epics-and-stories`) plus the live Figma design, rather than a fresh interview —
> the project owner was unavailable at authoring time. Every claim traces to a cited source.
> **Pending owner confirmation** before it feeds Phase 2 (Trigger Mapping).

---

## Project Scope

A responsive, single-page **web** application — the **Spike Reno Calculator** — that lets an
anonymous Australian homeowner get an indicative renovation cost **range** in under five
minutes, then offers a low-pressure conversation with a Home Loan Coach. *(Source:
`product-brief.md §1,§5`; `EXPERIENCE.md § Foundation`.)*

What users see and interact with (a single scrolling column; desktop is the authoritative surface):

1. **App shell / header** — product + "Demo Channel" branding; persistent.
2. **Address block** — property address entry with debounced autocomplete + manual fallback,
   and an "Enter new address" change modal.
3. **Estimate accordion** — one step open at a time:
   - **Step 1 — Renovation type:** Internal / External (single-select buttons).
   - **Step 2 — What to renovate:** multi-select of items (≥ 1), derived from the Step 1 choice.
   - **Step 3 — More questions:** dynamic per-item questions (radio, text, numeric, date, slider, select, budget min/max).
4. **Results view** — replaces the form on submit: a **cost-range card** (title, scope summary,
   the range figure, indicative disclaimer, "+ More Information" explainer), a **Contact Section**
   ("Talk to a Home Loan Coach" → `Call us: 0800 269 4663` `tel:` CTA), and **Edit Estimate** /
   **New Estimate** actions.
5. **Footer** — legal disclaimer, always present.

*(Source: `EXPERIENCE.md § Information Architecture, § Component Patterns`.)*

**This WDS run's specific scope:** re-establish the **Figma-first UX foundation** for the above,
so design work is driven by the actual Figma pixels — not a re-narrated text spec.

---

## Challenge / Opportunity

**User challenge.** Australian homeowners considering a renovation lack a fast, low-friction way
to understand likely cost before committing. Existing paths (calling contractors, comparing
quotes) are slow, intimidating, and disconnected from financing. *(Source: `product-brief.md §1`.)*

**Business opportunity.** For the sponsoring financial institution ("Demo Channel") there is no
lightweight digital touchpoint that captures high-intent renovation prospects and routes them to
a home-loan coach. A simple guided 3-step calculator produces a credible range in < 5 minutes,
then offers a natural next step — generating qualified financing leads. *(Source: `product-brief.md §1,§4`.)*

**Process challenge (the reason this WDS run exists).** The overarching goal is to **test the
fidelity of the pipeline from Figma → BMad/WDS process → implementation**. The prior spike
exposed a concrete failure mode: **the Figma design was never visually ingested** — the build ran
off re-narrated text handover docs and drifted from the pixels (invented page title, softened
disclaimer, reworded step labels), and verification then compared against the *drifted docs*, not
the design. *(Source: `implementation-artifacts/fidelity-findings.md`.)* The opportunity is to
prove a **Figma-first** WDS flow closes that gap: pixels are the source of truth; prose is
annotation; verification diffs the running app against the design.

---

## Design Goals

**Functional**
- Complete the full estimate flow in **< 5 minutes** for a first-time user. *(G1, `product-brief.md §2`.)*
- Deliver the 3-step progressive-disclosure accordion exactly as the Figma frame shows it:
  address row → "Step 1: Renovation type" / "Step 2: What to renovate" / "Step 3: More questions"
  → results. *(Figma node `9:90`; `EXPERIENCE.md § IA`.)*

**Experience (how it should feel)**
- **Trust before ask** — show a credible range *before* offering the coach conversation;
  no account, no auth, no upfront data grab. *(Source: `EXPERIENCE.md § Foundation`.)*
- **Plain, honest, low-pressure Australian voice** — headings ask real questions; the estimate is
  framed as a humble range ("could cost roughly…"), never "Your quote:"; the disclaimer is honest
  and constant. *(Source: `EXPERIENCE.md § Voice and Tone`.)*
- **Accessible and on-brand** — WCAG 2.1 AA; MUI-based design system. *(G4.)*

**Business**
- Convert **> 15%** of finishers to lead submissions. *(G2.)*
- Provide a **credible, defensible** estimate (within ~75% of real quotes) with a confidence
  signal + disclaimer on every number-bearing surface. *(G3.)*

**Fidelity (this run's differentiator)**
- The built UI must be **visually faithful to the Figma design**, verified by diffing the running
  app against the design screenshots — not against intermediate handover prose.

---

## Constraints

- **Design source of truth:** Figma **"Spike Reno Calculator"** (fileKey `Q0fDj1AKMbwyPJRmPltox0`,
  node `9:90`), accessible live via the Figma MCP. Desktop is fully designed; tablet/mobile reflow
  the same single column. *(Source: `product-brief.md §7`; `EXPERIENCE.md § Foundation`.)*
- **Tech stack:** React 19 / Next.js 16 with **Material UI (MUI v9)**; Roboto/Helvetica/Arial type
  stack. *(Source: `EXPERIENCE.md § Foundation`; `product-brief.md §7`.)*
- **Market / locale:** Australian addresses, **AUD** currency, AU phone formats. *(Source: `product-brief.md §7`.)*
- **Regulatory / privacy:** PII per Australian Privacy Act; explicit marketing consent gate on lead
  capture; 24-month retention; encryption in transit and at rest. *(Source: `product-brief.md §7`; `EXPERIENCE.md`.)*
- **Timeline / method:** demo-oriented spike; phased delivery. Design system mode is currently
  **`none`** in WDS config (no separate component-library build unless enabled).
- **Known open items (carried from the spike, still `[OPEN]`):** final Step 2 item list (OI/R1),
  final Step 3 question set (OI-2/R2), the cost algorithm (R3), and phone-CTA vs lead-form as the
  authoritative conversion path (OI-10). These are **placeholders pending Product sign-off** and
  must not be treated as settled. *(Source: `product-brief.md §8–9`; `EXPERIENCE.md § Component Patterns`.)*

---

## Next Steps

This simplified brief provides essential context for design work. The following phases can now proceed:

- [ ] **Owner confirmation** — validate/adjust this derived brief (it was synthesized from existing artifacts, not a live interview).
- [ ] **Phase 2: Trigger Mapping** (`bmad-wds-trigger-mapping`) — map business goals to user psychology; build personas (Priya the renovating homeowner; Marcus the investor/agent; the Home Loan Coach stakeholder).
- [ ] **Phase 4: UX Design** — sketching and Figma-grounded specifications.
- [ ] **Phase 5: Design System** — only if design_system_mode is enabled (currently `none`).

---

_Generated by Whiteport Design Studio_
