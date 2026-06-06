import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCloseDate, formatMarketStatus } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

type MarketDetailInfoProps = {
  market: Market;
};

export function MarketDetailInfo({ market }: MarketDetailInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-2xl">{market.title}</CardTitle>
          <MarketStatusBadge status={market.status} />
        </div>
        <CardDescription className="text-base leading-relaxed">
          {market.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{formatMarketStatus(market.status)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Close date</dt>
            <dd className="font-medium">
              {formatCloseDate(market.close_date)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
