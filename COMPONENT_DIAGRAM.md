# Spike Reno Calculator - Component Architecture Diagram

## Page Component Hierarchy

```
App
├── MuiContainer (page-wrapper)
│
├── Header Section
│   └── MuiGrid2 (header-grid, spacing)
│       ├── MuiGrid2 (left-column, logo)
│       │   └── Image/Frame (header-logo)
│       │
│       └── MuiGrid2 (right-column, company-logo)
│           └── Image/Frame (company-logo)
│
├── Main Content Section
│   └── MuiBox (content-area)
│       └── MuiGrid2 (content-grid, centered)
│
│           ├── Address Section
│           │   ├── MuiTypography h6 ("400 Catherine Street...")
│           │   └── Button "Enter new address"
│           │
│           ├── Step 1 Section
│           │   └── MuiPaper (step-1-card)
│           │       ├── MuiAccordion
│           │       │   ├── MuiAccordionSummary (header)
│           │       │   │   ├── MuiTypography h6 ("Step 1: Renovation type")
│           │       │   │   └── MuiIcon (ExpandMore) [rotate when expanded]
│           │       │   │
│           │       │   └── MuiCollapse (animated)
│           │       │       └── MuiBox (step-1-content)
│           │       │           ├── MuiTypography h3 ("Is an Internal or External renovation?")
│           │       │           └── ButtonGroup
│           │       │               ├── MuiButtonBase ("Internal")
│           │       │               └── MuiButtonBase ("External")
│           │
│           ├── Step 2 Section
│           │   └── MuiPaper (step-2-card, COLLAPSED)
│           │       └── MuiAccordion
│           │           └── MuiAccordionSummary
│           │               ├── MuiTypography h6 ("Step 2: What to renovate")
│           │               └── MuiIcon (ExpandMore)
│           │
│           └── Step 3 Section
│               └── MuiPaper (step-3-card, COLLAPSED)
│                   └── MuiAccordion
│                       └── MuiAccordionSummary
│                           ├── MuiTypography h6 ("Step 3: More questions")
│                           └── MuiIcon (ExpandMore)
│
└── Footer Section
    └── MuiBox (footer-area, dark-background)
        └── MuiTypography (disclaimer-text)
```

## Result Page Component Hierarchy

```
ResultPage
├── MuiContainer (page-wrapper)
│
├── [Header] (same as above)
│
├── Main Result Section
│   └── MuiBox (result-content)
│       └── MuiGrid2 (centered)
│
│           ├── Address Section
│           │   ├── MuiIcon (CheckCircle or Location icon)
│           │   ├── MuiTypography h6 ("400 Catherine Street Lilyfield NSW 2040")
│           │   └── MuiButton ("Enter new address")
│           │
│           ├── Result Card
│           │   └── MuiBox (result-card)
│           │       ├── MuiTypography h2 ("Estimated Renovation Cost")
│           │       ├── MuiTypography p ("Internal Renovation: Kitchen")
│           │       ├── MuiTypography display-large ("$32,700 - $40,000")
│           │       └── MuiTypography p ("These are estimates to help you plan")
│           │
│           ├── Additional Information Expandable
│           │   └── MuiBox (expandable-section)
│           │       ├── MuiButton ("Additional Information - How this was calculated")
│           │       └── MuiCollapse
│           │           └── MuiBox (calculation-details, hidden)
│           │
│           ├── Action Buttons
│           │   ├── MuiButton ("Edit Estimate", secondary)
│           │   └── MuiButton ("New Estimate", primary)
│           │
│           └── Contact Section
│               └── MuiBox (contact-section)
│                   ├── MuiTypography p ("Talk to a Home Loan Coach...")
│                   ├── MuiIcon (Phone icon)
│                   ├── MuiTypography ("Call us")
│                   └── MuiTypography display ("0800 269 4663")
│
└── [Footer] (same as above)
```

## State Diagram: Accordion Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                   Accordion State Machine                     │
└──────────────────────────────────────────────────────────────┘

              Initial State
                   │
                   ▼
        ┌──────────────────┐
        │   COLLAPSED      │ ← Show only header
        │ (Default style)  │ ← Icon points down (▼)
        │                  │ ← Content hidden (height: 0)
        └────────┬─────────┘
                 │ User clicks header
                 ▼
        ┌──────────────────┐
        │   EXPANDING      │ ← Animated height change
        │ (Transition)     │ ← Icon rotates (▼→▲)
        └────────┬─────────┘
                 │ Animation complete
                 ▼
        ┌──────────────────┐
        │   EXPANDED       │ ← Show full content
        │ (Active style)   │ ← Icon points up (▲)
        │                  │ ← Content visible (height: auto)
        └────────┬─────────┘
                 │ User clicks header again
                 ▼
        ┌──────────────────┐
        │   COLLAPSING     │ ← Animated height change
        │ (Transition)     │ ← Icon rotates (▲→▼)
        └────────┬─────────┘
                 │ Animation complete
                 ▼
        ┌──────────────────┐
        │   COLLAPSED      │ ← Back to initial state
        └──────────────────┘

Additional States:
- DISABLED: Accordion can't be clicked (opacity reduced, cursor: not-allowed)
- COMPLETED: Accordion marked with checkmark or success color
- LOADING: Spinner shown while fetching options for Step 2/3
```

## Button State Diagram: Selection Buttons

```
┌──────────────────────────────────────────────────────────────┐
│                   Button State Diagram                        │
└──────────────────────────────────────────────────────────────┘

Example: "Internal" / "External" choice buttons in Step 1

Button States:
┌─────────────────────────────────────────────┐
│ UNSELECTED (Default)                        │
├─────────────────────────────────────────────┤
│ Border:     Gray outline                    │
│ Background: Transparent                     │
│ Text Color: Gray/Dark gray                  │
│ Cursor:     pointer                         │
└─────────────────────────────────────────────┘
         ↓ (user hovers)
┌─────────────────────────────────────────────┐
│ HOVER (Unselected)                          │
├─────────────────────────────────────────────┤
│ Border:     Gray (darker)                   │
│ Background: Light gray/white                │
│ Text Color: Dark gray                       │
│ Cursor:     pointer                         │
│ Opacity:    100%                            │
└─────────────────────────────────────────────┘
         ↓ (user clicks)
┌─────────────────────────────────────────────┐
│ SELECTED (Active)                           │
├─────────────────────────────────────────────┤
│ Border:     Blue or primary color           │
│ Background: Light blue/primary color        │
│ Text Color: Dark text or primary color      │
│ Font Weight: Bold                           │
│ Cursor:     default                         │
│ Shadow:     Subtle shadow (optional)        │
└─────────────────────────────────────────────┘
         ↓ (button receives focus)
┌─────────────────────────────────────────────┐
│ SELECTED + FOCUSED (Keyboard nav)           │
├─────────────────────────────────────────────┤
│ [All SELECTED properties above]             │
│ + Focus ring: 2-3px blue outline            │
│ + Outline-offset: 2px                       │
└─────────────────────────────────────────────┘

Disabled State (if form validation not met):
┌─────────────────────────────────────────────┐
│ DISABLED                                    │
├─────────────────────────────────────────────┤
│ Border:     Gray (lighter)                  │
│ Background: Light gray                      │
│ Text Color: Gray (lighter)                  │
│ Cursor:     not-allowed                     │
│ Opacity:    0.6                             │
│ Pointer-events: none                        │
└─────────────────────────────────────────────┘
```

## Form Validation Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   Form Validation Flow                        │
└──────────────────────────────────────────────────────────────┘

User Input → Validation Check → Conditional Rendering
                  │
                  ├─ Required Field Empty?
                  │  └─ YES: Show error + disable next step
                  │  └─ NO: Continue
                  │
                  ├─ Invalid Address Format?
                  │  └─ YES: Show error + highlight field
                  │  └─ NO: Continue
                  │
                  ├─ No Selection Made?
                  │  └─ YES: Disable form submission
                  │  └─ NO: Enable next step
                  │
                  └─ All Valid?
                     └─ YES: Enable Step 2
                     └─ NO: Show validation summary

Step 1 Validation:
  - Address field: Required, valid AUS format
  - Renovation type: Required, one of [Internal, External]

Step 2 Validation:
  - Renovation items: Required, at least one selected
  - Items vary by Step 1 choice (conditional)

Step 3 Validation:
  - Varies by question type (TBD from design)

Form Submission:
  - Send: {address, renovationType, items[], questions[]}
  - Receive: {costMin, costMax, breakdown?, confidence?}
  - Display: Results page
```

## Responsive Breakpoints

```
┌──────────────────────────────────────────────────────────────┐
│              Responsive Layout Grid                           │
└──────────────────────────────────────────────────────────────┘

Desktop (lg breakpoint: 1280px+)
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────────────────────────────┐│
│ │  [Logo]                         [Company Logo]          ││
│ └──────────────────────────────────────────────────────────┘│
│ │                                                          ││
│ │   [    Margin 336px    ] [ Content 840px ] [ 336px ]   ││
│ │   Address Display                                        ││
│ │   ┌──────────────────────────────────────────────────┐  ││
│ │   │ Step 1: Renovation type              [expand]    │  ││
│ │   │ Question + Buttons                               │  ││
│ │   └──────────────────────────────────────────────────┘  ││
│ │                                                          ││
│ │   ┌──────────────────────────────────────────────────┐  ││
│ │   │ Step 2: What to renovate             [expand]    │  ││
│ │   └──────────────────────────────────────────────────┘  ││
│ │                                                          ││
│ │   Footer (full-width)                                   ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

Tablet (md breakpoint: 960px)
┌──────────────────────────────────────────────────────────┐
│ [Logo]                         [Company Logo]            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [ 32-48px margin ]  [ ~864-896px ]  [ 32-48px margin ] │
│                                                          │
│  Address Display                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Step 1: Renovation type                 [expand]  │  │
│  │ Question + Buttons (may stack)                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Footer (full-width, smaller text)                      │
└──────────────────────────────────────────────────────────┘

Mobile (sm breakpoint: 600px)
┌───────────────────────────────────┐
│ [Logo]                            │
├───────────────────────────────────┤
│ [Company Logo]                    │
├───────────────────────────────────┤
│                                   │
│ [16-24px margin] [Content] [16px] │
│                                   │
│ Address Display                   │
│ ┌──────────────────────────────┐  │
│ │ Step 1              [expand] │  │
│ │ Question                     │  │
│ │ [Internal]                   │  │
│ │ [External]                   │  │
│ └──────────────────────────────┘  │
│                                   │
│ Footer (full-width, tiny text)    │
└───────────────────────────────────┘

Key Changes:
- Desktop: 3 column (margin-content-margin)
- Tablet: 2 column (margin-content-margin, narrower margins)
- Mobile: 1 column (full-width minus min margins)
- Buttons: Side-by-side on desktop/tablet, stack on mobile
- Typography: Scale down from 16px → 14px on mobile
- Accordions: Full-width, may be harder to use on mobile
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Data Flow                               │
└──────────────────────────────────────────────────────────────┘

                    User Inputs
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Address          Step 1-3           State
    (string)         (selections)       (formData)
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │  Form Validation   │
              │  (client-side)     │
              └────────┬───────────┘
                       │
                       ▼ (if valid)
              ┌────────────────────┐
              │  API Request       │
              │  POST /calculate   │
              │  {address, type,   │
              │   items, questions}│
              └────────┬───────────┘
                       │
                       ▼ (waiting...)
              ┌────────────────────┐
              │  Cost Database     │
              │  Lookup            │
              │  (backend)         │
              └────────┬───────────┘
                       │
                       ▼ (if found)
              ┌────────────────────┐
              │  API Response      │
              │  {costMin,         │
              │   costMax,         │
              │   breakdown}       │
              └────────┬───────────┘
                       │
                       ▼
              ┌────────────────────┐
              │  Result Page       │
              │  Display Result    │
              │  Show CTA Buttons  │
              └────────────────────┘
```

