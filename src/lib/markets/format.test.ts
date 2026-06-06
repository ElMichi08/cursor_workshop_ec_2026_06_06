import { describe, expect, it } from "vitest";

import {
  formatCloseDate,
  formatMarketStatus,
  formatYesChance,
} from "@/lib/markets/format";

describe("formatMarketStatus", () => {
  it("formats market statuses", () => {
    expect(formatMarketStatus("open")).toBe("Open");
    expect(formatMarketStatus("closed")).toBe("Closed");
    expect(formatMarketStatus("resolved")).toBe("Resolved");
  });
});

describe("formatCloseDate", () => {
  it("formats close dates", () => {
    expect(formatCloseDate("2026-12-31T18:00:00.000Z")).toMatch(/Dec/);
  });
});

describe("formatYesChance", () => {
  it("formats yes chance as percentage", () => {
    expect(formatYesChance(0.5)).toBe("50%");
    expect(formatYesChance(0.756)).toBe("76%");
  });
});
