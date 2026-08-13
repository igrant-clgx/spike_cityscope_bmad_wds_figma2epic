import { useEffect, useRef, useState } from "react";
import type { ElementRef } from "react";
import CaretDown from "@ensemble/lib/icons/caret-down";
import MapPin from "@ensemble/lib/icons/map-pin";
import PhoneCall from "@ensemble/lib/icons/phone-call";
import { EnsembleIcon } from "../icons/EnsembleIcon";
import { useNativeClick } from "../../hooks/useNativeClick";
import { calculationDetailsNotice } from "../../prototype/fixture";
import {
  DETAILS_ROUTE,
  SEARCH_ROUTE,
} from "../../routing/guards";
import { navigate } from "../../routing/navigation";
import { usePrototypeFlow } from "../../state/PrototypeFlowContext";
import { PageChrome } from "../page-chrome/PageChrome";
import "./estimate-result.css";

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <EnsembleIcon
      className={`estimate-result__chevron${expanded ? " estimate-result__chevron--expanded" : ""}`}
      createIcon={CaretDown}
      size={20}
    />
  );
}

export function EstimateResultPage() {
  const { state, dispatch } = usePrototypeFlow();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [costAnnouncement, setCostAnnouncement] = useState("");

  const editEstimate = () => {
    dispatch({ type: "EDIT_ESTIMATE" });
    navigate(DETAILS_ROUTE);
  };
  const startNewEstimate = () => {
    dispatch({ type: "START_NEW_ESTIMATE" });
    navigate(DETAILS_ROUTE);
  };
  const enterNewAddress = () => {
    dispatch({ type: "RESET_ADDRESS" });
    navigate(SEARCH_ROUTE);
  };

  const editButtonRef =
    useNativeClick<ElementRef<"en-btn">>(editEstimate);
  const newEstimateButtonRef =
    useNativeClick<ElementRef<"en-btn">>(startNewEstimate);

  useEffect(() => {
    headingRef.current?.focus();
    const announcementFrame = window.requestAnimationFrame(() => {
      if (state.estimate) {
        setCostAnnouncement(
          `Estimated renovation cost ${state.estimate.currencyDisplay}.`,
        );
      }
    });
    return () => window.cancelAnimationFrame(announcementFrame);
  }, [state.estimate]);

  if (!state.selectedProperty || !state.estimate) {
    return null;
  }

  return (
    <PageChrome objectIdPrefix="estimate-result">
      <main className="estimate-result">
        <section
          id="estimate-result-address-context"
          className="estimate-result__address-context"
          aria-label="Selected property"
        >
          <p id="estimate-result-address-selected-property">
            <EnsembleIcon
              id="estimate-result-address-location-icon"
              className="estimate-result__address-icon"
              createIcon={MapPin}
            />
            <span>{state.selectedProperty.displayAddress}</span>
          </p>
          <button
            id="estimate-result-address-enter-new-button"
            className="estimate-result__new-address"
            type="button"
            onClick={enterNewAddress}
          >
            Enter new address
          </button>
        </section>

        <section
          id="estimate-result-estimate-summary"
          className="estimate-result__summary"
        >
          <h1
            id="estimate-result-summary-heading"
            ref={headingRef}
            tabIndex={-1}
          >
            Estimated Renovation Cost
          </h1>
          <p id="estimate-result-summary-renovation-description">
            {state.estimate.description}
          </p>
          <p id="estimate-result-summary-cost-range" className="estimate-result__cost">
            {state.estimate.currencyDisplay}
          </p>
          <p
            className="estimate-result__visually-hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {costAnnouncement}
          </p>
          <p id="estimate-result-summary-planning-caveat">
            These are estimates to help you plan.
          </p>
        </section>

        <section
          id="estimate-result-estimate-explanation"
          className="estimate-result__explanation"
        >
          <h2>
            <button
              id="estimate-result-explanation-accordion"
              type="button"
              aria-expanded={isExplanationExpanded}
              aria-controls="estimate-result-explanation-panel"
              onClick={() =>
                setIsExplanationExpanded((expanded) => !expanded)
              }
            >
              <span>Additional Information - How this was calculated</span>
              <Chevron expanded={isExplanationExpanded} />
            </button>
          </h2>
          <div
            id="estimate-result-explanation-panel"
            className="estimate-result__explanation-panel"
            hidden={!isExplanationExpanded}
          >
            <p>{calculationDetailsNotice}</p>
          </div>
        </section>

        <section
          id="estimate-result-next-actions-contact"
          className="estimate-result__actions-contact"
        >
          <div className="estimate-result__actions">
            <en-btn
              ref={editButtonRef}
              id="estimate-result-actions-edit-button"
              kind="secondary"
              size="sm"
              type="button"
            >
              Edit Estimate
            </en-btn>
            <en-btn
              ref={newEstimateButtonRef}
              id="estimate-result-actions-new-button"
              kind="primary"
              size="sm"
              type="button"
            >
              New Estimate
            </en-btn>
          </div>

          <div className="estimate-result__contact">
            <h2 id="estimate-result-contact-heading">
              Talk to a Home Loan Coach to learn about funding options
            </h2>
            <EnsembleIcon
              id="estimate-result-contact-phone-icon"
              className="estimate-result__phone-icon"
              createIcon={PhoneCall}
            />
            <p id="estimate-result-contact-call-label">Call us</p>
            <a
              id="estimate-result-contact-domestic-phone-link"
              className="estimate-result__domestic-phone"
              href="tel:08002694663"
            >
              0800 269 4663
            </a>
            <p id="estimate-result-contact-service-hours">
              Weekdays, 8am - 8.30pm
              <br />
              Weekends, 9am - 5pm
            </p>
            <a
              id="estimate-result-contact-international-phone-link"
              href="tel:+6444703165"
            >
              International: +64 4 470 3165
            </a>
          </div>
        </section>

        <section
          id="estimate-result-tips-disclaimer"
          className="estimate-result__tips"
          aria-label="Renovation tips"
        >
          <p id="estimate-result-tips-insurance-copy">
            TIP: Before starting your renovation, you should talk to your
            insurance provider to understand whether your house insurance will
            be affected. Also, once the job&apos;s done, remember to update your
            sum insured amount to reflect the renovations.
          </p>
          <p id="estimate-result-tips-council-copy">
            TIP: Consult your local council before starting any renovations.
          </p>
        </section>
      </main>
    </PageChrome>
  );
}

export function EstimateResultRecovery({
  recoveryRoute,
}: {
  recoveryRoute: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <PageChrome objectIdPrefix="estimate-result">
      <main className="estimate-result estimate-result--recovery">
        <h1 ref={headingRef} tabIndex={-1}>
          Estimate unavailable
        </h1>
        <p>
          Your estimate is no longer available. Return to your renovation
          details to calculate it again.
        </p>
        <button
          className="estimate-result__recovery-action"
          type="button"
          onClick={() => navigate(recoveryRoute)}
        >
          Return to renovation details
        </button>
      </main>
    </PageChrome>
  );
}
