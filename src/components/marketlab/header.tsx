import Link from "next/link";

import { AuthHeaderSection } from "@/components/marketlab/auth-header-section";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/markets"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            MarketLab
          </Link>
          <nav aria-label="Main">
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <AuthHeaderSection />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
