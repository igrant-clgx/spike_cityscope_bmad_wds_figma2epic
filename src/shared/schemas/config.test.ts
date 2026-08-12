import { describe, it, expect, expectTypeOf } from "vitest";
import {
  renovationTypeSchema,
  renovationItemSchema,
  propertyQuestionSchema,
  formConfigSchema,
  type RenovationType as SchemaRenovationType,
  type RenovationItem as SchemaRenovationItem,
  type PropertyQuestion as SchemaPropertyQuestion,
  type FormConfig as SchemaFormConfig,
} from "./config";
import type {
  RenovationType as PortRenovationType,
  RenovationItem as PortRenovationItem,
  PropertyQuestion as PortPropertyQuestion,
  FormConfig as PortFormConfig,
} from "@server/domain/ports/config-source";

const VALID_CONFIG = {
  configVersion: "reno-config-v1",
  renovationTypes: [
    { id: "internal", label: "Internal" },
    { id: "external", label: "External" },
  ],
  items: [
    { id: "kitchen", typeId: "internal", label: "Kitchen" },
    { id: "roofing", typeId: "external", label: "Roofing" },
  ],
  questions: [
    {
      id: "q-radio",
      kind: "radio",
      label: "Radio",
      required: true,
      options: [{ value: "a", label: "A" }],
    },
    {
      id: "q-select",
      kind: "select",
      label: "Select",
      required: false,
      options: [{ value: "b", label: "B" }],
    },
    { id: "q-text", kind: "text", label: "Text", required: false, maxLength: 100 },
    { id: "q-numeric", kind: "numeric", label: "Numeric", required: true, min: 0, max: 10 },
    { id: "q-slider", kind: "slider", label: "Slider", required: true, min: 0, max: 100 },
    { id: "q-date", kind: "date", label: "Date", required: false, minIso: "2026-01-01" },
    { id: "q-budget", kind: "budget", label: "Budget", required: true, min: 0, max: 500 },
  ],
};

describe("config schemas", () => {
  it("parses a valid full bundle", () => {
    expect(formConfigSchema.safeParse(VALID_CONFIG).success).toBe(true);
  });

  it("validates renovation type and item shapes", () => {
    expect(renovationTypeSchema.safeParse({ id: "internal", label: "Internal" }).success).toBe(
      true,
    );
    expect(renovationTypeSchema.safeParse({ id: "", label: "x" }).success).toBe(false);
    expect(
      renovationItemSchema.safeParse({ id: "kitchen", typeId: "internal", label: "Kitchen" })
        .success,
    ).toBe(true);
    expect(renovationItemSchema.safeParse({ id: "kitchen", label: "Kitchen" }).success).toBe(
      false,
    );
  });

  it("requires renovationTypes to be non-empty", () => {
    expect(
      formConfigSchema.safeParse({ ...VALID_CONFIG, renovationTypes: [] }).success,
    ).toBe(false);
  });

  it("accepts an optional appliesToItemIds on any question", () => {
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "text",
        label: "T",
        required: false,
        appliesToItemIds: ["kitchen"],
      }).success,
    ).toBe(true);
  });

  it("rejects a radio/select question with empty or missing options", () => {
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "radio",
        label: "R",
        required: true,
        options: [],
      }).success,
    ).toBe(false);
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "select",
        label: "S",
        required: true,
      }).success,
    ).toBe(false);
  });

  it("ignores a stray options field on a text question (stripped, not required)", () => {
    const parsed = propertyQuestionSchema.safeParse({
      id: "q",
      kind: "text",
      label: "T",
      required: false,
      options: [{ value: "a", label: "A" }],
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect("options" in parsed.data).toBe(false);
    }
  });

  it("requires min and max on a budget question", () => {
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "budget",
        label: "B",
        required: true,
      }).success,
    ).toBe(false);
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "budget",
        label: "B",
        required: true,
        min: 0,
        max: 100,
      }).success,
    ).toBe(true);
  });

  it("requires min and max on a slider question", () => {
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "slider",
        label: "S",
        required: true,
        min: 0,
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown question kind", () => {
    expect(
      propertyQuestionSchema.safeParse({
        id: "q",
        kind: "checkbox",
        label: "C",
        required: false,
      }).success,
    ).toBe(false);
  });
});

describe("field-definition structural integrity (cross-field refinements)", () => {
  const base = { id: "q", label: "Q", required: true };

  it("rejects an inverted range on slider/budget/numeric (min > max)", () => {
    for (const kind of ["slider", "budget"] as const) {
      expect(
        propertyQuestionSchema.safeParse({ ...base, kind, min: 100, max: 10 }).success,
      ).toBe(false);
    }
    expect(
      propertyQuestionSchema.safeParse({ ...base, kind: "numeric", min: 100, max: 10 }).success,
    ).toBe(false);
  });

  it("allows a numeric with only one bound (no cross-field violation)", () => {
    expect(
      propertyQuestionSchema.safeParse({ ...base, kind: "numeric", min: 5 }).success,
    ).toBe(true);
  });

  it("rejects a non-positive step on numeric/slider/budget", () => {
    expect(
      propertyQuestionSchema.safeParse({ ...base, kind: "numeric", step: 0 }).success,
    ).toBe(false);
    expect(
      propertyQuestionSchema.safeParse({ ...base, kind: "slider", min: 0, max: 10, step: -1 })
        .success,
    ).toBe(false);
  });

  it("rejects duplicate radio/select option values", () => {
    expect(
      propertyQuestionSchema.safeParse({
        ...base,
        kind: "radio",
        options: [
          { value: "x", label: "One" },
          { value: "x", label: "Two" },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects a non-ISO date bound and an inverted date pair", () => {
    expect(
      propertyQuestionSchema.safeParse({ ...base, kind: "date", minIso: "not-a-date" }).success,
    ).toBe(false);
    expect(
      propertyQuestionSchema.safeParse({
        ...base,
        kind: "date",
        minIso: "2026-06-01",
        maxIso: "2026-01-01",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty-string entry in appliesToItemIds", () => {
    expect(
      propertyQuestionSchema.safeParse({
        ...base,
        kind: "text",
        appliesToItemIds: [""],
      }).success,
    ).toBe(false);
  });
});

describe("bundle-level referential integrity (formConfigSchema refinements)", () => {
  it("rejects duplicate ids within a collection", () => {
    expect(
      formConfigSchema.safeParse({
        ...VALID_CONFIG,
        items: [
          { id: "dup", typeId: "internal", label: "A" },
          { id: "dup", typeId: "internal", label: "B" },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects an item whose typeId references no renovation type", () => {
    expect(
      formConfigSchema.safeParse({
        ...VALID_CONFIG,
        items: [{ id: "orphan", typeId: "ghost", label: "Orphan" }],
      }).success,
    ).toBe(false);
  });

  it("rejects a question whose appliesToItemIds references a missing item", () => {
    expect(
      formConfigSchema.safeParse({
        ...VALID_CONFIG,
        questions: [
          {
            id: "q-text",
            kind: "text",
            label: "Text",
            required: false,
            appliesToItemIds: ["nonexistent-item"],
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("accepts a question appliesToItemIds referencing a real item", () => {
    expect(
      formConfigSchema.safeParse({
        ...VALID_CONFIG,
        questions: [
          {
            id: "q-text",
            kind: "text",
            label: "Text",
            required: false,
            appliesToItemIds: ["kitchen"],
          },
        ],
      }).success,
    ).toBe(true);
  });
});

describe("port ↔ schema type equivalence (drift guard)", () => {
  it("keeps the plain port types structurally identical to the zod-inferred types", () => {
    expectTypeOf<PortRenovationType>().toEqualTypeOf<SchemaRenovationType>();
    expectTypeOf<PortRenovationItem>().toEqualTypeOf<SchemaRenovationItem>();
    expectTypeOf<PortPropertyQuestion>().toEqualTypeOf<SchemaPropertyQuestion>();
    expectTypeOf<PortFormConfig>().toEqualTypeOf<SchemaFormConfig>();
  });
});
