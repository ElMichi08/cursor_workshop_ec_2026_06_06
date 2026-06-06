import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyPlaceholder } from "@/components/marketlab/buy-placeholder";
import { MarketDetailInfo } from "@/components/marketlab/market-detail-info";
import { OutcomesSummary } from "@/components/marketlab/outcomes-summary";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { getMarketAnalytics, getMarketById } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    return { title: "Market not found | MarketLab" };
  }

  return {
    title: `${market.title} | MarketLab`,
    description: market.description,
  };
}

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const analytics = await getMarketAnalytics(market);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/markets"
        className="mb-6 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to markets
      </Link>

      <div className="space-y-6">
        <MarketDetailInfo market={market} />
        <OutcomesSummary yesChance={analytics.yesChance} />
        <ProbabilityChart
          points={analytics.points}
          isFlatFallback={analytics.isFlatFallback}
          chartLabel={analytics.chartLabel}
          yesChance={analytics.yesChance}
        />
        <BuyPlaceholder market={market} />
      </div>
    </div>
  );
}
