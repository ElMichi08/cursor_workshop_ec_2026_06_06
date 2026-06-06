"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

const cycle: ThemePreference[] = ["light", "dark"];

function applyTheme(preference: ThemePreference) {
  document.documentElement.classList.toggle("dark", preference === "dark");
}

function normalizePreference(stored: string | null): ThemePreference {
  return stored === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("light");

  useEffect(() => {
    const initial = normalizePreference(
      localStorage.getItem(THEME_STORAGE_KEY),
    );
    setPreference(initial);
    applyTheme(initial);
  }, []);

  const Icon = preference === "dark" ? Moon : Sun;
  const label = preference === "dark" ? "Dark theme" : "Light theme";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={`Theme: ${label}. Click to change.`}
      onClick={() => {
        const next = cycle[(cycle.indexOf(preference) + 1) % cycle.length];
        localStorage.setItem(THEME_STORAGE_KEY, next);
        setPreference(next);
        applyTheme(next);
      }}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
