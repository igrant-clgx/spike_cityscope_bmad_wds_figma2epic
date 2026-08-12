'use client';

import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Motion helpers (UX-DR19 / FR-34).
 *
 * `useReducedMotion` wraps MUI's `useMediaQuery` for the OS-level
 * `prefers-reduced-motion: reduce` setting (belt-and-braces with the global
 * `MuiCssBaseline` collapse rule for JS-driven animation). Under static markup
 * it returns the SSR default (`false`), which is acceptable for structural tests.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** Resolve a duration in ms, collapsing to 0 when motion is reduced. */
export function resolveDuration(ms: number, reduced: boolean): number {
  if (reduced) return 0;
  return Number.isFinite(ms) ? Math.max(0, ms) : 0;
}
