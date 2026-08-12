# Spike Reno Calculator - Figma Design Analysis

**Project**: Spike Renovation Calculator  
**Figma Link**: https://www.figma.com/design/Q0fDj1AKMbwyPJRmPltox0/Spike-Reno-Calculator  
**Analysis Date**: August 12, 2026  
**Scope**: Complete design analysis including UX, components, business context, and gaps

---

## 📚 Analysis Documents

This comprehensive analysis is organized into three focused documents:

### 1. **FIGMA_ANALYSIS.md** (Main Document - 488 lines)
The definitive reference for all aspects of the design.

**Contents:**
- **Experience Requirements** - User capabilities, knowledge levels, journey states
- **Styles & Design Patterns** - Visual language, typography, color scheme, spacing, design patterns
- **Components** - Complete component inventory with Material-UI dependencies
- **UI Requirements** - Form flow, state management, validation, navigation, responsive behavior
- **Business Context** - Product purpose, target users, problem statement, competitive positioning
- **Potential Gaps & Assumptions** - Design gaps, behavioral assumptions, incomplete areas, technical debt

**Use this for:** Developers building the feature, architects reviewing implementation readiness

---

### 2. **ANALYSIS_SUMMARY.md** (Quick Reference - 309 lines)
A condensed version with practical quick-lookup tables and checklists.

**Contents:**
- Quick reference for what the product is and who uses it
- Color palette and typography stack (copy-paste ready)
- Page structure ASCII diagrams
- User flow diagrams
- Component inventory with state variations
- Form specifications for each step
- Key gaps and questions to address
- Implementation checklist (4 phases)
- Success metrics and MUI dependencies
- Next steps for development

**Use this for:** Product managers, team leads, developers starting implementation

---

### 3. **COMPONENT_DIAGRAM.md** (Technical Reference - 376 lines)
Detailed component hierarchies and state machines.

**Contents:**
- Complete React component tree (form and results pages)
- Accordion state machine diagram
- Button state diagram
- Form validation flow
- Responsive layout breakpoints (desktop/tablet/mobile)
- Data flow diagram

**Use this for:** Frontend developers, QA engineers, technical architects

---

## 🎯 Key Findings Summary

### What This Product Does
A 3-step form-based renovation cost calculator for homeowners. Users provide an address, select renovation type (internal/external), choose specific items to renovate, answer additional questions, then receive a cost estimate with a call-to-action to contact a home loan coach.

### Core Technologies
- **Frontend Framework**: React (assumed, based on MUI usage)
- **UI Library**: Material-UI v5+
- **Components**: Accordion pattern for progressive disclosure
- **Layout**: Responsive grid layout (MUI Grid2)
- **Styling**: Likely styled-components or CSS-in-JS

### User Journey
```
Address → Renovation Type → Items → Questions → Cost Estimate → Contact CTA
```

### Business Model
Lead generation tool for Demo Channel (financial institution) to capture homeowners planning renovations and introduce them to renovation financing products.

---

## ⚠️ Critical Gaps Identified

### Design Gaps (Need from Product/Design)
1. **Step 2 Content Unknown** - What renovation items are available? Kitchen/bathroom/etc.?
2. **Step 3 Content Unknown** - What additional questions are asked?
3. **Cost Calculation Logic** - How are estimates calculated? What's the data source?
4. **Mobile Design** - Only desktop (1512px) shown. What about tablet and mobile?
5. **Error Handling** - No error states shown. How are validation errors displayed?
6. **Completion States** - How is step progress indicated? Checkmarks? Colors?
7. **Address Change Flow** - What happens when user clicks "Enter new address"?

### Technical Gaps (Need from Development)
1. **Backend API** - Cost calculation API contract not defined
2. **Database** - Where does renovation cost data live? Update frequency?
3. **Address Validation** - What address API is used? Google Maps? Australian-specific?
4. **Lead Capture** - How is contact info collected? Separate form? Embedded?
5. **Analytics** - What events should be tracked? Form completion, step abandonment?
6. **Accessibility** - WCAG compliance level? ARIA attributes documented?

---

## ✅ What's Clear and Ready to Build

### Immediately Buildable
- [x] Header layout with two logos
- [x] Address display section with "Enter new address" link
- [x] Step 1 accordion structure and button layout
- [x] Results page structure and display format
- [x] Footer disclaimer
- [x] Color scheme and typography hierarchy
- [x] Responsive grid layout (1512px → narrower)

### Well-Defined Patterns
- [x] Accordion expand/collapse interaction
- [x] Button selection states (Internal/External choice)
- [x] Results page layout and information hierarchy
- [x] Navigation between pages (form → results → edit/new)

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Sprint 1)
- [ ] Set up React project with MUI v5+
- [ ] Create page layouts (header, footer, main content grid)
- [ ] Build reusable components (accordions, buttons, typography)
- [ ] Implement Step 1 form with Internal/External selection
- [ ] Wire up local state management

### Phase 2: Complete Form (Sprint 2)
- [ ] Define Step 2 options (get from product team)
- [ ] Define Step 3 questions (get from product team)
- [ ] Implement Steps 2 & 3 accordions
- [ ] Add form validation
- [ ] Create results page structure

### Phase 3: Backend & Integration (Sprint 3)
- [ ] Define API contract for cost calculation
- [ ] Implement address validation/autocomplete
- [ ] Build cost calculation engine
- [ ] Implement results display
- [ ] Add edit/new estimate flows

### Phase 4: Polish & Launch (Sprint 4)
- [ ] Mobile responsive refinement
- [ ] Accessibility review (WCAG 2.1 AA)
- [ ] Loading states and error handling
- [ ] Analytics implementation
- [ ] Performance optimization
- [ ] QA and bug fixes

---

## 💡 Key Technical Decisions to Make

### 1. State Management
- [ ] Use React Context API or Redux?
- [ ] Persist form state across navigation?
- [ ] LocalStorage for draft estimates?

### 2. Cost Calculation
- [ ] Real-time validation or on-submit?
- [ ] Show intermediate results or wait until complete?
- [ ] Calculation happens on frontend or backend?

### 3. Responsiveness
- [ ] Stacked layout on mobile?
- [ ] Touch-friendly button sizes (48px minimum)?
- [ ] Horizontal or vertical step indicators?

### 4. Lead Capture
- [ ] Built-in form or external link?
- [ ] Email capture on results page?
- [ ] Phone call or contact form?

### 5. Accessibility
- [ ] WCAG 2.1 AA or AAA?
- [ ] Keyboard navigation for accordion?
- [ ] Screen reader support for form validation?

---

## 🔍 Questions for Stakeholders

### Product Questions
1. Is this B2C, B2B, or both?
2. Geographic scope? Australia only or expanded?
3. What's the lead quality target? (e.g., contact rate, conversion rate)
4. Should we save/share estimates (social sharing, email)?
5. Are there different pricing tiers or models?

### Technical Questions
1. What's the preferred frontend framework? React? Vue? Svelte?
2. Any existing MUI theme/design system to follow?
3. Need to support older browsers (IE11, etc.)?
4. Authentication required for results?
5. GDPR/privacy compliance needed? (outside Australia?)

### Design Questions
1. What about error states and empty states?
2. Loading skeleton or spinner?
3. Should results show confidence levels or variance?
4. Comparison to market data or competitive pricing?
5. Ability to download/print estimates?

---

## 📊 Success Criteria

### Launch Readiness
- [ ] All 3 form steps fully designed and prototyped
- [ ] Mobile layouts shown (tablet and phone)
- [ ] All error states documented
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Cost calculation logic documented
- [ ] API contracts defined

### Product Performance
- [ ] Form completion rate > 60%
- [ ] Conversion rate (contact CTA) > 20%
- [ ] Average time to complete < 5 minutes
- [ ] Cost estimate accuracy > 80% (actual vs. estimated)
- [ ] Mobile traffic > 40% of total

---

## 📖 How to Use These Documents

**For Developers:**
1. Start with ANALYSIS_SUMMARY.md for quick overview
2. Reference FIGMA_ANALYSIS.md for detailed requirements
3. Use COMPONENT_DIAGRAM.md for technical implementation

**For Product Managers:**
1. Read Business Context section in FIGMA_ANALYSIS.md
2. Review UI Requirements and Gaps
3. Use questions section to guide stakeholder interviews

**For Designers:**
1. Check Styles & Design Patterns section
2. Review component inventory
3. Note all gaps that need design work

**For QA/Testing:**
1. Use Form Specifications for test cases
2. Reference component states (accordion, buttons)
3. Check responsive layout expectations

---

## 🔗 Related Resources

- **Figma File**: https://www.figma.com/design/Q0fDj1AKMbwyPJRmPltox0/Spike-Reno-Calculator
- **MUI Documentation**: https://mui.com/material-ui/getting-started/
- **Material Design**: https://m3.material.io/

---

## 📝 Document Statistics

| Document | Lines | Focus |
|----------|-------|-------|
| FIGMA_ANALYSIS.md | 488 | Comprehensive reference |
| ANALYSIS_SUMMARY.md | 309 | Quick lookup and checklists |
| COMPONENT_DIAGRAM.md | 376 | Technical architecture |
| **TOTAL** | **1,173** | Complete design documentation |

---

## 🎓 Key Learnings

### Design Patterns Used
1. **Progressive Disclosure** - Accordion pattern reveals form progressively
2. **Step Workflow** - Linear 3-step process with no jumps
3. **Binary Choice** - Internal/External decision point
4. **Cost Display** - Large, prominent, centered typography for result

### Material-UI Best Practices
1. Grid2 for modern responsive layouts
2. Accordion for multi-section forms
3. Paper for cards/elevated surfaces
4. Collapse for animated disclosure
5. Typography hierarchy for readability

### User Experience
1. **Simplicity** - Only necessary questions asked
2. **Trust** - Professional design, financial institution branding
3. **Clarity** - Large cost display, no ambiguity
4. **Action** - Clear CTA to contact home loan coach

---

**Last Updated**: August 12, 2026  
**Analysis Version**: 1.0  
**Status**: Ready for Development Team

