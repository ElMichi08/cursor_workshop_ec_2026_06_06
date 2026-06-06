import type { Database } from "@/lib/supabase/database.types";

export type Market = Database["public"]["Tables"]["markets"]["Row"];
export type MarketStatus = Market["status"];
export type LedgerEntry = Database["public"]["Tables"]["ledger_entries"]["Row"];

export type PositionTotals = {
  yesTotal: number;
  noTotal: number;
};

export type ProbabilityPoint = {
  at: string;
  yesChance: number;
};

export type MarketAnalytics = {
  yesChance: number;
  points: ProbabilityPoint[];
  isFlatFallback: boolean;
  chartLabel: string;
};
