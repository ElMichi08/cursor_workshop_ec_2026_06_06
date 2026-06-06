import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatYesChance } from "@/lib/markets/format";

type OutcomesSummaryProps = {
  yesChance: number;
};

export function OutcomesSummary({ yesChance }: OutcomesSummaryProps) {
  const noChance = 1 - yesChance;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outcomes</CardTitle>
        <CardDescription>
          Current Yes/No balance based on market activity (fake money).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium text-muted-foreground">Yes</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatYesChance(yesChance)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium text-muted-foreground">No</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {formatYesChance(noChance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
