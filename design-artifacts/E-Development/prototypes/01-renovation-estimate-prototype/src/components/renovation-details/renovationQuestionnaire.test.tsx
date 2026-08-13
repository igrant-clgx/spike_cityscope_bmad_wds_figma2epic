import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PrototypeFlowProvider } from "../../state/PrototypeFlowContext";
import { RenovationQuestionnaire } from "./RenovationQuestionnaire";

describe("RenovationQuestionnaire", () => {
  it("renders Step 1 expanded and later steps locked until prerequisites are met", () => {
    const markup = renderToStaticMarkup(
      <PrototypeFlowProvider>
        <RenovationQuestionnaire />
      </PrototypeFlowProvider>,
    );

    expect(markup).toContain('aria-expanded="true"');
    expect(markup).toContain("Step 1: Renovation type");
    expect(markup).toContain("Is an Internal or External renovation?");
    expect(markup).toContain("Step 2: What to renovate");
    expect(markup).toContain("Step 3: More questions");
    expect(markup.match(/disabled=""/g)).toHaveLength(2);
    expect(markup.match(/aria-pressed="false"/g)).toHaveLength(3);
    expect(markup).toContain(
      'id="renovation-details-questionnaire-items-panel"',
    );
    expect(markup).toContain(
      'id="renovation-details-questionnaire-more-panel"',
    );
    expect(markup).toContain(
      'id="renovation-details-questionnaire-internal-button"',
    );
    expect(markup).toContain(
      'id="renovation-details-questionnaire-external-button"',
    );
  });
});
