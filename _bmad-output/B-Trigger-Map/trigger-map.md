# Trigger Map Poster: Spike Reno Calculator

> Visual overview connecting business goals to user psychology

**Created:** 2026-08-13
**Author:** Igrant (facilitated by Saga, WDS Strategic Analyst)
**Methodology:** Based on Effect Mapping (Balic & Domingues), adapted for WDS (negative driving forces)
**Branch:** ig-figma-to-bmad-ux

> ⚠️ **Provenance note:** Derived via **documentation synthesis** from existing authoritative
> artifacts (`product-brief.md`, `prd.md`, UX `EXPERIENCE.md`) plus the live Figma (node `9:90`).
> Owner unavailable at authoring — every element is source-cited and **pending owner confirmation
> and user validation** before it drives Phase 3.

---

## Strategic Documents

- **personas/** — full persona detail files (Priya, Marcus, the Home Loan Coach)
- **feature-impact-analysis.md** — prioritized features with impact scores

---

## Vision

Give Australian homeowners a fast, low-friction, trustworthy way to understand what a renovation
could cost — in under five minutes, with no account and no obligation — and turn that moment of
clarity into a genuinely helpful conversation about financing. For **Demo Channel**, become the
lightweight digital touchpoint that captures high-intent renovation prospects and routes them to a
Home Loan Coach. *(Source: `product-brief.md §1,§4`; `EXPERIENCE.md § Foundation`.)*

---

## Business Objectives

### Objective 1: Fast, credible cost clarity
- **Metric:** Time to complete the estimate flow
- **Target:** < 5 minutes average (G1)
- **Timeline:** MVP

### Objective 2: Qualified home-loan leads
- **Metric:** Lead conversion rate (finishers → lead submissions)
- **Target:** > 15% of finishers (G2)
- **Timeline:** MVP + measurement window

### Objective 3: Defensible estimate
- **Metric:** Estimate accuracy vs real quotes; confidence + disclaimer present on every number
- **Target:** within ~75% of actual quotes (G3)
- **Timeline:** MVP (algorithm is `[OPEN]` R3)

### Objective 4: Accessible, on-brand, Figma-faithful experience
- **Metric:** WCAG 2.1 AA conformance; visual diff of running app vs Figma design
- **Target:** AA pass; no unexplained pixel drift from node `9:90` (G4 + this run's fidelity goal)
- **Timeline:** MVP

*(Sources: `product-brief.md §2,§6`; `fidelity-findings.md`.)*

---

## Target Groups (Prioritized)

### 1. Priya — the Renovating Homeowner  ⭐ PRIMARY
**Priority Reasoning:** She is the flow's reason to exist and the source of every lead. If the
experience doesn't earn her trust fast, no business objective is met. *(product-brief.md §3.)*

> Owns/occupies an Australian home, planning a specific renovation, basic-to-moderate digital
> literacy, wants a ballpark cost fast without handing over personal details upfront.

**Key Positive Drivers:**
- Get a credible cost range fast, with almost no effort
- Stay anonymous and in control until *she* decides to engage
- Feel guided and reassured, not sold to

**Key Negative Drivers:**
- Fear of being trapped into a sales funnel / spammed
- Fear the number is made-up or misleading
- Fear the form is long, confusing, or demands too much

### 2. Marcus — the Property Investor / Agent  💼 SECONDARY
**Priority Reasoning:** Higher-frequency power user who values speed and re-running estimates
across properties; validates that the flow works for repeat, address-swapping use. *(product-brief.md §3.)*

> Evaluates renovation potential across multiple properties; wants speed and easy address change.

**Key Positive Drivers:**
- Re-run estimates quickly across many addresses
- Change the property address without losing his place
- Trust the range enough to use it in decisions

**Key Negative Drivers:**
- Fear of slow, repetitive re-entry
- Fear that changing address silently corrupts prior answers
- Fear of an estimate too vague to act on

### 3. The Home Loan Coach / Demo Channel  🏠 TERTIARY (stakeholder)
**Priority Reasoning:** Consumes the leads; the design must hand over enough context (estimate,
scope, contact + explicit consent) to convert. *(product-brief.md §3.)*

> Needs qualified, well-contextualised leads with consent to follow up effectively.

**Key Positive Drivers:**
- Receive high-intent leads with scope + budget context
- Have explicit marketing consent captured cleanly
- Reach the homeowner at the right moment (right after the estimate)

**Key Negative Drivers:**
- Fear of low-quality / low-intent leads
- Fear of consent/privacy non-compliance (AU Privacy Act)
- Fear of missing context (no scope → cold, ineffective calls)

---

## Trigger Map Visualization

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontFamily':'Inter, system-ui, sans-serif', 'fontSize':'14px'}}}%%
flowchart LR
    BG0["<br/>⏱️ Fast cost clarity<br/><br/>< 5 min flow<br/>"]
    BG1["<br/>💬 Qualified leads<br/><br/>> 15% conversion<br/>"]
    BG2["<br/>📊 Defensible estimate<br/><br/>~75% accuracy + disclaimer<br/>"]
    BG3["<br/>♿ Accessible & Figma-faithful<br/><br/>WCAG AA · pixel-true<br/>"]

    PLATFORM["<br/>🏠 Spike Reno Calculator<br/><br/>Trust before ask<br/><br/>Anonymous 3-step estimate → helpful coach offer<br/>"]

    TG0["<br/>⭐ Priya<br/>PRIMARY<br/><br/>Renovating homeowner<br/>"]
    TG1["<br/>💼 Marcus<br/>SECONDARY<br/><br/>Investor / agent<br/>"]
    TG2["<br/>🏠 Coach / Demo Channel<br/>TERTIARY<br/><br/>Lead consumer<br/>"]

    DF0["<br/>⭐ PRIYA'S DRIVERS<br/><br/>WANTS<br/>✅ Fast credible range<br/>✅ Stay anonymous & in control<br/>✅ Guided, not sold to<br/><br/>FEARS<br/>❌ Sales-funnel trap / spam<br/>❌ Made-up number<br/>❌ Long confusing form<br/>"]
    DF1["<br/>💼 MARCUS'S DRIVERS<br/><br/>WANTS<br/>✅ Fast re-runs<br/>✅ Easy address change<br/>✅ Actionable range<br/><br/>FEARS<br/>❌ Repetitive re-entry<br/>❌ Address change corrupts answers<br/>❌ Too-vague estimate<br/>"]
    DF2["<br/>🏠 COACH'S DRIVERS<br/><br/>WANTS<br/>✅ High-intent leads + context<br/>✅ Clean explicit consent<br/>✅ Right-moment reach<br/><br/>FEARS<br/>❌ Low-quality leads<br/>❌ Consent/privacy breach<br/>❌ Missing scope context<br/>"]

    BG0 --> PLATFORM
    BG1 --> PLATFORM
    BG2 --> PLATFORM
    BG3 --> PLATFORM
    PLATFORM --> TG0
    PLATFORM --> TG1
    PLATFORM --> TG2
    TG0 --> DF0
    TG1 --> DF1
    TG2 --> DF2

    classDef businessGoal fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px
    classDef platform fill:#e5e7eb,color:#111827,stroke:#9ca3af,stroke-width:3px
    classDef targetGroup fill:#f9fafb,color:#1f2937,stroke:#d1d5db,stroke-width:2px
    classDef drivingForces fill:#f3f4f6,color:#1f2937,stroke:#d1d5db,stroke-width:2px

    class BG0,BG1,BG2,BG3 businessGoal
    class PLATFORM platform
    class TG0,TG1,TG2 targetGroup
    class DF0,DF1,DF2 drivingForces
```

---

## Design Focus Statement

Design first for **Priya**: earn trust *before* asking for anything. Every screen must make the
estimate feel fast, credible, and low-pressure — the coach offer appears only after she sees a
number. The Figma design is the source of truth for how this looks; the running app must match it.

**Primary Design Target:** Priya — the Renovating Homeowner

**Must Address:**
- Show a credible range fast, with minimal input, no account (Priya wants; Coach needs the completion)
- Keep her anonymous and in control until she chooses to engage (Priya's core fear: the funnel trap)
- Frame every number with a humble range + constant disclaimer (Priya's "made-up number" fear; G3)
- Explicit, clean consent gate on lead capture (Coach's compliance need; AU Privacy Act)

**Should Address:**
- Fast re-runs and safe address change that resets dependent answers predictably (Marcus)
- Hand the Coach enough scope/budget context on each lead (Coach)
- Plain, honest, low-pressure Australian voice throughout (all groups; `EXPERIENCE.md § Voice`)

---

## Cross-Group Patterns

### Shared Drivers
- **Trust in the number** — Priya, Marcus, and the Coach all depend on the estimate feeling
  credible (range + confidence + disclaimer). This is the product's central promise.
- **Speed** — Priya and Marcus both reward a fast, low-friction flow.

### Unique Drivers
- **Priya:** anonymity and low-pressure guidance (unique emotional need).
- **Marcus:** address-swapping and repeat-use efficiency.
- **Coach:** lead context + explicit consent capture.

### Potential Tensions
- **"Trust before ask" vs "> 15% lead conversion."** Pushing the coach CTA too hard would raise
  short-term conversion but violate Priya's core fear and erode trust. Resolution: the CTA is an
  *offer after value*, never a gate. *(Source: `EXPERIENCE.md § Voice and Tone`.)*
- **Anonymity vs lead context.** The Coach wants rich context; Priya resists upfront data. Resolution:
  capture scope implicitly from the estimate; ask for contact + consent only at the offer moment.

---

## Next Steps

- [ ] **Owner confirmation + user validation** — validate these personas/drivers with real target-group members (currently synthesized from docs, not primary research).
- [ ] **Use feature-impact-analysis.md** to prioritise MVP scope.
- [ ] **Guide UX Design (Phase 3+)** — ensure Figma-grounded designs address Priya's must-address drivers.
- [ ] Resolve carried `[OPEN]` items (Step 2 list, Step 3 questions, cost algorithm, phone-CTA vs lead-form).

---

_Generated with Whiteport Design Studio framework_
_Trigger Mapping methodology credits: Effect Mapping by Mijo Balic & Ingrid Domingues (inUse), adapted with negative driving forces_
