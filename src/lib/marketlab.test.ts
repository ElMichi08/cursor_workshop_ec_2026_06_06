import { describe, expect, it } from "vitest";

import { calculateMarketStats } from "@/lib/marketlab";

describe("calculateMarketStats", () => {
  it("starts markets at even odds", () => {
    expect(calculateMarketStats([])).toEqual({
      noPoolCents: 0,
      noPrice: 50,
      volumeCents: 0,
      yesPoolCents: 0,
      yesPrice: 50,
    });
  });

  it("prices each side from stake pools", () => {
    const stats = calculateMarketStats([
      { amountCents: 7500, side: "yes" },
      { amountCents: 2500, side: "no" },
    ]);

    expect(stats.yesPrice).toBe(75);
    expect(stats.noPrice).toBe(25);
    expect(stats.volumeCents).toBe(10000);
  });

  it("keeps active market prices inside 1 and 99 percent", () => {
    const stats = calculateMarketStats([{ amountCents: 1000, side: "yes" }]);

    expect(stats.yesPrice).toBe(99);
    expect(stats.noPrice).toBe(1);
  });
});
