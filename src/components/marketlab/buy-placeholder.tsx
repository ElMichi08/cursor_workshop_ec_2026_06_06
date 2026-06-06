import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isMarketBuyable } from "@/lib/markets/is-market-buyable";
import type { Market } from "@/lib/markets/types";

type BuyPlaceholderProps = {
  market: Market;
};

export function BuyPlaceholder({ market }: BuyPlaceholderProps) {
  const buyable = isMarketBuyable(market);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>
          {buyable
            ? "Buying and selling will be enabled in a later workshop step."
            : "Trading is unavailable for this market."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground"
          data-buyable={buyable ? "true" : "false"}
        >
          {buyable
            ? "Buy Yes / Buy No controls coming soon."
            : market.status === "resolved"
              ? "This market has been resolved."
              : "This market is closed for trading."}
        </div>
      </CardContent>
    </Card>
  );
}
