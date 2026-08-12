/**
 * Raw design tokens — the single source of truth for the brand layer.
 *
 * This is the ONLY file in the app permitted to contain hex colour and px
 * literals. Values are grounded in the ACTUAL Figma pixels (frame 9:2), pulled
 * via Figma MCP and recorded in
 * `_bmad-output/C-UX-Scenarios/_figma-imports/figma-design-observations.md`.
 * Where the earlier DESIGN.md handover doc disagreed with the Figma, the pixels
 * win (see that ledger's Pixels-vs-Doc Conflicts table). `theme.ts` maps these
 * tokens into MUI's shape; every other module must read design values from the
 * theme, never re-declare literals.
 */

export const colors = {
  headerBg: '#2C2C2C',
  canvas: '#EDF1F3', // Figma canvas: light blue-grey (observed; exact hex OI-F1)
  surface: '#FFFFFF',
  textPrimary: '#110B1C', // Figma "Ebony" (rendered at 80% over surface)
  textSecondary: '#666666',
  textHint: '#999999',
  primary: '#432A6E', // Figma "Jacarta" / color/violet/30 — outlined selection buttons
  primaryHover: '#37225A',
  primaryActive: '#2C1B48',
  onPrimary: '#FFFFFF',
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  border: '#E0E0E0',
  disabled: '#CCCCCC',
} as const;

/**
 * Font families (Figma frame 9:2). Headings use "Poppins" (font-1); body, UI
 * labels and buttons use "Source Sans Pro" (font-2, shipped as `Source Sans 3`
 * via next/font). Each references the next/font CSS variable first (set in
 * app/layout.tsx) with a graceful web-safe fallback stack.
 */
export const fontFamily = '"Source Sans 3","Source Sans Pro","Helvetica","Arial",sans-serif';
export const headingFontFamily = '"Poppins","Helvetica","Arial",sans-serif';

/**
 * Typography ramp. Sizes/weights/line-heights/letter-spacing exactly per
 * DESIGN.md. `cost-display` is the custom brand variant (estimate figure only).
 */
export const typography = {
  h1: { fontSize: 48, fontWeight: 700, lineHeight: 1.167, letterSpacing: -0.5 },
  h2: { fontSize: 40, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.3 },
  h3: { fontSize: 28, fontWeight: 700, lineHeight: 1.4 },
  h4: { fontSize: 22, fontWeight: 600, lineHeight: 1.45 },
  h5: { fontSize: 18, fontWeight: 600, lineHeight: 1.5 },
  h6: { fontSize: 16, fontWeight: 600, lineHeight: 1.5, letterSpacing: 0.5 },
  body1: { fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0.25 },
  body2: { fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0.25 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.33, letterSpacing: 0.4 },
  button: { fontSize: 14, fontWeight: 500, lineHeight: 1.75, letterSpacing: 0.4 },
  costDisplay: { fontSize: 56, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1 },
} as const;

/** Corner radii. Figma: selection buttons 4px, accordion papers/cards 16px. */
export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

/** 8px spacing base + named layout tokens (unitless px values). */
export const spacing = {
  base: 8,
  stepGap: 24,
  cardPad: 24,
  contentMax: 840,
  headerH: 68,
} as const;

/** Elevation shadows. No shadow exceeds 0.15 opacity. */
export const shadows = {
  accordion: '0px 2px 2px rgba(17,11,28,0.08)', // Figma paper elevation (exact)
  result: '0px 4px 8px rgba(0,0,0,0.10)',
  snackbar: '0px 2px 8px rgba(0,0,0,0.15)',
} as const;

/**
 * Motion system (UX-DR19 / FR-34). Durations in ms: micro interactions
 * 100–150ms (use 120), accordion ≈300ms, reveal 300–500ms (use 400). Standard
 * easing curve per DESIGN.md. `snackbarAutoHideMs` is the toast auto-dismiss
 * window (3–5s, default 4s). All motion collapses under prefers-reduced-motion.
 */
export const motion = {
  durMicro: 120,
  durAccordion: 300,
  durReveal: 400,
  easingStandard: 'cubic-bezier(0.4,0,0.2,1)',
  snackbarAutoHideMs: 4000,
} as const;

/**
 * Input-error + a11y-baseline literals (UX-DR15 / UX-DR18 / UX-DR20). The soft
 * error focus glow, the minimum 44px interactive target, and the focus-ring
 * width all live here as the single source of literals.
 */
export const inputErrorGlow = '0 0 0 3px rgba(220,53,69,0.10)';
export const minTarget = 44;
export const focusRingWidth = 2;

export const tokens = {
  colors,
  fontFamily,
  headingFontFamily,
  typography,
  radii,
  spacing,
  shadows,
  motion,
  inputErrorGlow,
  minTarget,
  focusRingWidth,
} as const;

export type Tokens = typeof tokens;
