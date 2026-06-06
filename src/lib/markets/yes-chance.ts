import type { PositionTotals } from "@/lib/markets/types";

/** Neutral baseline when market-wide position aggregates are unavailable or empty. */
export const NEUTRAL_YES_CHANCE = 0.5;

export function computeYesChance(yesTotal: number, noTotal: number): number {
  const total = yesTotal + noTotal;
  if (total <= 0) {
    return NEUTRAL_YES_CHANCE;
  }
  return yesTotal / total;
}

export function resolveYesChance(totals: PositionTotals | null): number {
  if (!totals) {
    return NEUTRAL_YES_CHANCE;
  }
  return computeYesChance(totals.yesTotal, totals.noTotal);
}
