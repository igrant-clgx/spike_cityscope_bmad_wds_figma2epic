import { z } from "zod";

/**
 * The single BFF response envelope contract (AD-9).
 *
 * Every BFF route handler responds with either a success or an error envelope,
 * and both carry a non-empty `requestId` correlation id. This is the load-bearing
 * contract for the whole app: `src/lib/api-client` and every later feature parse it.
 */

/** Generate an opaque, non-empty correlation id for a request/response. */
export function generateRequestId(): string {
  // crypto.randomUUID is available in Node 20+ and modern browsers.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Success envelope schema factory, parameterised by the `data` payload schema. */
export function successEnvelopeSchema<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    ok: z.literal(true),
    data,
    requestId: z.string().min(1),
  });
}

/** Error detail carried inside an error envelope. */
export const errorDetailSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  fieldErrors: z.record(z.string(), z.string()).optional(),
});

/** Error envelope schema (AD-9). */
export const errorEnvelopeSchema = z.object({
  ok: z.literal(false),
  error: errorDetailSchema,
  requestId: z.string().min(1),
});

/** Discriminated envelope schema factory for parsing either shape. */
export function envelopeSchema<T extends z.ZodTypeAny>(data: T) {
  return z.discriminatedUnion("ok", [
    successEnvelopeSchema(data),
    errorEnvelopeSchema,
  ]);
}

export type ErrorDetail = z.infer<typeof errorDetailSchema>;
export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;
export type SuccessEnvelope<T> = {
  ok: true;
  data: T;
  requestId: string;
};
export type Envelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

/** Build a success envelope; generates a `requestId` when one is not supplied. */
export function ok<T>(data: T, requestId: string = generateRequestId()): SuccessEnvelope<T> {
  return { ok: true, data, requestId };
}

/** Build an error envelope; generates a `requestId` when one is not supplied. */
export function err(
  code: string,
  message: string,
  options: { fieldErrors?: Record<string, string>; requestId?: string } = {},
): ErrorEnvelope {
  return {
    ok: false,
    error: {
      code,
      message,
      ...(options.fieldErrors ? { fieldErrors: options.fieldErrors } : {}),
    },
    requestId: options.requestId ?? generateRequestId(),
  };
}
