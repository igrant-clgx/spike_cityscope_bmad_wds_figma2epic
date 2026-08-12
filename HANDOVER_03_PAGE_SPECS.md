# Spike Reno Calculator - Page & Screen Specifications

**Document Version**: 1.0  
**Date**: August 12, 2026  
**Status**: Ready for Development  
**Breakpoints**: Desktop (1512px+), Tablet (768-1024px), Mobile (320-767px)

---

## Table of Contents

1. [Page Layout Overview](#page-layout-overview)
2. [Form Page - Desktop](#form-page---desktop)
3. [Form Page - Tablet](#form-page---tablet)
4. [Form Page - Mobile](#form-page---mobile)
5. [Results Page](#results-page)
6. [Navigation Flows](#navigation-flows)

---

## Page Layout Overview

### All Pages Share

#### Header (Height: 68px)
```
┌─────────────────────────────────────────────────────────────────────┐
│ [Homeowner Icon/Logo]                [Financial Institution Logo]  │
└─────────────────────────────────────────────────────────────────────┘
```

**Background**: `#2C2C2C` (dark charcoal)  
**Logo Area**: Left-aligned spike/home icon, Right-aligned company logo  
**Logo Size**: Max 48px height each  
**Padding**: 10px vertical, 24px horizontal (desktop)

#### Main Content Area
```
Responsive container with left/right margins
Maximum width: 840px (centered)
Padding: 24px top/bottom, 48px left/right (desktop)
Padding: 24px top/bottom, 32px left/right (tablet)
Padding: 16px top/bottom, 16px left/right (mobile)
```

#### Footer (Height: auto)
```
┌──────────────────────────────────────────────────────────────────┐
│ Disclaimer text (left-aligned)                                   │
│                                                                  │
│ "The Renovation Calculator Report is available to customers     │
│  who provide their contact details..."                           │
└──────────────────────────────────────────────────────────────────┘
```

**Background**: `#2C2C2C` (matches header)  
**Text**: `#FFFFFF` (white)  
**Font Size**: 12px (caption)  
**Padding**: 24px  
**Max Width**: Full width

---

## Form Page - Desktop

### Layout Wireframe (1512px)
```
╔═══════════════════════════════════════════════════════════════════╗
║                         HEADER (68px)                             ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║                    [Address Display Section]                      ║
║                    400 Catherine St, Lilyfield NSW 2040          ║
║                    [Enter new address]                            ║
║                                                                   ║
║                 ▼ Step 1: Renovation Type (Expanded)             ║
║                 ┌─────────────────────────────────────────────┐  ║
║                 │ Is an Internal or External renovation?      │  ║
║                 │                                             │  ║
║                 │  [Internal]        [External]              │  ║
║                 │  (unselected)      (selected - blue)       │  ║
║                 └─────────────────────────────────────────────┘  ║
║                                                                   ║
║                 ▼ Step 2: What to Renovate (Collapsed)           ║
║                 ┌─────────────────────────────────────────────┐  ║
║                 │ ▼ Step 2: What to Renovate                 │  ║
║                 └─────────────────────────────────────────────┘  ║
║                                                                   ║
║                 ▼ Step 3: More Questions (Collapsed)             ║
║                 ┌─────────────────────────────────────────────┐  ║
║                 │ ▼ Step 3: More Questions                   │  ║
║                 └─────────────────────────────────────────────┘  ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                         FOOTER (auto)                             ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Address Display Section

**Location**: Top of form page, above Step 1  
**Spacing**: 32px margin-bottom

**Structure**:
```jsx
<Box>
  <Typography variant="body1" sx={{ color: '#666666', marginBottom: 1 }}>
    Your address:
  </Typography>
  
  <Typography variant="body1" sx={{ fontWeight: 600, marginBottom: 2 }}>
    400 Catherine Street Lilyfield NSW 2040
  </Typography>
  
  <Link
    href="#"
    underline="hover"
    onClick={handleEnterNewAddress}
  >
    Enter new address
  </Link>
</Box>
```

**Styles**:
```css
Padding:                16px
Background Color:       #F5F5F5
Border:                 1px solid #E0E0E0
Border Radius:          4px
Margin Bottom:          32px
```

**Address Text**:
```css
Font Size:              14px
Font Weight:            400
Color:                  #333333
Line Height:            1.5
```

**"Enter new address" Link**:
```css
Font Size:              14px
Color:                  #0066CC
Text Decoration:        underline
Cursor:                 pointer
```

### Form Step Structure

Each step follows the Accordion pattern:

#### Step 1: Renovation Type

**Header**:
```
Step 1: Renovation Type (with down arrow when collapsed)
```

**Content** (when expanded):
```
Question:    "Is an Internal or External renovation?"
Type:        Binary choice (2 buttons)
Required:    Yes
```

**Buttons Layout** (side-by-side on desktop):
```
[Internal Button] (16px gap) [External Button]
Both: 50% width - (8px gap / 2)
```

**Button States**:
- Unselected: Light gray background, dark text
- Selected: Blue background (#0066CC), white text

---

#### Step 2: What to Renovate (CONTENT TO BE DEFINED)

**Current Status**: Content unknown from design - Developer must get from Product

**Assumed Structure**:
```
Question:    "What would you like to renovate?"
Type:        Multiple selection (checkboxes)
Required:    At least 1 item
Conditional: Options depend on Step 1 selection
             - If Internal: Kitchen, Bathroom, Flooring, Walls, etc.
             - If External: Roof, Windows, Doors, Landscaping, etc.

Options (example): 
☐ Kitchen
☐ Bathroom
☐ Flooring
☐ Walls/Painting
☐ Windows
☐ Other (text input)
```

**Layout**:
```
Grid layout: 2 columns on desktop
Vertical stack on tablet/mobile
Checkboxes with labels, 16px vertical gap
```

---

#### Step 3: More Questions (CONTENT TO BE DEFINED)

**Current Status**: Content unknown from design - Developer must get from Product

**Assumed Structure**:
```
Question(s):  Multiple questions about the renovation
Types:        Mix of:
              - Multiple choice (radio buttons)
              - Text input
              - Numeric input
              - Dropdown select

Example Questions:
1. Property type?
   ○ House/Townhouse
   ○ Apartment/Unit
   ○ Other

2. Current condition of {area}?
   [Slider 1-5] or [Dropdown: Poor/Fair/Good/Excellent]

3. When are you planning to start?
   [Date picker] or [Dropdown: This month/3 months/6+ months]

4. Budget estimate?
   $ [Number input: min 5000, max 500000]
```

**Layout**:
```
Question text at top of section
Form inputs below
Full width on all breakpoints (vertically stacked)
```

---

### Form Page - Complete Layout (Desktop)

```
HEADER
│
├─ Address Display Section
│  400 Catherine Street Lilyfield NSW 2040
│  [Enter new address]
│
├─ STEP 1: RENOVATION TYPE
│  ┌────────────────────────────────────────────┐
│  │ Question: Is an Internal or External       │
│  │           renovation?                       │
│  │                                             │
│  │ [Internal Button]     [External Button]     │
│  │ (unselected gray)     (selected blue)       │
│  └────────────────────────────────────────────┘
│
├─ STEP 2: WHAT TO RENOVATE  [collapsed]
│  ┌────────────────────────────────────────────┐
│  │ ▼ Step 2: What to Renovate                │
│  └────────────────────────────────────────────┘
│
├─ STEP 3: MORE QUESTIONS  [collapsed]
│  ┌────────────────────────────────────────────┐
│  │ ▼ Step 3: More Questions                  │
│  └────────────────────────────────────────────┘
│
└─ [Get Estimate Button] (full width, centered, max 300px)
```

**Spacing**:
- Address → Step 1: 32px
- Step 1 → Step 2: 16px
- Step 2 → Step 3: 16px
- Step 3 → Button: 24px
- Button → Footer: 32px

---

## Form Page - Tablet

### Layout Wireframe (768px - 1024px)

```
╔═════════════════════════════════════╗
║         HEADER (68px)               ║
╠═════════════════════════════════════╣
║                                     ║
║  [Address Display Section]          ║
║  400 Catherine St, NSW 2040        ║
║  [Enter new address]               ║
║                                     ║
║ ▼ Step 1: Renovation Type          ║
║ ┌──────────────────────────────────┐║
║ │ Is an Internal or External       ║║
║ │ renovation?                       ║║
║ │                                   ║║
║ │ [Internal]  [External]            ║║
║ │ (stacked if needed)               ║║
║ └──────────────────────────────────┘║
║                                     ║
║ ▼ Step 2: What to Renovate         ║
║ ┌──────────────────────────────────┐║
║ │ ▼ Step 2: What to Renovate       ║║
║ └──────────────────────────────────┘║
║                                     ║
║ ▼ Step 3: More Questions           ║
║ ┌──────────────────────────────────┐║
║ │ ▼ Step 3: More Questions         ║║
║ └──────────────────────────────────┘║
║                                     ║
║  [Get Estimate Button]              ║
║                                     ║
╠═════════════════════════════════════╣
║         FOOTER (auto)               ║
╚═════════════════════════════════════╝
```

### Changes from Desktop

**Container**:
- Max width: 90% (or ~720px)
- Horizontal padding: 32px total (left + right)

**Buttons**:
- If two buttons side-by-side cause wrapping, stack vertically
- Full width buttons with 12px gap

**Typography**:
- Slightly reduced font sizes for readability
- Same hierarchy maintained

**Form Fields**:
- Full width single column
- Checkbox/radio options in single column

---

## Form Page - Mobile

### Layout Wireframe (320px - 767px)

```
╔═══════════════════════╗
║   HEADER (68px)       ║
╠═══════════════════════╣
║                       ║
║ [Address Display]     ║
║ 400 Catherine St      ║
║ [Enter new address]   ║
║                       ║
║ Step 1: Type [▼]      ║
║ ┌─────────────────────┐
║ │ Is an Internal or   ║
║ │ External            ║
║ │ renovation?         ║
║ │                     ║
║ │ [Internal]          ║
║ │ [External]          ║
║ └─────────────────────┘
║                       ║
║ Step 2: What [▼]      ║
║ ┌─────────────────────┐
║ │ ▼ Step 2            ║
║ └─────────────────────┘
║                       ║
║ Step 3: Details [▼]   ║
║ ┌─────────────────────┐
║ │ ▼ Step 3            ║
║ └─────────────────────┘
║                       ║
║ [Get Estimate]        ║
║                       ║
╠═══════════════════════╣
║   FOOTER (auto)       ║
╚═══════════════════════╝
```

### Mobile-Specific Changes

**Container**:
- Full width with 16px horizontal padding
- No max-width constraint

**Header**:
- Logos may stack or reduce size (max 40px height)
- Padding: 12px horizontal, 10px vertical

**Typography**:
- Heading font sizes reduced by ~2-4px
- Line height maintained for readability

**Buttons**:
- Always full width (100% - 32px padding)
- Min height: 44px (touch target)
- Button group stacked vertically
- Gap between buttons: 12px

**Form Fields**:
- Full width single column always
- Checkbox/radio items wrap to fit content
- No multi-column layouts

**Accordions**:
- Full width
- Header padding: 16px (reduced from 24px)
- Content padding: 16px (reduced from 24px)
- Font sizes adjusted for readability

**Address Section**:
- Simpler layout
- Text may truncate or wrap
- Provide copy-to-clipboard button option

**Spacing Adjustments**:
- Section margins: 16px (down from 24-32px)
- Button margins: 16px top (down from 24px)

---

## Results Page

### Desktop Layout

```
╔═════════════════════════════════════════════════════════════════════╗
║                        HEADER (68px)                                ║
╠═════════════════════════════════════════════════════════════════════╣
║                                                                     ║
║                   ┌─────────────────────────────┐                  ║
║                   │ Estimated Renovation Cost   │                  ║
║                   │                             │                  ║
║                   │  Internal Renovation:       │                  ║
║                   │  Kitchen + Flooring         │                  ║
║                   │                             │                  ║
║                   │    $32,700 - $40,000       │                  ║
║                   │                             │                  ║
║                   │ These are estimates to help │                  ║
║                   │ you plan your project.      │                  ║
║                   │                             │                  ║
║                   │ [+ More Information]        │                  ║
║                   └─────────────────────────────┘                  ║
║                                                                     ║
║            [Edit Estimate]  [New Estimate]                         ║
║                                                                     ║
║         ┌──────────────────────────────────────────┐               ║
║         │                                          │               ║
║         │  Talk to a Home Loan Coach               │               ║
║         │                                          │               ║
║         │  We can help you get the funding you     │               ║
║         │  need for your renovation project.      │               ║
║         │                                          │               ║
║         │  [Call Icon] Call us: 0800 269 4663     │               ║
║         │             [PHONE CTA BUTTON]          │               ║
║         │                                          │               ║
║         └──────────────────────────────────────────┘               ║
║                                                                     ║
╠═════════════════════════════════════════════════════════════════════╣
║                        FOOTER (auto)                                ║
╚═════════════════════════════════════════════════════════════════════╝
```

### Result Card Details

**Container**:
```css
Max Width:              600px
Background:             #FFFFFF
Border:                 1px solid #E0E0E0
Border Radius:          8px
Padding:                32px
Box Shadow:             0px 4px 8px rgba(0, 0, 0, 0.10)
Margin:                 48px auto (centered)
```

**Title**:
```
Typography: h4
Text:        "Estimated Renovation Cost"
Margin:      0 0 24px 0
```

**Renovation Type & Items**:
```
Typography: body1
Text:        "{Type} Renovation: {Item1}, {Item2}"
Color:       #666666
Margin:      0 0 24px 0
Font Size:   14px
```

**Cost Display**:
```
Typography: custom (56px, bold)
Text:        "$32,700 - $40,000"
Color:       #333333
Margin:      24px 0
Text Align:  center
```

**Disclaimer**:
```
Typography: caption
Text:        "These are estimates to help you plan"
             "your project. Actual costs may vary."
Color:       #999999
Font Size:   12px
Margin:      16px 0 24px 0
Text Align:  center
```

**More Information (Expandable)**:
```
Typography: body1
Link text:   "+ More Information" or "- Hide Information"
Color:       #0066CC (link style)
Font Weight: 500
Margin Top:  16px
Cursor:      pointer

When expanded:
┌─────────────────────────────────────────┐
│ How is this cost calculated?            │
│                                         │
│ Our calculator uses market data from    │
│ recent renovations in your area to      │
│ provide an estimate. The final cost     │
│ depends on many factors including:      │
│ - Scope of work                         │
│ - Material choices                      │
│ - Labor market conditions               │
│                                         │
│ These are rough estimates to help you   │
│ plan, not a binding quote.              │
└─────────────────────────────────────────┘
```

### Action Buttons (Below Card)

**Layout**:
```
Display:                flex
Justify Content:        center
Gap:                    16px
Margin Top:             32px
```

**Edit Estimate Button**:
```
Type:                   Secondary (outlined)
Text:                   "Edit Estimate"
Action:                 Return to form page, keep form state
```

**New Estimate Button**:
```
Type:                   Primary (contained)
Text:                   "New Estimate"
Action:                 Reset form, return to Step 1 with empty state
```

### Contact Section

**Container**:
```css
Max Width:              600px
Background:             #F5F5F5 (light gray)
Border:                 1px solid #E0E0E0
Border Radius:          8px
Padding:                32px
Margin:                 32px auto (centered, below buttons)
```

**Title**:
```
Typography: h5
Text:        "Talk to a Home Loan Coach"
Color:       #333333
Margin:      0 0 16px 0
```

**Description**:
```
Typography: body1
Text:        "We can help you get the funding you need
             for your renovation project."
Color:       #666666
Margin:      0 0 24px 0
```

**Contact Button**:
```
Type:                   Primary with icon
Icon:                   Phone icon (left of text)
Text:                   "Call us: 0800 269 4663"
Action:                 Open phone dialer (tel: link) or modal
Button Styling:         Full width, centered text
```

**Phone Number Link**:
```html
<a href="tel:+61800269466">Call us: 0800 269 4663</a>
```

---

## Results Page - Tablet

### Layout Wireframe (768px - 1024px)

```
╔═────────────────────────────────────────╗
║          HEADER (68px)                  ║
╠────────────────────────────────────────╣
║                                        ║
║    ┌──────────────────────────────┐   ║
║    │ Est. Renovation Cost         │   ║
║    │                              │   ║
║    │ Internal: Kitchen, Flooring  │   ║
║    │                              │   ║
║    │    $32,700 - $40,000        │   ║
║    │                              │   ║
║    │ [More Information]           │   ║
║    └──────────────────────────────┘   ║
║                                        ║
║   [Edit] [New Estimate]               ║
║                                        ║
║    ┌──────────────────────────────┐   ║
║    │ Talk to Home Loan Coach      │   ║
║    │                              │   ║
║    │ [Call us: 0800 269 4663]     │   ║
║    └──────────────────────────────┘   ║
║                                        ║
╠────────────────────────────────────────╣
║          FOOTER (auto)                 ║
╚════════════════════════════════════════╝
```

### Changes from Desktop
- Max width of card: 90% or 520px
- Button gap: 12px (down from 16px)
- Padding: 24px (down from 32px)
- Font sizes slightly reduced

---

## Results Page - Mobile

### Layout Wireframe (320px - 767px)

```
╔──────────────────────┐
║   HEADER (68px)      ║
╠──────────────────────╣
║                      ║
║ ┌────────────────────┐
║ │ Est. Cost          ║
║ │                    ║
║ │ Internal:          ║
║ │ Kitchen, Flooring  ║
║ │                    ║
║ │ $32,700 -          ║
║ │ $40,000            ║
║ │                    ║
║ │ [More Info]        ║
║ └────────────────────┘
║                      ║
║ [Edit Estimate]      ║
║ [New Estimate]       ║
║                      ║
║ ┌────────────────────┐
║ │ Talk to Coach      ║
║ │                    ║
║ │ [Call us:          ║
║ │  0800 269 4663]    ║
║ └────────────────────┘
║                      ║
╠──────────────────────╣
║    FOOTER (auto)     ║
╚──────────────────────┘
```

### Mobile-Specific Changes
- Padding: 16px
- Cards full width with 16px horizontal padding
- All buttons full width, stacked vertically
- Button gap: 12px
- Cost display: 48px font (down from 56px)
- Remove "More Information" link if space critical (show as expandable)

---

## Navigation Flows

### Primary Flow

```
┌─────────────┐
│ Address     │  (Auto-populated or user-entered)
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Step 1: Type Choice │  (Internal/External)
│ [Submit Form]       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Step 2: Items       │  (Kitchen, Bathroom, etc.)
│ [Submit Form]       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Step 3: Questions   │  (Property type, size, budget)
│ [Get Estimate]      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Results Page        │  (Cost estimate displayed)
│ [Edit/New/Call]     │
└─────────────────────┘
```

### Edit Estimate Flow
```
Results Page
│
└─ [Edit Estimate] button
   │
   ▼
Form Page (Step 1)
- Form state preserved
- All selections remain visible
- User can modify any field
│
└─ [Get Estimate] button
   │
   ▼
Results Page (updated with new estimate)
```

### New Estimate Flow
```
Results Page
│
└─ [New Estimate] button
   │
   ▼
Form Page (Step 1) - RESET STATE
- All fields cleared
- Address field empty
- No selections active
│
└─ User fills form again
   │
   ▼
Results Page (new estimate)
```

### Enter New Address Flow
```
Form Page
│
└─ [Enter new address] link
   │
   ▼
Address Entry Modal/Inline
- Address input field (with autocomplete)
- [Confirm] button
│
├─ On confirm:
│  ▼
│ Reload form page with new address
│ Keep Step 1-3 selections intact (if desired) or reset
│
└─ On cancel:
   ▼
   Return to form page, keep current state
```

---

## Interaction Triggers

### Form Page Interactions

| Element | Trigger | Action |
|---------|---------|--------|
| [Enter new address] link | Click | Open address modal or redirect to address entry page |
| [Internal/External] buttons | Click | Toggle selection, update form state |
| Step 2 checkbox | Click | Toggle item selection |
| Step 3 form fields | Change | Update form state |
| [Get Estimate] button | Click | Submit form → Calculate → Results page |
| Accordion header | Click | Expand/collapse section |

### Results Page Interactions

| Element | Trigger | Action |
|---------|---------|--------|
| [Edit Estimate] button | Click | Navigate to form page, restore previous form state |
| [New Estimate] button | Click | Navigate to form page with cleared state |
| [More Information] link | Click | Toggle expandable section showing calculation info |
| [Call us] button | Click | Open tel: link or show contact modal |

---

## Error & Empty States

### Form Validation Errors

**When user tries to submit with missing fields**:
```
1. Display inline error message under invalid field
2. Highlight input border in red (#DC3545)
3. Show error icon (⚠️) next to field
4. Focus on first invalid field
5. Display toast/banner at top: "Please complete all required fields"
```

**Specific validation messages**:
```
Address: "Please enter a valid Australian address"
Step 1: "Please select Internal or External"
Step 2: "Please select at least one renovation item"
Step 3: "Please complete all required fields"
```

### Loading State

**When calculating estimate**:
```
1. Show spinner/loader overlay on form
2. Disable all inputs
3. Display text: "Calculating your estimate..."
4. Show progress indicator if calculation takes > 2s
```

### No Results State

**If calculation fails**:
```
Error message: "We couldn't calculate an estimate. 
               Please try again or contact us at 0800 269 4663"

Display:
- Button to [Try Again] (return to form)
- Link to [Call us]
- Error details if in debug mode
```

---

**Last Updated**: August 12, 2026  
**Next Review**: Before development sprint starts  
**Approval Status**: Ready for Handover
