import { envelopeSchema, type Envelope } from "@shared/schemas";
import type { z } from "zod";

/**
 * Minimal client → BFF caller that parses the shared response envelope.
 *
 * Intentionally thin for the walking skeleton: NO retry, pending, or backoff
 * logic yet. Story 1.4 extends this into the single owner of envelope parsing,
 * pending/error state, and retry policy (AD-9). It is the only client→BFF caller.
 */
export async function apiFetch<T extends z.ZodTypeAny>(
  input: RequestInfo | URL,
  dataSchema: T,
  init?: RequestInit,
): Promise<Envelope<z.infer<T>>> {
  const response = await fetch(input, init);
  const json = await response.json();
  return envelopeSchema(dataSchema).parse(json) as Envelope<z.infer<T>>;
}
