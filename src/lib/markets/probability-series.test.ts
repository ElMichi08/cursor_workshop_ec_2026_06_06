import { describe, expect, it } from "vitest";

import {
  buildFlatSeries,
  buildSeriesFromLedger,
  filterPointsByRange,
  parseTradeSide,
} from "@/lib/markets/probability-series";

describe("parseTradeSide", () => {
  it("parses yes/no from descriptions", () => {
    expect(parseTradeSide("Buy Yes shares")).toBe("yes");
    expect(parseTradeSide("Sold NO position")).toBe("no");
    expect(parseTradeSide("Market payout")).toBeNull();
  });
});

describe("buildFlatSeries", () => {
  it("returns stable two-point flat series", () => {
    const points = buildFlatSeries(
      "2026-01-01T00:00:00.000Z",
      0.5,
      "2026-06-01T00:00:00.000Z",
    );

    expect(points).toEqual([
      { at: "2026-01-01T00:00:00.000Z", yesChance: 0.5 },
      { at: "2026-06-01T00:00:00.000Z", yesChance: 0.5 },
    ]);
  });
});

describe("buildSeriesFromLedger", () => {
  it("builds historical points when ledger includes sides", () => {
    const points = buildSeriesFromLedger([
      {
        amount_cents: 1000,
        created_at: "2026-01-01T00:00:00.000Z",
        description: "Buy Yes shares",
        entry_type: "trade_buy",
      },
      {
        amount_cents: 500,
        created_at: "2026-01-02T00:00:00.000Z",
        description: "Buy No shares",
        entry_type: "trade_buy",
      },
    ]);

    expect(points).toEqual([
      { at: "2026-01-01T00:00:00.000Z", yesChance: 1 },
      { at: "2026-01-02T00:00:00.000Z", yesChance: 1000 / 1500 },
    ]);
  });

  it("returns null when ledger lacks parseable sides", () => {
    const points = buildSeriesFromLedger([
      {
        amount_cents: 1000,
        created_at: "2026-01-01T00:00:00.000Z",
        description: "Trade without side",
        entry_type: "trade_buy",
      },
    ]);

    expect(points).toBeNull();
  });
});

describe("filterPointsByRange", () => {
  const points = [
    { at: "2026-01-01T00:00:00.000Z", yesChance: 0.4 },
    { at: "2026-05-20T00:00:00.000Z", yesChance: 0.6 },
    { at: "2026-06-05T00:00:00.000Z", yesChance: 0.55 },
  ];

  it("returns all points for all range", () => {
    expect(filterPointsByRange(points, "all")).toEqual(points);
  });

  it("filters to recent window", () => {
    const filtered = filterPointsByRange(
      points,
      "7d",
      new Date("2026-06-06T00:00:00.000Z").getTime(),
    );
    expect(filtered).toEqual([points[2]]);
  });
});
