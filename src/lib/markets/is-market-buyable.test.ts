import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";

const baseMarket: Pick<Market, "status" | "close_date"> = {
  status: "open",
  close_date: "2099-01-01T00:00:00.000Z",
};

describe("isMarketBuyable", () => {
  it("returns true for open markets before close date", () => {
    expect(
      isMarketBuyable(baseMarket, new Date("2026-01-01T00:00:00.000Z")),
    ).toBe(true);
  });

  it("returns false for closed markets", () => {
    expect(
      isMarketBuyable(
        { ...baseMarket, status: "closed" },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("returns false for resolved markets", () => {
    expect(
      isMarketBuyable(
        { ...baseMarket, status: "resolved" },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("returns false when close date has passed", () => {
    expect(
      isMarketBuyable(
        { ...baseMarket, close_date: "2020-01-01T00:00:00.000Z" },
        new Date("2026-01-01T00:00:00.000Z"),
      ),
    ).toBe(false);
  });
});
