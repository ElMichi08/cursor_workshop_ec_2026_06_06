import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Market not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        This market does not exist or may have been removed.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link href="/markets">Back to markets</Link>
      </Button>
    </div>
  );
}
