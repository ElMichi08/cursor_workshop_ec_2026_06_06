import type { MarketStatus } from "@/lib/markets/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const statusLabels: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

export function formatMarketStatus(status: MarketStatus): string {
  return statusLabels[status];
}

export function formatCloseDate(closeDate: string): string {
  return dateFormatter.format(new Date(closeDate));
}

export function formatYesChance(yesChance: number): string {
  return `${Math.round(yesChance * 100)}%`;
}
