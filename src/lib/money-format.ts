/**
 * View-edge AUD money formatting (AD-7, NFR-10). The ONLY place integer AUD
 * cents are converted to a display string. Never construct money via
 * floating-point dollars — dollars are computed as `Math.round(cents / 100)` and
 * grouped by a thousands separator with NO fractional cents shown.
 *
 * Kept in `src/lib` (the view edge), NOT the domain: the domain and adapter
 * carry integer cents only.
 */

const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/**
 * Format integer AUD cents as e.g. `formatAud(3270000)` → `"$32,700"`.
 * A non-finite input (`NaN`/`Infinity`) renders the zero-format `"$0"`. A
 * negative value renders with a leading minus, e.g. `formatAud(-5000)` → `"-$50"`.
 */
export function formatAud(cents: number): string {
  if (!Number.isFinite(cents)) return AUD.format(0);
  const dollars = Math.round(cents / 100);
  return AUD.format(dollars);
}

/**
 * Format an integer AUD-cents range as e.g. `"$15,000 – $32,700"` (en-dash).
 * The bounds are ordered (min..max) so an inverted range never renders backwards.
 */
export function formatAudRange(minCents: number, maxCents: number): string {
  const lo = Math.min(minCents, maxCents);
  const hi = Math.max(minCents, maxCents);
  return `${formatAud(lo)} – ${formatAud(hi)}`;
}
