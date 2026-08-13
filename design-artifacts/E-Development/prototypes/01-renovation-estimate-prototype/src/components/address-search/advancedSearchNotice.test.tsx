import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdvancedSearchNotice } from "./AdvancedSearchNotice";

describe("AdvancedSearchNotice", () => {
  it("keeps the unavailable action visible without inventing a route", () => {
    const markup = renderToStaticMarkup(<AdvancedSearchNotice />);

    expect(markup).toContain(
      'id="address-search-hero-advanced-search-link"',
    );
    expect(markup).toContain('type="button"');
    expect(markup).toContain("Use Advanced Search");
    expect(markup).not.toContain("href=");
  });
});
