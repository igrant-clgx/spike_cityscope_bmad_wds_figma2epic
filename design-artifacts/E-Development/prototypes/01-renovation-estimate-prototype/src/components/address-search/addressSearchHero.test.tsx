import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PrototypeFlowProvider } from "../../state/PrototypeFlowContext";
import { AddressSearchHero } from "./AddressSearchHero";

describe("AddressSearchHero", () => {
  it("renders the approved presentational objects", () => {
    const markup = renderToStaticMarkup(
      <PrototypeFlowProvider>
        <AddressSearchHero />
      </PrototypeFlowProvider>,
    );

    for (const objectId of [
      "address-search-hero-search",
      "address-search-hero-family-image",
      "address-search-hero-primary-headline",
      "address-search-hero-address-instruction",
      "address-search-hero-value-supporting-copy",
      "address-search-hero-address-recovery-prompt",
    ]) {
      expect(markup).toContain(`id="${objectId}"`);
    }

    expect(markup).toContain('alt=""');
    expect(markup).toContain('width="1182"');
    expect(markup).toContain('height="537"');
    expect(markup).toContain('aria-hidden="true"');
  });
});
