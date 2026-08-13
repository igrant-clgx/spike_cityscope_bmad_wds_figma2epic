import {
  prototypeEstimate,
  prototypeRenovationItem,
} from "../prototype/fixture";

export interface SelectedProperty {
  id: string;
  displayAddress: string;
}

export type RenovationType = "internal" | "external";

export interface PrototypeRenovationSelection {
  renovationType: RenovationType | null;
  renovationItem: "Kitchen" | null;
}

export interface PrototypeEstimate {
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  currencyDisplay: string;
}

export interface PrototypeFlowState {
  selectedProperty: SelectedProperty | null;
  renovationSelection: PrototypeRenovationSelection;
  estimate: PrototypeEstimate | null;
}

export type PrototypeFlowAction =
  | { type: "SELECT_PROPERTY"; property: SelectedProperty }
  | { type: "SELECT_INTERNAL" }
  | { type: "SELECT_EXTERNAL" }
  | { type: "SELECT_RENOVATION_ITEM"; item: "Kitchen" }
  | { type: "CREATE_FIXED_ESTIMATE" }
  | { type: "EDIT_ESTIMATE" }
  | { type: "START_NEW_ESTIMATE" }
  | { type: "RESET_ADDRESS" };

const emptySelection: PrototypeRenovationSelection = {
  renovationType: null,
  renovationItem: null,
};

export const initialPrototypeFlowState: PrototypeFlowState = {
  selectedProperty: null,
  renovationSelection: emptySelection,
  estimate: null,
};

export function prototypeFlowReducer(
  state: PrototypeFlowState,
  action: PrototypeFlowAction,
): PrototypeFlowState {
  switch (action.type) {
    case "SELECT_PROPERTY":
      return {
        selectedProperty: action.property,
        renovationSelection: emptySelection,
        estimate: null,
      };
    case "SELECT_INTERNAL":
      if (!state.selectedProperty) {
        throw new Error("A property must be selected before choosing a renovation type.");
      }
      return {
        ...state,
        renovationSelection: {
          renovationType: "internal",
          renovationItem:
            state.renovationSelection.renovationType === "internal"
              ? state.renovationSelection.renovationItem
              : null,
        },
        estimate: null,
      };
    case "SELECT_EXTERNAL":
      if (!state.selectedProperty) {
        throw new Error("A property must be selected before choosing a renovation type.");
      }
      return {
        ...state,
        renovationSelection: {
          renovationType: "external",
          renovationItem: null,
        },
        estimate: null,
      };
    case "SELECT_RENOVATION_ITEM":
      if (
        !state.selectedProperty ||
        state.renovationSelection.renovationType !== "internal"
      ) {
        throw new Error("Internal renovation must be selected before choosing an item.");
      }
      return {
        ...state,
        renovationSelection: {
          ...state.renovationSelection,
          renovationItem: action.item,
        },
        estimate: null,
      };
    case "CREATE_FIXED_ESTIMATE":
      if (
        !state.selectedProperty ||
        state.renovationSelection.renovationType !== "internal" ||
        state.renovationSelection.renovationItem !== prototypeRenovationItem
      ) {
        throw new Error(
          "The fixed estimate requires a selected property and Internal Kitchen renovation.",
        );
      }
      return { ...state, estimate: prototypeEstimate };
    case "EDIT_ESTIMATE":
      return state;
    case "START_NEW_ESTIMATE":
      return {
        ...state,
        renovationSelection: emptySelection,
        estimate: null,
      };
    case "RESET_ADDRESS":
      return initialPrototypeFlowState;
  }
}
