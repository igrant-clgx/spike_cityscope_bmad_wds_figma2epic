import type { PropertyQuestion } from '@shared/schemas';

/**
 * Pure per-field validator (FR-17, OI-2 generic). No react, no MUI.
 *
 * Returns a human-readable error message, or `null` when the value is valid.
 * The `kind` switch is type-exhaustive over the discriminated union (a `never`
 * default) so a new field kind fails to compile rather than silently pass
 * (UX-DR8). The rules are GENERIC required/bounds/length/date/budget rules read
 * from the config metadata — the final Step 3 rules are `[OPEN]` (OI-2).
 */

const REQUIRED_MESSAGE = 'This field is required.';
const BUDGET_ORDER_MESSAGE = 'Minimum must be at most the maximum.';
const BUDGET_PARTIAL_MESSAGE = 'Enter both a minimum and a maximum.';
const INVALID_OPTION_MESSAGE = 'Choose a valid option.';
const INVALID_DATE_MESSAGE = 'Enter a valid date.';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

function isBudget(value: unknown): value is { min: number; max: number } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'min' in value &&
    'max' in value
  );
}

export function validateAnswer(
  question: PropertyQuestion,
  value: unknown,
): string | null {
  switch (question.kind) {
    case 'radio':
    case 'select': {
      if (isEmpty(value)) {
        return question.required ? REQUIRED_MESSAGE : null;
      }
      const allowed = question.options.map((o) => o.value);
      if (typeof value !== 'string' || !allowed.includes(value)) {
        return INVALID_OPTION_MESSAGE;
      }
      return null;
    }
    case 'text': {
      if (isEmpty(value)) {
        return question.required ? REQUIRED_MESSAGE : null;
      }
      if (
        question.maxLength !== undefined &&
        typeof value === 'string' &&
        value.length > question.maxLength
      ) {
        return `Use ${question.maxLength} characters or fewer.`;
      }
      return null;
    }
    case 'numeric':
    case 'slider': {
      if (isEmpty(value)) {
        return question.required ? REQUIRED_MESSAGE : null;
      }
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return 'Enter a number.';
      }
      if (question.min !== undefined && value < question.min) {
        return `Enter ${question.min} or more.`;
      }
      if (question.max !== undefined && value > question.max) {
        return `Enter ${question.max} or less.`;
      }
      return null;
    }
    case 'date': {
      if (isEmpty(value)) {
        return question.required ? REQUIRED_MESSAGE : null;
      }
      if (typeof value !== 'string') {
        return INVALID_DATE_MESSAGE;
      }
      if (!ISO_DATE_RE.test(value) || Number.isNaN(Date.parse(value))) {
        return INVALID_DATE_MESSAGE;
      }
      if (question.minIso !== undefined && value < question.minIso) {
        return `Enter a date on or after ${question.minIso}.`;
      }
      if (question.maxIso !== undefined && value > question.maxIso) {
        return `Enter a date on or before ${question.maxIso}.`;
      }
      return null;
    }
    case 'budget': {
      if (isEmpty(value) || !isBudget(value)) {
        return question.required ? REQUIRED_MESSAGE : null;
      }
      const { min, max } = value;
      const minIsNumber = typeof min === 'number' && !Number.isNaN(min);
      const maxIsNumber = typeof max === 'number' && !Number.isNaN(max);
      if (!minIsNumber && !maxIsNumber) {
        return question.required ? REQUIRED_MESSAGE : null;
      }
      if (minIsNumber !== maxIsNumber) {
        return BUDGET_PARTIAL_MESSAGE;
      }
      if (min < question.min || max < question.min) {
        return `Enter ${question.min} or more.`;
      }
      if (min > question.max || max > question.max) {
        return `Enter ${question.max} or less.`;
      }
      if (min > max) {
        return BUDGET_ORDER_MESSAGE;
      }
      return null;
    }
    default: {
      const _exhaustive: never = question;
      return _exhaustive;
    }
  }
}
