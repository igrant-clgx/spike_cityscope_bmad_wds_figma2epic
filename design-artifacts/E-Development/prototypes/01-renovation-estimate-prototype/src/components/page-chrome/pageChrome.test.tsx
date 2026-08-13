import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PageChrome } from "./PageChrome";
import { DISCLAIMER_COPY } from "./DisclaimerFooter";

describe("PageChrome", () => {
  it("renders the approved page chrome in document order", () => {
    const markup = renderToStaticMarkup(
      <PageChrome>
        <main id="test-main">Content</main>
      </PageChrome>,
    );

    const headerIndex = markup.indexOf('id="address-search-header"');
    const mainIndex = markup.indexOf('id="test-main"');
    const footerIndex = markup.indexOf('id="address-search-footer-disclaimer"');

    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(mainIndex).toBeGreaterThan(headerIndex);
    expect(footerIndex).toBeGreaterThan(mainIndex);
    expect(markup).toContain('alt="Demo Channel"');
    expect(markup).toContain('aria-label="Cotality"');
    expect(markup).toContain('label="Renovation calculator disclaimer"');
    expect(markup).toContain(DISCLAIMER_COPY);
  });
});
