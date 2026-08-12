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

export interface LeadCapture {
  estimateId: string;
  consent: boolean;
}

export interface LeadReceipt {
  leadId: string;
}
