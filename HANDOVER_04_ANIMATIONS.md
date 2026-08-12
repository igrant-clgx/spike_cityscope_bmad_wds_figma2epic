# Spike Reno Calculator - Interaction & Animation Specifications

**Document Version**: 1.0  
**Date**: August 12, 2026  
**Status**: Ready for Development  
**Framework**: React with Material-UI v5+

---

## Table of Contents

1. [Animation Philosophy](#animation-philosophy)
2. [Timing & Easing](#timing--easing)
3. [Accordion Interactions](#accordion-interactions)
4. [Form Submission Flow](#form-submission-flow)
5. [Validation & Error Feedback](#validation--error-feedback)
6. [Loading States](#loading-states)
7. [Transitions & Page Navigation](#transitions--page-navigation)
8. [Accessibility Considerations](#accessibility-considerations)

---

## Animation Philosophy

### Principles

1. **Purpose-Driven**: Every animation has a clear purpose (feedback, guidance, delight)
2. **Fast & Snappy**: Animations feel responsive (not sluggish or frenetic)
3. **Accessible**: Respect user preferences for reduced motion
4. **Subtle**: Enhance experience without distraction
5. **Consistent**: Same interaction type always behaves the same way

### When NOT to Animate
- Decorative elements that don't aid comprehension
- Actions under 200ms duration (feels instant)
- Page loads (use skeleton loaders instead)
- Disabled state changes

### When to Animate
- Accordion expand/collapse (shows connection between header and content)
- Error messages appearing (draws attention)
- Button hover (feedback)
- Cost calculation transitions (indicates processing)
- Page transitions (provides context)

---

## Timing & Easing

### Animation Duration Standards

```
Micro interactions (hover, focus):    100ms - 150ms
Form interactions (expand, submit):   200ms - 300ms
Page transitions (navigation):         300ms - 500ms
Loading sequences:                     Variable (2-8 seconds)
Dismissed notifications:               300ms - 500ms
```

### Easing Functions

```css
/* Standard easing for most animations */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Quick response, gentle deceleration */
ease-out: cubic-bezier(0.0, 0, 0.2, 1);

/* Entrance animations */
ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Elastic/bouncy (use sparingly) */
cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### CSS Transition Helpers

```css
/* Smooth color transitions */
.transition-color {
  transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1),
              background-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth shadow transitions */
.transition-shadow {
  transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth transform transitions */
.transition-transform {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Smooth size transitions */
.transition-size {
  transition: width 200ms cubic-bezier(0.4, 0, 0.2, 1),
              height 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Reduced Motion Preference

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Implementation in React**:
```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const transitionDuration = prefersReducedMotion ? 0 : 200; // milliseconds
```

---

## Accordion Interactions

### Collapse to Expand

**Duration**: 300ms  
**Easing**: cubic-bezier(0.4, 0, 0.2, 1)

**Sequence**:
1. User clicks accordion header
2. Header background changes (50ms instant)
3. Expand icon rotates 180° (300ms)
4. Content height animates from 0 to auto (300ms)
5. Content opacity fades in (300ms, starts at 50ms)

**CSS Implementation**:
```css
/* Header background color transition */
.accordion-header {
  background-color: #F5F5F5;
  transition: background-color 50ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-header.expanded {
  background-color: #FFFFFF;
}

/* Expand icon rotation */
.expand-icon {
  transform: rotate(0deg);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Content height and opacity */
.accordion-details {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 50ms;
}

.accordion-details.expanded {
  max-height: 1000px; /* Large enough for content */
  opacity: 1;
}
```

**React/MUI Implementation**:
```jsx
<Accordion
  expanded={expanded}
  onChange={() => setExpanded(!expanded)}
  sx={{
    '& .MuiAccordionSummary-root': {
      transition: 'background-color 50ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: expanded ? '#FFFFFF' : '#F5F5F5',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '& .MuiCollapse-root': {
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  }}
>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6">Step 1: Renovation Type</Typography>
  </AccordionSummary>
  
  <AccordionDetails sx={{ 
    opacity: expanded ? 1 : 0,
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 50ms'
  }}>
    {/* Content */}
  </AccordionDetails>
</Accordion>
```

### Expand to Collapse

**Reverse sequence**: Same timing, animations play backwards
- Icon rotates back to 0°
- Content height collapses to 0
- Content opacity fades out

---

## Form Submission Flow

### Before Submission

**User Input**:
```
User fills form and clicks [Get Estimate]
│
▼ (100ms keyboard feedback)
Button enters "pressed" state:
- Background darkens
- Slight scale down (98%)
- Shadow increases
```

**Button Press Animation**:
```css
/* Default */
.button {
  background-color: #0066CC;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  transform: scale(1);
  transition: all 100ms ease-out;
}

/* Pressed */
.button:active {
  background-color: #003D7A;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
  transform: scale(0.98);
}
```

### During Submission

**Duration**: Variable (show after 500ms of processing)

**Sequence**:
1. Form inputs disabled (opacity 0.6)
2. Spinner appears over form (centered)
3. Text: "Calculating your estimate..."
4. Backdrop overlay (optional, semi-transparent)

**Spinner Animation**:
```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Form Opacity**:
```css
.form.loading {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 200ms ease-in-out;
}
```

### After Submission - Success

**Duration**: 500ms total

**Sequence**:
1. Spinner fades out (200ms)
2. Loading overlay fades out (200ms)
3. Page transitions to results (handled by router)
4. Results page content fades in (300ms)

**Page Transition**:
```jsx
import { Fade } from '@mui/material';

<Fade in={!loading} timeout={300}>
  <ResultsPage />
</Fade>
```

### After Submission - Error

**Duration**: 300ms + persistent error display

**Sequence**:
1. Loading spinner fades out (200ms)
2. Error message slides in from top (300ms)
3. Form remains enabled for correction
4. Focus moves to first error field

**Error Toast Animation**:
```css
.error-toast {
  animation: slideInDown 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## Validation & Error Feedback

### Real-Time Validation (as user types)

**Timing**: 200ms debounce after user stops typing

**Process**:
```
User types → Input triggers onChange → Debounce 200ms → Validate
│
├─ If valid:
│  ├─ Error cleared (fade out 150ms)
│  └─ Success indicator appears (green checkmark, fade in 150ms)
│
└─ If invalid:
   ├─ Error message appears (slide down 200ms)
   └─ Input border turns red with shadow
```

**Validation Icon Animation**:
```css
/* Checkmark appears */
.validation-icon.success {
  animation: scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Error icon appears */
.validation-icon.error {
  animation: shake 300ms cubic-bezier(0.36, 0, 0.66, -0.56);
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
```

### Form Submission Validation

**If form is invalid on submit**:
```
1. Shake animation on form container (300ms)
2. Scroll to first invalid field (smooth scroll 500ms)
3. Focus on first invalid field
4. Show all validation errors simultaneously
5. Toast at top: "Please fix errors below" (300ms fade-in)
```

**Shake Animation**:
```css
@keyframes formShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-15px); }
  75% { transform: translateX(15px); }
}
```

### Error Message Transitions

**Error appearing**:
```css
.error-message {
  animation: slideDown 200ms cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 0;
  overflow: hidden;
}

.error-message.show {
  max-height: 100px;
}

@keyframes slideDown {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

**Error disappearing**:
```css
.error-message.hide {
  animation: slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-10px);
    opacity: 0;
  }
}
```

---

## Loading States

### Initial Form Load

**If data needs to be fetched** (e.g., address autocomplete):

```
1. Show skeleton/placeholder components
2. Subtle fade-in animation (300ms) when actual content loads
3. No jarring layout shifts
```

**Skeleton Animation** (optional subtle pulse):
```css
.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
```

### Cost Calculation Loading

**Duration**: While calculating estimate

```
Spinner appears with: "Calculating your estimate..."
Progress bar (optional): Shows 0-100% completion
Estimated time: "Should take about 3 seconds..."
```

**Animation**:
```jsx
const [loading, setLoading] = useState(false);
const [progress, setProgress] = useState(0);

useEffect(() => {
  if (!loading) return;
  
  const interval = setInterval(() => {
    setProgress(prev => Math.min(prev + Math.random() * 30, 95));
  }, 300);
  
  return () => clearInterval(interval);
}, [loading]);
```

### Results Page Loading

**After form submission, before results display**:

```
1. Form fades out (200ms)
2. Spinner appears (centered)
3. When results ready:
   - Spinner fades out (200ms)
   - Results fade in (300ms)
```

---

## Transitions & Page Navigation

### Form to Results

**Trigger**: Successful form submission  
**Duration**: 500ms total

**Animation Sequence**:
```
Step 1: Form content opacity → 0 (200ms, ease-in)
Step 2: Spinner appears (100ms fade-in)
Step 3: Results content opacity → 1 (300ms, ease-out, starts at 200ms)
```

**Implementation**:
```jsx
import { useNavigate } from 'react-router-dom';
import { Fade } from '@mui/material';

function FormPage() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleSubmit = async (data) => {
    setIsTransitioning(true);
    const results = await calculateEstimate(data);
    
    // Fade out form
    setTimeout(() => {
      navigate('/results', { state: { results } });
    }, 200);
  };
  
  return (
    <Fade in={!isTransitioning} timeout={200}>
      <Form onSubmit={handleSubmit} />
    </Fade>
  );
}
```

### Results to Form (Edit)

**Trigger**: Click [Edit Estimate]  
**Duration**: 300ms

```
Step 1: Results page fades out (200ms)
Step 2: Form page fades in (300ms)
Step 3: Form scrolls to Step 1 (smooth scroll 500ms)
```

### Results to Form (New)

**Trigger**: Click [New Estimate]  
**Duration**: 300ms

```
Same as Edit, but form is empty
```

### Address Change Modal

**Opening**:
```
Modal slides in from bottom (300ms) or fades in (200ms)
Backdrop fades in simultaneously (200ms)
```

**Closing**:
```
Modal slides out to bottom (200ms)
Backdrop fades out (200ms)
Focus returns to previous element
```

---

## Button Interactions

### Hover State

**Duration**: 100ms

```
Button:
- Background color changes
- Box shadow increases
- Slight scale up (101%)
```

**Implementation**:
```css
.button {
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  background-color: #0052A3;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
  transform: scale(1.01);
}
```

### Focus State

**Duration**: Instant (just visible outline)

```
Focus outline: 2px solid #0066CC
Outline offset: 2px
Transition: None (appears instantly)
```

### Active/Pressed State

**Duration**: 50ms (instant feedback)

```
Background darker: #003D7A
Shadow less prominent (pushed down feel)
Scale slight down: 0.98
```

### Selection Button State Change

**When toggling Internal/External**:

```
Duration: 200ms

From unselected to selected:
1. Background color changes gray → blue (150ms)
2. Text color changes dark → white (150ms)
3. Border color changes light → dark blue (150ms)
4. Checkmark fades in (200ms)
5. Shadow appears (200ms)

From selected to unselected:
(Reverse animation)
```

---

## Toast/Notification Animations

### Success Toast

**Duration**: Auto-dismiss after 3 seconds

```
Enter: Slide up from bottom (300ms)
Exit: Slide down (200ms)
```

**CSS**:
```css
.toast.enter {
  animation: slideInUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.toast.exit {
  animation: slideOutDown 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
```

### Error Toast

**Duration**: Stays visible (manual dismiss or 5 seconds)

```
Enter: Slide in from top (300ms)
Exit: Slide out up (200ms)
```

---

## Summary: Transition Timeline Example

### Complete Form Submission Flow (from start to results)

```
T=0ms    User clicks "Get Estimate"
T=0ms    Button press animation (scale 0.98, 100ms)
T=50ms   Button color darkens (darker blue)
T=100ms  Button returns to normal scale
         Form validation runs
T=100ms  If invalid: shake animation + errors appear
T=100ms  If valid: Continue...
T=100ms  Form opacity → 0.6, inputs disabled
T=100ms  Spinner appears (fade in 100ms)
T=200ms  Text: "Calculating your estimate..."
T=500ms  (Backend processing) 
T=2500ms Results ready
T=2700ms Spinner fades out (200ms)
T=2900ms Page transition (fade out form 200ms)
T=3200ms Results page fades in (300ms)
T=3500ms Results fully visible, animations complete
```

---

## Performance Considerations

### Hardware Acceleration

Use `transform` and `opacity` for animations (GPU-accelerated):

```css
/* Good: GPU accelerated */
.animate {
  animation: moveIn 300ms;
}

@keyframes moveIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Avoid: Not GPU accelerated */
.animate {
  animation: moveIn 300ms;
}

@keyframes moveIn {
  from { left: -100%; opacity: 0; }
  to { left: 0; opacity: 1; }
}
```

### Will-change CSS

```css
.accordion-details {
  will-change: max-height, opacity;
  transition: max-height 300ms, opacity 300ms;
}
```

### Throttling & Debouncing

For scroll and resize events:
```jsx
import { useDebouncedCallback } from 'use-debounce';

const handleScroll = useDebouncedCallback(() => {
  // Scroll handling logic
}, 200);
```

---

**Last Updated**: August 12, 2026  
**Next Review**: Before development sprint starts  
**Approval Status**: Ready for Handover
