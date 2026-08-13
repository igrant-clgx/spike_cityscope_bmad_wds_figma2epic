import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PrototypeFlowProvider } from "../../state/PrototypeFlowContext";
import {
  addressValidationMessages,
  AddressCombobox,
  getAddressValidationMessage,
  getPrototypeSuggestions,
} from "./AddressCombobox";
import { prototypeProperty } from "../../prototype/fixture";

describe("AddressCombobox", () => {
  it("filters the deterministic fixture without manufacturing results", () => {
    expect(getPrototypeSuggestions("400")).toHaveLength(1);
    expect(getPrototypeSuggestions("catherine street")[0]?.id).toBe(
      "prototype-property-400-catherine-st",
    );
    expect(getPrototypeSuggestions("unknown address")).toEqual([]);
    expect(getPrototypeSuggestions("")).toEqual([]);
  });

  it("returns the approved validation messages", () => {
    expect(getAddressValidationMessage(" ", null)).toBe(
      addressValidationMessages.required,
    );
    expect(getAddressValidationMessage("x".repeat(201), null)).toBe(
      addressValidationMessages.tooLong,
    );
    expect(getAddressValidationMessage("400", null)).toBe(
      addressValidationMessages.notSelected,
    );
    expect(getAddressValidationMessage("unknown address", null)).toBe(
      addressValidationMessages.notFound,
    );
    expect(
      getAddressValidationMessage(
        prototypeProperty.displayAddress,
        prototypeProperty,
      ),
    ).toBeNull();
  });

  it("renders the native combobox contract", () => {
    const markup = renderToStaticMarkup(
      <PrototypeFlowProvider>
        <AddressCombobox />
      </PrototypeFlowProvider>,
    );

    expect(markup).toContain(
      'id="address-search-hero-property-address-input"',
    );
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('aria-label="Property address"');
    expect(markup).toContain('aria-autocomplete="list"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('required=""');
    expect(markup).toContain('placeholder="Enter Address"');
    expect(markup).not.toContain("maxLength");
    expect(markup).not.toContain("aria-controls");
  });
});
