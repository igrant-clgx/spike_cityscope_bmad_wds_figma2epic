# Figma Design Analysis: Spike Reno Calculator

## Overview
The "Spike Reno Calculator" is a multi-step renovation cost estimation tool for homeowners. The design shows a progressive disclosure interface using Material-UI (MUI) components. The project contains at least three main views: search/listing view, detailed calculator view, and results view.

---

## 1. EXPERIENCE REQUIREMENTS

### User Capabilities Assumed
- **Basic digital literacy**: Users can navigate web forms and interact with accordion-style interfaces
- **Location knowledge**: Users know their property address (though can update it)
- **Renovation awareness**: Users understand the difference between internal and external renovations
- **Decision-making readiness**: Users can make specific choices about renovation scope and type

### Knowledge Levels
- **Domain knowledge**: Users are assumed to have some understanding of renovation types (kitchen, bathroom, etc.) but not necessarily detailed pricing knowledge
- **Technical knowledge**: Minimal - the interface is deliberately simplified with progressive steps
- **Financial literacy**: Users are expected to understand cost ranges and financing concepts (implied by "talk to home loan coach" CTA)

### User Journey States
1. **Exploration**: User searches for properties or enters a new address
2. **Assessment**: User specifies renovation type (internal/external) and scope
3. **Detailed Planning**: User answers additional questions about the renovation
4. **Results Review**: User sees estimated cost, can edit or start a new estimate
5. **Action**: User contacts home loan coach or proceeds with financing

### Target Users
- **Primary**: Homeowners planning renovations who need cost estimates
- **Secondary**: Real estate agents, property investors evaluating renovation potential
- **Facilitators**: Demo Channel (mortgage/financial institution) customers

---

## 2. STYLES & DESIGN PATTERNS

### Visual Language
- **Modernism**: Clean, minimalist Material Design aesthetic
- **Trust/Authority**: Professional dark header with company branding signals credibility
- **Progressive Disclosure**: Multi-step accordion pattern reveals information only when needed
- **Hierarchy**: Clear visual distinction between header, main content, and footer disclaimer

### Typography
- **Headers (h6)**: Step labels ("Step 1: Renovation type") - appears to be ~14-16px, sans-serif
- **Questions (h3)**: "Is an Internal or External renovation?" - larger, ~18-20px, sans-serif
- **Body Text (p)**: Disclaimer and descriptive text - ~14px, sans-serif
- **Labels**: Button text and form labels - ~14px, sans-serif
- **Data (large heading)**: Estimated cost display - ~58px or larger, high contrast

### Color Scheme
- **Primary Background**: Light gray/off-white (#F5F5F5 or similar)
- **Header**: Dark brown/charcoal (#2C2C2C or similar)
- **Paper/Cards**: White (#FFFFFF)
- **Text**: Dark gray/charcoal for primary text, lighter gray for secondary/disabled text
- **Accent/CTA**: Blue link text ("Enter new address")
- **Buttons**: Outlined border style (appears to be gray border with transparent fill initially)

### Spacing & Layout
- **Grid System**: MUI Grid2 layout with 12-column responsive grid
- **Padding**: ~16-24px internal padding in cards and sections
- **Margins**: ~24-32px between major sections
- **Button Spacing**: ~8-16px gap between adjacent buttons

### Design Patterns Observed
1. **Accordion Pattern**: Step-by-step sections with collapsible/expandable states
   - Header with label and expand/collapse icon
   - Content revealed on expansion
   - Only one section expanded at a time (typical pattern)

2. **Button Pair Pattern**: Related actions grouped horizontally ("Internal" / "External")
   - Equal sizing
   - Outlined style for secondary selections
   - Selected state likely differs from unselected

3. **Address Component Pattern**: 
   - Current value display
   - Action button to modify ("Enter new address")
   - Positioned above main form

4. **Progressive Steps Pattern**:
   - Numbered steps ("Step 1", "Step 2", "Step 3")
   - Linear progression implied by numbering
   - Each step builds on previous selections

5. **Cost Display Pattern**:
   - Large, prominent typography for the estimated cost
   - Supporting text for renovation type specification
   - Disclaimer/supporting copy below
   - Action buttons (Edit / New Estimate) positioned below

6. **CTA Section Pattern**:
   - "Talk to Home Loan Coach" - relationship building
   - Contact information (phone number)
   - Icon indicators for contact method (call icon)

---

## 3. COMPONENTS

### Header Components
| Component | Type | Purpose | Notes |
|-----------|------|---------|-------|
| Header Bar | Container | Page header with branding | Dark background, full-width |
| Logo (left) | Image/Typography | Product branding | "header-logo" ID, ~125px wide |
| Company Logo (right) | Image | Partner/credibility branding | "company-logo" ID, ~128px wide |

### Form Input Components
| Component | Type | Purpose | Notes |
|-----------|------|---------|-------|
| Address Display | Typography + Button | Current property address | Uses h6 style, "400 Catherine Street Lilyfield NSW 2040" |
| "Enter new address" Button | Button | Change property location | Link-style button (underlined text) |
| Renovation Type Buttons | Button Group | Binary choice selection | "Internal" / "External" pair |
| Question Heading | Typography | Form question text | h3 style for prominence |

### Accordion/Disclosure Components
| Component | Type | Purpose | Notes |
|-----------|------|---------|-------|
| MuiAccordion | Container | Step section wrapper | Contains summary and content |
| MuiAccordionSummary | Header | Step label and expand icon | Clickable to toggle state |
| Expand/Collapse Icon | Icon | Visual toggle indicator | 21x21px frame |
| MuiCollapse | Animated Container | Content reveal/hide | "MuiCollapse-wrapper" |

### Content Containers
| Component | Type | Purpose | Notes |
|-----------|------|---------|-------|
| MuiPaper | Container | Card/section styling | Elevated, white background with shadow |
| MuiBox | Container | Layout/spacing wrapper | Non-visual layout helper |
| MuiGrid2 | Layout System | Responsive grid layout | Replaces legacy Grid system |
| MuiContainer | Container | Centered content max-width | Constrains content to readable width |

### Result View Components
| Component | Type | Purpose | Notes |
|-----------|------|---------|-------|
| Result Card | Container | Cost estimate display | Centered white card with result |
| Cost Display (large) | Typography | Primary result "$32,700 - $40,000" | ~58px or larger |
| Cost Label | Typography | "Estimated Renovation Cost" | Smaller heading above cost |
| Renovation Type Display | Typography | "Internal Renovation: Kitchen" | Contextual info below heading |
| Disclaimer Text | Typography | "These are estimates to help you plan" | Smaller, secondary text |
| Action Button Pair | Button Group | "Edit Estimate" / "New Estimate" | Primary and secondary actions |
| Expandable Section | Container | "Additional Information - How this was calculated" | Additional details disclosure |
| Contact Section | Container | "Talk to a Home Loan Coach..." | CTA with phone number and contact info |

### Footer Components
| Component | Type | Purpose | Notes |
|-----------|------|---------|-------|
| Disclaimer Section | Typography + Container | Legal disclaimer | Dark background, smaller text, full-width |

### Material-UI Dependencies
The design shows heavy Material-UI (MUI) v5+ usage:
- `MuiGrid2` (modern grid system)
- `MuiAccordion` (collapsible sections)
- `MuiAccordionSummary` (accordion headers)
- `MuiCollapse` (animated disclosure)
- `MuiPaper` (card/surface)
- `MuiBox` (layout container)
- `MuiContainer` (max-width wrapper)
- `MuiTypography` (text styling - h6, h3, p)
- `MuiButtonBase` (button foundation)

### Component Hierarchy (Step 1 Example)
```
MuiPaper
  ├─ MuiAccordionSummary-header
  │  ├─ Title: "Step 1: Renovation type"
  │  └─ ExpandIcon
  └─ MuiCollapse
     └─ MuiBox
        ├─ Question: "Is an Internal or External renovation?"
        └─ Button Group
           ├─ Button "Internal"
           └─ Button "External"
```

---

## 4. UI REQUIREMENTS

### Form Flow and Logic

#### Step 1: Renovation Type Selection
- **Trigger**: Initial page load or after address selection
- **Question**: "Is an Internal or External renovation?"
- **Options**: Binary choice (Internal / External)
- **Validation**: Required - user must select one
- **Next Step**: Conditional routing based on selection
- **State Persistence**: Selected option should be highlighted/styled differently

#### Step 2: Renovation Items/Scope
- **Trigger**: After Step 1 selection
- **Question**: "What to renovate?" (implied from step label)
- **Options**: Likely multi-select (kitchen, bathroom, etc.) - content not fully visible in current design
- **Validation**: At least one item must be selected
- **Next Step**: Step 3 questions
- **Notes**: Currently shown as collapsed/disabled state

#### Step 3: Additional Details
- **Trigger**: After Step 2 selections
- **Question**: "More questions" (implied)
- **Content**: Unknown from current design - likely detailed questions about renovation specifics
- **Validation**: Depends on question types
- **Next Step**: Cost calculation/results display

### State Management Requirements

#### Accordion States
1. **Expanded**: Content visible, icon rotated/changed
2. **Collapsed**: Content hidden, icon in default orientation
3. **Disabled**: Grayed out, not clickable (until previous step completed)
4. **Active/Current**: Visual indicator of current step in progress
5. **Completed**: Visual indicator of finished step (checkmark or similar)

#### Button States (for selection buttons)
1. **Default/Unselected**: Outlined border, transparent fill
2. **Hover**: Subtle background change or border color change
3. **Selected/Active**: Filled background or border color change, clear visual distinction
4. **Disabled**: Grayed out, not clickable

#### Form States
- **Initial**: All steps visible, Step 1 expanded
- **In Progress**: Current step expanded, previous steps collapsed but marked complete
- **Complete**: Show results, enable "Edit" to return to form, "New Estimate" to restart

### Input Validation

#### Address Input
- **Type**: Text input or autocomplete
- **Validation**: 
  - Required field
  - Format: Australian address format expected
  - Validation: Likely postcode/suburb matching
- **Error Handling**: Error message displayed if invalid

#### Renovation Type Selection
- **Validation**: Required - cannot proceed without selection
- **Conditional Logic**: Internal vs External affects available options in Step 2

#### Renovation Items
- **Validation**: At least one item required
- **Conditional Options**: Available items depend on Step 1 choice (internal/external)

#### Additional Questions
- **Validation**: Depends on question type (text, numeric, multiple choice)
- **Range Validation**: Cost estimates likely based on ranges of values

### Navigation Patterns

#### Accordion Navigation
- **Primary**: Click accordion header to expand/collapse
- **Keyboard**: Tab through accordions, Enter/Space to toggle
- **State Persistence**: Expanded state should persist during form interaction

#### Forward Navigation
- **Automatic**: After Step 1 selection, Step 2 automatically becomes available
- **No Back Button Visible**: Design doesn't show explicit "Back" button
- **Edit Flow**: "Edit Estimate" button likely returns user to form at the relevant step

#### Form Submission
- **No visible submit button** on input steps - progression appears to be automatic/implicit
- **Results page** shows the result and provides edit/new estimate options
- **Call to Action**: Contact button for home loan coach

### Responsive Behavior

#### Desktop (1512px - shown in design)
- Centered three-column layout (336px margins, 840px content, 336px margins)
- Full header and footer at full width
- All elements visible without scrolling (except possibly long form content)

#### Tablet/Mobile (not shown but implied)
- Likely single-column layout
- Margins reduced or eliminated
- Header/footer may become sticky
- Buttons may stack vertically instead of horizontally
- Typography may scale down slightly

#### Breakpoints (typical MUI)
- `xs`: 0px
- `sm`: 600px
- `md`: 960px (likely breakpoint for 3-column to narrower layout)
- `lg`: 1280px
- `xl`: 1920px

---

## 5. BUSINESS CONTEXT

### Product Purpose
The **Spike Reno Calculator** is a customer acquisition and engagement tool for a financial institution (Demo Channel) to:
1. Help homeowners estimate renovation costs
2. Demonstrate their expertise in property finance
3. Capture customer contact information for lead generation
4. Position themselves as a trusted advisor ("Home Loan Coach")
5. Facilitate funding conversations for renovation projects

### Target User Profile

#### Primary: Homeowner Planning a Renovation
- **Demographic**: Likely 30-55 years old, homeowner, middle to upper-middle income
- **Tech Savviness**: Comfortable with web tools, but prefers simplicity
- **Goals**: Get realistic cost estimate, explore financing options, reduce renovation uncertainty
- **Pain Points**: 
  - Unsure of realistic renovation costs
  - Worried about budget overruns
  - Don't know how to finance renovation
  - Need independent expert opinion

#### Secondary: Real Estate Professional
- **Goal**: Quick valuation tool for property assessment
- **Need**: Fast, professional-looking results to share with clients
- **Frequency**: Multiple estimates per day

#### Influencer: Mortgage/Financial Institution
- **Goal**: Generate qualified leads for home renovation financing
- **Advantage**: Position as expert, build customer relationship early
- **Revenue Model**: Home loans / construction financing products

### Problem Being Solved
1. **Information Asymmetry**: Homeowners lack reliable cost data for renovations
2. **Decision Paralysis**: Too many variables, unclear budget
3. **Trust Gap**: How to find trustworthy financing for renovation
4. **Accessibility**: Need simple, online tool (not consultations with contractors)

### Value Proposition
- **For Users**: Free, quick cost estimation without sales pressure
- **For Institution**: Lead generation, customer data, brand positioning
- **For Market**: Standardized reference point for renovation costs (helps market confidence)

### Business Model Indicators
- **Data Collection**: Address information + renovation preferences = targeted marketing leads
- **Lead Quality**: Progressive questions indicate qualification of leads
- **Conversion Path**: From estimate → contact home loan coach → financing product
- **Affiliate/Partner**: "Demo Channel" suggests this may be white-labeled or partnership

### Competitive Positioning
- **vs. Contractors**: Neutral, independent estimates without sales pressure
- **vs. Other Lenders**: Integrated calculator showing they understand customer needs
- **vs. DIY Costs**: More realistic/professional than generic online estimates

---

## 6. POTENTIAL GAPS AND ASSUMPTIONS

### Design Gaps

#### 1. **Unclear Step Completion Flow**
- **Gap**: No visible indication of completed steps
- **Assumption**: Design assumes accordion position indicates progress
- **Issue**: Users may not understand if they can revisit previous steps
- **Recommendation**: Add checkmark/badge to completed steps or "edit" affordance

#### 2. **Step 2 & 3 Content Unknown**
- **Gap**: "What to renovate" and "More questions" accordions are collapsed
- **Assumption**: Collapsible accordions follow same pattern as Step 1
- **Issue**: Can't validate completeness of form
- **Recommendation**: Show at least one expanded step or provide wireframes for all steps

#### 3. **Missing Error States**
- **Gap**: No error messages shown in design
- **Assumption**: All inputs are valid/can't fail
- **Issue**: Users won't know how to fix invalid entries
- **Recommendation**: Include error state mockups for invalid address, incomplete selections

#### 4. **Unclear Cost Calculation Logic**
- **Gap**: No explanation of how specific estimates are calculated
- **Assumption**: "Additional Information" expands to show calculation breakdown
- **Issue**: Users won't know if estimate is based on their inputs
- **Recommendation**: Show calculation formula or detailed breakdown clearly

#### 5. **Address Change Workflow**
- **Gap**: "Enter new address" button shown but flow is unclear
- **Assumption**: Opens a modal or new step to enter address
- **Issue**: Unclear if previous inputs are preserved or lost
- **Recommendation**: Define whether entering new address resets form or just updates the address

#### 6. **Mobile Responsiveness**
- **Gap**: Only desktop version shown
- **Assumption**: Single-column layout on mobile, buttons may stack
- **Issue**: Touch target sizes may be too small, accordions may be hard to use
- **Recommendation**: Provide mobile wireframes, ensure 44-48px minimum touch targets

#### 7. **No Loading/Processing State**
- **Gap**: No indication of what happens after form is complete
- **Assumption**: Instant calculation, or brief loading state
- **Issue**: Users may click multiple times, not knowing if processing
- **Recommendation**: Show loading spinner or skeleton screen

#### 8. **Accessibility Concerns**
- **Gap**: No mention of ARIA labels, keyboard navigation
- **Assumption**: Standard MUI components provide accessibility
- **Issue**: Screen reader users may struggle with accordion pattern
- **Recommendation**: Verify ARIA attributes, ensure proper heading hierarchy

### Behavioral Assumptions

#### 1. **Linear Progression**
- **Assumption**: Users complete steps sequentially (1 → 2 → 3)
- **Reality**: Some users may want to jump around or revisit earlier decisions
- **Issue**: Design doesn't support non-linear navigation
- **Recommendation**: Allow accordion headers to be clickable even if not current step

#### 2. **Single Selection in Step 1**
- **Assumption**: Only "Internal" OR "External" can be selected
- **Reality**: Some renovations might include both
- **Issue**: Users may be frustrated if they can't represent complex renovations
- **Recommendation**: Consider allowing both selections or "Both" option

#### 3. **Address Autocomplete**
- **Assumption**: Users can easily enter/find their address
- **Reality**: Users may struggle with address format or autocomplete results
- **Issue**: May cause form abandonment if address entry is difficult
- **Recommendation**: Use address autocomplete API, validate with postcode

#### 4. **Cost Estimate Accuracy**
- **Assumption**: Users trust cost estimates as representative
- **Reality**: Actual renovation costs vary widely by location and contractor
- **Issue**: Users may be disappointed if their quotes significantly differ
- **Recommendation**: Add confidence/variance indicators, link to contractor network

#### 5. **Lead Quality**
- **Assumption**: Contact information is genuine and leads to conversions
- **Reality**: Many users may enter fake info or not follow up
- **Issue**: Lead quality metrics needed
- **Recommendation**: Track which users actually contact home loan coach, measure conversion rate

### Incomplete Design Areas

#### 1. **Step 2: Renovation Items Selection**
- Currently just a collapsed header
- Need to see: available options, selection mechanism (radio/checkbox), visual grouping

#### 2. **Step 3: Additional Questions**
- Completely undefined
- Need to see: question types, number of questions, conditional logic

#### 3. **Result Details View**
- Only brief cost range shown
- Missing: detailed breakdown, comparison to market, financing options

#### 4. **Contact/Lead Capture**
- Shows "Call us" CTA
- Missing: form submission, email capture, appointment booking

#### 5. **Footer/Legal**
- Only disclaimer text visible
- Missing: links (Privacy, Terms), contact info, social media

### Data/Integration Assumptions

#### 1. **Cost Estimate Database**
- **Assumption**: Estimates are based on lookup table keyed by (location, renovation-type, scope)
- **Needs**: Database of renovation cost data, regularly updated

#### 2. **Address Geocoding**
- **Assumption**: Address translates to geographic zone for cost lookup
- **Needs**: Integration with address API (Google, AusMaps, etc.)

#### 3. **Lead Management System**
- **Assumption**: Submitted contact info integrates with CRM
- **Needs**: Integration with email/marketing automation, CRM system

#### 4. **Analytics Tracking**
- **Assumption**: Form completion rates, step abandonment tracked
- **Needs**: Analytics implementation for conversion funnel

### Technical Debt/Future Considerations

1. **Performance**: Heavy use of MUI components and large asset images may impact load time
2. **A/B Testing**: No indication of variant designs or testing strategy
3. **Internationalization**: Design shows AUD currency and Australian addresses only
4. **Accessibility**: No WCAG compliance indicators
5. **SEO**: How does this generate organic traffic vs. paid acquisition?

---

## Summary Table: Key Takeaways

| Aspect | Finding |
|--------|---------|
| **Core UX Pattern** | Progressive disclosure via accordion steps |
| **Primary CTA** | Contact home loan coach for financing |
| **Form Complexity** | 3 steps, estimated 5-10 inputs total |
| **Target Outcome** | Lead generation for mortgage/renovation financing |
| **Technology Stack** | Material-UI v5+ components, React likely |
| **Mobile Ready?** | Unclear - only desktop version shown |
| **Accessibility** | Likely needs review for WCAG 2.1 compliance |
| **Biggest Risk** | Cost estimate accuracy and user trust |
| **Key Success Metric** | % of users who contact home loan coach after estimate |

