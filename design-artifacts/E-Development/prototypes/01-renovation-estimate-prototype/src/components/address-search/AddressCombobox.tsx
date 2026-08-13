import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import MagnifyingGlass from "@ensemble/lib/icons/magnifying-glass";
import { EnsembleIcon } from "../icons/EnsembleIcon";
import { prototypeProperty } from "../../prototype/fixture";
import { DETAILS_ROUTE } from "../../routing/guards";
import { navigate } from "../../routing/navigation";
import { usePrototypeFlow } from "../../state/PrototypeFlowContext";
import type { SelectedProperty } from "../../state/prototypeFlow";
import "./address-combobox.css";

export const addressValidationMessages = {
  required: "Enter a property address.",
  tooLong: "Use 200 characters or fewer.",
  notSelected: "Select an address from the suggestions.",
  notFound:
    "We couldn't find that address. Try another address or use advanced search.",
} as const;

export function getPrototypeSuggestions(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("en-AU");

  if (
    normalizedQuery.length === 0 ||
    !prototypeProperty.displayAddress
      .toLocaleLowerCase("en-AU")
      .includes(normalizedQuery)
  ) {
    return [];
  }

  return [prototypeProperty];
}

export function getAddressValidationMessage(
  query: string,
  selectedProperty: SelectedProperty | null,
): string | null {
  if (query.trim().length === 0) {
    return addressValidationMessages.required;
  }

  if (query.length > 200) {
    return addressValidationMessages.tooLong;
  }

  if (getPrototypeSuggestions(query).length === 0) {
    return addressValidationMessages.notFound;
  }

  if (
    selectedProperty?.id === prototypeProperty.id &&
    selectedProperty.displayAddress === query
  ) {
    return null;
  }

  return addressValidationMessages.notSelected;
}

export function AddressCombobox() {
  const { state, dispatch } = usePrototypeFlow();
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const listboxId = `address-search-listbox-${generatedId.replaceAll(":", "")}`;
  const optionId = `${listboxId}-option`;
  const [query, setQuery] = useState(
    state.selectedProperty?.displayAddress ?? "",
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const [announcement, setAnnouncement] = useState("");
  const suggestions = useMemo(() => getPrototypeSuggestions(query), [query]);

  useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 768px) and (pointer: fine)").matches
    ) {
      inputRef.current?.focus();
    }
  }, []);

  const selectProperty = () => {
    dispatch({ type: "SELECT_PROPERTY", property: prototypeProperty });
    setQuery(prototypeProperty.displayAddress);
    setIsOpen(false);
    setActiveIndex(-1);
    setValidationMessage(null);
    setAnnouncement("Property address selected.");
    navigate(DETAILS_ROUTE);
  };

  const validate = () => {
    setValidationMessage(
      getAddressValidationMessage(query, state.selectedProperty),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (
      (event.key === "ArrowDown" || event.key === "ArrowUp") &&
      suggestions.length > 0
    ) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(0);
      return;
    }

    if (event.key === "Enter" && isOpen && activeIndex === 0) {
      event.preventDefault();
      selectProperty();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      validate();
    }
  };

  return (
    <div className="address-combobox">
      <label
        className="address-combobox__visually-hidden"
        htmlFor="address-search-hero-property-address-input"
      >
        Property address
      </label>
      <div className="address-combobox__control">
        <EnsembleIcon
          className="address-combobox__search-icon"
          createIcon={MagnifyingGlass}
        />
        <input
          ref={inputRef}
          id="address-search-hero-property-address-input"
          className="address-combobox__input"
          type="search"
          role="combobox"
          aria-label="Property address"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-required="true"
          aria-describedby={
            validationMessage ? "address-search-address-error" : undefined
          }
          aria-invalid={validationMessage ? "true" : undefined}
          aria-activedescendant={
            isOpen && activeIndex === 0 ? optionId : undefined
          }
          autoComplete="street-address"
          placeholder="Enter Address"
          required
          value={query}
          onChange={(event) => {
            const nextQuery = event.currentTarget.value;
            if (state.selectedProperty) {
              dispatch({ type: "RESET_ADDRESS" });
            }
            setQuery(nextQuery);
            const nextSuggestions = getPrototypeSuggestions(nextQuery);
            setIsOpen(nextSuggestions.length > 0);
            setActiveIndex(-1);
            setValidationMessage(
              nextQuery.length > 200
                ? addressValidationMessages.tooLong
                : nextQuery.trim().length > 0 && nextSuggestions.length === 0
                  ? addressValidationMessages.notFound
                  : null,
            );
            setAnnouncement(
              nextQuery.trim().length === 0
                ? ""
                : nextSuggestions.length > 0
                  ? "1 address suggestion available."
                  : "No address suggestions available.",
            );
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            setIsOpen(false);
            setActiveIndex(-1);
            validate();
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isOpen && suggestions.length > 0 ? (
        <ul id={listboxId} className="address-combobox__listbox" role="listbox">
          <li
            id={optionId}
            className="address-combobox__option"
            role="option"
            aria-selected={activeIndex === 0}
            onMouseDown={(event) => event.preventDefault()}
            onPointerDown={(event) => event.preventDefault()}
            onClick={selectProperty}
          >
            {prototypeProperty.displayAddress}
          </li>
        </ul>
      ) : null}
      {validationMessage ? (
        <p
          id="address-search-address-error"
          className="address-combobox__error"
          role="alert"
        >
          {validationMessage}
        </p>
      ) : null}
      <p
        className="address-combobox__visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </p>
    </div>
  );
}
