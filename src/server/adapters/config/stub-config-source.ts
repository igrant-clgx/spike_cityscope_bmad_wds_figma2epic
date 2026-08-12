import type {
  ConfigSource,
  FormConfig,
} from "@server/domain/ports/config-source";

/**
 * Deterministic stub `ConfigSource` (AD-2, AD-8). Server-only: the browser never
 * touches it. Returns one fixed versioned bundle of placeholder AU-renovation
 * content so Epic 3 stories can be built without choosing a real config backend
 * / CMS.
 *
 * Fully deterministic — no `Math.random`, no `Date`, no external I/O — so tests
 * and later stories get a stable bundle.
 *
 * OI-1 [OPEN]: the Step 2 item set below is a PLACEHOLDER pending Product
 * confirmation. OI-2 [OPEN]: the Step 3 questions carry GENERIC validation
 * metadata only (required/bounds); the final per-field rules are pending
 * Product confirmation. Build against the config contract, not this fixed list.
 */

const BUNDLE: FormConfig = {
  configVersion: "reno-config-v1",
  renovationTypes: [
    { id: "internal", label: "Internal" },
    { id: "external", label: "External" },
  ],
  // OI-1 [OPEN]: placeholder item set — not the confirmed content.
  items: [
    { id: "kitchen", typeId: "internal", label: "Kitchen" },
    { id: "bathroom", typeId: "internal", label: "Bathroom" },
    { id: "flooring", typeId: "internal", label: "Flooring" },
    { id: "roofing", typeId: "external", label: "Roofing" },
    { id: "painting", typeId: "external", label: "Exterior Painting" },
    { id: "landscaping", typeId: "external", label: "Landscaping" },
  ],
  // OI-2 [OPEN]: generic validation metadata only — exercises all 7 kinds.
  questions: [
    {
      id: "property-type",
      kind: "radio",
      label: "Property type",
      required: true,
      options: [
        { value: "house", label: "House" },
        { value: "apartment", label: "Apartment" },
        { value: "townhouse", label: "Townhouse" },
      ],
    },
    {
      id: "property-condition",
      kind: "select",
      label: "Current condition",
      required: true,
      options: [
        { value: "excellent", label: "Excellent" },
        { value: "good", label: "Good" },
        { value: "fair", label: "Fair" },
        { value: "poor", label: "Poor" },
      ],
    },
    {
      id: "property-notes",
      kind: "text",
      label: "Additional notes",
      required: false,
      maxLength: 500,
    },
    {
      id: "property-age",
      kind: "numeric",
      label: "Property age (years)",
      required: true,
      min: 0,
      max: 200,
      step: 1,
    },
    {
      id: "property-size",
      kind: "slider",
      label: "Approximate size (sqm)",
      required: true,
      min: 20,
      max: 1000,
      step: 10,
    },
    {
      id: "target-start-date",
      kind: "date",
      label: "Target start date",
      required: false,
      minIso: "2026-01-01",
    },
    {
      id: "budget-range",
      kind: "budget",
      label: "Budget range",
      required: true,
      min: 0,
      max: 500000,
      step: 1000,
    },
  ],
};

export function createStubConfigSource(): ConfigSource {
  return {
    getFormConfig(): Promise<FormConfig> {
      return Promise.resolve(BUNDLE);
    },
  };
}
