"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYesChance } from "@/lib/markets/format";
import { filterPointsByRange } from "@/lib/markets/probability-series";
import type { ProbabilityPoint } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

type ChartRange = "all" | "7d" | "24h";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 };

type ProbabilityChartProps = {
  points: ProbabilityPoint[];
  isFlatFallback: boolean;
  chartLabel: string;
  yesChance: number;
};

function buildPath(
  points: ProbabilityPoint[],
  width: number,
  height: number,
): string {
  if (points.length === 0) {
    return "";
  }

  const innerWidth = width - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;
  const times = points.map((point) => new Date(point.at).getTime());
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeSpan = Math.max(maxTime - minTime, 1);

  const coords = points.map((point) => {
    const x =
      PADDING.left +
      ((new Date(point.at).getTime() - minTime) / timeSpan) * innerWidth;
    const y = PADDING.top + (1 - point.yesChance) * innerHeight;
    return { x, y };
  });

  return coords
    .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x} ${coord.y}`)
    .join(" ");
}

export function ProbabilityChart({
  points,
  isFlatFallback,
  chartLabel,
  yesChance,
}: ProbabilityChartProps) {
  const [range, setRange] = useState<ChartRange>("all");

  const visiblePoints = useMemo(
    () => filterPointsByRange(points, range),
    [points, range],
  );

  const path = buildPath(visiblePoints, CHART_WIDTH, CHART_HEIGHT);
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Yes probability</CardTitle>
            <CardDescription>{chartLabel}</CardDescription>
          </div>
          <p className="text-2xl font-semibold tracking-tight">
            {formatYesChance(yesChance)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["7d", "7D"],
              ["24h", "24H"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              size="xs"
              variant={range === value ? "default" : "outline"}
              onClick={() => setRange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto w-full min-w-[320px] text-chart-1"
            role="img"
            aria-label={`Yes probability chart. Current chance ${formatYesChance(yesChance)}.`}
            data-flat-fallback={isFlatFallback ? "true" : "false"}
          >
            <title>Yes probability over time</title>
            {yTicks.map((tick) => {
              const y =
                PADDING.top +
                (1 - tick / 100) *
                  (CHART_HEIGHT - PADDING.top - PADDING.bottom);
              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    className="stroke-border"
                    strokeWidth={1}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}
            <path
              d={path}
              fill="none"
              className={cn("stroke-chart-1")}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {isFlatFallback ? (
          <p className="text-xs text-muted-foreground">
            Flat line shows the current market balance, not historical price
            movement.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
