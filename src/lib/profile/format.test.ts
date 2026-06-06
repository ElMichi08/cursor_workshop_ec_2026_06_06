import { describe, expect, it } from "vitest";

import { formatFakeBalance } from "@/lib/profile/format";

describe("formatFakeBalance", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeBalance(1000000)).toBe("$10,000.00 fake");
  });

  it("includes the fake suffix", () => {
    expect(formatFakeBalance(1000)).toContain("fake");
  });

  it("formats smaller amounts", () => {
    expect(formatFakeBalance(1000)).toBe("$10.00 fake");
  });
});
