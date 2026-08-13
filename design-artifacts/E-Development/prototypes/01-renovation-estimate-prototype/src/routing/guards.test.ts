import { describe, expect, it } from "vitest";
import {
  prototypeEstimate,
  prototypeProperty,
} from "../prototype/fixture";
import {
  initialPrototypeFlowState,
  type PrototypeFlowState,
} from "../state/prototypeFlow";
import {
  DETAILS_ROUTE,
  SEARCH_ROUTE,
  getDetailsGuard,
  getResultGuard,
} from "./guards";

describe("route guards", () => {
  it("redirects Details to Address Search when property state is missing", () => {
    expect(getDetailsGuard(initialPrototypeFlowState)).toEqual({
      allowed: false,
      redirect: SEARCH_ROUTE,
    });
  });

  it("provides Result recovery to Details when estimate state is missing", () => {
    expect(getResultGuard(initialPrototypeFlowState)).toEqual({
      allowed: false,
      recoveryRoute: DETAILS_ROUTE,
    });
  });

  it("allows routes when their prerequisites exist", () => {
    const state: PrototypeFlowState = {
      selectedProperty: prototypeProperty,
      renovationSelection: {
        renovationType: "internal",
        renovationItem: "Kitchen",
      },
      estimate: prototypeEstimate,
    };

    expect(getDetailsGuard(state)).toEqual({ allowed: true });
    expect(getResultGuard(state)).toEqual({ allowed: true });
  });

  it("rejects a stale estimate without the current Internal Kitchen answers", () => {
    const staleState: PrototypeFlowState = {
      selectedProperty: prototypeProperty,
      renovationSelection: {
        renovationType: "external",
        renovationItem: null,
      },
      estimate: prototypeEstimate,
    };

    expect(getResultGuard(staleState)).toEqual({
      allowed: false,
      recoveryRoute: DETAILS_ROUTE,
    });
  });
});
