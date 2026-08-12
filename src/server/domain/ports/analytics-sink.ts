/**
 * AnalyticsSink port (AD-12). A first-party typed event seam. Events NEVER
 * carry PII (no name, email, phone, or full address).
 *
 * The concrete no-op/first-party adapter lives in
 * `src/server/adapters/analytics/`. No external I/O here.
 */
export type AnalyticsEventName =
  | "step_viewed"
  | "step_completed"
  | "estimate_generated"
  | "lead_submitted"
  | "drop_off";

/** Fields shared by every event variant. Non-PII only. */
interface AnalyticsEventBase {
  requestId?: string;
  occurredAt?: string;
}

export interface StepViewedEvent extends AnalyticsEventBase {
  name: "step_viewed";
  stepId: string;
  stepIndex: number;
}

export interface StepCompletedEvent extends AnalyticsEventBase {
  name: "step_completed";
  stepId: string;
  stepIndex: number;
}

export interface DropOffEvent extends AnalyticsEventBase {
  name: "drop_off";
  stepId: string;
  stepIndex: number;
}

export interface EstimateGeneratedEvent extends AnalyticsEventBase {
  name: "estimate_generated";
  estimateId: string;
  rangeLowCents?: number;
  rangeHighCents?: number;
}

export interface LeadSubmittedEvent extends AnalyticsEventBase {
  name: "lead_submitted";
  leadId: string;
  /** A CATEGORY, never a PII value (no phone number / email string). */
  contactMethod?: "phone" | "email" | "callback";
}

/** Discriminated union keyed by `name`, carrying only non-PII fields. */
export type AnalyticsEvent =
  | StepViewedEvent
  | StepCompletedEvent
  | DropOffEvent
  | EstimateGeneratedEvent
  | LeadSubmittedEvent;

export interface AnalyticsSink {
  track(event: AnalyticsEvent): Promise<void>;
}

/**
 * Keys that would represent PII and must NEVER appear on an analytics event.
 */
export type ForbiddenPIIKey =
  | "name"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "address"
  | "fullAddress"
  | "postcode"
  | "ssn"
  | "dob";

/**
 * Compile-time PII guard. Resolves to `T` when `T` carries no forbidden PII
 * key, otherwise resolves to `never` — so a type-level assertion against it
 * fails to compile the moment a PII key is introduced.
 *
 * The `name` discriminant is excluded from the scan: it is a fixed event-name
 * literal union (never a person's name), yet it collides with the forbidden
 * `name` PII key. Every other key — including `firstName`/`lastName` — is
 * still checked.
 */
export type AssertNoPII<T> = Extract<
  keyof Omit<T, "name">,
  ForbiddenPIIKey
> extends never
  ? T
  : never;

// Private type-level assertions: each union member must be PII-free. If a PII
// key is ever added to a variant, `AssertNoPII<...>` collapses to `never`,
// `_NotNever<...>` becomes `false`, and `_Assert<false>` fails to compile.
type _NotNever<T> = [T] extends [never] ? false : true;
type _Assert<T extends true> = T;

type _PIIChecks = [
  _Assert<_NotNever<AssertNoPII<StepViewedEvent>>>,
  _Assert<_NotNever<AssertNoPII<StepCompletedEvent>>>,
  _Assert<_NotNever<AssertNoPII<DropOffEvent>>>,
  _Assert<_NotNever<AssertNoPII<EstimateGeneratedEvent>>>,
  _Assert<_NotNever<AssertNoPII<LeadSubmittedEvent>>>,
];

/**
 * Runtime companion to `ForbiddenPIIKey` for the adapter's dev-only guard.
 */
export const FORBIDDEN_PII_KEYS = [
  "name",
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "fullAddress",
  "postcode",
  "ssn",
  "dob",
] as const satisfies readonly ForbiddenPIIKey[];
