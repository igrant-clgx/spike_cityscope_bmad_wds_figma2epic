# Spike Reno Calculator - Component Specifications

**Document Version**: 1.0  
**Date**: August 12, 2026  
**Status**: Ready for Development  
**Framework**: React with Material-UI v5+

---

## Table of Contents

1. [Button Component](#button-component)
2. [Form Inputs](#form-inputs)
3. [Accordion/Step Component](#accordionstep-component)
4. [Typography Components](#typography-components)
5. [Card Components](#card-components)
6. [Layout Components](#layout-components)
7. [State & Loading Components](#state--loading-components)
8. [Accessibility Requirements](#accessibility-requirements)

---

## Button Component

### Overview
All buttons in the application are derived from Material-UI's `Button` component with consistent styling applied.

### Variants

#### Primary Action Button
**Used for**: Main CTAs, form submission, "New Estimate", "Call Us"

**Props**:
```typescript
interface PrimaryButtonProps {
  variant: 'contained';
  color: 'primary';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}
```

**Styles**:
```css
Background Color:       #0066CC (primary)
Text Color:             #FFFFFF (white)
Padding:                12px 16px (vertical × horizontal)
Min Height:             44px (touch-friendly)
Border Radius:          4px
Font Size:              14px
Font Weight:            500 (medium)
Text Transform:         None (capitalize first letter only)
Transition:             background-color 200ms ease-in-out
```

**States**:

| State | Background | Text | Cursor | Transition |
|-------|-----------|------|--------|-----------|
| Default | #0066CC | #FFFFFF | pointer | - |
| Hover | #0052A3 | #FFFFFF | pointer | 200ms |
| Active/Pressed | #003D7A | #FFFFFF | pointer | instant |
| Disabled | #CCCCCC | #999999 | not-allowed | - |
| Focus | #0066CC + outline | #FFFFFF | pointer | outline 2px #0066CC |

**Example Usage**:
```jsx
<Button 
  variant="contained" 
  color="primary" 
  fullWidth
  onClick={handleSubmit}
  disabled={isFormInvalid}
>
  Get Estimate
</Button>
```

#### Secondary Action Button
**Used for**: Alternative actions, "Edit Estimate", navigation options

**Props**:
```typescript
interface SecondaryButtonProps {
  variant: 'outlined';
  color: 'primary';
  fullWidth?: boolean;
  onClick: () => void;
  children: ReactNode;
}
```

**Styles**:
```css
Background Color:       #FFFFFF (white)
Border:                 2px solid #0066CC
Text Color:             #0066CC
Padding:                12px 16px
Min Height:             44px
Border Radius:          4px
Font Size:              14px
Font Weight:            500
Transition:             all 200ms ease-in-out
```

**States**:

| State | Background | Border | Text | Cursor |
|-------|-----------|--------|------|--------|
| Default | #FFFFFF | #0066CC | #0066CC | pointer |
| Hover | #E3F2FD | #0052A3 | #0052A3 | pointer |
| Active | #D1E7F7 | #003D7A | #003D7A | pointer |
| Disabled | #F5F5F5 | #CCCCCC | #CCCCCC | not-allowed |

#### Selection Button (Toggle)
**Used for**: Internal/External selection, multi-select items in Step 2

**Props**:
```typescript
interface SelectionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  fullWidth?: boolean;
}
```

**Styles**:
```css
/* Unselected */
Background Color:       #F5F5F5
Border:                 1px solid #E0E0E0
Text Color:             #333333
Padding:                12px 16px
Min Height:             44px

/* Selected */
Background Color:       #0066CC
Border:                 1px solid #0052A3
Text Color:             #FFFFFF
Padding:                12px 16px
Min Height:             44px
Box Shadow:             0px 2px 4px rgba(0, 102, 204, 0.2)
```

**States**:

| State | Background | Border | Text | Icon |
|-------|-----------|--------|------|------|
| Unselected | #F5F5F5 | #E0E0E0 | #333333 | - |
| Unselected Hover | #EEEEEE | #D0D0D0 | #333333 | - |
| Selected | #0066CC | #0052A3 | #FFFFFF | ✓ Checkmark |
| Selected Hover | #0052A3 | #003D7A | #FFFFFF | ✓ Checkmark |
| Disabled | #F5F5F5 | #CCCCCC | #999999 | - |

#### Text Link Button
**Used for**: "Enter new address", secondary navigation

**Styles**:
```css
Background Color:       transparent
Text Color:             #0066CC
Text Decoration:        underline
Font Size:              14px
Font Weight:            400
Padding:                0px
Cursor:                 pointer
Transition:             color 200ms ease-in-out
```

**States**:

| State | Text Color | Text Decoration | Cursor |
|-------|-----------|-----------------|--------|
| Default | #0066CC | underline | pointer |
| Hover | #0052A3 | underline | pointer |
| Visited | #7B2CBF | underline | pointer |
| Focus | #0066CC | underline + outline | pointer |

### Button Grouping

**Buttons displayed in horizontal group** (e.g., "Edit Estimate" + "New Estimate"):

```css
Display:                flex
Gap:                    16px
Justify Content:        center
Align Items:            center
Flex Wrap:              wrap (for mobile)
Width:                  100% (on mobile)
```

**Mobile (< 768px)**:
```css
Display:                flex
Flex Direction:         column
Gap:                    12px
Width:                  100%

Button {
  Width:                100%;
}
```

### Touch Target Size
- **Minimum height**: 44px (44x44px touch target)
- **Minimum width**: 44px (except for full-width buttons)
- **Padding**: At least 8px around icon/text
- **Spacing between buttons**: Minimum 8px

### Accessibility

**ARIA Attributes**:
```jsx
<Button
  aria-label="Submit renovation estimate form"
  aria-disabled={isLoading}
  type="button"
>
  Get Estimate
</Button>
```

**Focus Management**:
- Focus indicator: 2px solid outline, 2px offset
- Focus visible on keyboard navigation (`:focus-visible`)
- Tab order: follows document order (set `tabIndex` if needed)

**Keyboard Support**:
- `Enter` or `Space`: Activate button
- `Tab`: Navigate to next button
- `Shift+Tab`: Navigate to previous button

---

## Form Inputs

### Text Input Field

**Used for**: Address input, numeric values, text responses

**Props**:
```typescript
interface TextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'number' | 'tel';
  autoComplete?: string;
  maxLength?: number;
}
```

**Styles**:
```css
Border:                 1px solid #E0E0E0
Background Color:       #FFFFFF
Padding:                12px 16px
Border Radius:          4px
Font Size:              14px
Line Height:            1.5
Color:                  #333333
Transition:             border-color 200ms, box-shadow 200ms
Min Height:             44px
```

**States**:

| State | Border | Background | Text | Box Shadow |
|-------|--------|-----------|------|-----------|
| Default | #E0E0E0 | #FFFFFF | #333333 | none |
| Focused | #0066CC | #FFFFFF | #333333 | 0 0 0 3px rgba(0,102,204,0.1) |
| Filled | #E0E0E0 | #FFFFFF | #333333 | none |
| Error | #DC3545 | #FFFFFF | #333333 | 0 0 0 3px rgba(220,53,69,0.1) |
| Error Focused | #DC3545 | #FFFFFF | #333333 | 0 0 0 3px rgba(220,53,69,0.2) |
| Disabled | #F5F5F5 | #F5F5F5 | #999999 | none |

**Placeholder Text**:
```css
Color:                  #999999
Font Style:             italic
Opacity:                0.6
```

**Label**:
```css
Display:                block
Font Size:              14px
Font Weight:            500
Color:                  #333333
Margin Bottom:          8px
Required Indicator:     red asterisk (*) after text
```

**Helper Text / Error Messages**:
```css
Font Size:              12px
Font Weight:            400
Margin Top:             4px
Color (normal):         #666666
Color (error):          #DC3545
Color (success):        #28A745
```

### Number Input

**Used for**: Numeric quantities, property size, year built

**Props**: Same as TextInput with `type="number"`

**Additional Constraints**:
```javascript
min?: number;
max?: number;
step?: number;  // e.g., step={0.5} for decimals
```

**Spinner Behavior**:
- Show increment/decrement arrows
- Min/max validation on input
- Prevent non-numeric characters

### Checkbox

**Used for**: Multi-select in Step 2 (renovation items)

**Styles**:
```css
Size:                   20px × 20px
Border:                 2px solid #0066CC
Border Radius:          4px
Background (checked):   #0066CC
Checkmark Color:        #FFFFFF
Cursor:                 pointer
Transition:             200ms ease-in-out
```

**States**:

| State | Border | Background | Checkmark |
|-------|--------|-----------|-----------|
| Unchecked | #E0E0E0 | #FFFFFF | - |
| Unchecked Hover | #D0D0D0 | #F5F5F5 | - |
| Checked | #0066CC | #0066CC | #FFFFFF |
| Checked Hover | #0052A3 | #0052A3 | #FFFFFF |
| Disabled | #CCCCCC | #F5F5F5 | #999999 |

**With Label**:
```jsx
<FormControlLabel
  control={<Checkbox checked={checked} onChange={handleChange} />}
  label="Kitchen renovation"
/>
```

**Label Styles**:
```css
Font Size:              14px
Font Weight:            400
Color:                  #333333
Margin Left:            8px
Cursor:                 pointer
User Select:            none
```

### Radio Button

**Used for**: Single-select options (e.g., property type: House/Apartment)

**Styles**:
```css
Size:                   20px × 20px
Border:                 2px solid #E0E0E0
Border Radius:          50%
Background (checked):   #FFFFFF with center dot
Dot Size (checked):     8px × 8px
Dot Color:              #0066CC
Cursor:                 pointer
```

**States**:

| State | Outer Border | Center Dot | Background |
|-------|---|---|---|
| Unchecked | #E0E0E0 | - | #FFFFFF |
| Unchecked Hover | #D0D0D0 | - | #F5F5F5 |
| Checked | #0066CC | #0066CC | #FFFFFF |
| Checked Hover | #0052A3 | #0052A3 | #FFFFFF |
| Disabled | #CCCCCC | #999999 | #F5F5F5 |

### Select/Dropdown

**Used for**: Property type, state/territory, number of rooms

**Props**:
```typescript
interface SelectProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}
```

**Styles**:
```css
Border:                 1px solid #E0E0E0
Background Color:       #FFFFFF
Padding:                12px 16px
Border Radius:          4px
Font Size:              14px
Arrow Color:            #666666
```

**States**: Same as text input (default, focused, error, disabled)

---

## Accordion/Step Component

### Overview
Material-UI `Accordion` component with custom styling for form steps.

### Structure
```jsx
<Accordion 
  expanded={isExpanded} 
  onChange={handleToggle}
  sx={{ '&.Mui-expanded': { margin: 0 } }}
>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6">Step 1: Renovation Type</Typography>
  </AccordionSummary>
  
  <AccordionDetails>
    {/* Form content */}
  </AccordionDetails>
</Accordion>
```

### Header (AccordionSummary)

**Styles**:
```css
Background Color:       #F5F5F5 (collapsed), #FFFFFF (expanded)
Padding:                16px 24px
Border Radius:          8px (collapsed), 8px 8px 0 0 (expanded)
Border:                 1px solid #E0E0E0
Font Size:              16px
Font Weight:            600
Color:                  #333333
Cursor:                 pointer
Min Height:             56px
Transition:             background-color 200ms, border-radius 200ms
```

**Expand Icon**:
```css
Size:                   24px × 24px
Color:                  #0066CC
Rotation (collapsed):   0deg
Rotation (expanded):    180deg
Transition:             transform 200ms ease-in-out
```

**States**:

| State | Background | Border | Icon Rotation |
|-------|-----------|--------|--------------|
| Collapsed | #F5F5F5 | #E0E0E0 | 0deg |
| Collapsed Hover | #EEEEEE | #D0D0D0 | 0deg |
| Expanded | #FFFFFF | #E0E0E0 | 180deg |
| Expanded Hover | #F9F9F9 | #D0D0D0 | 180deg |
| Disabled | #F5F5F5 | #CCCCCC | 0deg (grayed) |

### Content Area (AccordionDetails)

**Styles**:
```css
Background Color:       #FFFFFF
Padding:                24px
Border Bottom:          1px solid #E0E0E0
Border Left:            1px solid #E0E0E0
Border Right:           1px solid #E0E0E0
Border Radius:          0 0 8px 8px
```

**Children Spacing**:
```css
Question/Label:         Margin bottom 16px
Form Group:             Margin bottom 16px (last child: 0)
Button Group:           Margin top 24px, spacing 16px
```

### Accordion Grouping

**When multiple accordions are stacked**:
```css
Margin Between:         16px
Max Width:              840px
Box Shadow:             0px 2px 4px rgba(0, 0, 0, 0.08)
```

### Step Indicators

**Visual progression** (optional enhancement):
```
Step 1 ✓  →  Step 2 ▢  →  Step 3 ▢
```

**Indicator Styles**:
- Completed step: Green checkmark, faded background
- Current step: Blue background, highlighted
- Upcoming step: Gray background, neutral

---

## Typography Components

### Heading Variants

#### H3 (Question Text)
```jsx
<Typography variant="h3" component="h2">
  Is an Internal or External renovation?
</Typography>
```

**Styles**:
```css
Font Size:              28px
Font Weight:            700
Line Height:            1.4
Color:                  #333333
Margin Bottom:          24px
```

#### H6 (Step Header)
```jsx
<Typography variant="h6">
  Step 1: Renovation Type
</Typography>
```

**Styles**:
```css
Font Size:              16px
Font Weight:            600
Line Height:            1.5
Color:                  #333333
```

#### Body Text
```jsx
<Typography variant="body1">
  Choose the type of renovation you're planning.
</Typography>
```

**Styles**:
```css
Font Size:              14px
Font Weight:            400
Line Height:            1.5
Color:                  #666666
```

#### Caption (Helper/Disclaimer)
```jsx
<Typography variant="caption">
  These are estimates based on current market data.
</Typography>
```

**Styles**:
```css
Font Size:              12px
Font Weight:            400
Line Height:            1.33
Color:                  #999999
```

#### Result Cost (Special)
```jsx
<Typography 
  sx={{ 
    fontSize: '56px', 
    fontWeight: 700, 
    lineHeight: 1.2,
    color: '#333333'
  }}
>
  $32,700 - $40,000
</Typography>
```

---

## Card Components

### Result Card

**Props**:
```typescript
interface ResultCardProps {
  costEstimate: {
    min: number;
    max: number;
  };
  renovationType: string;
  selectedItems: string[];
  onEdit: () => void;
  onNewEstimate: () => void;
  onContactCoach: () => void;
}
```

**Structure**:
```jsx
<Paper elevation={3}>
  <Box sx={{ padding: 4 }}>
    <Typography variant="h4">
      Estimated Renovation Cost
    </Typography>
    
    <Typography sx={{ fontSize: '56px', fontWeight: 700 }}>
      ${min.toLocaleString()} - ${max.toLocaleString()}
    </Typography>
    
    <Typography variant="caption">
      {renovationType} renovation: {selectedItems.join(', ')}
    </Typography>
    
    <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
      <Button onClick={onEdit}>Edit Estimate</Button>
      <Button variant="contained">New Estimate</Button>
    </Box>
  </Box>
</Paper>
```

**Styles**:
```css
Background Color:       #FFFFFF
Border:                 1px solid #E0E0E0
Border Radius:          8px
Padding:                32px
Box Shadow:             0px 4px 8px rgba(0, 0, 0, 0.10)
Max Width:              600px
Margin:                 32px auto
```

### Information Card (Expandable)

**Used for**: "How is this calculated?" section

**Props**:
```typescript
interface InfoCardProps {
  title: string;
  content: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
}
```

**Styles**: Same as Result Card, with expandable toggle

---

## Layout Components

### Page Container
```jsx
<Container maxWidth="md" sx={{ paddingY: 4 }}>
  {/* Content */}
</Container>
```

**Responsive Widths**:
```css
Desktop (1512px+):      840px max width
Tablet (768-1024px):    90% (max 720px)
Mobile (< 768px):       100% with 16px padding
```

### Content Grid
```jsx
<Grid2 container spacing={3}>
  <Grid2 xs={12}>
    {/* Full width on mobile, tablet, desktop */}
  </Grid2>
</Grid2>
```

### Header Section
```jsx
<Box sx={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: '#2C2C2C'
}}>
  {/* Logo + Company Logo */}
</Box>
```

---

## State & Loading Components

### Loading Spinner
```jsx
<CircularProgress 
  size={40}
  sx={{ color: '#0066CC' }}
/>
```

**Styles**:
```css
Color:                  #0066CC
Size:                   40px
Stroke Width:           4px
Animation:              Linear rotation, 1s per rotation
Position:               Centered in container
```

### Skeleton Loader (Form)
```jsx
<Skeleton variant="rectangular" height={44} sx={{ marginBottom: 2 }} />
<Skeleton variant="rectangular" height={120} sx={{ marginBottom: 2 }} />
```

### Toast/Snackbar Notifications

**Success**:
```jsx
<Snackbar
  message="Estimate saved successfully!"
  severity="success"
  autoHideDuration={3000}
/>
```

**Error**:
```jsx
<Snackbar
  message="Please fill in all required fields."
  severity="error"
  autoHideDuration={5000}
/>
```

**Styles**:
```css
Position:               bottom-center or bottom-right
Background:             Varies by type (green/red/orange)
Text Color:             White
Padding:                16px 24px
Border Radius:          4px
Box Shadow:             0px 2px 8px rgba(0, 0, 0, 0.15)
Animation:              Slide up 300ms
Auto-dismiss:           3000-5000ms
```

### Validation Error Display

**Inline error** (below input):
```jsx
<TextField
  error={hasError}
  helperText={error ? "Please enter a valid address" : ""}
/>
```

**Styles**:
```css
Color:                  #DC3545
Font Size:              12px
Margin Top:             4px
```

**Border on error**:
```css
Border:                 2px solid #DC3545
Box Shadow:             0 0 0 3px rgba(220, 53, 69, 0.1)
```

### Success Indicator
```
✓ Check mark in green (#28A745)
Message: "Step completed successfully"
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- [ ] All interactive elements accessible via Tab
- [ ] Tab order logical and intuitive
- [ ] Focus indicator always visible (2px minimum)
- [ ] No keyboard traps
- [ ] Enter/Space to activate buttons
- [ ] Arrow keys to navigate select options
- [ ] Escape to close modals/dropdowns

#### Screen Reader Support
- [ ] All form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Form validation errors linked to inputs via `aria-describedby`
- [ ] Accordion headers announce expanded/collapsed state
- [ ] Icons have `aria-label` if standalone
- [ ] Semantic HTML (`<form>`, `<fieldset>`, `<label>`)

**Example**:
```jsx
<TextField
  id="address-input"
  label="Home Address"
  error={hasError}
  helperText={hasError ? "Invalid address format" : ""}
  aria-describedby={hasError ? "address-error" : undefined}
/>
{hasError && (
  <Typography id="address-error" role="alert" sx={{ color: '#DC3545' }}>
    Please enter a valid Australian address
  </Typography>
)}
```

#### Color Contrast
- [ ] Normal text (14px): 4.5:1 minimum
- [ ] Large text (18px+): 3:1 minimum
- [ ] All interactive elements distinguishable without color alone

#### Forms
- [ ] Required fields indicated with text AND icon
- [ ] Form instructions before form elements
- [ ] Error messages in plain language
- [ ] Success states clearly indicated
- [ ] Auto-fill enabled where appropriate (`autocomplete` attributes)

#### Motion & Animation
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Animations kept under 3 seconds
- [ ] No auto-playing animations > 5 seconds
- [ ] No flashing content (> 3 times/second)

#### Language & Readability
- [ ] Page language declared in HTML (`lang="en-AU"`)
- [ ] Define abbreviations on first use: `<abbr title="New South Wales">NSW</abbr>`
- [ ] Reading level appropriate for target audience
- [ ] Acronyms and abbreviations explained

#### Testing Checklist
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Tested with zoom to 200%
- [ ] Tested with high contrast mode enabled
- [ ] Tested with reduced motion enabled
- [ ] Axe DevTools or similar accessibility audit tool
- [ ] Manual accessibility review by QA

---

## Component Export Structure

```javascript
// components/Buttons/PrimaryButton.tsx
export const PrimaryButton = (props: PrimaryButtonProps) => { ... }

// components/Form/TextInput.tsx
export const TextInput = (props: TextInputProps) => { ... }

// components/Form/Checkbox.tsx
export const FormCheckbox = (props: CheckboxProps) => { ... }

// components/Accordion/FormStep.tsx
export const FormStep = (props: AccordionProps) => { ... }

// components/Cards/ResultCard.tsx
export const ResultCard = (props: ResultCardProps) => { ... }

// index.ts - Export all
export { PrimaryButton, SecondaryButton, TextInput, FormCheckbox, ... }
```

---

## Testing Requirements

### Component Unit Tests
- All component props render correctly
- All state transitions work as expected
- Accessibility attributes present and correct
- Focus management works properly
- Keyboard events handled correctly

### Visual Regression Tests
- Compare screenshots across browser versions
- Test responsive layouts at all breakpoints
- Verify color accuracy

### Accessibility Tests
- Axe DevTools automation
- Screen reader testing
- Manual keyboard navigation
- Focus indicator visibility

---

**Last Updated**: August 12, 2026  
**Next Review**: Before development sprint starts  
**Approval Status**: Ready for Handover
