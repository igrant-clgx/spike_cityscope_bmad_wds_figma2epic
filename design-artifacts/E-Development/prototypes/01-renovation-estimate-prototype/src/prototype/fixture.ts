import demoData from "../../data/demo-data.json";
import type { PrototypeEstimate, SelectedProperty } from "../state/prototypeFlow";

export const prototypeProperty: SelectedProperty = {
  id: demoData.property.id,
  displayAddress: demoData.property.displayAddress,
};

export const prototypeEstimate: PrototypeEstimate = {
  description: demoData.estimate.description,
  minimumAmount: demoData.estimate.minimumAmount,
  maximumAmount: demoData.estimate.maximumAmount,
  currencyDisplay: demoData.estimate.currencyDisplay,
};

if (demoData.renovationSelection.renovationItem !== "Kitchen") {
  throw new Error("The prototype fixture must use the approved Kitchen renovation item.");
}

export const prototypeRenovationItem: "Kitchen" =
  demoData.renovationSelection.renovationItem;

export const externalRenovationNotice =
  demoData.prototypeNotices.externalRenovation;

export const fixedExampleNotice = demoData.prototypeNotices.lockedSteps;

export const advancedSearchNotice =
  demoData.prototypeNotices.advancedSearch;

export const calculationDetailsNotice =
  demoData.prototypeNotices.calculationDetails;
