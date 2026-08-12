import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

const { colors, fontFamily, typography, radii, spacing, shadows } = tokens;

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
