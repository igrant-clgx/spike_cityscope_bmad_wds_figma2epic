import { z } from "zod";

/**
 * Shared estimate request/response contracts (AD-4, AD-9). The SAME schemas
 * validate the estimate request body on the server (the BFF route re-parses the
 * body) and the response payload on BOTH the server (re-validated before it
 * leaves the seam) and the client (`apiFetch`), so the estimate seam can never
 * drift.
 *
 * Money is INTEGER AUD CENTS end-to-end (AD-7): `costMin`/`costMax` are
 * non-negative integers with `costMin <= costMax`. The domain port
 * (`src/server/domain/ports/estimate-engine.ts`) declares plain TS mirrors of
 * these shapes; keeping zod out of the domain preserves layer purity (asserted
 * by `src/server/architecture.test.ts`).
 */

/** The estimate request: the completed scope echoes the `configVersion` it was built from plus the selected item ids. */
export const estimateRequestSchema = z.object({
  configVersion: z.string().trim().min(1),
  itemIds: z.array(z.string().min(1)).max(200),
});

/**
 * The estimate result envelope payload: a stable `estimateId` (deterministic
 * hash of the scope — the join/cache key), an integer AUD-cents range, and a
 * confidence indicator. A cross-field refinement enforces `costMin <= costMax`.
 */
export const estimateResultSchema = z
  .object({
    estimateId: z.string().min(1),
    costMin: z.number().int().nonnegative(),
    costMax: z.number().int().nonnegative(),
    confidence: z.enum(["low", "medium", "high"]),
  })
  .superRefine((v, ctx) => {
    if (v.costMin > v.costMax) {
      ctx.addIssue({
        code: "custom",
        message: "costMin must be <= costMax",
        path: ["costMin"],
      });
    }
  });

export type EstimateRequest = z.infer<typeof estimateRequestSchema>;
export type EstimateResult = z.infer<typeof estimateResultSchema>;
