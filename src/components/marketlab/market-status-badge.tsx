import { Badge } from "@/components/ui/badge";
import { formatMarketStatus } from "@/lib/markets/format";
import type { MarketStatus } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

const statusVariant: Record<MarketStatus, "default" | "secondary" | "outline"> =
  {
    open: "default",
    closed: "secondary",
    resolved: "outline",
  };

type MarketStatusBadgeProps = {
  status: MarketStatus;
  className?: string;
};

export function MarketStatusBadge({
  status,
  className,
}: MarketStatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className={cn(className)}>
      {formatMarketStatus(status)}
    </Badge>
  );
}
