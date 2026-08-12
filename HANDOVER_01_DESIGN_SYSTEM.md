# Spike Reno Calculator - Design System Specification

**Document Version**: 1.0  
**Date**: August 12, 2026  
**Status**: Ready for Development  
**Target Framework**: React with Material-UI v5+

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography System](#typography-system)
3. [Spacing & Grid System](#spacing--grid-system)
4. [Shadows & Elevation](#shadows--elevation)
5. [Border Radius Conventions](#border-radius-conventions)
6. [Theme Configuration](#theme-configuration)

---

## Color Palette

### Primary Colors

| Usage | Name | Hex Code | RGB | Description |
|-------|------|----------|-----|-------------|
| Header Background | Dark Charcoal | `#2C2C2C` | rgb(44, 44, 44) | Dark navigation bar, high contrast text area |
| Page Background | Light Gray | `#F5F5F5` | rgb(245, 245, 245) | Main page background, subtle distinction |
| Card/Content | White | `#FFFFFF` | rgb(255, 255, 255) | Form containers, result cards, elevated surfaces |

### Text Colors

| Usage | Name | Hex Code | RGB | Contrast Ratio | WCAG |
|-------|------|----------|-----|--------|------|
| Primary Text | Dark Gray | `#333333` | rgb(51, 51, 51) | 12.6:1 (vs #F5F5F5) | AAA |
| Secondary Text | Medium Gray | `#666666` | rgb(102, 102, 102) | 7.2:1 (vs #F5F5F5) | AA |
| Hint/Disabled | Light Gray | `#999999` | rgb(153, 153, 153) | 3.8:1 (vs #F5F5F5) | AA |
| Links/Accents | Primary Blue | `#0066CC` | rgb(0, 102, 204) | 8.1:1 (vs #FFFFFF) | AAA |

### State Colors

| State | Color | Hex Code | Use Case |
|-------|-------|----------|----------|
| Success | Green | `#28A745` | Form validation success, positive feedback |
| Error | Red | `#DC3545` | Form validation errors, warnings |
| Warning | Orange | `#FFC107` | Informational alerts, cautions |
| Info | Light Blue | `#17A2B8` | Informational messages |
| Hover (Button) | Darker Blue | `#0052A3` | Interactive hover states |
| Active (Button) | Darkest Blue | `#003D7A` | Selected/active button state |
| Disabled | #CCCCCC | `#CCCCCC` | Disabled form elements, inactive states |

### Usage Guidelines

**Header & Navigation**
- Background: Dark Charcoal (#2C2C2C)
- Text: White (#FFFFFF) for high contrast
- Logo space: Maintain white/light logo visibility

**Form Areas**
- Container: White (#FFFFFF) on Light Gray (#F5F5F5) background
- Questions: Dark Gray (#333333) for legibility
- Helper text: Medium Gray (#666666)
- Borders: Light Gray (#CCCCCC) for subtle definition

**Interactive Elements**
- Link/CTA text: Primary Blue (#0066CC)
- Selected buttons: Active Blue (#003D7A) background with white text
- Unselected buttons: Light Gray background with Dark Gray text
- Hover: Darker Blue (#0052A3) with transition

**Validation States**
- Error text: Red (#DC3545)
- Error border: Red (#DC3545) with 2px border
- Success: Green (#28A745)
- Success border: Green (#28A745)

---

## Typography System

### Font Families

```css
/* Primary Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;
```

**Rationale**: System font stack provides optimal performance, native feel, and accessibility across all platforms and devices.

### Type Scale

| Level | Component | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|-----------|------|--------|-------------|-----------------|--------|
| H1 | Heading 1 | 48px | 700 Bold | 1.167 (56px) | -0.5px | Page titles (rarely used) |
| H2 | Heading 2 | 40px | 700 Bold | 1.2 (48px) | -0.3px | Section headings |
| H3 | Heading 3 | 28px | 700 Bold | 1.4 (39px) | 0px | Question text in forms |
| H4 | Heading 4 | 22px | 600 Semi-bold | 1.45 (32px) | 0.2px | Subsection headings |
| H5 | Heading 5 | 18px | 600 Semi-bold | 1.5 (27px) | 0.1px | Card titles, labels |
| H6 | Heading 6 | 16px | 600 Semi-bold | 1.5 (24px) | 0.5px | Step accordion headers |
| Body | Paragraph | 14px | 400 Regular | 1.5 (21px) | 0.25px | Body text, descriptions |
| Caption | Small text | 12px | 400 Regular | 1.33 (16px) | 0.4px | Helper text, disclaimers |
| Overline | Label | 12px | 500 Medium | 1.66 (20px) | 1.5px | Labels, badges |
| Button | Button text | 14px | 500 Medium | 1.75 (25px) | 0.40px | Button labels |

### Specific Component Typography

#### Result Cost Display (Special)
```css
font-size: 56px;        /* Extra large */
font-weight: 700;       /* Bold */
line-height: 1.2;       /* 67px */
letter-spacing: -1px;
color: #333333;
font-family: system-ui;
```
**Purpose**: Make the estimated cost estimate immediately prominent and memorable to users.

#### Step Headers (Accordion)
```css
font-size: 16px;
font-weight: 600;       /* Semi-bold */
line-height: 1.5;
color: #333333;
```
**Purpose**: Clearly distinguish form steps while maintaining visual hierarchy.

#### Form Questions
```css
font-size: 18px;
font-weight: 600;
line-height: 1.5;
color: #333333;
margin-bottom: 24px;
```
**Purpose**: Make form questions clear and easy to read.

#### Body Copy
```css
font-size: 14px;
font-weight: 400;
line-height: 1.5;       /* 21px line-height */
color: #666666;
```
**Purpose**: Readable body text throughout the application.

### Typography CSS Mixins (MUI Theme)

```javascript
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.167,
    letterSpacing: '-0.5px',
  },
  h3: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: 0,
  },
  body1: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.25px',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0.4px',
  },
};
```

---

## Spacing & Grid System

### Base Unit

**8px base unit** — All spacing derives from multiples of 8px for consistency and alignment.

### Standard Spacing Scale

```
8px   = $space-1    (4px borders, fine tweaks)
16px  = $space-2    (padding within components)
24px  = $space-3    (section spacing, card padding)
32px  = $space-4    (larger section margins)
48px  = $space-6    (major section breaks)
64px  = $space-8    (page-level spacing)
```

### Component Spacing Specifications

#### Form Step Accordion
```
Outer margin:           24px bottom (space between steps)
Header padding:         16px vertical × 24px horizontal
Content padding:        24px
Footer button gap:      16px (between buttons)
```

#### Address Display Section
```
Container margin:       32px bottom
Text padding:           16px
Link underline gap:     4px
```

#### Form Controls
```
Label to input:         8px
Input to helper text:   4px
Form row gap:           24px
Multi-select item gap:  16px
```

#### Buttons
```
Horizontal padding:     16px
Vertical padding:       12px (44px min height for touch)
Button group gap:       16px
Between buttons:        8px (when inline)
```

### Responsive Grid Layout

**Framework**: MUI Grid2 (12-column system)

#### Desktop Layout (1512px maximum width)
```
Container width:        840px
Horizontal padding:     48px (left + right)
Content grid:           1 column, full width
```

#### Tablet Layout (768px - 1024px)
```
Container width:        90% (max 720px)
Horizontal padding:     32px (left + right)
Content grid:           1 column, full width
```

#### Mobile Layout (320px - 767px)
```
Container width:        100%
Horizontal padding:     16px (left + right)
Content grid:           1 column, full width
Button stacking:        Vertical (100% width)
```

### Padding & Margins by Component

| Component | Top | Right | Bottom | Left | Notes |
|-----------|-----|-------|--------|------|-------|
| Form Step | 0 | 0 | 24px | 0 | Last step: no bottom margin |
| Step Header | 16px | 24px | 16px | 24px | Clickable area, 48px min height |
| Step Content | 24px | 24px | 24px | 24px | Padding within each step |
| Address Section | 0 | 0 | 32px | 0 | Between header and steps |
| Result Card | 32px | 32px | 32px | 32px | Centered, max 600px width |
| Footer | 24px | 0 | 24px | 0 | Relative to content edge |

---

## Shadows & Elevation

### Shadow System

Material Design 3 elevation system adapted for this application:

#### Elevation Levels

| Level | Shadow | Use Case |
|-------|--------|----------|
| 0 | None | Flat backgrounds, no depth |
| 1 | `0px 1px 2px rgba(0,0,0,0.05)` | Subtle depth, borders only |
| 2 | `0px 2px 4px rgba(0,0,0,0.08)` | Form inputs, secondary cards |
| 3 | `0px 4px 8px rgba(0,0,0,0.10)` | Primary cards, raised elements |
| 4 | `0px 8px 16px rgba(0,0,0,0.12)` | Floating elements, modals |
| 6 | `0px 16px 24px rgba(0,0,0,0.15)` | High-importance modals, overlays |

### Shadow Application

#### Form Cards (Accordion Containers)
```css
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
border: 1px solid #E0E0E0;
border-radius: 8px;
```
**Purpose**: Subtle elevation to distinguish from background.

#### Result Cards
```css
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.10);
border: 1px solid #E0E0E0;
border-radius: 8px;
```
**Purpose**: More prominence for result card content.

#### Input Fields
```css
box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
border: 1px solid #E0E0E0;
```
**Purpose**: Minimal elevation, focus on border state.

#### Button Hover State
```css
/* Unraised button hover */
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
```
**Purpose**: Subtle lift on hover for feedback.

### No Drop Shadows
- Avoid heavy drop shadows (> 0.15 opacity)
- Use 1px borders as primary definition method
- Shadow should be supporting detail, not primary visual distinction

---

## Border Radius Conventions

### Radius Scale

```
0px     = sharp edges (no rounding)
4px     = $radius-1 (minimal rounding, form inputs)
8px     = $radius-2 (standard rounding, cards, buttons)
12px    = $radius-3 (emphasized rounding, large components)
16px    = $radius-4 (significant rounding, specialized use)
```

### Component Specifications

#### Buttons
```css
border-radius: 4px;
```
**Rationale**: Material Design standard, subtle rounding for professional appearance.

#### Form Inputs
```css
border-radius: 4px;
```
**Rationale**: Consistent with buttons for visual cohesion.

#### Cards & Containers
```css
border-radius: 8px;
```
**Rationale**: Slightly more rounded than buttons for visual distinction.

#### Accordion Headers
```css
border-radius: 8px 8px 0px 0px;  /* Top corners only when collapsed */
border-radius: 8px;                /* Full radius when expanded */
```
**Rationale**: Adapt to expanded/collapsed state.

#### Fully Rounded Elements
```css
border-radius: 50%;
```
**Use Case**: User avatars, circular badges, status indicators.

---

## Theme Configuration

### MUI Theme Object

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
      dark: '#003D7A',
      light: '#E3F2FD',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F5F5F5',
      dark: '#E0E0E0',
      light: '#F9F9F9',
      contrastText: '#333333',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
    error: {
      main: '#DC3545',
      light: '#F8D7DA',
      dark: '#C82333',
    },
    warning: {
      main: '#FFC107',
      light: '#FFF3CD',
      dark: '#E0A800',
    },
    success: {
      main: '#28A745',
      light: '#D4EDDA',
      dark: '#1E7E34',
    },
    info: {
      main: '#17A2B8',
      light: '#D1ECF1',
      dark: '#0C5460',
    },
    divider: '#E0E0E0',
    action: {
      hover: 'rgba(0, 102, 204, 0.04)',
      selected: 'rgba(0, 102, 204, 0.08)',
      disabled: '#CCCCCC',
      disabledBackground: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '48px', fontWeight: 700, lineHeight: 1.167 },
    h2: { fontSize: '40px', fontWeight: 700, lineHeight: 1.2 },
    h3: { fontSize: '28px', fontWeight: 700, lineHeight: 1.4 },
    h4: { fontSize: '22px', fontWeight: 600, lineHeight: 1.45 },
    h5: { fontSize: '18px', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '16px', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '14px', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '12px', fontWeight: 400, lineHeight: 1.33 },
  },
  spacing: 8,  // Base unit for spacing calculations
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0,0,0,0.05)',
    '0px 2px 4px rgba(0,0,0,0.08)',
    '0px 4px 8px rgba(0,0,0,0.10)',
    '0px 8px 16px rgba(0,0,0,0.12)',
    // ... (additional levels)
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          padding: '12px 16px',
          minHeight: '44px',
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});
```

### CSS Variables (Alternative Approach)

```css
:root {
  /* Colors */
  --color-primary: #0066CC;
  --color-primary-dark: #003D7A;
  --color-primary-light: #E3F2FD;
  
  --color-bg-default: #F5F5F5;
  --color-bg-paper: #FFFFFF;
  
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-text-disabled: #999999;
  
  --color-error: #DC3545;
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-info: #17A2B8;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  --font-size-body: 14px;
  --font-size-caption: 12px;
  --font-size-h3: 28px;
  --line-height-body: 1.5;
  
  /* Spacing */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  
  /* Shadows */
  --shadow-1: 0px 1px 2px rgba(0,0,0,0.05);
  --shadow-2: 0px 2px 4px rgba(0,0,0,0.08);
  --shadow-3: 0px 4px 8px rgba(0,0,0,0.10);
  
  /* Border Radius */
  --radius-1: 4px;
  --radius-2: 8px;
}
```

---

## Accessibility Considerations

### Color Contrast Requirements
- All text must meet WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text)
- Verify: Primary text (#333333) on White (#FFFFFF) = 12.6:1 ✓
- Verify: Primary Blue (#0066CC) on White (#FFFFFF) = 8.1:1 ✓

### High Contrast Mode
- Provide outline/border definition in addition to color
- Ensure hover states are visible without color alone
- Test with Windows High Contrast mode

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Design Token Export

### For Developers
See `design-tokens.json` in the repository for programmatic access to all design tokens.

### For Designers
Import `Spike-Reno-Calculator-Theme.json` into Figma for design consistency.

---

## References

- Material Design 3: https://m3.material.io/
- MUI Documentation: https://mui.com/
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Accessible Colors: https://webaim.org/articles/contrast/

---

**Last Updated**: August 12, 2026  
**Next Review**: Before development sprint starts  
**Approval Status**: Ready for Handover
