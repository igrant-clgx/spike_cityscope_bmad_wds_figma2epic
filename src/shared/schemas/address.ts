import { z } from "zod";

/**
 * Shared address contracts (AD-4). The SAME schemas validate the autocomplete
 * query, predictions, and the resolved structured AU address on BOTH the client
 * (`apiFetch`) and the server (BFF route handlers) so request and response
 * shapes can never drift apart.
 *
 * The domain port (`src/server/domain/ports/address-provider.ts`) declares plain
 * TS mirrors of `AddressPrediction`/`ResolvedAddress`; a type-level test keeps
 * them structurally identical without pulling zod into the domain layer.
 */

/** Australian state / territory enum. */
export const auStateSchema = z.enum([
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
]);

/**
 * Autocomplete query. Kept permissive on length here — the application layer
 * (route) owns the ≥3-char short-query rule, not the schema.
 */
export const addressQuerySchema = z.object({
  q: z.string(),
});

/**
 * Resolve-route input: an opaque prediction id. Trimmed and non-empty, so an
 * empty/whitespace `addressId` is an `invalid_request` (not a `not_found`).
 */
export const addressResolveQuerySchema = z.object({
  addressId: z.string().trim().min(1),
});

/** A single autocomplete prediction: an opaque id + a human label. */
export const addressPredictionSchema = z.object({
  addressId: z.string().min(1),
  label: z.string().min(1),
});

/** The suggest response payload. */
export const addressPredictionsSchema = z.object({
  predictions: z.array(addressPredictionSchema),
});

/** Resolved structured AU address (street/suburb/state/postcode/geo). */
export const resolvedAddressSchema = z.object({
  street: z.string().min(1),
  suburb: z.string().min(1),
  state: auStateSchema,
  postcode: z.string().regex(/^\d{4}$/),
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

/** The resolve response payload. */
export const resolvedAddressEnvelopeDataSchema = z.object({
  address: resolvedAddressSchema,
});

export type AuState = z.infer<typeof auStateSchema>;
export type AddressQuery = z.infer<typeof addressQuerySchema>;
export type AddressPrediction = z.infer<typeof addressPredictionSchema>;
export type AddressPredictions = z.infer<typeof addressPredictionsSchema>;
export type ResolvedAddress = z.infer<typeof resolvedAddressSchema>;
export type ResolvedAddressEnvelopeData = z.infer<
  typeof resolvedAddressEnvelopeDataSchema
>;
