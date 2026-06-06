import {
  buildFlatSeries,
  buildSeriesFromLedger,
} from "@/lib/markets/probability-series";
import type {
  LedgerEntry,
  Market,
  MarketAnalytics,
  PositionTotals,
} from "@/lib/markets/types";
import { resolveYesChance } from "@/lib/markets/yes-chance";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const FLAT_FALLBACK_LABEL = "Current market sentiment (no trade history yet)";
const HISTORY_LABEL = "Yes probability over time";

export async function getMarkets(): Promise<{
  markets: Market[];
  error: string | null;
}> {
  if (!isSupabaseConfigured) {
    return { markets: [], error: "Supabase is not configured." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("close_date", { ascending: true });

  if (error) {
    return { markets: [], error: error.message };
  }

  return { markets: data ?? [], error: null };
}

export async function getMarketById(id: string): Promise<Market | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Attempts market-wide position aggregation. Under owner-scoped RLS the query
 * only returns the current user's row(s), which is not a market aggregate.
 */
export async function getMarketPositionTotals(
  marketId: string,
): Promise<PositionTotals | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents, user_id")
    .eq("market_id", marketId);

  if (error || !data || data.length === 0) {
    return null;
  }

  const uniqueUsers = new Set(data.map((row) => row.user_id));
  if (uniqueUsers.size <= 1) {
    return null;
  }

  return data.reduce<PositionTotals>(
    (totals, row) => ({
      yesTotal: totals.yesTotal + row.yes_shares_cents,
      noTotal: totals.noTotal + row.no_shares_cents,
    }),
    { yesTotal: 0, noTotal: 0 },
  );
}

/**
 * Attempts market-wide ledger reads. Owner-scoped RLS limits results to the
 * current user, so entries are only usable when multiple users appear (future RPC).
 */
export async function getMarketLedgerEntries(
  marketId: string,
): Promise<LedgerEntry[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("*")
    .eq("market_id", marketId)
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return [];
  }

  const uniqueUsers = new Set(data.map((row) => row.user_id));
  if (uniqueUsers.size <= 1) {
    return [];
  }

  return data;
}

export async function getMarketAnalytics(
  market: Market,
): Promise<MarketAnalytics> {
  const totals = await getMarketPositionTotals(market.id);
  const yesChance = resolveYesChance(totals);

  const ledgerEntries = await getMarketLedgerEntries(market.id);
  const historicalPoints = buildSeriesFromLedger(ledgerEntries);

  if (historicalPoints && historicalPoints.length > 0) {
    return {
      yesChance,
      points: historicalPoints,
      isFlatFallback: false,
      chartLabel: HISTORY_LABEL,
    };
  }

  return {
    yesChance,
    points: buildFlatSeries(market.created_at, yesChance),
    isFlatFallback: true,
    chartLabel: FLAT_FALLBACK_LABEL,
  };
}
