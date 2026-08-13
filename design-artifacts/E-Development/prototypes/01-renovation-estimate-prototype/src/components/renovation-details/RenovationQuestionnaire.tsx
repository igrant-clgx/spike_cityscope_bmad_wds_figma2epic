import { useRef, useState } from "react";
import type { ElementRef, RefObject } from "react";
import CaretDown from "@ensemble/lib/icons/caret-down";
import { useNativeClick } from "../../hooks/useNativeClick";
import {
  externalRenovationNotice,
  fixedExampleNotice,
} from "../../prototype/fixture";
import { RESULT_ROUTE } from "../../routing/guards";
import { navigate } from "../../routing/navigation";
import { usePrototypeFlow } from "../../state/PrototypeFlowContext";
import type { RenovationType } from "../../state/prototypeFlow";
import { EnsembleIcon } from "../icons/EnsembleIcon";

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <EnsembleIcon
      className={`renovation-questionnaire__chevron${expanded ? " renovation-questionnaire__chevron--expanded" : ""}`}
      createIcon={CaretDown}
      size={20}
    />
  );
}

export function RenovationQuestionnaire() {
  const { state, dispatch } = usePrototypeFlow();
  const hasInternalType =
    state.renovationSelection.renovationType === "internal";
  const hasKitchen = state.renovationSelection.renovationItem === "Kitchen";
  const [isTypeExpanded, setIsTypeExpanded] = useState(!hasInternalType);
  const [isItemExpanded, setIsItemExpanded] = useState(
    hasInternalType && !hasKitchen,
  );
  const [isConfirmationExpanded, setIsConfirmationExpanded] =
    useState(hasKitchen);
  const selectedType = state.renovationSelection.renovationType;
  const itemHeadingRef = useRef<HTMLButtonElement>(null);
  const confirmationHeadingRef = useRef<HTMLButtonElement>(null);
  const [stepAnnouncement, setStepAnnouncement] = useState("");

  const focusHeading = (heading: RefObject<HTMLButtonElement>) => {
    window.requestAnimationFrame(() => heading.current?.focus());
  };

  const selectType = (renovationType: RenovationType) => {
    if (renovationType === "internal") {
      dispatch({ type: "SELECT_INTERNAL" });
      setIsTypeExpanded(false);
      setIsItemExpanded(true);
      setIsConfirmationExpanded(false);
      setStepAnnouncement("Step 2, What to renovate, is now available.");
      focusHeading(itemHeadingRef);
      return;
    }

    dispatch({ type: "SELECT_EXTERNAL" });
    setIsTypeExpanded(true);
    setIsItemExpanded(false);
    setIsConfirmationExpanded(false);
    setStepAnnouncement(externalRenovationNotice);
  };

  const selectKitchen = () => {
    dispatch({ type: "SELECT_RENOVATION_ITEM", item: "Kitchen" });
    setIsItemExpanded(false);
    setIsConfirmationExpanded(true);
    setStepAnnouncement("Step 3, More questions, is now available.");
    focusHeading(confirmationHeadingRef);
  };

  const viewExampleEstimate = () => {
    dispatch({ type: "CREATE_FIXED_ESTIMATE" });
    navigate(RESULT_ROUTE);
  };
  const estimateButtonRef = useNativeClick<ElementRef<"en-btn">>(
    viewExampleEstimate,
  );

  return (
    <section
      id="renovation-details-questionnaire"
      className="renovation-details__questionnaire renovation-questionnaire"
      aria-label="Renovation questionnaire"
    >
      <article
        id="renovation-details-questionnaire-type-accordion"
        className="renovation-questionnaire__step renovation-questionnaire__step--current"
      >
        <h2>
          <button
            className="renovation-questionnaire__heading"
            type="button"
            aria-expanded={isTypeExpanded}
            aria-controls="renovation-details-questionnaire-type-panel"
            onClick={() => setIsTypeExpanded((expanded) => !expanded)}
          >
            <span>Step 1: Renovation type</span>
            <Chevron expanded={isTypeExpanded} />
          </button>
        </h2>
        <div
          id="renovation-details-questionnaire-type-panel"
          className="renovation-questionnaire__panel"
          hidden={!isTypeExpanded}
        >
            <h3 id="renovation-details-questionnaire-type-question">
              Is an Internal or External renovation?
            </h3>
            <div
              className="renovation-questionnaire__options"
              aria-labelledby="renovation-details-questionnaire-type-question"
              role="group"
            >
              {(["internal", "external"] as const).map((renovationType) => {
                const isSelected = selectedType === renovationType;
                const label =
                  renovationType === "internal" ? "Internal" : "External";

                return (
                  <button
                    id={`renovation-details-questionnaire-${renovationType}-button`}
                    className={`renovation-questionnaire__option${isSelected ? " renovation-questionnaire__option--selected" : ""}`}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectType(renovationType)}
                    key={renovationType}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            {selectedType === "external" ? (
              <p
                id="renovation-details-questionnaire-external-notice"
                className="renovation-questionnaire__notice"
                role="status"
              >
                {externalRenovationNotice}
              </p>
            ) : null}
        </div>
      </article>

      <article
        id="renovation-details-questionnaire-items-accordion"
        className={`renovation-questionnaire__step${!hasInternalType ? " renovation-questionnaire__step--locked" : ""}`}
      >
        <h2>
          <button
            ref={itemHeadingRef}
            className="renovation-questionnaire__heading"
            type="button"
            aria-expanded={isItemExpanded}
            aria-controls="renovation-details-questionnaire-items-panel"
            aria-describedby={
              hasInternalType
                ? undefined
                : "renovation-details-questionnaire-items-prerequisite"
            }
            disabled={!hasInternalType}
            title={
              hasInternalType ? undefined : "Choose Internal to continue."
            }
            onClick={() => setIsItemExpanded((expanded) => !expanded)}
          >
            <span>Step 2: What to renovate</span>
            <Chevron expanded={isItemExpanded} />
          </button>
        </h2>
        {!hasInternalType ? (
          <span
            id="renovation-details-questionnaire-items-prerequisite"
            className="renovation-details__visually-hidden"
          >
            Choose Internal to continue.
          </span>
        ) : null}
        <div
          id="renovation-details-questionnaire-items-panel"
          className="renovation-questionnaire__panel"
          hidden={!hasInternalType || !isItemExpanded}
        >
            <h3 id="renovation-details-questionnaire-items-question">
              What do you want to renovate?
            </h3>
            <div
              className="renovation-questionnaire__options"
              aria-labelledby="renovation-details-questionnaire-items-question"
              role="group"
            >
              <button
                id="renovation-details-questionnaire-kitchen-button"
                className={`renovation-questionnaire__option${hasKitchen ? " renovation-questionnaire__option--selected" : ""}`}
                type="button"
                aria-pressed={hasKitchen}
                onClick={selectKitchen}
              >
                Kitchen
              </button>
            </div>
        </div>
      </article>

      <article
        id="renovation-details-questionnaire-more-accordion"
        className={`renovation-questionnaire__step${!hasKitchen ? " renovation-questionnaire__step--locked" : ""}`}
      >
        <h2>
          <button
            ref={confirmationHeadingRef}
            className="renovation-questionnaire__heading"
            type="button"
            aria-expanded={isConfirmationExpanded}
            aria-controls="renovation-details-questionnaire-more-panel"
            aria-describedby={
              hasKitchen
                ? undefined
                : "renovation-details-questionnaire-more-prerequisite"
            }
            disabled={!hasKitchen}
            title={hasKitchen ? undefined : "Choose Kitchen to continue."}
            onClick={() =>
              setIsConfirmationExpanded((expanded) => !expanded)
            }
          >
            <span>Step 3: More questions</span>
            <Chevron expanded={isConfirmationExpanded} />
          </button>
        </h2>
        {!hasKitchen ? (
          <span
            id="renovation-details-questionnaire-more-prerequisite"
            className="renovation-details__visually-hidden"
          >
            Choose Kitchen to continue.
          </span>
        ) : null}
        <div
          id="renovation-details-questionnaire-more-panel"
          className="renovation-questionnaire__panel"
          hidden={!hasKitchen || !isConfirmationExpanded}
        >
            <h3>Confirm your renovation</h3>
            <dl className="renovation-questionnaire__summary">
              <div>
                <dt>Renovation type</dt>
                <dd>Internal</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>Kitchen</dd>
              </div>
            </dl>
            <div className="renovation-questionnaire__supported-path">
              <p>{fixedExampleNotice}</p>
              <en-btn
                ref={estimateButtonRef}
                id="renovation-details-questionnaire-view-estimate-button"
                kind="primary"
                size="sm"
                type="button"
              >
                View example estimate
              </en-btn>
            </div>
        </div>
      </article>
      <p
        className="renovation-details__visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {stepAnnouncement}
      </p>
    </section>
  );
}
