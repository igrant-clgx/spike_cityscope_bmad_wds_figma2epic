import { afterEach, describe, expect, it, vi } from "vitest";
import { navigate } from "./navigation";

describe("navigate", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("pushes normal navigation and replaces recovery navigation", () => {
    const pushState = vi.fn();
    const replaceState = vi.fn();
    const dispatchEvent = vi.fn();

    vi.stubGlobal("window", {
      location: { pathname: "/start" },
      history: { pushState, replaceState },
      dispatchEvent,
    });
    vi.stubGlobal(
      "PopStateEvent",
      class {
        type: string;

        constructor(type: string) {
          this.type = type;
        }
      },
    );

    navigate("/next");
    navigate("/recovery", { replace: true });

    expect(pushState).toHaveBeenCalledWith({}, "", "/next");
    expect(replaceState).toHaveBeenCalledWith({}, "", "/recovery");
    expect(dispatchEvent).toHaveBeenCalledTimes(2);
  });
});
