import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { prototypeFlowReducer, initialPrototypeFlowState } from "../../state/prototypeFlow";
import { prototypeProperty } from "../../prototype/fixture";

describe("Renovation Details state contract", () => {
  it("retains the selected address required by the guarded shell", () => {
    const selectedState = prototypeFlowReducer(initialPrototypeFlowState, {
      type: "SELECT_PROPERTY",
      property: prototypeProperty,
    });

    expect(selectedState.selectedProperty).toEqual(prototypeProperty);
    expect(
      renderToStaticMarkup(
        <p id="renovation-details-address-selected-property">
          {selectedState.selectedProperty?.displayAddress}
        </p>,
      ),
    ).toContain("400 Catherine Street Lilyfield NSW 2040");
  });
});
