import type {
  LeadCapture,
  LeadReceipt,
  LeadSink,
} from "@server/domain/ports/lead-sink";

/**
 * Deterministic stub `LeadSink` (AD-2, AD-10). Server-only: the browser never
 * touches it — PII crosses the BFF only (AD-1, NFR-6) and this in-memory store is
 * instantiated inside the route, never exposed to the client bundle.
 *
 * Consent gate (AD-10): `capture` REJECTS any lead lacking a truthy `consent`
 * by throwing — defense in depth behind the future UI consent gate (FR-30). A
 * stored record is explicitly MARKED for encryption at rest and the 24-month
 * retention policy (AD-10, NFR-6), the seam the downstream CRM connector (OI-11)
 * later honours.
 *
 * Fully deterministic — no `Math.random`, no `Date`. A process-level monotonic
 * counter disambiguates otherwise-identical payloads across SEPARATE requests
 * (the route builds a fresh sink per POST, so a per-instance counter would reset
 * to the same seed every time and collide identical resubmits). No raw PII is
 * ever logged: any log line masks the phone to its last 3 digits.
 *
 * OI-11 [OPEN]: no real CRM in the spike — leads write to this stub store only.
 */

/** [ASSUMPTION] Retention window for a stored lead in months (AD-10, NFR-6). */
const RETENTION_MONTHS = 24;

/**
 * Process-level monotonic sequence. Deliberately module-scoped (NOT per sink
 * instance) so identical payloads submitted across separate POSTs — each of
 * which constructs a fresh sink — still receive distinct `leadId`s.
 */
let leadSeq = 0;

/**
 * An internal stored lead record: the captured lead plus the AD-10 privacy
 * markings. Kept INTERNAL to this module (never returned to the client) so PII
 * cannot leak past the BFF.
 */
export interface StoredLeadRecord {
  lead: LeadCapture;
  encryptAtRest: true;
  retentionMonths: number;
  leadId: string;
}

/**
 * FNV-1a 32-bit hash — no crypto dependency, deterministic across runs. The
 * offset-basis seed is a parameter so two independent lanes can be combined into
 * a wider digest (mirror of the estimate stub).
 */
function fnv1a(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Stable 64-bit id over the lead's identifying fields plus a monotonic sequence
 * (so two identical payloads still get distinct ids without Date/random). Two
 * independent FNV-1a lanes (distinct offset basis, one over the reversed string)
 * widen the digest from 32 to 64 bits.
 */
function leadIdFor(lead: LeadCapture, seq: number): string {
  const canonical = `${lead.estimateId}|${lead.email}|${lead.phone}|${seq}`;
  const lane1 = fnv1a(canonical, 0x811c9dc5);
  const lane2 = fnv1a([...canonical].reverse().join(""), 0x84222325);
  return `lead_${lane1.toString(16).padStart(8, "0")}${lane2.toString(16).padStart(8, "0")}`;
}

/** Mask a phone to its last 3 digits for any log line (NFR-6 — never log raw PII). */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Never reveal a short/degenerate number in full — fully mask under 4 digits.
  if (digits.length < 4) return "***";
  return `***${digits.slice(-3)}`;
}

/**
 * A stub `LeadSink` bundled with a test-only `peek()` reader over its internal
 * store. `peek()` stays server-side (this module is never imported by the client
 * bundle); it exists so the adapter test can assert the AD-10 markings WITHOUT
 * leaking PII to the client.
 */
export interface StubLeadSink extends LeadSink {
  /** Server/test-only view of the stored records (never exposed to the client). */
  peek(): readonly StoredLeadRecord[];
}

export function createStubLeadSink(): StubLeadSink {
  const store: StoredLeadRecord[] = [];

  return {
    capture(lead: LeadCapture): Promise<LeadReceipt> {
      // Consent gate (AD-10): reject a consent-less capture — defense in depth.
      if (!lead.consent) {
        return Promise.reject(new Error("Lead capture requires explicit consent."));
      }

      leadSeq += 1;
      const leadId = leadIdFor(lead, leadSeq);
      // AD-10: mark the stored record for encryption at rest + 24-month retention.
      store.push({
        lead,
        encryptAtRest: true,
        retentionMonths: RETENTION_MONTHS,
        leadId,
      });

      return Promise.resolve({ leadId });
    },
    peek(): readonly StoredLeadRecord[] {
      return store;
    },
  };
}
