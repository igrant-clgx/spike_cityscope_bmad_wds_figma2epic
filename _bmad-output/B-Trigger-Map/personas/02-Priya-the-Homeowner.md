# Priya the Renovating Homeowner — Primary Persona

> PRIMARY target — the reason the flow exists and the source of every lead

**Priority:** PRIMARY ⭐
**Role in Flywheel:** Completes an estimate, trusts the number, and — on her own terms — becomes a qualified lead
**Created:** 2026-08-13

> ⚠️ Derived from `product-brief.md §3`, `prd.md`, and `EXPERIENCE.md` — **pending validation with real users.**

---

## Profile Summary

**Priya is an Australian homeowner in the messy, exciting, slightly overwhelming early days of planning a renovation.** She's not ready to call three contractors and sit through sales visits — she just wants a believable sense of what the work might cost so she can decide whether it's even feasible. She has basic-to-moderate digital confidence: she'll happily tap through a clean form on her laptop or phone, but she'll bounce the moment something feels like a data-harvesting trap.

She matters more than anyone else in this product: if Priya doesn't get to a credible number quickly and without friction, there is no lead for Demo Channel, no conversion, and no reason for the calculator to exist. Everything designs to her.

---

## Current Situation

**The Daily Struggle:**
- Has renovation ideas but no realistic cost anchor
- The "obvious" paths (contractor calls, quote comparisons) feel slow and intimidating
- Doesn't know if her budget is remotely in the right ballpark
- Wary of handing over her phone/email just to get a number

**Skills & Tools:**
- Comfortable with everyday web forms and autocomplete
- Uses her phone as much as her laptop
- Not a spreadsheet-modeller; wants the tool to do the thinking

**The Gap:**
- She needs a fast, trustworthy, *obligation-free* cost range — and a gentle, optional path to help with financing if she wants it.

---

## Psychological Profile

**Core Identity:**
- Practical and cautious with money
- Values honesty and plain language over polish and hype
- Wants to feel in control of when and how she's contacted

**Decision Style:**
- Explores quietly before committing
- Trusts tools that are transparent about their limits
- Rewards low effort and instant clarity

---

## Driving Forces

### ✅ Top 3 Positive Drivers (What She Wants)

**1. A credible cost range, fast, with almost no effort**
- She wants a believable ballpark in a few clicks, not a 20-field form.
- Success looks like: a clear range on screen in under five minutes.
- **Product Promise:** 3-step progressive-disclosure accordion; estimate in < 5 min (G1); range shown centrally with a confidence signal.

**2. To stay anonymous and in control until she decides to engage**
- She wants to explore without surrendering contact details upfront.
- Success looks like: reaching a full estimate with no account and no personal data.
- **Product Promise:** "Trust before ask" — no auth, no persistence; contact + consent requested only *after* the number, at the coach offer. (`EXPERIENCE.md § Foundation`.)

**3. To feel guided and reassured, not sold to**
- She wants a calm, plain-spoken flow that explains itself.
- Success looks like: headings that ask real questions; humble framing of the estimate.
- **Product Promise:** Plain honest AU voice; "could cost roughly…" not "Your quote:"; constant disclaimer. (`EXPERIENCE.md § Voice and Tone`.)

### ❌ Top 3 Negative Drivers (What She Fears)

**1. Being trapped into a sales funnel / spammed**
- The dread that "free estimate" means "now we have your number forever."
- Failure looks like: a CTA wall or a required email before any value.
- **Product Answer:** The coach CTA is an *offer after value*, never a gate; explicit opt-in consent, no dark patterns.

**2. That the number is made-up or misleading**
- If it feels arbitrary, she won't trust it — or the brand.
- Failure looks like: a single suspicious figure with no context.
- **Product Answer:** A *range* (not a false-precise number) + "how this was calculated" explainer + disclaimer on every number-bearing surface (G3).

**3. A long, confusing, or demanding form**
- Too many questions and she abandons.
- Failure looks like: everything on screen at once, unclear progress.
- **Product Answer:** One accordion step open at a time; completed steps collapse to a summary; only required inputs gate the estimate. (`EXPERIENCE.md § Component Patterns`.)

---

## The Transformation Journey

### BEFORE Spike Reno Calculator
**Emotional State:** 😰 uncertain · 😔 intimidated by the process · 🤷‍♀️ no cost anchor · 😤 wary of sales pressure
**Daily Reality:** ideas but no budget reality; avoids contractor calls; stuck at "is this even possible?"
**Self-Perception:** a hesitant planner who can't get a straight answer without strings attached

### AFTER Spike Reno Calculator
**Emotional State:** 🎯 clear on the ballpark · 🚀 confident to take a next step · 💪 in control of contact · ⭐ respected, not pressured
**Daily Reality:** has a credible range in minutes; understands roughly what drives the cost; chooses if/when to talk to a coach
**Self-Perception:** an informed homeowner making a considered decision on her own terms

---

## Role in Strategic Triangle

```
PRIYA (Primary) — Renovating Homeowner
completes an estimate, trusts the number
      │
      │ opts in (on her terms) → becomes a qualified lead
      ▼
HOME LOAN COACH (Tertiary) — Demo Channel
receives high-intent, well-contextualised lead
      │
      │ helpful financing conversation → renovation becomes feasible
      └──────────────► back to PRIYA (loop closes: she proceeds, and recommends the tool)
```

**Priya's Role:**
- Is the origin of every lead and the truest test of "trust before ask"
- Her completion (Objective 1) and opt-in (Objective 2) drive the business case
- If the design earns her trust, Marcus (efficiency) and the Coach (lead quality) are satisfied downstream

---

## Impact on Business Goals
- **Objective 1 (< 5 min clarity):** her completion time *is* the metric.
- **Objective 2 (> 15% leads):** her voluntary opt-in is the conversion.
- **Objective 3 (defensible estimate):** her trust depends on range + disclaimer.
- **Objective 4 (accessible & Figma-faithful):** her experience must match the design and pass AA.

---

## Success Metrics
Priya succeeds (and becomes a lead) when she:
1. ✅ Enters her address and starts without friction
2. ✅ Completes all three steps in under five minutes
3. ✅ Sees a credible range she believes
4. ✅ Feels no pressure — the coach offer reads as help, not a trap
5. ✅ Chooses to opt in for a coach conversation

---

## Related Documents
- **[trigger-map.md](../trigger-map.md)** — visual overview
- **[03-Marcus-the-Investor.md](03-Marcus-the-Investor.md)** — secondary persona
- **[04-Coach-the-Stakeholder.md](04-Coach-the-Stakeholder.md)** — tertiary persona

_Back to [Trigger Map](../trigger-map.md)_
