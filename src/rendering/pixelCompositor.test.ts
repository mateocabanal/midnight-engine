import { describe, expect, it } from "vitest";
import { getPixelRenderScale } from "./pixelCompositor";

describe("pixel compositor", () => {
  it("uses the logical half-resolution target unless the viewport is too short", () => {
    expect(getPixelRenderScale(540)).toBe(0.5);
    expect(getPixelRenderScale(320)).toBe(0.5);
    expect(getPixelRenderScale(319)).toBe(1);
  });
});
