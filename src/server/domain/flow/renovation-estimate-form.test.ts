import { describe, it, expect } from "vitest";
import { emptyForm, setAddress, changeAddress } from "./renovation-estimate-form";
import type { ResolvedAddress } from "@server/domain/ports/address-provider";

const ADDRESS: ResolvedAddress = {
  street: "100 George St",
  suburb: "Sydney",
  state: "NSW",
  postcode: "2000",
  geo: { lat: -33.8615, lng: 151.2055 },
};

const OTHER_ADDRESS: ResolvedAddress = {
  street: "1 Queen St",
  suburb: "Melbourne",
  state: "VIC",
  postcode: "3000",
  geo: { lat: -37.8136, lng: 144.9631 },
};

describe("renovation estimate form aggregate", () => {
  it("starts with a null address and empty Step 1–3 scope baseline", () => {
    expect(emptyForm()).toEqual({
      address: null,
      renovationTypeId: null,
      selectedItemIds: [],
      propertyDetails: {},
    });
  });

  it("writes the address slot immutably", () => {
    const form = emptyForm();
    const next = setAddress(form, ADDRESS);
    expect(next.address).toEqual(ADDRESS);
    expect(form.address).toBeNull();
    expect(next).not.toBe(form);
  });

  it("preserves seeded Step 1–3 scope when only setting the address", () => {
    const seeded = {
      ...emptyForm(),
      renovationTypeId: "internal",
      selectedItemIds: ["kitchen"],
      propertyDetails: { bedrooms: 3 },
    };
    const next = setAddress(seeded, ADDRESS);
    expect(next.renovationTypeId).toBe("internal");
    expect(next.selectedItemIds).toEqual(["kitchen"]);
    expect(next.propertyDetails).toEqual({ bedrooms: 3 });
    expect(next.address).toEqual(ADDRESS);
  });

  describe("changeAddress (FR-9, OI-7 [OPEN] assumption: clear dependent scope)", () => {
    it("applies the new address", () => {
      const form = setAddress(emptyForm(), ADDRESS);
      const next = changeAddress(form, OTHER_ADDRESS);
      expect(next.address).toEqual(OTHER_ADDRESS);
    });

    it("resets seeded Step 1–3 scope to the emptyForm baseline", () => {
      const seeded = {
        ...setAddress(emptyForm(), ADDRESS),
        renovationTypeId: "internal",
        selectedItemIds: ["kitchen", "bathroom"],
        propertyDetails: { bedrooms: 3, hasPool: true },
      };
      const next = changeAddress(seeded, OTHER_ADDRESS);
      // Every slot other than address equals the empty baseline; forward-
      // compatible as Epic 3 adds scope slots to emptyForm().
      expect(next).toEqual(setAddress(emptyForm(), OTHER_ADDRESS));
    });

    it("is immutable — the input form is untouched", () => {
      const form = setAddress(emptyForm(), ADDRESS);
      const next = changeAddress(form, OTHER_ADDRESS);
      expect(form.address).toEqual(ADDRESS);
      expect(next).not.toBe(form);
    });
  });
});
