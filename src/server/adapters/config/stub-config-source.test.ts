import { describe, it, expect } from "vitest";
import { createStubConfigSource } from "./stub-config-source";
import { formConfigSchema } from "@shared/schemas";

const ALL_KINDS = [
  "radio",
  "text",
  "numeric",
  "date",
  "slider",
  "select",
  "budget",
] as const;

describe("stub config source", () => {
  it("is deterministic across calls (deep-equal bundles)", async () => {
    const a = createStubConfigSource();
    const b = createStubConfigSource();
    expect(await a.getFormConfig()).toEqual(await b.getFormConfig());
  });

  it("carries a stable configVersion", async () => {
    const config = await createStubConfigSource().getFormConfig();
    expect(config.configVersion).toBe("reno-config-v1");
  });

  it("tags every item with a valid renovation typeId", async () => {
    const config = await createStubConfigSource().getFormConfig();
    const typeIds = new Set(config.renovationTypes.map((t) => t.id));
    expect(config.items.length).toBeGreaterThan(0);
    for (const item of config.items) {
      expect(typeIds.has(item.typeId)).toBe(true);
    }
  });

  it("includes at least one question of every UX-DR8 field kind", async () => {
    const config = await createStubConfigSource().getFormConfig();
    const kinds = new Set(config.questions.map((q) => q.kind));
    for (const kind of ALL_KINDS) {
      expect(kinds.has(kind)).toBe(true);
    }
  });

  it("serves a bundle that parses through formConfigSchema", async () => {
    const config = await createStubConfigSource().getFormConfig();
    expect(formConfigSchema.safeParse(config).success).toBe(true);
  });
});
