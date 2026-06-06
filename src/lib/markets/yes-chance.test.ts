import { describe, expect, it } from "vitest";

import {
  computeYesChance,
  NEUTRAL_YES_CHANCE,
  resolveYesChance,
} from "@/lib/markets/yes-chance";

describe("computeYesChance", () => {
  it("calculates yes chance from aggregate totals", () => {
    expect(computeYesChance(7000, 3000)).toBe(0.7);
    expect(computeYesChance(2500, 7500)).toBe(0.25);
  });

  it("returns neutral baseline when totals are zero", () => {
    expect(computeYesChance(0, 0)).toBe(NEUTRAL_YES_CHANCE);
  });
});

describe("resolveYesChance", () => {
  it("uses neutral baseline when totals are unavailable", () => {
    expect(resolveYesChance(null)).toBe(NEUTRAL_YES_CHANCE);
  });

  it("computes from totals when available", () => {
    expect(resolveYesChance({ yesTotal: 6000, noTotal: 4000 })).toBe(0.6);
  });
});
