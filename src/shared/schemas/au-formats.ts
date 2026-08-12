/**
 * Pure Australian format validators (FR-28, NFR-10). Zod-free string predicates
 * so they are reusable by BOTH the shared lead schema (Story 5.1) and the client
 * form (Story 5.3) without dragging any framework into the check. Deterministic,
 * side-effect-free, and exhaustively unit-tested (`au-formats.test.ts`).
 */

/**
 * RFC-ish email validity. Intentionally conservative: one `@`, a dot-labelled
 * local part and domain (no leading/trailing/consecutive dots on either side),
 * and a domain ending in a 2+ alpha TLD. Rejects empty/whitespace, missing `@`,
 * missing TLD, internal spaces, and malformed dot placement.
 */
export function isAuEmail(value: string): boolean {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (email.length === 0 || email.length > 254) return false;
  return /^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)*\.[a-zA-Z]{2,}$/.test(email);
}

/**
 * Australian phone validity — accepts a mobile (`04xx xxx xxx`) or a landline
 * (`0[2378] xxxx xxxx`), with common separators (spaces, dashes, dots, and
 * parentheses), and the `+61` international form (the leading `0` dropped after
 * `+61`). Rejects wrong length, letters, empty/whitespace, and an invalid
 * area/prefix digit.
 *
 * Normalises to national `0`-prefixed digits, then matches:
 *   - mobile:   `04` + 8 digits
 *   - landline: `0[2378]` + 8 digits
 */
export function isAuPhone(value: string): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;

  // Allowed characters only: digits, common separators, and a single leading '+'.
  if (!/^\+?[\d ().-]+$/.test(trimmed)) return false;

  const compact = trimmed.replace(/[\s().-]/g, "");

  let national: string;
  if (compact.startsWith("+61")) {
    // International form: '+61' then the national number WITHOUT its leading 0.
    national = `0${compact.slice(3)}`;
  } else if (compact.startsWith("0")) {
    national = compact;
  } else {
    return false;
  }

  // Exactly 10 national digits, all numeric.
  if (!/^\d{10}$/.test(national)) return false;

  // Mobile 04xxxxxxxx or landline 0[2378]xxxxxxxx.
  return /^0(4|[2378])\d{8}$/.test(national);
}
