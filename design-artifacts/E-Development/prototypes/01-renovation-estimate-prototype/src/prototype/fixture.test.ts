import { describe, expect, it } from "vitest";
import {
  advancedSearchNotice,
  calculationDetailsNotice,
  prototypeEstimate,
  prototypeProperty,
  prototypeRenovationItem,
} from "./fixture";

describe("prototype fixture", () => {
  it("matches the approved deterministic demonstration data", () => {
    expect(prototypeProperty).toEqual({
      id: "prototype-property-400-catherine-st",
      displayAddress: "400 Catherine Street Lilyfield NSW 2040",
    });
    expect(prototypeRenovationItem).toBe("Kitchen");
    expect(prototypeEstimate).toEqual({
      description: "Internal Renovation: Kitchen",
      minimumAmount: 32700,
      maximumAmount: 40000,
      currencyDisplay: "$32,700 - $40,000",
    });
    expect(advancedSearchNotice).toBe(
      "Advanced search is not available in this visual prototype.",
    );
    expect(calculationDetailsNotice).toBe(
      "Calculation details are not available in this visual prototype.",
    );
  });
});
