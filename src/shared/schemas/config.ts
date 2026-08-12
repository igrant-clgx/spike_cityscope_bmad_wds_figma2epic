import { z } from "zod";

/**
 * Shared form-config contracts (AD-4, AD-8). The SAME schemas validate the
 * guided-estimate form content (renovation types, Step 2 items, and Step 3
 * dynamic questions) on BOTH the client (`apiFetch`) and the server (the config
 * BFF route re-validates the adapter output before it leaves the seam), so the
 * served content shape can never drift.
 *
 * Content is DATA, not code (AD-8/AD-11/NFR-9): no renovation label, item,
 * question, or field kind is a literal in route/handler/UI code — the stub
 * adapter holds the sample bundle. The bundle carries a stable `configVersion`
 * and every type/item/question carries a stable string `id`, so a later
 * estimate request (Epic 4) can echo the exact version + item ids it was built
 * from.
 *
 * The domain port (`src/server/domain/ports/config-source.ts`) declares plain
 * TS mirrors of these shapes; a type-level test (`config.test.ts`) asserts
 * structural equivalence so the two never drift, without pulling zod into the
 * domain layer.
 *
 * OI-1 (final Step 2 item content) and OI-2 (final Step 3 per-field validation
 * rules) are `[OPEN]` pending Product confirmation — the schema carries generic
 * required/bounds metadata only, not the final rules.
 */

/** A renovation type (Step 1 choice), e.g. Internal / External. */
export const renovationTypeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

/**
 * A Step 2 item, tagged with the renovation `typeId` it belongs to so Step 1's
 * choice can drive the Step 2 option set (FR-11/FR-13) without a code branch.
 */
export const renovationItemSchema = z.object({
  id: z.string().min(1),
  typeId: z.string().min(1),
  label: z.string().min(1),
});

/** An option for a `radio`/`select` question. */
export const questionOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

/**
 * Base fields present on EVERY question member of the discriminated union.
 * `appliesToItemIds` is OPTIONAL (absent = always shown); Story 3.5 uses it to
 * filter which questions show for the selected Step-2 items.
 */
const questionBase = {
  id: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean(),
  appliesToItemIds: z.string().min(1).array().optional(),
};

/**
 * The dynamic Step 3 question model (UX-DR8): a discriminated union over a
 * `kind` tag covering all 7 field kinds, so Story 3.5's renderer can switch
 * exhaustively. Kind-specific validation metadata is generic pending OI-2.
 *
 * A cross-field refinement enforces STRUCTURAL integrity of a field definition
 * (not the user's eventual answer rules, which are OI-2): bounded kinds must
 * have `min <= max`, and `radio`/`select` option `value`s must be unique so a
 * selected answer maps to exactly one label.
 */
export const propertyQuestionSchema = z
  .discriminatedUnion("kind", [
    z.object({
      ...questionBase,
      kind: z.literal("radio"),
      options: z.array(questionOptionSchema).min(1),
    }),
    z.object({
      ...questionBase,
      kind: z.literal("select"),
      options: z.array(questionOptionSchema).min(1),
    }),
    z.object({
      ...questionBase,
      kind: z.literal("text"),
      maxLength: z.number().int().positive().optional(),
    }),
    z.object({
      ...questionBase,
      kind: z.literal("numeric"),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().positive().optional(),
    }),
    z.object({
      ...questionBase,
      kind: z.literal("slider"),
      min: z.number(),
      max: z.number(),
      step: z.number().positive().optional(),
    }),
    z.object({
      ...questionBase,
      kind: z.literal("date"),
      minIso: z.iso.date().optional(),
      maxIso: z.iso.date().optional(),
    }),
    z.object({
      ...questionBase,
      kind: z.literal("budget"),
      min: z.number(),
      max: z.number(),
      step: z.number().positive().optional(),
    }),
  ])
  .superRefine((q, ctx) => {
    // Bounded kinds: reject an inverted/impossible range (min > max).
    if (
      (q.kind === "slider" || q.kind === "budget" || q.kind === "numeric") &&
      q.min !== undefined &&
      q.max !== undefined &&
      q.min > q.max
    ) {
      ctx.addIssue({
        code: "custom",
        message: `${q.kind} question "${q.id}" has min greater than max`,
        path: ["min"],
      });
    }
    // Date kind: reject an inverted bound pair.
    if (
      q.kind === "date" &&
      q.minIso !== undefined &&
      q.maxIso !== undefined &&
      q.minIso > q.maxIso
    ) {
      ctx.addIssue({
        code: "custom",
        message: `date question "${q.id}" has minIso after maxIso`,
        path: ["minIso"],
      });
    }
    // radio/select: option values must be unique.
    if (q.kind === "radio" || q.kind === "select") {
      const values = q.options.map((o) => o.value);
      if (new Set(values).size !== values.length) {
        ctx.addIssue({
          code: "custom",
          message: `${q.kind} question "${q.id}" has duplicate option values`,
          path: ["options"],
        });
      }
    }
  });

/**
 * The full versioned form-config bundle served by the ConfigSource seam.
 * `renovationTypes` must be non-empty (Step 1 needs choices); `items` and
 * `questions` may be empty in principle but the stub populates both.
 *
 * A cross-collection refinement enforces bundle-level integrity so the seam is
 * self-guarding (not merely stub-test-guarded): stable `id`s are unique within
 * each collection (they are the join keys a later estimate echoes — AD-8), every
 * item's `typeId` resolves to a real renovation type (so Step 1 can drive the
 * Step 2 option set — FR-11/FR-13), and every question's `appliesToItemIds`
 * reference resolves to a real item (so no Story 3.5 question is unreachable).
 */
export const formConfigSchema = z
  .object({
    configVersion: z.string().min(1),
    renovationTypes: renovationTypeSchema.array().min(1),
    items: renovationItemSchema.array(),
    questions: propertyQuestionSchema.array(),
  })
  .superRefine((cfg, ctx) => {
    const assertUnique = (ids: string[], collection: string): void => {
      const seen = new Set<string>();
      for (const id of ids) {
        if (seen.has(id)) {
          ctx.addIssue({
            code: "custom",
            message: `duplicate ${collection} id "${id}"`,
            path: [collection],
          });
        }
        seen.add(id);
      }
    };
    assertUnique(
      cfg.renovationTypes.map((t) => t.id),
      "renovationTypes",
    );
    assertUnique(
      cfg.items.map((i) => i.id),
      "items",
    );
    assertUnique(
      cfg.questions.map((q) => q.id),
      "questions",
    );

    const typeIds = new Set(cfg.renovationTypes.map((t) => t.id));
    for (const item of cfg.items) {
      if (!typeIds.has(item.typeId)) {
        ctx.addIssue({
          code: "custom",
          message: `item "${item.id}" references unknown typeId "${item.typeId}"`,
          path: ["items"],
        });
      }
    }

    const itemIds = new Set(cfg.items.map((i) => i.id));
    for (const q of cfg.questions) {
      for (const ref of q.appliesToItemIds ?? []) {
        if (!itemIds.has(ref)) {
          ctx.addIssue({
            code: "custom",
            message: `question "${q.id}" references unknown item id "${ref}"`,
            path: ["questions"],
          });
        }
      }
    }
  });

export type RenovationType = z.infer<typeof renovationTypeSchema>;
export type RenovationItem = z.infer<typeof renovationItemSchema>;
export type QuestionOption = z.infer<typeof questionOptionSchema>;
export type PropertyQuestion = z.infer<typeof propertyQuestionSchema>;
export type FormConfig = z.infer<typeof formConfigSchema>;
