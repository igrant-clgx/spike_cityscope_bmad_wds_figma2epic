import { describe, it, expect } from "vitest";
import { emptyForm, setAddress } from "./renovation-estimate-form";
import type { ResolvedAddress } from "@server/domain/ports/address-provider";

const ADDRESS: ResolvedAddress = {
  street: "100 George St",
  suburb: "Sydney",
  state: "NSW",
  postcode: "2000",
  geo: { lat: -33.8615, lng: 151.2055 },
};

describe("renovation estimate form aggregate", () => {
  it("starts with a null address slot", () => {
    expect(emptyForm()).toEqual({ address: null });
  });

  it("writes the address slot immutably", () => {
    const form = emptyForm();
    const next = setAddress(form, ADDRESS);
    expect(next.address).toEqual(ADDRESS);
    expect(form.address).toBeNull();
    expect(next).not.toBe(form);
  });
});
