import { EmptyMarkets } from "@/components/marketlab/empty-markets";
import { MarketCard } from "@/components/marketlab/market-card";
import { getMarkets } from "@/lib/markets/queries";

export const metadata = {
  title: "Markets | MarketLab",
  description: "Browse fictional Yes/No markets using fake money.",
};

export default async function MarketsPage() {
  const { markets, error } = await getMarkets();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse fictional Yes/No markets using fake money. Pick a market to see
          details and current sentiment.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Could not load markets: {error}
        </div>
      ) : null}

      {markets.length === 0 ? (
        <EmptyMarkets />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
