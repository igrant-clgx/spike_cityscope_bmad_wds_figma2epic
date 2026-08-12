# Spike Reno Calculator - Quick Reference Summary

## 🎯 What Is It?
A Material-UI based web application that helps homeowners estimate renovation costs through a 3-step form with results display and home loan coaching CTA.

## 👥 Who Uses It?
- **Primary**: Homeowners planning renovations
- **Secondary**: Real estate agents, property investors
- **Business Owner**: Demo Channel (financial institution) for lead generation

## 🎨 Design System

### Color Palette
```
Header Background:    #2C2C2C (dark brown/charcoal)
Main Background:      #F5F5F5 (light gray)
Cards/Content:        #FFFFFF (white)
Text Primary:         #333333 (dark gray)
Text Secondary:       #666666 (medium gray)
Accent/Links:         #0066CC (blue)
```

### Typography Stack
- **Headers (Step labels)**: h6, ~14-16px, sans-serif
- **Questions**: h3, ~18-20px, sans-serif
- **Results (Cost)**: Large heading, ~58px+, bold, high contrast
- **Body Text**: p, ~14px, sans-serif
- **All**: Sans-serif font family (system fonts or Material Design default)

### Spacing Standards
- Card padding: 16-24px
- Section margins: 24-32px
- Button spacing: 8-16px gap
- Grid system: MUI Grid2 (12-column responsive)

---

## 📐 Page Structure

### Header (68px height)
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]                                      [Company Logo]  │
└─────────────────────────────────────────────────────────────┘
```

### Main Content (Centered 840px wide)
```
Address Display
  - "400 Catherine Street Lilyfield NSW 2040"
  - [Enter new address] link

┌─ Step 1: Renovation type [^]
├─ Question: Is an Internal or External renovation?
├─ [Internal] [External] buttons
└─ Collapse details...

┌─ Step 2: What to renovate [^]
└─ (Collapsed - content unknown)

┌─ Step 3: More questions [^]
└─ (Collapsed - content unknown)
```

### Results View
```
┌────────────────────────────────────────────────┐
│       Estimated Renovation Cost                │
│   Internal Renovation: Kitchen                 │
│                                                │
│          $32,700 - $40,000                     │
│                                                │
│  These are estimates to help you plan          │
└────────────────────────────────────────────────┘

[Additional Information - How calculated] [^]

[Edit Estimate] [New Estimate]

Talk to a Home Loan Coach...
[Call icon] Call us: 0800 269 4663
```

### Footer (Dark bar with disclaimer)
```
Disclaimer: The Renovation Calculator Report is available to 
customers who provide their contact details...
```

---

## 🔄 User Flow

### Main Path
```
1. Enter/View Address
   ↓
2. Select Renovation Type (Internal/External)
   ↓
3. Select Items to Renovate
   ↓
4. Answer Additional Questions
   ↓
5. View Cost Estimate
   ↓
6. Either:
   - Edit Estimate (return to Step 1)
   - New Estimate (reset form)
   - Contact Home Loan Coach
```

### Alternative Paths
```
Enter New Address → Restart from Step 1 with new address
Edit Estimate → Return to accordion form
New Estimate → Reset entire form
```

---

## 🧩 Component Inventory

### Form Components
| Name | MUI Component | State Variations |
|------|---|---|
| Step Container | Accordion + Paper | Expanded, Collapsed, Disabled, Completed |
| Step Header | AccordionSummary | Default, Active, Completed |
| Expand Icon | Icon (21x21) | ↓ (down), ↑ (up) |
| Address Display | Typography + Button | Default, Focused, Error |
| Selection Buttons | ButtonBase group | Unselected, Hover, Selected, Disabled |
| Question Text | Typography (h3) | Default |

### Result Components
| Name | MUI Component | Purpose |
|---|---|---|
| Cost Display | Typography | Shows "$32,700 - $40,000" in large text |
| Result Card | Paper | Container for result |
| Action Buttons | ButtonBase pair | "Edit Estimate" (secondary), "New Estimate" (primary) |
| Expandable FAQ | Box + Collapse | "Additional Information" section |
| Contact Section | Box + Typography | CTA with phone number |

### Layout Components
| Name | MUI Component | Purpose |
|---|---|---|
| Page Wrapper | Container | Max-width constraint |
| Header Grid | Grid2 | 2-column logo layout |
| Content Grid | Grid2 | Centered content with margins |
| Section Grid | Grid2 | Form sections layout |

---

## 📋 Form Specifications

### Step 1: Renovation Type
- **Question**: "Is an Internal or External renovation?"
- **Input Type**: Binary choice buttons (2 options)
- **Required**: Yes
- **Options**: 
  - Internal (selected → enables kitchen, bathroom, etc. in Step 2)
  - External (selected → enables roof, walls, etc. in Step 2)
- **Visual State**: Selected button has filled/highlighted appearance

### Step 2: Renovation Items (INCOMPLETE)
- **Question**: "What to renovate?" (implied)
- **Input Type**: Likely multi-select checkboxes or toggle buttons
- **Required**: At least one item
- **Options**: 
  - *Depends on Step 1 selection*
  - If Internal: Kitchen, Bathroom, Flooring, Walls, Etc.
  - If External: Roof, Windows, Doors, Walls, Landscaping, Etc.
- **Note**: Exact options not visible in current design

### Step 3: Additional Details (INCOMPLETE)
- **Question**: "More questions" (implied)
- **Input Type**: Unknown - likely mix of:
  - Multi-choice (property type, age, size)
  - Text input (square footage)
  - Numeric input (current condition rating)
- **Required**: Depends on question
- **Note**: Content completely unknown from current design

---

## 🚨 Key Gaps to Address

### Critical Design Questions
1. What are the exact options in Step 2 (renovation items)?
2. What questions are in Step 3?
3. How does the cost calculation work? (Formula, data source)
4. What happens when user clicks "Enter new address"?
5. Is form progression automatic after each selection or manual?
6. Are there validation errors? (If so, what do they look like?)
7. How is "completed step" indicated visually?
8. What's the mobile layout?

### Feature Questions
1. Can users save/bookmark estimates?
2. Is there a login/account system?
3. How is contact info captured from home loan coach CTA?
4. Are there email confirmations or follow-ups?
5. Is there comparison to market data or competitor pricing?
6. What's the data retention policy?

### Technical Questions
1. Backend: Where are cost estimates calculated/stored?
2. Frontend: Is this Next.js, React, or other framework?
3. What's the API structure?
4. How often is cost data updated?
5. Is there real-time address geocoding/validation?

---

## ✅ Implementation Checklist

### Phase 1: Form Input (Steps 1-3)
- [ ] Step 1 accordion with Internal/External selection
- [ ] Button state management (selected/unselected styling)
- [ ] Step 2 accordion with multi-select renovation items
- [ ] Conditional logic to show/hide items based on Step 1
- [ ] Step 3 accordion with additional questions
- [ ] Form validation on each step
- [ ] Error state styling and messages
- [ ] Address change workflow

### Phase 2: Results & Actions
- [ ] Cost calculation engine (backend)
- [ ] Results display with cost estimate
- [ ] Additional information expandable section
- [ ] Edit Estimate button (return to form)
- [ ] New Estimate button (reset form)
- [ ] Contact CTA with phone number

### Phase 3: Polish & Responsive
- [ ] Mobile responsive layout (tablet, phone)
- [ ] Loading states (skeleton, spinner)
- [ ] Success/error toasts
- [ ] Keyboard navigation and accessibility
- [ ] WCAG 2.1 compliance (AA level)
- [ ] Analytics tracking
- [ ] Performance optimization

### Phase 4: Integration
- [ ] Address API integration (Google Maps or similar)
- [ ] Lead capture form
- [ ] CRM integration for contact data
- [ ] Cost database/pricing engine
- [ ] Email notifications

---

## 📊 Success Metrics

### Product Health
- **Form Completion Rate**: % of users who reach Step 3 results
- **Conversion Rate**: % of users who contact home loan coach
- **Drop-off Rate**: Where users abandon the form (which step?)
- **Time to Complete**: Average duration from start to results

### Business KPIs
- **Lead Quality**: How many converted to actual loans?
- **Cost Estimate Accuracy**: How close to actual quotes?
- **Customer Satisfaction**: NPS or satisfaction rating

---

## 🔗 Material-UI Component Dependencies

```javascript
// Required MUI components
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box,
  Button,
  ButtonBase,
  Collapse,
  Container,
  Grid2,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  CircularProgress
} from '@mui/material'

import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

// Styling approach
import { styled } from '@mui/material/styles'
// OR
import { ThemeProvider, createTheme } from '@mui/material/styles'
```

---

## 🎬 Next Steps for Development

1. **Clarify Missing Content**: Get details on Steps 2-3 from product/design team
2. **Create Interactive Prototype**: Use Figma prototyping to test flow
3. **Technical Design Doc**: Specify API contracts, data models, calculation logic
4. **Mobile Wireframes**: Design tablet/mobile layouts
5. **Accessibility Audit**: Verify keyboard nav, screen reader support
6. **Backend Planning**: Cost database schema, address API integration
7. **Testing Strategy**: Unit tests for form validation, E2E tests for flows

