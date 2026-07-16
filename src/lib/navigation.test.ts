import { describe, expect, it } from "vitest";

import { buildAppRoute } from "./navigation";

describe("buildAppRoute", () => {
  it("builds an internal app route with query params", () => {
    expect(
      buildAppRoute("/seller-onboarding", {
        flow: "seller-payment",
        next: "/seller-onboarding",
      })
    ).toBe("/seller-onboarding?flow=seller-payment&next=%2Fseller-onboarding");
  });
});
