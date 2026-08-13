import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  prototypeEstimate,
  prototypeProperty,
} from "../../prototype/fixture";
import { PrototypeFlowProvider } from "../../state/PrototypeFlowContext";
import { EstimateResultPage } from "./EstimateResultPage";

describe("EstimateResultPage", () => {
  it("renders the approved fixed estimate and result actions", () => {
    const markup = renderToStaticMarkup(
      <PrototypeFlowProvider
        initialState={{
          selectedProperty: prototypeProperty,
          renovationSelection: {
            renovationType: "internal",
            renovationItem: "Kitchen",
          },
          estimate: prototypeEstimate,
        }}
      >
        <EstimateResultPage />
      </PrototypeFlowProvider>,
    );

    expect(markup).toContain("Estimated Renovation Cost");
    expect(markup).toContain("Internal Renovation: Kitchen");
    expect(markup).toContain("$32,700 - $40,000");
    expect(markup).toContain("Edit Estimate");
    expect(markup).toContain("New Estimate");
    expect(markup).toContain('href="tel:08002694663"');
    expect(markup).toContain('href="tel:+6444703165"');
    expect(markup).not.toContain("Estimate Result foundation ready");
  });
});
