import { useEffect, useRef } from "react";
import { SEARCH_ROUTE } from "../../routing/guards";
import { navigate } from "../../routing/navigation";
import { usePrototypeFlow } from "../../state/PrototypeFlowContext";
import { PageChrome } from "../page-chrome/PageChrome";
import { RenovationQuestionnaire } from "./RenovationQuestionnaire";
import "./renovation-details.css";

export function RenovationDetailsPage() {
  const { state, dispatch } = usePrototypeFlow();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!state.selectedProperty) {
    return null;
  }

  const enterNewAddress = () => {
    dispatch({ type: "RESET_ADDRESS" });
    navigate(SEARCH_ROUTE);
  };

  return (
    <PageChrome objectIdPrefix="renovation-details">
      <main className="renovation-details">
        <h1
          id="renovation-details-questionnaire-page-heading"
          className="renovation-details__visually-hidden"
          ref={headingRef}
          tabIndex={-1}
        >
          Renovation details
        </h1>
        <section
          id="renovation-details-address-context"
          className="renovation-details__address-context"
          aria-label="Selected property"
        >
          <p id="renovation-details-address-selected-property">
            {state.selectedProperty.displayAddress}
          </p>
          <button
            id="renovation-details-address-enter-new-link"
            className="renovation-details__new-address"
            type="button"
            onClick={enterNewAddress}
          >
            Enter new address
          </button>
        </section>
        <RenovationQuestionnaire />
      </main>
    </PageChrome>
  );
}
