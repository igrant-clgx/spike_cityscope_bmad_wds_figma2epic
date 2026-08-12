import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

const { colors, fontFamily, typography, radii, spacing, shadows, motion, inputErrorGlow, minTarget, focusRingWidth } = tokens;

/**
 * Authoritative MUI theme assembled from the raw design tokens.
 *
 * Only `tokens.ts` holds literals; this file maps them into MUI's shape:
 * palette, typography ramp (incl. the custom `cost-display` variant), shape
 * radii, an 8px spacing base, the named `layout` token extension, and the
 * elevation shadows. Every later story reads brand values from here.
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      // MUI uses `.dark` for the hover state of primary surfaces, so map it to
      // the DESIGN hover token. The pressed/active token (primaryActive) is read
      // from `tokens.ts` by the selection-button component overrides in later stories.
      dark: colors.primaryHover,
      contrastText: colors.onPrimary,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textHint,
    },
    background: {
      default: colors.canvas,
      paper: colors.surface,
    },
    success: { main: colors.success },
    error: { main: colors.error },
    warning: { main: colors.warning },
    info: { main: colors.info },
    divider: colors.border,
  },
  typography: {
    // next/font/google generates a hashed family name exposed via the
    // `--font-roboto` CSS variable (set on <html>), so reference it first; the
    // literal "Roboto"/Helvetica/Arial stack is the graceful fallback.
    fontFamily: `var(--font-roboto), ${fontFamily}`,
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    h5: typography.h5,
    h6: typography.h6,
    body1: typography.body1,
    body2: typography.body2,
    caption: typography.caption,
    button: typography.button,
    'cost-display': typography.costDisplay,
  },
  shape: {
    borderRadius: radii.md,
  },
  spacing: spacing.base,
  layout: {
    contentMax: spacing.contentMax,
    headerH: spacing.headerH,
    stepGap: spacing.stepGap,
    cardPad: spacing.cardPad,
  },
  // Motion system (UX-DR19 / FR-34): map the brand durations/easing onto MUI's
  // transition slots so every animated component inherits them. Keep MUI's other
  // defaults (e.g. `shorter`, `shortest`, easing.easeOut/easeIn/sharp) intact.
  transitions: {
    duration: {
      short: motion.durMicro,
      standard: motion.durAccordion,
      complex: motion.durReveal,
    },
    easing: {
      easeInOut: motion.easingStandard,
    },
  },
  components: {
    // Belt-and-braces reduced-motion: collapse ALL animation/transition globally
    // (complements the JS `useReducedMotion` hook for JS-driven animation).
    MuiCssBaseline: {
      styleOverrides: {
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
    // A11y baseline (UX-DR18/20): visible primary focus-visible ring on every
    // interactive element; never remove the outline without replacing it.
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible, &:focus-visible': {
            outline: `${focusRingWidth}px solid ${colors.primary}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: minTarget,
          '&.Mui-focusVisible, &:focus-visible': {
            outline: `${focusRingWidth}px solid ${colors.primary}`,
            outlineOffset: 2,
          },
        },
      },
    },
    // Renovation-type / item selectors (Step 1–2). The Figma renders these as
    // title-case, primary-coloured outlined buttons — NOT MUI's default
    // uppercase grey. Kill the uppercase textTransform and colour the resting
    // (unselected) state with the primary token so it reads as an actionable
    // outlined control; the selected fill is applied per-control.
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: colors.primary,
          borderColor: colors.primary,
        },
      },
    },
    // Input-error treatment (UX-DR15): 2px error border + soft focus glow, driven
    // by the shared `Mui-error` state so `FormTextField` gets it for free.
    MuiInputBase: {
      styleOverrides: {
        root: {
          minHeight: minTarget,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: colors.error,
          },
          '&.Mui-error.Mui-focused': {
            boxShadow: inputErrorGlow,
          },
        },
      },
    },
  },
});

// Replace the whole MUI shadow scale with the brand elevations so NO shadow
// exceeds 0.15 opacity (MUI's defaults reach 0.2). Only three elevations exist
// in the brand: [1]=accordion, [2]=result card, [3]=snackbar. Higher indices
// are unused by this design and collapse to the deepest allowed (snackbar).
theme.shadows = theme.shadows.map((_, index) => {
  if (index === 0) return 'none';
  if (index === 1) return shadows.accordion;
  if (index === 2) return shadows.result;
  return shadows.snackbar;
}) as typeof theme.shadows;
