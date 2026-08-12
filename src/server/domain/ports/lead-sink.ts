/**
 * LeadSink port (AD-2, AD-10). Persists a consented lead against a valid
 * estimateId (defense in depth behind the UI consent gate).
 *
 * Interface only at scaffold time — the concrete adapter (store → CRM, OI-11)
 * is wired in a later story. No external I/O here.
 */
export interface LeadSink {
  capture(lead: LeadCapture): Promise<LeadReceipt>;
}

/**
 * The full lead payload captured against a valid estimate (FR-27). This is a
 * PLAIN-TS MIRROR of `leadCaptureRequestSchema` in
 * `src/shared/schemas/lead.ts` — the shared zod schema is the single source of
 * the lead contract (AD-4); keeping zod OUT of the domain preserves layer purity
 * (asserted by `src/server/architecture.test.ts`).
 *
 * PII (NFR-6, AD-1, AD-10): every field except `estimateId`/`consent`/vocab is
 * personally identifying and crosses the BFF only — never a `NEXT_PUBLIC_*` var,
 * query string, or unmasked log line.
 */
export interface LeadCapture {
  estimateId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: LeadContactMethod;
  bestTime?: LeadBestTime;
  consent: boolean;
}

/** Preferred contact channel (FR-27). [ASSUMPTION] vocab pending OI-10 resolution. */
export type LeadContactMethod = "phone" | "email";

/** Preferred contact time window (FR-27). [ASSUMPTION] vocab pending OI-10 resolution. */
export type LeadBestTime = "morning" | "afternoon" | "evening" | "anytime";

export interface LeadReceipt {
  leadId: string;
}
