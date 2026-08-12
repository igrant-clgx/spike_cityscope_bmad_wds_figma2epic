import { describe, it, expect, expectTypeOf } from "vitest";
import {
  auStateSchema,
  addressPredictionSchema,
  addressPredictionsSchema,
  resolvedAddressSchema,
  resolvedAddressEnvelopeDataSchema,
  type AddressPrediction as SchemaAddressPrediction,
  type ResolvedAddress as SchemaResolvedAddress,
} from "./address";
import type {
  AddressPrediction as PortAddressPrediction,
  ResolvedAddress as PortResolvedAddress,
} from "@server/domain/ports/address-provider";

const VALID_ADDRESS = {
  street: "100 George St",
  suburb: "Sydney",
  state: "NSW",
  postcode: "2000",
  geo: { lat: -33.8615, lng: 151.2055 },
};

describe("address schemas", () => {
  it("accepts every AU state/territory", () => {
    for (const state of ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]) {
      expect(auStateSchema.safeParse(state).success).toBe(true);
    }
  });

  it("rejects an unknown state", () => {
    expect(auStateSchema.safeParse("XYZ").success).toBe(false);
    expect(resolvedAddressSchema.safeParse({ ...VALID_ADDRESS, state: "XYZ" }).success).toBe(
      false,
    );
  });

  it("accepts a valid 4-digit postcode", () => {
    expect(resolvedAddressSchema.safeParse(VALID_ADDRESS).success).toBe(true);
  });

  it("rejects a non-4-digit postcode", () => {
    expect(resolvedAddressSchema.safeParse({ ...VALID_ADDRESS, postcode: "200" }).success).toBe(
      false,
    );
    expect(resolvedAddressSchema.safeParse({ ...VALID_ADDRESS, postcode: "20000" }).success).toBe(
      false,
    );
    expect(resolvedAddressSchema.safeParse({ ...VALID_ADDRESS, postcode: "20a0" }).success).toBe(
      false,
    );
  });

  it("requires geo lat/lng", () => {
    const { geo: _geo, ...noGeo } = VALID_ADDRESS;
    expect(resolvedAddressSchema.safeParse(noGeo).success).toBe(false);
    expect(
      resolvedAddressSchema.safeParse({ ...VALID_ADDRESS, geo: { lat: 1 } }).success,
    ).toBe(false);
  });

  it("validates prediction shape", () => {
    expect(
      addressPredictionSchema.safeParse({ addressId: "au-addr-1", label: "100 George St" })
        .success,
    ).toBe(true);
    expect(addressPredictionSchema.safeParse({ addressId: "", label: "x" }).success).toBe(false);
    expect(addressPredictionSchema.safeParse({ addressId: "a", label: "" }).success).toBe(false);
  });

  it("validates the predictions envelope payload", () => {
    expect(
      addressPredictionsSchema.safeParse({
        predictions: [{ addressId: "au-addr-1", label: "100 George St" }],
      }).success,
    ).toBe(true);
    expect(addressPredictionsSchema.safeParse({ predictions: {} }).success).toBe(false);
  });

  it("validates the resolved-address envelope payload", () => {
    expect(
      resolvedAddressEnvelopeDataSchema.safeParse({ address: VALID_ADDRESS }).success,
    ).toBe(true);
  });
});

describe("port ↔ schema type equivalence (drift guard)", () => {
  it("keeps the plain port types structurally identical to the zod-inferred types", () => {
    expectTypeOf<PortAddressPrediction>().toEqualTypeOf<SchemaAddressPrediction>();
    expectTypeOf<PortResolvedAddress>().toEqualTypeOf<SchemaResolvedAddress>();
  });
});
