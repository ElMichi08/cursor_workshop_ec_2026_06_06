import type { LedgerEntry, ProbabilityPoint } from "@/lib/markets/types";
import { computeYesChance } from "@/lib/markets/yes-chance";

const TRADE_TYPES = new Set(["trade_buy", "trade_sell"]);

export function parseTradeSide(
  description: string | null,
): "yes" | "no" | null {
  if (!description) {
    return null;
  }
  const match = description.match(/\b(yes|no)\b/i);
  if (!match) {
    return null;
  }
  return match[1].toLowerCase() as "yes" | "no";
}

export function buildFlatSeries(
  createdAt: string,
  yesChance: number,
  now = new Date().toISOString(),
): ProbabilityPoint[] {
  return [
    { at: createdAt, yesChance },
    { at: now, yesChance },
  ];
}

export function buildSeriesFromLedger(
  entries: Pick<
    LedgerEntry,
    "amount_cents" | "created_at" | "description" | "entry_type"
  >[],
  initialYesTotal = 0,
  initialNoTotal = 0,
): ProbabilityPoint[] | null {
  const tradeEntries = entries
    .filter((entry) => TRADE_TYPES.has(entry.entry_type))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  if (tradeEntries.length === 0) {
    return null;
  }

  let yesTotal = initialYesTotal;
  let noTotal = initialNoTotal;
  const points: ProbabilityPoint[] = [];

  for (const entry of tradeEntries) {
    const side = parseTradeSide(entry.description);
    if (!side) {
      return null;
    }

    const delta = Math.abs(entry.amount_cents);
    if (entry.entry_type === "trade_buy") {
      if (side === "yes") {
        yesTotal += delta;
      } else {
        noTotal += delta;
      }
    } else if (entry.entry_type === "trade_sell") {
      if (side === "yes") {
        yesTotal = Math.max(0, yesTotal - delta);
      } else {
        noTotal = Math.max(0, noTotal - delta);
      }
    }

    points.push({
      at: entry.created_at,
      yesChance: computeYesChance(yesTotal, noTotal),
    });
  }

  return points.length > 0 ? points : null;
}

export function filterPointsByRange(
  points: ProbabilityPoint[],
  range: "all" | "7d" | "24h",
  now = Date.now(),
): ProbabilityPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const cutoffMs =
    range === "7d" ? now - 7 * 24 * 60 * 60 * 1000 : now - 24 * 60 * 60 * 1000;

  const filtered = points.filter(
    (point) => new Date(point.at).getTime() >= cutoffMs,
  );

  if (filtered.length === 0) {
    const lastPoint = points.at(-1);
    return lastPoint ? [lastPoint] : points;
  }

  return filtered;
}
