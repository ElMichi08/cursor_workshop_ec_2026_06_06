import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { formatFakeBalance } from "@/lib/profile/format";
import type { ProfileSummary } from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

type AuthHeaderProps = {
  user: { id: string; email?: string } | null;
  profile: ProfileSummary | null;
  profileError?: string | null;
  className?: string;
};

export function AuthHeader({
  user,
  profile,
  profileError,
  className,
}: AuthHeaderProps) {
  if (!user) {
    return (
      <div
        data-slot="auth"
        className={cn("flex items-center gap-2", className)}
      >
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div data-slot="auth" className={cn("flex items-center gap-2", className)}>
      <div
        role="status"
        className="hidden rounded-lg border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground sm:block"
        aria-label="Fake balance"
      >
        {profile ? (
          formatFakeBalance(profile.balance_cents)
        ) : profileError ? (
          <span className="text-muted-foreground">Balance unavailable</span>
        ) : (
          <span className="text-muted-foreground">Balance unavailable</span>
        )}
      </div>
      <span
        role="status"
        className="rounded-lg border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground sm:hidden"
        aria-label="Fake balance"
      >
        {profile
          ? formatFakeBalance(profile.balance_cents).replace(" fake", "")
          : "—"}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
