import type { PrototypeFlowState } from "../state/prototypeFlow";

export const SEARCH_ROUTE = "/renocalc/ceshllg/search";
export const DETAILS_ROUTE = "/renocalc/ceshllg/search/details";
export const RESULT_ROUTE = "/renocalc/ceshllg/result";

export type DetailsGuardResult =
  | { allowed: true }
  | { allowed: false; redirect: typeof SEARCH_ROUTE };

export type ResultGuardResult =
  | { allowed: true }
  | { allowed: false; recoveryRoute: typeof DETAILS_ROUTE };

export function getDetailsGuard(
  state: PrototypeFlowState,
): DetailsGuardResult {
  return state.selectedProperty
    ? { allowed: true }
    : { allowed: false, redirect: SEARCH_ROUTE };
}

export function getResultGuard(state: PrototypeFlowState): ResultGuardResult {
  return state.selectedProperty &&
    state.renovationSelection.renovationType === "internal" &&
    state.renovationSelection.renovationItem === "Kitchen" &&
    state.estimate
    ? { allowed: true }
    : { allowed: false, recoveryRoute: DETAILS_ROUTE };
}
