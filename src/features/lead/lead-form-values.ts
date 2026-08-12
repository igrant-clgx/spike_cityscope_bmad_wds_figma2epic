import { isAuEmail, isAuPhone } from '@shared/schemas';
import type { LeadCaptureRequest } from '@shared/schemas';
import {
  FIRST_NAME_ERROR,
  LAST_NAME_ERROR,
  EMAIL_ERROR,
  PHONE_ERROR,
  CONTACT_METHOD_ERROR,
  BEST_TIME_ERROR,
  CONSENT_ERROR,
  CONTACT_METHOD_OPTIONS,
  BEST_TIME_OPTIONS,
} from './lead-form-copy';

/**
 * The lead form's client value shape (Story 5.3). This mirrors the SHARED
 * `leadCaptureRequestSchema` (Story 5.1) field-for-field EXCEPT `estimateId`,
 * which is joined in by Story 5.4 at submit time — this presentational form
 * never owns it. `contactMethod`/`bestTime` carry an empty-string "unset"
 * sentinel so the `Select`/radio controls have a controlled initial value; the
 * pure validators below reject/allow those sentinels per the contract.
 */
export interface LeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: 'phone' | 'email' | '';
  bestTime: 'morning' | 'afternoon' | 'evening' | 'anytime' | '';
  consent: boolean;
}

/** Pristine defaults — every control starts empty/untouched (UX-DR20). */
export function leadFormDefaults(): LeadFormValues {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contactMethod: '',
    bestTime: '',
    consent: false,
  };
}

const CONTACT_METHOD_VALUES = new Set<string>(
  CONTACT_METHOD_OPTIONS.map((o) => o.value),
);
const BEST_TIME_VALUES = new Set<string>(BEST_TIME_OPTIONS.map((o) => o.value));

/** A trimmed name is valid when it is 2–100 characters (mirrors the schema). */
function isValidName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * PURE per-field validation — the SINGLE source of the lead form's error
 * decisions (retro guidance: all decisions in node-testable pure functions).
 * Reuses the Story 5.1 `isAuEmail`/`isAuPhone` validators and mirrors
 * `leadCaptureRequestSchema` exactly. Returns ONLY the fields that have an
 * error, so an empty object means "all rules pass". `bestTime` is optional: an
 * empty sentinel is fine; only a NON-EMPTY invalid value is rejected. Reports
 * errors regardless of touched-state — the touched gating is the component's
 * concern.
 */
export function leadFormFieldErrors(
  values: LeadFormValues,
): Partial<Record<keyof LeadFormValues, string>> {
  const errors: Partial<Record<keyof LeadFormValues, string>> = {};

  if (!isValidName(values.firstName)) errors.firstName = FIRST_NAME_ERROR;
  if (!isValidName(values.lastName)) errors.lastName = LAST_NAME_ERROR;
  if (!isAuEmail(values.email)) errors.email = EMAIL_ERROR;
  if (!isAuPhone(values.phone)) errors.phone = PHONE_ERROR;
  if (!CONTACT_METHOD_VALUES.has(values.contactMethod)) {
    errors.contactMethod = CONTACT_METHOD_ERROR;
  }
  if (values.bestTime !== '' && !BEST_TIME_VALUES.has(values.bestTime)) {
    errors.bestTime = BEST_TIME_ERROR;
  }
  if (values.consent !== true) errors.consent = CONSENT_ERROR;

  return errors;
}

/**
 * PURE submit-gate (FR-30): submittable iff there are NO field errors — every
 * required field valid AND consent literally true. Mirrors
 * `leadCaptureRequestSchema` so the client gate and the server re-parse agree.
 */
export function isLeadFormSubmittable(values: LeadFormValues): boolean {
  return Object.keys(leadFormFieldErrors(values)).length === 0;
}

/**
 * The schema-ready lead fields the form emits on a valid submit — the shared
 * `LeadCaptureRequest` MINUS `estimateId` (Story 5.4 joins the current estimate
 * id in before it re-parses and sends). Distinct from `LeadFormValues` because
 * this shape has NO empty-string sentinels: `contactMethod` is a real enum and
 * `bestTime` is OMITTED (not `''`) when unset.
 */
export type LeadRequestFields = Omit<LeadCaptureRequest, 'estimateId'>;

/**
 * PURE form-values → schema-ready-fields adapter. Returns `null` when the form
 * is not submittable (defense in depth behind the disabled submit), else the
 * `LeadRequestFields` with the `bestTime: ''` sentinel normalized to OMITTED so
 * the payload agrees with `leadCaptureRequestSchema` (whose `bestTime` is
 * `.optional()` — it accepts `undefined`/absent, NOT `''`). This closes the
 * client-gate vs server-schema drift on the unset-best-time happy path.
 */
export function toLeadRequestFields(
  values: LeadFormValues,
): LeadRequestFields | null {
  if (!isLeadFormSubmittable(values)) return null;

  const base = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    contactMethod: values.contactMethod as 'phone' | 'email',
    consent: true as const,
  };

  return values.bestTime === ''
    ? base
    : { ...base, bestTime: values.bestTime };
}
