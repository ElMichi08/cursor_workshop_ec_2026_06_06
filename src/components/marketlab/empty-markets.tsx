import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EmptyMarkets() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>No markets yet</CardTitle>
        <CardDescription>
          Browse fictional Yes/No markets using fake money. When sample markets
          are added to Supabase, they will appear here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Markets are read-only in this workshop step. Trading and account
          features come later.
        </p>
      </CardContent>
    </Card>
  );
}
