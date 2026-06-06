import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BuyPlaceholder } from "@/components/marketlab/buy-placeholder";
import { EmptyMarkets } from "@/components/marketlab/empty-markets";
import { MarketCard } from "@/components/marketlab/market-card";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import type { Market } from "@/lib/markets/types";

const sampleMarket: Market = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "Will it rain tomorrow?",
  description: "A fictional weather market for the workshop.",
  status: "open",
  close_date: "2099-01-01T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("market UI components", () => {
  it("renders a market card with title, status, and close date", () => {
    const html = renderToStaticMarkup(<MarketCard market={sampleMarket} />);

    expect(html).toContain("Will it rain tomorrow?");
    expect(html).toContain("Open");
    expect(html).toContain("View details");
    expect(html).not.toContain("quito.png");
    expect(html).not.toContain("hero2-bg");
  });

  it("renders empty market state", () => {
    const html = renderToStaticMarkup(<EmptyMarkets />);

    expect(html).toContain("No markets yet");
    expect(html).toContain("fake money");
  });

  it("renders probability chart svg", () => {
    const html = renderToStaticMarkup(
      <ProbabilityChart
        points={[
          { at: "2026-01-01T00:00:00.000Z", yesChance: 0.5 },
          { at: "2026-06-01T00:00:00.000Z", yesChance: 0.5 },
        ]}
        isFlatFallback
        chartLabel="Current market sentiment (no trade history yet)"
        yesChance={0.5}
      />,
    );

    expect(html).toContain("<svg");
    expect(html).toContain("50%");
    expect(html).toContain('data-flat-fallback="true"');
  });

  it("shows buying unavailable for closed markets", () => {
    const html = renderToStaticMarkup(
      <BuyPlaceholder market={{ ...sampleMarket, status: "closed" }} />,
    );

    expect(html).toContain('data-buyable="false"');
    expect(html).toContain("closed for trading");
  });
});
