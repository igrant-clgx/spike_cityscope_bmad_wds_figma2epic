import { describe, expect, it } from "vitest";
import {
  prototypeEstimate,
  prototypeProperty,
} from "../prototype/fixture";
import {
  initialPrototypeFlowState,
  prototypeFlowReducer,
} from "./prototypeFlow";

describe("prototypeFlowReducer", () => {
  it("stores a selected property and clears dependent state", () => {
    const state = prototypeFlowReducer(initialPrototypeFlowState, {
      type: "SELECT_PROPERTY",
      property: prototypeProperty,
    });

    expect(state).toEqual({
      selectedProperty: prototypeProperty,
      renovationSelection: {
        renovationType: null,
        renovationItem: null,
      },
      estimate: null,
    });
  });

  it("creates the fixed Internal Kitchen estimate", () => {
    const withProperty = prototypeFlowReducer(initialPrototypeFlowState, {
      type: "SELECT_PROPERTY",
      property: prototypeProperty,
    });
    const withSelection = prototypeFlowReducer(withProperty, {
      type: "SELECT_INTERNAL",
    });
    const withItem = prototypeFlowReducer(withSelection, {
      type: "SELECT_RENOVATION_ITEM",
      item: "Kitchen",
    });
    const withEstimate = prototypeFlowReducer(withItem, {
      type: "CREATE_FIXED_ESTIMATE",
    });

    expect(withSelection.renovationSelection).toEqual({
      renovationType: "internal",
      renovationItem: null,
    });
    expect(withItem.renovationSelection).toEqual({
      renovationType: "internal",
      renovationItem: "Kitchen",
    });
    expect(withEstimate.estimate).toEqual(prototypeEstimate);
  });

  it("stores External in the reducer and clears unsupported downstream state", () => {
    const withProperty = prototypeFlowReducer(initialPrototypeFlowState, {
      type: "SELECT_PROPERTY",
      property: prototypeProperty,
    });
    const withInternal = prototypeFlowReducer(withProperty, {
      type: "SELECT_INTERNAL",
    });
    const withKitchen = prototypeFlowReducer(withInternal, {
      type: "SELECT_RENOVATION_ITEM",
      item: "Kitchen",
    });

    expect(
      prototypeFlowReducer(withKitchen, { type: "SELECT_EXTERNAL" }),
    ).toEqual({
      selectedProperty: prototypeProperty,
      renovationSelection: {
        renovationType: "external",
        renovationItem: null,
      },
      estimate: null,
    });
  });

  it("rejects estimate creation without prerequisites", () => {
    expect(() =>
      prototypeFlowReducer(initialPrototypeFlowState, {
        type: "CREATE_FIXED_ESTIMATE",
      }),
    ).toThrow("selected property and Internal Kitchen renovation");
  });

  it("retains the property when starting a new estimate", () => {
    const withProperty = prototypeFlowReducer(initialPrototypeFlowState, {
      type: "SELECT_PROPERTY",
      property: prototypeProperty,
    });
    const withSelection = prototypeFlowReducer(withProperty, {
      type: "SELECT_INTERNAL",
    });
    const withItem = prototypeFlowReducer(withSelection, {
      type: "SELECT_RENOVATION_ITEM",
      item: "Kitchen",
    });
    const withEstimate = prototypeFlowReducer(withItem, {
      type: "CREATE_FIXED_ESTIMATE",
    });

    expect(
      prototypeFlowReducer(withEstimate, { type: "START_NEW_ESTIMATE" }),
    ).toEqual({
      selectedProperty: prototypeProperty,
      renovationSelection: {
        renovationType: null,
        renovationItem: null,
      },
      estimate: null,
    });
  });

  it("retains state when editing and clears everything when resetting", () => {
    const withProperty = prototypeFlowReducer(initialPrototypeFlowState, {
      type: "SELECT_PROPERTY",
      property: prototypeProperty,
    });

    expect(
      prototypeFlowReducer(withProperty, { type: "EDIT_ESTIMATE" }),
    ).toBe(withProperty);
    expect(
      prototypeFlowReducer(withProperty, { type: "RESET_ADDRESS" }),
    ).toEqual(initialPrototypeFlowState);
  });
});
