import { describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY, themeScript } from "@/lib/theme";

describe("themeScript", () => {
  it("includes storage key and dark class toggle", () => {
    expect(themeScript()).toContain(THEME_STORAGE_KEY);
    expect(themeScript()).toContain("classList.toggle");
    expect(themeScript()).toContain('s==="dark"');
  });
});
